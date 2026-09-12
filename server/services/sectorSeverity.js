/**
 * AlphaPulse India - Dynamic Sector Severity Ranking Engine
 * Ranks all 9 Core Indian Sectors dynamically by measuring which sector
 * is facing the heaviest "news storm" (based on article count, average impact, and high-impact severity).
 */

const CORE_SECTORS = [
  { id: 'BFSI', name: 'BFSI', fullName: 'Banking & Financial Services', icon: 'Landmark', color: '#3B82F6' },
  { id: 'IT', name: 'IT', fullName: 'Information Technology', icon: 'Cpu', color: '#8B5CF6' },
  { id: 'Auto', name: 'Auto', fullName: 'Automobiles & Ancillaries', icon: 'Car', color: '#F97316' },
  { id: 'Pharma', name: 'Pharma', fullName: 'Healthcare & Drugs', icon: 'Pill', color: '#EC4899' },
  { id: 'Energy', name: 'Energy', fullName: 'Oil, Gas & Power', icon: 'Zap', color: '#EAB308' },
  { id: 'FMCG', name: 'FMCG', fullName: 'Consumer Goods', icon: 'ShoppingBag', color: '#10B981' },
  { id: 'Metals', name: 'Metals', fullName: 'Steel & Mining', icon: 'Layers', color: '#64748B' },
  { id: 'Realty', name: 'Realty', fullName: 'Real Estate & Infrastructure', icon: 'Building2', color: '#06B6D4' },
  { id: 'Macro', name: 'Macro', fullName: 'Economy & Government Policy', icon: 'Globe', color: '#6366F1' }
];

/**
 * Calculate dynamic severity rankings from a list of enriched news items
 * @param {Array} newsItems
 * @returns {Array} 9 ranked sectors sorted from #1 (Eye of the storm) to #9 (Calm)
 */
function calculateSectorSeverity(newsItems) {
  const sectorBuckets = {};
  
  for (const s of CORE_SECTORS) {
    sectorBuckets[s.id] = {
      ...s,
      newsCount: 0,
      totalImpact: 0,
      highImpactCount: 0,
      moderateImpactCount: 0,
      lowImpactCount: 0,
      topHeadline: null,
      highestImpactStory: null
    };
  }

  for (const item of newsItems) {
    const sId = item.sector || 'Macro';
    if (!sectorBuckets[sId]) {
      sectorBuckets[sId] = {
        id: sId,
        name: sId,
        fullName: sId,
        icon: 'Layers',
        color: '#64748B',
        newsCount: 0,
        totalImpact: 0,
        highImpactCount: 0,
        moderateImpactCount: 0,
        lowImpactCount: 0,
        topHeadline: null,
        highestImpactStory: null
      };
    }

    const bucket = sectorBuckets[sId];
    bucket.newsCount++;
    const impact = item.marketImpactScore || 50;
    bucket.totalImpact += impact;

    if (item.impactLevel === 'HIGH' || impact >= 80) {
      bucket.highImpactCount++;
    } else if (item.impactLevel === 'MODERATE' || impact >= 45) {
      bucket.moderateImpactCount++;
    } else {
      bucket.lowImpactCount++;
    }

    if (!bucket.highestImpactStory || impact > bucket.highestImpactStory.marketImpactScore) {
      bucket.highestImpactStory = item;
      bucket.topHeadline = item.title;
    }
  }

  // Calculate severity index for each sector
  const ranked = Object.values(sectorBuckets).map(bucket => {
    const avgImpact = bucket.newsCount > 0 ? bucket.totalImpact / bucket.newsCount : 35;
    
    // Weighted formula:
    // 1. Avg impact weight
    // 2. Volume of news weight
    // 3. Multiplier bonus for high-impact black swan / regulatory events
    const rawSeverity = (avgImpact * 0.5) + (bucket.newsCount * 6) + (bucket.highImpactCount * 18);
    
    // Scale to a clean 0 - 100 index
    const severityScore = Math.min(100, Math.max(10, Math.round(rawSeverity)));

    let stormLevel = 'Calm';
    let stormBadgeColor = 'emerald';
    let stormIcon = 'Leaf';

    if (severityScore >= 75) {
      stormLevel = 'Eye of the Storm 🔥';
      stormBadgeColor = 'rose';
      stormIcon = 'Flame';
    } else if (severityScore >= 52) {
      stormLevel = 'Elevated Turbulence ⚡';
      stormBadgeColor = 'amber';
      stormIcon = 'Zap';
    } else if (severityScore >= 32) {
      stormLevel = 'Moderate News Flow 🌊';
      stormBadgeColor = 'cyan';
      stormIcon = 'Activity';
    } else {
      stormLevel = 'Calm Waters 🍃';
      stormBadgeColor = 'emerald';
      stormIcon = 'Shield';
    }

    return {
      id: bucket.id,
      name: bucket.name,
      fullName: bucket.fullName,
      icon: bucket.icon,
      color: bucket.color,
      newsCount: bucket.newsCount,
      avgImpactScore: Math.round(avgImpact),
      highImpactCount: bucket.highImpactCount,
      severityScore,
      stormLevel,
      stormBadgeColor,
      stormIcon,
      topHeadline: bucket.topHeadline || `No active news storm detected in ${bucket.name}`
    };
  });

  // Sort descending: Rank #1 is the highest severity (hottest news storm)
  ranked.sort((a, b) => b.severityScore - a.severityScore);

  // Assign 1-indexed ranks #1 to #9
  return ranked.map((item, index) => ({
    ...item,
    rank: index + 1
  }));
}

