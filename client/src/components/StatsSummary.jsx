import React from 'react';
import { Flame, Sparkles, Layers, Activity, TrendingUp, TrendingDown, Scale } from 'lucide-react';

export default function StatsSummary({ items = [], sectors = [], breadth = null }) {
  const highImpactCount = items.filter(i => i.impactLevel === 'HIGH' || i.marketImpactScore >= 80).length;
  const smartMoneyCount = items.filter(i => 
    i.volumeCheck?.classification?.startsWith('INSTITUTIONAL_') || 
    i.volumeCheck?.classification === 'INSTITUTIONAL_SURGE'
  ).length;
  const topStormSector = sectors.length > 0 ? sectors[0] : null;

  // Market Breadth metrics
  const b = breadth || {
    bullishPct: 50,
    bearishPct: 30,
    volatilePct: 20,
    sentimentScore: 20,
    sentimentLabel: 'Mild Bullish Tilt 🟢',
    accumulationCount: 0,
    distributionCount: 0
  };

  const isNetBullish = (b.sentimentScore || 0) >= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-4 pb-2 space-y-3">
      {/* Row 1: Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Intelligence Cards */}
        <div className="bg-[#0F1422] border border-slate-800/80 rounded-xl p-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-bold font-mono text-white">{items.length}</div>
            <div className="text-[11px] text-slate-400">Deduplicated Stories</div>
          </div>
        </div>

        {/* High Impact Alert */}
        <div className="bg-[#0F1422] border border-slate-800/80 rounded-xl p-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-bold font-mono text-rose-400">{highImpactCount}</div>
            <div className="text-[11px] text-slate-400">High Market Impact (&gt;80)</div>
          </div>
        </div>

        {/* Sector in the Eye of the Storm */}
        <div className="bg-[#0F1422] border border-slate-800/80 rounded-xl p-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <Layers className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <div className="text-lg font-bold font-mono text-amber-400 truncate">
              {topStormSector ? `#1 ${topStormSector.name}` : 'Evaluating'}
            </div>
            <div className="text-[11px] text-slate-400 truncate">Sector Eye of Storm</div>
          </div>
        </div>

        {/* Institutional Smart Money */}
        <div className="bg-[#0F1422] border border-slate-800/80 rounded-xl p-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-bold font-mono text-emerald-400">{smartMoneyCount}</div>
            <div className="text-[11px] text-slate-400">Smart Money Surges</div>
          </div>
        </div>
      </div>

      {/* Row 2: Feature G - Market Breadth & Sentiment Meter */}
      <div className="bg-[#0F1422] border border-slate-800/80 rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Sentiment label & score */}
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isNetBullish ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'}`}>
            {isNetBullish ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 uppercase font-mono tracking-wider">Dalal Street Breadth</span>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${isNetBullish ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'}`}>
                {b.sentimentLabel} ({b.sentimentScore > 0 ? `+${b.sentimentScore}` : b.sentimentScore})
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
              <span>{b.bullishCount || 0} Bullish</span>
              <span>•</span>
              <span>{b.bearishCount || 0} Bearish</span>
              <span>•</span>
              <span>{b.volatileCount || 0} Volatile / Neutral</span>
            </div>
          </div>
        </div>

        {/* Center: Visual Progress Bar */}
        <div className="flex-1 max-w-md mx-2">
          <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span className="text-emerald-400 font-bold">{b.bullishPct}% Bull</span>
            <span className="text-amber-400 font-bold">{b.volatilePct}% Neutral</span>
            <span className="text-rose-400 font-bold">{b.bearishPct}% Bear</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
            <div 
              style={{ width: `${b.bullishPct}%` }} 
              className="h-full bg-emerald-500 transition-all duration-500" 
              title={`Bullish: ${b.bullishPct}%`}
            />
            <div 
              style={{ width: `${b.volatilePct}%` }} 
              className="h-full bg-amber-500 transition-all duration-500" 
              title={`Neutral/Volatile: ${b.volatilePct}%`}
            />
            <div 
              style={{ width: `${b.bearishPct}%` }} 
              className="h-full bg-rose-500 transition-all duration-500" 
              title={`Bearish: ${b.bearishPct}%`}
            />
          </div>
        </div>

        {/* Right: Accumulation vs Distribution Count */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141B2D] border border-emerald-500/30 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300">Accumulation:</span>
            <span className="text-emerald-400 font-bold">{b.accumulationCount || 0}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141B2D] border border-rose-500/30 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            <span className="text-slate-300">Distribution:</span>
            <span className="text-rose-400 font-bold">{b.distributionCount || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
