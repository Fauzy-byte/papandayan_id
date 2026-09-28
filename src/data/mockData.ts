import { TripPackage, Article, Testimonial, GalleryItem, Partner, Booking } from '../types';

export const initialTripPackages: TripPackage[] = [
  {
    id: 1,
    name: 'Sunrise Trip Moment',
    slug: 'sunrise-trip-moment',
    category: 'mountain_trip',
    type: 'scheduled',
    duration_label: '1 Hari (Dini Hari - Siang)',
    short_description: 'Trekking dini hari dengan tambahan 1 destinasi untuk moment menikmati terbitnya matahari',
    hero_image: '/sunrise.jpg',
    min_dp_percentage: 30,
    is_active: true,
    facilities: [
      'Tiket Masuk Wisata & SIMAKSI resmi BKSDA',
      'Guide lokal bersertifikat & tim sweeping',
      'Dokumentasi foto perjalanan (Link Google Drive)',
      'Perlengkapan P3K standar pendakian',
      'Air mineral & sarapan hangat di pos',
      'Safety briefing & pemandu jalur'
    ],
    destinations: [
      'Tebing Soni (Spot Sunrise terbaik)',
      'Kawah Belerang Papandayan',
      'Hutan Mati (Dead Forest)',
      'Pondok Saladah (Padang Edelweiss)'
    ],
    itinerary: [
      { time: '02.30 - 03.15', activity: 'Kumpul di Meeting Point (Basecamp Papandayan), briefing & pengecekan perlengkapan' },
      { time: '03.15 - 05.00', activity: 'Trekking santai menuju Tebing Soni berbekal headlamp' },
      { time: '05.00 - 06.30', activity: 'Menikmati golden sunrise Tebing Soni, coffee break & sesi foto panorama' },
      { time: '06.30 - 08.00', activity: 'Perjalanan menuju Hutan Mati dan Kawah Aktif dengan asap belerang eksotis' },
      { time: '08.00 - 09.30', activity: 'Eksplorasi Padang Edelweiss Pondok Saladah & sarapan bersama' },
      { time: '09.30 - 11.30', activity: 'Trekking turun kembali ke Camp David / Pos awal' },
      { time: '11.30 - 12.00', activity: 'Istirahat, pembagian suvenir/dokumentasi, trip selesai' }
    ],
    required_gear: [
      'Sepatu gunung / sepatu olahraga dengan grip baik',
      'Jaket hangat (suhu dini hari berkisar 10-15°C)',
      'Headlamp / senter tangan + baterai cadangan',
      'Pakaian ganti & jas hujan / ponco darurat',
      'Botol minum pribadi & obat-obatan pribadi'
    ],
    terms: [
      'Pemesanan minimal H-3 sebelum tanggal keberangkatan.',
      'DP minimal 30% untuk mengamankan slot kuota trip.',
      'Pelunasan maksimal H-1 sebelum keberangkatan.',
      'Pembatalan H-7 uang DP kembali 100%, H-3 refund 50%, <H-3 hangus sesuai kebijakan.',
      'Peserta dalam kondisi sehat fisik dan tidak memiliki riwayat jantung akut.'
    ],
    priceTiers: [
      { id: 1, trip_package_id: 1, customer_type: 'local', meeting_point: 'GN_PAPANDAYAN', min_participants: 1, max_participants: 3, price_per_person: 350000 },
      { id: 2, trip_package_id: 1, customer_type: 'local', meeting_point: 'GN_PAPANDAYAN', min_participants: 4, max_participants: 7, price_per_person: 275000 },
      { id: 3, trip_package_id: 1, customer_type: 'local', meeting_point: 'GN_PAPANDAYAN', min_participants: 8, max_participants: null, price_per_person: 225000 },
      { id: 4, trip_package_id: 1, customer_type: 'local', meeting_point: 'GARUT', min_participants: 1, max_participants: 4, price_per_person: 450000 },
      { id: 5, trip_package_id: 1, customer_type: 'local', meeting_point: 'GARUT', min_participants: 5, max_participants: null, price_per_person: 375000 },
      { id: 6, trip_package_id: 1, customer_type: 'local', meeting_point: 'BANDUNG', min_participants: 5, max_participants: null, price_per_person: 550000 },
      { id: 7, trip_package_id: 1, customer_type: 'foreign', meeting_point: 'GN_PAPANDAYAN', min_participants: 1, max_participants: null, price_per_person: 650000 }
    ],
    addons: [
      { id: 101, trip_package_id: 1, name: 'Dokumentasi Cinematic Drone 4K', description: 'Video reel 60 detik + foto aerial beresolusi tinggi', price: 350000 },
      { id: 102, trip_package_id: 1, name: 'Porter Pribadi (Bawa Tas & Barang)', description: 'Maksimal beban 15 kg per porter', price: 250000 },
      { id: 103, trip_package_id: 1, name: 'Sewa Trekking Pole (Tongkat Pendaki)', description: 'Sepasang tongkat ergonomis ultralight', price: 35000 }
    ],
    schedules: [
      { id: 1, trip_package_id: 1, trip_date: '2026-09-26', quota_total: 15, quota_terisi: 8, kuota_tersedia: 7, status: 'open' },
      { id: 2, trip_package_id: 1, trip_date: '2026-09-27', quota_total: 15, quota_terisi: 15, kuota_tersedia: 0, status: 'closed' },
      { id: 3, trip_package_id: 1, trip_date: '2026-10-03', quota_total: 20, quota_terisi: 6, kuota_tersedia: 14, status: 'open' },
      { id: 4, trip_package_id: 1, trip_date: '2026-10-04', quota_total: 20, quota_terisi: 4, kuota_tersedia: 16, status: 'open' },
      { id: 5, trip_package_id: 1, trip_date: '2026-10-10', quota_total: 15, quota_terisi: 2, kuota_tersedia: 13, status: 'open' }
    ]
  },
  {
    id: 2,
    name: 'Explore One Day',
    slug: 'exploring-one-day-papandayan',
    category: 'mountain_trip',
    type: 'scheduled',
    duration_label: '1 Hari Penuh (Pagi - Sore)',
    short_description: 'Paket Explore singkat tanpa menginap, cocok untuk Anda yang memiliki waktu terbatas.',
    hero_image: '/oneday.jpg',
    min_dp_percentage: 30,
    is_active: true,
    facilities: [
      'Tiket Masuk & Simaksi Wisatawan',
      'Tour Guide berpengalaman',
      'Makan Siang Nasi Liwet Khas Sunda',
      'Snack & Welcome Drink kelapa muda',
      'Foto dokumentasi DSLR',
      'P3K dan jas hujan darurat'
    ],
    destinations: [
      'Kawah Mas & Kawah Baru',
      'Hutan Mati Mistis',
      'Ghober Hut Panorama View',
      'Pondok Saladah'
    ],
    itinerary: [
      { time: '07.30 - 08.15', activity: 'Registrasi di Basecamp Papandayan & pembagian snack box' },
      { time: '08.15 - 10.30', activity: 'Trekking menyusuri jalur kawah belerang & batuan vulkanik' },
      { time: '10.30 - 12.00', activity: 'Tiba di Hutan Mati, hunting foto lanskap surealis' },
      { time: '12.00 - 13.30', activity: 'Istirahat dan santap makan siang khas Sunda di area Pondok Saladah' },
      { time: '13.30 - 15.00', activity: 'Perjalanan menuju Ghober Hut & menikmati pemandangan perbukitan' },
      { time: '15.00 - 16.30', activity: 'Trekking kembali turun ke titik awal & penyerahan suvenir' }
    ],
    required_gear: [
      'Pakaian outdoor yang nyaman & menyerap keringat',
      'Sepatu trekking dengan tapak karet mantap',
      'Topi lapangan / buff pelindung debu belerang',
      'Sunscreen & kacamata hitam',
      'Tas ransel kecil (daypack 15-20L)'
    ],
    terms: [
      'Tersedia setiap akhir pekan dan hari libur nasional.',
      'Bisa request jadwal khusus (private) minimal 5 orang.',
      'Ketentuan refund mengikuti SOP resmi Pasak Outdoor Garut.'
    ],
    priceTiers: [
      { id: 8, trip_package_id: 2, customer_type: 'local', meeting_point: 'GN_PAPANDAYAN', min_participants: 1, max_participants: 3, price_per_person: 325000 },
      { id: 9, trip_package_id: 2, customer_type: 'local', meeting_point: 'GN_PAPANDAYAN', min_participants: 4, max_participants: 8, price_per_person: 260000 },
      { id: 10, trip_package_id: 2, customer_type: 'local', meeting_point: 'GN_PAPANDAYAN', min_participants: 9, max_participants: null, price_per_person: 215000 },
      { id: 11, trip_package_id: 2, customer_type: 'local', meeting_point: 'GARUT', min_participants: 4, max_participants: null, price_per_person: 360000 },
      { id: 12, trip_package_id: 2, customer_type: 'foreign', meeting_point: 'GN_PAPANDAYAN', min_participants: 1, max_participants: null, price_per_person: 580000 }
    ],
    addons: [
      { id: 104, trip_package_id: 2, name: 'Dokumentasi Video Drone 4K', description: 'Termasuk pilot & footage full edited', price: 350000 },
      { id: 105, trip_package_id: 2, name: 'Sewa Jaket Gunung Fleece', description: 'Jaket outdoor hangat bersih higienis', price: 50000 }
    ],
    schedules: [
      { id: 6, trip_package_id: 2, trip_date: '2026-09-26', quota_total: 20, quota_terisi: 5, kuota_tersedia: 15, status: 'open' },
      { id: 7, trip_package_id: 2, trip_date: '2026-10-03', quota_total: 20, quota_terisi: 8, kuota_tersedia: 12, status: 'open' },
      { id: 8, trip_package_id: 2, trip_date: '2026-10-10', quota_total: 20, quota_terisi: 3, kuota_tersedia: 17, status: 'open' }
    ]
  },
  {
    id: 3,
    name: 'Private Camp',
    slug: 'camping-ghober-hut-2d1n',
    category: 'camping',
    type: 'private',
    duration_label: '2 Hari 1 Malam',
    short_description: 'Pengalaman kamping eksklusif bersama keluarga/sahabat tanpa digabung rombongan lain.',
    hero_image: '/privatecamp.JPG',
    min_dp_percentage: 30,
    is_active: true,
    facilities: [
      'Tenda dome kapasitas 4 (diisi maks 3 agar leluasa)',
      'Matras spons tebal & sleeping bag hangat per peserta',
      'Lampu tenda LED & peralatan masak camp',
      '3x Makan (Makan malam camp, sarapan pagi, makan siang)',
      'Coffee / Tea Break sepuasnya di api unggun',
      'Tiket camping resmi & asuransi wisata',
      'Guide & porter perlengkapan camp'
    ],
    destinations: [
      'Area Camp Ghober Hut',
      'Spot Sunrise Ghober Viewpoint',
      'Hutan Mati Papandayan',
      'Pondok Saladah'
    ],
    itinerary: [
      { time: 'Hari 1 - 13.00', activity: 'Kumpul di Basecamp Pasak Outdoor, briefing & start trekking santai' },
      { time: 'Hari 1 - 16.00', activity: 'Tiba di lokasi camp Ghober Hut, pembagian tenda & nikmati sunset' },
      { time: 'Hari 1 - 19.00', activity: 'Makan malam hangat, api unggun, obrolan santai & hunting Milky Way' },
      { time: 'Hari 2 - 05.00', activity: 'Bangun menikmati golden sunrise berlatar perbukitan Garut' },
      { time: 'Hari 2 - 07.00', activity: 'Sarapan hangat, seduhan kopi Garut & eksplorasi Hutan Mati' },
      { time: 'Hari 2 - 10.00', activity: 'Packing perlengkapan & perjalanan turun kembali ke Basecamp' },
      { time: 'Hari 2 - 12.30', activity: 'Tiba di basecamp, makan siang penutup, persiapan kepulangan' }
    ],
    required_gear: [
      'Jaket tebal / windbreaker (suhu malam 8-12°C)',
      'Pakaian hangat lapis cadangan & kupluk/beanie',
      'Kaos kaki wol tebal & sarung tangan',
      'Powerbank & alat mandi sederhana',
      'Headlamp / senter'
    ],
    terms: [
      'Peserta dilarang membuang sampah sembarangan (Zero Waste Camp).',
      'Dilarang merusak edelweiss dan tanaman endemik gunung.',
      'DP 30% via transfer bank atau QRIS.'
    ],
    priceTiers: [
      { id: 13, trip_package_id: 3, customer_type: 'local', meeting_point: 'GN_PAPANDAYAN', min_participants: 2, max_participants: 4, price_per_person: 650000 },
      { id: 14, trip_package_id: 3, customer_type: 'local', meeting_point: 'GN_PAPANDAYAN', min_participants: 5, max_participants: 10, price_per_person: 520000 },
      { id: 15, trip_package_id: 3, customer_type: 'local', meeting_point: 'GARUT', min_participants: 4, max_participants: null, price_per_person: 690000 },
      { id: 16, trip_package_id: 3, customer_type: 'foreign', meeting_point: 'GN_PAPANDAYAN', min_participants: 1, max_participants: null, price_per_person: 1100000 }
    ],
    addons: [
      { id: 106, trip_package_id: 3, name: 'Paket BBQ Camp Sosis & Daging Marinasi', description: 'Paket memanggang lezat bersama teman', price: 150000 },
      { id: 107, trip_package_id: 3, name: 'Dokumentasi Cinematic Drone & Camp Life', description: 'Video kompilasi estetik 2 hari', price: 500000 },
      { id: 108, trip_package_id: 3, name: 'Private Porter Pribadi (Carrier Sendiri)', description: 'Porter bawa tas pribadi bolak balik', price: 350000 }
    ],
    schedules: [
      { id: 9, trip_package_id: 3, trip_date: '2026-09-26', quota_total: 12, quota_terisi: 6, kuota_tersedia: 6, status: 'open' },
      { id: 10, trip_package_id: 3, trip_date: '2026-10-03', quota_total: 12, quota_terisi: 8, kuota_tersedia: 4, status: 'open' },
      { id: 11, trip_package_id: 3, trip_date: '2026-10-10', quota_total: 12, quota_terisi: 0, kuota_tersedia: 12, status: 'open' }
    ]
  },
  {
    id: 4,
    name: 'VIP CAMP',
    slug: 'vip-glamping-pondok-saladah',
    category: 'camping',
    type: 'private',
    duration_label: '2 Hari 1 Malam (VIP Private)',
    short_description: 'Layanan Camping premium class (glamping concept) dengan layanan serba maximal',
    hero_image: '/vipcamp.jpg',
    min_dp_percentage: 40,
    is_active: true,
    facilities: [
      'Tenda Glamping Bell Tent Mewah berdiri tegap',
      'Kasur busa empuk, selimut duvet & bantal empuk',
      'Meja & kursi lipat camping kayu estetik',
      'Private Chef memasak hidangan lezat hangat di gunung',
      'Lampu ambient fairy lights & penghangat',
      'Semua barang bawaan diurus tim porter khusus'
    ],
    destinations: [
      'Pondok Saladah Edelweiss Field',
      'Hutan Mati Private Sunset Trek',
      'Tebing Soni Exclusive Morning Trek'
    ],
    itinerary: [
      { time: 'Hari 1 - 10.00', activity: 'Penjemputan VIP di Hotel Garut / Meeting Point dengan kendaraan 4x4' },
      { time: 'Hari 1 - 11.30', activity: 'Tiba di camp, disambut welcome drink & santapan siang spesial' },
      { time: 'Hari 1 - 15.30', activity: 'Tea time di padang edelweiss & jalan santai ke Hutan Mati' },
      { time: 'Hari 1 - 19.00', activity: 'Special Mountain BBQ Dinner & live acoustic campfire' },
      { time: 'Hari 2 - 05.00', activity: 'Golden sunrise trek santai & sarapan ala carte berlatar kawah' },
      { time: 'Hari 2 - 11.00', activity: 'Check out tenda & diantar kembali ke lokasi penjemputan' }
    ],
    required_gear: [
      'Pakaian hangat santai',
      'Kamera pribadi',
      'Perlengkapan pribadi'
    ],
    terms: [
      'Khusus grup private minimal 4 orang.',
      'Reservasi paling lambat H-7 untuk persiapan logistik VIP.'
    ],
    priceTiers: [
      { id: 17, trip_package_id: 4, customer_type: 'local', meeting_point: 'GN_PAPANDAYAN', min_participants: 4, max_participants: 8, price_per_person: 1250000 },
      { id: 18, trip_package_id: 4, customer_type: 'local', meeting_point: 'GARUT', min_participants: 4, max_participants: 8, price_per_person: 1450000 },
      { id: 19, trip_package_id: 4, customer_type: 'foreign', meeting_point: 'GN_PAPANDAYAN', min_participants: 4, max_participants: 8, price_per_person: 1950000 }
    ],
    addons: [
      { id: 109, trip_package_id: 4, name: 'Sesi Foto & Video Bersama Fotografer Profesional', description: '100+ edit foto + reel 90 detik', price: 750000 }
    ],
    schedules: []
  }
];

