const STORAGE_KEY = 'montessori_analytics_data';

// Ambil seluruh data analitik dari localStorage
export const getAnalyticsData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

/**
 * Catat penyelesaian game:
 * @param {string} gameId - ID game (misal: 'shape_puzzle')
 * @param {number} sessionDurationSec - Durasi sesi ini dalam detik
 */
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

  // Cek rekor tercepat baru
  const newBestTime =
    currentRecord.bestTimeSeconds === null
      ? roundedDuration
      : Math.min(currentRecord.bestTimeSeconds, roundedDuration);

  const nowIso = new Date().toISOString();

  // Simpan maksimal 15 riwayat sesi terakhir agar storage tetap hemat
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

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};