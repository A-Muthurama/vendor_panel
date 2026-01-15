#!/bin/bash

echo "🚀 Deploying Vendor Panel Fixes..."
echo ""

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📝 Changes made:"
echo "  ✅ Fixed database connection double-release bug"
echo "  ✅ Updated CORS to allow Vercel frontend"
echo "  ✅ Created .env.production for automatic production builds"
echo ""

echo "📦 Committing changes..."
git add .
git commit -m "Fix: Resolve database connection and CORS issues for deployment

- Fixed double-release bug in signup controller
- Updated CORS to allow Vercel frontend (vendor-panel-ashen.vercel.app)
- Created .env.production for production builds
- Updated API URL configuration"

echo ""
echo "🔄 Pushing to repository..."
git push

echo ""
echo "✅ Changes pushed successfully!"
echo ""
echo "📋 Next steps:"
echo "  1. Verify Render auto-deploys the backend"
echo "  2. Verify Vercel auto-deploys the frontend"
echo "  3. (Optional) Add FRONTEND_URL env var in Render dashboard"
echo "  4. Test signup and login on deployed app"
echo ""
echo "🔗 Your deployed URLs:"
echo "  Backend:  https://vendor-panel-zdeu.onrender.com"
echo "  Frontend: https://vendor-panel-ashen.vercel.app"
echo ""
