import React from 'react';
import { Fuel, TrendingUp, Landmark, Flame, ArrowUpRight, ArrowDownRight, Compass } from 'lucide-react';

const iconMap = {
  Fuel: Fuel,
  TrendingUp: TrendingUp,
  Landmark: Landmark
};

export default function MacroCatalystBar({ catalysts = [] }) {
  if (!catalysts || catalysts.length === 0) return null;

  return (
    <div className="w-full bg-[#0D121F] border-b border-slate-800/80 py-3 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Title row */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              What's Driving Dalal Street Today
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Top 3 Macro Catalysts</span>
          </div>
          <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono hidden sm:inline-block">
            LIVE SYNTHESIS
          </span>
        </div>

        {/* 3 Catalyst Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {catalysts.map((cat, idx) => {
            const Icon = iconMap[cat.icon] || TrendingUp;
            const isPositive = cat.statusType === 'positive';

            return (
              <div
                key={cat.id || idx}
                className="group relative bg-[#131929]/70 hover:bg-[#161E33] border border-slate-800/80 hover:border-slate-700 rounded-xl p-3 transition-all duration-200 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                      {cat.title}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                      isPositive
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {cat.status}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-sm font-mono font-bold text-white tracking-tight">
                    {cat.metric}
                  </span>
                  <span className={`text-[11px] font-mono font-medium flex items-center ${isPositive ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {cat.change}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {cat.summary}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
