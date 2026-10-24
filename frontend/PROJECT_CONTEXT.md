# 🌿 Montessori Playroom — Project Context & Documentation

Aplikasi web edukasi interaktif berbasis pendekatan sensorik dan kemandirian Montessori untuk anak usia 1–7 tahun. Dibangun dengan konsep arsitektur **Data-Driven (Config-Only)**, performa audio instan Web Audio API, dukungan dwibahasa (ID/EN), pembatasan akses berbasis usia, gerbang keamanan orang tua (*Parental Gate*), serta sistem analitik rekor bermain anak.

---

## 🛠️ Tech Stack & Ekosistem
- **Framework Frontend**: React 18 (Vite)
- **Styling UI**: Tailwind CSS (Desain ergonomis ramah balita, kartu kontras, ukuran sentuhan besar)
- **Audio Architecture**: Web Audio API (`AudioBufferSourceNode`) + Web Audio Synthesizer (BGM Oscillator) + HTML5 `Audio` Fallback
- **State & Penyimpanan**: React State Hooks (`useState`, `useEffect`, `useRef`, `useMemo`) + `localStorage` persistence
- **Bahasa**: Bilingual (Bahasa Indonesia & English)

---

## 📂 Struktur File Proyek & Peran Komponen

### File Utama & Konfigurasi
- **`src/main.jsx`**: Titik masuk (*entry point*) DOM root murni. Menjaga bundle minimal hanya dengan me-render `<App />`.
- **`src/App.jsx`**: Orkestrator utama seluruh aplikasi. Mengelola routing internal (menu vs game aktif), mode kurikulum vs bank game, stopwatch sesi bermain, state bintang/penyelesaian game, dan validasi Parental Gate.
- **`src/constants/translations.js`**: Pusat kamus i18n (`UI_TEXT`), meta data jalur kurikulum (`CURRICULUM_INFO`), dan daftar pilihan avatar (`AVATAR_OPTIONS`).
- **`src/data/bankGames.js`**: Kumpulan konfigurasi data-driven game tanpa perlu menulis file komponen baru.
- **`src/config/curriculum.js`**: Pemetaan ID game ke dalam tahapan usia (`toddler`, `preschool`, `kinder`).

### Komponen JSX (`src/components/`)
- **`src/components/common/Header.jsx`**: Bar atas ramping (*compact pill bar*). Menampilkan ringkasan profil anak, tombol toggle Parent Mode, kontrol audio sintetis (ikon saja), pengganti bahasa, dan tombol layar penuh.
- **`src/components/common/GameCard.jsx`**: Kartu representasi game di menu utama. Dilengkapi ikon visual, judul, deskripsi dwibahasa, tombol aksi, dan badge penanda status game sudah selesai (*completed*).
- **`src/components/common/ParentalGate.jsx`**: Modal pengaman berbasis perhitungan matematika sederhana acak. Mencegah anak keluar tanpa izin orang tua saat game belum tuntas, keluar dari fullscreen, atau mengubah setting profil.
- **`src/components/profile/ChildProfileModal.jsx`**: Modal formulir untuk mengganti identitas anak (nama panggilan, usia tahun, dan pilihan 8 avatar emoji lucu).
- **`src/components/profile/ParentAnalyticsModal.jsx`**: Modal dasbor analitik orang tua. Menampilkan daftar game yang paling sering diulang, total durasi main, dan catatan rekor penyelesaian tercepat per game.
- **`src/components/engines/UniversalDragDropEngine.jsx`**: Mesin serbaguna untuk mekanisme seret dan lepas (drag-and-drop). Mendukung event sentuhan ponsel/tablet (*touch*) maupun mouse desktop.

### Game Mandiri (`src/games/`)
- **`src/games/registry.js`**: Kamus pemetaan komponen custom game di luar engine konfigurasi umum.
- **`src/games/ShapePuzzleGame.jsx`**: Komponen game mandiri pengenalan bentuk geometri (lingkaran, persegi, segitiga, bintang, hati, segilima) dengan pelafalan suara kosakata dwibahasa ElevenLabs.

### Utilitas Logika (`src/utils/`)
- **`src/utils/audioPlayer.js`**: Logika pemutar suara efek (benar, salah, menang) dan vokal kosakata. Dilengkapi in-memory buffer decode dan cooldown 1 detik per-item.
- **`src/utils/bgmPlayer.js`**: Generator musik latar ramah anak berbasis oscillator gelombang segitiga (*triangle wave*), ringan tanpa beban bandwidth file MP3.
- **`src/utils/activityTracker.js`**: Mesin pelacak data riwayat permainan, durasi akumulasi, dan pembanding rekor waktu tercepat berbasis `localStorage`.

