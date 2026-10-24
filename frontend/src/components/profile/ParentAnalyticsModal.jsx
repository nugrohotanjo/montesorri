import React from 'react';
import { getAnalyticsData } from '../../utils/activityTracker';
import { BANK_GAMES } from '../../data/bankGames';

export default function ParentAnalyticsModal({ isOpen, onClose, lang = 'id' }) {
  if (!isOpen) return null;

  const analytics = getAnalyticsData();
  const gameEntries = Object.entries(analytics);

  // Urutkan berdasarkan game yang paling sering diulang-ulang (paling favorit)
  gameEntries.sort((a, b) => b[1].playCount - a[1].playCount);

  const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return '-';
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleDateString(lang === 'en' ? 'en-US' : 'id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGameTitle = (id) => {
    const found = BANK_GAMES.find((g) => g.id === id);
    if (!found) return id;
    if (typeof found.title === 'string') return found.title;
    return found.title[lang] || found.title.id || id;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
      <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-xl w-full shadow-2xl border border-stone-200 max-h-[88vh] flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h3 className="text-base sm:text-lg font-black text-stone-800">
              📊 {lang === 'en' ? 'Child Learning & Play Analytics' : 'Laporan Bermain & Belajar Anak'}
            </h3>
            <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">
              {lang === 'en'
                ? 'Track repeated games, speed records, and playtime'
                : 'Pantau game favorit, rekor kecepatan, dan durasi main'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 font-bold flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto flex-1 my-4 pr-1 space-y-3">
          {gameEntries.length === 0 ? (
            <div className="text-center py-10 text-stone-400">
              <span className="text-3xl block mb-2">⏱️</span>
              <p className="text-xs font-bold">
                {lang === 'en' ? 'No gameplay records yet.' : 'Belum ada riwayat game yang dimainkan.'}
              </p>
            </div>
          ) : (
            gameEntries.map(([gameId, stat]) => (
              <div
                key={gameId}
                className="bg-stone-50 border border-stone-200/80 rounded-2xl p-3 sm:p-4 text-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-stone-800 text-sm sm:text-base">
                    {getGameTitle(gameId)}
                  </span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-black rounded-lg text-[11px]">
                    🔁 {stat.playCount}x {lang === 'en' ? 'Played' : 'Dimainkan'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-white p-2.5 rounded-xl border border-stone-200/60 text-center">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-bold">⚡ Tercepat</span>
                    <span className="font-black text-emerald-600 text-xs sm:text-sm">
                      {stat.bestTimeSeconds ? `${stat.bestTimeSeconds} detik` : '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block font-bold">⏳ Total Waktu</span>
                    <span className="font-black text-stone-700 text-xs sm:text-sm">
                      {formatDuration(stat.totalDurationSeconds)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block font-bold">📅 Terakhir Main</span>
                    <span className="font-black text-stone-700 text-[11px] leading-tight block mt-0.5">
                      {formatDate(stat.lastPlayed)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs transition"
        >
          {lang === 'en' ? 'Close' : 'Tutup'}
        </button>
      </div>
    </div>
  );
}