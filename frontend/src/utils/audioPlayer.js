let audioCtx = null;
const audioBuffers = {};

const AUDIO_MANIFEST = {
  id: {
    correct: ['/audio/id/correct_1.mp3', '/audio/id/correct_2.mp3', '/audio/id/correct_3.mp3'],
    wrong: ['/audio/id/wrong_1.mp3', '/audio/id/wrong_2.mp3', '/audio/id/wrong_3.mp3'],
    win: ['/audio/id/win_1.mp3', '/audio/id/win_2.mp3']
  },
  en: {
    correct: ['/audio/en/correct_1.mp3', '/audio/en/correct_2.mp3', '/audio/en/correct_3.mp3'],
    wrong: ['/audio/en/wrong_1.mp3', '/audio/en/wrong_2.mp3', '/audio/en/wrong_3.mp3'],
    win: ['/audio/en/win_1.mp3', '/audio/en/win_2.mp3']
  }
};

export const getAudioContext = () => {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const preloadGameAudio = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  Object.entries(AUDIO_MANIFEST).forEach(([langKey, categories]) => {
    Object.entries(categories).forEach(([catKey, urls]) => {
      urls.forEach((url) => {
        if (audioBuffers[url]) return;

        fetch(url)
          .then((res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status} on ${url}`);
            return res.arrayBuffer();
          })
          .then((buf) => ctx.decodeAudioData(buf))
          .then((decoded) => {
            audioBuffers[url] = decoded;
          })
          .catch((err) => {
            console.warn(`[AudioLoader] File belum terbaca atau 404: ${url}`, err);
          });
      });
    });
  });
};

export const playKidVoice = (type, lang = 'id') => {
  const langKey = lang === 'en' ? 'en' : 'id';
  const soundList = AUDIO_MANIFEST[langKey]?.[type] || AUDIO_MANIFEST.id[type];
  if (!soundList || soundList.length === 0) return;

  const randomUrl = soundList[Math.floor(Math.random() * soundList.length)];
  const ctx = getAudioContext();
  const buffer = audioBuffers[randomUrl];

  // 1. Coba putar via Web Audio API Buffer
  if (ctx && buffer) {
    try {
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
      return;
    } catch (e) {
      console.warn('[AudioLoader] Error playing buffer, fallback to Audio element', e);
    }
  }

  // 2. Fallback instan jika buffer belum siap atau file baru dibuka
  try {
    const fallback = new Audio(randomUrl);
    fallback.play().catch((err) => {
      console.warn(`[AudioLoader] Gagal memutar ${randomUrl}:`, err);
    });
  } catch (err) {
    console.error('[AudioLoader] Play error:', err);
  }
};