---

## 🚀 Fitur Utama & Cara Kerja Sistem

### 1. Arsitektur Data-Driven (Config-Only Games)
- **Cara Kerja**: Komponen mesin permainan (`UniversalDragDropEngine`) dipisahkan total dari konten data (`bankGames.js`).
- Menambahkan 50 materi baru (seperti sorting hewan darat/laut, mencocokkan warna buah) cukup menambahkan objek JSON baru di `bankGames.js`. Engine akan otomatis membangun drop zone, mendeteksi kecocokan ID target, memutar feedback menang/kalah, dan mencatat progres tanpa perlu menulis file `.jsx` baru.

### 2. Audio Engine Cerdas & Anti-Spam
- **Web Audio API Buffer**: Saat aplikasi pertama kali berinteraksi, file vokal di-decode ke buffer memori browser. Suara keluar instan 0 milidetik tanpa jeda loading.
- **Per-Item Cooldown (1 Detik)**: Mencegah anak menekan bentuk yang sama secara spam. Jika anak menekan bentuk lingkaran berkali-kali, suara hanya berbunyi 1 kali tiap 1 detik. Namun, jika anak langsung beralih menekan bentuk lain (seperti persegi), suara persegi akan langsung berbunyi tanpa tertunda cooldown lingkaran.
- **Pemisahan Event Tap vs Drag**: Pemicu suara vokal kosakata hanya ditaruh pada event `onClick` / tap murni. Event `onDragStart` tidak memicu audio agar telinga anak tidak terdistraksi saat sedang fokus menyeret item.
- **Synthesized BGM**: Musik latar dibangun menggunakan nada berurutan melalui node oscillator bawaan browser, sehingga nol beban download data aset audio.

### 3. Sistem Profil & Pembatasan Milestone Usia
- **Penyesuaian Tahap Perkembangan**:
  - Usia **1 – 2.5 tahun**: Otomatis hanya bisa membuka tab **Toddler**.
  - Usia **3 – 4.5 tahun**: Otomatis hanya bisa membuka tab **Preschool**.
  - Usia **5 – 7 tahun**: Otomatis hanya bisa membuka tab **Kinder**.
- Tab yang tidak sesuai dengan usia anak akan berstatus terkunci (ikon 🔒 dan disabled), menjaga fokus kurikulum anak sesuai tahap umurnya.

### 4. Gerbang Keamanan Orang Tua & Parent Mode
- **Parental Gate**: Setiap upaya keluar dari fullscreen, keluar dari permainan yang belum rampung, atau membuka menu profil anak wajib melewati soal perhitungan matematika acak.
- **Parent Mode ON (🔓)**:
  - Orang tua dapat mengaktifkan Parent Mode lewat tombol di header (melewati gate 1 kali).
  - Ketika aktif: semua tab usia langsung terbuka tanpa batas, pencarian game di bank game dapat diakses bebas, tombol kembali tidak lagi menanyakan soal matematika, dan tombol laporan analitik (📊) akan muncul.
  - Dapat dikunci kembali ke mode anak hanya dengan 1 ketukan kapan saja.

### 5. Activity Tracker & Analitik Belajar Anak
- **Pencatatan Waktu Real-Time**: Stopwatch internal berbasis timestamp (`Date.now()`) otomatis berjalan ketika anak mulai masuk ke arena game.
- **Metrik yang Dicatat**:
  - **Frekuensi Bermain (`playCount`)**: Berapa kali anak mengulang permainan yang sama (indikator minat tinggi anak terhadap materi tersebut).
  - **Rekor Tercepat (`bestTimeSeconds`)**: Waktu tersingkat anak menyelesaikan game dalam satuan detik.
  - **Akumulasi Waktu (`totalDurationSeconds`)**: Total menit dan detik yang dihabiskan anak pada materi terkait.
  - **Riwayat Sesi (`sessionHistory`)**: Rekaman 15 sesi terakhir lengkap dengan stempel waktu tanggal dan jam.
- Seluruh metrik dapat ditinjau langsung oleh orang tua melalui modal laporan belajar terintegrasi.