/**
 * AlphaPulse India - Intelligence & NLP Enrichment Service
 * Multi-Factor Market Impact Scoring Engine (0 to 100), 2-bullet executive briefs,
 * directional bias (Bullish/Bearish/Volatile), sector classification, and upcoming triggers.
 */

const stockTickers = require('../data/stockTickers.json');

const SECTORS = {
  BFSI: ['bank', 'nbfc', 'rbi', 'repo', 'lending', 'credit', 'npa', 'hdfc', 'icici', 'sbi', 'kotak', 'axis', 'bajaj finance', 'fintech', 'insurance', 'deposit'],
  IT: ['it', 'tech', 'software', 'tcs', 'infosys', 'wipro', 'hcl', 'ai', 'cloud', 'digital', 'saas', 'accenture', 'cybersecurity', 'techm', 'ltim'],
  Auto: ['auto', 'vehicle', 'ev', 'car', 'two-wheeler', 'truck', 'tata motors', 'maruti', 'mahindra', 'bajaj auto', 'hero', 'hyundai', 'jlr', 'sales volume'],
  Pharma: ['pharma', 'drug', 'fda', 'usfda', 'healthcare', 'hospital', 'medicine', 'sun pharma', 'dr reddy', 'cipla', 'clinical', 'api', 'formulation'],
  Energy: ['oil', 'gas', 'crude', 'energy', 'petrol', 'diesel', 'power', 'reliance', 'ongc', 'ntpc', 'powergrid', 'coal', 'renewable', 'solar', 'bpcl', 'ioc'],
  FMCG: ['fmcg', 'consumer', 'retail', 'staples', 'itc', 'hul', 'unilever', 'nestle', 'britannia', 'dabur', 'marico', 'food', 'beverage', 'zomato', 'consumption'],
  Metals: ['steel', 'metal', 'iron', 'mining', 'aluminium', 'copper', 'tata steel', 'jsw', 'hindalco', 'vedanta', 'coal india', 'ore'],
  Realty: ['realty', 'real estate', 'housing', 'property', 'dlf', 'godrej prop', 'lodha', 'infrastructure', 'l&t', 'construction', 'cement', 'ultratech'],
  Macro: ['gdp', 'inflation', 'cpi', 'fiscal', 'deficit', 'budget', 'tax', 'gst', 'rupee', 'forex', 'us fed', 'fii', 'dii', 'economy', 'treasury', 'tariff', 'sebi', 'export', 'import']
};

/**
 * Detect primary stock mentioned in text
 */
function detectStock(text) {
  if (!text) return null;

  for (const item of stockTickers) {
    const symbolRegex = new RegExp(`\\b${item.symbol}\\b`, 'i');
    if (symbolRegex.test(text)) {
      return item;
    }
    for (const alias of item.aliases) {
      if (text.toLowerCase().includes(alias.toLowerCase())) {
        return item;
      }
    }
  }
  return null;
}

/**
 * Classify news story into one of the 9 Core Indian Sectors
 */
function classifySector(text, detectedStock) {
  if (detectedStock && detectedStock.sector) {
    return detectedStock.sector;
  }

  const lower = text.toLowerCase();
  let bestSector = 'Macro';
  let maxMatches = 0;

  for (const [sector, keywords] of Object.entries(SECTORS)) {
    let count = 0;
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        count++;
      }
    }
    if (count > maxMatches) {
      maxMatches = count;
      bestSector = sector;
    }
  }

  return bestSector;
}

/**
 * Multi-Factor Market Impact Scoring Engine (0 to 100) & Next Trigger
 * Dynamically scores stories across:
 * - Regulatory / Policy Severity (SEBI, RBI, FinMin, US FDA, Taxes)
 * - Fundamental Corporate Events (M&A, Demergers, Earnings Beats/Misses, Multi-crore Deals)
 * - Technical & Market Trend Intensity (Index supports, breakouts, all-time highs)
 * - Stock Prominence (Large-cap Nifty 50 vs mid/small cap)
 * - Financial Magnitude (Quantities, % deltas, multi-crore amounts)
 */
