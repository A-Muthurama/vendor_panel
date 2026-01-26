#!/bin/bash

echo "🚀 Deploying Fix for Slow Login/Signup Issue"
echo ""
echo "📝 Changes:"
echo "  ✅ Created .env.production with backend API URL"
echo "  ✅ Created DEPLOYMENT_FIX.md with detailed instructions"
echo ""

# Add files
git add frontend/.env.production DEPLOYMENT_FIX.md

# Commit
git commit -m "Fix: Add production environment config for Vercel deployment

- Added .env.production with REACT_APP_API_URL
- Created DEPLOYMENT_FIX.md with troubleshooting guide
- This fixes the timeout issue on login/signup after deployment"

# Push
echo ""
echo "🔄 Pushing to repository..."
git push

echo ""
echo "✅ Changes pushed successfully!"
echo ""
echo "📋 Next Steps:"
echo "  1. ⏳ Wait 2-3 minutes for Vercel to auto-deploy"
echo "  2. 🧪 Test login/signup on: https://vendor-panel-ashen.vercel.app"
echo "  3. 📖 Read DEPLOYMENT_FIX.md for detailed troubleshooting"
echo ""
echo "💡 IMPORTANT: If still not working, you MUST add REACT_APP_API_URL"
echo "   in Vercel dashboard (see DEPLOYMENT_FIX.md for instructions)"
echo ""
