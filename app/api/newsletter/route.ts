import { NextRequest, NextResponse } from 'next/server';

// Mailchimp API integration
// Set these environment variables:
// - MAILCHIMP_API_KEY: Your Mailchimp API key (from Account > API keys)
// - MAILCHIMP_AUDIENCE_ID: Your list/audience ID (from Audience > Settings > Audience name and defaults)
// - MAILCHIMP_SERVER_PREFIX: The server prefix from your API key (e.g., "us21")

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const API_KEY = process.env.MAILCHIMP_API_KEY;
    const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
    const SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;

    // If Mailchimp is not configured, accept the submission gracefully
    if (!API_KEY || !AUDIENCE_ID || !SERVER_PREFIX) {
      console.log('Newsletter signup (Mailchimp not configured):', email);
      return NextResponse.json({
        success: true,
        message: 'Thank you for subscribing!',
      });
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
        status: 'pending', // Double opt-in
        tags: ['Innovation Pulse', 'Website Signup'],
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
      { error: 'Unable to subscribe. Please try again later.' },
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
