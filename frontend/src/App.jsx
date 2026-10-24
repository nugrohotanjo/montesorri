import React, { useState, useEffect, lazy, Suspense, useMemo, useRef } from 'react';
import { BANK_GAMES } from './data/bankGames';
import { CURRICULUM_DATA } from './config/curriculum';
import { CUSTOM_GAMES } from './games/registry';
import { preloadGameAudio } from './utils/audioPlayer';
import { startBackgroundMusic, stopBackgroundMusic } from './utils/bgmPlayer';
import { recordGameCompletion } from './utils/activityTracker';
import { UI_TEXT, CURRICULUM_INFO } from './constants/translations';
import Header from './components/common/Header';
import GameCard from './components/common/GameCard';
import ParentalGate from './components/common/ParentalGate';
import ChildProfileModal from './components/profile/ChildProfileModal';
import ParentAnalyticsModal from './components/profile/ParentAnalyticsModal';
import LegalModal from './components/common/LegalModal';
import { secureStorage } from './utils/cryptoStorage';

const UniversalDragDropEngine = lazy(() => import('./components/engines/UniversalDragDropEngine'));

const getAgeMilestoneKey = (age) => {
  const numAge = Number(age);
  if (numAge <= 2.5) return 'toddler';
  if (numAge <= 4.5) return 'preschool';
  return 'kinder';
};

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('montessori_lang') || 'id');
  const [viewMode, setViewMode] = useState('curriculum');
  const [activeGame, setActiveGame] = useState(() => localStorage.getItem('montessori_game') || null);
  const [stars, setStars] = useState(() => Number(localStorage.getItem('montessori_stars') || 0));
  const [searchQuery, setSearchQuery] = useState('');
  // Cek apakah user sudah pernah menyetujui disclaimer sebelumnya
  const [isLegalOpen, setIsLegalOpen] = useState(() => {
    return localStorage.getItem('montessori_legal_accepted') !== 'true';
  });

  // Handler saat menutup modal legal
  const handleCloseLegal = () => {
    localStorage.setItem('montessori_legal_accepted', 'true');
    setIsLegalOpen(false);
  };

  // Mode Orang Tua & Modal Laporan
  const [isParentMode, setIsParentMode] = useState(() => localStorage.getItem('montessori_parent_mode') === 'true');
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  // Stopwatch pencatat durasi main
  const gameStartTimeRef = useRef(null);

  const [childProfile, setChildProfile] = useState(() => {
    try {
      const saved = secureStorage.getItem('montessori_child_profile');
      return saved ? JSON.parse(saved) : { name: 'Kano', age: 3, avatar: '🦁' };
    } catch {
      return { name: 'Kano', age: 3, avatar: '🦁' };
    }
  });

  const allowedMilestone = useMemo(() => getAgeMilestoneKey(childProfile.age), [childProfile.age]);
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('montessori_tab');
    return savedTab || allowedMilestone;
  });

  useEffect(() => {
    if (!isParentMode && activeTab !== allowedMilestone) {
      setActiveTab(allowedMilestone);
    }
  }, [allowedMilestone, isParentMode]);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [completedGames, setCompletedGames] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('montessori_completed_games') || '[]');
    } catch {
      return [];
    }
  });

  const [isParentGateOpen, setIsParentGateOpen] = useState(false);
  const [gateAction, setGateAction] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMusicOn, setIsMusicOn] = useState(() => localStorage.getItem('montessori_music_enabled') === 'true');

  const t = UI_TEXT[lang] || UI_TEXT.id;

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement || !!document.webkitFullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('montessori_tab', activeTab);
    if (activeGame) localStorage.setItem('montessori_game', activeGame);
    else localStorage.removeItem('montessori_game');
    localStorage.setItem('montessori_stars', stars);
    localStorage.setItem('montessori_parent_mode', String(isParentMode));
  }, [activeTab, activeGame, stars, isParentMode]);

  const handleFirstInteraction = () => {
    preloadGameAudio();
    if (isMusicOn) {
      startBackgroundMusic();
    }
  };

  const toggleLanguage = () => {
    const nextLang = lang === 'id' ? 'en' : 'id';
    setLang(nextLang);
    localStorage.setItem('montessori_lang', nextLang);
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

  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(() => {});
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };

  const handleToggleParentMode = () => {
    if (isParentMode) {
      setIsParentMode(false);
      setActiveTab(allowedMilestone);
    } else {
      setGateAction('enable_parent_mode');
      setIsParentGateOpen(true);
    }
  };

  const handleFullscreenToggle = () => {
    if (isFullscreen) {
      if (isParentMode) {
        exitFullscreen();
      } else {
        setGateAction('exit_fullscreen');
        setIsParentGateOpen(true);
      }
    } else {
      enterFullscreen();
    }
  };

  const handleOpenEditProfile = () => {
    if (isParentMode) {
      setIsProfileModalOpen(true);
    } else {
      setGateAction('edit_profile');
      setIsParentGateOpen(true);
    }
  };

  const handleSaveProfile = (newProfile) => {
    setChildProfile(newProfile);
    secureStorage.setItem('montessori_child_profile', JSON.stringify(newProfile));
    setIsProfileModalOpen(false);
    if (!isParentMode) {
      setActiveTab(getAgeMilestoneKey(newProfile.age));
    }
  };

  // Mulai game sekaligus nyalakan stopwatch pencatat waktu
  const handleStartGame = (gameId) => {
    enterFullscreen();
    setActiveGame(gameId);
    gameStartTimeRef.current = Date.now();
  };

  const isCurrentGameCompleted = activeGame && completedGames.includes(activeGame);

  const handleRequestBack = () => {
    if (isParentMode || isCurrentGameCompleted) {
      setActiveGame(null);
      gameStartTimeRef.current = null;
    } else {
      setGateAction('back_to_menu');
      setIsParentGateOpen(true);
    }
  };

  const handleUnlockSuccess = () => {
    setIsParentGateOpen(false);

    if (gateAction === 'enable_parent_mode') {
      setIsParentMode(true);
    } else if (gateAction === 'exit_fullscreen') {
      exitFullscreen();
    } else if (gateAction === 'back_to_menu') {
      setActiveGame(null);
      gameStartTimeRef.current = null;
    } else if (gateAction === 'edit_profile') {
      setIsProfileModalOpen(true);
    } else if (gateAction === 'open_bank') {
      setViewMode('bank');
    }
    setGateAction(null);
  };

  // Callback saat anak berhasil menyelesaikan game
  const handleGameWin = () => {
    setStars((prev) => prev + 1);

    // Hitung durasi bermain dalam detik
    if (gameStartTimeRef.current && activeGame) {
      const elapsedSeconds = (Date.now() - gameStartTimeRef.current) / 1000;
      recordGameCompletion(activeGame, elapsedSeconds);
      // Reset titik waktu untuk ronde berikutnya jika dimainkan ulang
      gameStartTimeRef.current = Date.now();
    }

    if (activeGame && !completedGames.includes(activeGame)) {
      const nextCompleted = [...completedGames, activeGame];
      setCompletedGames(nextCompleted);
      localStorage.setItem('montessori_completed_games', JSON.stringify(nextCompleted));
    }
  };

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

  const isTabLocked = (tabKey) => {
    if (isParentMode) return false;
    return tabKey !== allowedMilestone;
  };

  return (
    <div
      onClick={handleFirstInteraction}
      className="w-full max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 min-h-screen"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1">
          <Header
            childProfile={childProfile}
            onOpenProfile={handleOpenEditProfile}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleFullscreenToggle}
            lang={lang}
            onToggleLang={toggleLanguage}
            isMusicOn={isMusicOn}
            onToggleMusic={toggleMusic}
            isParentMode={isParentMode}
            onToggleParentMode={handleToggleParentMode}
          />
        </div>

        {/* Tombol Laporan Statistik (Hanya muncul saat Parent Mode aktif) */}
        {isParentMode && !activeGame && (
          <button
            onClick={() => setIsAnalyticsOpen(true)}
            title="Lihat Laporan & Rekor Anak"
            className="mb-4 sm:mb-6 h-10 px-3 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-2xl shadow-xs transition active:scale-95 flex items-center gap-1.5"
          >
            <span>📊</span>
            <span className="hidden sm:inline">Laporan</span>
          </button>
        )}
      </div>

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
                onClick={() => {
                  if (isParentMode) {
                    setViewMode('bank');
                  } else {
                    setGateAction('open_bank');
                    setIsParentGateOpen(true);
                  }
                }}
                className={`px-4 sm:px-6 py-2 text-xs sm:text-sm font-black rounded-xl transition flex items-center gap-1.5 ${
                  viewMode === 'bank' ? 'bg-amber-500 text-white shadow' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {!isParentMode && <span>🔒</span>}
                <span>{t.tabBank} ({BANK_GAMES.length})</span>
              </button>
            </div>
          </div>

          {viewMode === 'curriculum' ? (
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 p-1.5 bg-stone-200/70 rounded-2xl mb-4 sm:mb-8 select-none">
              {['toddler', 'preschool', 'kinder'].map((key) => {
                const milestone = t.milestones?.[key] || { name: key, age: '', icon: '🌱' };
                const locked = isTabLocked(key);
                const isActive = activeTab === key;

                return (
                  <button
                    key={key}
                    disabled={locked}
                    onClick={() => setActiveTab(key)}
                    className={`py-2 px-1 sm:py-2.5 sm:px-3 rounded-xl flex flex-col items-center justify-center transition-all relative ${
                      isActive
                        ? 'bg-white shadow-sm text-stone-900 ring-2 ring-amber-400/50 scale-[1.01]'
                        : locked
                        ? 'text-stone-400 opacity-60 cursor-not-allowed bg-stone-100/40'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-white/50 active:scale-95'
                    }`}
                  >
                    {/* Baris Atas: Ikon/Gembok + Nama Tahap */}
                    <div className="flex items-center gap-1 leading-tight text-center">
                      <span className="text-xs sm:text-base">
                        {locked ? '🔒' : milestone.icon}
                      </span>
                      <span className="font-black text-xs sm:text-sm tracking-tight">
                        {milestone.name}
                      </span>
                    </div>

                    {/* Baris Bawah: Rentang Usia */}
                    <span
                      className={`text-[9px] sm:text-[11px] font-semibold mt-0.5 leading-none px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-amber-100/70 text-amber-900 font-bold'
                          : 'text-stone-500'
                      }`}
                    >
                      {milestone.age}
                    </span>
                  </button>
                );
              })}
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
                  isCompleted={completedGames.includes(game.id)}
                  completedLabel={t.completedBadge}
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
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 font-bold rounded-xl text-xs sm:text-sm shadow-sm transition active:scale-95 ${
                isParentMode || isCurrentGameCompleted
                  ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                  : 'bg-stone-200/90 hover:bg-stone-300 text-stone-700'
              }`}
            >
              <span>{isParentMode ? '🔓' : isCurrentGameCompleted ? '✓' : '🔒'}</span>
              <span>{t.backBtn}</span>
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
              <CustomGameComponent onWin={handleGameWin} lang={lang} />
            ) : currentBankGame && currentBankGame.engine === 'drag_drop' ? (
              <UniversalDragDropEngine config={currentBankGame.config} onWin={handleGameWin} lang={lang} />
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
        onClose={() => {
          setIsParentGateOpen(false);
          setGateAction(null);
        }}
        onSuccess={handleUnlockSuccess}
      />

      {/* Child Profile Modal */}
      <ChildProfileModal
        isOpen={isProfileModalOpen}
        initialProfile={childProfile}
        lang={lang}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={handleSaveProfile}
      />

      {/* Parent Analytics Report Modal */}
      <ParentAnalyticsModal
        isOpen={isAnalyticsOpen}
        lang={lang}
        onClose={() => setIsAnalyticsOpen(false)}
      />

        {/* Footer Minimalis */}
      {!activeGame && (
        <footer className="mt-8 pt-4 pb-6 border-t border-stone-200/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-400 select-none">
          <div>
            © {new Date().getFullYear()} Montessori Playroom. {lang === 'en' ? 'Screen-time conscious play.' : 'Media bermain sadar screen time.'}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLegalOpen(true)}
              className="hover:text-stone-700 underline underline-offset-2 transition font-medium"
            >
              {lang === 'en' ? 'Terms & Disclaimer' : 'Ketentuan & Penafian'}
            </button>
            <span>•</span>
            <span>{lang === 'en' ? 'Local Storage Only' : '100% Data Lokal'}</span>
          </div>
        </footer>
      )}

      <LegalModal
        isOpen={isLegalOpen}
        lang={lang}
        isFirstVisit={localStorage.getItem('montessori_legal_accepted') !== 'true'}
        onClose={handleCloseLegal}
      />

    </div>
  );
}