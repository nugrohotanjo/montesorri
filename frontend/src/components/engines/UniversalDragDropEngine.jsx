import React, { useState, useRef, useLayoutEffect } from 'react';

// Web Audio API Synthesizer
const playSound = (type, pitch = 1) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'shuffle') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(560, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } else if (type === 'pickup') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'snap') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440 * pitch, ctx.currentTime);
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
      const notes = [440, 554.37, 659.25, 880];
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
    // Abaikan batasan audio browser
  }
};

// Kamus Teks Bawaan Engine (Bisa di-override jika config menyediakan teks sendiri)
const ENGINE_UI_TEXT = {
  id: {
    shuffleBtn: 'Acak Posisi',
    shuffleTitle: 'Tukar dan acak posisi',
    winMessage: '🎉 Hore! Selesai dengan sempurna!',
    playAgain: 'Main Lagi ↺'
  },
  en: {
    shuffleBtn: 'Shuffle',
    shuffleTitle: 'Shuffle item & target order',
    winMessage: '🎉 Awesome! Completed perfectly!',
    playAgain: 'Play Again ↺'
  }
};

export default function UniversalDragDropEngine({ config, onWin, lang = 'id' }) {
  // Helper fleksibel membaca string biasa atau object { id, en }
  const t = (val) => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    return val[lang] || val.id || '';
  };

  const ui = ENGINE_UI_TEXT[lang] || ENGINE_UI_TEXT.id;

  const [targets, setTargets] = useState(() =>
    [...config.targets].sort(() => Math.random() - 0.5)
  );
  const [items, setItems] = useState(() =>
    [...config.items].sort(() => Math.random() - 0.5)
  );
  const [placedItemIds, setPlacedItemIds] = useState([]);
  const [draggingItem, setDraggingItem] = useState(null);
  const [touchPos, setTouchPos] = useState({ x: 0, y: 0 });
  const [isTouchDragging, setIsTouchDragging] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [shakeId, setShakeId] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  // Referensi DOM & Posisi Lama untuk FLIP Animation
  const targetsDomRef = useRef({});
  const itemsDomRef = useRef({});
  const prevPositionsRef = useRef({});

  // Eksekusi animasi FLIP setelah urutan state diperbarui
  useLayoutEffect(() => {
    const prevPositions = prevPositionsRef.current;
    if (Object.keys(prevPositions).length === 0) return;

    // Animasi pergeseran posisi Target
    targets.forEach((target) => {
      const el = targetsDomRef.current[target.id];
      const prevRect = prevPositions[`target-${target.id}`];
      if (el && prevRect) {
        const currentRect = el.getBoundingClientRect();
        const deltaX = prevRect.left - currentRect.left;
        const deltaY = prevRect.top - currentRect.top;

        if (deltaX !== 0 || deltaY !== 0) {
          el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
          el.style.transition = 'none';

          requestAnimationFrame(() => {
            el.style.transition = 'transform 380ms cubic-bezier(0.2, 0.9, 0.3, 1)';
            el.style.transform = '';
          });
        }
      }
    });

    // Animasi pergeseran posisi Balok/Item
    items.forEach((item) => {
      const el = itemsDomRef.current[item.id];
      const prevRect = prevPositions[`item-${item.id}`];
      if (el && prevRect) {
        const currentRect = el.getBoundingClientRect();
        const deltaX = prevRect.left - currentRect.left;
        const deltaY = prevRect.top - currentRect.top;

        if (deltaX !== 0 || deltaY !== 0) {
          el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
          el.style.transition = 'none';

          requestAnimationFrame(() => {
            el.style.transition = 'transform 380ms cubic-bezier(0.2, 0.9, 0.3, 1)';
            el.style.transform = '';
          });
        }
      }
    });

    prevPositionsRef.current = {};
  }, [targets, items]);

  const handleShuffle = () => {
    playSound('shuffle');
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 400);

    const positions = {};
    targets.forEach((target) => {
      const el = targetsDomRef.current[target.id];
      if (el) positions[`target-${target.id}`] = el.getBoundingClientRect();
    });
    items.forEach((item) => {
      const el = itemsDomRef.current[item.id];
      if (el) positions[`item-${item.id}`] = el.getBoundingClientRect();
    });
    prevPositionsRef.current = positions;

    setTargets((prev) => [...prev].sort(() => Math.random() - 0.5));
    setItems((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  const handlePlace = (item, targetId) => {
    if (!item) return;

    if (item.targetId === targetId) {
      playSound('snap', 1 + placedItemIds.length * 0.15);
      const nextPlaced = [...placedItemIds, item.id];
      setPlacedItemIds(nextPlaced);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setDraggingItem(null);

      if (nextPlaced.length === config.items.length) {
        setTimeout(() => {
          playSound('win');
          setCelebrate(true);
          if (onWin) onWin();
        }, 300);
      }
    } else {
      playSound('wrong');
      setShakeId(targetId);
      setTimeout(() => setShakeId(null), 400);
      setDraggingItem(null);
    }
  };

  // Drag Desktop Handlers
  const handleDragStart = (item) => {
    setDraggingItem(item);
    playSound('pickup');
  };

  // Touch Mobile Handlers
  const handleTouchStart = (e, item) => {
    const touch = e.touches[0];
    setDraggingItem(item);
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
    if (!isTouchDragging || !draggingItem) return;

    const touch = e.changedTouches[0];
    const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);

    const matchedTarget = targets.find((target) => {
      const el = targetsDomRef.current[target.id];
      return el && (el === elemBelow || el.contains(elemBelow));
    });

    if (matchedTarget) {
      handlePlace(draggingItem, matchedTarget.id);
    }

    setIsTouchDragging(false);
    setDraggingItem(null);
  };

  const handleReset = () => {
    setTargets([...config.targets].sort(() => Math.random() - 0.5));
    setItems([...config.items].sort(() => Math.random() - 0.5));
    setPlacedItemIds([]);
    setCelebrate(false);
    setDraggingItem(null);
    setIsTouchDragging(false);
  };

  return (
    <div
      className="bg-amber-50/70 border-2 border-amber-200/80 rounded-3xl p-4 sm:p-7 max-w-3xl mx-auto shadow-inner select-none touch-none"
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-black text-amber-950">{t(config.title)}</h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">{t(config.instruction)}</p>
        </div>

        {!celebrate && (
          <button
            onClick={handleShuffle}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs sm:text-sm font-black shadow-sm transition active:scale-95 shrink-0"
            title={ui.shuffleTitle}
          >
            <span
              className={`inline-block transition-transform duration-300 ${
                isSpinning ? 'rotate-180 scale-125' : ''
              }`}
            >
              🔀
            </span>
            <span>{ui.shuffleBtn}</span>
          </button>
        )}
      </div>

      {/* Grid Target Drop Zones */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {targets.map((target) => {
          const isOccupied = placedItemIds.some((id) => {
            const item = config.items.find((i) => i.id === id);
            return item && item.targetId === target.id;
          });
          const matchedItem = config.items.find((i) => i.targetId === target.id);

          return (
            <div
              key={target.id}
              ref={(el) => (targetsDomRef.current[target.id] = el)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handlePlace(draggingItem, target.id)}
              className={`h-28 sm:h-32 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed will-change-transform p-2 ${
                isOccupied
                  ? 'border-transparent bg-white shadow-sm'
                  : shakeId === target.id
                  ? 'border-rose-400 bg-rose-50 animate-pulse'
                  : 'border-stone-300 bg-white/50'
              }`}
            >
              {isOccupied && matchedItem ? (
                <div className="flex flex-col items-center">
                  <span className="text-3xl sm:text-4xl">{matchedItem.icon}</span>
                  <span className="text-xs font-bold text-stone-700 mt-1">{t(matchedItem.label)}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center opacity-40">
                  <span className="text-3xl">{target.placeholderIcon || '🎯'}</span>
                  <span className="text-[11px] font-bold text-stone-500 mt-1">{t(target.label)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Wadah Objek yang Bisa Diseret */}
      <div className="bg-white/90 border border-stone-200 rounded-2xl p-4 sm:p-6 min-h-[120px] flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
        {celebrate ? (
          <div className="text-center py-2">
            <p className="text-lg font-black text-emerald-600">{ui.winMessage}</p>
            <button
              onClick={handleReset}
              className="mt-3 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-sm rounded-xl shadow transition active:scale-95"
            >
              {ui.playAgain}
            </button>
          </div>
        ) : (
          <div className="w-full flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
            {items.map((item) => (
              <div
                key={item.id}
                ref={(el) => (itemsDomRef.current[item.id] = el)}
                draggable
                onDragStart={() => handleDragStart(item)}
                onTouchStart={(e) => handleTouchStart(e, item)}
                onClick={() => handlePlace(item, item.targetId)}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-white border-2 border-amber-300 hover:border-amber-400 rounded-2xl flex flex-col items-center justify-center shadow cursor-grab active:cursor-grabbing active:scale-95 will-change-transform"
              >
                <span className="text-2xl sm:text-3xl">{item.icon}</span>
                <span className="text-[10px] sm:text-[11px] font-bold text-stone-600 mt-0.5">{t(item.label)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bayangan Objek yang Mengikuti Jari Saat Diseret di HP */}
      {isTouchDragging && draggingItem && (
        <div
          style={{
            position: 'fixed',
            left: `${touchPos.x}px`,
            top: `${touchPos.y}px`,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 9999
          }}
          className="w-20 h-20 bg-white/95 border-2 border-amber-400 rounded-2xl flex flex-col items-center justify-center shadow-2xl opacity-90"
        >
          <span className="text-3xl">{draggingItem.icon}</span>
          <span className="text-[11px] font-bold text-stone-700">{t(draggingItem.label)}</span>
        </div>
      )}
    </div>
  );
}