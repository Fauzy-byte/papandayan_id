import React, { useState, useEffect } from 'react';
import { 
  TripPackage, 
  Article, 
  Testimonial, 
  GalleryItem, 
  Partner, 
  Booking, 
  BookingStatus,
  FaqItem
} from './types';
import { 
  MOCK_TRIP_PACKAGES, 
  MOCK_ARTICLES, 
  MOCK_TESTIMONIALS, 
  MOCK_GALLERIES, 
  MOCK_PARTNERS, 
  MOCK_INITIAL_BOOKINGS 
} from './data/mockData';
import { 
  INITIAL_FAQS, 
  loadStoredFaqs, 
  saveStoredFaqs, 
  syncFaqToFirestore, 
  removeFaqFromFirestore 
} from './data/faqData';
import {
  INITIAL_GALLERIES,
  loadStoredGalleries,
  saveStoredGalleries
} from './data/galleryData';

import { 
  auth, 
  db, 
  signInWithGoogle, 
  logOutUser, 
  testFirebaseConnection 
} from './firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BookingLookupModal } from './components/BookingLookupModal';
import { HelpModal } from './components/HelpModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminTopBar } from './components/AdminTopBar';
import { MapsGroundingModal } from './components/MapsGroundingModal';
import { ImageStudioModal } from './components/ImageStudioModal';
import { BookingSuccessModal } from './components/BookingSuccessModal';
import { sendEmailNotification } from './utils/notificationService';
import { formatBookingTimestamp } from './utils/timeUtils';

import { HomeView } from './views/HomeView';
import { TripPackagesView } from './views/TripPackagesView';
import { TripPackageDetailView } from './views/TripPackageDetailView';
import { BookingCreateView } from './views/BookingCreateView';
import { BookingDetailView } from './views/BookingDetailView';
import { ArticlesView } from './views/ArticlesView';
import { ArticleDetailView } from './views/ArticleDetailView';
import { GalleriesView } from './views/GalleriesView';
import { AdminView } from './views/AdminView';

