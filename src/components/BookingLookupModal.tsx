import React, { useState } from 'react';
import { X, Search, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { Booking } from '../types';

interface BookingLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onSelectBooking: (code: string) => void;
  isAdmin?: boolean;
}

export const BookingLookupModal: React.FC<BookingLookupModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onSelectBooking,
  isAdmin = false
}) => {
  const [code, setCode] = useState('');
  const [verificationContact, setVerificationContact] = useState('');
  const [searched, setSearched] = useState(false);
  const [foundBooking, setFoundBooking] = useState<Booking | null>(null);
  const [errorReason, setErrorReason] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    const cleanContact = verificationContact.trim().toLowerCase().replace(/[^a-z0-9@.]/g, '');

    const match = bookings.find(b => b.booking_code.toUpperCase() === cleanCode);

    if (!match) {
      setFoundBooking(null);
      setErrorReason('Kode booking tidak ditemukan dalam sistem database.');
      setSearched(true);
      return;
    }

    // If Admin mode, direct access is allowed
    if (isAdmin) {
      setFoundBooking(match);
      setErrorReason(null);
      setSearched(true);
      return;
    }

    // Customer mode: Require verification of phone OR email for data protection
    const customerPhoneClean = match.customer_phone.replace(/[^0-9]/g, '');
    const customerEmailClean = match.customer_email.toLowerCase();

    const contactMatches = 
      (cleanContact.length >= 4 && customerPhoneClean.includes(cleanContact)) ||
      (cleanContact.length >= 3 && customerEmailClean.includes(cleanContact));

    if (contactMatches) {
      setFoundBooking(match);
      setErrorReason(null);
      setSearched(true);
    } else {
      setFoundBooking(null);
      setErrorReason('Nomor WhatsApp atau Email tidak cocok dengan data pendaftaran tiket ini. Demi perlindungan privasi pelanggan, verifikasi identitas diperlukan.');
      setSearched(true);
    }
  };

  const handleView = () => {
    if (foundBooking) {
      onSelectBooking(foundBooking.booking_code);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl z-10 border border-navy-100">
        <div className="flex justify-between items-center pb-4 border-b border-navy-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-navy-100 text-navy-900 flex items-center justify-center">
              <Search className="w-4 h-4 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-navy-950">Cek Status Pesanan</h3>
          </div>
          <button 
            id="close-lookup-modal-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-navy-950 hover:bg-navy-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-600 mt-3 mb-4">
          {isAdmin ? (
            <span className="text-amber-700 font-medium">Mode Admin: Anda dapat mencari pesanan dengan memasukkan kode booking secara langsung.</span>
          ) : (
            <span>Masukkan kode booking dan nomor WhatsApp/email yang digunakan saat pemesanan untuk membuka data tiket Anda dengan aman.</span>
          )}
        </p>

        <form onSubmit={handleSearch} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Kode Booking
            </label>
            <div className="relative">
              <input
                id="booking-lookup-input"
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setSearched(false);
                }}
                placeholder="PAP-XXXX-XXXX"
                required
                className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-navy-200 focus:ring-2 focus:ring-navy-900 focus:border-navy-900 font-mono text-sm tracking-wider uppercase text-navy-950"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-2 p-1 text-navy-900 hover:text-navy-700"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {!isAdmin && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Verifikasi No. WhatsApp atau Email
              </label>
              <input
                id="booking-lookup-verify-contact"
                type="text"
                value={verificationContact}
                onChange={(e) => {
                  setVerificationContact(e.target.value);
                  setSearched(false);
                }}
                placeholder="Contoh: 081234567890 atau email@anda.com"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-navy-200 focus:ring-2 focus:ring-navy-900 focus:border-navy-900 text-sm text-navy-950 placeholder:text-slate-400"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                🔒 Diperlukan demi melindungi kerahasiaan & keamanan data pribadi Anda.
              </p>
            </div>
          )}

          <button
            id="search-booking-submit-btn"
            type="submit"
            className="w-full bg-[#0f2252] hover:bg-[#162a65] text-amber-300 font-bold py-2.5 rounded-xl text-sm transition shadow-md cursor-pointer"
          >
            Cek Status & Buka Tiket
          </button>
        </form>

        {/* Search Results */}
        {searched && (
          <div className="mt-5 pt-4 border-t border-navy-50">
            {foundBooking ? (
              <div className="bg-navy-50/70 border border-navy-200 rounded-xl p-4 text-sm">
                <div className="flex items-center gap-2 text-navy-900 font-semibold mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Verifikasi Berhasil • Pesanan Ditemukan!
                </div>
                <div className="space-y-1 text-slate-700 text-xs">
                  <p><span className="text-slate-500">Paket:</span> <span className="font-medium text-navy-950">{foundBooking.trip_package.name}</span></p>
                  <p><span className="text-slate-500">Pemesan:</span> <span className="font-medium text-navy-950">{foundBooking.customer_name} ({foundBooking.participant_count} orang)</span></p>
                  <p><span className="text-slate-500">Status:</span> <span className="font-bold text-navy-900 uppercase">{foundBooking.status.replace('_', ' ')}</span></p>
                </div>
                <button
                  id="open-found-booking-btn"
                  onClick={handleView}
                  className="mt-3 w-full inline-flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-[#0f2252] font-black py-2 rounded-lg text-xs transition shadow-sm cursor-pointer"
                >
                  Buka Detail Pesanan & Tiket <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Data Tidak Ditemukan / Tidak Cocok</p>
                  <p className="mt-1">{errorReason || 'Pastikan kode booking dan nomor WhatsApp/email sudah sesuai.'}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick sample chips */}
        <div className="mt-4 pt-3 border-t border-navy-50 text-xs text-slate-500">
          <span>Contoh kode booking aktif: </span>
          <button 
            type="button" 
            onClick={() => { setCode('PAP-2026-0921'); setSearched(false); }}
            className="text-navy-900 font-mono underline hover:text-navy-700 mr-2 font-semibold"
          >
            PAP-2026-0921
          </button>
          <button 
            type="button" 
            onClick={() => { setCode('PAP-2026-0922'); setSearched(false); }}
            className="text-navy-900 font-mono underline hover:text-navy-700 font-semibold"
          >
            PAP-2026-0922
          </button>
        </div>
      </div>
    </div>
  );
};
