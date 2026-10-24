import React from 'react';

const LEGAL_CONTENT = {
  id: {
    title: 'Ketentuan Layanan & Penafian (TOS & Disclaimer)',
    subtitle: 'Harap dibaca oleh orang tua atau wali sebelum menggunakan aplikasi.',
    closeBtn: 'Saya Mengerti & Setuju',
    sections: [
      {
        heading: '1. Penafian Pendidikan & Medis (Montessori Disclaimer)',
        body: 'Aplikasi ini dirancang semata-mata sebagai sarana stimulasi sensorik dan permainan logika mandiri yang terinspirasi dari prinsip Montessori. Aplikasi ini BUKAN merupakan kurikulum resmi Montessori terakreditasi, bukan alat diagnostik medis, dan bukan pengganti terapi okupasi atau tumbuh kembang anak.'
      },
      {
        heading: '2. Pengawasan Orang Tua (Parental Responsibility)',
        body: 'Penggunaan aplikasi oleh anak usia dini WAJIB berada di bawah pengawasan langsung orang tua atau pendamping dewasa. Kami menyarankan pembatasan durasi layar (screen time) yang sehat sesuai rekomendasi medis usia anak.'
      },
      {
        heading: '3. Privasi & Keamanan Data Anak (Privacy & COPPA)',
        body: 'Kami sangat menghormati privasi anak. Semua data identitas (nama panggilan, usia, pilihan avatar), skor bintang, dan rekaman durasi bermain HANYA tersimpan secara lokal di browser perangkat Anda (localStorage). Tidak ada data pribadi yang dikumpulkan, dilacak, atau dijual ke server pihak ketiga.'
      },
      {
        heading: '4. Hak Kekayaan Intelektual & Aset Suara/Gambar',
        body: 'Efek suara, vokal pelafalan sintetis AI, dan grafis disajikan untuk tujuan edukasi nirlaba dan pengalaman belajar interaktif. Pengguna dilarang mendistribusikan ulang atau menyalahgunakan aset digital dalam aplikasi ini untuk tujuan komersial tanpa izin.'
      },
      {
        heading: '5. Batasan Tanggung Jawab (Limitation of Liability)',
        body: 'Aplikasi ini disediakan "sebagaimana adanya" (as-is) tanpa jaminan ketiadaan bug atau gangguan teknis. Pengembang tidak bertanggung jawab atas kerugian fisik, kelalaian perangkat, atau konsekuensi tidak langsung dari penggunaan platform ini.'
      }
    ]
  },
  en: {
    title: 'Terms of Service & Legal Disclaimer',
    subtitle: 'Please read by parents or legal guardians before playing.',
    closeBtn: 'I Understand & Agree',
    sections: [
      {
        heading: '1. Educational & Medical Disclaimer',
        body: 'This application is intended strictly as a sensory and logic play tool inspired by Montessori principles. It is NOT an official accredited Montessori institution curriculum, not a medical diagnostic tool, and not a substitute for clinical developmental therapy.'
      },
      {
        heading: '2. Parental Supervision',
        body: 'Use of this platform by toddlers and young children MUST occur under the direct supervision of a parent or guardian. We advocate for balanced and medically appropriate screen time limits for each age group.'
      },
      {
        heading: '3. Child Data Privacy (COPPA & Data Protection)',
        body: 'We strictly protect child privacy. All entered profile information (nickname, age, avatar), earned stars, and session timestamps are stored solely on your local device browser (localStorage). No personal identifiable child data is tracked, harvested, or transmitted to remote servers.'
      },
      {
        heading: '4. Intellectual Property & Digital Assets',
        body: 'All sound effects, AI synthetic voice pronunciations, and visual assets are provided for educational and non-commercial interactive gameplay. Unauthorized extraction or commercial redistribution of these assets is prohibited.'
      },
      {
        heading: '5. Limitation of Liability',
        body: 'This service is offered on an "AS-IS" and "AS-AVAILABLE" basis without warranties of any kind. The developers shall not be liable for any device mishaps, screen fatigue, or indirect outcomes resulting from the use of this website.'
      }
    ]
  }
};

export default function LegalModal({ isOpen, onClose, lang = 'id', isFirstVisit = false }) {
  if (!isOpen) return null;

  const content = LEGAL_CONTENT[lang] || LEGAL_CONTENT.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-xl w-full shadow-2xl border border-stone-200 max-h-[85vh] flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h3 className="text-base sm:text-lg font-black text-stone-800">
              📜 {content.title}
            </h3>
            <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">
              {content.subtitle}
            </p>
          </div>
          {/* Tombol X hanya muncul jika dibuka manual via footer */}
          {!isFirstVisit && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 font-bold flex items-center justify-center text-sm"
            >
              ✕
            </button>
          )}
        </div>

        <div className="overflow-y-auto flex-1 my-4 pr-2 space-y-4 text-xs text-stone-600 leading-relaxed">
          {content.sections.map((sec, idx) => (
            <div key={idx} className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/60">
              <h4 className="font-black text-stone-800 text-xs sm:text-sm mb-1">
                {sec.heading}
              </h4>
              <p>{sec.body}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl text-xs sm:text-sm shadow transition active:scale-95"
        >
          {content.closeBtn}
        </button>
      </div>
    </div>
  );
}