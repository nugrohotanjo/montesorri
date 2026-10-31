import React from 'react';

export default function GameCard({
  title,
  desc,
  icon,
  isCompleted,
  completedLabel,
  playLabel,
  onPlay
}) {
  return (
    <div
      onClick={onPlay}
      className={`p-4 sm:p-5 bg-white rounded-2xl border shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-[0.98] flex items-center gap-3 relative overflow-hidden ${
        isCompleted ? 'border-emerald-300/80 bg-emerald-50/20' : 'border-stone-200'
      }`}
    >
      {isCompleted && (
        <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-bl-lg shadow-sm">
          {completedLabel}
        </span>
      )}
      <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-2xl border border-amber-200 shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-stone-800 text-sm sm:text-base">{title}</h3>
        <p className="text-stone-500 text-[11px] sm:text-xs mt-0.5">{desc}</p>
        <span
          className={`inline-block mt-2 text-[11px] font-bold px-2.5 py-1 rounded-lg ${
            isCompleted
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-amber-100 text-amber-800'
          }`}
        >
          {playLabel}
        </span>
      </div>
    </div>
  );
}