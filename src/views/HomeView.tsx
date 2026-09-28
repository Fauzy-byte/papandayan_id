import React, { useState, useMemo } from 'react';
import { 
  TripPackage, 
  Article, 
  Testimonial, 
  GalleryItem, 
  Partner 
} from '../types';
import { 
  ArrowRight, 
  Compass, 
  ShieldCheck, 
  Camera, 
  Users, 
  Star, 
  Clock, 
  MapPin, 
  Calendar,
  CheckCircle2,
  Search,
  X,
  RotateCcw,
  Sparkles,
  Wand2,
  Navigation
} from 'lucide-react';

interface HomeViewProps {
  packages: TripPackage[];
  articles: Article[];
  testimonials: Testimonial[];
  galleries: GalleryItem[];
  partners: Partner[];
  onNavigate: (view: string, param?: string) => void;
  isAdmin?: boolean;
  onOpenMapsGuide?: () => void;
  onOpenImageStudio?: () => void;
}

const POPULAR_DESTINATIONS = [
  'Tebing Soni',
  'Hutan Mati',
  'Kawah Papandayan',
  'Pondok Saladah',
  'Ghober Hut',
  'Sunrise',
  'Camping 2D1N'
];

export const HomeView: React.FC<HomeViewProps> = ({
  packages,
  articles,
  testimonials,
  galleries,
  partners,
  onNavigate,
  isAdmin,
  onOpenMapsGuide,
  onOpenImageStudio
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const experiences = galleries.slice(0, 4);
  const latestArticles = articles.slice(0, 3);
  const clients = partners.filter(p => p.type === 'client');
  const partnerList = partners.filter(p => p.type === 'partner');

  // Filter trip packages by keyword, package name, or destination
  const filteredPackages = useMemo(() => {
    if (!searchQuery.trim()) {
      return packages;
    }
    const q = searchQuery.toLowerCase().trim();
    return packages.filter((pkg) => {
      const matchName = pkg.name.toLowerCase().includes(q);
      const matchDesc = pkg.short_description.toLowerCase().includes(q);
      const matchDest = pkg.destinations.some(d => d.toLowerCase().includes(q));
      const matchCategory = pkg.category.toLowerCase().includes(q);
      const matchDuration = pkg.duration_label.toLowerCase().includes(q);
      const matchFacilities = pkg.facilities.some(f => f.toLowerCase().includes(q));
      return matchName || matchDesc || matchDest || matchCategory || matchDuration || matchFacilities;
    });
  }, [packages, searchQuery]);

  const isSearching = searchQuery.trim().length > 0;
  const displayedPackages = isSearching ? filteredPackages : packages.slice(0, 3);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[550px] lg:h-[72vh] flex items-center justify-center text-center text-white overflow-hidden">
        {/* Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=85" 
          alt="Gunung Papandayan" 
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        />
        {/* Deep Navy overlay gradient (Biru Dongker) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1638] via-[#0f2252]/75 to-navy-950/80" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0f2252]/90 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-md shadow-lg">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            Official Trip Organizer • PT Pasak Outdoor Garut
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white drop-shadow-sm">
            Seek Adventure that <br className="hidden sm:inline" />
            <span className="text-amber-400">Open Your Mind</span>
          </h1>

          <p className="mt-5 text-base sm:text-xl text-blue-100 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow">
            Jasa trip resmi part of PT Pasak Outdoor Garut untuk VIP Camp, Sunrise Trip, Private Camp, dan One Day Exploring di Garut dengan fasilitas terlengkap.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="hero-pesan-sekarang-btn"
              onClick={() => onNavigate('packages')}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-[#0f2252] font-black px-8 py-3.5 rounded-xl shadow-lg shadow-navy-950/50 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm sm:text-base tracking-wide"
            >
              BOOK NOW <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="hero-lihat-paket-btn"
              onClick={() => onNavigate('galleries')}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl border border-white/20 backdrop-blur-md transition text-sm sm:text-base"
            >
              Jelajahi Galeri & Foto
            </button>
          </div>

          {/* Quick highlight points */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-t border-white/15 pt-6 max-w-3xl mx-auto">
            <div>
              <p className="text-2xl font-bold text-white">2.665</p>
              <p className="text-xs text-blue-200">Mdpl Puncak Papandayan</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-400">100%</p>
              <p className="text-xs text-blue-200">Guide Lokal Berlisensi</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">4.9/5</p>
              <p className="text-xs text-blue-200">Rating Ribuan Peserta</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-400">Zero</p>
              <p className="text-xs text-blue-200">Waste Mountain Movement</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH BAR & DESTINATION FILTER (Floating Bar) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 relative z-20">
        <div 
          id="home-search-bar" 
          className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-navy-100 p-4 sm:p-5 backdrop-blur-sm"
        >
          {/* Input & Action */}
          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-amber-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="home-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari paket trip atau destinasi (contoh: Tebing Soni, Hutan Mati, Kawah, Camping, Sunrise...)"
                className="w-full pl-12 pr-10 py-3.5 rounded-xl border border-navy-200 focus:border-navy-900 focus:ring-2 focus:ring-navy-900/20 text-sm font-medium text-navy-950 placeholder-slate-400 outline-none transition bg-slate-50/60 focus:bg-white"
              />
              {searchQuery && (
                <button
                  id="home-search-clear-btn"
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-navy-950 hover:bg-slate-200/70 rounded-lg transition"
                  title="Hapus pencarian"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {searchQuery ? (
              <button
                id="home-search-reset-btn"
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shrink-0 border border-slate-200"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                Reset
              </button>
            ) : null}
          </div>

          {/* Quick Destination & Keyword Filter Chips */}
          <div className="mt-3.5 pt-3.5 border-t border-slate-100 flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-1">
              <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
              Destinasi Populer:
            </span>
            {POPULAR_DESTINATIONS.map((dest) => {
              const isSelected = searchQuery.toLowerCase() === dest.toLowerCase();
              return (
                <button
                  key={dest}
                  id={`home-dest-chip-${dest.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      setSearchQuery('');
                    } else {
                      setSearchQuery(dest);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                    isSelected
                      ? 'bg-[#0f2252] text-amber-300 shadow-xs border border-navy-900'
                      : 'bg-slate-100 text-slate-700 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300 border border-slate-200/80'
                  }`}
                >
                  <span>{dest}</span>
                  {isSelected && <X className="w-3 h-3 ml-0.5 text-amber-300" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* FITUR PINTAR: MAPS GROUNDING & AI IMAGE STUDIO (HANYA DITAMPILKAN UNTUK ADMIN) */}
      {isAdmin && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full flex items-center gap-1.5 border border-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Fitur Eksklusif Admin & AI Tools (Preview Internal)</span>
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Hanya terlihat selama mode administrator aktif</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Card 1: Live Maps Grounding */}
            <div className="bg-gradient-to-br from-[#0a1638] to-[#122860] rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden border border-blue-900/40 flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-bold uppercase tracking-wider">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Google Maps Grounding [Admin]</span>
                  </span>
                  <span className="text-[11px] font-mono text-blue-300/80 bg-white/5 px-2.5 py-0.5 rounded-full">
                    gemini-3.5-flash
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  Peta & Panduan Jalur Papandayan Live
                </h3>
                <p className="text-xs sm:text-sm text-blue-100/90 mt-2 leading-relaxed">
                  Ketahui rute akurat, titik kumpul basecamp, jarak menuju Tebing Soni, Pondok Saladah, dan Hutan Mati berbasis Google Maps aktual.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-blue-200">
                  📍 Garut • Cisurupan • 2.665 MDPL
                </span>
                {onOpenMapsGuide && (
                  <button
                    onClick={onOpenMapsGuide}
                    className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Buka Peta & Navigasi</span>
                  </button>
                )}
              </div>
            </div>

            {/* Card 2: AI Image Studio */}
            <div className="bg-gradient-to-br from-[#0c183b] to-[#1c2e68] rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden border border-blue-900/40 flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Image Studio [Admin]</span>
                  </span>
                  <span className="text-[11px] font-mono text-blue-300/80 bg-white/5 px-2.5 py-0.5 rounded-full">
                    gemini-3.1-flash-image
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  Studio Kreasi Foto & Desain Petualang
                </h3>
                <p className="text-xs sm:text-sm text-blue-100/90 mt-2 leading-relaxed">
                  Generate foto lanskap sinematik, desain emblem pendakian, wallpaper gunung kustom, atau tambahkan efek pencahayaan sunrise pada foto trip Anda.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-blue-200">
                  ✨ Generate & Edit Foto Beresolusi Tinggi
                </span>
                {onOpenImageStudio && (
                  <button
                    onClick={onOpenImageStudio}
                    className="bg-amber-400 hover:bg-amber-300 text-navy-950 font-black px-5 py-2.5 rounded-xl text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Wand2 className="w-4 h-4" />
                    <span>Mulai Desain Foto</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </section>
      )}

      {/* 2. PRODUK DAN LAYANAN KAMI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-7 h-7 rounded-lg bg-[#0f2252] text-amber-400 font-black flex items-center justify-center text-sm shadow">
                2
              </span>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                {isSearching ? 'Hasil Filter & Pencarian' : 'PRODUK DAN LAYANAN KAMI'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 mt-1">
              {isSearching ? `Paket Trip: "${searchQuery}"` : 'Kami menawarkan berbagai pilihan Paket Trip :'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {isSearching 
                ? `Menampilkan ${displayedPackages.length} paket trip yang sesuai dengan kriteria pencarian Anda.`
                : 'Pilihan lengkap mulai dari Explore One Day, Sunrise Trip Moment, Private Camp, hingga VIP CAMP.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isSearching && (
              <button
                id="clear-search-link-btn"
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs font-bold text-slate-500 hover:text-navy-950 underline transition"
              >
                Hapus Filter
              </button>
            )}
            <button
              id="view-all-packages-btn"
              onClick={() => onNavigate('packages')}
              className="text-navy-900 hover:text-navy-700 font-bold text-sm flex items-center gap-1.5 self-start sm:self-auto"
            >
              Lihat Semua Paket ({packages.length}) <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {displayedPackages.length === 0 ? (
          /* Empty Search State */
          <div className="bg-white rounded-3xl border border-dashed border-navy-200 p-10 text-center max-w-lg mx-auto shadow-xs space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
              <Search className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy-950">Paket Trip Tidak Ditemukan</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                Tidak ada paket trip yang cocok dengan kata kunci atau destinasi &ldquo;<strong className="text-navy-900">{searchQuery}</strong>&rdquo;. Silakan coba nama destinasi seperti Tebing Soni, Hutan Mati, Kawah, atau Pondok Saladah.
              </p>
            </div>
            <div className="pt-2">
              <button
                id="empty-state-reset-btn"
                type="button"
                onClick={() => setSearchQuery('')}
                className="bg-[#0f2252] hover:bg-[#162a65] text-amber-300 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition shadow-md"
              >
                Reset Filter & Lihat Semua Paket
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayedPackages.map((pkg) => {
              const cheapestTier = pkg.priceTiers[0];
              return (
                <div
                  key={pkg.id}
                  id={`featured-card-${pkg.slug}`}
                  onClick={() => onNavigate('package-detail', pkg.slug)}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-navy-100 flex flex-col cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={
                        pkg.slug === 'exploring-one-day-papandayan' ? '/oneday.jpg' :
                        pkg.slug === 'sunrise-trip-moment' ? '/sunrise.jpg' :
                        pkg.slug === 'camping-ghober-hut-2d1n' ? '/privatecamp.JPG' :
                        pkg.slug === 'vip-glamping-pondok-saladah' ? '/vipcamp.jpg' :
                        pkg.hero_image
                      }
                      alt={pkg.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (pkg.slug === 'exploring-one-day-papandayan') {
                          if (!target.src.endsWith('/oneday.JPG')) {
                            target.src = '/oneday.JPG';
                          } else {
                            target.src = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80';
                          }
                        } else if (pkg.slug === 'sunrise-trip-moment') {
                          if (!target.src.endsWith('/sunrise.JPG')) {
                            target.src = '/sunrise.JPG';
                          } else {
                            target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';
                          }
                        } else if (pkg.slug === 'camping-ghober-hut-2d1n') {
                          if (!target.src.endsWith('/privatecamp.jpg')) {
                            target.src = '/privatecamp.jpg';
                          } else {
                            target.src = 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80';
                          }
                        } else if (pkg.slug === 'vip-glamping-pondok-saladah') {
                          if (!target.src.includes('vipcam.jpg') && !target.src.includes('vipcamp.JPG') && !target.src.includes('vipcam.JPG')) {
                            target.src = '/vipcam.jpg';
                          } else if (!target.src.includes('vipcamp.JPG')) {
                            target.src = '/vipcamp.JPG';
                          } else if (!target.src.includes('vipcam.JPG')) {
                            target.src = '/vipcam.JPG';
                          } else {
                            target.src = 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1200&q=80';
                          }
                        }
                      }}
                    />
                    <div className="absolute top-3 left-3 bg-[#0f2252] text-amber-400 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow border border-navy-700">
                      {pkg.category === 'camping' ? 'Camping 2D1N' : 'One Day Trip'}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-navy-950 text-lg group-hover:text-navy-700 transition line-clamp-1">
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-navy-700 font-semibold mt-1 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        {pkg.duration_label}
                      </p>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                        {pkg.short_description}
                      </p>

                      {/* Destination Tags */}
                      {pkg.destinations && pkg.destinations.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1">
                          {pkg.destinations.slice(0, 3).map((dest, i) => {
                            const isMatch = searchQuery && dest.toLowerCase().includes(searchQuery.toLowerCase());
                            return (
                              <span
                                key={i}
                                className={`text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 font-medium transition ${
                                  isMatch
                                    ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300'
                                    : 'bg-navy-50/70 text-slate-600'
                                }`}
                              >
                                <MapPin className={`w-2.5 h-2.5 shrink-0 ${isMatch ? 'text-amber-600' : 'text-amber-500'}`} />
                                <span className="truncate max-w-[130px]">{dest.split('(')[0].trim()}</span>
                              </span>
                            );
                          })}
                          {pkg.destinations.length > 3 && (
                            <span className="text-[10px] text-slate-400 font-medium self-center pl-0.5">
                              +{pkg.destinations.length - 3} lainnya
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mt-5 pt-4 border-t border-navy-50 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 block font-medium">Mulai dari</span>
                        <p className="text-base font-extrabold text-navy-900">
                          Rp {cheapestTier?.price_per_person.toLocaleString('id-ID')}
                          <span className="text-xs font-normal text-slate-500"> / orang</span>
                        </p>
                      </div>
                      <span className="text-xs font-bold text-amber-600 group-hover:text-amber-700 group-hover:translate-x-1 transition flex items-center gap-0.5">
                        Detail <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. TENTANG KAMI (Termasuk PROFIL SINGKAT PAPANDAYAN INDONESIA, VISI & MISI) */}
      <section className="bg-[#0f2252] text-white py-16 border-y-4 border-amber-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section: 1 TENTANG KAMI */}
          <div className="flex items-center gap-3 mb-10">
            <span className="w-10 h-10 rounded-xl bg-amber-400 text-navy-950 font-black flex items-center justify-center text-lg shadow-lg">
              1
            </span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-white">
                TENTANG KAMI
              </h2>
              <p className="text-xs sm:text-sm text-blue-200 mt-0.5">
                Profil Resmi, Visi, Misi & Komitmen Wisata Petualangan Gunung Papandayan
              </p>
            </div>
          </div>

          {/* Sub-Card 1: PROFIL SINGKAT PAPANDAYAN INDONESIA (Sesuai flyer) */}
          <div className="bg-[#0a1638] rounded-3xl p-6 sm:p-8 border border-blue-900/80 shadow-2xl mb-10 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Teks Profil */}
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/30">
                  <ShieldCheck className="w-4 h-4" />
                  Official Profile
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  PROFIL SINGKAT <br />
                  <span className="text-amber-400">PAPANDAYAN INDONESIA</span>
                </h3>

                <p className="text-sm sm:text-base text-blue-100 leading-relaxed font-normal">
                  Papandayan Indonesia adalah penyedia layanan outdoor activity dan event organizer terpercaya yang berbasis di Garut, Indonesia. Kami mengombinasikan keindahan alam petualangan dengan manajemen acara yang profesional untuk menghadirkan pengalaman yang berkesan, aman, dan mendalam bagi setiap peserta.
                </p>

                <p className="text-sm sm:text-base text-blue-100 leading-relaxed font-normal">
                  Dipandu oleh tim ahli yang memahami dinamika kelompok dan keselamatan lapangan, kami siap melayani berbagai kebutuhan petualangan dan acara formal maupun kasual Anda.
                </p>

                {/* Bullet Dots aksen dari flyer */}
                <div className="pt-2 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                </div>
              </div>

              {/* 2 Foto Representasi dari flyer: Sunrise & Glamping Camp */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-xl border border-white/10 aspect-video relative group">
                  <img 
                    src="/sunrise.jpg" 
                    alt="Sunrise Papandayan" 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (!target.src.endsWith('/sunrise.JPG')) {
                        target.src = '/sunrise.JPG';
                      } else {
                        target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                    <span className="text-xs font-bold text-amber-300">Sunrise Panorama Tebing Soni</span>
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden shadow-xl border border-white/10 aspect-video relative group">
                  <img 
                    src="/vipcamp.jpg" 
                    alt="VIP Camping & Glamping Papandayan" 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (!target.src.includes('vipcam.jpg') && !target.src.includes('vipcamp.JPG') && !target.src.includes('vipcam.JPG')) {
                        target.src = '/vipcam.jpg';
                      } else if (!target.src.includes('vipcamp.JPG')) {
                        target.src = '/vipcamp.JPG';
                      } else if (!target.src.includes('vipcam.JPG')) {
                        target.src = '/vipcam.JPG';
                      } else {
                        target.src = 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80';
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                    <span className="text-xs font-bold text-amber-300">VIP Glamping Camp Papandayan</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Sub-Card 2: PRIVATE TRIP, SPESIALISASI, VISI & MISI */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Kolom Kiri: Profil & Banner */}
            <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
              <div className="rounded-2xl overflow-hidden shadow-xl aspect-[4/3] mb-5 border border-white/10">
                <img 
                  src="/privatecamp.JPG" 
                  alt="Private Trip Gunung Papandayan" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (!target.src.endsWith('/privatecamp.jpg')) {
                      target.src = '/privatecamp.jpg';
                    } else {
                      target.src = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80';
                    }
                  }}
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-amber-400 tracking-wide uppercase">
                PRIVATE TRIP GUNUNG PAPANDAYAN
              </h3>
              <p className="mt-3 text-sm text-blue-100 font-medium leading-relaxed">
                Explorasi Gunung Papandayan dengan ekslusif, aman nyaman dan berkesan.
              </p>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-blue-200">
                <span className="font-mono text-amber-300 font-bold">@papandayan_id</span>
                <span className="text-[11px] bg-amber-400/20 text-amber-300 px-2.5 py-1 rounded-full border border-amber-400/30">Official Operator</span>
              </div>
            </div>

            {/* Kolom Kanan: Detail Layanan & Visi Misi */}
            <div className="lg:col-span-8 space-y-6">
              <p className="text-base text-blue-100 leading-relaxed">
                papandayan_id adalah penyedia layanan tour operator dan pemanduan wisata petualangan profesional resmi yang berbasis di Garut, Jawa Barat. Kami mengkhususkan diri dalam pengorganisasian Private Trip, Corporate Outing, dan Camping di Gunung Papandayan
              </p>

              {/* VISI */}
              <div className="bg-[#0a1638]/70 border border-blue-900/60 rounded-2xl p-5">
                <h4 className="text-sm font-black text-amber-400 uppercase tracking-wider mb-1.5">
                  VISI:
                </h4>
                <p className="text-sm sm:text-base text-white font-medium italic leading-relaxed">
                  &ldquo;Menjadi mitra perjalanan outdoor pilihan utama yang menghadirkan momen petualangan Gunung Papandayan secara praktis, menyenangkan, dan tak terlupakan.&rdquo;
                </p>
              </div>

              {/* MISI */}
              <div>
                <h4 className="text-sm font-black text-amber-400 uppercase tracking-wider mb-3">
                  MISI:
                </h4>
                <ul className="space-y-3.5 text-sm text-blue-100/95">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0"></span>
                    <div>
                      <strong className="text-white font-bold">Layanan Profesional & Standar Keselamatan:</strong> Menyelenggarakan kegiatan pendakian dan camping dengan standar operasional prosedur (SOP) keselamatan serta rasio pemandu yang ideal.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0"></span>
                    <div>
                      <strong className="text-white font-bold">Kenyamanan & Privasi Pelanggan:</strong> Menyediakan fasilitas dan perlengkapan outdoor berkualitas tinggi untuk memberikan kenyamanan maksimal bagi pendaki pemula, keluarga, maupun korporat
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0"></span>
                    <div>
                      <strong className="text-white font-bold">Pengembangan Pemandu Lokal:</strong> Menguatkan peran pemandu lokal bersertifikat dan berwawasan lingkungan untuk memberikan pelayanan hangat dan edukatif.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0"></span>
                    <div>
                      <strong className="text-white font-bold">Ekowisata Berkelanjutan:</strong> Menerapkan prinsip Leave No Trace (tanpa jejak) guna menjaga kelestarian ekosistem dan kebersihan Gunung Papandayan.
                    </div>
                  </li>
                </ul>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 4. GATHERING & PENGALAMAN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Aktivitas Menarik</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 mt-1">
            Gathering & Liburan di Papandayan Bisa Ngapain Aja?
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Nikmati beragam aktivitas seru yang cocok untuk solo traveler, pasangan, keluarga, hingga gathering korporat.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {experiences.map((exp) => (
            <div 
              key={exp.id}
              className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-navy-950 group shadow-sm hover:shadow-lg transition"
            >
              <img 
                src={exp.image_url} 
                alt={exp.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1638]/90 via-black/30 to-transparent flex flex-col justify-end p-4">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">{exp.category}</span>
                <h3 className="text-white font-bold text-sm sm:text-base mt-0.5">{exp.title}</h3>
                <p className="text-xs text-blue-200 mt-1 line-clamp-2">{exp.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. MENGAPA MEMILIH KAMI? (Sesuai Poin Dokumen Resmi papandayan_id) */}
      <section className="bg-navy-50/60 py-16 border-y border-navy-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center gap-3 mb-8">
            <span className="w-9 h-9 rounded-xl bg-[#0f2252] text-amber-400 font-black flex items-center justify-center text-lg shadow">
              3
            </span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-navy-950">
                MENGAPA MEMILIH KAMI?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Standar layanan dan komitmen resmi dari papandayan_id</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-navy-100">
            <ul className="space-y-4">
              <li className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 hover:bg-amber-50/50 transition border border-slate-100">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                <span className="text-base sm:text-lg font-bold text-navy-950">
                  Legalitas & Spesialis Lokal Terpercaya
                </span>
              </li>
              <li className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 hover:bg-amber-50/50 transition border border-slate-100">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                <span className="text-base sm:text-lg font-bold text-navy-950">
                  Standar Keselamatan & Rasio Pemandu Ideal
                </span>
              </li>
              <li className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 hover:bg-amber-50/50 transition border border-slate-100">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                <span className="text-base sm:text-lg font-bold text-navy-950">
                  Layanan serba praktis (All-in)
                </span>
              </li>
              <li className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 hover:bg-amber-50/50 transition border border-slate-100">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                <span className="text-base sm:text-lg font-bold text-navy-950">
                  Privasi dan fleksibilitas tinggi
                </span>
              </li>
              <li className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 hover:bg-amber-50/50 transition border border-slate-100">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                <span className="text-base sm:text-lg font-bold text-navy-950">
                  Ekowisata & Pendakian berkelanjutan
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. GALERI PERJALANAN PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Koleksi Visual</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 mt-1">Galeri Perjalanan</h2>
            <p className="text-sm text-slate-500 mt-1">Intip keindahan magis yang menanti Anda di Gunung Papandayan.</p>
          </div>
          <button
            onClick={() => onNavigate('galleries')}
            className="text-navy-900 font-bold text-sm hover:underline flex items-center gap-1"
          >
            Lihat Semua Galeri →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {galleries.slice(0, 6).map((item) => (
            <div 
              key={item.id}
              onClick={() => onNavigate('galleries')}
              className="group aspect-square rounded-xl overflow-hidden bg-slate-200 cursor-pointer relative shadow-sm"
            >
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.endsWith('.jpg')) {
                    target.src = target.src.replace(/\.jpg$/, '.JPG');
                  } else if (target.src.endsWith('.JPG')) {
                    target.src = target.src.replace(/\.JPG$/, '.jpg');
                  } else if (target.src.endsWith('.png')) {
                    target.src = target.src.replace(/\.png$/, '.PNG');
                  } else if (target.src.endsWith('.PNG')) {
                    target.src = target.src.replace(/\.PNG$/, '.png');
                  }
                }}
              />
              <div className="absolute inset-0 bg-navy-950/50 opacity-0 group-hover:opacity-100 transition flex items-end p-2">
                <span className="text-[11px] font-medium text-white line-clamp-1">{item.title}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Ulasan Pelanggan</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 mt-1">Apa Kata Mereka?</h2>
          <p className="text-sm text-slate-500 mt-2">Testimoni tulus dari para pendaki dan wisatawan yang telah menjelajahi Papandayan bersama kami.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white p-6 rounded-2xl shadow-sm border border-navy-100 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-amber-400 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} 
                    />
                  ))}
                </div>
                <p className="text-sm text-slate-700 italic leading-relaxed">"{t.content}"</p>
              </div>
              <div className="mt-4 pt-3 border-t border-navy-50 flex justify-between items-center text-xs">
                <span className="font-bold text-navy-950">{t.customer_name}</span>
                {t.trip_name && (
                  <span className="text-navy-900 font-semibold bg-navy-50 border border-navy-200/60 px-2 py-0.5 rounded-full">
                    {t.trip_name}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. KLIEN & PARTNER */}
      <section className="bg-navy-50/50 py-12 border-y border-navy-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mitra & Klien Korporat</span>
            <h3 className="text-lg font-bold text-navy-950 mt-1">Dipercaya Oleh Berbagai Lembaga & Komunitas</h3>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {partners.map((p) => (
              <div 
                key={p.id}
                className="px-4 py-2 bg-white rounded-xl shadow-xs border border-navy-100 text-xs sm:text-sm font-bold text-navy-900 hover:text-amber-600 hover:border-amber-300 transition"
              >
                {p.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. ARTIKEL TERBARU */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Blog & Wawasan</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 mt-1">Artikel & Tips Terbaru</h2>
            <p className="text-sm text-slate-500 mt-1">Panduan lengkap dan cerita perjalanan seputar Gunung Papandayan.</p>
          </div>
          <button
            onClick={() => onNavigate('articles')}
            className="text-navy-900 font-bold text-sm hover:underline flex items-center gap-1"
          >
            Lihat Semua Artikel →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => onNavigate('article-detail', article.slug)}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden border border-navy-100 flex flex-col cursor-pointer"
            >
              <div className="h-44 bg-slate-100 overflow-hidden">
                <img
                  src={article.cover_image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-navy-900 uppercase tracking-wider bg-navy-50 border border-navy-200/50 px-2 py-0.5 rounded">
                    {article.category}
                  </span>
                  <h3 className="font-bold text-navy-950 text-base mt-2 group-hover:text-navy-700 transition line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {article.content}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-navy-50 flex justify-between items-center text-[11px] text-slate-400">
                  <span>{article.published_at}</span>
                  <span>{article.read_time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. FINAL BOOKING CTA (Biru Dongker Banner with Gold Button) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#0a1638] via-[#0f2252] to-[#173a72] border-4 border-amber-500 text-white p-8 sm:p-14 text-center overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Siap untuk Petualangan Berikutnya?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-blue-100 leading-relaxed">
              Pesan trip kamu sekarang juga. Slot keberangkatan terbatas setiap minggunya untuk menjaga kelestarian alam dan kenyamanan pendakian.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => onNavigate('packages')}
                className="bg-amber-500 text-[#0f2252] hover:bg-amber-400 font-black px-8 py-3.5 rounded-xl shadow-lg transition transform hover:-translate-y-0.5 text-sm sm:text-base tracking-wide"
              >
                BOOK NOW / PESAN SEKARANG
              </button>
              <a
                href="https://wa.me/62895422619017?text=Halo%20Admin%20Papandayan.id,%20saya%20ingin%20konsultasi%20trip%20rombongan"
                target="_blank"
                rel="noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl border border-white/30 backdrop-blur-xs transition text-sm sm:text-base flex items-center justify-center gap-2"
              >
                <span>Konsultasi WhatsApp Admin</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
