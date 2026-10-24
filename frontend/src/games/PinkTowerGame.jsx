import React, { useState } from 'react';

export default function PinkTowerGame({ onWin }) {
  const [tower, setTower] = useState([]);
  const blocks = [5, 4, 3, 2, 1];

  const addBlock = (size) => {
    const expected = tower.length + 1;
    if (size === (6 - expected)) {
      const nextTower = [...tower, size];
      setTower(nextTower);
      if (nextTower.length === 5) onWin();
    } else {
      alert('Pilih balok yang lebih besar dulu ya!');
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-stone-200 text-center">
      <h2 className="text-base sm:text-xl font-bold mb-3">🧱 Susun Menara Pink</h2>
      <div className="flex flex-col-reverse items-center justify-end h-52 sm:h-64 border-b-4 border-amber-700 mb-4 bg-stone-50 rounded-2xl p-2">
        {tower.map((size) => (
          <div
            key={size}
            style={{ width: `${size * 18 + 20}%`, maxWidth: `${size * 50}px`, height: '24px' }}
            className="bg-pink-400 border border-pink-500 rounded-md transition-all shadow-sm"
          />
        ))}
      </div>
      <div className="flex justify-center items-center gap-2 sm:gap-3 flex-wrap">
        {blocks.map((b) => (
          <button
            key={b}
            disabled={tower.includes(b)}
            onClick={() => addBlock(b)}
            className={`w-10 h-10 sm:w-14 sm:h-14 bg-pink-300 border border-pink-400 rounded-xl font-bold text-pink-900 transition-all ${
              tower.includes(b) ? 'opacity-20 cursor-not-allowed' : 'active:scale-95 shadow'
            }`}
          >
            {b}
          </button>
        ))}
      </div>
    </div>
  );
}
