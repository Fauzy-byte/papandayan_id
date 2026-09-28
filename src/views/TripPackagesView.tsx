import React, { useState } from 'react';
import { TripPackage } from '../types';
import { Clock, Users, ArrowRight, Search, MapPin, Sparkles, Filter } from 'lucide-react';

interface TripPackagesViewProps {
  packages: TripPackage[];
  onSelectPackage: (slug: string) => void;
  onBookDirect: (slug: string) => void;
}

export const TripPackagesView: React.FC<TripPackagesViewProps> = ({
  packages,
  onSelectPackage,
  onBookDirect
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = packages.filter((pkg) => {
    const matchesCategory = 
      selectedCategory === 'all' 
        ? true 
        : selectedCategory === 'camping' 
        ? pkg.category === 'camping'
        : selectedCategory === 'scheduled'
        ? pkg.type === 'scheduled'
        : selectedCategory === 'private'
        ? pkg.type === 'private'
        : true;

    const matchesSearch = 
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.destinations.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="mb-8">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">PRODUK DAN LAYANAN KAMI</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 mt-1">Kami menawarkan berbagai pilihan Paket Trip :</h1>
        <p className="text-sm text-slate-600 mt-2 max-w-2xl">
          Penyedia layanan tour operator dan pemanduan wisata petualangan profesional resmi Gunung Papandayan. Tersedia Explore One Day, Sunrise Trip Moment, Private Camp, dan VIP CAMP.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-navy-100 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              selectedCategory === 'all'
                ? 'bg-[#0f2252] text-amber-300 shadow-md border border-navy-800'
                : 'bg-navy-50 text-navy-900 hover:bg-navy-100'
            }`}
          >
            Semua Paket ({packages.length})
          </button>
          <button
            onClick={() => setSelectedCategory('scheduled')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              selectedCategory === 'scheduled'
                ? 'bg-[#0f2252] text-amber-300 shadow-md border border-navy-800'
                : 'bg-navy-50 text-navy-900 hover:bg-navy-100'
            }`}
          >
            Open Trip (Jadwal Rutin)
          </button>
          <button
            onClick={() => setSelectedCategory('camping')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              selectedCategory === 'camping'
                ? 'bg-[#0f2252] text-amber-300 shadow-md border border-navy-800'
                : 'bg-navy-50 text-navy-900 hover:bg-navy-100'
            }`}
          >
            Camping & Glamping
          </button>
          <button
            onClick={() => setSelectedCategory('private')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              selectedCategory === 'private'
                ? 'bg-[#0f2252] text-amber-300 shadow-md border border-navy-800'
                : 'bg-navy-50 text-navy-900 hover:bg-navy-100'
            }`}
          >
            Private Trip Eksklusif
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari paket atau destinasi..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-navy-200 text-xs focus:ring-2 focus:ring-navy-900 focus:border-navy-900"
          />
          <Search className="w-4 h-4 text-navy-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Grid of Packages */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-navy-100 p-8">
          <p className="text-slate-500 text-sm">Tidak ada paket yang sesuai dengan filter atau kata kunci "{searchQuery}".</p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="mt-4 px-4 py-2 bg-[#0f2252] text-white font-bold text-xs rounded-xl"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((pkg) => {
            const lowestTier = pkg.priceTiers[0];
            const hasSchedules = pkg.type === 'scheduled' && pkg.schedules.some(s => s.kuota_tersedia > 0);

            return (
              <div
                key={pkg.id}
                id={`pkg-card-${pkg.slug}`}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-navy-100 flex flex-col justify-between"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative h-52 bg-slate-900 overflow-hidden cursor-pointer" onClick={() => onSelectPackage(pkg.slug)}>
                    <img
                      src={
                        pkg.slug === 'exploring-one-day-papandayan' ? '/oneday.jpg' :
                        pkg.slug === 'sunrise-trip-moment' ? '/sunrise.jpg' :
                        pkg.slug === 'camping-ghober-hut-2d1n' ? '/privatecamp.JPG' :
                        pkg.slug === 'vip-glamping-pondok-saladah' ? '/vipcamp.jpg' :
                        pkg.hero_image
                      }
                      alt={pkg.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
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
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="bg-[#0f2252] text-amber-400 text-[11px] font-bold px-2.5 py-1 rounded-full shadow border border-navy-700 uppercase">
                        {pkg.category === 'camping' ? 'Camping 2D1N' : 'One Day Trip'}
                      </span>
                      {pkg.type === 'private' && (
                        <span className="bg-amber-500 text-navy-950 text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow uppercase">
                          VIP Private
                        </span>
                      )}
                    </div>

                    {pkg.type === 'scheduled' && (
                      <div className="absolute bottom-3 right-3 bg-[#0a1638]/80 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-lg border border-white/20">
                        {hasSchedules ? 'Slot Tersedia' : 'Jadwal Penuh'}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <h2 
                      onClick={() => onSelectPackage(pkg.slug)}
                      className="font-bold text-navy-950 text-lg group-hover:text-navy-700 transition cursor-pointer"
                    >
                      {pkg.name}
                    </h2>
                    
                    <p className="text-xs text-navy-700 font-semibold mt-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      {pkg.duration_label}
                    </p>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {pkg.short_description}
                    </p>

                    {/* Destinasi preview chips */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {pkg.destinations.slice(0, 3).map((dest, idx) => (
                        <span 
                          key={idx}
                          className="inline-flex items-center gap-1 text-[11px] text-navy-800 bg-navy-50 border border-navy-100 px-2 py-0.5 rounded-md"
                        >
                          <MapPin className="w-2.5 h-2.5 text-amber-500" />
                          {dest.split('(')[0]}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Pricing & CTA */}
                <div className="p-5 pt-0 mt-2">
                  <div className="pt-3 border-t border-navy-50 flex items-end justify-between mb-4">
                    <div>
                      <span className="text-[11px] text-slate-400 block font-medium">Harga mulai dari</span>
                      <p className="text-lg font-extrabold text-navy-900">
                        Rp {lowestTier?.price_per_person.toLocaleString('id-ID')}
                        <span className="text-xs font-normal text-slate-500"> / org</span>
                      </p>
                    </div>
                    <span className="text-[11px] text-slate-400 text-right">
                      DP min {pkg.min_dp_percentage}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id={`btn-detail-${pkg.slug}`}
                      onClick={() => onSelectPackage(pkg.slug)}
                      className="w-full py-2.5 px-3 border border-navy-200 hover:border-navy-900 text-navy-900 font-bold rounded-xl text-xs transition text-center hover:bg-navy-50"
                    >
                      Lihat Detail
                    </button>
                    <button
                      id={`btn-book-${pkg.slug}`}
                      onClick={() => onBookDirect(pkg.slug)}
                      className="w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-[#0f2252] font-black rounded-xl text-xs shadow-md transition text-center tracking-wide"
                    >
                      BOOK NOW
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
