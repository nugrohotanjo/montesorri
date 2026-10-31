// Kunci enkripsi unik aplikasi (bisa diubah sesuai selera)
const SECRET_SALT = 'm0nt3ss0r1_s3cur3_k3y_2026';

// Mengubah string JSON menjadi teks terenkripsi (Base64 scrambled)
const encrypt = (plainText) => {
  if (!plainText) return '';
  try {
    let result = '';
    for (let i = 0; i < plainText.length; i++) {
      const charCode = plainText.charCodeAt(i) ^ SECRET_SALT.charCodeAt(i % SECRET_SALT.length);
      result += String.fromCharCode(charCode);
    }
    return btoa(unescape(encodeURIComponent(result)));
  } catch {
    return plainText;
  }
};

// Mengembalikan teks acak menjadi string JSON asli
const decrypt = (cipherText) => {
  if (!cipherText) return '';
  try {
    const raw = decodeURIComponent(escape(atob(cipherText)));
    let result = '';
    for (let i = 0; i < raw.length; i++) {
      const charCode = raw.charCodeAt(i) ^ SECRET_SALT.charCodeAt(i % SECRET_SALT.length);
      result += String.fromCharCode(charCode);
    }
    return result;
  } catch {
    // Fallback jika datanya masih format plain text lama sebelum dienkripsi
    return cipherText;
  }
};

// Wrapper getter & setter localStorage dengan auto decrypt & encrypt
export const secureStorage = {
  getItem: (key) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return decrypt(raw);
    } catch {
      return null;
    }
  },

  setItem: (key, value) => {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      const encrypted = encrypt(stringValue);
      localStorage.setItem(key, encrypted);
    } catch (err) {
      console.warn('[SecureStorage] Gagal menyimpan data:', err);
    }
  },

  removeItem: (key) => {
    localStorage.removeItem(key);
  }
};