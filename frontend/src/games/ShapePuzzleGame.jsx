import React, { useState, useEffect } from 'react';
import { playKidVoice, playShapeVoice } from '../utils/audioPlayer';

const SHAPE_GAME_TEXT = {
  id: {
    title: 'Teka-Teki Bentuk Geometri',
    instruction: 'Sentuh atau seret bentuk ke bingkai bayangan yang pas.',
    winTitle: '🎉 Hore, Bentuk Sempurna!',
    playAgain: 'Main Lagi ↺',
    shapes: {
      circle: 'Lingkaran',
      square: 'Persegi',
      triangle: 'Segitiga',
      star: 'Bintang',
      heart: 'Hati',
      pentagon: 'Segilima'
    }
  },
  en: {
    title: 'Geometric Shape Puzzle',
    instruction: 'Tap or drag the shape into its matching outline.',
    winTitle: '🎉 Awesome, Perfectly Fitted!',
    playAgain: 'Play Again ↺',
    shapes: {
      circle: 'Circle',
      square: 'Square',
      triangle: 'Triangle',
      star: 'Star',
      heart: 'Heart',
      pentagon: 'Pentagon'
    }
  }
};

const SHAPES_DATA = [
  { id: 'circle', icon: '🔴' },
  { id: 'square', icon: '🟦' },
  { id: 'triangle', icon: '🔺' },
  { id: 'star', icon: '⭐' },
  { id: 'heart', icon: '💖' },
  { id: 'pentagon', icon: '⬟' }
];

export default function ShapePuzzleGame({ onWin, lang = 'id' }) {
  const t = SHAPE_GAME_TEXT[lang] || SHAPE_GAME_TEXT.id;

  const [targets, setTargets] = useState(() =>
    [...SHAPES_DATA].sort(() => Math.random() - 0.5)
  );
  const [items, setItems] = useState(() =>
    [...SHAPES_DATA].sort(() => Math.random() - 0.5)
  );

  const [placedShapes, setPlacedShapes] = useState([]);
  const [selectedShape, setSelectedShape] = useState(null);
  const [shakeId, setShakeId] = useState(null);
  const [celebrate, setCelebrate] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Kunci scrolling browser selama anak sedang menyeret/drag item di layar
  useEffect(() => {
    if (isDragging) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      const preventTouch = (e) => {
        if (e.cancelable) e.preventDefault();
      };

      window.addEventListener('touchmove', preventTouch, { passive: false });

      return () => {
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
        window.removeEventListener('touchmove', preventTouch);
      };
    }
  }, [isDragging]);

  const handlePlace = (item, targetId) => {
    if (!item) return;

    if (item.id === targetId) {
      const nextPlaced = [...placedShapes, item.id];
      setPlacedShapes(nextPlaced);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setSelectedShape(null);
      setIsDragging(false);

      if (nextPlaced.length === SHAPES_DATA.length) {
        setCelebrate(true);
        playKidVoice('win', lang);
        if (onWin) onWin();
      } else {
        playKidVoice('correct', lang);
      }
    } else {
      setShakeId(targetId);
      setIsDragging(false);
      playKidVoice('wrong', lang);
      setTimeout(() => setShakeId(null), 400);
    }
  };

  const handleSelect = (item) => {
    // Bunyikan nama bentuk hanya saat diklik atau di-tap biasa
    playShapeVoice(item.id, lang);

    if (selectedShape?.id === item.id) {
      setSelectedShape(null);
    } else {
      setSelectedShape(item);
    }
  };

  const handleReset = () => {
    setTargets([...SHAPES_DATA].sort(() => Math.random() - 0.5));
    setItems([...SHAPES_DATA].sort(() => Math.random() - 0.5));
    setPlacedShapes([]);
    setSelectedShape(null);
    setIsDragging(false);
    setCelebrate(false);
  };

  return (
    <div className="bg-amber-50/70 border-2 border-amber-200/80 rounded-3xl p-4 sm:p-7 max-w-3xl mx-auto shadow-inner select-none touch-none">
      <div className="text-center sm:text-left mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-amber-950">{t.title}</h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-0.5">{t.instruction}</p>
      </div>

      {/* Target Outlines */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
        {targets.map((shape) => {
          const isPlaced = placedShapes.includes(shape.id);

          return (
            <div
              key={shape.id}
              onClick={() => {
                if (!isPlaced && selectedShape) {
                  handlePlace(selectedShape, shape.id);
                }
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const droppedId = e.dataTransfer.getData('text/plain');
                const droppedItem = items.find((i) => i.id === droppedId);
                if (droppedItem) handlePlace(droppedItem, shape.id);
              }}
              className={`h-28 sm:h-32 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed transition-all p-2 ${
                isPlaced
                  ? 'border-transparent bg-white shadow-sm'
                  : shakeId === shape.id
                  ? 'border-rose-400 bg-rose-50 animate-pulse'
                  : selectedShape
                  ? 'border-amber-400 bg-amber-100/50 hover:bg-amber-100 cursor-pointer active:scale-95'
                  : 'border-stone-300 bg-white/50'
              }`}
            >
              <span className={`text-4xl ${isPlaced ? '' : 'opacity-20 grayscale'}`}>
                {shape.icon}
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-stone-600 mt-1">
                {t.shapes[shape.id]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Item Pool */}
      <div className="bg-white/90 border border-stone-200 rounded-2xl p-4 sm:p-6 min-h-[120px] flex items-center justify-center gap-3 flex-wrap">
        {celebrate ? (
          <div className="text-center py-2">
            <p className="text-lg font-black text-emerald-600">{t.winTitle}</p>
            <button
              onClick={handleReset}
              className="mt-3 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-sm rounded-xl shadow transition active:scale-95"
            >
              {t.playAgain}
            </button>
          </div>
        ) : (
          items.map((item) => {
            const isSelected = selectedShape?.id === item.id;

            return (
              <div
                key={item.id}
                draggable
                style={{ touchAction: 'none' }}
                onDragStart={(e) => {
                  setIsDragging(true);
                  setSelectedShape(item);
                  e.dataTransfer.setData('text/plain', item.id);
                }}
                onDragEnd={() => setIsDragging(false)}
                onTouchStart={() => setIsDragging(true)}
                onTouchEnd={(e) => {
                  setIsDragging(false);
                  const touch = e.changedTouches?.[0];
                  if (touch) {
                    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
                    const targetBox = dropTarget?.closest('[data-shape-id]');
                    if (targetBox) {
                      const targetId = targetBox.getAttribute('data-shape-id');
                      handlePlace(item, targetId);
                    }
                  }
                }}
                onClick={() => handleSelect(item)}
                className={`w-20 sm:w-24 min-h-[82px] sm:min-h-[92px] p-2 bg-white rounded-2xl flex flex-col items-center justify-center text-center cursor-grab active:cursor-grabbing transition-all ${
                  isSelected
                    ? 'border-4 border-amber-500 ring-4 ring-amber-200 scale-105 shadow-md'
                    : 'border-2 border-amber-300 hover:border-amber-400 shadow-sm active:scale-95'
                }`}
              >
                <span className="text-3xl sm:text-4xl">{item.icon}</span>
                <span className="text-[10px] sm:text-xs font-bold text-stone-700 leading-tight mt-1 line-clamp-1">
                  {t.shapes[item.id]}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}