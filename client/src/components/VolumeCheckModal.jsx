import React from 'react';
import { X, BarChart2, ShieldCheck, AlertTriangle, ArrowUpRight, TrendingUp, Building2 } from 'lucide-react';

export default function VolumeCheckModal({ stock, onClose }) {
  if (!stock) return null;

  const isAccumulation = stock.classification === 'INSTITUTIONAL_ACCUMULATION' || stock.classification === 'INSTITUTIONAL_SURGE';
  const isDistribution = stock.classification === 'INSTITUTIONAL_DISTRIBUTION';
  const isChurn = stock.classification === 'INSTITUTIONAL_CHURN';
  const isNoise = stock.classification === 'RETAIL_NOISE';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0F1523] border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className={`p-2.5 rounded-xl ${
            isAccumulation 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : isDistribution
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              : isChurn
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}>
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white font-mono">{stock.symbol}</h3>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                {stock.nseTicker}
              </span>
            </div>
            <p className="text-xs text-slate-400">{stock.name}</p>
          </div>
        </div>

        {/* Price & Change */}
        {stock.currentPrice && (
          <div className="bg-[#141C2E] border border-slate-800 rounded-xl p-3.5 mb-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400">Current Market Price (NSE)</span>
              <div className="text-xl font-mono font-bold text-white">
                ₹{stock.currentPrice.toLocaleString('en-IN')}
              </div>
            </div>
            {stock.dayChangePercent !== undefined && (
              <div className={`text-right font-mono font-bold ${stock.dayChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                <span className="text-xs block text-slate-400">Day Change</span>
                <span className="text-base">
                  {stock.dayChangePercent >= 0 ? '+' : ''}{stock.dayChangePercent}%
                </span>
              </div>
            )}
          </div>
        )}

        {/* Smart Money Volume Breakdown */}
        <div className="bg-[#141C2E] border border-slate-800 rounded-xl p-4 mb-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Today's Trading Volume</span>
            <span className="font-mono font-bold text-white text-sm">
              {stock.currentVolumeFormatted} ({stock.currentVolume.toLocaleString('en-IN')} shares)
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">20-Day Benchmark Moving Average</span>
            <span className="font-mono font-bold text-slate-300 text-sm">
              {stock.avg20dVolumeFormatted} ({stock.avg20dVolume.toLocaleString('en-IN')} shares)
            </span>
          </div>

          {/* Ratio bar */}
          <div>
            <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
              <span>Volume Multiple</span>
              <span className={`font-bold ${
                isAccumulation ? 'text-emerald-400' : isDistribution ? 'text-rose-400' : isChurn ? 'text-amber-400' : 'text-slate-400'
              }`}>
                {stock.volumeRatio}x 20-DMA
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all rounded-full ${
                  isAccumulation 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-400' 
                    : isDistribution
                    ? 'bg-gradient-to-r from-rose-500 to-red-400'
                    : isChurn
                    ? 'bg-amber-500'
                    : 'bg-slate-600'
                }`}
                style={{ width: `${Math.min(100, (stock.volumeRatio / 3) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Verdict Box */}
        <div
          className={`p-4 rounded-xl border text-xs leading-relaxed ${
            isAccumulation
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
              : isDistribution
              ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
              : isChurn
              ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
              : isNoise
              ? 'bg-slate-900 border-slate-700 text-slate-300'
              : 'bg-blue-950/30 border-blue-500/30 text-blue-200'
          }`}
        >
          <div className="flex items-center gap-2 font-bold mb-1">
            {isAccumulation ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Smart Money Radar: Institutional Accumulation Confirmed 🟢</span>
              </>
            ) : isDistribution ? (
              <>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Smart Money Radar: Institutional Distribution Warning 🔴</span>
              </>
            ) : isChurn ? (
              <>
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span>Smart Money Radar: Heavy Block Churn / Liquidity Absorbed 🟡</span>
              </>
            ) : isNoise ? (
              <>
                <AlertTriangle className="w-4 h-4 text-slate-400" />
                <span>Smart Money Radar: Retail Noise Warning ⚠️</span>
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span>Smart Money Radar: Balanced Market Flow ⚖️</span>
              </>
            )}
          </div>
          <p className="text-slate-300">
            {stock.interpretation}
          </p>
        </div>

        <div className="mt-5 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
