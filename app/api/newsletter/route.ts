import { NextRequest, NextResponse } from 'next/server';

// Mailchimp API integration
// Set these environment variables:
// - MAILCHIMP_API_KEY: Your Mailchimp API key (from Account > API keys)
// - MAILCHIMP_AUDIENCE_ID: Your list/audience ID (from Audience > Settings > Audience name and defaults)
// - MAILCHIMP_SERVER_PREFIX: The server prefix from your API key (e.g., "us21")

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName, _gotcha } = await request.json();

    // Honeypot check - if filled, it's a bot
    if (_gotcha) {
      // Return success to not tip off bots, but don't process
      return NextResponse.json({
        success: true,
        message: 'Thank you for subscribing!',
      });
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Require first and last name — spam bots skip these or fill garbage
    if (!firstName || !lastName || firstName.trim().length < 2 || lastName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please provide your first and last name.' },
        { status: 400 }
      );
    }

    // Basic name validation — reject obvious bot spam (no letters = not a name)
    const namePattern = /[a-zA-Z]/;
    if (!namePattern.test(firstName) || !namePattern.test(lastName)) {
      return NextResponse.json(
        { error: 'Please provide a valid name.' },
        { status: 400 }
      );
    }

    const API_KEY = process.env.MAILCHIMP_API_KEY;
    const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
    const SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;

    // If Mailchimp is not configured, return error - don't silently drop emails
    if (!API_KEY || !AUDIENCE_ID || !SERVER_PREFIX) {
      console.error('Newsletter signup failed: Mailchimp not configured. Email:', email);
      return NextResponse.json(
        { error: 'Newsletter service is temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    const url = `https://${SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `apikey ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        status: 'pending', // Double opt-in: subscriber must confirm via email
        tags: ['Innovation Pulse', 'Website Signup'],
        merge_fields: {
          FNAME: firstName.trim(),
          LNAME: lastName.trim(),
        },
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Check your inbox to confirm your subscription!',
      });
    }

    // Handle Mailchimp errors
    if (data.title === 'Member Exists') {
      return NextResponse.json({
        success: true,
        message: 'You\'re already subscribed!',
      });
    }

    if (data.title === 'Invalid Resource') {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    console.error('Mailchimp error:', data);
    return NextResponse.json(
      { error: data.detail || data.title || 'Unable to subscribe. Please try again later.' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
