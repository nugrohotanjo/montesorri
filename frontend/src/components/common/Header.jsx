import React from 'react';

export default function Header({
  childProfile,
  onOpenProfile,
  isFullscreen,
  onToggleFullscreen,
  lang,
  onToggleLang,
  isMusicOn,
  onToggleMusic,
  isParentMode,
  onToggleParentMode
}) {
  return (
    <header className="flex items-center justify-between gap-3 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xs border border-stone-200/80 mb-4 sm:mb-6 select-none">
      {/* Sisi Kiri: Profil Ramping & Judul */}
      <div className="flex items-center gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenProfile();
          }}
          title={isParentMode ? 'Ubah Profil' : 'Ubah Profil (Perlu PIN)'}
          className="flex items-center gap-2 p-1 pr-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl transition active:scale-95 text-left"
        >
          <span className="text-xl leading-none">{childProfile.avatar}</span>
          <span className="text-xs font-black text-stone-700 max-w-[80px] sm:max-w-[120px] truncate">
            {childProfile.name}
          </span>
          <span className="text-[10px] text-stone-400">✏️</span>
        </button>

        <div className="hidden sm:block">
          <h1 className="text-sm font-black text-stone-800 leading-tight">
            🌿 Montessori Playroom
          </h1>
        </div>
      </div>

      {/* Sisi Kanan: Action Icons Minimalis */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Toggle Mode Ortu */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleParentMode();
          }}
          title={isParentMode ? 'Parent Mode ON (Klik untuk mengunci)' : 'Parent Mode OFF'}
          className={`h-9 px-2.5 rounded-xl border text-xs font-black flex items-center gap-1 transition active:scale-95 ${
            isParentMode
              ? 'bg-rose-50 border-rose-300 text-rose-700 ring-1 ring-rose-200'
              : 'bg-stone-50 border-stone-200 text-stone-400 hover:text-stone-700'
          }`}
        >
          <span>{isParentMode ? '🔓' : '🔒'}</span>
          <span className="hidden md:inline">{isParentMode ? 'Parent' : ''}</span>
        </button>

        {/* Music (Icon Only) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleMusic();
          }}
          title={isMusicOn ? 'Matikan Musik' : 'Nyalakan Musik'}
          className={`w-9 h-9 flex items-center justify-center rounded-xl border text-sm transition active:scale-95 ${
            isMusicOn
              ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-xs'
              : 'bg-stone-50 border-stone-200 text-stone-400 hover:text-stone-600'
          }`}
        >
          {isMusicOn ? '🎵' : '🔇'}
        </button>

        {/* Switch Bahasa */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLang();
          }}
          title="Ganti Bahasa"
          className="h-9 px-2.5 flex items-center gap-1 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-black text-stone-700 transition active:scale-95"
        >
          <span>{lang === 'id' ? '🇮🇩' : '🇬🇧'}</span>
          <span className="text-[11px] font-bold">{lang.toUpperCase()}</span>
        </button>

        {/* Fullscreen (Icon Only) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFullscreen();
          }}
          title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
          className={`w-9 h-9 flex items-center justify-center rounded-xl border text-xs transition active:scale-95 ${
            isFullscreen
              ? 'bg-amber-100 border-amber-300 text-amber-900'
              : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
          }`}
        >
          {isFullscreen ? '🗗' : '⛶'}
        </button>
      </div>
    </header>
  );
}