import React, { useState } from 'react';
import { X, HelpCircle, Calendar, CreditCard, RefreshCw, FileText, ChevronRight, Search } from 'lucide-react';
import { FaqItem } from '../types';
import { INITIAL_FAQS } from '../data/faqData';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
  faqs?: FaqItem[];
}

export const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'faq',
  faqs = INITIAL_FAQS
}) => {
  const [activeTab, setActiveTab] = useState<'faq' | 'booking' | 'payment' | 'refund'>(
    (initialTab as any) || 'faq'
  );
  const [faqSearch, setFaqSearch] = useState('');

  if (!isOpen) return null;

  const currentFaqs = faqs && faqs.length > 0 ? faqs : INITIAL_FAQS;
  const filteredFaqs = currentFaqs.filter(f => {
    if (!faqSearch.trim()) return true;
    const q = faqSearch.toLowerCase();
    return (
      f.question.toLowerCase().includes(q) ||
      f.answer.toLowerCase().includes(q) ||
      (f.category && f.category.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl z-10 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-navy-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-navy-100 text-navy-900 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy-950">Pusat Bantuan & Kebijakan</h3>
              <p className="text-xs text-slate-500">Informasi resmi reservasi trip Gunung Papandayan</p>
            </div>
          </div>
          <button 
            id="close-help-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-navy-950 hover:bg-navy-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 bg-navy-50 rounded-xl my-4 text-xs font-semibold overflow-x-auto border border-navy-100">
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-3 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === 'faq' ? 'bg-[#0f2252] text-amber-300 shadow-sm' : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            FAQ (Tanya Jawab)
          </button>
          <button
            onClick={() => setActiveTab('booking')}
            className={`px-3 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === 'booking' ? 'bg-[#0f2252] text-amber-300 shadow-sm' : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            Cara Booking
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`px-3 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === 'payment' ? 'bg-[#0f2252] text-amber-300 shadow-sm' : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            Pembayaran & DP
          </button>
          <button
            onClick={() => setActiveTab('refund')}
            className={`px-3 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === 'refund' ? 'bg-[#0f2252] text-amber-300 shadow-sm' : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            Refund & Pembatalan
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 text-sm text-slate-700 space-y-4">
          {activeTab === 'faq' && (
            <div className="space-y-3">
              {/* Search FAQ */}
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari pertanyaan seputar Papandayan..."
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-navy-900 focus:bg-white"
                />
              </div>

              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => (
                  <div key={faq.id} className="p-3.5 rounded-xl bg-navy-50/40 border border-navy-100 hover:border-navy-200 transition">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 uppercase tracking-wider">
                        {faq.category || 'Umum'}
                      </span>
                    </div>
                    <h4 className="font-bold text-navy-950 text-sm">{faq.question}</h4>
                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                  Tidak ditemukan pertanyaan dengan kata kunci "{faqSearch}".
                </div>
              )}
            </div>
          )}

          {activeTab === 'booking' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">Ikuti 4 langkah mudah untuk mengamankan slot perjalanan Anda:</p>
              
              <div className="flex gap-3 items-start p-3 bg-navy-50/40 rounded-xl border border-navy-100">
                <div className="w-6 h-6 rounded-full bg-[#0f2252] text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</div>
                <div>
                  <h4 className="font-semibold text-navy-950 text-xs">Pilih Paket Trip & Jadwal</h4>
                  <p className="text-xs text-slate-600 mt-1">Pilih paket yang diinginkan (Sunrise, Exploring, atau Camping) dan pilih tanggal trip yang masih memiliki sisa kuota.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start p-3 bg-navy-50/40 rounded-xl border border-navy-100">
                <div className="w-6 h-6 rounded-full bg-[#0f2252] text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</div>
                <div>
                  <h4 className="font-semibold text-navy-950 text-xs">Isi Data Pemesan & Peserta</h4>
                  <p className="text-xs text-slate-600 mt-1">Lengkapi nama, email, nomor WhatsApp, serta nama seluruh peserta untuk keperluan asuransi dan pendataan SIMAKSI resmi.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start p-3 bg-navy-50/40 rounded-xl border border-navy-100">
                <div className="w-6 h-6 rounded-full bg-[#0f2252] text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</div>
                <div>
                  <h4 className="font-semibold text-navy-950 text-xs">Pembayaran DP Minimal 30%</h4>
                  <p className="text-xs text-slate-600 mt-1">Lakukan transfer DP melalui QRIS atau Virtual Account bank. Status pemesanan Anda langsung terkonfirmasi otomatis.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start p-3 bg-navy-50/40 rounded-xl border border-navy-100">
                <div className="w-6 h-6 rounded-full bg-[#0f2252] text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">4</div>
                <div>
                  <h4 className="font-semibold text-navy-950 text-xs">Terima E-Tiket & Masuk Grup Koordinasi</h4>
                  <p className="text-xs text-slate-600 mt-1">Admin akan mengirimkan ringkasan e-tiket dan mengundang Anda ke WhatsApp group koordinasi 2 hari sebelum trip.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-3 text-xs leading-relaxed text-slate-600">
              <div className="p-3.5 bg-navy-50/80 border border-navy-200 rounded-xl text-navy-950">
                <h4 className="font-bold text-sm text-navy-950 mb-1">Ketentuan Uang Muka (DP)</h4>
                <p>
                  Untuk mengamankan kuota SIMAKSI BKSDA dan guide, pesanan memerlukan DP minimal 30% (atau 40% untuk paket VIP Camp). DP dibayarkan maksimal 6 jam setelah form booking disubmit.
                </p>
              </div>

              <div className="p-3.5 bg-navy-50/40 border border-navy-100 rounded-xl">
                <h4 className="font-bold text-navy-950 mb-1">Metode Pembayaran Resmi</h4>
                <ul className="list-disc list-inside space-y-1 mt-1 text-slate-700">
                  <li>QRIS (Semua bank & e-wallet: GoPay, OVO, ShopeePay, Dana)</li>
                  <li>Virtual Account BCA, Mandiri, BNI, BRI</li>
                  <li>Transfer Bank resmi: PT PASAK OUTDOOR GARUT</li>
                </ul>
              </div>

              <div className="p-3.5 bg-navy-50/40 border border-navy-100 rounded-xl">
                <h4 className="font-bold text-navy-950 mb-1">Batas Waktu Pelunasan</h4>
                <p>Pelunasan sisa tagihan dapat dilakukan secara online maksimal H-1 sebelum keberangkatan, atau secara tunai di Basecamp saat registrasi ulang.</p>
              </div>
            </div>
          )}

          {activeTab === 'refund' && (
            <div className="space-y-3 text-xs leading-relaxed text-slate-600">
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                <h4 className="font-bold text-sm text-amber-950 mb-1">Kebijakan Pembatalan & Pengembalian Dana</h4>
                <p>
                  Pengajuan pembatalan wajib disampaikan secara tertulis melalui WhatsApp resmi Papandayan.id dengan menyertakan kode booking.
                </p>
              </div>

              <table className="w-full text-left border border-navy-100 rounded-lg overflow-hidden">
                <thead className="bg-navy-50 text-navy-900 font-semibold">
                  <tr>
                    <th className="p-2.5">Waktu Pembatalan</th>
                    <th className="p-2.5">Ketentuan Refund</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100">
                  <tr>
                    <td className="p-2.5">≥ H-7 Keberangkatan</td>
                    <td className="p-2.5 text-navy-900 font-medium">Refund 100% (dipotong biaya admin transfer Rp 10.000)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">H-6 s/d H-3 Keberangkatan</td>
                    <td className="p-2.5 text-blue-700 font-medium">Refund 50% dari total DP atau opsi Reschedule 1x gratis</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">&lt; H-3 Keberangkatan / No-Show</td>
                    <td className="p-2.5 text-rose-600 font-medium">DP hangus (karena kuota SIMAKSI & logistik telah diterbitkan)</td>
                  </tr>
                </tbody>
              </table>

              <p className="text-[11px] text-slate-500 italic">
                * Khusus keadaan kahar (Force Majeure) seperti penutupan resmi kawasan oleh pihak berwenang akibat aktivitas vulkanik atau bencana alam, dana akan dikembalikan penuh atau dialihkan 100% tanpa potongan.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-navy-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-navy-950">WhatsApp Admin:</span>
            <a
              href="https://wa.me/62895422619017?text=Halo%20Admin%20Papandayan.id,%20saya%20butuh%20bantuan"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-amber-600 hover:text-amber-700 hover:underline"
            >
              0895-4226-19017
            </a>
            <span className="text-slate-400">/</span>
            <a
              href="https://wa.me/62895635967327?text=Halo%20Admin%20Papandayan.id,%20saya%20butuh%20bantuan"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-amber-600 hover:text-amber-700 hover:underline"
            >
              0895-6359-67327
            </a>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-navy-50 hover:bg-navy-100 text-navy-900 font-semibold rounded-xl text-xs transition self-end sm:self-auto"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
