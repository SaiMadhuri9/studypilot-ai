# Vercel Deployment Guide

Your StudyPilot AI project is now configured for Vercel deployment with both frontend and backend in a single project.

## Project Structure

```
.
├── frontend/              # Static site (HTML, CSS, JS)
│   ├── index.html
│   ├── script.js
│   └── style.css
├── api/                   # Serverless API functions
│   ├── tasks.js          # Task CRUD operations
│   ├── goals.js          # Get available goals
│   ├── roadmaps.js       # Get roadmap progress
│   └── generate.js       # Generate study plan
├── backend/              # Backend utilities (models, services)
│   ├── models/
│   ├── controllers/
│   ├── services/
│   ├── data/
│   └── config/
├── vercel.json           # Vercel configuration
└── .env.example          # Environment variables template
```

## Environment Variables

Set these in Vercel project settings:

1. **MONGO_URI** - Your MongoDB Atlas connection string
   ```
   mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
   ```

2. **GEMINI_API_KEY** - Your Google Gemini API key
   ```
   AQ.xxxxxxxxxxxxx
   ```

## Deployment Steps

### Option 1: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. When prompted:
   - Set project name
   - Confirm root directory is `.`
   - Skip build command (Vercel will auto-detect)
   - Set `frontend` as output directory when asked

4. Add environment variables in Vercel dashboard:
   - Go to your project settings
   - Add `MONGO_URI` and `GEMINI_API_KEY`
   - Redeploy

### Option 2: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Set project settings:
   - **Root Directory**: `.` (leave default)
   - **Build Command**: Leave empty (auto-detected)
   - **Output Directory**: `frontend`
5. Add environment variables:
   - Click "Environment Variables"
   - Add `MONGO_URI` and `GEMINI_API_KEY`
6. Click "Deploy"

## API Endpoints (After Deployment)

Your frontend will automatically use these endpoints:

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks?id=xxx` - Get task by ID
- `POST /api/tasks` - Create task
- `PUT /api/tasks?id=xxx` - Update task
- `DELETE /api/tasks?id=xxx` - Delete task
- `GET /api/goals` - Get all goals
- `GET /api/roadmaps` - Get roadmap progress
- `POST /api/generate` - Generate study plan

## Important Notes

1. **Database Connection**: The API uses connection pooling to reuse MongoDB connections across serverless function invocations
2. **CORS**: CORS headers are automatically set in `vercel.json`
3. **Cold Starts**: First request may take 2-5 seconds (normal for serverless)
4. **Rate Limiting**: Vercel has built-in rate limiting on hobby plans
5. **File Size**: API handlers are under 1MB limit

## Troubleshooting

### 404 Error on Routes
- Ensure `vercel.json` is in the root directory
- Check that API files are in the `api/` folder
- Verify frontend paths in `script.js` use `/api/` (no domain)

### Database Connection Fails
- Verify `MONGO_URI` in Vercel environment variables
- Check MongoDB IP whitelist includes Vercel IPs
- Test connection locally: `node -e "require('mongoose').connect(process.env.MONGO_URI).then(()=>console.log('OK'))"`

### 500 Error on API
- Check Vercel logs: `vercel logs`
- Ensure environment variables are set
- Verify backend models/services are in `backend/` folder

## Local Development

To test locally before deploying:

```bash
# Install dependencies
npm install
cd backend && npm install
cd ../api && npm install

# Set up .env file
cp .env.example .env
# Edit .env with your actual values

# Run backend server (for testing)
cd backend
npm start

# Or use Vercel CLI locally
npm install -g vercel
vercel dev
```

## Next Steps

1. Push code to GitHub
2. Deploy to Vercel
3. Add environment variables
4. Monitor logs in Vercel dashboard
5. Test API endpoints
6. Update any frontend config if needed
