# 📰 NewsRadar

A real-time news aggregator built with **Next.js 14**, demonstrating production-grade patterns including SSR, API Routes, ISR, dynamic routing, and client-side data fetching.

**Live demo:** *(Deploy to Vercel — link goes here)*

---

## ✨ Features

- **Top Headlines** by category (Technology, Business, Sports, Health, Science, Entertainment)
- **Full-text Search** with pagination and sort controls
- **Source Explorer** — browse and filter 100+ news sources
- **Per-source pages** — dynamic routes for each publisher
- Responsive design, mobile-friendly

---

## 🛠 Tech Stack & Next.js Concepts Demonstrated

| Concept | Where it's used |
|---|---|
| `getServerSideProps` (SSR) | Home page — fresh data on every request |
| `getStaticProps` + `revalidate` (ISR) | Sources page — cached, rebuilds hourly |
| **API Routes** | `/api/headlines`, `/api/search`, `/api/sources` |
| **Dynamic Routing** | `/news/[sourceId]` — one page, many URLs |
| **Client-side fetching** | Search page — `useEffect` + `fetch` |
| `next/router` | Category switching, search navigation |
| `next/link` | Prefetching, SPA navigation |
| `next/head` | Per-page SEO metadata |
| **Environment variables** | API key secured server-side, never exposed |
| **Error handling** | Graceful error states on every page |

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/newsradar.git
cd newsradar
npm install
```

### 2. Get a free GNews API key

Sign up at [gnews.io](https://gnews.io) — it's free and takes 30 seconds.

### 3. Set up your environment

```bash
cp .env.local.example .env.local
# Edit .env.local and paste your API key
```

```env
GNEWS_API_KEY=your_key_here
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
newsradar/
├── pages/
│   ├── index.js          # Home — SSR with getServerSideProps
│   ├── search.js         # Search — client-side fetching
│   ├── sources.js        # Sources explorer — ISR with getStaticProps
│   ├── 404.js            # Custom 404 page
│   ├── news/
│   │   └── [sourceId].js # Dynamic route — SSR per source
│   └── api/
│       ├── headlines.js  # API Route — top headlines proxy
│       ├── search.js     # API Route — search proxy
│       └── sources.js    # API Route — sources proxy
├── components/
│   ├── Layout.js         # Shared layout with Navbar + Footer
│   ├── Navbar.js         # Navigation with search
│   ├── ArticleCard.js    # Article card (normal + featured variant)
│   ├── CategoryBar.js    # Category filter pills
│   └── ErrorMessage.js   # Error state component
├── lib/
│   └── newsApi.js        # Data fetching utilities & formatters
└── styles/
    └── globals.css       # Global styles
```

---

## 🌐 Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Add `GNEWS_API_KEY` in your Vercel project's **Environment Variables** settings.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/newsradar)

---

## 📖 Key Architecture Decisions

### Why API Routes as a proxy?
The GNews API key must never be exposed to the browser. API Routes run on the server, so the key stays secure. The browser only calls `/api/headlines` — our own endpoint.

### SSR vs ISR vs Client-side — when to use each?
- **SSR** (`getServerSideProps`): Headlines change every minute → always fresh.
- **ISR** (`getStaticProps` + `revalidate`): Source list changes rarely → cache it, fast loads.
- **Client-side** (`useEffect` + `fetch`): Search depends on user input → can't pre-render.

---

## 📝 License

MIT
