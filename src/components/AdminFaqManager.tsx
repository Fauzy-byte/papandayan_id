import React, { useState, useMemo } from 'react';
import { FaqItem } from '../types';
import { 
  HelpCircle, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  X, 
  FolderPlus, 
  Eye, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  MessageSquare
} from 'lucide-react';
import { INITIAL_FAQS } from '../data/faqData';

interface AdminFaqManagerProps {
  faqs: FaqItem[];
  onAddFaq: (faq: Omit<FaqItem, 'id' | 'created_at'>) => void;
  onUpdateFaq: (faq: FaqItem) => void;
  onDeleteFaq: (id: string) => void;
  onResetFaqs?: () => void;
}

const DEFAULT_CATEGORIES = [
  'Jalur & Medan',
  'Meeting Point',
  'Logistik & Peralatan',
  'Pemesanan & DP',
  'Keselamatan & Cuaca',
  'Lainnya'
];

export const AdminFaqManager: React.FC<AdminFaqManagerProps> = ({
  faqs,
  onAddFaq,
  onUpdateFaq,
  onDeleteFaq,
  onResetFaqs
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [questionInput, setQuestionInput] = useState('');
  const [answerInput, setAnswerInput] = useState('');
  const [categoryInput, setCategoryInput] = useState(DEFAULT_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete confirmation modal state
  const [deletingFaq, setDeletingFaq] = useState<FaqItem | null>(null);

  // Success notice toast
  const [noticeMsg, setNoticeMsg] = useState('');

  const showNotice = (msg: string) => {
    setNoticeMsg(msg);
    setTimeout(() => setNoticeMsg(''), 4000);
  };

  // Categories present in current FAQs
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    faqs.forEach(f => {
      if (f.category) set.add(f.category);
    });
    DEFAULT_CATEGORIES.forEach(c => set.add(c));
    return Array.from(set);
  }, [faqs]);

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchCat = selectedCategory === 'all' || faq.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchQuery = 
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q) ||
        (faq.category && faq.category.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [faqs, selectedCategory, searchQuery]);

  // Open Form for Create
  const handleOpenCreate = () => {
    setEditingFaq(null);
    setQuestionInput('');
    setAnswerInput('');
    setCategoryInput(DEFAULT_CATEGORIES[0]);
    setIsCustomCategory(false);
    setCustomCategory('');
    setFormError('');
    setIsFormOpen(true);
  };

  // Open Form for Edit
  const handleOpenEdit = (faq: FaqItem) => {
    setEditingFaq(faq);
    setQuestionInput(faq.question);
    setAnswerInput(faq.answer);
    if (DEFAULT_CATEGORIES.includes(faq.category)) {
      setCategoryInput(faq.category);
      setIsCustomCategory(false);
      setCustomCategory('');
    } else {
      setCategoryInput('custom');
      setIsCustomCategory(true);
      setCustomCategory(faq.category);
    }
    setFormError('');
    setIsFormOpen(true);
  };

  // Save Form (Create or Update)
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQ = questionInput.trim();
    const cleanA = answerInput.trim();
    const finalCategory = isCustomCategory 
      ? customCategory.trim() || 'Lainnya' 
      : categoryInput;

    if (!cleanQ || cleanQ.length < 5) {
      setFormError('Pertanyaan minimal 5 karakter.');
      return;
    }
    if (!cleanA || cleanA.length < 10) {
      setFormError('Jawaban minimal 10 karakter.');
      return;
    }

    if (editingFaq) {
      onUpdateFaq({
        ...editingFaq,
        question: cleanQ,
        answer: cleanA,
        category: finalCategory,
        updated_at: new Date().toISOString()
      });
      showNotice(`Pertanyaan FAQ "${cleanQ.substring(0, 30)}..." berhasil diperbarui.`);
    } else {
      onAddFaq({
        question: cleanQ,
        answer: cleanA,
        category: finalCategory
      });
      showNotice(`Pertanyaan FAQ baru berhasil ditambahkan dan langsung aktif.`);
    }

    setIsFormOpen(false);
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (deletingFaq) {
      onDeleteFaq(deletingFaq.id);
      showNotice(`Pertanyaan FAQ "${deletingFaq.question.substring(0, 30)}..." berhasil dihapus.`);
      setDeletingFaq(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      {noticeMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{noticeMsg}</span>
          </div>
          <button 
            onClick={() => setNoticeMsg('')}
            className="text-emerald-700 hover:text-emerald-950 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Panel */}
      <div className="bg-white p-6 rounded-3xl border border-navy-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 font-bold">
              <HelpCircle className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Manajemen Pusat Bantuan
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-navy-950 mt-1">
            Kelola Daftar Pertanyaan FAQ
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Admin dapat menambah, mengedit, atau menghapus pertanyaan umum yang langsung tersinkronisasi ke modal Bantuan pengguna secara real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
          {onResetFaqs && (
            <button
              onClick={() => {
                if (window.confirm('Kembalikan daftar FAQ ke pengaturan awal default?')) {
                  onResetFaqs();
                  showNotice('Daftar FAQ berhasil direset ke pengaturan default awal.');
                }
              }}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="Reset ke FAQ default"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Reset Default</span>
            </button>
          )}

          <button
            id="btn-add-faq"
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-navy-950 font-black text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pertanyaan FAQ</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white p-4 rounded-2xl border border-navy-100 shadow-xs flex flex-col sm:flex-row gap-3 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari pertanyaan, jawaban, atau kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-navy-900 focus:bg-white transition"
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

        {/* Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-[#0f2252] text-amber-300 shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            Semua ({faqs.length})
          </button>
          {availableCategories.map(cat => {
            const count = faqs.filter(f => f.category === cat).length;
            if (count === 0 && selectedCategory !== cat) return null;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#0f2252] text-amber-300 shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* FAQ Cards List */}
      <div className="space-y-3">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => (
            <div
              key={faq.id}
              className="bg-white p-5 rounded-2xl border border-navy-100 shadow-xs hover:shadow-md transition flex flex-col md:flex-row md:items-start justify-between gap-4 group"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-navy-100 text-navy-900 text-xs font-extrabold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {faq.category || 'Umum'}
                  </span>
                  {faq.created_at && (
                    <span className="text-[10px] text-slate-400">
                      Tercatat: {new Date(faq.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-navy-950 text-base group-hover:text-navy-800 transition">
                  {faq.question}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                  {faq.answer}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-start shrink-0 pt-1">
                <button
                  onClick={() => handleOpenEdit(faq)}
                  className="px-3 py-1.5 rounded-xl border border-navy-200 hover:border-navy-900 text-navy-900 font-bold text-xs transition flex items-center gap-1 hover:bg-navy-50 cursor-pointer"
                  title="Edit Pertanyaan"
                >
                  <Edit3 className="w-3.5 h-3.5 text-navy-700" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => setDeletingFaq(faq)}
                  className="px-3 py-1.5 rounded-xl border border-red-200 hover:border-red-600 text-red-600 font-bold text-xs transition flex items-center gap-1 hover:bg-red-50 cursor-pointer"
                  title="Hapus Pertanyaan"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-navy-100 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-navy-950">
              Tidak Ada Pertanyaan FAQ yang Cocok
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery 
                ? `Tidak ditemukan pertanyaan dengan kata kunci "${searchQuery}". Silakan coba kata kunci lain.` 
                : 'Belum ada daftar FAQ pada kategori ini. Silakan klik tombol "Tambah Pertanyaan FAQ" di atas.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-xs font-bold text-navy-900 underline cursor-pointer"
              >
                Hapus pencarian
              </button>
            )}
          </div>
        )}
      </div>

      {/* CREATE / EDIT FAQ MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-navy-100">
            {/* Modal Header */}
            <div className="p-6 bg-[#0a1638] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  {editingFaq ? 'Perbarui Konten' : 'Formulir Pertanyaan Baru'}
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  {editingFaq ? 'Edit Pertanyaan FAQ' : 'Tambah Pertanyaan FAQ Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveForm} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Kategori */}
              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  Kategori FAQ
                </label>
                {!isCustomCategory ? (
                  <div className="flex gap-2">
                    <select
                      value={categoryInput}
                      onChange={(e) => {
                        if (e.target.value === 'custom') {
                          setIsCustomCategory(true);
                        } else {
                          setCategoryInput(e.target.value);
                        }
                      }}
                      className="w-full text-xs rounded-xl border border-navy-200 p-2.5 focus:ring-2 focus:ring-navy-900 bg-white"
                    >
                      {DEFAULT_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="custom">+ Kategori Kustom Baru...</option>
                    </select>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ketik nama kategori baru..."
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        className="w-full text-xs rounded-xl border border-navy-200 p-2.5 focus:ring-2 focus:ring-navy-900"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomCategory(false);
                          setCategoryInput(DEFAULT_CATEGORIES[0]);
                        }}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-navy-900 rounded-xl text-xs font-bold whitespace-nowrap"
                      >
                        Pilih Kategori Ada
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Pertanyaan */}
              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  Pertanyaan (Question)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Apakah ada batas minimal usia untuk peserta trip?"
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  className="w-full text-xs rounded-xl border border-navy-200 p-2.5 focus:ring-2 focus:ring-navy-900"
                />
              </div>

              {/* Jawaban */}
              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  Jawaban Lengkap (Answer)
                </label>
                <textarea
                  rows={4}
                  placeholder="Contoh: Minimal usia peserta adalah 5 tahun dengan didampingi orang tua. Untuk lansia di atas 60 tahun dianjurkan menyertakan surat keterangan sehat."
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  className="w-full text-xs rounded-xl border border-navy-200 p-2.5 focus:ring-2 focus:ring-navy-900"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-navy-950 rounded-xl text-xs font-black shadow-md transition cursor-pointer"
                >
                  {editingFaq ? 'Simpan Perubahan' : 'Terbitkan Pertanyaan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-navy-100">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-black text-navy-950">
                Hapus Pertanyaan FAQ?
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Anda akan menghapus pertanyaan: <strong className="text-navy-900">"{deletingFaq.question}"</strong>. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingFaq(null)}
                className="py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
