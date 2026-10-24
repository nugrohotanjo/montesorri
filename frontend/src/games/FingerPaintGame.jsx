import React, { useState, useEffect, useRef } from 'react';

export default function FingerPaintGame({ onWin }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#D97706');

  useEffect(() => {
    if (containerRef.current && canvasRef.current) {
      canvasRef.current.width = containerRef.current.clientWidth;
      canvasRef.current.height = Math.min(window.innerHeight * 0.5, 450);
    }
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: cx - rect.left, y: cy - rect.top };
  };

  const startDraw = (e) => {
    setIsDrawing(true);
    const { x, y } = getPos(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { x, y } = getPos(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();
  };

  return (
    <div ref={containerRef} className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-stone-200 text-center">
      <h2 className="text-base sm:text-xl font-bold mb-3">🎨 Kanvas Melukis Bebas</h2>
      <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
        {['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'].map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            style={{ backgroundColor: c }}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 ${color === c ? 'border-black scale-110' : 'border-white shadow-sm'}`}
          />
        ))}
        <button
          onClick={() => {
            const c = canvasRef.current;
            c.getContext('2d').clearRect(0, 0, c.width, c.height);
          }}
          className="px-3 py-1.5 text-xs font-bold bg-stone-100 rounded-xl border border-stone-300"
        >
          Bersihkan
        </button>
        <button onClick={onWin} className="px-3 py-1.5 text-xs font-bold bg-amber-100 text-amber-800 rounded-xl border border-amber-300">
          Simpan ⭐
        </button>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDraw}
        onMouseUp={() => setIsDrawing(false)}
        onMouseMove={draw}
        onTouchStart={startDraw}
        onTouchEnd={() => setIsDrawing(false)}
        onTouchMove={draw}
        style={{ touchAction: 'none' }}
        className="w-full bg-stone-50 rounded-2xl border-2 border-dashed border-stone-300 cursor-crosshair shadow-inner"
      />
    </div>
  );
}