/**
 * Calculate Market Breadth & Bull/Bear Sentiment Ratio across Dalal Street
 */
function calculateMarketBreadth(newsItems = []) {
  if (!newsItems || newsItems.length === 0) {
    return {
      bullishPct: 50,
      bearishPct: 30,
      volatilePct: 20,
      sentimentScore: 20,
      sentimentLabel: 'Mild Bullish Tilt 🟢',
      bullishCount: 0,
      bearishCount: 0,
      volatileCount: 0,
      totalCount: 0,
      accumulationCount: 0,
      distributionCount: 0
    };
  }

  let bullishCount = 0;
  let bearishCount = 0;
  let volatileCount = 0;
  let accumulationCount = 0;
  let distributionCount = 0;

  for (const item of newsItems) {
    if (item.bias === 'Bullish') bullishCount++;
    else if (item.bias === 'Bearish') bearishCount++;
    else volatileCount++;

    if (item.volumeCheck?.classification === 'INSTITUTIONAL_ACCUMULATION') accumulationCount++;
    else if (item.volumeCheck?.classification === 'INSTITUTIONAL_DISTRIBUTION') distributionCount++;
  }

  const total = newsItems.length;
  const bullishPct = Math.round((bullishCount / total) * 100);
  const bearishPct = Math.round((bearishCount / total) * 100);
  const volatilePct = Math.max(0, 100 - bullishPct - bearishPct);
  const sentimentScore = bullishPct - bearishPct;

  let sentimentLabel = 'Neutral / Balanced ⚖️';
  let badgeColor = 'blue';

  if (sentimentScore >= 30) {
    sentimentLabel = 'Strong Bullish Momentum 🟢';
    badgeColor = 'emerald';
  } else if (sentimentScore >= 10) {
    sentimentLabel = 'Mild Bullish Bias 🟢';
    badgeColor = 'emerald';
  } else if (sentimentScore <= -30) {
    sentimentLabel = 'Defensive Bearish Grip 🔴';
    badgeColor = 'rose';
  } else if (sentimentScore <= -10) {
    sentimentLabel = 'Mild Caution / Bearish Bias 🔴';
    badgeColor = 'rose';
  }

  return {
    bullishPct,
    bearishPct,
    volatilePct,
    sentimentScore,
    sentimentLabel,
    badgeColor,
    bullishCount,
    bearishCount,
    volatileCount,
    totalCount: total,
    accumulationCount,
    distributionCount
  };
}

module.exports = {
  CORE_SECTORS,
  calculateSectorSeverity,
  calculateMarketBreadth
};
