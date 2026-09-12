import React from 'react';
import { X, Sun, Moon, Sparkles, TrendingUp, Compass, ArrowRight, Share2, Check, ShieldCheck } from 'lucide-react';

export default function DailyBriefingModal({ briefing, onClose }) {
  const [copied, setCopied] = React.useState(false);

  if (!briefing) return null;

  const isMorning = briefing.type === 'MORNING_BELL';

  const handleCopy = () => {
    const text = `⚡ AlphaPulse India · ${briefing.title}
${briefing.subtitle}

📌 Setup: ${briefing.openingTone}
📊 Macro: ${briefing.macroTakeaway}
🔥 Sector in Focus: #${briefing.topSectorInFocus?.rank} ${briefing.topSectorInFocus?.name} (Heat ${briefing.topSectorInFocus?.severityScore})

🎯 Top Stocks to Watch:
${briefing.topStocksToWatch?.map(s => `• ${s.symbol} (${s.impactScore}/100 - ${s.bias}): ${s.eventBrief} [Smart Money: ${s.smartMoney}]`).join('\n')}

💡 Action Plan:
${briefing.actionPlan?.map(a => `• ${a}`).join('\n')}

🔗 Read full intelligence terminal on: http://localhost:5000`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0F1422] border border-amber-500/40 rounded-2xl shadow-2xl p-6 text-slate-100 no-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge & Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2.5 rounded-xl ${isMorning ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'}`}>
            {isMorning ? <Sun className="w-6 h-6 animate-spin-slow" /> : <Moon className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${isMorning ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'}`}>
                {briefing.badge} · {briefing.timeLabel}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-0.5">{briefing.title}</h2>
            <p className="text-xs text-slate-400">{briefing.subtitle}</p>
          </div>
        </div>

        {/* Opening Tone / Market Setup Box */}
        <div className="bg-[#141B2D] border border-slate-800 rounded-xl p-4 mb-4">
          <div className="text-[10px] font-mono uppercase text-amber-400 font-bold mb-1 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>Dalal Street Executive Takeaway</span>
          </div>
          <p className="text-sm font-semibold text-slate-100 leading-relaxed mb-2">
            {briefing.openingTone}
          </p>
          <div className="text-xs text-slate-400 bg-[#0B0F19] p-2.5 rounded-lg border border-slate-800/80 font-mono">
            {briefing.macroTakeaway}
          </div>
        </div>

        {/* Sector in Focus */}
        {briefing.topSectorInFocus && (
          <div className="bg-[#141B2D] border border-slate-800 rounded-xl p-3.5 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                #{briefing.topSectorInFocus.rank} Heat Storm
              </span>
              <div>
                <span className="text-xs font-bold text-white block">
                  {briefing.topSectorInFocus.name} Sector
                </span>
                <span className="text-[11px] text-slate-400 line-clamp-1">
                  {briefing.topSectorInFocus.headline}
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-rose-400 px-2 py-0.5 bg-rose-500/10 rounded">
              {briefing.topSectorInFocus.severityScore} heat
            </span>
          </div>
        )}

        {/* Top 3 Stocks to Watch */}
        <div className="mb-4">
          <h3 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Top Stocks to Watch Today (News Impact + Smart Money)</span>
          </h3>

          <div className="space-y-2.5">
            {briefing.topStocksToWatch?.map(s => (
              <div
                key={s.symbol}
                className="bg-[#121828] border border-slate-800 hover:border-slate-700 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-white">{s.symbol}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {s.name}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      Impact: {s.impactScore}/100
                    </span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${s.bias === 'Bullish' ? 'text-emerald-400 bg-emerald-500/10' : s.bias === 'Bearish' ? 'text-rose-400 bg-rose-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
                      {s.bias}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-1">{s.eventBrief}</p>
                </div>

                <div className="flex-shrink-0 text-right">
                  <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 inline-block">
                    {s.smartMoney} ({s.volumeRatio}x Vol)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Plan */}
        <div className="bg-[#141B2D] border border-slate-800 rounded-xl p-3.5 mb-5">
          <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Dalal Street Trader Action Plan</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {briefing.actionPlan?.map((plan, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold mt-0.5">•</span>
                <span>{plan}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Modal Actions: Share & Close */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Briefing for WhatsApp'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
