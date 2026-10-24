import React from 'react';

const playTone = (freq, duration = 0.4) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
};

export default function SensoryBellsGame({ onWin }) {
  const notes = [
    { name: 'Do', freq: 261.63, col: 'bg-rose-200 text-rose-800' },
    { name: 'Re', freq: 293.66, col: 'bg-orange-200 text-orange-800' },
    { name: 'Mi', freq: 329.63, col: 'bg-amber-200 text-amber-800' },
    { name: 'Fa', freq: 349.23, col: 'bg-emerald-200 text-emerald-800' },
    { name: 'Sol', freq: 392.00, col: 'bg-teal-200 text-teal-800' },
    { name: 'La', freq: 440.00, col: 'bg-sky-200 text-sky-800' },
    { name: 'Si', freq: 493.88, col: 'bg-indigo-200 text-indigo-800' },
    { name: 'Do²', freq: 523.25, col: 'bg-purple-200 text-purple-800' }
  ];
  return (
    <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-stone-200 text-center">
      <h2 className="text-base sm:text-xl font-bold mb-4">🎶 Bel Sensorik Kayu</h2>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3">
        {notes.map((n) => (
          <button
            key={n.name}
            onClick={() => { playTone(n.freq); onWin(); }}
            className={`${n.col} h-28 sm:h-48 rounded-xl sm:rounded-2xl font-black text-sm sm:text-lg active:scale-95 shadow-sm border border-black/10 flex items-end justify-center pb-3 sm:pb-5 transition-all`}
          >
            {n.name}
          </button>
        ))}
      </div>
    </div>
  );
}
