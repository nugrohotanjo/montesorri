import React, { useState, useEffect } from 'react';

const GENERATE_CHALLENGE = () => {
  const isAdd = Math.random() > 0.5;

  if (isAdd) {
    const a = Math.floor(Math.random() * 8) + 2; // 2 - 9
    const b = Math.floor(Math.random() * 8) + 2; // 2 - 9
    return { q: `${a} + ${b}`, answer: String(a + b) };
  }

  const a = Math.floor(Math.random() * 6) + 4; // 4 - 9
  const b = Math.floor(Math.random() * (a - 1)) + 1; // 1 s/d (a - 1)
  return { q: `${a} − ${b}`, answer: String(a - b) };
};

export default function ParentalGate({ isOpen, onSuccess, onClose, lang = 'id' }) {
  const [challenge, setChallenge] = useState({ q: '', answer: '' });
  const [inputVal, setInputVal] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setChallenge(GENERATE_CHALLENGE());
      setInputVal('');
      setError(false);
    }
  }, [isOpen]);

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
      setChallenge(GENERATE_CHALLENGE());
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
            ? 'Berapa hasil dari:'
            : 'What is:'}
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
            placeholder={lang === 'id' ? 'Jawaban' : 'Answer'}
            className="w-full text-center py-2.5 px-4 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-800 text-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
          />

          {error && (
            <p className="text-xs font-bold text-rose-500 animate-shake">
              {lang === 'id' ? 'Salah, coba soal baru!' : 'Wrong, try new question!'}
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