/**
 * AlphaPulse India - Deduplication & Clustering Engine
 * Merges repetitive articles across financial publications into single high-signal cards
 */

const stockTickers = require('../data/stockTickers.json');

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'shall', 'should', 'may', 'might', 'must', 'can',
  'could', 'about', 'into', 'over', 'after', 'shares', 'stock', 'stocks', 'market',
  'today', 'says', 'said', 'report', 'reports', 'amid', 'here', 'why', 'what', 'key',
  'indian', 'india', 'gain', 'gains', 'trade'
]);

// Strip publication suffixes e.g., " | Mint", " - Moneycontrol", " - The Economic Times"
function cleanHeadline(title) {
  if (!title) return '';
  return title
    .replace(/\s*[-–|]\s*(Moneycontrol|Livemint|Mint|The Economic Times|Economic Times|ET Now|Business Standard|CNBC-TV18|NDTV Profit|Reuters|Bloomberg|Financial Express|Zee Business).*$/i, '')
    .trim();
}

function tokenize(text) {
  if (!text) return new Set();
  const cleaned = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOP_WORDS.has(word));
  return new Set(cleaned);
}

function calculateJaccardSimilarity(setA, setB) {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) {
      intersection++;
    }
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Fast entity extraction helper for deduplication
 */
function extractEntity(text) {
  if (!text) return null;
  const lower = text.toLowerCase();
  
  for (const stock of stockTickers) {
    if (lower.includes(stock.symbol.toLowerCase())) return stock.symbol;
    for (const alias of stock.aliases) {
      if (lower.includes(alias.toLowerCase())) return stock.symbol;
    }
  }
  
  if (lower.includes('rbi') || lower.includes('reserve bank')) return 'RBI';
  if (lower.includes('sebi')) return 'SEBI';
  if (lower.includes('us fda') || lower.includes('fda')) return 'USFDA';
  if (lower.includes('nifty') || lower.includes('sensex')) return 'INDICES';
  if (lower.includes('crude') || lower.includes('brent')) return 'CRUDE';

  return null;
}

/**
 * Deduplicate and cluster news items
 * @param {Array} rawItems 
 * @returns {Array} deduplicated items
 */
function deduplicateNews(rawItems) {
  const clusters = [];

  for (const item of rawItems) {
    const cleanedTitle = cleanHeadline(item.title);
    const itemTitleTokens = tokenize(cleanedTitle);
    const itemTokens = tokenize(cleanedTitle + ' ' + (item.description || ''));
    const entity = extractEntity(cleanedTitle + ' ' + (item.description || ''));
    
    let matchedCluster = null;
    let highestSim = 0;

    for (const cluster of clusters) {
      const titleSim = calculateJaccardSimilarity(itemTitleTokens, cluster.titleTokenSet);
      const combinedSim = calculateJaccardSimilarity(itemTokens, cluster.tokenSet);
      const effectiveSim = Math.max(titleSim, combinedSim * 0.9);

      const sameEntity = entity && cluster.entity && entity === cluster.entity;
      const threshold = sameEntity ? 0.22 : 0.38;

      if (effectiveSim > threshold && effectiveSim > highestSim) {
        highestSim = effectiveSim;
        matchedCluster = cluster;
      }
    }

    if (matchedCluster) {
      // Merge into existing cluster
      matchedCluster.duplicatesCount = (matchedCluster.duplicatesCount || 1) + 1;
      
      // Add source if not already present
      const existingSource = matchedCluster.sources.find(s => s.name.toLowerCase() === (item.sourceName || '').toLowerCase());
      if (!existingSource && item.sourceName) {
        matchedCluster.sources.push({
          name: item.sourceName,
          url: item.link,
          pubDate: item.pubDate
        });
      }

      // If new item title is more descriptive, keep the longer headline
      if (cleanedTitle.length > matchedCluster.title.length && !cleanedTitle.includes('...')) {
        matchedCluster.title = cleanedTitle;
      }

      // Merge tokens
      itemTitleTokens.forEach(t => matchedCluster.titleTokenSet.add(t));
      itemTokens.forEach(t => matchedCluster.tokenSet.add(t));
    } else {
      // Create new cluster
      const newCluster = {
        ...item,
        title: cleanedTitle,
        originalTitle: item.title,
        titleTokenSet: itemTitleTokens,
        tokenSet: itemTokens,
        entity: entity,
        duplicatesCount: 1,
        sources: [
          {
            name: item.sourceName || 'Dalal Street Wire',
            url: item.link,
            pubDate: item.pubDate
          }
        ]
      };
      clusters.push(newCluster);
    }
  }

  // Clean up internal helper sets before returning
  return clusters.map(c => {
    const { titleTokenSet, tokenSet, entity, ...rest } = c;
    return rest;
  });
}

module.exports = {
  cleanHeadline,
  tokenize,
  calculateJaccardSimilarity,
  extractEntity,
  deduplicateNews
};