export const initialArticles: Article[] = [
  {
    id: 1,
    title: 'Mengenal Gunung Papandayan: Wisata Alam Andalan Garut',
    slug: 'mengenal-gunung-papandayan',
    category: 'Tentang Papandayan',
    cover_image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    author_name: 'Admin Papandayan',
    published_at: '15 September 2026',
    read_time: '4 menit baca',
    content: `Gunung Papandayan adalah salah satu gunung berapi aktif di Jawa Barat yang terkenal dengan kawah belerang, hutan mati, dan padang edelweiss di Pondok Saladah.

Berbeda dengan gunung-gunung tinggi lainnya, Papandayan relatif ramah untuk pendaki pemula karena akses jalurnya yang tidak terlalu ekstrem, sehingga cocok untuk trip sehari (one day trip) maupun camping akhir pekan.

Selain trekking, kawasan ini juga menawarkan spot foto ikonik seperti Tebing Soni untuk berburu sunrise dan Hutan Mati yang punya nuansa dramatis berkabut. Kawasan ini dikelola dengan baik bersama BKSDA Jawa Barat sehingga keasrian ekosistemnya tetap terjaga.`
  },
  {
    id: 2,
    title: '5 Tips Persiapan Sebelum Pendakian Papandayan',
    slug: 'tips-persiapan-pendakian-papandayan',
    category: 'Tips Pendakian',
    cover_image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    author_name: 'Admin Papandayan',
    published_at: '12 September 2026',
    read_time: '5 menit baca',
    content: `1. Gunakan sepatu gunung atau sepatu olahraga yang sudah teruji, hindari sandal jepit di jalur berbatu.
    
2. Bawa jaket hangat karena suhu di area kawah dan Tebing Soni bisa cukup dingin, terutama menjelang sunrise (berkisar antara 10°C - 15°C).

3. Cek kondisi kesehatan sebelum berangkat — kalau punya riwayat penyakit kronis, konsultasikan ke dokter dan infokan ke guide kami di lapangan.

4. Bawa air minum cukup meski sudah disediakan air mineral dari paket, terutama untuk peserta yang mudah dehidrasi saat berjalan menanjak.

5. Datang tepat waktu di meeting point, karena itinerary sunrise trip sangat bergantung pada jadwal supaya tidak ketinggalan momen matahari terbit yang memesona.`
  },
  {
    id: 3,
    title: 'Camping di Ghober Hut: Pengalaman Malam di Papandayan',
    slug: 'camping-di-ghober-hut',
    category: 'Tips Camping',
    cover_image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
    author_name: 'Admin Papandayan',
    published_at: '8 September 2026',
    read_time: '6 menit baca',
    content: `Ghober Hut menjadi salah satu area camping favorit di jalur Papandayan karena posisinya yang cukup datar dan dekat dengan jalur ke Pondok Saladah serta Hutan Mati.

Malam hari di sini menawarkan pemandangan langit yang relatif bersih dari polusi cahaya, sangat cocok untuk hunting Milky Way saat cuaca cerah.

Pastikan membawa perlengkapan camping pribadi tambahan seperti sleeping bag cadangan atau pakaian hangat ekstra, karena suhu malam di area camp bisa turun cukup signifikan. Bersama tim Pasak Outdoor, tenda dan keperluan logistik Anda disiapkan secara profesional.`
  },
  {
    id: 4,
    title: 'Cerita Perjalanan: Sunrise Pertama di Tebing Soni',
    slug: 'cerita-sunrise-pertama-tebing-soni',
    category: 'Cerita Perjalanan',
    cover_image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80',
    author_name: 'Admin Papandayan',
    published_at: '2 September 2026',
    read_time: '3 menit baca',
    content: `Pukul 4 pagi, rombongan kami mulai trekking dari titik aklimatisasi menuju Tebing Soni. Gelap masih menyelimuti jalur, hanya cahaya headlamp yang menuntun langkah kami satu demi satu.

Setibanya di Tebing Soni sekitar pukul 5, langit perlahan berubah warna — gradasi jingga, merah muda, dan ungu di atas kawah Papandayan jadi pemandangan yang sulit dilupakan. Asap belerang tipis yang mengepul dari dasar kawah diterpa sinar mentari pagi membuat suasana terasa mistis sekaligus megah.

Momen ini jadi alasan kenapa banyak orang rela bangun dini hari dan menempuh jalur menanjak: sunrise di Papandayan memang punya daya tarik tersendiri yang selalu memanggil untuk kembali.`
  }
];

