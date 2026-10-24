import React, { useState, useEffect, useRef } from 'react';

// Audio Synthesizer sederhana (Web Audio API) tanpa file eksternal
const playSound = (type) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'pickup') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'snap') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'win') {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.1);
        g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.1 + 0.3);
        o.start(ctx.currentTime + idx * 0.1);
        o.stop(ctx.currentTime + idx * 0.1 + 0.3);
      });
    }
  } catch (e) {
    // Abaikan jika browser memblokir audio sebelum interaksi
  }
};

const SHAPES = [
  { id: 'circle', name: 'Lingkaran', symbol: '●', color: 'text-rose-500 bg-rose-100 border-rose-300' },
  { id: 'square', name: 'Persegi', symbol: '■', color: 'text-amber-500 bg-amber-100 border-amber-300' },
  { id: 'triangle', name: 'Segitiga', symbol: '▲', color: 'text-emerald-500 bg-emerald-100 border-emerald-300' },
  { id: 'star', name: 'Bintang', symbol: '★', color: 'text-sky-500 bg-sky-100 border-sky-300' }
];

export default function ShapePuzzleGame({ onWin }) {
  const [placed, setPlaced] = useState([]);
  const [draggingShape, setDraggingShape] = useState(null);
  const [celebrate, setCelebrate] = useState(false);

  const handleDragStart = (shapeId) => {
    setDraggingShape(shapeId);
    playSound('pickup');
  };

  const handleDrop = (targetShapeId) => {
    if (draggingShape === targetShapeId && !placed.includes(targetShapeId)) {
      const nextPlaced = [...placed, targetShapeId];
      setPlaced(nextPlaced);
      setDraggingShape(null);
      playSound('snap');

      if (nextPlaced.length === SHAPES.length) {
        setTimeout(() => {
          playSound('win');
          setCelebrate(true);
          if (onWin) onWin();
        }, 300);
      }
    }
    setDraggingShape(null);
  };

  const resetGame = () => {
    setPlaced([]);
    setCelebrate(false);
    setDraggingShape(null);
  };

  return (
    <div className="bg-amber-50/70 border-2 border-amber-200/80 rounded-3xl p-5 sm:p-8 max-w-3xl mx-auto shadow-inner select-none">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-amber-950">🪵 Papan Puzzle Bentuk Kayu</h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">Tarik bentuk kayu ke lubang bayangannya!</p>
      </div>

      {/* Area Lubang Kayu (Drop Target) */}
      <div className="bg-[#e8d8be] border-4 border-[#bca17c] p-6 rounded-2xl shadow-inner grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {SHAPES.map((shape) => {
          const isDone = placed.includes(shape.id);
          return (
            <div
              key={shape.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(shape.id)}
              className={`h-28 sm:h-32 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed transition-all ${
                isDone
                  ? 'border-transparent bg-white/70 shadow-sm scale-95'
                  : 'border-stone-400 bg-stone-300/40'
              }`}
            >
              {isDone ? (
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl border-2 ${shape.color} shadow-sm animate-bounce`}>
                  {shape.symbol}
                </div>
              ) : (
                <span className="text-4xl text-stone-400/60 font-black">{shape.symbol}</span>
              )}
              <span className="text-[11px] font-bold text-stone-600 mt-2">{shape.name}</span>
            </div>
          );
        })}
      </div>

      {/* Area Kepingan Bentuk yang Dapat Diambil */}
      <div className="bg-white/90 border border-stone-200 rounded-2xl p-4 sm:p-6 min-h-[120px] flex items-center justify-center gap-4 flex-wrap">
        {celebrate ? (
          <div className="text-center py-2">
            <p className="text-lg font-black text-emerald-600">🎉 Hore! Semua bentuk sudah terpasang!</p>
            <button
              onClick={resetGame}
              className="mt-3 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-sm rounded-xl shadow transition"
            >
              Main Lagi ↺
            </button>
          </div>
        ) : (
          SHAPES.filter((s) => !placed.includes(s.id)).map((shape) => (
            <div
              key={shape.id}
              draggable
              onDragStart={() => handleDragStart(shape.id)}
              onClick={() => {
                // Alternatif klik langsung bagi perangkat mobile/touch screen
                handleDrop(shape.id);
              }}
              className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl border-2 cursor-grab active:cursor-grabbing active:scale-90 transition-transform shadow-md ${shape.color}`}
            >
              {shape.symbol}
            </div>
          ))
        )}
      </div>
    </div>
  );
}