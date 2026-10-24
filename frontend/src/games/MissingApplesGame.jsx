import React, { useState } from 'react';

export default function MissingApplesGame({ onWin }) {
  const [answers, setAnswers] = useState({});
  const [selectedOpt, setSelectedOpt] = useState(null);
  const data = [
    { val: 1, missing: false }, { val: 2, missing: true },
    { val: 3, missing: false }, { val: 4, missing: true },
    { val: 5, missing: false }, { val: 6, missing: true },
    { val: 7, missing: false }, { val: 8, missing: true },
    { val: 9, missing: false }, { val: 10, missing: false }
  ];

  const handlePlace = (item) => {
    if (!item.missing || answers[item.val] || selectedOpt === null) return;
    if (selectedOpt === item.val) {
      const next = { ...answers, [item.val]: selectedOpt };
      setAnswers(next);
      setSelectedOpt(null);
      if (Object.keys(next).length === 4) onWin();
    } else {
      alert('Kurang pas angkanya!');
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-stone-200 text-center">
      <h2 className="text-base sm:text-xl font-bold mb-4">🍎 Apel Angka Hilang</h2>
      <div className="grid grid-cols-5 gap-1.5 sm:gap-3 mb-5">
        {data.map((item) => (
          <div
            key={item.val}
            onClick={() => handlePlace(item)}
            className={`h-14 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-sm sm:text-xl border-2 transition-all cursor-pointer ${
              item.missing
                ? answers[item.val]
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                  : 'bg-amber-50 border-dashed border-amber-400 text-amber-500'
                : 'bg-red-100 border-red-300 text-red-800'
            }`}
          >
            {item.missing ? (answers[item.val] || '?') : item.val}
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2 sm:gap-3">
        {[2, 4, 6, 8].map((n) => (
          <button
            key={n}
            onClick={() => setSelectedOpt(n)}
            className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl font-bold text-sm sm:text-lg border-2 ${
              selectedOpt === n ? 'bg-amber-800 text-white border-amber-900' : 'bg-stone-100 border-stone-300'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
