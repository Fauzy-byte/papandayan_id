import React, { useState, useMemo } from 'react';
import { GalleryItem } from '../types';
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  X, 
  ExternalLink,
  Eye,
  Camera,
  FolderPlus
} from 'lucide-react';
import { INITIAL_GALLERIES } from '../data/galleryData';

interface AdminGalleryManagerProps {
  galleries: GalleryItem[];
  onAddGallery: (item: Omit<GalleryItem, 'id'>) => void;
  onUpdateGallery: (item: GalleryItem) => void;
  onDeleteGallery: (id: number) => void;
  onResetGalleries?: () => void;
}

const DEFAULT_CATEGORIES = [
  'Sunrise',
  'Camping',
  'Aktivitas',
  'Lanskap',
  'Flora',
  'Geologi',
  'Dokumentasi'
];

// File foto lokal yang tersedia di folder public
const AVAILABLE_LOCAL_PRESETS = [
  { name: 'Sunrise Tebing Soni (/sunrise.jpg)', url: '/sunrise.jpg' },
  { name: 'One Day Exploring Kawah (/oneday.jpg)', url: '/oneday.jpg' },
  { name: 'Hutan Mati Cantigi (/hutanmati.JPG)', url: '/hutanmati.JPG' },
  { name: 'Private Camp Tenda (/privatecamp.jpg)', url: '/privatecamp.jpg' },
  { name: 'Private Camp Foto 2 (/privatecamp.JPG)', url: '/privatecamp.JPG' },
  { name: 'VIP Glamping Camp (/vipcamp.jpg)', url: '/vipcamp.jpg' },
  { name: 'Logo Resmi papandayan_id (/logo (2).png)', url: '/logo (2).png' }
];

