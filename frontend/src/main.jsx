import React, { useState, useEffect, lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';

// Lazy load komponen game (hanya diunduh pas diklik!)
const SensoryBellsGame = lazy(() => import('./games/SensoryBellsGame'));
const FingerPaintGame = lazy(() => import('./games/FingerPaintGame'));
const ColorSortingGame = lazy(() => import('./games/ColorSortingGame'));
const PinkTowerGame = lazy(() => import('./games/PinkTowerGame'));
const MissingApplesGame = lazy(() => import('./games/MissingApplesGame'));
const BodyPartsGame = lazy(() => import('./games/BodyPartsGame'));

export default function App() {
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('montessori_tab') || 'toddler');
  const [activeGame, setActiveGame] = useState(() => localStorage.getItem('montessori_game') || null);
  const [stars, setStars] = useState(() => Number(localStorage.getItem('montessori_stars') || 0));

  useEffect(() => {
    localStorage.setItem('montessori_tab', activeTab);
    if (activeGame) localStorage.setItem('montessori_game', activeGame);
    else localStorage.removeItem('montessori_game');
    localStorage.setItem('montessori_stars', stars);
  }, [activeTab, activeGame, stars]);

  const addStar = () => setStars(prev => prev + 1);

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
      <header className="flex items-center justify-between bg-white/95 backdrop-blur p-3 sm:p-5 rounded-2xl sm:rounded-3xl shadow-sm border border-stone-200 mb-4 sm:mb-6">
        <div>
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-black text-stone-800">🌿 Montessori Playroom</h1>
          <p className="text-[11px] sm:text-sm text-stone-500">Eksplorasi sensorik & logika mandiri</p>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 bg-amber-50 border border-amber-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl">
          <span>⭐</span>
          <span className="text-xs sm:text-base font-black text-amber-900">{stars}</span>
        </div>
      </header>

      {!activeGame ? (
        <>
          <div className="flex gap-2 p-1.5 bg-stone-200/80 rounded-2xl mb-4 sm:mb-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('toddler')}
              className={`flex-1 min-w-[130px] py-2.5 sm:py-3 text-xs sm:text-sm font-bold rounded-xl ${
                activeTab === 'toddler' ? 'bg-white shadow text-stone-800' : 'text-stone-600'
              }`}
            >
              🌱 Toddler (1 - 2.5 th)
            </button>
            <button
              onClick={() => setActiveTab('preschool')}
              className={`flex-1 min-w-[130px] py-2.5 sm:py-3 text-xs sm:text-sm font-bold rounded-xl ${
                activeTab === 'preschool' ? 'bg-white shadow text-stone-800' : 'text-stone-600'
              }`}
            >
              🌿 Preschool (3 - 4.5 th)
            </button>
            <button
              onClick={() => setActiveTab('kinder')}
              className={`flex-1 min-w-[130px] py-2.5 sm:py-3 text-xs sm:text-sm font-bold rounded-xl ${
                activeTab === 'kinder' ? 'bg-white shadow text-stone-800' : 'text-stone-600'
              }`}
            >
              🌳 Kinder (5 - 7 th)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {activeTab === 'toddler' && (
              <>
                <GameCard title="Bel Sensorik Lembut" desc="Sentuh bilah nada marimba kayu" icon="🔔" onPlay={() => setActiveGame('bells')} />
                <GameCard title="Kanvas Lukis Jari" desc="Coretan warna ramah jari" icon="🎨" onPlay={() => setActiveGame('paint')} />
              </>
            )}
            {activeTab === 'preschool' && (
              <>
                <GameCard title="Sortir Kancing Mangkuk" desc="Klasifikasi warna kancing" icon="🔴" onPlay={() => setActiveGame('color_sort')} />
                <GameCard title="Susun Menara Pink" desc="Konsep ukuran balok besar ke kecil" icon="🧱" onPlay={() => setActiveGame('pink_tower')} />
              </>
            )}
            {activeTab === 'kinder' && (
              <>
                <GameCard title="Apel Angka Hilang" desc="Lengkapi deret angka apel" icon="🍎" onPlay={() => setActiveGame('missing_apples')} />
                <GameCard title="Anggota Tubuh" desc="Pasangkan nama anatomi tubuh" icon="🧍" onPlay={() => setActiveGame('body_parts')} />
              </>
            )}
          </div>
        </>
      ) : (
        <div>
          <button
            onClick={() => setActiveGame(null)}
            className="mb-3 sm:mb-5 inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-200/90 text-stone-700 font-bold rounded-xl text-xs sm:text-sm hover:bg-stone-300"
          >
            ← Kembali ke Menu
          </button>

          <Suspense fallback={<div className="p-8 text-center text-stone-500 font-bold">Memuat Game... ⏳</div>}>
            {activeGame === 'bells' && <SensoryBellsGame onWin={addStar} />}
            {activeGame === 'paint' && <FingerPaintGame onWin={addStar} />}
            {activeGame === 'color_sort' && <ColorSortingGame onWin={addStar} />}
            {activeGame === 'pink_tower' && <PinkTowerGame onWin={addStar} />}
            {activeGame === 'missing_apples' && <MissingApplesGame onWin={addStar} />}
            {activeGame === 'body_parts' && <BodyPartsGame onWin={addStar} />}
          </Suspense>
        </div>
      )}
    </div>
  );
}

function GameCard({ title, desc, icon, onPlay }) {
  return (
    <div
      onClick={onPlay}
      className="p-4 sm:p-5 bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-[0.98] flex items-center gap-3"
    >
      <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-2xl border border-amber-200 shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-stone-800 text-sm sm:text-base">{title}</h3>
        <p className="text-stone-500 text-[11px] sm:text-xs mt-0.5">{desc}</p>
        <span className="inline-block mt-2 text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg">
          Mulai Main →
        </span>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