export const initialTestimonials: Testimonial[] = [
  {
    id: 1,
    customer_name: 'Dian Pratiwi',
    rating: 5,
    trip_name: 'Sunrise Trip Moment',
    content: 'Sunrise-nya luar biasa! Guide-nya ramah dan sangat paham medan. Worth it banget buat yang jarang naik gunung kayak saya.'
  },
  {
    id: 2,
    customer_name: 'Rafi Ardiansyah',
    rating: 5,
    trip_name: 'Exploring One Day Papandayan',
    content: 'Trip paling terorganisir yang pernah saya ikuti. Dari penjemputan sampai turun semuanya on schedule, dokumentasinya juga bagus.'
  },
  {
    id: 3,
    customer_name: 'Sinta Maharani',
    rating: 4,
    trip_name: 'Sunrise Trip Moment',
    content: 'Pemandangan Kawah dan Hutan Mati keren banget buat foto. Cuma agak capek karena jalur lumayan menanjak, tapi worth it kok.'
  },
  {
    id: 4,
    customer_name: 'Bayu Firmansyah',
    rating: 5,
    trip_name: 'Camping Ghober Hut 2D1N',
    content: 'Sudah 3 kali ikut trip di sini, selalu puas. P3K dan tim medis siaga, jadi lebih tenang bawa keluarga dan anak-anak.'
  },
  {
    id: 5,
    customer_name: 'Nadia Kusuma',
    rating: 4,
    trip_name: 'VIP Glamping Camp',
    content: 'Booking-nya gampang, DP juga fleksibel. Tim guide sigap membawakan perlengkapan dan makanannya enak banget di atas gunung!'
  }
];

