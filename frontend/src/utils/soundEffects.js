// Bank Teks Suara Vokal
const VOICE_LINES = {
  id: {
    correct: ['Hebat!', 'Benar!', 'Pintar sekali!'],
    wrong: ['Coba lagi ya', 'Kurang tepat', 'Ayo coba lagi!'],
    win: ['Hore, kamu berhasil!']
  },
  en: {
    correct: ['Great job!', 'Correct!', 'Well done!'],
    wrong: ['Try again!', 'Almost, try again!', 'Oops, not quite!'],
    win: ['Hooray, you did it!']
  }
};

/**
 * 1. Opsi TTS Browser dengan Pitch Anak-anak
 */
export const speakVoice = (type, lang = 'id') => {
  if (!('speechSynthesis' in window)) return;

  // Hentikan suara sebelumnya agar tidak bertumpuk
  window.speechSynthesis.cancel();

  const lines = VOICE_LINES[lang]?.[type] || VOICE_LINES.id[type];
  const randomText = lines[Math.floor(Math.random() * lines.length)];

  const utterance = new SpeechSynthesisUtterance(randomText);
  utterance.lang = lang === 'en' ? 'en-US' : 'id-ID';
  
  // Modulasi nada agar mirip anak kecil / karakter kartun ceria
  utterance.pitch = 1.6; // Nada lebih tinggi (anak-anak)
  utterance.rate = 1.05;  // Kecepatan bicara pas
  utterance.volume = 1;

  window.speechSynthesis.speak(utterance);
};

/**
 * 2. Opsi File Audio Fisik (.mp3 / .wav) jika kamu punya rekaman sendiri
 * Taruh file di: public/audio/id/benar.mp3, public/audio/id/salah.mp3, dll.
 */
export const playAudioFile = (fileName, lang = 'id') => {
  try {
    const audio = new Audio(`/audio/${lang}/${fileName}.mp3`);
    audio.play().catch(() => {
      // Fallback otomatis ke TTS jika file tidak ditemukan
      speakVoice(fileName, lang);
    });
  } catch (err) {
    speakVoice(fileName, lang);
  }
};