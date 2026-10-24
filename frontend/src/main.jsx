import React, { useState, useEffect, lazy, Suspense, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { BANK_GAMES } from './data/bankGames';
import { CURRICULUM_DATA } from './config/curriculum';
import { CUSTOM_GAMES } from './games/registry';
import { preloadGameAudio } from './utils/audioPlayer';
import ParentalGate from './components/common/ParentalGate';

const UniversalDragDropEngine = lazy(() => import('./components/engines/UniversalDragDropEngine'));

// Kamus Teks Antarmuka (UI Translations)
const UI_TEXT = {
  id: {
    appTitle: '🌿 Montessori Playroom',
    appSubtitle: 'Eksplorasi sensorik & logika mandiri',
    musicOn: 'Musik ON',
    musicOff: 'Musik OFF',
    tabCurriculum: '🌱 Jalur Tahap Usia',
    tabBank: '🎮 Bank Semua Game',
    tabToddler: '🌱 Toddler (1 - 2.5 th)',
    tabPreschool: '🌿 Preschool (3 - 4.5 th)',
    tabKinder: '🌳 Kinder (5 - 7 th)',
    searchPlaceholder: 'Cari nama game atau materi...',
    playBtn: 'Mulai Main →',
    backBtn: 'Kembali ke Menu',
    loading: 'Memuat Game... ⏳',
    notFound: 'Game tidak ditemukan.',
    tryAnother: 'Coba gunakan kata kunci lain.',
    notAvailable: 'Game belum tersedia.'
  },
  en: {
    appTitle: '🌿 Montessori Playroom',
    appSubtitle: 'Sensory exploration & self-directed logic',
    musicOn: 'Music ON',
    musicOff: 'Music OFF',
    tabCurriculum: '🌱 Age Milestones',
    tabBank: '🎮 All Games Pool',
    tabToddler: '🌱 Toddler (1 - 2.5 yrs)',
    tabPreschool: '🌿 Preschool (3 - 4.5 yrs)',
    tabKinder: '🌳 Kinder (5 - 7 yrs)',
    searchPlaceholder: 'Search games or topics...',
    playBtn: 'Play Now →',
    backBtn: 'Back to Menu',
    loading: 'Loading Game... ⏳',
    notFound: 'Game not found.',
    tryAnother: 'Try searching with another keyword.',
    notAvailable: 'Game not yet available.'
  }
};

// Konfigurasi Label & Warna Badge Kurikulum Bilingual
const CURRICULUM_INFO = {
  toddler: {
    label: { id: 'Kurikulum Toddler (1 - 2.5 th)', en: 'Toddler Track (1 - 2.5 yrs)' },
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dotColor: 'bg-emerald-500'
  },
  preschool: {
    label: { id: 'Kurikulum Preschool (3 - 4.5 th)', en: 'Preschool Track (3 - 4.5 yrs)' },
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
    dotColor: 'bg-sky-500'
  },
  kinder: {
    label: { id: 'Kurikulum Kinder (5 - 7 th)', en: 'Kinder Track (5 - 7 yrs)' },
    badgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
    dotColor: 'bg-purple-500'
  }
};

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('montessori_lang') || 'id');
  const [viewMode, setViewMode] = useState('curriculum');
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('montessori_tab') || 'toddler');
  const [activeGame, setActiveGame] = useState(() => localStorage.getItem('montessori_game') || null);
  const [stars, setStars] = useState(() => Number(localStorage.getItem('montessori_stars') || 0));
  const [searchQuery, setSearchQuery] = useState('');
  const [isParentGateOpen, setIsParentGateOpen] = useState(false);
  
  const [isMusicOn, setIsMusicOn] = useState(() => localStorage.getItem('montessori_music_enabled') === 'true');

  const audioCtxRef = useRef(null);
  const isPlayingRef = useRef(false);
  const timerRef = useRef(null);

  const t = UI_TEXT[lang] || UI_TEXT.id;

  const toggleLanguage = () => {
    const nextLang = lang === 'id' ? 'en' : 'id';
    setLang(nextLang);
    localStorage.setItem('montessori_lang', nextLang);
  };

  const startBackgroundMusic = () => {
    if (isPlayingRef.current) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const melody = [
      261.63, 329.63, 392.00, 523.25,
      392.00, 329.63, 261.63, 392.00,
      329.63, 392.00, 440.00, 523.25,
      440.00, 392.00, 329.63, 293.66
    ];

    let noteIndex = 0;
    isPlayingRef.current = true;

    const playNote = () => {
      if (!isPlayingRef.current) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(melody[noteIndex], ctx.currentTime);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);

      noteIndex = (noteIndex + 1) % melody.length;
      timerRef.current = setTimeout(playNote, 320);
    };

    playNote();
  };

  const stopBackgroundMusic = () => {
    isPlayingRef.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const toggleMusic = () => {
    const nextState = !isMusicOn;
    setIsMusicOn(nextState);
    localStorage.setItem('montessori_music_enabled', String(nextState));

    if (nextState) {
      startBackgroundMusic();
    } else {
      stopBackgroundMusic();
    }
  };

  const handleFirstInteraction = () => {
    preloadGameAudio();
    if (isMusicOn && !isPlayingRef.current) {
      startBackgroundMusic();
    }
  };

  // Fullscreen Management
  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(() => {});
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else {
      // Trik untuk iPhone Safari: scroll 1px ke bawah untuk menyembunyikan address bar
      window.scrollTo(0, 1);
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleStartGame = (gameId) => {
    enterFullscreen();
    setActiveGame(gameId);
  };

  const handleRequestBack = () => {
    setIsParentGateOpen(true);
  };

  const handleUnlockSuccess = () => {
    setIsParentGateOpen(false);
    exitFullscreen();
    setActiveGame(null);
  };

  useEffect(() => {
    localStorage.setItem('montessori_tab', activeTab);
    if (activeGame) localStorage.setItem('montessori_game', activeGame);
    else localStorage.removeItem('montessori_game');
    localStorage.setItem('montessori_stars', stars);
  }, [activeTab, activeGame, stars]);

  const addStar = () => setStars((prev) => prev + 1);

  const currentBankGame = BANK_GAMES.find((g) => g.id === activeGame);
  const CustomGameComponent = CUSTOM_GAMES[activeGame];

  const getText = (textObj) => {
    if (!textObj) return '';
    if (typeof textObj === 'string') return textObj;
    return textObj[lang] || textObj.id || '';
  };

  const activeCurriculumKey = useMemo(() => {
    if (!activeGame) return null;
    if (currentBankGame?.category && CURRICULUM_INFO[currentBankGame.category]) {
      return currentBankGame.category;
    }
    for (const [catKey, list] of Object.entries(CURRICULUM_DATA)) {
      if (list.includes(activeGame)) return catKey;
    }
    return null;
  }, [activeGame, currentBankGame]);

  const activeCurriculum = activeCurriculumKey ? CURRICULUM_INFO[activeCurriculumKey] : null;

  const filteredBankGames = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return BANK_GAMES;
    return BANK_GAMES.filter((game) => {
      const title = getText(game.title).toLowerCase();
      const desc = getText(game.desc).toLowerCase();
      return title.includes(query) || desc.includes(query);
    });
  }, [searchQuery, lang]);

  const displayedGames = useMemo(() => {
    if (viewMode === 'curriculum') {
      const gameIds = CURRICULUM_DATA[activeTab] || [];
      return gameIds
        .map((id) => BANK_GAMES.find((g) => g.id === id))
        .filter(Boolean);
    }
    return filteredBankGames;
  }, [viewMode, activeTab, filteredBankGames]);

  return (
    <div
      onClick={handleFirstInteraction}
      className="w-full max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 min-h-screen"
    >
      <header className="flex items-center justify-between bg-white/95 backdrop-blur p-3 sm:p-5 rounded-2xl sm:rounded-3xl shadow-sm border border-stone-200 mb-4 sm:mb-6">
        <div>
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-black text-stone-800">{t.appTitle}</h1>
          <p className="text-[11px] sm:text-sm text-stone-500">{t.appSubtitle}</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLanguage();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs sm:text-sm font-black shadow-sm transition active:scale-95"
            title="Ganti Bahasa / Switch Language"
          >
            <span>{lang === 'id' ? '🇮🇩' : '🇬🇧'}</span>
            <span>{lang.toUpperCase()}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMusic();
            }}
            title={isMusicOn ? t.musicOff : t.musicOn}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl border text-xs sm:text-sm font-bold transition ${
              isMusicOn
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-stone-100 border-stone-300 text-stone-500'
            }`}
          >
            <span>{isMusicOn ? '🎵' : '🔇'}</span>
            <span className="hidden sm:inline">{isMusicOn ? t.musicOn : t.musicOff}</span>
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2 bg-amber-50 border border-amber-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl">
            <span>⭐</span>
            <span className="text-xs sm:text-base font-black text-amber-900">{stars}</span>
          </div>
        </div>
      </header>

      {!activeGame ? (
        <>
          <div className="flex justify-center mb-4">
            <div className="bg-stone-200 p-1 rounded-2xl flex gap-1 shadow-inner">
              <button
                onClick={() => setViewMode('curriculum')}
                className={`px-4 sm:px-6 py-2 text-xs sm:text-sm font-black rounded-xl transition ${
                  viewMode === 'curriculum' ? 'bg-white shadow text-stone-900' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {t.tabCurriculum}
              </button>
              <button
                onClick={() => setViewMode('bank')}
                className={`px-4 sm:px-6 py-2 text-xs sm:text-sm font-black rounded-xl transition ${
                  viewMode === 'bank' ? 'bg-amber-500 text-white shadow' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {t.tabBank} ({BANK_GAMES.length})
              </button>
            </div>
          </div>

          {viewMode === 'curriculum' ? (
            <div className="flex gap-2 p-1.5 bg-stone-200/80 rounded-2xl mb-4 sm:mb-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab('toddler')}
                className={`flex-1 min-w-[130px] py-2.5 sm:py-3 text-xs sm:text-sm font-bold rounded-xl ${
                  activeTab === 'toddler' ? 'bg-white shadow text-stone-800' : 'text-stone-600'
                }`}
              >
                {t.tabToddler}
              </button>
              <button
                onClick={() => setActiveTab('preschool')}
                className={`flex-1 min-w-[130px] py-2.5 sm:py-3 text-xs sm:text-sm font-bold rounded-xl ${
                  activeTab === 'preschool' ? 'bg-white shadow text-stone-800' : 'text-stone-600'
                }`}
              >
                {t.tabPreschool}
              </button>
              <button
                onClick={() => setActiveTab('kinder')}
                className={`flex-1 min-w-[130px] py-2.5 sm:py-3 text-xs sm:text-sm font-bold rounded-xl ${
                  activeTab === 'kinder' ? 'bg-white shadow text-stone-800' : 'text-stone-600'
                }`}
              >
                {t.tabKinder}
              </button>
            </div>
          ) : (
            <div className="mb-6 max-w-md mx-auto relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-base">🔍</span>
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-white border border-stone-200 rounded-2xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 text-stone-800 placeholder-stone-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-sm font-bold bg-stone-100 w-6 h-6 rounded-full flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {displayedGames.length === 0 ? (
            <div className="text-center py-12 bg-white/60 rounded-3xl border border-dashed border-stone-300 max-w-md mx-auto">
              <span className="text-4xl">🔍</span>
              <p className="text-stone-600 font-bold mt-2 text-sm">{t.notFound}</p>
              <p className="text-stone-400 text-xs mt-1">{t.tryAnother}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              {displayedGames.map((game) => (
                <GameCard
                  key={game.id}
                  title={getText(game.title)}
                  desc={getText(game.desc)}
                  icon={game.icon}
                  playLabel={t.playBtn}
                  onPlay={() => handleStartGame(game.id)}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div>
          <div className="flex items-center justify-between gap-2 mb-3 sm:mb-5">
            <button
              onClick={handleRequestBack}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-200/90 hover:bg-stone-300 text-stone-700 font-bold rounded-xl text-xs sm:text-sm shadow-sm transition active:scale-95"
            >
              🔒 {t.backBtn}
            </button>

            {activeCurriculum && (
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-black shadow-sm ${activeCurriculum.badgeClass}`}>
                <span className={`w-2 h-2 rounded-full ${activeCurriculum.dotColor}`} />
                <span>{getText(activeCurriculum.label)}</span>
              </div>
            )}
          </div>

          <Suspense fallback={<div className="p-8 text-center text-stone-500 font-bold">{t.loading}</div>}>
            {CustomGameComponent ? (
              <CustomGameComponent onWin={addStar} lang={lang} />
            ) : currentBankGame && currentBankGame.engine === 'drag_drop' ? (
              <UniversalDragDropEngine config={currentBankGame.config} onWin={addStar} lang={lang} />
            ) : (
              <div className="text-center py-12 text-stone-500 font-bold">{t.notAvailable}</div>
            )}
          </Suspense>
        </div>
      )}

      {/* Parental Gate Modal */}
      <ParentalGate
        isOpen={isParentGateOpen}
        lang={lang}
        onClose={() => setIsParentGateOpen(false)}
        onSuccess={handleUnlockSuccess}
      />
    </div>
  );
}

function GameCard({ title, desc, icon, playLabel, onPlay }) {
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
          {playLabel}
        </span>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);