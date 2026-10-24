import React, { useState } from 'react';

export default function ColorSortingGame({ onWin }) {
  const [items, setItems] = useState([
    { id: 1, col: 'red' }, { id: 2, col: 'blue' },
    { id: 3, col: 'green' }, { id: 4, col: 'red' }, { id: 5, col: 'green' }
  ]);
  const [selected, setSelected] = useState(null);

  const handleBowl = (targetCol) => {
    if (!selected) return;
    if (selected.col === targetCol) {
      setItems(items.filter((i) => i.id !== selected.id));
      setSelected(null);
      if (items.length <= 1) onWin();
    } else {
      alert('Coba warna lain ya!');
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-stone-200 text-center">
      <h2 className="text-base sm:text-xl font-bold mb-4">🔴 Sortir Kancing ke Mangkuk</h2>
      <div className="flex justify-center gap-3 mb-6 min-h-[50px]">
        {items.map((i) => (
          <button
            key={i.id}
            onClick={() => setSelected(i)}
            className={`w-11 h-11 sm:w-14 sm:h-14 rounded-full font-bold text-white shadow transition-all ${
              i.col === 'red' ? 'bg-red-500' : i.col === 'blue' ? 'bg-blue-500' : 'bg-emerald-500'
            } ${selected?.id === i.id ? 'ring-4 ring-amber-400 scale-110' : ''}`}
          >
            ●
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {[
          { key: 'red', name: 'Merah', col: 'bg-red-100 border-red-400 text-red-800' },
          { key: 'blue', name: 'Biru', col: 'bg-blue-100 border-blue-400 text-blue-800' },
          { key: 'green', name: 'Hijau', col: 'bg-emerald-100 border-emerald-400 text-emerald-800' }
        ].map((b) => (
          <div
            key={b.key}
            onClick={() => handleBowl(b.key)}
            className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-dashed cursor-pointer ${b.col} font-bold text-xs sm:text-base active:scale-95 transition-all`}
          >
            Mangkuk {b.name}
          </div>
        ))}
      </div>
    </div>
  );
}
