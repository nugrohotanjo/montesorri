import React, { useState } from 'react';
import { AVATAR_OPTIONS, UI_TEXT } from '../../constants/translations';

export default function ChildProfileModal({ isOpen, initialProfile, onSave, onClose, lang = 'id' }) {
  if (!isOpen) return null;

  const t = UI_TEXT[lang] || UI_TEXT.id;
  const [profileForm, setProfileForm] = useState(initialProfile);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(profileForm);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-stone-200 animate-in fade-in zoom-in duration-200">
        <h3 className="text-lg font-black text-stone-800 text-center mb-4">
          {t.profileTitle}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">
              {t.chooseAvatar}
            </label>
            <div className="grid grid-cols-4 gap-2 bg-stone-50 p-2.5 rounded-2xl border border-stone-200">
              {AVATAR_OPTIONS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setProfileForm({ ...profileForm, avatar: emoji })}
                  className={`text-2xl py-2 rounded-xl transition ${
                    profileForm.avatar === emoji
                      ? 'bg-amber-400 scale-110 shadow-sm'
                      : 'hover:bg-stone-200/60'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">
              {t.nameLabel}
            </label>
            <input
              type="text"
              required
              maxLength={15}
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">
              {t.ageLabel}
            </label>
            <input
              type="number"
              min={1}
              max={10}
              required
              value={profileForm.age}
              onChange={(e) => setProfileForm({ ...profileForm, age: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold rounded-xl text-xs transition"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl text-xs shadow transition"
            >
              {t.saveProfile}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}