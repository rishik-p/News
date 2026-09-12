import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MacroCatalystBar from './components/MacroCatalystBar';
import SectorSeverityBar from './components/SectorSeverityBar';
import FilterBar from './components/FilterBar';
import StatsSummary from './components/StatsSummary';
import NewsCard from './components/NewsCard';
import AllNewsWire from './components/AllNewsWire';
import GlobalNewsSection from './components/GlobalNewsSection';
import VolumeCheckModal from './components/VolumeCheckModal';
import DailyBriefingModal from './components/DailyBriefingModal';
import TriggerCalendarModal from './components/TriggerCalendarModal';
import { Loader2, AlertCircle, RefreshCw, Zap, Newspaper, Globe } from 'lucide-react';

export default function App() {
  const [intelligence, setIntelligence] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Active view tab: 'EXECUTIVE' | 'GLOBAL_NEWS' | 'ALL_NEWS'
  const [activeTab, setActiveTab] = useState('EXECUTIVE');

  // Filters for Executive Cards
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [impactFilter, setImpactFilter] = useState('ALL');
  const [surgeOnly, setSurgeOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedStockForModal, setSelectedStockForModal] = useState(null);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const fetchIntelligence = async (force = false) => {
    try {
      if (force) setIsSyncing(true);
      const url = `/api/intelligence${force ? '?force=true' : ''}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      const data = await res.json();
      setIntelligence(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching intelligence:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    // Instant open-time fetch
    fetchIntelligence(false);
  }, []);

  const allItems = intelligence?.items || [];
  const rawNewsList = intelligence?.allNews || [];
  const globalNewsList = intelligence?.globalNews || [];

  // Filter executive items in client
  const filteredItems = allItems.filter(item => {
    if (selectedSector !== 'ALL' && item.sector !== selectedSector) {
      return false;
    }
    if (impactFilter !== 'ALL' && item.impactLevel !== impactFilter) {
      return false;
    }
    if (surgeOnly && item.volumeCheck?.classification !== 'INSTITUTIONAL_SURGE') {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = item.title.toLowerCase().includes(q);
      const stockMatch = item.detectedStock?.name.toLowerCase().includes(q) || item.detectedStock?.symbol.toLowerCase().includes(q);
      const sectorMatch = item.sector.toLowerCase().includes(q);
      const briefMatch = item.executiveBrief?.bullet1.toLowerCase().includes(q) || item.executiveBrief?.bullet2.toLowerCase().includes(q);
      if (!titleMatch && !stockMatch && !sectorMatch && !briefMatch) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#080B11] text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* 1. Terminal Header with Dual-Phase Sync indicator */}
      <Header
        statusData={{
          lastNightSync: intelligence?.lastNightSync,
          lastSyncedAt: intelligence?.lastSyncedAt,
          syncType: intelligence?.syncType
        }}
        onSync={() => fetchIntelligence(true)}
        isSyncing={isSyncing}
        briefing={intelligence?.briefing}
        onOpenBriefing={() => setIsBriefingOpen(true)}
        onOpenCalendar={() => setIsCalendarOpen(true)}
      />

      {/* 2. Top Bar: "What's Driving Dalal Street" (Macro Catalysts) */}
      <MacroCatalystBar catalysts={intelligence?.macro || []} />

      {/* 3. Sectors Section & Dynamic Severity Ranking */}
      <SectorSeverityBar
        sectors={intelligence?.sectors || []}
        selectedSector={selectedSector}
        onSelectSector={setSelectedSector}
      />

      {/* 4. Top-level Stats Summary + Market Breadth (Feature G) */}
      {intelligence && (
        <StatsSummary
          items={allItems}
          sectors={intelligence.sectors || []}
          breadth={intelligence.breadth}
        />
      )}

      {/* 3-Way Tab Switcher: Executive Intelligence vs Global News vs All News Wire */}
      <div className="max-w-7xl w-full mx-auto px-4 lg:px-8 pt-4">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/80 pb-2">
          {/* Executive Tab */}
          <button
            onClick={() => setActiveTab('EXECUTIVE')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'EXECUTIVE'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-[#101524] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Executive Intelligence ({allItems.length})</span>
          </button>

          {/* Global News Tab */}
          <button
            onClick={() => setActiveTab('GLOBAL_NEWS')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'GLOBAL_NEWS'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-[#101524] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Globe className="w-4 h-4 text-blue-300" />
            <span>Global Market Drivers ({globalNewsList.length})</span>
          </button>

          {/* All News Wire Tab */}
          <button
            onClick={() => setActiveTab('ALL_NEWS')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ALL_NEWS'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-[#101524] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>All News · Live Wire ({rawNewsList.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin mb-3" />
            <p className="text-sm text-slate-300 font-medium">Initializing Dalal Street Intelligence Feed...</p>
            <p className="text-xs text-slate-500 mt-1 font-mono">Deduplicating articles · Running Volume Reality Checks · Loading Global Drivers</p>
          </div>
        ) : error ? (
          <div className="bg-rose-950/20 border border-rose-500/40 rounded-xl p-6 text-center max-w-md mx-auto my-12">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-white mb-1">Failed to Connect to Intelligence Server</h3>
            <p className="text-xs text-slate-400 mb-4">{error}</p>
            <button
              onClick={() => fetchIntelligence(true)}
              className="px-4 py-2 bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Connection</span>
            </button>
          </div>
        ) : activeTab === 'GLOBAL_NEWS' ? (
          /* View 1: Global News & World Drivers */
          <GlobalNewsSection globalNews={globalNewsList} />
        ) : activeTab === 'ALL_NEWS' ? (
          /* View 2: All News Continuous Live Wire */
          <AllNewsWire allNews={rawNewsList} />
        ) : (
          /* View 3: Executive Intelligence Feed */
          <div className="space-y-4">
            {/* Filter & Search Controls */}
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              impactFilter={impactFilter}
              onImpactChange={setImpactFilter}
              surgeOnly={surgeOnly}
              onSurgeToggle={setSurgeOnly}
              totalResults={allItems.length}
              filteredCount={filteredItems.length}
            />

            {filteredItems.length === 0 ? (
              <div className="bg-[#0F1422] border border-slate-800 rounded-xl p-12 text-center max-w-md mx-auto my-8">
                <p className="text-base font-bold text-slate-200 mb-1">No Matching Market Stories Found</p>
                <p className="text-xs text-slate-400 mb-4">
                  Try broadening your search query or resetting active sector & impact filters.
                </p>
                <button
                  onClick={() => {
                    setSelectedSector('ALL');
                    setImpactFilter('ALL');
                    setSurgeOnly(false);
                    setSearchQuery('');
                  }}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredItems.map((card, idx) => (
                  <NewsCard
                    key={card.link || `${card.title}-${idx}`}
                    card={card}
                    onInspectVolume={(volData) => setSelectedStockForModal(volData)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal for Smart Money Volume Reality Check */}
      {selectedStockForModal && (
        <VolumeCheckModal
          stock={selectedStockForModal}
          onClose={() => setSelectedStockForModal(null)}
        />
      )}

      {/* Feature A: Daily Briefing Modal (Morning Bell / Evening Wrap) */}
      {isBriefingOpen && intelligence?.briefing && (
        <DailyBriefingModal
          briefing={intelligence.briefing}
          onClose={() => setIsBriefingOpen(false)}
        />
      )}

      {/* Feature F: Trigger & Corporate Action Calendar */}
      {isCalendarOpen && (
        <TriggerCalendarModal
          calendar={intelligence?.calendar || []}
          onClose={() => setIsCalendarOpen(false)}
        />
      )}

      {/* Terminal Footer */}
      <footer className="border-t border-slate-800/80 bg-[#07090F] py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">AlphaPulse India</span>
            <span>·</span>
            <span>NSE / BSE Intelligence & Global Drivers Terminal</span>
          </div>
          <p className="font-mono text-[11px] text-slate-500">
            Nightly Snapshot (23:30 IST) + On-Open Live Sync · Multi-Factor Impact Engine
          </p>
        </div>
      </footer>
    </div>
  );
}
