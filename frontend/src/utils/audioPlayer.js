let audioCtx = null;
const audioBuffers = {};

let lastWordPlayTime = 0;

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

const playAudioBufferOrFallback = (url) => {
  if (!url) return;
  const ctx = getAudioContext();
  const buffer = audioBuffers[url];

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

  if (ctx && !audioBuffers[url]) {
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.arrayBuffer();
      })
      .then((buf) => ctx.decodeAudioData(buf))
      .then((decoded) => {
        audioBuffers[url] = decoded;
      })
      .catch(() => {});
  }

  try {
    const fallback = new Audio(url);
    fallback.play().catch((err) => {
      console.warn(`[AudioLoader] Gagal memutar ${url}:`, err);
    });
  } catch (err) {
    console.error('[AudioLoader] Play error:', err);
  }
};

export const preloadGameAudio = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  Object.entries(AUDIO_MANIFEST).forEach(([, categories]) => {
    Object.entries(categories).forEach(([, urls]) => {
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
  playAudioBufferOrFallback(randomUrl);
};

// Ganti variabel lama dengan dictionary per-key
const lastPlayTimes = {};

export const playShapeVoice = (shapeId, lang = 'id') => {
  if (!shapeId) return;

  const now = Date.now();
  const cooldownKey = `shape_${shapeId}`;

  // Cooldown 1 detik hanya berlaku untuk shape yang sama persis
  if (now - (lastPlayTimes[cooldownKey] || 0) < 1000) return;
  lastPlayTimes[cooldownKey] = now;

  const langKey = lang === 'en' ? 'en' : 'id';
  const url = `/audio/words/shapes/${langKey}/${shapeId}.mp3`;
  playAudioBufferOrFallback(url);
};

export const playWordVoice = (category, wordKey, lang = 'id') => {
  if (!category || !wordKey) return;

  const now = Date.now();
  const cooldownKey = `${category}_${wordKey}`;

  // Cooldown 1 detik hanya berlaku untuk kata yang sama persis
  if (now - (lastPlayTimes[cooldownKey] || 0) < 1000) return;
  lastPlayTimes[cooldownKey] = now;

  const langKey = lang === 'en' ? 'en' : 'id';
  const url = `/audio/words/${category}/${langKey}/${wordKey}.mp3`;
  playAudioBufferOrFallback(url);
};