export const initialGalleries: GalleryItem[] = [
  {
    id: 1,
    title: 'Pesona Golden Sunrise Tebing Soni',
    category: 'Sunrise',
    image_url: '/sunrise.jpg',
    caption: 'Gradasi langit fajar keemasan di puncak Tebing Soni menghadap hamparan kawah aktif Papandayan Garut.'
  },
  {
    id: 2,
    title: 'Eksplorasi One Day Trekking Kawah',
    category: 'Aktivitas',
    image_url: '/oneday.jpg',
    caption: 'Petualangan melintasi batuan vulkanik aktif, kawah belerang, dan jalur eksotis Papandayan.'
  },
  {
    id: 3,
    title: 'Kenyamanan Private Camping Ghober Hut',
    category: 'Camping',
    image_url: '/privatecamp.jpg',
    caption: 'Suasana berkemah eksklusif dengan perlengkapan tenda premium dan hangatnya api unggun di alam terbuka.'
  },
  {
    id: 4,
    title: 'VIP Glamping & Camping Papandayan',
    category: 'Camping',
    image_url: '/vipcamp.jpg',
    caption: 'Fasilitas glamping mewah dengan kasur empuk, perlengkapan lengkap, dan panorama langsung puncak gunung.'
  },
  {
    id: 5,
    title: 'Nuansa Mistis Hutan Mati Cantigi',
    category: 'Lanskap',
    image_url: '/hutanmati.JPG',
    caption: 'Siluet batang pohon cantigi hitam nan legendaris berdiri anggun di atas hamparan kapur putih.'
  },
  {
    id: 6,
    title: 'Kehangatan Suasana Private Camp',
    category: 'Camping',
    image_url: '/privatecamp.JPG',
    caption: 'Momen kebersamaan mendirikan tenda dan menikmati malam sejuk di alam pegunungan Papandayan.'
  },
  {
    id: 7,
    title: 'Logo & Emblem Resmi papandayan_id',
    category: 'Aktivitas',
    image_url: '/logo (2).png',
    caption: 'Identitas resmi operator trip gunung Papandayan terpercaya sejak 2018.'
  }
];