export const AdminGalleryManager: React.FC<AdminGalleryManagerProps> = ({
  galleries,
  onAddGallery,
  onUpdateGallery,
  onDeleteGallery,
  onResetGalleries
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Form / Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [titleInput, setTitleInput] = useState('');
  const [categoryInput, setCategoryInput] = useState(DEFAULT_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('/sunrise.jpg');
  const [captionInput, setCaptionInput] = useState('');
  const [formError, setFormError] = useState('');

  // Delete modal state
  const [deletingItem, setDeletingItem] = useState<GalleryItem | null>(null);

  // Preview modal state
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);

  // Success toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Categories list
  const allCategories = useMemo(() => {
    const set = new Set<string>(DEFAULT_CATEGORIES);
    galleries.forEach(g => {
      if (g.category) set.add(g.category);
    });
    return Array.from(set);
  }, [galleries]);

  // Filtered gallery items
  const filteredGalleries = useMemo(() => {
    return galleries.filter(item => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchQuery = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.caption && item.caption.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.image_url.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [galleries, selectedCategory, searchQuery]);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setTitleInput('');
    setCategoryInput(DEFAULT_CATEGORIES[0]);
    setCustomCategory('');
    setIsCustomCategory(false);
    setImageUrlInput('/sunrise.jpg');
    setCaptionInput('');
    setFormError('');
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setTitleInput(item.title);
    if (DEFAULT_CATEGORIES.includes(item.category)) {
      setCategoryInput(item.category);
      setIsCustomCategory(false);
      setCustomCategory('');
    } else {
      setIsCustomCategory(true);
      setCustomCategory(item.category);
      setCategoryInput('custom');
    }
    setImageUrlInput(item.image_url);
    setCaptionInput(item.caption || '');
    setFormError('');
    setIsFormOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) {
      setFormError('Judul foto wajib diisi.');
      return;
    }
    if (!imageUrlInput.trim()) {
      setFormError('Nama path file foto (misal: /sunrise.jpg atau /namafoto.png) wajib diisi.');
      return;
    }

    const finalCategory = isCustomCategory ? customCategory.trim() : categoryInput;
    if (!finalCategory) {
      setFormError('Kategori foto wajib dipilih atau diisi.');
      return;
    }

    if (editingItem) {
      onUpdateGallery({
        id: editingItem.id,
        title: titleInput.trim(),
        category: finalCategory,
        image_url: imageUrlInput.trim(),
        caption: captionInput.trim()
      });
      showToast(`Foto "${titleInput.trim()}" berhasil diperbarui!`);
    } else {
      onAddGallery({
        title: titleInput.trim(),
        category: finalCategory,
        image_url: imageUrlInput.trim(),
        caption: captionInput.trim()
      });
      showToast(`Foto baru "${titleInput.trim()}" berhasil ditambahkan ke galeri!`);
    }

    setIsFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    onDeleteGallery(deletingItem.id);
    showToast(`Foto "${deletingItem.title}" telah dihapus dari galeri.`);
    setDeletingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-xl animate-fade-in border border-emerald-500 text-xs sm:text-sm font-bold">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-navy-100 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-navy-950">Kelola Koleksi Foto Galeri (.JPG / .PNG)</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Atur foto dokumentasi asli yang tampil di halaman Galeri dan beranda website. Mendukung file asli di folder <code className="bg-slate-100 text-amber-800 px-1.5 py-0.5 rounded font-mono text-[11px]">/public</code> maupun link CDN.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {onResetGalleries && (
            <button
              onClick={() => {
                if (window.confirm('Kembalikan seluruh daftar galeri ke data foto bawaan (.jpg/.png asli)?')) {
                  onResetGalleries();
                  showToast('Galeri dikembalikan ke preset foto asli default!');
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer border border-slate-200"
              title="Reset ke Foto Bawaan"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>
          )}

          <button
            onClick={handleOpenAddModal}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-navy-950 font-black rounded-xl text-xs sm:text-sm shadow-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Foto Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-navy-100 p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul, keterangan, atau file foto..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#0f2252] text-amber-300'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({galleries.length})
          </button>
          {allCategories.map((cat) => {
            const count = galleries.filter(g => g.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0f2252] text-amber-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGalleries.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-navy-100 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
          >
            {/* Image Preview Container */}
            <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
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
              <div className="absolute top-2.5 left-2.5">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-navy-950/80 backdrop-blur-xs text-amber-300 border border-white/10">
                  {item.category}
                </span>
              </div>
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                <button
                  onClick={() => setPreviewItem(item)}
                  className="p-1.5 rounded-lg bg-navy-950/70 hover:bg-navy-950 text-white backdrop-blur-xs transition"
                  title="Lihat Pratinjau Penuh"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="absolute bottom-2 left-2.5 right-2.5">
                <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-slate-200 truncate block">
                  {item.image_url}
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-navy-950 text-sm leading-snug group-hover:text-amber-600 transition">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {item.caption || 'Tidak ada deskripsi caption.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">ID: #{item.id}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 transition"
                    title="Edit Foto & Keterangan"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingItem(item)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-700 transition"
                    title="Hapus Foto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredGalleries.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-navy-950">Tidak ada foto yang cocok</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau pilih kategori lain untuk melihat koleksi foto galeri.
          </p>
        </div>
      )}

      {/* MODAL: Tambah / Edit Foto */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-navy-100 animate-scale-up">
            <div className="px-6 py-4 bg-[#0a1638] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-sm sm:text-base">
                  {editingItem ? 'Edit Data Foto Galeri' : 'Tambah Foto Asli Baru ke Galeri'}
                </h3>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Judul Foto */}
              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  Judul Foto Dokumentasi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="Contoh: Pesona Golden Sunrise Tebing Soni"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  Kategori Foto <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setIsCustomCategory(false);
                        setCategoryInput(cat);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-left transition border ${
                        !isCustomCategory && categoryInput === cat
                          ? 'bg-[#0f2252] text-amber-300 border-navy-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is-custom-cat"
                    checked={isCustomCategory}
                    onChange={(e) => setIsCustomCategory(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-400"
                  />
                  <label htmlFor="is-custom-cat" className="text-xs text-slate-600 font-medium">
                    Gunakan kategori kustom lainnya
                  </label>
                </div>

                {isCustomCategory && (
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Ketik kategori baru (contoh: Kuliner, Sunset, Jalur)"
                    className="mt-2 w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                )}
              </div>

              {/* Path File Foto */}
              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  Nama Path File Foto (.JPG / .PNG) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="Contoh: /sunrise.jpg atau /nama-file.png"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
                
                {/* Quick Presets Picker */}
                <div className="mt-2">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                    Pilih Cepat File Foto Asli yang Ada di Server:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {AVAILABLE_LOCAL_PRESETS.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setImageUrlInput(preset.url)}
                        className={`text-[10px] font-mono px-2 py-1 rounded-md border transition ${
                          imageUrlInput === preset.url
                            ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold'
                            : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {preset.url}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Preview Miniatur */}
              {imageUrlInput && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                  <div className="w-16 h-12 rounded-lg bg-black overflow-hidden shrink-0 border border-slate-300">
                    <img
                      src={imageUrlInput}
                      alt="Pratinjau Foto"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/logo (2).png';
                      }}
                    />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-slate-700 block">Pratinjau Visual:</span>
                    <span className="text-[11px] text-slate-500 font-mono">{imageUrlInput}</span>
                  </div>
                </div>
              )}

              {/* Keterangan / Caption */}
              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  Keterangan Foto / Caption
                </label>
                <textarea
                  value={captionInput}
                  onChange={(e) => setCaptionInput(e.target.value)}
                  placeholder="Deskripsi singkat momen atau spot di Gunung Papandayan..."
                  rows={2}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-navy-950 font-black rounded-xl text-xs shadow-md transition"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Tambahkan ke Galeri'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Konfirmasi Hapus Foto */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-navy-100">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-navy-950">Hapus Foto dari Galeri?</h3>
            <p className="text-xs text-slate-500 mt-2">
              Apakah Anda yakin ingin menghapus foto <strong className="text-slate-800">"{deletingItem.title}"</strong>? Foto tidak akan tampil lagi di galeri pengunjung.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2.5">
              <button
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition shadow-md"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Full Preview Foto */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-md">
          <div className="relative max-w-3xl w-full bg-[#0a1638] rounded-3xl overflow-hidden shadow-2xl border border-navy-800">
            <button
              onClick={() => setPreviewItem(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="max-h-[65vh] bg-black flex items-center justify-center">
              <img
                src={previewItem.image_url}
                alt={previewItem.title}
                className="max-h-[65vh] w-auto max-w-full object-contain"
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
            <div className="p-5 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">{previewItem.category}</span>
                <h3 className="text-base font-bold text-white mt-0.5">{previewItem.title}</h3>
                <p className="text-xs text-blue-200 mt-1">{previewItem.caption}</p>
                <span className="text-[11px] font-mono text-slate-400 block mt-1">Path: {previewItem.image_url}</span>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-navy-950 font-black rounded-xl text-xs transition shrink-0"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
