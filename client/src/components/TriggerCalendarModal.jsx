import React, { useState } from 'react';
import { X, Calendar, Clock, Sparkles, Filter, ChevronRight, AlertCircle, Building2 } from 'lucide-react';

export default function TriggerCalendarModal({ calendar = [], onClose }) {
  const [activeCategory, setActiveCategory] = useState('ALL');

  const categories = [
    { id: 'ALL', label: 'All Triggers' },
    { id: 'EARNINGS', label: 'Earnings 📊' },
    { id: 'CENTRAL_BANKS', label: 'Central Banks 🏛️' },
    { id: 'CORPORATE_ACTION', label: 'Corporate Actions 📑' },
    { id: 'REGULATORY', label: 'Regulatory ⚖️' }
  ];

  const filtered = calendar.filter(c => activeCategory === 'ALL' || c.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0F1422] border border-blue-500/40 rounded-2xl shadow-2xl p-6 text-slate-100 no-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30">
              NEXT 7 - 14 DAYS RADAR
            </span>
            <h2 className="text-xl font-extrabold text-white mt-0.5">
              Trigger & Corporate Action Calendar
            </h2>
            <p className="text-xs text-slate-400">
              Scheduled earnings calls, RBI MPC meetings, Fed rate decisions & corporate action record dates
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white border-blue-500 shadow-sm shadow-blue-500/20'
                  : 'bg-[#141B2D] text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Calendar Timeline List */}
        <div className="space-y-3">
          {filtered.map((event, idx) => (
            <div
              key={event.id || idx}
              className="group bg-[#13192B] hover:bg-[#161F36] border border-slate-800/90 hover:border-blue-500/40 rounded-xl p-4 transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30">
                    {event.date}
                  </span>
                  <span className="text-[11px] font-mono font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {event.daysAway}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {event.company}
                  </span>
                </div>

                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border self-start sm:self-auto ${event.marketImpact === 'HIGH' ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' : 'bg-amber-500/15 text-amber-300 border-amber-500/30'}`}>
                  Impact: {event.impactScore}/100
                </span>
              </div>

              <h4 className="text-sm font-bold text-white group-hover:text-blue-200 mb-1.5 leading-snug">
                {event.title}
              </h4>

              <p className="text-xs text-slate-400 leading-relaxed">
                {event.description}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-5 text-right pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
          >
            Close Calendar
          </button>
        </div>
      </div>
    </div>
  );
}
