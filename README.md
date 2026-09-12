# AlphaPulse India ⚡
> Intelligent Indian Stock Market News Intelligence, Deduplication & Smart Money Terminal for NSE / BSE Dalal Street.

![AlphaPulse India](https://img.shields.io/badge/AlphaPulse-India-amber?style=for-the-badge)
![NSE BSE Intelligence](https://img.shields.io/badge/Market-NSE%20%2F%20BSE-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Live-emerald?style=for-the-badge)

---

## 🎯 The Vision & Problem
Financial portals like Moneycontrol, Economic Times, and Livemint publish hundreds of repetitive articles every day. Retail investors and traders get overwhelmed and cannot tell what actually matters. 

**AlphaPulse India** acts as an intelligent market filter:
1. **Pulls Financial Feeds with Dual-Phase Scheduling**: Automated Nightly EOD wrap-up at 23:30 IST + instant refresh when the user opens the platform.
2. **Merges Duplicates**: Intelligently clusters identical stories reported across different publications into a single executive card with multi-source attribution.
3. **2-Bullet Executive Brief**: Summarizes every story into **The Event** (factual core) and **Market Implication** (impact on Dalal Street & valuations).
4. **Market Impact Score (0 to 100)**: Ranks stories into High (80–100), Moderate (45–79), and Low (0–44) impact.
5. **Volume Reality Check (Smart Money Check)**: Compares today's trading volume against the stock's 20-day average volume (20-DMA) to confirm if institutions (FIIs/DIIs) are buying or if it is low-volume retail noise.
6. **Dynamic Sector Severity Ranking**: Evaluates news storm heat across the 9 core Indian sectors to rank which sector is in the eye of the storm (#1 to #9).
7. **"What's Driving Dalal Street"**: A prominent top bar synthesizing the top 3 global and domestic macro drivers (Crude Oil, US 10Y Yield & Rupee, FII vs DII institutional balance).

---

## 🚀 Quick Start

### 1. Start the Platform
To launch the fullstack application (Backend APIs + Web Terminal UI):
```bash
npm start
```
Or:
```bash
node server/index.js
```

### 2. Access in Browser
Open:
```
http://localhost:5000
```

---

## 🏗️ Architecture & Features

### 1. Dual-Phase Fetching Architecture
- **Nightly Sync (`node-cron`)**: Automatically runs every night at 23:30 IST (11:30 PM), downloading end-of-day market wrap-ups, corporate earnings, and regulatory disclosures into persistent storage (`server/data/intelligence_db.json`).
- **Open-Time Sync**: When you open or refresh the browser, the frontend immediately loads the persisted snapshot with zero delay, while checking for fresh intraday market updates in the background.
- **Manual "Sync Now" Trigger**: Allows on-demand refresh anytime from the top bar.

### 2. "What's Driving Dalal Street" (Macro Catalyst Bar)
Synthesizes the top 3 macro forces:
- **Brent Crude Oil**: Current price and impact on Indian oil marketing companies (OMCs), inflation, and the current account deficit.
- **US 10-Year Bond Yield & USD/INR**: Evaluates sovereign bond yield spreads and rupee stability.
- **FII vs DII Institutional Balance**: Displays net buying/selling figures and domestic cushion absorption.

### 3. Executive News Cards
Every news card features:
- **Publisher Badge, Timestamp & Deduplication Counter**: Shows primary source with authentic outbound link (`Read on [Source] ↗`) and indicates how many sources were merged.
- **2-Bullet Executive Brief**:
  - 📌 **The Event**: Core factual summary.
  - 🎯 **Market Implication**: What Dalal Street traders/investors care about.
- **Market Impact Score (0 to 100)**: Visual color-coded gauge (High: 80–100, Moderate: 45–79, Low: 0–44).
- **Volume Reality Check (Smart Money Check)**:
  - Detects mentioned NSE stock ticker (e.g., `TATAMOTORS`, `SUNPHARMA`, `RELIANCE`, `HDFCBANK`).
  - Measures volume multiple against 20-day average:
    - 🔥 **Institutional Surge**: $\ge 1.8\times$ 20-DMA (Institutional capital confirms the move).
    - ⚖️ **Normal Activity**: $0.8\times - 1.8\times$ (Balanced market participation).
    - ⚠️ **Retail Noise / Low Volume**: $< 0.8\times$ (Move lacks big-fund backing).
  - "Inspect" button opens an in-depth volume and institutional participation breakdown modal.
- **Where the Market Heads Next**:
  - Directional bias (`BULLISH ▲`, `BEARISH ▼`, `VOLATILE ↔`).
  - Next key trigger to watch (e.g. RBI MPC commentary, post-earnings concall, US FDA EIR).

### 4. 9 Core Indian Sectors & Dynamic Severity Ranking
Covers the 9 foundational sectors of the Indian economy:
1. **BFSI** (Banking & Financial Services)
2. **IT** (Information Technology)
3. **Auto** (Automobiles & Ancillaries)
4. **Pharma** (Healthcare & Drugs)
5. **Energy** (Oil, Gas & Power)
6. **FMCG** (Consumer Goods)
7. **Metals** (Steel & Mining)
8. **Realty** (Real Estate & Infrastructure)
9. **Macro** (Economy & Government Policy)

**Dynamic Severity Formula**:
$$\text{Severity Index} = (\text{Avg Impact Score} \times 0.5) + (\text{News Count} \times 6) + (\text{High Impact Stories} \times 18)$$
Sectors facing the biggest "news storm" are automatically ranked at #1 down to #9. Clicking any sector pill filters the news feed instantly.

---

## 📡 API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/status` | GET | Check health, last nightly sync, last open sync, story count |
| `/api/intelligence` | GET | Retrieve macro catalysts, ranked sectors, and deduplicated news cards. Supports `?sector=BFSI`, `?impact=HIGH`, `?surge=true`, `?q=Tata` |
| `/api/sync` | POST | Trigger fresh synchronization from live feeds |
| `/api/stock/:symbol` | GET | Retrieve live quote, volume ratio, and institutional volume verdict for any NSE stock |

---

## 🛠️ Tech Stack
- **Backend**: Node.js, Express, RSS-Parser, Node-Cron, Axios
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons
- **Theme**: Bloomberg / TradingView obsidian fintech terminal (`#080B11`)
