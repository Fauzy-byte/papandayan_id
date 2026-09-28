import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Phone, 
  Search, 
  ShieldCheck, 
  HelpCircle,
  Calendar,
  Mountain,
  BookOpen,
  Image as ImageIcon,
  Clock,
  Radio,
  ArrowRight,
  Compass,
  MapPin,
  Ticket,
  CheckCircle2,
  LogOut,
  Lock,
  Sparkles,
  Wand2,
  User as UserIcon
} from 'lucide-react';
import type { User as FirebaseUser } from 'firebase/auth';
import { BrandLogo } from './BrandLogo';
import { useRealtimeClock } from '../utils/timeUtils';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  isAdmin: boolean;
  onOpenAdminLogin: () => void;
  onAdminLogout: () => void;
  onOpenLookup: () => void;
  onOpenHelp: (topic?: string) => void;
  firebaseUser?: FirebaseUser | null;
  onSignInGoogle?: () => void;
  onSignOutGoogle?: () => void;
  onOpenMapsGuide?: () => void;
  onOpenImageStudio?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  isAdmin,
  onOpenAdminLogin,
  onAdminLogout,
  onOpenLookup,
  onOpenHelp,
  firebaseUser,
  onSignInGoogle,
  onSignOutGoogle,
  onOpenMapsGuide,
  onOpenImageStudio
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const clock = useRealtimeClock();

  // Handle body scroll lock & Escape key when fullscreen menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setMobileMenuOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleNav = (view: string, param?: string) => {
    onNavigate(view, param);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-navy-100/60 shadow-xs">
      {/* Top micro-bar (Biru Dongker / Navy 950) with Real-Time Clock */}
      <div className="bg-[#0f2252] text-blue-100 text-xs py-1.5 px-4 hidden md:block border-b border-navy-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Realtime Live Clock Indicator */}
            <div id="realtime-clock-badge" className="flex items-center gap-2 bg-[#071333] px-2.5 py-0.5 rounded-full border border-blue-400/25 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-bold text-amber-300 font-mono tracking-wide">
                {clock.timeString}
              </span>
              <span className="text-blue-300/60 text-[10px] hidden xl:inline">
                ({clock.formatted.split('•')[0].trim()})
              </span>
            </div>

            <span className="text-blue-300/40">|</span>

            <span className="flex items-center gap-1.5 font-medium text-blue-100">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Trip Organizer Resmi PT. Pasak Outdoor Garut (NIB: 1130320094709)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              id="top-check-booking-btn"
              onClick={onOpenLookup}
              className="hover:text-amber-300 transition flex items-center gap-1 text-blue-200 font-medium"
            >
              <Search className="w-3 h-3 text-amber-400" />
              Cek Status Booking
            </button>
            <span className="text-blue-300/40">|</span>
            <button
              id="top-admin-dashboard-btn"
              onClick={() => isAdmin ? handleNav('admin') : onOpenAdminLogin()}
              className="hover:text-amber-200 transition flex items-center gap-1.5 text-amber-300 font-semibold bg-amber-500/20 hover:bg-amber-500/30 px-2.5 py-0.5 rounded-full border border-amber-400/40 cursor-pointer"
              title="Lihat Semua Daftar Pelanggan & Status Booking"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Data Pemesan (Admin)</span>
            </button>
            <span className="text-blue-300/40">|</span>
            <a 
              href="https://wa.me/62895422619017?text=Halo%20Admin%20Papandayan.id,%20saya%20ingin%20tanya%20paket%20trip" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-amber-300 transition flex items-center gap-1.5 text-amber-400 font-semibold"
            >
              <Phone className="w-3 h-3" />
              Admin: 0895-4226-19017 / 0895-6359-67327
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Left: Hamburger Menu & Brand Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              id="global-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-navy-900 hover:text-white hover:bg-[#0f2252] border border-navy-200/80 hover:border-[#0f2252] transition shadow-xs group cursor-pointer"
              aria-label="Buka menu navigasi menyeluruh"
              title="Menu Navigasi Menyeluruh"
            >
              <Menu className="w-5 h-5 text-navy-900 group-hover:text-amber-400 transition" />
              <span className="hidden sm:inline text-xs font-bold text-navy-900 group-hover:text-white transition">Menu</span>
            </button>

            <button 
              id="brand-logo-btn"
              onClick={() => handleNav('home')} 
              className="flex items-center text-left group transition transform hover:opacity-95"
            >
              <BrandLogo variant="light" size="md" />
            </button>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              id="nav-home-btn"
              onClick={() => handleNav('home')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition ${
                currentView === 'home' 
                  ? 'text-navy-900 bg-navy-100 font-bold' 
                  : 'text-slate-700 hover:text-navy-900 hover:bg-navy-50'
              }`}
            >
              Home
            </button>

            <button
              id="nav-packages-btn"
              onClick={() => handleNav('packages')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition ${
                currentView === 'packages' || currentView === 'package-detail'
                  ? 'text-navy-900 bg-navy-100 font-bold' 
                  : 'text-slate-700 hover:text-navy-900 hover:bg-navy-50'
              }`}
            >
              Paket Trip
            </button>

            <button
              id="nav-galleries-btn"
              onClick={() => handleNav('galleries')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition ${
                currentView === 'galleries' 
                  ? 'text-navy-900 bg-navy-100 font-bold' 
                  : 'text-slate-700 hover:text-navy-900 hover:bg-navy-50'
              }`}
            >
              Galeri
            </button>

            <button
              id="nav-articles-btn"
              onClick={() => handleNav('articles')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition ${
                currentView === 'articles' || currentView === 'article-detail'
                  ? 'text-navy-900 bg-navy-100 font-bold' 
                  : 'text-slate-700 hover:text-navy-900 hover:bg-navy-50'
              }`}
            >
              Artikel & Tips
            </button>

            <button
              id="nav-help-btn"
              onClick={() => onOpenHelp()}
              className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-navy-900 hover:bg-navy-50 rounded-lg transition"
            >
              Bantuan & FAQ
            </button>

            {isAdmin && onOpenMapsGuide && (
              <button
                id="nav-maps-guide-btn"
                onClick={onOpenMapsGuide}
                className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-navy-900 hover:bg-navy-50 rounded-lg transition flex items-center gap-1.5"
                title="Panduan Lokasi & Peta Grounding Google Maps (Khusus Admin)"
              >
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>Peta & Rute</span>
              </button>
            )}

            {isAdmin && onOpenImageStudio && (
              <button
                id="nav-image-studio-btn"
                onClick={onOpenImageStudio}
                className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-navy-900 hover:bg-navy-50 rounded-lg transition flex items-center gap-1.5"
                title="AI Studio Foto & Souvenir Papandayan (Khusus Admin)"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Studio AI</span>
              </button>
            )}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Google Sign-in / User Profile (Khusus Admin) */}
            {isAdmin && (
              firebaseUser ? (
                <div className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1 rounded-xl transition border border-slate-200">
                  {firebaseUser.photoURL ? (
                    <img
                      src={firebaseUser.photoURL}
                      alt={firebaseUser.displayName || 'User'}
                      className="w-6 h-6 rounded-full object-cover border border-amber-400"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-amber-400 text-navy-950 flex items-center justify-center text-xs font-bold">
                      {(firebaseUser.displayName || firebaseUser.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="hidden md:block text-left text-xs max-w-[100px] truncate">
                    <p className="font-bold text-navy-950 truncate leading-tight">
                      {firebaseUser.displayName?.split(' ')[0] || 'Admin'}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate leading-tight">Google</p>
                  </div>
                  {onSignOutGoogle && (
                    <button
                      onClick={onSignOutGoogle}
                      className="text-slate-400 hover:text-rose-600 p-0.5 rounded-sm transition cursor-pointer"
                      title="Keluar dari akun Google"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ) : onSignInGoogle ? (
                <button
                  id="nav-google-login-btn"
                  onClick={onSignInGoogle}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-navy-950 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition shadow-2xs cursor-pointer"
                  title="Masuk dengan Akun Google (Admin)"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Google Auth</span>
                </button>
              ) : null
            )}

            {/* Cek Booking: Khusus Admin */}
            {isAdmin && (
              <button
                id="nav-lookup-btn"
                onClick={onOpenLookup}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-navy-900 hover:text-navy-950 bg-navy-50 hover:bg-navy-100 border border-navy-200/70 rounded-lg transition cursor-pointer"
                title="Cek & Cari Data Booking (Khusus Admin)"
              >
                <Search className="w-3.5 h-3.5 text-navy-600" />
                <span>Cek Booking</span>
              </button>
            )}

            {isAdmin ? (
              <div className="flex items-center gap-1.5">
                <button
                  id="nav-admin-panel-btn"
                  onClick={() => handleNav('admin')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                    currentView === 'admin'
                      ? 'bg-amber-400 text-navy-950 shadow-xs'
                      : 'bg-navy-900 text-amber-300 hover:bg-navy-800'
                  }`}
                  title="Buka Panel Manajemen Administrator"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Panel Admin</span>
                </button>

                <button
                  id="nav-admin-logout-btn"
                  onClick={onAdminLogout}
                  className="p-1.5 text-xs font-medium rounded-lg text-red-600 hover:bg-red-50 border border-red-200 transition cursor-pointer"
                  title="Kunci & Keluar dari Mode Admin"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id="nav-quick-admin-btn"
                onClick={onOpenAdminLogin}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-navy-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition shadow-xs cursor-pointer border border-amber-500/30"
                title="Akses Data Pelanggan & Status Pemesanan"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-navy-950" />
                <span>Data Pemesan</span>
              </button>
            )}

            <button
              id="nav-cta-booking-btn"
              onClick={() => handleNav('packages')}
              className="bg-[#0f2252] hover:bg-[#162a65] text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Pesan Trip
            </button>
          </div>
        </div>
      </div>

      {/* FULLSCREEN COMPREHENSIVE MENU (MENYELURUH) */}
      {mobileMenuOpen && (
        <div 
          id="fullscreen-nav-menu"
          className="fixed inset-0 z-50 w-screen h-screen min-h-screen bg-[#071333] text-white flex flex-col overflow-y-auto transition-all duration-300"
          role="dialog"
          aria-modal="true"
          aria-label="Menu Navigasi Menyeluruh Papandayan.id"
        >
          {/* Top Bar inside Fullscreen Menu */}
          <div className="sticky top-0 z-20 bg-[#0b1736]/95 backdrop-blur-md border-b border-navy-800 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <BrandLogo variant="dark" size="sm" />
              <span className="hidden md:inline-block w-px h-6 bg-navy-700/60" />
              {/* Live Real-Time Status Badge */}
              <div className="hidden sm:flex items-center gap-2 bg-[#060e22] px-3 py-1 rounded-full border border-blue-400/20 text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-mono font-bold text-amber-300">{clock.timeString} WIB</span>
                <span className="text-blue-300/70 text-[11px]">• Sistem Resmi Papandayan.id</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="full-menu-cta-top-btn"
                onClick={() => handleNav('packages')}
                className="hidden md:inline-flex bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow-md items-center gap-1.5 cursor-pointer"
              >
                <span>Pesan Trip Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                id="full-menu-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/25 rounded-xl text-white hover:text-amber-300 transition text-xs font-bold shadow-xs cursor-pointer"
                title="Tutup Menu (Esc)"
              >
                <span>Tutup</span>
                <X className="w-5 h-5 text-amber-400" />
              </button>
            </div>
          </div>

          {/* Main Full-Width Content (Menyeluruh) */}
          <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            {/* Real-time status for small screens */}
            <div className="sm:hidden mb-6 bg-[#060e22] p-3 rounded-xl border border-navy-700/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-mono font-bold text-amber-300">{clock.timeString} WIB</span>
              </div>
              <span className="text-[11px] text-blue-200">Garut, Jawa Barat</span>
            </div>

            {/* 4-Column Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
              
              {/* Kolom 1: Navigasi Utama */}
              <div className="space-y-4">
                <div className="pb-2 border-b border-navy-700/70 flex items-center gap-2 text-amber-400">
                  <Compass className="w-4 h-4" />
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-amber-400">Navigasi Utama</h3>
                </div>

                <div className="space-y-1.5">
                  <button
                    onClick={() => handleNav('home')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-base sm:text-lg transition flex items-center justify-between group cursor-pointer ${
                      currentView === 'home'
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : 'text-white hover:bg-navy-800/80 hover:text-amber-300'
                    }`}
                  >
                    <span>Home / Beranda</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition text-amber-400" />
                  </button>

                  <button
                    onClick={() => handleNav('packages')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-base sm:text-lg transition flex items-center justify-between group cursor-pointer ${
                      currentView === 'packages'
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : 'text-white hover:bg-navy-800/80 hover:text-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>Semua Paket Trip</span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-semibold border border-amber-400/30">4 Paket</span>
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition text-amber-400" />
                  </button>

                  <button
                    onClick={() => handleNav('galleries')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-base sm:text-lg transition flex items-center justify-between group cursor-pointer ${
                      currentView === 'galleries'
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : 'text-white hover:bg-navy-800/80 hover:text-amber-300'
                    }`}
                  >
                    <span>Galeri & Pengalaman</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition text-amber-400" />
                  </button>

                  <button
                    onClick={() => handleNav('articles')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-base sm:text-lg transition flex items-center justify-between group cursor-pointer ${
                      currentView === 'articles' || currentView === 'article-detail'
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : 'text-white hover:bg-navy-800/80 hover:text-amber-300'
                    }`}
                  >
                    <span>Artikel & Panduan</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition text-amber-400" />
                  </button>

                  <button
                    onClick={() => { setMobileMenuOpen(false); onOpenHelp(); }}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-base sm:text-lg text-white hover:bg-navy-800/80 hover:text-amber-300 transition flex items-center justify-between group cursor-pointer"
                  >
                    <span>Pusat Bantuan & FAQ</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition text-amber-400" />
                  </button>

                  {isAdmin && onOpenMapsGuide && (
                    <button
                      onClick={() => { setMobileMenuOpen(false); onOpenMapsGuide(); }}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-base transition flex items-center justify-between group cursor-pointer text-white hover:bg-navy-800/80 hover:text-rose-300"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-rose-400" />
                        <span>Peta & Rute (Google Maps Grounding) [Admin]</span>
                      </div>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition text-rose-400" />
                    </button>
                  )}

                  {isAdmin && onOpenImageStudio && (
                    <button
                      onClick={() => { setMobileMenuOpen(false); onOpenImageStudio(); }}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-base transition flex items-center justify-between group cursor-pointer text-white hover:bg-navy-800/80 hover:text-amber-300"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Studio Foto & Desain AI [Admin]</span>
                      </div>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition text-amber-400" />
                    </button>
                  )}

                  {/* Google Sign-in in mobile menu (Khusus Admin) */}
                  {isAdmin && (
                    firebaseUser ? (
                      <div className="p-3 rounded-xl bg-navy-900 border border-blue-400/30 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          {firebaseUser.photoURL ? (
                            <img
                              src={firebaseUser.photoURL}
                              alt={firebaseUser.displayName || 'User'}
                              className="w-8 h-8 rounded-full border border-amber-400"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-amber-400 text-navy-950 font-bold flex items-center justify-center text-xs">
                              {(firebaseUser.displayName || 'U')[0].toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-xs text-white">{firebaseUser.displayName || 'Admin Google'}</p>
                            <p className="text-[10px] text-blue-200 truncate">{firebaseUser.email}</p>
                          </div>
                        </div>
                        {onSignOutGoogle && (
                          <button
                            onClick={() => { setMobileMenuOpen(false); onSignOutGoogle(); }}
                            className="px-2.5 py-1 text-xs font-bold text-rose-300 hover:text-white bg-rose-500/20 hover:bg-rose-500/30 rounded-lg transition"
                          >
                            Keluar
                          </button>
                        )}
                      </div>
                    ) : onSignInGoogle ? (
                      <button
                        onClick={() => { setMobileMenuOpen(false); onSignInGoogle(); }}
                        className="w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-base text-blue-100 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/40 transition flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-blue-400" />
                          <span>Google Auth (Admin Database)</span>
                        </div>
                        <span className="text-xs bg-blue-500 text-white font-bold px-2 py-0.5 rounded-md">Login</span>
                      </button>
                    ) : null
                  )}

                  {/* Cek Status Booking: Khusus Admin */}
                  {isAdmin && (
                    <button
                      onClick={() => { setMobileMenuOpen(false); onOpenLookup(); }}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-base sm:text-lg text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 transition flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Search className="w-4 h-4 text-amber-400" />
                        <span>Cek Data Booking [Admin]</span>
                      </div>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition text-amber-400" />
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (isAdmin) {
                        handleNav('admin');
                      } else {
                        onOpenAdminLogin();
                      }
                    }}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-base sm:text-lg text-amber-200 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 transition flex items-center justify-between group cursor-pointer shadow-xs"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>Data Pemesan & Booking (Admin)</span>
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition text-amber-400" />
                  </button>

                  {isAdmin ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => handleNav('admin')}
                        className="w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-base text-amber-300 bg-amber-500/20 border border-amber-400/40 transition flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-amber-400" />
                          <span>Panel Manajemen Admin</span>
                        </div>
                        <span className="text-[10px] bg-amber-400 text-navy-950 font-bold px-2 py-0.5 rounded font-mono">AKTIF</span>
                      </button>

                      <button
                        onClick={() => { setMobileMenuOpen(false); onAdminLogout(); }}
                        className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition flex items-center justify-between cursor-pointer"
                      >
                        <span>Kunci & Logout Admin</span>
                        <LogOut className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Kolom 2: Pilihan Paket Trip */}
              <div className="space-y-4">
                <div className="pb-2 border-b border-navy-700/70 flex items-center gap-2 text-amber-400">
                  <Mountain className="w-4 h-4" />
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-amber-400">Pilihan Paket Trip</h3>
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={() => handleNav('package-detail', 'vip-camp-papandayan')}
                    className="w-full text-left p-3 rounded-xl bg-navy-900/80 hover:bg-navy-800 border border-navy-700 hover:border-amber-400/50 transition group cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-white group-hover:text-amber-300">VIP Camp Papandayan</span>
                      <span className="text-[10px] bg-amber-400 text-navy-950 px-1.5 py-0.5 rounded font-bold uppercase">Favorit</span>
                    </div>
                    <p className="text-xs text-blue-200/70 mt-1">Camping 2D1N Tenda Dome Mewah & Konsumsi Lengkap</p>
                    <p className="text-xs font-bold text-amber-400 mt-1.5">Mulai Rp 375.000 / orang</p>
                  </button>

                  <button
                    onClick={() => handleNav('package-detail', 'sunrise-trip-moment')}
                    className="w-full text-left p-3 rounded-xl bg-navy-900/80 hover:bg-navy-800 border border-navy-700 hover:border-amber-400/50 transition group cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-white group-hover:text-amber-300">Sunrise Trip Moment</span>
                      <span className="text-[10px] bg-blue-400/20 text-blue-300 px-1.5 py-0.5 rounded font-semibold">One Day</span>
                    </div>
                    <p className="text-xs text-blue-200/70 mt-1">Berburu Golden Sunrise Tebing Soni & Kawah</p>
                    <p className="text-xs font-bold text-amber-400 mt-1.5">Mulai Rp 225.000 / orang</p>
                  </button>

                  <button
                    onClick={() => handleNav('package-detail', 'exploring-one-day-papandayan')}
                    className="w-full text-left p-3 rounded-xl bg-navy-900/80 hover:bg-navy-800 border border-navy-700 hover:border-amber-400/50 transition group cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-white group-hover:text-amber-300">Exploring One Day</span>
                      <span className="text-[10px] bg-blue-400/20 text-blue-300 px-1.5 py-0.5 rounded font-semibold">One Day</span>
                    </div>
                    <p className="text-xs text-blue-200/70 mt-1">Jelajah Kawah Aktif, Hutan Mati & Padang Edelweis</p>
                    <p className="text-xs font-bold text-amber-400 mt-1.5">Mulai Rp 175.000 / orang</p>
                  </button>

                  <button
                    onClick={() => handleNav('package-detail', 'private-camp-papandayan')}
                    className="w-full text-left p-3 rounded-xl bg-navy-900/80 hover:bg-navy-800 border border-navy-700 hover:border-amber-400/50 transition group cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-white group-hover:text-amber-300">Private Camp Papandayan</span>
                      <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-semibold">Eksklusif</span>
                    </div>
                    <p className="text-xs text-blue-200/70 mt-1">Jadwal fleksibel khusus keluarga & komunitas Anda</p>
                    <p className="text-xs font-bold text-amber-400 mt-1.5">Mulai Rp 295.000 / orang</p>
                  </button>
                </div>
              </div>

              {/* Kolom 3: Panduan & Informasi */}
              <div className="space-y-4">
                <div className="pb-2 border-b border-navy-700/70 flex items-center gap-2 text-amber-400">
                  <BookOpen className="w-4 h-4" />
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-amber-400">Panduan & Bantuan</h3>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => { setMobileMenuOpen(false); onOpenHelp('booking'); }}
                    className="w-full text-left p-3 rounded-xl bg-navy-900/50 hover:bg-navy-800 border border-navy-700/60 transition flex items-start gap-2.5 text-xs text-blue-100 hover:text-white cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-sm">Alur Cara Booking</span>
                      <span className="text-blue-200/70 text-[11px]">Pilih tanggal, isi data, dan dapatkan kode tiket pesanan instan.</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setMobileMenuOpen(false); onOpenHelp('payment'); }}
                    className="w-full text-left p-3 rounded-xl bg-navy-900/50 hover:bg-navy-800 border border-navy-700/60 transition flex items-start gap-2.5 text-xs text-blue-100 hover:text-white cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-sm">Metode Pembayaran & DP</span>
                      <span className="text-blue-200/70 text-[11px]">Transfer BCA / Mandiri resmi, DP 30% atau pelunasan aman.</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setMobileMenuOpen(false); onOpenHelp('refund'); }}
                    className="w-full text-left p-3 rounded-xl bg-navy-900/50 hover:bg-navy-800 border border-navy-700/60 transition flex items-start gap-2.5 text-xs text-blue-100 hover:text-white cursor-pointer"
                  >
                    <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-sm">Kebijakan Refund & Reschedule</span>
                      <span className="text-blue-200/70 text-[11px]">Ketentuan pembatalan transparan & opsi ubah jadwal fleksibel.</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setMobileMenuOpen(false); onOpenHelp('faq'); }}
                    className="w-full text-left p-3 rounded-xl bg-navy-900/50 hover:bg-navy-800 border border-navy-700/60 transition flex items-start gap-2.5 text-xs text-blue-100 hover:text-white cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-sm">FAQ Pertanyaan Umum</span>
                      <span className="text-blue-200/70 text-[11px]">Fisik pendaki, perlengkapan sewa, dan cuaca terkini di gunung.</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Kolom 4: Kontak Admin & Legalitas */}
              <div className="space-y-4">
                <div className="pb-2 border-b border-navy-700/70 flex items-center gap-2 text-amber-400">
                  <Phone className="w-4 h-4" />
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-amber-400">Kontak Admin Resmi</h3>
                </div>

                <div className="p-4 rounded-2xl bg-navy-900/90 border border-navy-700 space-y-3">
                  <div>
                    <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider block">Chat WhatsApp Admin</span>
                    <div className="mt-2.5 space-y-2">
                      <a
                        href="https://wa.me/62895422619017?text=Halo%20Admin%20Papandayan.id,%20saya%20ingin%20tanya%20paket%20trip"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 hover:text-emerald-100 transition group"
                      >
                        <div className="flex items-center gap-2.5">
                          <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div>
                            <span className="text-xs font-bold block text-white">0895-4226-19017</span>
                            <span className="text-[10px] text-emerald-300">Admin 1 • Fast Response</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition" />
                      </a>

                      <a
                        href="https://wa.me/62895635967327?text=Halo%20Admin%20Papandayan.id,%20saya%20ingin%20tanya%20paket%20trip"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 hover:text-emerald-100 transition group"
                      >
                        <div className="flex items-center gap-2.5">
                          <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div>
                            <span className="text-xs font-bold block text-white">0895-6359-67327</span>
                            <span className="text-[10px] text-emerald-300">Admin 2 • Reservasi & Konsultasi</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition" />
                      </a>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-navy-800 text-[11px] text-blue-200/80 space-y-1">
                    <p className="font-semibold text-white">PT. Pasak Outdoor Garut</p>
                    <p>NIB: 1130320094709</p>
                    <p className="text-[10px] leading-relaxed text-slate-400">Perum Rancabango Intan Residence, Blok H 15, Tarogong Kaler, Garut</p>
                    
                    {!isAdmin && (
                      <div className="pt-2">
                        <button
                          onClick={() => { setMobileMenuOpen(false); onOpenAdminLogin(); }}
                          className="inline-flex items-center gap-1.5 text-xs text-blue-300/60 hover:text-amber-300 transition cursor-pointer"
                        >
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Portal Khusus Staf & Admin</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Bar: Action Hub */}
          <div className="sticky bottom-0 z-20 bg-[#0b1736]/95 backdrop-blur-md border-t border-navy-800 px-4 sm:px-6 lg:px-8 py-3.5 shadow-2xl">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-blue-200">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Operator Terpercaya Wisata Gunung Papandayan • Berizin Resmi</span>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenLookup(); }}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-white font-bold text-xs border border-navy-600 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cek Status Booking</span>
                </button>

                <button
                  onClick={() => handleNav('packages')}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-navy-950 font-extrabold text-xs sm:text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>PILIH & PESAN TRIP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

