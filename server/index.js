/**
 * AlphaPulse India - Main Express API Server & Web Platform Host
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const store = require('./services/feedFetcher');
const { getStockVolumeData } = require('./services/volumeChecker');
const stockTickers = require('./data/stockTickers.json');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    platform: 'AlphaPulse India',
    markets: 'NSE / BSE Dalal Street Intelligence',
    currentTime: new Date().toISOString(),
    lastSyncedAt: store.data?.lastSyncedAt,
    lastNightSync: store.data?.lastNightSync,
    lastOpenSync: store.data?.lastOpenSync,
    syncType: store.data?.syncType,
    isFetching: store.isFetching,
    totalStories: store.data?.items?.length || 0
  });
});

app.get('/api/intelligence', async (req, res) => {
  try {
    const force = req.query.force === 'true';
    const sectorFilter = req.query.sector;
    const impactFilter = req.query.impact; // HIGH | MODERATE | LOW
    const surgeOnly = req.query.surge === 'true';
    const query = (req.query.q || '').toLowerCase().trim();

    const data = await store.getIntelligence(force);

    let filteredItems = [...(data.items || [])];

    if (sectorFilter && sectorFilter !== 'ALL') {
      filteredItems = filteredItems.filter(item => item.sector === sectorFilter);
    }

    if (impactFilter && impactFilter !== 'ALL') {
      filteredItems = filteredItems.filter(item => item.impactLevel === impactFilter);
    }

    if (surgeOnly) {
      filteredItems = filteredItems.filter(item => item.volumeCheck?.classification === 'INSTITUTIONAL_SURGE');
    }

    if (query) {
      filteredItems = filteredItems.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(query);
        const stockMatch = item.detectedStock?.name.toLowerCase().includes(query) || item.detectedStock?.symbol.toLowerCase().includes(query);
        const sectorMatch = item.sector.toLowerCase().includes(query);
        const briefMatch = item.executiveBrief?.bullet1.toLowerCase().includes(query) || item.executiveBrief?.bullet2.toLowerCase().includes(query);
        return titleMatch || stockMatch || sectorMatch || briefMatch;
      });
    }

    res.json({
      success: true,
      lastSyncedAt: data.lastSyncedAt,
      lastNightSync: data.lastNightSync,
      lastOpenSync: data.lastOpenSync,
      syncType: data.syncType,
      isFetching: store.isFetching,
      macro: data.macro || [],
      sectors: data.sectors || [],
      totalAvailableStories: data.items?.length || 0,
      totalAllNews: (data.allNews || []).length,
      filteredCount: filteredItems.length,
      items: filteredItems,
      allNews: data.allNews || [],
      globalNews: data.globalNews || [],
      breadth: data.breadth || null,
      calendar: data.calendar || [],
      briefing: data.briefing || null
    });
  } catch (err) {
    console.error('[API] /api/intelligence error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/sync', async (req, res) => {
  try {
    const syncType = req.body?.type || 'MANUAL_SYNC';
    const updated = await store.runSync(syncType);
    res.json({
      success: true,
      message: `Sync complete (${syncType})`,
      lastSyncedAt: updated.lastSyncedAt,
      totalStories: updated.items?.length || 0
    });
  } catch (err) {
    console.error('[API] /api/sync error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/stock/:symbol', async (req, res) => {
  try {
    const sym = req.params.symbol.toUpperCase();
    const stockInfo = stockTickers.find(s => s.symbol === sym || s.nseTicker.includes(sym));
    if (!stockInfo) {
      return res.status(404).json({ success: false, error: `Stock ${sym} not found in coverage universe.` });
    }
    const volumeData = await getStockVolumeData(stockInfo);
    res.json({ success: true, data: volumeData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve frontend in production or if build exists
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));

app.get('*', (req, res) => {
  const indexFile = path.join(clientDist, 'index.html');
  if (require('fs').existsSync(indexFile)) {
    res.sendFile(indexFile);
  } else {
    res.send(`
      <div style="font-family: sans-serif; background: #0B0E14; color: #fff; padding: 40px; text-align: center;">
        <h1 style="color: #F59E0B;">⚡ AlphaPulse India Backend Running</h1>
        <p>API is healthy on port ${PORT}. Client is running on Vite dev server or needs to be built.</p>
        <p><a href="/api/intelligence" style="color: #38BDF8;">View /api/intelligence JSON</a></p>
      </div>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 AlphaPulse India API Server running on port ${PORT}`);
  console.log(`📊 Local API: http://localhost:${PORT}/api/intelligence`);
  console.log(`=======================================================`);
});