export const initialPartners: Partner[] = [
  { id: 1, name: 'PT Pasak Outdoor Garut', logo_url: 'Pasak Outdoor', type: 'partner' },
  { id: 2, name: 'BKSDA Jawa Barat', logo_url: 'BKSDA Jabar', type: 'partner' },
  { id: 3, name: 'Disparbud Garut', logo_url: 'Pesona Garut', type: 'partner' },
  { id: 4, name: 'Bank BJB', logo_url: 'Bank BJB', type: 'client' },
  { id: 5, name: 'Telkom Indonesia', logo_url: 'Telkom', type: 'client' },
  { id: 6, name: 'Eiger Adventure Club', logo_url: 'Eiger', type: 'client' }
];

export const initialBookings: Booking[] = [
  {
    id: 1,
    booking_code: 'PAP-2026-0921',
    trip_package_id: 1,
    trip_package: initialTripPackages[0],
    trip_schedule_id: 1,
    trip_schedule_date: '2026-09-26',
    meeting_point: 'GN_PAPANDAYAN',
    customer_type: 'local',
    customer_name: 'Budi Santoso',
    customer_email: 'budi.santoso@gmail.com',
    customer_phone: '081234567890',
    participant_count: 3,
    participants: [
      { name: 'Budi Santoso', identity_number: '3205012345670001' },
      { name: 'Andi Pratama', identity_number: '3205012345670002' },
      { name: 'Rian Saputra', identity_number: '3205012345670003' }
    ],
    addons: [
      { addon_id: 101, name: 'Dokumentasi Cinematic Drone 4K', price: 350000 }
    ],
    tier_price_per_person: 350000,
    total_amount: 1400000,
    dp_amount: 420000,
    paid_amount: 420000,
    status: 'confirmed',
    created_at: '2026-09-18 14:30',
    payment_method: 'BCA Virtual Account'
  },
  {
    id: 2,
    booking_code: 'PAP-2026-0922',
    trip_package_id: 3,
    trip_package: initialTripPackages[2],
    trip_schedule_id: 9,
    trip_schedule_date: '2026-09-26',
    meeting_point: 'GN_PAPANDAYAN',
    customer_type: 'local',
    customer_name: 'Citra Kirana',
    customer_email: 'citra.kirana@gmail.com',
    customer_phone: '085712345678',
    participant_count: 4,
    participants: [
      { name: 'Citra Kirana', identity_number: '3205019876540001' },
      { name: 'Dimas Anggara', identity_number: '3205019876540002' },
      { name: 'Lia Anindya', identity_number: '3205019876540003' },
      { name: 'Fikri Haikal', identity_number: '3205019876540004' }
    ],
    addons: [
      { addon_id: 106, name: 'Paket BBQ Camp Sosis & Daging Marinasi', price: 150000 }
    ],
    tier_price_per_person: 650000,
    total_amount: 2750000,
    dp_amount: 825000,
    paid_amount: 0,
    status: 'waiting_payment',
    created_at: '2026-09-19 08:15'
  },
  {
    id: 3,
    booking_code: 'PAP-2026-0923',
    trip_package_id: 2,
    trip_package: initialTripPackages[1],
    trip_schedule_id: 5,
    trip_schedule_date: '2026-09-27',
    meeting_point: 'GN_PAPANDAYAN',
    customer_type: 'local',
    customer_name: 'Dewi Lestari',
    customer_email: 'dewi.lestari@gmail.com',
    customer_phone: '081398765432',
    participant_count: 2,
    participants: [
      { name: 'Dewi Lestari', identity_number: '3205016543210001' },
      { name: 'Rangga Prawira', identity_number: '3205016543210002' }
    ],
    addons: [
      { addon_id: 104, name: 'Sewa Tenda Dome Kapasitas 4', price: 80000 }
    ],
    tier_price_per_person: 450000,
    total_amount: 980000,
    dp_amount: 294000,
    paid_amount: 294000,
    status: 'waiting_payment',
    created_at: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')} 09:15`
  }
];

// Aliases
export const MOCK_TRIP_PACKAGES = initialTripPackages;
export const MOCK_ARTICLES = initialArticles;
export const MOCK_TESTIMONIALS = initialTestimonials;
export const MOCK_GALLERIES = initialGalleries;
export const MOCK_PARTNERS = initialPartners;
export const MOCK_INITIAL_BOOKINGS = initialBookings;

