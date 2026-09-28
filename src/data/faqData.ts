import { FaqItem } from '../types';
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export const INITIAL_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Apakah jalur Gunung Papandayan cocok untuk pemula & keluarga?',
    answer: 'Sangat cocok! Jalur pendakian Papandayan tergolong ramah dengan kontur landai berbatu dan tangga alami. Kami juga menyediakan tim sweeper yang mendampingi peserta berjalan santai sesuai ritme masing-masing.',
    category: 'Jalur & Medan',
    created_at: '2026-09-20T10:00:00Z'
  },
  {
    id: 'faq-2',
    question: 'Di mana lokasi titik kumpul (Meeting Point)?',
    answer: 'Meeting Point utama berada di Basecamp Pasak Outdoor Camp David (Kawasan Parkir Atas Papandayan). Kami juga menyediakan opsi penjemputan di Stasiun Garut, Terminal Garut, dan Kota Bandung dengan biaya penyesuaian.',
    category: 'Meeting Point',
    created_at: '2026-09-20T10:05:00Z'
  },
  {
    id: 'faq-3',
    question: 'Bagaimana jika cuaca buruk atau hujan lebat?',
    answer: 'Keselamatan peserta adalah prioritas nomor satu. Jika BKSDA menutup jalur karena badai atau status vulkanik, peserta berhak mendapatkan pengalihan jadwal (reschedule) tanpa biaya tambahan atau refund sesuai ketentuan.',
    category: 'Keselamatan & Cuaca',
    created_at: '2026-09-20T10:10:00Z'
  },
  {
    id: 'faq-4',
    question: 'Apakah peserta wajib membawa tenda sendiri saat paket Camping?',
    answer: 'Tidak perlu! Pada paket Camping Ghober Hut dan VIP Glamping, tenda, matras, sleeping bag, hingga perlengkapan memasak sudah disediakan dan didirikan oleh tim porter kami.',
    category: 'Logistik & Peralatan',
    created_at: '2026-09-20T10:15:00Z'
  },
  {
    id: 'faq-5',
    question: 'Berapa persen minimal DP untuk mengunci jadwal trip?',
    answer: 'Minimal DP adalah 30% dari total tagihan untuk paket Sunrise & Explore One Day, serta 40% untuk paket VIP Glamping. Pelunasan dapat dilakukan paling lambat H-1 sebelum keberangkatan.',
    category: 'Pemesanan & DP',
    created_at: '2026-09-20T10:20:00Z'
  }
];

const STORAGE_KEY = 'papandayan_faqs';

export function loadStoredFaqs(): FaqItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load FAQs from localStorage:', err);
  }
  return INITIAL_FAQS;
}

export function saveStoredFaqs(faqs: FaqItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(faqs));
  } catch (err) {
    console.warn('Failed to save FAQs to localStorage:', err);
  }
}

// Firestore Realtime Synchronization helpers
export async function syncFaqToFirestore(faq: FaqItem): Promise<void> {
  try {
    const docRef = doc(db, 'faqs', faq.id);
    await setDoc(docRef, faq, { merge: true });
  } catch (err) {
    console.warn('Firestore FAQ sync warning:', err);
  }
}

export async function removeFaqFromFirestore(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'faqs', id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Firestore FAQ deletion warning:', err);
  }
}
