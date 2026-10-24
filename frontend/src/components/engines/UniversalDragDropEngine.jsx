import React, { useState, useEffect, useRef } from 'react';
import { playKidVoice, playWordVoice } from '../../utils/audioPlayer';

export default function UniversalDragDropEngine({ config, onWin, lang = 'id' }) {
  const [items, setItems] = useState(() =>
    [...config.items].sort(() => Math.random() - 0.5)
  );
  const [placedItems, setPlacedItems] = useState({});
  const [activeItem, setActiveItem] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  // Kunci scroll halaman saat proses dragging sedang aktif di HP/tablet
  useEffect(() => {
    if (isDragging) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      // Cegah scrolling pada level touchmove secara pasif: false
      const preventTouchScroll = (e) => {
        if (e.cancelable) e.preventDefault();
      };

      window.addEventListener('touchmove', preventTouchScroll, { passive: false });

      return () => {
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
        window.removeEventListener('touchmove', preventTouchScroll);
      };
    }
  }, [isDragging]);

  const handlePlace = (item, targetId) => {
    if (!item) return;

    if (item.targetId === targetId || item.id === targetId) {
      const nextPlaced = { ...placedItems, [item.id]: targetId };
      setPlacedItems(nextPlaced);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setActiveItem(null);
      setIsDragging(false);

      if (Object.keys(nextPlaced).length === config.items.length) {
        setCelebrate(true);
        playKidVoice('win', lang);
        if (onWin) onWin();
      } else {
        playKidVoice('correct', lang);
      }
    } else {
      setIsDragging(false);
      playKidVoice('wrong', lang);
    }
  };

  const handleTouchStart = (item) => {
    setActiveItem(item);
    setIsDragging(true);
  };

  const handleTouchEnd = (e, item) => {
    setIsDragging(false);
    const touch = e.changedTouches[0];
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
    const targetElement = dropTarget?.closest('[data-target-id]');
    
    if (targetElement) {
      const targetId = targetElement.getAttribute('data-target-id');
      handlePlace(item, targetId);
    }
  };

  const handleReset = () => {
    setItems([...config.items].sort(() => Math.random() - 0.5));
    setPlacedItems({});
    setActiveItem(null);
    setIsDragging(false);
    setCelebrate(false);
  };

  return (
    <div className="bg-amber-50/70 border-2 border-amber-200/80 rounded-3xl p-4 sm:p-7 max-w-3xl mx-auto shadow-inner select-none touch-none">
      <div className="text-center sm:text-left mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-amber-950">
          {config.title?.[lang] || config.title?.id || config.title}
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
          {config.instruction?.[lang] || config.instruction?.id || config.instruction}
        </p>
      </div>

      {/* Target Zones */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
        {config.targets.map((target) => (
          <div
            key={target.id}
            data-target-id={target.id}
            onClick={() => {
              if (activeItem) handlePlace(activeItem, target.id);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const droppedId = e.dataTransfer.getData('text/plain');
              const item = config.items.find((i) => i.id === droppedId);
              if (item) handlePlace(item, target.id);
            }}
            className="h-28 sm:h-32 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-stone-300 bg-white/60 transition-all p-2"
          >
            <span className="text-3xl sm:text-4xl opacity-30">{target.icon}</span>
            <span className="text-xs font-bold text-stone-600 mt-1">
              {target.label?.[lang] || target.label?.id || target.label}
            </span>
          </div>
        ))}
      </div>

      {/* Pool Item */}
      <div className="bg-white/90 border border-stone-200 rounded-2xl p-4 sm:p-6 min-h-[120px] flex items-center justify-center gap-3 flex-wrap">
        {celebrate ? (
          <button
            onClick={handleReset}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-sm rounded-xl shadow transition"
          >
            {lang === 'en' ? 'Play Again ↺' : 'Main Lagi ↺'}
          </button>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              draggable
              style={{ touchAction: 'none' }} // Matikan gesture scroll pada item seret
              onDragStart={(e) => {
                setIsDragging(true);
                setActiveItem(item);
                e.dataTransfer.setData('text/plain', item.id);
              }}
              onDragEnd={() => setIsDragging(false)}
              onTouchStart={() => handleTouchStart(item)}
              onTouchEnd={(e) => handleTouchEnd(e, item)}
              onClick={() => {
                // Audio vokal kata hanya diputar saat murni tap
                if (config.category && item.wordKey) {
                  playWordVoice(config.category, item.wordKey, lang);
                }
              }}
              className="w-20 sm:w-24 min-h-[82px] sm:min-h-[92px] p-2 bg-white rounded-2xl border-2 border-amber-300 flex flex-col items-center justify-center text-center cursor-grab active:cursor-grabbing shadow-sm active:scale-95 transition-all select-none"
            >
              <span className="text-3xl sm:text-4xl">{item.icon}</span>
              <span className="text-[10px] sm:text-xs font-bold text-stone-700 leading-tight mt-1">
                {item.label?.[lang] || item.label?.id || item.label}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}