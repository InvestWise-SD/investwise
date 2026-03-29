# 🚀 Deployment Guide

This guide covers deploying InvestWise on **completely free** platforms.

## Overview

| Component | Platform | Free Tier |
|-----------|----------|-----------|
| Frontend | Vercel | 100GB bandwidth/month |
| Backend | Render | 750 hours/month |
| Database | Supabase | 500MB, unlimited auth |
| AI | Groq | 30 requests/min |

**Total cost: $0/month** 🎉

---

## 1. Database Setup (Supabase)

### Create Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Choose a name (e.g., `investwise-prod`)
4. Set a strong database password (save this!)
5. Select the closest region
6. Wait for project to initialize (~2 min)

### Run Migrations

1. Go to **SQL Editor** in Supabase dashboard
2. Copy the contents of `docs/database.sql`
3. Paste and click **Run**
4. Verify tables are created in **Table Editor**

### Get API Keys

Go to **Settings → API** and copy:
- `Project URL` → `SUPABASE_URL`
- `anon/public key` → `SUPABASE_KEY`
- `service_role key` → `SUPABASE_SERVICE_KEY`

### Enable Auth

1. Go to **Authentication → Providers**
2. Enable **Email** (enabled by default)
3. Optionally enable Google/GitHub OAuth

---

## 2. AI Provider Setup

### Option A: Groq (Recommended - Free)

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up and go to **API Keys**
3. Create new key → copy it
4. Set `GROQ_API_KEY` in your env
5. Set `AI_PROVIDER=groq`

**Groq Free Tier:**
- 30 requests/minute
- 14,400 requests/day
- Llama 3.1 70B access

### Option B: Anthropic (Paid, but credits available)

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create API key
3. Set `ANTHROPIC_API_KEY`
4. Set `AI_PROVIDER=anthropic`

### Option C: Ollama (100% Free, Self-hosted)

1. Install Ollama: `curl -fsSL https://ollama.com/install.sh | sh`
2. Pull a model: `ollama pull llama3.1`
3. Set `OLLAMA_BASE_URL=http://localhost:11434`
4. Set `AI_PROVIDER=ollama`

---

## 3. Backend Deployment (Render)

### Prepare Repository

Make sure your repo has these files in `backend/`:

**`render.yaml`** (create this):
```yaml
services:
  - type: web
    name: investwise-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
```

### Deploy to Render

1. Go to [render.com](https://render.com) and sign up
2. Click **New → Web Service**
3. Connect your GitHub repo
4. Select the `backend` directory as root
5. Settings:
   - **Name:** `investwise-api`
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Add Environment Variables

In Render dashboard → Environment:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
GROQ_API_KEY=gsk_your_key
AI_PROVIDER=groq
SECRET_KEY=generate-a-random-32-char-string
CORS_ORIGINS=https://your-app.vercel.app
DEBUG=false
```

### Deploy

Click **Deploy** and wait (~5 min first time).

Your API will be at: `https://investwise-api.onrender.com`

> ⚠️ **Note:** Render free tier spins down after 15 min of inactivity. First request after sleep takes ~30 seconds.

---

## 4. Frontend Deployment (Vercel)

### Prepare Environment

Create `frontend/.env.production`:
```
NEXT_PUBLIC_API_URL=https://investwise-api.onrender.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **Import Project**
3. Connect your GitHub repo
4. Set root directory to `frontend`
5. Framework preset: **Next.js**

### Add Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://investwise-api.onrender.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Deploy

Click **Deploy**. Your app will be at: `https://your-app.vercel.app`

---

## 5. Post-Deployment

### Update CORS

Go back to Render and update:
```
CORS_ORIGINS=https://your-actual-app.vercel.app
```

### Test Everything

1. Visit your Vercel URL
2. Sign up with email
3. Try the chat
4. Create a goal
5. Take risk assessment

### Monitor

- **Render:** Dashboard shows logs and metrics
- **Vercel:** Analytics tab for traffic
- **Supabase:** Database and auth dashboards

---

## 6. Custom Domain (Optional)

### Vercel
1. Settings → Domains
2. Add your domain
3. Update DNS as instructed

### Render
1. Settings → Custom Domains
2. Add your API domain (e.g., `api.yourdomain.com`)

---

## Troubleshooting

### "Render is slow on first request"
Normal for free tier. Consider upgrading to Render's $7/mo plan for always-on.

### "Chat not working"
1. Check Render logs for errors
2. Verify AI API key is set
3. Test API directly: `curl https://your-api.onrender.com/health`

### "Auth not working"
1. Check Supabase URL and keys
2. Verify frontend env vars start with `NEXT_PUBLIC_`
3. Check browser console for errors

### "Database errors"
1. Verify RLS policies in Supabase
2. Check service role key permissions
3. Run migrations again if needed

---

## Cost Optimization Tips

1. **Render sleep:** Expected on free tier. Use a cron job to ping every 14 min if needed
2. **Supabase:** 500MB is plenty for thousands of users
3. **Groq:** 14,400 requests/day = ~600 users doing 24 chats/day
4. **Vercel:** 100GB bandwidth handles millions of page views

**When to upgrade:**
- 1,000+ daily active users
- Need custom domain SSL
- Want faster cold starts
- Need more database storage

---

Happy deploying! 🚀
