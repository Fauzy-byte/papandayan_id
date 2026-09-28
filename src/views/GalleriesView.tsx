import React, { useState } from 'react';
import { GalleryItem } from '../types';
import { X, ZoomIn, Camera, ArrowRight } from 'lucide-react';

interface GalleriesViewProps {
  galleries: GalleryItem[];
  onNavigatePackages: () => void;
}

export const GalleriesView: React.FC<GalleriesViewProps> = ({
  galleries,
  onNavigatePackages
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = ['all', ...Array.from(new Set(galleries.map(g => g.category)))];

  const filtered = galleries.filter(g => 
    selectedCategory === 'all' || g.category === selectedCategory
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
      <div className="mb-8">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Dokumentasi Nyata</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 mt-1">
          Galeri Keindahan Gunung Papandayan
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-2xl">
          Lihat ragam momen magis mulai dari kabut fajar Tebing Soni, pohon-pohon eksotis Hutan Mati, padang bunga Edelweis Tegal Alun, hingga suasana hangat api unggun Ghober Hut.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition ${
              selectedCategory === cat
                ? 'bg-[#0f2252] text-amber-300 shadow-sm border border-navy-800'
                : 'bg-white border border-navy-100 text-navy-900 hover:bg-navy-50'
            }`}
          >
            {cat === 'all' ? 'Semua Momen' : cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveItem(item)}
            className="group relative rounded-2xl overflow-hidden bg-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer aspect-[4/3] border border-navy-100"
          >
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
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
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1638]/95 via-[#0f2252]/40 to-transparent opacity-90 group-hover:opacity-100 transition flex flex-col justify-end p-5">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">{item.category}</span>
              <h3 className="text-base font-bold text-white mt-1 group-hover:text-amber-300 transition">{item.title}</h3>
              <p className="text-xs text-blue-100 mt-1 line-clamp-2">{item.caption}</p>
            </div>
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-navy-950/60 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition border border-white/20">
              <ZoomIn className="w-4 h-4 text-amber-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-sm">
          <div className="relative max-w-4xl w-full bg-[#0a1638] rounded-3xl overflow-hidden shadow-2xl border border-navy-800">
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="max-h-[70vh] bg-black flex items-center justify-center">
              <img
                src={activeItem.image_url}
                alt={activeItem.title}
                className="max-h-[70vh] w-auto max-w-full object-contain"
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
            </div>
            <div className="p-6 bg-[#0a1638] text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs text-amber-400 uppercase tracking-wider font-bold">{activeItem.category}</span>
                <h3 className="text-lg font-bold mt-0.5">{activeItem.title}</h3>
                <p className="text-xs text-blue-200 mt-1">{activeItem.caption}</p>
              </div>
              <button
                onClick={() => {
                  setActiveItem(null);
                  onNavigatePackages();
                }}
                className="bg-amber-500 hover:bg-amber-400 text-navy-950 font-black px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-1.5 whitespace-nowrap shadow-md"
              >
                Pesan Trip Ini <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-16 bg-white border border-navy-100 p-8 rounded-3xl text-center shadow-xs">
        <h3 className="text-xl font-bold text-navy-950">Ingin Mengabadikan Momen Sendiri di Papandayan?</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Setiap paket trip kami sudah termasuk dokumentasi foto dan video oleh pemandu lokal handal.
        </p>
        <button
          onClick={onNavigatePackages}
          className="mt-5 bg-amber-500 hover:bg-amber-400 text-[#0f2252] font-black px-6 py-3 rounded-xl text-xs transition shadow-md"
        >
          Lihat Pilihan Paket Trip
        </button>
      </div>
    </div>
  );
};
