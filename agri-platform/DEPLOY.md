# Deployment Guide

This project contains a React frontend (`frontend/`) and a Flask backend (`backend/`). The repository includes a `render.yaml` manifest for Render.com deployments. Follow the steps below to deploy.

## Required environment variables
- `WEATHER_API_KEY` — OpenWeatherMap API key
- `MARKET_API_KEY` — Market API key
- (Optional) `MONGO_URI` — MongoDB connection string if you connect to a database
- `FLASK_DEBUG` — Set to `true` only for development (default: `false`)

## Render (recommended)
1. Push your repository to GitHub.
2. Create a new Web Service in Render and connect your GitHub repo, or simply enable `render.yaml` based deployments.
3. `render.yaml` defines two services:
   - `krushimitra-backend` — Python web service, uses `gunicorn` to run `backend/app.py`.
   - `krushimitra-frontend` — Node web service, runs `npm run build` then `npm run start` to serve `dist/`.
4. In Render dashboard, set the environment variables listed above for the backend service.

## Manual deploy commands (local verification)

Frontend:
```powershell
cd frontend
npm install
npm run build
#$env:PORT='5173'
$env:PORT='5173'; npm run start
```

Backend:
```powershell
cd backend
py -m pip install -r requirements.txt
#$env:PORT='5000'
$env:PORT='5000'; py app.py
```

## Notes
- Do not commit secrets like `.env`. Use platform environment variables.
- For production, `gunicorn` is used for the Flask backend. For better scaling, consider deploying the frontend to a static host (Vercel/Netlify) and backend as a separate API service.