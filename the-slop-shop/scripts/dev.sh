#!/bin/bash

# Kill processes on common development ports
echo "🔪 Killing processes on common dev ports..."
lsof -ti:3000,3001,3002,3003,3004,3005,3006,3007,3008,3009,3010,8000,8080,4000,5000,5173,4173 | xargs kill -9 2>/dev/null || true

# Wait a moment for ports to be released
sleep 1

# Start the dev server directly (not through pnpm dev to avoid infinite loop)
echo "🚀 Starting development server on port 3000..."
pnpm exec next dev