export function App() {
  // Data state
  const [packages] = useState<TripPackage[]>(MOCK_TRIP_PACKAGES);
  const [articles] = useState<Article[]>(MOCK_ARTICLES);
  const [testimonials] = useState<Testimonial[]>(MOCK_TESTIMONIALS);
  const [galleries, setGalleries] = useState<GalleryItem[]>(() => loadStoredGalleries());
  const [partners] = useState<Partner[]>(MOCK_PARTNERS);

  // Firebase Auth state
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  // Bookings state with persistence (Firestore + LocalStorage)
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem('papandayan_bookings');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return MOCK_INITIAL_BOOKINGS;
  });

  // Dynamic FAQs state with localStorage fallback & Firestore synchronization
  const [faqs, setFaqs] = useState<FaqItem[]>(() => loadStoredFaqs());

  // Test Firebase connection & attach real-time listeners on boot
  useEffect(() => {
    testFirebaseConnection();

    // 1. Auth state listener
    let unsubAuth = () => {};
    try {
      unsubAuth = onAuthStateChanged(auth, (user) => {
        setFirebaseUser(user);
      });
    } catch (e) {
      console.warn('Auth listener init error:', e);
    }

    // 2. Real-time Firestore bookings listener with graceful error suppression
    let unsubBookings = () => {};
    try {
      unsubBookings = onSnapshot(
        collection(db, 'bookings'),
        (snapshot) => {
          if (!snapshot.empty) {
            const remoteBookings: Booking[] = [];
            snapshot.forEach((docSnap) => {
              remoteBookings.push(docSnap.data() as Booking);
            });

            setBookings((prev) => {
              const map = new Map<string, Booking>();
              prev.forEach((b) => map.set(b.booking_code, b));
              remoteBookings.forEach((b) => map.set(b.booking_code, b));
              return Array.from(map.values()).sort((a, b) =>
                (b.created_at || '').localeCompare(a.created_at || '')
              );
            });
          }
        },
        (err) => {
          // Keep local state intact when offline or WebChannel RPC stream drops
          console.debug('Firestore bookings running in offline fallback mode:', err?.message);
        }
      );
    } catch (e) {
      console.warn('Firestore bookings snapshot init error:', e);
    }

    // 3. Real-time Firestore FAQs listener with graceful error suppression
    let unsubFaqs = () => {};
    try {
      unsubFaqs = onSnapshot(
        collection(db, 'faqs'),
        (snapshot) => {
          if (!snapshot.empty) {
            const remoteFaqs: FaqItem[] = [];
            snapshot.forEach((docSnap) => {
              remoteFaqs.push(docSnap.data() as FaqItem);
            });

            setFaqs((prev) => {
              const map = new Map<string, FaqItem>();
              prev.forEach((f) => map.set(f.id, f));
              remoteFaqs.forEach((f) => map.set(f.id, f));
              const merged = Array.from(map.values());
              saveStoredFaqs(merged);
              return merged;
            });
          }
        },
        (err) => {
          console.debug('Firestore FAQs running in offline fallback mode:', err?.message);
        }
      );
    } catch (e) {
      console.warn('Firestore FAQs snapshot init error:', e);
    }

    return () => {
      try {
        unsubAuth();
        unsubBookings();
        unsubFaqs();
      } catch (e) {
        console.warn('Cleanup error:', e);
      }
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('papandayan_bookings', JSON.stringify(bookings));
    } catch (e) {
      console.error(e);
    }
  }, [bookings]);

  // View state
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedPackageSlug, setSelectedPackageSlug] = useState<string>('sunrise-trip-moment');
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string>('mengenal-gunung-papandayan');
  const [selectedBookingCode, setSelectedBookingCode] = useState<string>('PAP-2026-0921');
  
  // Secure Admin Authentication state (Session-isolated for customer data security)
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('papandayan_admin_session') === 'active';
    } catch {
      return false;
    }
  });
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);

  // Modals state
  const [isLookupOpen, setIsLookupOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [helpTopic, setHelpTopic] = useState<string>('faq');
  const [isMapsOpen, setIsMapsOpen] = useState<boolean>(false);
  const [isImageStudioOpen, setIsImageStudioOpen] = useState<boolean>(false);
  const [submittedBooking, setSubmittedBooking] = useState<Booking | null>(null);
  const [isBookingSuccessOpen, setIsBookingSuccessOpen] = useState<boolean>(false);

  // Navigation router with route-guard for admin
  const handleNavigate = (view: string, param?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (view === 'admin') {
      if (!isAdmin) {
        setIsAdminLoginOpen(true);
        return;
      }
      setCurrentView('admin');
      return;
    }

    if (view === 'package-detail') {
      if (param) setSelectedPackageSlug(param);
      setCurrentView('package-detail');
      return;
    }

    if (view === 'booking-create') {
      if (param) setSelectedPackageSlug(param);
      setCurrentView('booking-create');
      return;
    }

    if (view === 'booking-detail') {
      // Data pemesanan hanya dapat dibuka oleh admin
      if (!isAdmin) {
        setIsAdminLoginOpen(true);
        return;
      }
      if (param) setSelectedBookingCode(param);
      setCurrentView('booking-detail');
      return;
    }

    if (view === 'article-detail') {
      if (param) setSelectedArticleSlug(param);
      setCurrentView('article-detail');
      return;
    }

    setCurrentView(view);
  };

  const handleOpenHelp = (topic: string = 'faq') => {
    setHelpTopic(topic);
    setIsHelpOpen(true);
  };

  // Admin authentication handlers
  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    try {
      sessionStorage.setItem('papandayan_admin_session', 'active');
    } catch (e) {
      console.error(e);
    }
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    try {
      sessionStorage.removeItem('papandayan_admin_session');
    } catch (e) {
      console.error(e);
    }
    if (currentView === 'admin') {
      setCurrentView('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // FAQ actions
  const handleAddFaq = (faqData: Omit<FaqItem, 'id' | 'created_at'>) => {
    const newFaq: FaqItem = {
      ...faqData,
      id: `faq-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    const updated = [newFaq, ...faqs];
    setFaqs(updated);
    saveStoredFaqs(updated);
    syncFaqToFirestore(newFaq);
  };

  const handleUpdateFaq = (updatedFaq: FaqItem) => {
    const updated = faqs.map(f => f.id === updatedFaq.id ? updatedFaq : f);
    setFaqs(updated);
    saveStoredFaqs(updated);
    syncFaqToFirestore(updatedFaq);
  };

  const handleDeleteFaq = (id: string) => {
    const updated = faqs.filter(f => f.id !== id);
    setFaqs(updated);
    saveStoredFaqs(updated);
    removeFaqFromFirestore(id);
  };

  const handleResetFaqs = () => {
    setFaqs(INITIAL_FAQS);
    saveStoredFaqs(INITIAL_FAQS);
    INITIAL_FAQS.forEach(f => syncFaqToFirestore(f));
  };

  // Gallery actions
  const handleAddGallery = (itemData: Omit<GalleryItem, 'id'>) => {
    const nextId = galleries.length > 0 ? Math.max(...galleries.map(g => g.id)) + 1 : 1;
    const newItem: GalleryItem = {
      ...itemData,
      id: nextId
    };
    const updated = [newItem, ...galleries];
    setGalleries(updated);
    saveStoredGalleries(updated);
  };

  const handleUpdateGallery = (updatedItem: GalleryItem) => {
    const updated = galleries.map(g => g.id === updatedItem.id ? updatedItem : g);
    setGalleries(updated);
    saveStoredGalleries(updated);
  };

  const handleDeleteGallery = (id: number) => {
    const updated = galleries.filter(g => g.id !== id);
    setGalleries(updated);
    saveStoredGalleries(updated);
  };

  const handleResetGalleries = () => {
    setGalleries(INITIAL_GALLERIES);
    saveStoredGalleries(INITIAL_GALLERIES);
  };

  // Booking actions
  const handleSubmitBooking = async (newBooking: Booking) => {
    try {
      await setDoc(doc(db, 'bookings', newBooking.booking_code), {
        ...newBooking,
        userId: firebaseUser?.uid || null,
        userEmail: firebaseUser?.email || newBooking.customer_email
      });
    } catch (err) {
      console.warn('Firestore save warning:', err);
    }
    setBookings(prev => [newBooking, ...prev.filter(b => b.booking_code !== newBooking.booking_code)]);
    setSelectedBookingCode(newBooking.booking_code);

    if (isAdmin) {
      setCurrentView('booking-detail');
    } else {
      setSubmittedBooking(newBooking);
      setIsBookingSuccessOpen(true);
      setCurrentView('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateBooking = async (updated: Booking) => {
    try {
      await setDoc(doc(db, 'bookings', updated.booking_code), updated, { merge: true });
    } catch (err) {
      console.warn('Firestore update warning:', err);
    }
    setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
  };

  const handleUpdateBookingStatus = async (id: number, newStatus: BookingStatus) => {
    const target = bookings.find(b => b.id === id);
    if (target) {
      const nowStr = formatBookingTimestamp(new Date());
      const isConfirming = newStatus === 'confirmed';
      const updated: Booking = { 
        ...target, 
        status: newStatus,
        paid_amount: (isConfirming && target.paid_amount === 0) ? target.dp_amount : target.paid_amount,
        paid_at: isConfirming ? (target.paid_at || nowStr) : target.paid_at,
        email_notified_at: isConfirming ? nowStr : target.email_notified_at,
        email_notification_status: isConfirming ? 'sent' : target.email_notification_status
      };
      
      try {
        await setDoc(doc(db, 'bookings', target.booking_code), updated, { merge: true });
      } catch (err) {
        console.warn('Firestore status update warning:', err);
      }
      
      setBookings(prev => prev.map(b => b.id === id ? updated : b));

      if (isConfirming) {
        sendEmailNotification(updated, 'dp_confirmed', target.payment_method || 'Verifikasi Admin').catch(console.warn);
      }
    }
  };

  // Find active items
  const activePackage = packages.find(p => p.slug === selectedPackageSlug) || packages[0];
  const activeArticle = articles.find(a => a.slug === selectedArticleSlug) || articles[0];
  const activeBooking = bookings.find(b => b.booking_code === selectedBookingCode) || bookings[0];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      {/* Top Banner when Administrator Mode is Active */}
      {isAdmin && (
        <AdminTopBar
          currentView={currentView}
          onNavigate={handleNavigate}
          onLogout={handleAdminLogout}
          onOpenMapsGuide={() => setIsMapsOpen(true)}
          onOpenImageStudio={() => setIsImageStudioOpen(true)}
          firebaseUser={firebaseUser}
          onSignInGoogle={async () => {
            try {
              await signInWithGoogle();
            } catch (err) {
              console.error('Google sign-in error:', err);
            }
          }}
          onSignOutGoogle={async () => {
            try {
              await logOutUser();
            } catch (err) {
              console.error('Google sign-out error:', err);
            }
          }}
        />
      )}

      {/* Header Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onAdminLogout={handleAdminLogout}
        onOpenLookup={() => setIsLookupOpen(true)}
        onOpenHelp={handleOpenHelp}
        firebaseUser={firebaseUser}
        onSignInGoogle={async () => {
          try {
            await signInWithGoogle();
          } catch (err) {
            console.error('Google sign-in error:', err);
          }
        }}
        onSignOutGoogle={async () => {
          try {
            await logOutUser();
          } catch (err) {
            console.error('Google sign-out error:', err);
          }
        }}
        onOpenMapsGuide={() => setIsMapsOpen(true)}
        onOpenImageStudio={() => setIsImageStudioOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            packages={packages}
            articles={articles}
            testimonials={testimonials}
            galleries={galleries}
            partners={partners}
            onNavigate={handleNavigate}
            isAdmin={isAdmin}
            onOpenMapsGuide={() => setIsMapsOpen(true)}
            onOpenImageStudio={() => setIsImageStudioOpen(true)}
          />
        )}

        {currentView === 'packages' && (
          <TripPackagesView
            packages={packages}
            onSelectPackage={(slug) => handleNavigate('package-detail', slug)}
            onBookDirect={(slug) => handleNavigate('booking-create', slug)}
          />
        )}

        {currentView === 'package-detail' && activePackage && (
          <TripPackageDetailView
            packageData={activePackage}
            onBack={() => handleNavigate('packages')}
            onBook={(slug) => handleNavigate('booking-create', slug)}
          />
        )}

        {currentView === 'booking-create' && activePackage && (
          <BookingCreateView
            packageData={activePackage}
            onBack={() => handleNavigate('package-detail', activePackage.slug)}
            onSubmitBooking={handleSubmitBooking}
          />
        )}

        {currentView === 'booking-detail' && activeBooking && (
          isAdmin ? (
            <BookingDetailView
              booking={activeBooking}
              onBack={() => handleNavigate('admin')}
              onUpdateBooking={handleUpdateBooking}
            />
          ) : (
            <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-amber-200 text-center shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center mb-3">
                <span className="text-xl">🔒</span>
              </div>
              <p className="text-amber-700 font-bold text-xs uppercase tracking-wider mb-1">Akses Terproteksi</p>
              <h2 className="text-xl font-black text-navy-950 mb-2">Data Pemesanan Khusus Admin</h2>
              <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                Rincian data pesanan, daftar identitas peserta, dan bukti pembayaran hanya dapat diakses oleh staf administrator operasional.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={() => setIsAdminLoginOpen(true)}
                  className="px-4 py-2.5 bg-navy-950 hover:bg-navy-900 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Login Administrator
                </button>
                <button
                  onClick={() => handleNavigate('home')}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-navy-900 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Kembali ke Beranda
                </button>
              </div>
            </div>
          )
        )}

        {currentView === 'articles' && (
          <ArticlesView
            articles={articles}
            onSelectArticle={(slug) => handleNavigate('article-detail', slug)}
          />
        )}

        {currentView === 'article-detail' && activeArticle && (
          <ArticleDetailView
            article={activeArticle}
            relatedArticles={articles.filter(a => a.id !== activeArticle.id)}
            onBack={() => handleNavigate('articles')}
            onSelectArticle={(slug) => handleNavigate('article-detail', slug)}
            onNavigatePackages={() => handleNavigate('packages')}
          />
        )}

        {currentView === 'galleries' && (
          <GalleriesView
            galleries={galleries}
            onNavigatePackages={() => handleNavigate('packages')}
          />
        )}

        {currentView === 'admin' && (
          isAdmin ? (
            <AdminView
              bookings={bookings}
              onUpdateBookingStatus={handleUpdateBookingStatus}
              onViewBooking={(code) => handleNavigate('booking-detail', code)}
              onLogout={handleAdminLogout}
              onBackToVisitor={() => handleNavigate('home')}
              onOpenMapsGuide={() => setIsMapsOpen(true)}
              onOpenImageStudio={() => setIsImageStudioOpen(true)}
              firebaseUser={firebaseUser}
              onSignInGoogle={async () => {
                try {
                  await signInWithGoogle();
                } catch (err) {
                  console.error('Google sign-in error:', err);
                }
              }}
              onSignOutGoogle={async () => {
                try {
                  await logOutUser();
                } catch (err) {
                  console.error('Google sign-out error:', err);
                }
              }}
              faqs={faqs}
              onAddFaq={handleAddFaq}
              onUpdateFaq={handleUpdateFaq}
              onDeleteFaq={handleDeleteFaq}
              onResetFaqs={handleResetFaqs}
              galleries={galleries}
              onAddGallery={handleAddGallery}
              onUpdateGallery={handleUpdateGallery}
              onDeleteGallery={handleDeleteGallery}
              onResetGalleries={handleResetGalleries}
            />
          ) : (
            <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl border border-red-200 text-center shadow-lg">
              <p className="text-red-600 font-bold mb-2">Akses Ditolak: Diperlukan Autentikasi Admin</p>
              <p className="text-xs text-slate-600 mb-4">Anda harus masuk melalui portal kredensial staf operasional untuk membuka data pelanggan.</p>
              <button
                onClick={() => setIsAdminLoginOpen(true)}
                className="px-4 py-2 bg-navy-950 text-white rounded-xl text-xs font-bold"
              >
                Buka Login Admin
              </button>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenHelp={handleOpenHelp}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => {
          if (isAdmin) {
            handleNavigate('admin');
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
      />

      {/* Global Modals */}
      <BookingLookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
        bookings={bookings}
        onSelectBooking={(code) => handleNavigate('booking-detail', code)}
        isAdmin={isAdmin}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        initialTab={helpTopic}
        faqs={faqs}
      />

      <MapsGroundingModal
        isOpen={isMapsOpen}
        onClose={() => setIsMapsOpen(false)}
      />

      <ImageStudioModal
        isOpen={isImageStudioOpen}
        onClose={() => setIsImageStudioOpen(false)}
      />

      <BookingSuccessModal
        isOpen={isBookingSuccessOpen}
        onClose={() => setIsBookingSuccessOpen(false)}
        booking={submittedBooking}
      />
    </div>
  );
}
export default App;
