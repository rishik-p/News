import React from 'react';
import { Search, Flame, Zap, Shield, Sparkles, X } from 'lucide-react';

export default function FilterBar({
  searchQuery,
  onSearchChange,
  impactFilter,
  onImpactChange,
  surgeOnly,
  onSurgeToggle,
  totalResults,
  filteredCount
}) {
  return (
    <div className="bg-[#0D111A] border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search stock (e.g. Tata Motors, TCS, HDFC) or event..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-[#141A29] border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/40 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right: Filter tabs & Smart Money Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Impact score filters */}
          <div className="flex items-center bg-[#141A29] p-0.5 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => onImpactChange('ALL')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                impactFilter === 'ALL'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Impact
            </button>
            <button
              onClick={() => onImpactChange('HIGH')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                impactFilter === 'HIGH'
                  ? 'bg-rose-500 text-white font-bold'
                  : 'text-rose-400 hover:text-rose-300'
              }`}
            >
              <Flame className="w-3 h-3" />
              <span>High (80-100)</span>
            </button>
            <button
              onClick={() => onImpactChange('MODERATE')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                impactFilter === 'MODERATE'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>Moderate (45-79)</span>
            </button>
            <button
              onClick={() => onImpactChange('LOW')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                impactFilter === 'LOW'
                  ? 'bg-slate-700 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>Low</span>
            </button>
          </div>

          {/* Smart Money Volume Surge Toggle */}
          <button
            onClick={() => onSurgeToggle(!surgeOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              surgeOnly
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm shadow-emerald-500/20'
                : 'bg-[#141A29] text-emerald-400 border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Money Surge (&gt;1.8x)</span>
          </button>

          {/* Counter */}
          <span className="text-[11px] font-mono text-slate-500 px-2 py-1 bg-[#141A29] rounded border border-slate-800">
            {filteredCount} of {totalResults} stories
          </span>
        </div>
      </div>
    </div>
  );
}
