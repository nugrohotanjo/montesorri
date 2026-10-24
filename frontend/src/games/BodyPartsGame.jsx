import React, { useState } from 'react';

export default function BodyPartsGame({ onWin }) {
  const parts = [
    { id: 'head', name: 'Head (Kepala)' },
    { id: 'eye', name: 'Eye (Mata)' },
    { id: 'nose', name: 'Nose (Hidung)' },
    { id: 'hand', name: 'Hand (Tangan)' },
    { id: 'foot', name: 'Foot (Kaki)' }
  ];
  const [placed, setPlaced] = useState({});
  const [selectedWord, setSelectedWord] = useState(null);

  const handleSlot = (id) => {
    if (placed[id] || !selectedWord) return;
    if (selectedWord.id === id) {
      const next = { ...placed, [id]: selectedWord.name };
      setPlaced(next);
      setSelectedWord(null);
      if (Object.keys(next).length === parts.length) onWin();
    } else {
      alert('Bukan bagian yang itu!');
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-stone-200 text-center">
      <h2 className="text-base sm:text-xl font-bold mb-4">🧍 Mengenal Bagian Tubuh</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-5">
        {parts.map((p) => (
          <div
            key={p.id}
            onClick={() => handleSlot(p.id)}
            className={`p-3 sm:p-4 rounded-xl border-2 border-dashed cursor-pointer font-bold text-xs sm:text-sm ${
              placed[p.id] ? 'bg-emerald-100 border-emerald-400 text-emerald-800' : 'bg-stone-50 border-stone-300'
            }`}
          >
            {placed[p.id] ? `✓ ${placed[p.id]}` : `[ Kotak Kosong: ${p.name.split(' ')[0]} ]`}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
        {parts.map((p) => (
          <button
            key={p.id}
            disabled={!!placed[p.id]}
            onClick={() => setSelectedWord(p)}
            className={`px-3 py-2 rounded-xl font-bold text-xs border ${
              placed[p.id]
                ? 'opacity-20 cursor-not-allowed'
                : selectedWord?.id === p.id
                ? 'bg-amber-800 text-white'
                : 'bg-stone-100 hover:bg-stone-200'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}
