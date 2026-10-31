let audioCtx = null;
let isPlaying = false;
let timer = null;

const MELODY = [
  261.63, 329.63, 392.00, 523.25,
  392.00, 329.63, 261.63, 392.00,
  329.63, 392.00, 440.00, 523.25,
  440.00, 392.00, 329.63, 293.66
];

export const startBackgroundMusic = () => {
  if (isPlaying) return;

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  let noteIndex = 0;
  isPlaying = true;

  const playNote = () => {
    if (!isPlaying) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(MELODY[noteIndex], audioCtx.currentTime);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);

      noteIndex = (noteIndex + 1) % MELODY.length;
      timer = setTimeout(playNote, 320);
    } catch {
      // Abaikan batasan autoplay browser
    }
  };

  playNote();
};

export const stopBackgroundMusic = () => {
  isPlaying = false;
  if (timer) clearTimeout(timer);
};

export const getBgmPlayingStatus = () => isPlaying;