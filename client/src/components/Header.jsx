import React from 'react';
import { RefreshCw, Moon, Clock, Zap, Sun, CalendarDays } from 'lucide-react';

export default function Header({ statusData, onSync, isSyncing, briefing, onOpenBriefing, onOpenCalendar }) {
  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    } catch {
      return '--:--';
    }
  };

  // Determine briefing button label based on type
  const isMorningBell = briefing?.type === 'MORNING_BELL';
  const briefingLabel = isMorningBell ? '🌅 Morning Bell' : '🌆 Evening Wrap';
  const briefingTitle = isMorningBell ? 'Open Morning Bell Pre-Market Briefing' : 'Open Evening Wrap Post-Market Briefing';

  return (
    <header className="sticky top-0 z-40 bg-[#0A0E17]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand & Market Status */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/40 shadow-lg shadow-amber-500/10">
            <Zap className="w-5 h-5 text-amber-400" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0A0E17] animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0A0E17]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>AlphaPulse</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 font-extrabold">India</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                NSE / BSE INTELLIGENCE
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Intelligent Dalal Street Market Filter · Smart Money Volume Checks · Deduplicated Feeds
            </p>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2 text-xs">
          {/* Nightly Sync Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-indigo-300">
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 leading-tight">Nightly EOD Sync</span>
              <span className="font-mono font-medium text-slate-200">
                {statusData?.lastNightSync ? formatTime(statusData.lastNightSync) : '23:30 IST'}
              </span>
            </div>
          </div>

          {/* Open / Last Sync Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 leading-tight">Open Time Sync</span>
              <span className="font-mono font-medium text-slate-200">
                {formatTime(statusData?.lastSyncedAt)}
              </span>
            </div>
          </div>

          {/* Morning Bell / Evening Wrap Button (Feature A) */}
          {briefing && onOpenBriefing && (
            <button
              onClick={onOpenBriefing}
              title={briefingTitle}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs border transition-all ${
                isMorningBell
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500/25 hover:text-amber-200'
                  : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40 hover:bg-indigo-500/25 hover:text-indigo-200'
              }`}
            >
              {isMorningBell ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{briefingLabel}</span>
              {/* Pulsating dot */}
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isMorningBell ? 'bg-amber-400' : 'bg-indigo-400'}`}></span>
            </button>
          )}

          {/* Trigger Radar Calendar Button (Feature F) */}
          {onOpenCalendar && (
            <button
              onClick={onOpenCalendar}
              title="Open 7-14 Day Trigger & Corporate Action Calendar"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs border bg-blue-500/10 text-blue-300 border-blue-500/30 hover:bg-blue-500/20 hover:text-blue-200 transition-all"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">📅 Trigger Radar</span>
            </button>
          )}

          {/* Manual Force Sync Button */}
          <button
            onClick={() => onSync(true)}
            disabled={isSyncing}
            title="Fetch and sync fresh market feeds"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-xs transition-all ${
              isSyncing
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20 active:scale-95'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-300' : 'text-slate-950'}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
