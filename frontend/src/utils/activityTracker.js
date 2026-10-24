import { secureStorage } from './cryptoStorage';

const STORAGE_KEY = 'montessori_analytics_data';

export const getAnalyticsData = () => {
  try {
    const decrypted = secureStorage.getItem(STORAGE_KEY);
    return decrypted ? JSON.parse(decrypted) : {};
  } catch {
    return {};
  }
};

export const recordGameCompletion = (gameId, sessionDurationSec) => {
  if (!gameId) return;

  const data = getAnalyticsData();
  const currentRecord = data[gameId] || {
    playCount: 0,
    totalDurationSeconds: 0,
    bestTimeSeconds: null,
    lastPlayed: null,
    sessionHistory: []
  };

  const roundedDuration = Math.max(1, Math.round(sessionDurationSec));
  const newPlayCount = currentRecord.playCount + 1;
  const newTotalDuration = currentRecord.totalDurationSeconds + roundedDuration;

  const newBestTime =
    currentRecord.bestTimeSeconds === null
      ? roundedDuration
      : Math.min(currentRecord.bestTimeSeconds, roundedDuration);

  const nowIso = new Date().toISOString();

  const updatedHistory = [
    {
      playedAt: nowIso,
      durationSeconds: roundedDuration
    },
    ...currentRecord.sessionHistory
  ].slice(0, 15);

  data[gameId] = {
    playCount: newPlayCount,
    totalDurationSeconds: newTotalDuration,
    bestTimeSeconds: newBestTime,
    lastPlayed: nowIso,
    sessionHistory: updatedHistory
  };

  // Tersimpan dalam bentuk string acak terenkripsi
  secureStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};