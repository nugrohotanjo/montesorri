import React, { useState } from 'react';

export default function ParentalGate({ isOpen, onSuccess, onClose, lang = 'id' }) {
  const [inputVal, setInputVal] = useState('');
  const [error, setError] = useState(false);

  // Soal acak logika sederhana yang mudah untuk orang tua tapi sulit untuk batita
  const [challenge] = useState(() => {
    const num1 = Math.floor(Math.random() * 5) + 3; // 3 - 7
    const num2 = Math.floor(Math.random() * 5) + 2; // 2 - 6
    return {
      q: `${num1} + ${num2}`,
      answer: String(num1 + num2)
    };
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim() === challenge.answer) {
      setError(false);
      setInputVal('');
      onSuccess();
    } else {
      setError(true);
      setInputVal('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border-2 border-amber-300 text-center animate-in fade-in zoom-in duration-200">
        <span className="text-4xl">🔒</span>
        <h3 className="text-lg font-black text-stone-800 mt-2">
          {lang === 'id' ? 'Area Orang Tua' : 'Parental Lock'}
        </h3>
        <p className="text-xs text-stone-500 mt-1 mb-4">
          {lang === 'id' 
            ? `Buktikan kamu orang dewasa. Berapa hasil dari:` 
            : `Prove you are an adult. What is:`}
        </p>

        <div className="bg-amber-50 text-amber-900 text-2xl font-black py-3 rounded-2xl border border-amber-200 mb-4 tracking-widest">
          {challenge.q} = ?
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="number"
            autoFocus
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              setError(false);
            }}
            placeholder={lang === 'id' ? 'Masukkan jawaban' : 'Enter answer'}
            className="w-full text-center py-2.5 px-4 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-800 text-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
          />

          {error && (
            <p className="text-xs font-bold text-rose-500 animate-shake">
              {lang === 'id' ? 'Jawaban salah, coba lagi!' : 'Incorrect, try again!'}
            </p>
          )}

          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold rounded-xl text-xs transition"
            >
              {lang === 'id' ? 'Batal' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl text-xs shadow transition"
            >
              {lang === 'id' ? 'Buka Kunci' : 'Unlock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}