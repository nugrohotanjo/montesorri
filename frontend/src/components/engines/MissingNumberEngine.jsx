import React, { useState } from 'react';

export default function MissingNumberEngine({ game, onBack }) {
  const [answers, setAnswers] = useState({});
  const [selectedOpt, setSelectedOpt] = useState(null);

  const handleSlotClick = (item) => {
    if (!item.isMissing || answers[item.id] || selectedOpt === null) return;
    
    if (selectedOpt === item.val) {
      setAnswers(prev => ({ ...prev, [item.id]: selectedOpt }));
      setSelectedOpt(null);
    } else {
      alert('Coba cari angka yang pas ya!');
    }
  };

  const isCompleted = game.items.filter(i => i.isMissing).every(i => answers[i.id]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/80 rounded-3xl shadow-sm border border-stone-200 mt-6">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-sm font-bold text-amber-800 bg-amber-100 px-4 py-2 rounded-xl">
          ← Kembali ke Menu
        </button>
        <h2 className="text-xl font-bold text-stone-800">{game.title}</h2>
      </div>

      {/* Grid Apel */}
      <div className="grid grid-cols-5 gap-3 mb-8">
        {game.items.map((item) => {
          const filled = answers[item.id];
          return (
            <div
              key={item.id}
              onClick={() => handleSlotClick(item)}
              className={`h-20 rounded-2xl flex items-center justify-center text-xl font-extrabold cursor-pointer border-2 transition-all ${
                item.isMissing
                  ? filled
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                    : 'bg-amber-50 border-dashed border-amber-400 text-amber-600 hover:scale-105'
                  : 'bg-rose-100 border-rose-300 text-rose-800'
              }`}
            >
              {item.isMissing ? (filled ? filled : '?') : item.val}
            </div>
          );
        })}
      </div>

      {/* Pilihan Angka */}
      <div className="p-4 bg-stone-100 rounded-2xl flex justify-center gap-3">
        {game.options.map((opt) => (
          <button
            key={opt}
            onClick={() => setSelectedOpt(opt)}
            className={`w-12 h-12 rounded-xl font-bold text-lg border-2 shadow-sm transition-all ${
              selectedOpt === opt ? 'bg-amber-700 text-white border-amber-800 scale-110' : 'bg-white text-stone-700 border-stone-300'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {isCompleted && (
        <div className="mt-6 p-4 bg-emerald-100 text-emerald-800 text-center font-bold rounded-2xl">
          🌟 Hebat! Semua angka berhasil dilengkapi!
        </div>
      )}
    </div>
  );
}
