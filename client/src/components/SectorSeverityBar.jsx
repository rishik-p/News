import React from 'react';
import { Flame, Zap, Activity, Shield, Layers, Filter } from 'lucide-react';

const stormIcons = {
  Flame: Flame,
  Zap: Zap,
  Activity: Activity,
  Shield: Shield
};

export default function SectorSeverityBar({ sectors = [], selectedSector, onSelectSector }) {
  if (!sectors || sectors.length === 0) return null;

  return (
    <div className="w-full bg-[#0B0F19] border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto">
        {/* Header line */}
        <div className="flex items-center justify-between gap-4 mb-2.5">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Sector Severity & News Storm Ranking
            </span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              (Ranked #1 to #9 by News Volume & Impact Heat)
            </span>
          </div>

          {selectedSector !== 'ALL' && (
            <button
              onClick={() => onSelectSector('ALL')}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono transition-colors"
            >
              <span>Reset filter</span>
              <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded">Esc</span>
            </button>
          )}
        </div>

        {/* Scrollable Sector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth">
          {/* "All" button */}
          <button
            onClick={() => onSelectSector('ALL')}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              selectedSector === 'ALL'
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-sm shadow-amber-500/30'
                : 'bg-[#141A29] text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Sectors</span>
          </button>

          {/* 9 Ranked Sectors */}
          {sectors.map((sec) => {
            const isSelected = selectedSector === sec.name;
            const isRank1 = sec.rank === 1;

            return (
              <button
                key={sec.id}
                onClick={() => onSelectSector(sec.name)}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border transition-all relative ${
                  isSelected
                    ? 'bg-blue-600/30 text-blue-200 border-blue-400 font-bold shadow-sm shadow-blue-500/30 ring-1 ring-blue-400'
                    : isRank1
                    ? 'bg-rose-950/40 text-rose-200 border-rose-500/40 hover:border-rose-400 hover:bg-rose-900/30'
                    : 'bg-[#141A29] text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
                title={`Rank #${sec.rank}: ${sec.fullName} - ${sec.stormLevel}`}
              >
                {/* Rank Badge */}
                <span
                  className={`text-[10px] font-mono font-extrabold px-1.5 py-0.2 rounded ${
                    isRank1
                      ? 'bg-rose-500 text-white animate-pulse'
                      : sec.rank <= 3
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  #{sec.rank}
                </span>

                <span className="font-semibold">{sec.name}</span>

                {/* Severity Score Pill */}
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    sec.severityScore >= 75
                      ? 'bg-rose-500/20 text-rose-400'
                      : sec.severityScore >= 50
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {sec.severityScore} heat
                </span>

                {/* News count pill */}
                <span className="text-[10px] text-slate-500 font-mono">
                  {sec.newsCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
