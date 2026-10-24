import React, { useState, useRef } from 'react';

// Web Audio API Synthesizer
const playSound = (type, pitchMultiplier = 1) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'pickup') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'snap') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320 * pitchMultiplier, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'win') {
      const notes = [392.0, 523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.09);
        g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.09 + 0.3);
        o.start(ctx.currentTime + idx * 0.09);
        o.stop(ctx.currentTime + idx * 0.09 + 0.3);
      });
    }
  } catch (e) {
    // Abaikan pembatasan audio browser
  }
};

const INITIAL_BLOCKS = [
  { val: 5, widthClass: 'w-64 sm:w-72', colorClass: 'bg-rose-500 border-rose-600', label: '5' },
  { val: 4, widthClass: 'w-52 sm:w-60', colorClass: 'bg-rose-400 border-rose-500', label: '4' },
  { val: 3, widthClass: 'w-40 sm:w-48', colorClass: 'bg-pink-400 border-pink-500', label: '3' },
  { val: 2, widthClass: 'w-28 sm:w-36', colorClass: 'bg-pink-300 border-pink-400', label: '2' },
  { val: 1, widthClass: 'w-16 sm:w-24', colorClass: 'bg-pink-200 border-pink-300 text-pink-900', label: '1' }
];

export default function PinkTowerGame({ onWin }) {
  const [availableBlocks, setAvailableBlocks] = useState(() =>
    [...INITIAL_BLOCKS].sort(() => Math.random() - 0.5)
  );
  const [tower, setTower] = useState([]);
  const [draggingBlock, setDraggingBlock] = useState(null);
  const [touchPos, setTouchPos] = useState({ x: 0, y: 0 });
  const [isTouchDragging, setIsTouchDragging] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [wrongShake, setWrongShake] = useState(false);

  const dropZoneRef = useRef(null);
  const nextRequired = 5 - tower.length;

  const handlePlaceBlock = (block) => {
    if (!block) return;

    if (block.val === nextRequired) {
      playSound('snap', 1 + (5 - block.val) * 0.15);
      const nextTower = [...tower, block];
      setTower(nextTower);
      setAvailableBlocks((prev) => prev.filter((b) => b.val !== block.val));
      setDraggingBlock(null);

      if (nextTower.length === 5) {
        setTimeout(() => {
          playSound('win');
          setCelebrate(true);
          if (onWin) onWin();
        }, 300);
      }
    } else {
      playSound('wrong');
      setWrongShake(true);
      setTimeout(() => setWrongShake(false), 400);
      setDraggingBlock(null);
    }
  };

  // --- Handlers untuk Desktop (HTML5 Drag & Drop) ---
  const handleDragStart = (block) => {
    setDraggingBlock(block);
    playSound('pickup');
  };

  // --- Handlers untuk Mobile / Layar Sentuh ---
  const handleTouchStart = (e, block) => {
    const touch = e.touches[0];
    setDraggingBlock(block);
    setTouchPos({ x: touch.clientX, y: touch.clientY });
    setIsTouchDragging(true);
    playSound('pickup');
  };

  const handleTouchMove = (e) => {
    if (!isTouchDragging) return;
    const touch = e.touches[0];
    setTouchPos({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e) => {
    if (!isTouchDragging || !draggingBlock) return;

    const touch = e.changedTouches[0];
    const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropTarget = dropZoneRef.current;

    if (dropTarget && (dropTarget === elemBelow || dropTarget.contains(elemBelow))) {
      handlePlaceBlock(draggingBlock);
    }

    setIsTouchDragging(false);
    setDraggingBlock(null);
  };

  const handleReset = () => {
    setTower([]);
    setAvailableBlocks([...INITIAL_BLOCKS].sort(() => Math.random() - 0.5));
    setCelebrate(false);
    setDraggingBlock(null);
    setIsTouchDragging(false);
  };

  return (
    <div 
      className="bg-rose-50/70 border-2 border-rose-200/80 rounded-3xl p-4 sm:p-7 max-w-2xl mx-auto shadow-inner select-none touch-none"
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="text-center mb-5">
        <h2 className="text-xl sm:text-2xl font-black text-rose-950">🧱 Menara Pink Montessori</h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Tarik balok dari yang <strong className="text-rose-700">paling panjang (5)</strong> sampai yang <strong className="text-rose-700">paling pendek (1)</strong>!
        </p>
      </div>

      {/* Area Drop Menara */}
      <div
        ref={dropZoneRef}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => handlePlaceBlock(draggingBlock)}
        className="min-h-[300px] flex flex-col-reverse items-center justify-start p-4 bg-white/80 rounded-2xl border-2 border-dashed border-rose-300 relative mb-6"
      >
        {/* Alas Kayu Bawah */}
        <div className="w-72 sm:w-80 h-3.5 bg-amber-800/80 rounded-full shadow-sm mt-1" />

        {/* Balok yang Terpasang */}
        {tower.map((block) => (
          <div
            key={block.val}
            className={`${block.widthClass} h-12 ${block.colorClass} border-2 ${block.val === 1 ? 'text-pink-950' : 'text-white'} font-black text-lg flex items-center justify-center rounded-xl shadow-sm`}
          >
            {block.label}
          </div>
        ))}

        {tower.length === 0 && (
          <span className="text-xs text-rose-400 font-bold mb-10">
            Tarik balok angka 5 ke sini untuk alas pondasi!
          </span>
        )}
      </div>

      {/* Area Balok yang Tersedia */}
      <div className="bg-white/90 border border-stone-200 rounded-2xl p-4 min-h-[110px] flex flex-col items-center justify-center">
        {celebrate ? (
          <div className="text-center py-2">
            <p className="text-lg font-black text-emerald-600">🎉 Hore! Menara Pink berdiri kokoh dan rapi!</p>
            <button
              onClick={handleReset}
              className="mt-3 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-black text-sm rounded-xl shadow transition"
            >
              Susun Lagi ↺
            </button>
          </div>
        ) : (
          <div className={`w-full flex flex-wrap items-center justify-center gap-3 ${wrongShake ? 'animate-pulse' : ''}`}>
            {availableBlocks.map((block) => (
              <div
                key={block.val}
                draggable
                onDragStart={() => handleDragStart(block)}
                onTouchStart={(e) => handleTouchStart(e, block)}
                className={`${block.widthClass} h-12 ${block.colorClass} hover:brightness-105 active:scale-95 ${block.val === 1 ? 'text-pink-950' : 'text-white'} font-black text-base flex items-center justify-center rounded-xl shadow cursor-grab active:cursor-grabbing border-2 transition-transform`}
                title={`Balok Angka ${block.label}`}
              >
                {block.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Elemen Bayangan Balok Saat Diseret di Layar HP */}
      {isTouchDragging && draggingBlock && (
        <div
          style={{
            position: 'fixed',
            left: `${touchPos.x}px`,
            top: `${touchPos.y}px`,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 9999
          }}
          className={`${draggingBlock.widthClass} h-12 ${draggingBlock.colorClass} border-2 ${draggingBlock.val === 1 ? 'text-pink-950' : 'text-white'} font-black text-base flex items-center justify-center rounded-xl shadow-2xl opacity-90`}
        >
          {draggingBlock.label}
        </div>
      )}
    </div>
  );
}