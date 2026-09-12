import React, { useState } from 'react';
import { ExternalLink, Clock, Newspaper, Search, X, Tag, ChevronDown, ChevronUp, Layers } from 'lucide-react';

export default function AllNewsWire({ allNews = [] }) {
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [expandedId, setExpandedId] = useState(null);

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

  const getSourceBadgeColor = (source) => {
    const s = (source || '').toLowerCase();
    if (s.includes('moneycontrol')) return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    if (s.includes('economic') || s.includes('et')) return 'bg-red-500/10 text-red-400 border-red-500/30';
    if (s.includes('mint')) return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
    if (s.includes('business standard')) return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    if (s.includes('hindu') || s.includes('businessline')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  // Unique sectors present in allNews
  const availableSectors = ['ALL', ...new Set(allNews.map(n => n.sector).filter(Boolean))];

  const filtered = allNews.filter(item => {
    if (sectorFilter !== 'ALL' && item.sector !== sectorFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const titleMatch = item.title.toLowerCase().includes(q);
      const descMatch = (item.description || '').toLowerCase().includes(q);
      const stockMatch = item.detectedStock?.symbol?.toLowerCase().includes(q) || item.detectedStock?.name?.toLowerCase().includes(q);
      const sourceMatch = item.sourceName?.toLowerCase().includes(q);
      if (!titleMatch && !descMatch && !stockMatch && !sourceMatch) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Wire Subheader & Controls */}
      <div className="bg-[#0F1523] border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              All News · Live Market Wire
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {filtered.length} of {allNews.length} articles
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Continuous chronological collection of all raw Indian market stories across major publishers
          </p>
        </div>

        {/* Search & Sector Dropdown */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search wire articles..."
              className="pl-8 pr-7 py-1.5 text-xs bg-[#151D2F] border border-slate-700/80 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Sector select */}
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-[#151D2F] border border-slate-700/80 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
          >
            {availableSectors.map(s => (
              <option key={s} value={s}>{s === 'ALL' ? 'All Sectors' : s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* News Stream List */}
      {filtered.length === 0 ? (
        <div className="bg-[#0F1523] border border-slate-800 rounded-xl p-12 text-center">
          <p className="text-sm font-semibold text-slate-300">No wire stories matching your filter.</p>
          <button
            onClick={() => { setSearch(''); setSectorFilter('ALL'); }}
            className="mt-3 text-xs text-amber-400 underline"
          >
            Reset search and sector
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((item, idx) => {
            const isExpanded = expandedId === item.id || expandedId === idx;
            return (
              <div
                key={item.id || idx}
                className="group bg-[#0D121F] hover:bg-[#111728] border border-slate-800/90 hover:border-slate-700 rounded-xl p-3.5 sm:p-4 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                  <div className="flex-1 space-y-1.5">
                    {/* Top row: Source, Time, Sector, Stock */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${getSourceBadgeColor(item.sourceName)}`}>
                        {item.sourceName}
                      </span>

                      <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{getRelativeTime(item.pubDate)}</span>
                      </span>

                      {item.sector && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {item.sector}
                        </span>
                      )}

                      {item.detectedStock && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          {item.detectedStock.symbol}
                        </span>
                      )}
                    </div>

                    {/* Headline */}
                    <h3 className="text-sm sm:text-base font-semibold text-slate-100 group-hover:text-white leading-snug">
                      {item.title}
                    </h3>

                    {/* Expandable Snippet */}
                    {item.description && (
                      <div>
                        {isExpanded ? (
                          <p className="text-xs text-slate-300 leading-relaxed mt-1.5 pt-1.5 border-t border-slate-800/80">
                            {item.description}
                          </p>
                        ) : (
                          <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions: Direct Link & Expand */}
                  <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center mt-2 sm:mt-0">
                    {item.description && item.description.length > 80 && (
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : (item.id || idx))}
                        className="p-1 rounded text-slate-400 hover:text-white text-xs flex items-center gap-1"
                        title={isExpanded ? "Collapse" : "Expand snippet"}
                      >
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    )}

                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-xs font-medium transition-all"
                    >
                      <span>Read ↗</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
