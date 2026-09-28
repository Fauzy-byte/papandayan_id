import React from 'react';
import { CheckCircle2, ShieldCheck, MessageCircle, Home, Copy, Check, Mail } from 'lucide-react';
import { Booking } from '../types';

interface BookingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  isOpen,
  onClose,
  booking
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !booking) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(booking.booking_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const waMessage = encodeURIComponent(
    `Halo Admin Papandayan.id! Saya baru saja melakukan booking paket "${booking.trip_package.name}" dengan Kode Booking: ${booking.booking_code} atas nama ${booking.customer_name}. Mohon konfirmasi ketersediaan dan panduan selanjutnya.`
  );
  const waUrl = `https://wa.me/62895422619017?text=${waMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-navy-950/70 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      {/* Dialog Box */}
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10 border border-navy-100 text-center animate-in fade-in zoom-in duration-200">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs uppercase tracking-wider inline-block mb-2">
          Pemesanan Berhasil Terkirim
        </span>

        <h3 className="text-2xl font-black text-navy-950 mb-2">
          Terima Kasih, {booking.customer_name}!
        </h3>

        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5">
          Permohonan reservasi paket <strong className="text-navy-950">{booking.trip_package.name}</strong> telah berhasil kami terima dan diteruskan ke sistem operasional.
        </p>

        {/* Booking Code Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-3 text-left">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Kode Referensi Booking Anda:
          </span>
          <div className="flex items-center justify-between">
            <span className="font-mono font-black text-xl text-navy-950 tracking-wider">
              {booking.booking_code}
            </span>
            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-navy-900 border border-slate-300 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Salin'}</span>
            </button>
          </div>
        </div>

        {/* Real-Time Gmail Notification Notice */}
        <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-3.5 mb-4 text-left flex items-start gap-3 text-xs text-blue-950">
          <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="leading-tight">
            <span className="font-bold block text-blue-900">Notifikasi Real-Time Terkirim ke Gmail:</span>
            <span className="font-mono text-navy-950 block mt-0.5 font-bold">{booking.customer_email}</span>
            <p className="text-[11px] text-blue-800 mt-1">
              Rincian reservasi dan tata cara pembayaran DP telah dikirimkan secara real-time ke kotak masuk Gmail Anda.
            </p>
          </div>
        </div>

        {/* Security & Admin Management Notice */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 mb-6 text-left flex items-start gap-3 text-xs text-amber-950">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Pengelolaan Data Terproteksi</span>
            <p className="text-slate-600 leading-relaxed">
              Demi keamanan privasi wisatawan, data rincian pemesanan dikelola dan hanya dapat diakses langsung oleh Tim Administrator Operasional Papandayan. Tim kami akan segera menghubungi nomor WhatsApp Anda (<strong className="font-mono text-navy-950">{booking.customer_phone}</strong>) untuk validasi jadwal dan pembayaran.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm transition shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Konfirmasi Cepat via WhatsApp</span>
          </a>

          <button
            onClick={onClose}
            className="inline-flex items-center justify-center gap-1.5 py-3 px-5 bg-navy-950 hover:bg-navy-900 text-white rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>
        </div>
      </div>
    </div>
  );
};