function calculateImpactAndTrigger(title, description, detectedStock) {
  const combined = `${title} ${description || ''}`.toLowerCase();
  
  let score = 36; // baseline starting score
  let trigger = 'Corporate disclosures & weekly technical momentum';

  // 1. Regulatory & Government Policy Actions
  if (combined.includes('sebi') && (combined.includes('cas') || combined.includes('derivative') || combined.includes('propose') || combined.includes('curb') || combined.includes('circular') || combined.includes('rule') || combined.includes('framework') || combined.includes('penalty') || combined.includes('ban'))) {
    score += 48;
    trigger = 'SEBI board consultation feedback & final exchange circular';
  } else if (combined.includes('rbi') && (combined.includes('repo') || combined.includes('monetary policy') || combined.includes('rate') || combined.includes('licence') || combined.includes('ceo') || combined.includes('curb') || combined.includes('candidate'))) {
    score += 44;
    trigger = 'RBI governor policy commentary & bank regulatory approval';
  } else if (combined.includes('tax') || combined.includes('gst') || combined.includes('customs') || combined.includes('duty') || combined.includes('safeguard')) {
    score += 32;
    trigger = 'Ministry of Finance gazette notification & sector margin impact';
  } else if (combined.includes('us fda') || combined.includes('fda') || combined.includes('form 483') || combined.includes('oai') || combined.includes('eir') || combined.includes('exclusivity')) {
    score += 42;
    trigger = 'US FDA inspection EIR status & facilities audit clearance';
  }

  // 2. Fundamental Corporate Actions & M&A
  if (combined.includes('demerger') || combined.includes('merger') || combined.includes('acquisition') || combined.includes('takeover') || combined.includes('buyout') || combined.includes('nclt')) {
    score += 40;
    trigger = 'NCLT record date & separate listing timeline';
  } else if (combined.includes('order win') || combined.includes('bags contract') || combined.includes('secures order') || combined.includes('pact') || combined.includes('deal worth') || combined.includes('billion') || combined.includes('million') || combined.includes('crore')) {
    score += 26;
    trigger = 'Execution schedule & revenue recognition over next quarters';
  } else if (combined.includes('profit') || combined.includes('results') || combined.includes('earnings') || combined.includes('revenue') || combined.includes('q1') || combined.includes('q2') || combined.includes('q3') || combined.includes('q4') || combined.includes('pat') || combined.includes('margin')) {
    score += 28;
    trigger = 'Post-earnings investor concall and guidance revisions';
  } else if (combined.includes('block deal') || combined.includes('bulk deal') || combined.includes('promoter stake') || combined.includes('stake sale') || combined.includes('fund')) {
    score += 24;
    trigger = 'Exchange bulk deal filings & secondary liquidity absorption';
  }

  // 3. Technical & Market Moving Trends
  if (combined.includes('crucial support') || combined.includes('breakout') || combined.includes('crash') || combined.includes('all-time high') || combined.includes('record high') || combined.includes('slipped below') || combined.includes('bulls') || combined.includes('f&o')) {
    score += 22;
    trigger = 'Weekly derivatives expiry & key pivot support levels';
  } else if (combined.includes('rally') || combined.includes('soar') || combined.includes('surge') || combined.includes('plunge') || combined.includes('tumble') || combined.includes('slump')) {
    score += 18;
    trigger = 'Technical moving averages & intraday volume confirmation';
  }

  // 4. Large-cap Bellwether Prominence Bonus
  if (detectedStock) {
    score += 8;
  }

  // 5. Quantitative Magnitude Bonus
  if (/\b\d+%\b/.test(combined) || /₹?\d+[\s,]*(cr|crore|billion)/i.test(combined) || /\$\d+/i.test(combined)) {
    score += 7;
  }

  // Deterministic title hash variance (+/- 4) to eliminate identical numbers on similar titles
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = (hash << 5) - hash + title.charCodeAt(i);
  }
  const variance = (Math.abs(hash) % 9) - 4;
  score += variance;

  // Clamp within bounds (18 - 98)
  score = Math.max(18, Math.min(98, Math.round(score)));

  let level = 'LOW';
  if (score >= 80) {
    level = 'HIGH';
  } else if (score >= 45) {
    level = 'MODERATE';
  }

  return {
    score,
    level, // 'HIGH' | 'MODERATE' | 'LOW'
    trigger
  };
}

