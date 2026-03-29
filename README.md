# 🚀 InvestWise - AI Investment Education Chatbot

> Making investing accessible, understandable, and personal — for everyone.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://python.org)
[![Next.js 14](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org)

## 🎯 The Problem We Solve

**81.5% of retail investors avoid markets** because:
- Investment platforms emphasize products and jargon over personal goals
- Self-education leaves people feeling under-confident and intimidated
- No personalized guidance that speaks their language

**InvestWise** is an AI-powered chatbot that demystifies investing through:
- 💬 **Jargon-free explanations** - Complex concepts in plain English
- 🎯 **Personalized goal tracking** - Your goals, your timeline
- ⚖️ **Risk assessment** - Understand your comfort level
- 📈 **Progress tracking** - See how far you've come

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         Frontend (Vercel)               │
│         Next.js + React + Tailwind      │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         Backend (Render)                │
│         Python FastAPI                  │
│  ┌─────────┬─────────┬─────────────┐   │
│  │  Chat   │  Goals  │    Risk     │   │
│  │ Handler │ Tracker │  Assessor   │   │
│  └─────────┴─────────┴─────────────┘   │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
┌───────────────┐   ┌───────────────┐
│   Supabase    │   │   AI Layer    │
│  PostgreSQL   │   │ Claude/Groq   │
│  + Auth       │   │ /Ollama       │
└───────────────┘   └───────────────┘
```

## 🆓 100% Free Stack

| Component | Service | Free Tier |
|-----------|---------|-----------|
| Frontend | Vercel | 100GB bandwidth/month |
| Backend | Render | 750 hours/month |
| Database | Supabase | 500MB, 50K requests |
| AI | Groq/Claude Credits | Generous free tier |
| Auth | Supabase Auth | Unlimited users |

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Supabase account (free)
- AI API key (Groq recommended - free)

### 1. Clone & Setup

```bash
git clone https://github.com/yourusername/investwise.git
cd investwise
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Copy environment template
cp .env.example .env
# Edit .env with your credentials
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Copy environment template
cp .env.example .env.local
# Edit .env.local with your credentials
```

### 4. Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL migrations in `docs/database.sql`
3. Copy your API keys to `.env` files

### 5. Run Development

```bash
# Terminal 1: Backend
cd backend
uvicorn app.main:app --reload

# Terminal 2: Frontend
cd frontend
npm run dev
```

Visit `http://localhost:3000` 🎉

## 📁 Project Structure

```
investwise/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entry
│   │   ├── core/
│   │   │   ├── config.py        # Settings & env vars
│   │   │   └── security.py      # Auth helpers
│   │   ├── models/
│   │   │   ├── user.py          # User data models
│   │   │   ├── goal.py          # Financial goals
│   │   │   └── chat.py          # Chat history
│   │   ├── routers/
│   │   │   ├── chat.py          # Chat endpoints
│   │   │   ├── goals.py         # Goal management
│   │   │   └── risk.py          # Risk assessment
│   │   └── services/
│   │       ├── ai_service.py    # AI integration
│   │       ├── jargon.py        # Jargon translator
│   │       └── supabase.py      # Database client
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat/            # Chat interface
│   │   │   ├── Goals/           # Goal tracker
│   │   │   └── Risk/            # Risk quiz
│   │   ├── pages/
│   │   │   ├── index.tsx        # Landing page
│   │   │   └── chat.tsx         # Main chat page
│   │   ├── hooks/
│   │   │   └── useChat.ts       # Chat state management
│   │   └── utils/
│   │       └── api.ts           # API client
│   ├── package.json
│   └── .env.example
│
└── docs/
    ├── database.sql             # Supabase schema
    └── DEPLOYMENT.md            # Deployment guide
```

## 🎨 Features

### 1. Conversational Learning
The AI explains investing concepts without jargon:
- "What's a stock?" → Clear, relatable explanation
- "Should I invest now?" → Personalized guidance based on goals

### 2. Goal-Based Planning
```
🎯 Your Goals
├── Emergency Fund: $10,000 (60% complete)
├── House Down Payment: $50,000 (25% complete)
└── Retirement: On Track ✓
```

### 3. Risk Assessment Quiz
5-minute interactive quiz that determines:
- Your risk tolerance score (1-10)
- Recommended investment approach
- Personalized learning path

### 4. Jargon Translator
Hover over any financial term to see a plain-English explanation.

## 🚢 Deployment

### Backend → Render

1. Connect GitHub repo to Render
2. Set environment variables
3. Deploy with `render.yaml`

### Frontend → Vercel

1. Import repo to Vercel
2. Set environment variables
3. Auto-deploys on push

See `docs/DEPLOYMENT.md` for detailed instructions.

## 🛣️ Roadmap

- [x] Core chat functionality
- [x] Goal tracking
- [x] Risk assessment
- [ ] Learning modules (courses)
- [ ] Portfolio simulator
- [ ] Community features
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md).

## 📄 License

MIT License - see [LICENSE](LICENSE)

---

**Built with ❤️ to make investing less scary**
