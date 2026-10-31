// Bank Data Semua Game & Lembar Kerja (Bilingual: ID / EN)
export const BANK_GAMES = [
  // --- Game Custom Bawaan ---
  {
    id: 'shape_puzzle',
    title: { id: 'Puzzle Bentuk Kayu', en: 'Wooden Shape Puzzle' },
    desc: { id: 'Pasang balok bentuk ke lubangnya', en: 'Fit wooden shapes into correct slots' },
    icon: '🪵',
    category: 'toddler'
  },
  {
    id: 'bells',
    title: { id: 'Bel Sensorik Lembut', en: 'Gentle Sensory Bells' },
    desc: { id: 'Sentuh bilah nada marimba kayu', en: 'Tap resonant wooden marimba notes' },
    icon: '🔔',
    category: 'toddler'
  },
  {
    id: 'paint',
    title: { id: 'Kanvas Lukis Jari', en: 'Finger Painting Canvas' },
    desc: { id: 'Coretan warna ramah jari', en: 'Mess-free finger colors & strokes' },
    icon: '🎨',
    category: 'toddler'
  },
  {
    id: 'color_sort',
    title: { id: 'Sortir Kancing Mangkuk', en: 'Button Bowl Sorting' },
    desc: { id: 'Klasifikasi warna kancing ke mangkuknya', en: 'Sort colorful buttons into matching bowls' },
    icon: '🔴',
    category: 'preschool'
  },
  {
    id: 'pink_tower',
    title: { id: 'Susun Menara Pink', en: 'The Pink Tower' },
    desc: { id: 'Konsep ukuran balok besar ke kecil', en: 'Stack cubes graded largest to smallest' },
    icon: '🧱',
    category: 'preschool'
  },
  {
    id: 'missing_apples',
    title: { id: 'Apel Angka Hilang', en: 'Missing Apple Numbers' },
    desc: { id: 'Lengkapi deret angka apel berurutan', en: 'Fill in missing numbers in sequence' },
    icon: '🍎',
    category: 'kinder'
  },
  {
    id: 'body_parts',
    title: { id: 'Anggota Tubuh', en: 'Body Parts Matching' },
    desc: { id: 'Pasangkan nama anatomi tubuh', en: 'Match body anatomy labels correctly' },
    icon: '🧍',
    category: 'kinder'
  },

  // --- Game Universal Engine (Drag & Drop) ---
  {
    id: 'toddler-animals',
    title: { id: 'Kandang Hewan Lucu', en: 'Cute Animal Habitats' },
    desc: { id: 'Bantu hewan masuk ke kandangnya masing-masing', en: 'Guide farm animals to their homes' },
    icon: '🐮',
    category: 'toddler',
    engine: 'drag_drop',
    config: {
      title: { id: '🐮 Kandang Hewan Peternakan', en: '🐮 Farm Animal Habitats' },
      instruction: { id: 'Tarik setiap hewan ke kandang atau habitatnya!', en: 'Drag each animal to its correct home!' },
      targets: [
        { id: 'cow-home', label: { id: 'Padang Rumput', en: 'Meadow' }, placeholderIcon: '🌿' },
        { id: 'duck-home', label: { id: 'Kolam Air', en: 'Pond' }, placeholderIcon: '🌊' },
        { id: 'hen-home', label: { id: 'Sarang Jerami', en: 'Hay Nest' }, placeholderIcon: '🪺' },
        { id: 'fish-home', label: { id: 'Akuarium', en: 'Aquarium' }, placeholderIcon: '🫧' }
      ],
      items: [
        { id: 'cow', targetId: 'cow-home', label: { id: 'Sapi', en: 'Cow' }, icon: '🐮' },
        { id: 'duck', targetId: 'duck-home', label: { id: 'Bebek', en: 'Duck' }, icon: '🦆' },
        { id: 'hen', targetId: 'hen-home', label: { id: 'Ayam', en: 'Hen' }, icon: '🐔' },
        { id: 'fish', targetId: 'fish-home', label: { id: 'Ikan', en: 'Fish' }, icon: '🐠' }
      ]
    }
  },
  {
    id: 'toddler-fruits',
    title: { id: 'Keranjang Buah Segar', en: 'Fresh Fruit Baskets' },
    desc: { id: 'Kelompokkan buah sesuai jenis keranjang', en: 'Sort fresh fruits into the right baskets' },
    icon: '🍎',
    category: 'toddler',
    engine: 'drag_drop',
    config: {
      title: { id: '🍎 Panen Buah Segar', en: '🍎 Fresh Fruit Harvest' },
      instruction: { id: 'Tarik buah ke wadah keranjang yang tepat!', en: 'Drag each fruit into matching baskets!' },
      targets: [
        { id: 't-apple', label: { id: 'Keranjang Apel', en: 'Apple Basket' }, placeholderIcon: '🧺' },
        { id: 't-banana', label: { id: 'Keranjang Pisang', en: 'Banana Basket' }, placeholderIcon: '🧺' },
        { id: 't-orange', label: { id: 'Keranjang Jeruk', en: 'Orange Basket' }, placeholderIcon: '🧺' },
        { id: 't-grape', label: { id: 'Keranjang Anggur', en: 'Grape Basket' }, placeholderIcon: '🧺' }
      ],
      items: [
        { id: 'item-apple', targetId: 't-apple', label: { id: 'Apel Merah', en: 'Red Apple' }, icon: '🍎' },
        { id: 'item-banana', targetId: 't-banana', label: { id: 'Pisang Kuning', en: 'Yellow Banana' }, icon: '🍌' },
        { id: 'item-orange', targetId: 't-orange', label: { id: 'Jeruk Manis', en: 'Sweet Orange' }, icon: '🍊' },
        { id: 'item-grape', targetId: 't-grape', label: { id: 'Anggur Ungu', en: 'Purple Grape' }, icon: '🍇' }
      ]
    }
  },
  {
    id: 'preschool-vehicles',
    title: { id: 'Garasi Kendaraan', en: 'Vehicle Garages' },
    desc: { id: 'Tempatkan kendaraan di jalur yang pas', en: 'Place vehicles on their travel lanes' },
    icon: '🚗',
    category: 'preschool',
    engine: 'drag_drop',
    config: {
      title: { id: '🚗 Jalur Transportasi', en: '🚗 Transit Pathways' },
      instruction: { id: 'Tarik kendaraan ke tempat berjalannya!', en: 'Drag vehicles to where they travel!' },
      targets: [
        { id: 't-road', label: { id: 'Jalan Raya', en: 'Roadway' }, placeholderIcon: '🛣️' },
        { id: 't-sky', label: { id: 'Langit Bebas', en: 'Sky' }, placeholderIcon: '☁️' },
        { id: 't-sea', label: { id: 'Laut Biru', en: 'Ocean' }, placeholderIcon: '🌊' },
        { id: 't-rail', label: { id: 'Rel Kereta', en: 'Railroad' }, placeholderIcon: '🛤️' }
      ],
      items: [
        { id: 'car', targetId: 't-road', label: { id: 'Mobil', en: 'Car' }, icon: '🚗' },
        { id: 'plane', targetId: 't-sky', label: { id: 'Pesawat', en: 'Airplane' }, icon: '✈️' },
        { id: 'boat', targetId: 't-sea', label: { id: 'Kapal', en: 'Ship' }, icon: '🚢' },
        { id: 'train', targetId: 't-rail', label: { id: 'Kereta', en: 'Train' }, icon: '🚂' }
      ]
    }
  }
];