import React, { useState } from 'react';
import { Globe, ExternalLink, Clock, TrendingUp, TrendingDown, RefreshCw, Flame, Zap, Shield, Search, X, Compass, ArrowUpRight } from 'lucide-react';

export default function GlobalNewsSection({ globalNews = [] }) {
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [search, setSearch] = useState('');

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

  const getSentimentStyle = (sentiment) => {
    if (sentiment === 'Bullish for India') {
      return {
        bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        icon: TrendingUp,
        label: 'BULLISH FOR INDIA ▲'
      };
    }
    if (sentiment === 'Bearish for India') {
      return {
        bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        icon: TrendingDown,
        label: 'BEARISH FOR INDIA ▼'
      };
    }
    return {
      bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      icon: RefreshCw,
      label: 'NEUTRAL / VOLATILE ↔'
    };
  };

  const regions = [
    'ALL',
    'Central Banks & Fed 🏛️',
    'US & Wall Street 🇺🇸',
    'Energy & Commodities 🛢️',
    'Asia-Pacific 🌏',
    'Europe 🇪🇺',
    'Global Macro 🌐'
  ];

  const filtered = globalNews.filter(item => {
    if (regionFilter !== 'ALL' && item.region !== regionFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const titleMatch = item.title.toLowerCase().includes(q);
      const descMatch = (item.description || '').toLowerCase().includes(q);
      const impactMatch = (item.impactOnIndia || '').toLowerCase().includes(q);
      const sourceMatch = item.sourceName?.toLowerCase().includes(q);
      if (!titleMatch && !descMatch && !impactMatch && !sourceMatch) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Global Catalyst Header & Controls */}
      <div className="bg-[#0F1523] border border-slate-800 rounded-xl p-4 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400 animate-spin-slow" />
              <h2 className="text-base font-bold text-white tracking-tight">
                Global Market Drivers · International Wire
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30">
                {filtered.length} Global Drivers
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Wall Street, Federal Reserve, Global Central Banks, Commodities & their direct transmission to Dalal Street
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search global catalysts..."
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-[#151D2F] border border-slate-700/80 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Region Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {regions.map(r => (
            <button
              key={r}
              onClick={() => setRegionFilter(r)}
              className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                regionFilter === r
                  ? 'bg-blue-600 text-white border-blue-500 font-bold shadow-sm shadow-blue-500/30'
                  : 'bg-[#151D2F] text-slate-300 border-slate-700/60 hover:border-slate-600 hover:text-white'
              }`}
            >
              {r === 'ALL' ? 'All Regions' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Global News Cards */}
      {filtered.length === 0 ? (
        <div className="bg-[#0F1523] border border-slate-800 rounded-xl p-12 text-center">
          <p className="text-sm font-semibold text-slate-300">No global catalysts found for the selected filter.</p>
          <button
            onClick={() => { setSearch(''); setRegionFilter('ALL'); }}
            className="mt-3 text-xs text-blue-400 underline"
          >
            Reset filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item, idx) => {
            const sentiment = getSentimentStyle(item.sentimentOnIndia);
            const SentimentIcon = sentiment.icon;
            const isHighImpact = item.globalImpactScore >= 80;
            const isModImpact = item.globalImpactScore >= 45 && item.globalImpactScore < 80;

            return (
              <div
                key={item.id || idx}
                className="group relative bg-[#0D121F] hover:bg-[#111728] border border-slate-800/90 hover:border-blue-500/40 rounded-xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 shadow-md"
              >
                <div>
                  {/* Top line: Region, Source, Time, Impact Score */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="font-semibold text-blue-300 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-500/20 text-[11px]">
                        {item.region}
                      </span>
                      <span className="text-slate-400 font-medium text-[11px]">
                        {item.sourceName}
                      </span>
                      <span className="text-slate-500 text-[11px] font-mono">
                        {getRelativeTime(item.pubDate)}
                      </span>
                    </div>

                    {/* Impact Score */}
                    <div
                      className={`flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[11px] font-bold border ${
                        isHighImpact
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : isModImpact
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {isHighImpact ? <Flame className="w-3 h-3 text-rose-400" /> : isModImpact ? <Zap className="w-3 h-3 text-amber-400" /> : <Shield className="w-3 h-3" />}
                      <span>{item.globalImpactScore}/100</span>
                    </div>
                  </div>

                  {/* Headline */}
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-blue-200 leading-snug mb-2.5">
                    {item.title}
                  </h3>

                  {/* Description snippet */}
                  {item.description && (
                    <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {/* Crucial Section: Impact on Dalal Street */}
                  <div className="bg-[#12192A] border border-blue-500/20 rounded-lg p-2.5 mb-3.5">
                    <div className="text-[10px] font-mono font-bold uppercase text-blue-400 tracking-wider mb-1 flex items-center gap-1">
                      <Compass className="w-3 h-3" />
                      <span>Impact on Dalal Street & Indian Equities</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-medium">
                      {item.impactOnIndia}
                    </p>
                  </div>
                </div>

                {/* Footer: Sentiment on India & Direct Link */}
                <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-800/80 mt-auto">
                  <span className={`px-2 py-0.5 rounded border font-mono font-bold text-[10px] flex items-center gap-1 ${sentiment.bg}`}>
                    <SentimentIcon className="w-3 h-3" />
                    <span>{sentiment.label}</span>
                  </span>

                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium text-blue-400 hover:text-white hover:bg-blue-600 bg-blue-500/10 border border-blue-500/20 transition-all"
                  >
                    <span>Read on {item.sourceName} ↗</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
