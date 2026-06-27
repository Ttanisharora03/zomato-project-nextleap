# Zomato AI Project - Deployment Plan

This document outlines the end-to-end strategy for deploying the Zomato AI project to production, utilizing **Railway** for the Python/FastAPI backend and **Vercel** for the Next.js frontend.

---

## Architecture Overview

```
+-------------------+       HTTP Requests       +--------------------+
|  Vercel Frontend  | ------------------------> |  Railway Backend   |
|   (Next.js App)   | <------------------------ | (FastAPI & Python) |
+-------------------+      JSON Responses       +--------------------+
```

- **Frontend (Vercel)**: Hosts the Next.js React application. Communicates with the backend via REST API calls using `NEXT_PUBLIC_API_URL`.
- **Backend (Railway)**: Hosts the FastAPI server, manages dataset loading, and executes LangChain/Groq LLM queries.

---

## ⚠️ Pre-Deployment Code Adjustments

Before initiating deployment on the cloud platforms, make the following adjustment in your codebase and push to GitHub:

### 1. Configure CORS for Production in `backend/main.py`
Currently, `backend/main.py` only allows requests from `http://localhost:3000`. Once deployed, your Vercel app will have a custom domain (e.g., `https://zomato-ai.vercel.app`). 

Update `backend/main.py` to allow all origins (or specifically your Vercel production URL):

```python
app.add_middleware(
    CORSMiddleware,
    # For initial testing, allow all origins ("*"). 
    # For strict production security, replace with your exact Vercel domain later.
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
*Commit and push this change to your GitHub repository (`main` branch).*

---

## Phase 1: Backend Deployment on Railway

Railway provides seamless deployment for Python applications directly from GitHub.

### Step 1: Create Railway Project
1. Log in to [Railway.app](https://railway.app/).
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select your repository: `Ttanisharora03/zomato-project-nextleap`.

### Step 2: Configure Service Settings
Since this repository is a monorepo containing both `backend` and `frontend`, configure Railway to build and run the backend properly:

1. Go to your newly created Railway service -> **Settings** tab.
2. **Root Directory**: Leave as root `/` (so Python can resolve `backend.api...` import paths correctly).
3. **Build Settings**: 
   - Ensure Railway detects Python. If Railway's Nixpacks builder looks for `requirements.txt` at the root, you can either create a symlink/copy of `requirements.txt` in the root directory, or specify the install command in Railway settings: `pip install -r backend/requirements.txt`.
4. **Start Command**: Set the start command explicitly under the *Deploy* section in Settings:
   ```bash
   uvicorn backend.main:app --host 0.0.0.0 --port $PORT
   ```

### Step 3: Configure Environment Variables
Go to the **Variables** tab in your Railway service and add:
- `GROQ_API_KEY`: Your Groq API key (from your `.env` file).
- `PORT`: `8000` (Railway automatically assigns a `$PORT` variable, but setting a fallback or letting Railway manage it works perfectly).

### Step 4: Generate Public Domain
1. Go to the **Settings** tab -> **Networking** section.
2. Click **Generate Domain** (e.g., `zomato-project-nextleap-production.up.railway.app`).
3. **Copy this URL**. You will need it for the Vercel frontend setup.
4. Verify deployment by opening `https://<your-railway-domain>/` in your browser. You should see: `{"message": "Zomato Recommendations API is running"}`.

---

## Phase 2: Frontend Deployment on Vercel

Vercel provides native, zero-config support for Next.js applications.

### Step 1: Import Project in Vercel
1. Log in to [Vercel.com](https://vercel.com/).
2. Click **Add New** -> **Project**.
3. Import your GitHub repository: `Ttanisharora03/zomato-project-nextleap`.

### Step 2: Configure Monorepo Settings
In the project configuration screen before clicking Deploy:
1. **Project Name**: `zomato-ai-frontend` (or your preferred name).
2. **Framework Preset**: Next.js.
3. **Root Directory**: Click **Edit** and select `frontend`. Vercel will automatically scope all build commands (`npm run build`) to this folder.

### Step 3: Configure Environment Variables
In the **Environment Variables** section, add:
- **Key**: `NEXT_PUBLIC_API_URL`
- **Value**: `https://<your-railway-domain>/api` *(Replace with the domain generated in Railway Phase 1. Make sure not to include a trailing slash after `/api`)*.

### Step 4: Deploy
1. Click **Deploy**.
2. Vercel will install dependencies, build the Next.js production bundle, and assign a live URL (e.g., `https://zomato-ai-frontend.vercel.app`).

---

## Post-Deployment Verification & Troubleshooting

### 1. Verification Checklist
- [ ] **Backend Health Check**: Visit `https://<your-railway-domain>/` to ensure the API is live.
- [ ] **Frontend Loading**: Visit your Vercel URL. Ensure the UI renders correctly without build errors.
- [ ] **End-to-End Flow**: Submit a recommendation request on the frontend and verify that the results are fetched successfully from the Railway backend.

### 2. Common Troubleshooting Scenarios

| Symptom | Probable Cause | Resolution |
| :--- | :--- | :--- |
| **CORS Error in Browser Console** | `backend/main.py` has restrictive `allow_origins`. | Ensure `allow_origins=["*"]` is deployed on Railway, or add your exact Vercel URL to the list. |
| **Railway Build Fails (Missing Modules)** | Railway builder cannot find `requirements.txt`. | Add a `requirements.txt` file at the root of the repository containing `-r backend/requirements.txt` or copy the contents over. |
| **500 Internal Server Error on API Call** | Missing `GROQ_API_KEY` on Railway. | Verify that `GROQ_API_KEY` is added in the Railway Variables tab and redeploy. |
| **Frontend Network Error / 404** | Incorrect `NEXT_PUBLIC_API_URL` on Vercel. | Verify Vercel environment variables point to `https://<railway-domain>/api` (check for typos or missing `/api`). |