/**
 * Calculate directional market bias
 */
function determineBias(text) {
  const lower = text.toLowerCase();
  
  const bullishWords = ['surge', 'jump', 'gain', 'rally', 'boom', 'record high', 'upbeat', 'beat', 'growth', 'soar', 'upgrade', 'inflow', 'profit rises', 'order win', 'boost', 'green light', 'approval', 'nod'];
  const bearishWords = ['fall', 'drop', 'slump', 'plunge', 'decline', 'loss', 'miss', 'ban', 'penalty', 'warning', 'inflation spikes', 'outflow', 'downward', 'caution', 'crash', 'curb', 'weak'];
  
  let bullCount = bullishWords.filter(w => lower.includes(w)).length;
  let bearCount = bearishWords.filter(w => lower.includes(w)).length;

  if (bullCount > bearCount) return 'Bullish';
  if (bearCount > bullCount) return 'Bearish';
  return 'Volatile';
}

/**
 * Generate 2-Bullet Executive Brief:
 * Bullet 1 (The Event): Crisp factual summary of what happened.
 * Bullet 2 (Market Implication): Why Dalal Street and investors should care.
 */
function generateExecutiveBrief(title, description, sector, detectedStock, bias) {
  let eventBullet = '';
  let implicationBullet = '';

  let cleanDesc = (description || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();

  const sentences = cleanDesc.split(/(?<=[.?!])\s+/).filter(s => s.length > 25);
  
  if (sentences.length > 0 && !sentences[0].toLowerCase().includes('click here') && !sentences[0].toLowerCase().includes('read on')) {
    eventBullet = sentences[0];
  } else {
    eventBullet = `${title}. Key market participants are closely assessing the impact.`;
  }

  if (eventBullet.length > 180) {
    eventBullet = eventBullet.substring(0, 175) + '...';
  }

  const stockName = detectedStock ? detectedStock.name : sector;
  if (bias === 'Bullish') {
    implicationBullet = `Expected to provide near-term valuation support for ${stockName}, expanding trading multiples and attracting institutional accumulation.`;
  } else if (bias === 'Bearish') {
    implicationBullet = `May trigger profit booking and heightened volatility for ${stockName}, testing key moving averages as risk premiums expand.`;
  } else {
    implicationBullet = `Creates two-way price action across ${sector}; investors will watch upcoming management commentary to gauge fundamental impact.`;
  }

  return {
    bullet1: eventBullet,
    bullet2: implicationBullet
  };
}

/**
 * Enrich raw news items with full financial intelligence
 */
function enrichNewsItem(item) {
  const combinedText = `${item.title} ${item.description || ''} ${item.contentSnippet || ''}`;
  const detectedStock = detectStock(combinedText);
  const sector = classifySector(combinedText, detectedStock);
  const { score, level, trigger } = calculateImpactAndTrigger(item.title, item.description, detectedStock);
  const bias = determineBias(combinedText);
  const { bullet1, bullet2 } = generateExecutiveBrief(item.title, item.description, sector, detectedStock, bias);

  return {
    ...item,
    sector,
    detectedStock: detectedStock ? {
      symbol: detectedStock.symbol,
      nseTicker: detectedStock.nseTicker,
      name: detectedStock.name,
      benchmark20dAvgVol: detectedStock.benchmark20dAvgVol
    } : null,
    marketImpactScore: score,
    impactLevel: level, // 'HIGH' | 'MODERATE' | 'LOW'
    bias,               // 'Bullish' | 'Bearish' | 'Volatile'
    triggerToWatch: trigger,
    executiveBrief: {
      bullet1, // The Event
      bullet2  // Market Implication
    }
  };
}

module.exports = {
  detectStock,
  classifySector,
  calculateImpactAndTrigger,
  determineBias,
  generateExecutiveBrief,
  enrichNewsItem
};
