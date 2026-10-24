import React, { useState } from 'react';
import { playKidVoice } from '../utils/audioPlayer';

// Kamus Teks Antarmuka Bilingual
const SENSORY_BELLS_TEXT = {
  id: {
    title: '🎶 Bel Sensorik Kayu',
    subtitle: 'Sentuh setiap bel untuk mendengarkan tangga nada!',
    winTitle: '🎉 Hore! Kamu sudah mencoba semua nada!',
    playAgain: 'Main Lagi ↺'
  },
  en: {
    title: '🎶 Wooden Sensory Bells',
    subtitle: 'Tap each bell to listen to the musical scale!',
    winTitle: '🎉 Awesome! You explored all musical tones!',
    playAgain: 'Play Again ↺'
  }
};

const playTone = (freq, duration = 0.45) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle'; // Nada hangat khas kayu / bel Montessori
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Abaikan batasan autoplay browser
  }
};

export default function SensoryBellsGame({ onWin, lang = 'id' }) {
  const t = SENSORY_BELLS_TEXT[lang] || SENSORY_BELLS_TEXT.id;

  // Lacak nada mana saja yang sudah dibunyikan
  const [rungNotes, setRungNotes] = useState([]);
  const [celebrate, setCelebrate] = useState(false);

  const notes = [
    { id: 'c4', solfege: 'Do', note: 'C', freq: 261.63, col: 'bg-rose-200 hover:bg-rose-300 text-rose-900 border-rose-300' },
    { id: 'd4', solfege: 'Re', note: 'D', freq: 293.66, col: 'bg-orange-200 hover:bg-orange-300 text-orange-900 border-orange-300' },
    { id: 'e4', solfege: 'Mi', note: 'E', freq: 329.63, col: 'bg-amber-200 hover:bg-amber-300 text-amber-900 border-amber-300' },
    { id: 'f4', solfege: 'Fa', note: 'F', freq: 349.23, col: 'bg-emerald-200 hover:bg-emerald-300 text-emerald-900 border-emerald-300' },
    { id: 'g4', solfege: 'Sol', note: 'G', freq: 392.00, col: 'bg-teal-200 hover:bg-teal-300 text-teal-900 border-teal-300' },
    { id: 'a4', solfege: 'La', note: 'A', freq: 440.00, col: 'bg-sky-200 hover:bg-sky-300 text-sky-900 border-sky-300' },
    { id: 'b4', solfege: 'Si', note: 'B', freq: 493.88, col: 'bg-indigo-200 hover:bg-indigo-300 text-indigo-900 border-indigo-300' },
    { id: 'c5', solfege: 'Do²', note: 'C²', freq: 523.25, col: 'bg-purple-200 hover:bg-purple-300 text-purple-900 border-purple-300' }
  ];

  const handleRing = (n) => {
    playTone(n.freq);

    if (celebrate) return;

    if (!rungNotes.includes(n.id)) {
      const nextRung = [...rungNotes, n.id];
      setRungNotes(nextRung);

      // Selesai jika anak sudah membunyikan seluruh 8 bel
      if (nextRung.length === notes.length) {
        setCelebrate(true);
        playKidVoice('win', lang);
        if (onWin) onWin();
      }
    }
  };

  const handleReset = () => {
    setRungNotes([]);
    setCelebrate(false);
  };

  return (
    <div className="bg-amber-50/70 border-2 border-amber-200/80 rounded-3xl p-4 sm:p-7 max-w-3xl mx-auto shadow-inner text-center select-none">
      <h2 className="text-xl sm:text-2xl font-black text-amber-950">{t.title}</h2>
      <p className="text-xs sm:text-sm text-stone-600 mt-1 mb-6">{t.subtitle}</p>

      {/* Grid 8 Bel Tangga Nada */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3 mb-6">
        {notes.map((n) => {
          const isPlayed = rungNotes.includes(n.id);
          return (
            <button
              key={n.id}
              onClick={() => handleRing(n)}
              className={`${n.col} h-28 sm:h-48 rounded-2xl font-black text-sm sm:text-base active:scale-95 shadow-sm border flex flex-col justify-between items-center p-2.5 sm:py-4 transition-all will-change-transform ${
                isPlayed ? 'ring-2 ring-amber-400 ring-offset-2' : 'opacity-85'
              }`}
            >
              <span className="text-lg sm:text-xl">🔔</span>
              <div>
                <span className="block text-xs font-bold opacity-75">{n.note}</span>
                <span className="block text-base sm:text-lg font-black">{n.solfege}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Notifikasi Menang Saat Semua Nada Dieksplorasi */}
      {celebrate && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center animate-in fade-in zoom-in duration-200">
          <p className="text-base sm:text-lg font-black text-emerald-800">{t.winTitle}</p>
          <button
            onClick={handleReset}
            className="mt-3 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow transition active:scale-95"
          >
            {t.playAgain}
          </button>
        </div>
      )}
    </div>
  );
}