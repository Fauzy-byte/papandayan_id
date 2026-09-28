import { GalleryItem } from '../types';

export const INITIAL_GALLERIES: GalleryItem[] = [
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

const STORAGE_KEY = 'papandayan_galleries_v2';

export function loadStoredGalleries(): GalleryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Gagal memuat galeri dari localStorage:', err);
  }
  return INITIAL_GALLERIES;
}

export function saveStoredGalleries(galleries: GalleryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(galleries));
  } catch (err) {
    console.warn('Gagal menyimpan galeri ke localStorage:', err);
  }
}
