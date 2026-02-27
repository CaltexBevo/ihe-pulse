#!/bin/bash
# Run this BEFORE launching the agent team
# Copies new prototype HTML files to the project Prototypes folder

PROTO_DIR="/Volumes/Bevo_2TB/ihe-pulse/Prototypes"

echo "📁 Copying new prototype files to $PROTO_DIR..."

# Copy each new prototype (these are from yesterday's design session)
# You may need to adjust paths based on where Claude saved them
# Check ~/Downloads or the Claude outputs folder

# If the files are still in Claude's outputs, copy from there:
# cp ~/path-to/homepage-redesign.html "$PROTO_DIR/homepage-redesign.html"
# cp ~/path-to/innovation-pulse-revised.html "$PROTO_DIR/innovation-pulse-revised.html"
# cp ~/path-to/story-page-mockup.html "$PROTO_DIR/story-page-mockup.html"
# cp ~/path-to/podcast-page.html "$PROTO_DIR/podcast-page.html"
# cp ~/path-to/prompts-page.html "$PROTO_DIR/prompts-page.html"
# cp ~/path-to/tinkerlab-page.html "$PROTO_DIR/tinkerlab-page.html"

echo "✅ Done. Prototypes ready for the Page Builder teammate."
echo ""
echo "📂 Contents of Prototypes folder:"
ls -la "$PROTO_DIR"
