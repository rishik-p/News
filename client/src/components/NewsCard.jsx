import React from 'react';
import { ExternalLink, Flame, Zap, Shield, TrendingUp, TrendingDown, RefreshCw, BarChart2, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function NewsCard({ card, onInspectVolume }) {
  const {
    title,
    sources = [],
    sector,
    detectedStock,
    marketImpactScore,
    impactLevel,
    bias,
    triggerToWatch,
    executiveBrief,
    volumeCheck,
    duplicatesCount = 1,
    pubDate
  } = card;

  // Primary source link
  const primarySource = sources[0] || { name: 'Dalal Street Wire', url: '#' };

  // Relative time helper
  const getRelativeTime = (dateStr) => {
    if (!dateStr) return 'Recently';
    try {
      const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
      if (diff < 1) return 'Just now';
      if (diff < 60) return `${diff}m ago`;
      const hours = Math.floor(diff / 60);
      if (hours < 24) return `${hours}h ago`;
      return `${Math.floor(hours / 24)}d ago`;
    } catch {
      return 'Recently';
    }
  };

  // Impact color styling
  const isHighImpact = impactLevel === 'HIGH' || marketImpactScore >= 80;
  const isModImpact = impactLevel === 'MODERATE' || (marketImpactScore >= 45 && marketImpactScore < 80);

  // Bias badge styling
  const getBiasStyle = () => {
    if (bias === 'Bullish') {
      return {
        bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        icon: TrendingUp,
        label: 'BULLISH ▲'
      };
    }
    if (bias === 'Bearish') {
      return {
        bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        icon: TrendingDown,
        label: 'BEARISH ▼'
      };
    }
    return {
      bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      icon: RefreshCw,
      label: 'VOLATILE ↔'
    };
  };

  const biasConfig = getBiasStyle();
  const BiasIcon = biasConfig.icon;

  return (
    <div
      className={`group relative bg-[#101624] hover:bg-[#131B2D] border rounded-xl p-4 sm:p-5 transition-all duration-200 shadow-md ${
        isHighImpact
          ? 'border-rose-500/40 hover:border-rose-500/60 shadow-rose-950/20'
          : isModImpact
          ? 'border-slate-800 hover:border-amber-500/40'
          : 'border-slate-800/80 hover:border-slate-700'
      }`}
    >
      {/* Top Header: Source, Time, Sector, Impact Score */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        {/* Left: Source tag & time */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-200 bg-[#192236] px-2.5 py-1 rounded-md border border-slate-700">
            {primarySource.name}
          </span>

          <span className="text-[11px] text-slate-400 font-mono">
            {getRelativeTime(pubDate || primarySource.pubDate)}
          </span>

          {/* Duplicates badge */}
          {duplicatesCount > 1 && (
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30"
              title={`Reported by: ${sources.map(s => s.name).join(', ')}`}
            >
              Merged {duplicatesCount} sources
            </span>
          )}

          {/* Sector pill */}
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
            {sector}
          </span>
        </div>

        {/* Right: Market Impact Score (0 to 100) */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border font-mono text-xs font-bold ${
              isHighImpact
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/40 shadow-sm shadow-rose-500/10 animate-pulse'
                : isModImpact
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-slate-800/80 text-slate-300 border-slate-700'
            }`}
          >
            {isHighImpact ? <Flame className="w-3.5 h-3.5 text-rose-400" /> : isModImpact ? <Zap className="w-3.5 h-3.5 text-amber-400" /> : <Shield className="w-3.5 h-3.5 text-slate-400" />}
            <span>Impact: {marketImpactScore}/100</span>
          </div>
        </div>
      </div>

      {/* Main Headline */}
      <h2 className="text-base sm:text-lg font-bold text-white mb-3.5 leading-snug group-hover:text-amber-200 transition-colors">
        {title}
      </h2>

      {/* 2-Bullet Executive Brief */}
      <div className="bg-[#0B0F19]/80 border border-slate-800/80 rounded-lg p-3.5 mb-3.5 space-y-2.5 text-xs sm:text-sm">
        {/* Bullet 1: The Event */}
        <div className="flex items-start gap-2.5">
          <span className="flex-shrink-0 mt-0.5 text-amber-400 font-bold font-mono text-xs px-1.5 py-0.5 bg-amber-500/10 rounded border border-amber-500/20">
            EVENT
          </span>
          <p className="text-slate-200 leading-relaxed">
            {executiveBrief?.bullet1}
          </p>
        </div>

        {/* Bullet 2: Market Implication */}
        <div className="flex items-start gap-2.5">
          <span className="flex-shrink-0 mt-0.5 text-blue-400 font-bold font-mono text-xs px-1.5 py-0.5 bg-blue-500/10 rounded border border-blue-500/20">
            IMPACT
          </span>
          <p className="text-slate-300 leading-relaxed">
            {executiveBrief?.bullet2}
          </p>
        </div>
      </div>

      {/* Volume Reality Check (Smart Money Check) */}
      {volumeCheck && (
        <div className="bg-[#131A2A] border border-slate-800 rounded-lg p-3 mb-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded ${
              volumeCheck.classification === 'INSTITUTIONAL_ACCUMULATION'
                ? 'bg-emerald-500/20 text-emerald-400'
                : volumeCheck.classification === 'INSTITUTIONAL_DISTRIBUTION'
                ? 'bg-rose-500/20 text-rose-400'
                : 'bg-slate-800 text-slate-300'
            }`}>
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 font-mono">
                <span className="font-bold text-slate-200">{volumeCheck.symbol}</span>
                {volumeCheck.currentPrice && (
                  <span className="text-slate-300 font-medium">
                    ₹{volumeCheck.currentPrice}
                    {volumeCheck.dayChangePercent !== undefined && (
                      <span className={`ml-1 text-[11px] ${volumeCheck.dayChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        ({volumeCheck.dayChangePercent >= 0 ? '+' : ''}{volumeCheck.dayChangePercent}%)
                      </span>
                    )}
                  </span>
                )}
                <span className="text-slate-400">Vol: {volumeCheck.currentVolumeFormatted}</span>
                <span className="text-slate-500">(20-DMA: {volumeCheck.avg20dVolumeFormatted})</span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                {volumeCheck.interpretation}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Status pill */}
            <span
              className={`px-2.5 py-1 rounded-md font-mono text-xs font-bold border flex items-center gap-1.5 ${
                volumeCheck.classification === 'INSTITUTIONAL_ACCUMULATION' || volumeCheck.classification === 'INSTITUTIONAL_SURGE'
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                  : volumeCheck.classification === 'INSTITUTIONAL_DISTRIBUTION'
                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-500/10'
                  : volumeCheck.classification === 'INSTITUTIONAL_CHURN'
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                  : volumeCheck.classification === 'RETAIL_NOISE'
                  ? 'bg-slate-800/80 text-slate-400 border-slate-700'
                  : 'bg-blue-500/10 text-blue-300 border-blue-500/30'
              }`}
            >
              {volumeCheck.classification === 'INSTITUTIONAL_ACCUMULATION' || volumeCheck.classification === 'INSTITUTIONAL_SURGE' ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              ) : volumeCheck.classification === 'INSTITUTIONAL_DISTRIBUTION' ? (
                <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
              ) : volumeCheck.classification === 'INSTITUTIONAL_CHURN' ? (
                <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              ) : volumeCheck.classification === 'RETAIL_NOISE' ? (
                <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              )}
              <span>{volumeCheck.volumeRatio}x Vol · {volumeCheck.badgeText}</span>
            </span>

            {onInspectVolume && (
              <button
                onClick={() => onInspectVolume(volumeCheck)}
                className="text-[11px] font-mono text-slate-400 hover:text-amber-300 underline px-1 transition-colors"
              >
                Inspect
              </button>
            )}
          </div>
        </div>
      )}

      {/* Footer: Where Market Heads Next & Direct Outbound Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
        {/* Where Market Heads Next */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className={`px-2 py-0.5 rounded border font-mono font-bold text-[10px] flex items-center gap-1 ${biasConfig.bg}`}>
            <BiasIcon className="w-3 h-3" />
            <span>{biasConfig.label}</span>
          </span>

          {triggerToWatch && (
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
              <span className="text-slate-500">Trigger:</span>
              <span className="text-slate-300 font-medium">{triggerToWatch}</span>
            </div>
          )}
        </div>

        {/* Direct Source Link */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={primarySource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium text-amber-400 hover:text-slate-950 bg-amber-500/10 hover:bg-amber-400 border border-amber-500/30 hover:border-amber-400 transition-all group/link"
          >
            <span>Read on {primarySource.name}</span>
            <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
