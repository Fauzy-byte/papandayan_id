import React, { useState, useRef } from 'react';
import { Booking, BookingStatus } from '../types';
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Calendar, 
  MapPin, 
  Users, 
  CreditCard, 
  Printer, 
  Share2, 
  Phone,
  ShieldCheck,
  Check,
  Timer,
  Compass,
  Mail,
  Send,
  Download,
  FileText,
  Loader2
} from 'lucide-react';
import { PaymentModal } from '../components/PaymentModal';
import { useCountdown, useRealtimeClock, formatBookingTimestamp } from '../utils/timeUtils';
import { downloadETicketPDF } from '../utils/pdfGenerator';
import { sendEmailNotification } from '../utils/notificationService';

interface BookingDetailViewProps {
  booking: Booking;
  onBack: () => void;
  onUpdateBooking: (updated: Booking) => void;
}

export const BookingDetailView: React.FC<BookingDetailViewProps> = ({
  booking,
  onBack,
  onUpdateBooking
}) => {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [showEmailReceiptModal, setShowEmailReceiptModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);
  const clock = useRealtimeClock();

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      await downloadETicketPDF(ticketRef.current, booking);
    } catch (err) {
      console.error('Gagal generate PDF:', err);
      // Fallback print dialog if PDF generator fails
      window.print();
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Target deadline for payment (default: 6 hours from created_at or saved deadline)
  const paymentDeadline = booking.payment_deadline || new Date(Date.now() + 5.5 * 3600 * 1000).toISOString();
  const paymentCountdown = useCountdown(paymentDeadline);

  // Target date for trip departure
  const tripTargetDate = booking.trip_schedule_date ? `${booking.trip_schedule_date}T05:00:00` : '';
  const departureCountdown = useCountdown(tripTargetDate || new Date(Date.now() + 14 * 86400 * 1000).toISOString());

  const statusConfig: Record<BookingStatus, {
    label: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = {
    waiting_payment: {
      label: 'Menunggu Pembayaran',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-800',
      borderColor: 'border-amber-300',
      icon: Clock
    },
    waiting_confirmation: {
      label: 'Menunggu Konfirmasi',
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-800',
      borderColor: 'border-indigo-300',
      icon: Clock
    },
    confirmed: {
      label: 'Dikonfirmasi (Lunas DP / Penuh)',
      bgColor: 'bg-navy-100',
      textColor: 'text-navy-950',
      borderColor: 'border-navy-300',
      icon: CheckCircle
    },
    completed: {
      label: 'Trip Selesai',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-300',
      icon: ShieldCheck
    },
    cancelled: {
      label: 'Dibatalkan',
      bgColor: 'bg-rose-100',
      textColor: 'text-rose-800',
      borderColor: 'border-rose-300',
      icon: AlertCircle
    },
    refunded: {
      label: 'Dana Dikembalikan (Refund)',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800',
      borderColor: 'border-purple-300',
      icon: AlertCircle
    }
  };

  const currentStatusConfig = statusConfig[booking.status] || {
    label: booking.status,
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-300',
    icon: Clock
  };

  const StatusIcon = currentStatusConfig.icon;

  const handlePaymentSuccess = async (amount: number, method: string) => {
    const nowStr = formatBookingTimestamp(new Date());
    const updated: Booking = {
      ...booking,
      paid_amount: booking.paid_amount + amount,
      status: 'confirmed',
      paid_at: nowStr,
      payment_method: method,
      email_notified_at: nowStr,
      email_notification_status: 'sent'
    };
    onUpdateBooking(updated);

    try {
      await sendEmailNotification(updated, 'dp_confirmed', method);
    } catch (e) {
      console.warn('Real-time email trigger:', e);
    }
  };

  const handleCopyShare = () => {
    const shareText = `Halo! Ini E-Tiket Papandayan.id saya:\nKode Booking: ${booking.booking_code}\nPaket: ${booking.trip_package.name}\nPemesan: ${booking.customer_name}\nStatus: ${booking.status}`;
    navigator.clipboard.writeText(shareText);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const waUrl = `https://wa.me/62895422619017?text=Halo%20Admin%20Papandayan.id,%20saya%20ingin%20konfirmasi%20kode%20booking%20*${booking.booking_code}*%20atas%20nama%20*${encodeURIComponent(booking.customer_name)}*`;

  const officialEmail = 'papadayanindonesia@my67.cloud';
  const emailSubject = encodeURIComponent(`[RESERVASI TRIP PAPANDAYAN] ${booking.booking_code} - ${booking.customer_name} (${booking.trip_package.name})`);
  const emailBody = encodeURIComponent(`Yth. Manajemen PT. Pasak Outdoor / papandayan_id,

Terdapat pemesanan reservasi trip baru melalui sistem papandayan_id:

• KODE BOOKING   : ${booking.booking_code}
• PAKET TRIP     : ${booking.trip_package.name}
• JADWAL TRIP    : ${booking.trip_schedule_date || 'Sesuai Request'}
• TITIK KUMPUL   : ${booking.meeting_point}
• TIPE WISATAWAN : ${booking.customer_type === 'local' ? 'Lokal (Domestik)' : 'Mancanegara (Foreign)'}

DATA PEMESAN:
• Nama Lengkap   : ${booking.customer_name}
• Email Pemesan  : ${booking.customer_email}
• No. WhatsApp   : ${booking.customer_phone}
• Jumlah Peserta : ${booking.participant_count} Orang

DAFTAR PESERTA:
${booking.participants.map((p, i) => `${i + 1}. ${p.name} ${p.identity_number ? `(NIK: ${p.identity_number})` : ''}`).join('\n')}

RINCIAN BIAYA:
• Total Tagihan  : Rp ${booking.total_amount.toLocaleString('id-ID')}
• Minimal DP     : Rp ${booking.dp_amount.toLocaleString('id-ID')}
• Terbayar       : Rp ${booking.paid_amount.toLocaleString('id-ID')}
• Status Booking : ${booking.status.toUpperCase()}
• Waktu Booking  : ${booking.created_at}

Notifikasi resmi ke: ${officialEmail}
Mohon segera diperiksa dan disiapkan logistik, kuota SIMAKSI, dan pemandu.`);

  const emailUrl = `mailto:${officialEmail}?subject=${emailSubject}&body=${emailBody}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-20">
      {/* Back to Home / Packages */}
      <button
        id="back-from-booking-btn"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-navy-900 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Halaman Utama
      </button>

      {/* Main Card */}
      <div ref={ticketRef} id="printable-ticket" className="bg-white rounded-3xl border border-navy-100 shadow-md overflow-hidden">
        {/* Top Ribbon & Status Banner */}
        <div className="bg-[#0a1638] text-white p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-navy-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-400 font-mono tracking-widest uppercase font-bold">
                E-TIKET RESERVASI
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-mono font-black tracking-wider text-white mt-1">
              {booking.booking_code}
            </h1>
            <p className="text-xs text-blue-200 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Dibuat: {booking.created_at}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="booking-header-download-pdf-btn"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-[#0a1638] font-black text-xs shadow-sm transition border border-amber-500/30 disabled:opacity-50 cursor-pointer"
              title="Unduh E-Tiket & Faktur Invoice PDF Resmi"
            >
              {isGeneratingPDF ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#0a1638]" />
              ) : (
                <Download className="w-4 h-4 text-[#0a1638]" />
              )}
              <span>{isGeneratingPDF ? 'Menyiapkan...' : 'Download E-Ticket'}</span>
            </button>

            <div className={`px-4 py-2 rounded-2xl border ${currentStatusConfig.bgColor} ${currentStatusConfig.textColor} ${currentStatusConfig.borderColor} flex items-center gap-2 font-bold text-xs shadow-xs`}>
              <StatusIcon className="w-4 h-4 shrink-0" />
              <span>{currentStatusConfig.label}</span>
            </div>
          </div>
        </div>

        {/* Official Email Dispatch Status Banner */}
        <div className="bg-[#0f2252] border-b border-navy-800 px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-blue-100 gap-2">
          <div className="flex items-center gap-2.5">
            <span className="p-1 rounded-md bg-amber-400/20 text-amber-400 shrink-0">
              <Mail className="w-4 h-4" />
            </span>
            <div className="text-[11px] sm:text-xs">
              <span>Notifikasi Real-Time ke Gmail Pemesan: <strong className="text-amber-300 font-mono font-semibold">{booking.customer_email}</strong></span>
              <span className="block text-[10px] text-blue-300/80">Salinan otomatis diteruskan ke: {officialEmail}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowEmailReceiptModal(true)}
              className="text-[11px] font-bold text-amber-300 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition inline-flex items-center gap-1"
            >
              <FileText className="w-3 h-3 text-amber-300" />
              <span>Lihat Bukti Email</span>
            </button>
            <a
              href={emailUrl}
              className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline flex items-center gap-1 shrink-0 transition"
              title="Kirim ulang atau buka salinan data di email"
            >
              <Send className="w-3 h-3" />
              <span>Kirim Salinan</span>
            </a>
          </div>
        </div>

        {/* Real-time DP Confirmed Alert Banner */}
        {(booking.status === 'confirmed' || booking.paid_amount > 0) && (
          <div className="bg-emerald-950/80 border-b border-emerald-700/60 px-6 py-2.5 text-xs text-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>
                <strong className="text-emerald-300 font-bold">Notifikasi DP Berhasil Terkirim:</strong> Pembayaran DP Rp {booking.dp_amount.toLocaleString('id-ID')} telah dikonfirmasi dan notifikasi real-time terkirim ke Gmail ({booking.customer_email}).
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700">
              {booking.email_notified_at || booking.paid_at || booking.created_at}
            </span>
          </div>
        )}

        {/* Real-Time Payment Countdown Banner */}
        {booking.status === 'waiting_payment' && (
          <div className="bg-amber-500/10 border-y border-amber-300/60 p-4 px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500 text-navy-950 rounded-xl shadow-xs">
                <Timer className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                  Batas Waktu Pembayaran (Real-Time)
                </span>
                {!paymentCountdown.isExpired ? (
                  <p className="text-sm sm:text-base font-extrabold text-navy-950 font-mono">
                    Sisa Waktu: <span className="text-amber-700">{paymentCountdown.hours}:{paymentCountdown.minutes}:{paymentCountdown.seconds}</span>
                  </p>
                ) : (
                  <p className="text-xs font-bold text-rose-700">Waktu pembayaran reguler telah habis. Hubungi CS untuk perpanjangan kuota.</p>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsPaymentOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-[#0f2252] text-xs font-black px-4 py-2 rounded-xl transition shadow-xs self-stretch sm:self-auto"
            >
              Bayar Sekarang
            </button>
          </div>
        )}

        {/* Confirmed Banner with Realtime Departure Countdown */}
        {booking.status === 'confirmed' && (
          <div className="bg-navy-50/90 border-y border-navy-200 p-4 px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-navy-950">Reservasi Anda Telah Terkonfirmasi Resmi!</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {booking.paid_at && `Terverifikasi pada: ${booking.paid_at} • `}
                  Tunjukkan e-tiket saat registrasi ulang di Basecamp Camp David Papandayan.
                </p>
              </div>
            </div>
            
            {/* Realtime Countdown to Departure */}
            {booking.trip_schedule_date && (
              <div className="bg-white px-3.5 py-1.5 rounded-xl border border-navy-200 shadow-xs text-left sm:text-right self-stretch sm:self-auto">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                  Hitung Mundur Trip (Real-Time)
                </span>
                <span className="font-mono text-xs font-extrabold text-navy-950">
                  {departureCountdown.days > 0 && `${departureCountdown.days}h `}
                  {departureCountdown.hours}:{departureCountdown.minutes}:{departureCountdown.seconds}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Package Details */}
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Informasi Trip</h2>
            <div className="bg-navy-50/40 rounded-2xl p-5 border border-navy-100 space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                  <h3 className="text-lg font-extrabold text-navy-950">{booking.trip_package.name}</h3>
                  <p className="text-xs text-amber-600 font-bold mt-0.5">{booking.trip_package.duration_label}</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-white border border-navy-200 rounded-lg text-navy-900 self-start sm:self-auto">
                  {booking.customer_type === 'local' ? 'Wisatawan Lokal' : 'WNA (Foreign Tourist)'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-navy-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Jadwal: <strong className="text-navy-950">{booking.trip_schedule_date ? new Date(booking.trip_schedule_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Tanggal Belum Ditetapkan'}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Titik Kumpul: <strong className="text-navy-950">{booking.meeting_point}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Participants */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Kontak Pemesan & Keterangan</h2>
              <div className="bg-navy-50/40 rounded-2xl p-4 border border-navy-100 text-xs space-y-2 text-slate-700">
                <p><span className="text-slate-400">Nama Lengkap:</span> <strong className="text-navy-950">{booking.customer_name}</strong></p>
                <p>
                  <span className="text-slate-400">Email (Gmail):</span>{' '}
                  <span className="font-mono text-navy-900 bg-white px-2 py-0.5 rounded border border-navy-100 font-bold">
                    {booking.customer_email}
                  </span>
                </p>
                <p><span className="text-slate-400">WhatsApp:</span> <span className="font-mono font-bold text-navy-950">{booking.customer_phone}</span></p>
                {booking.customer_notes && (
                  <div className="pt-2 border-t border-navy-100/60 mt-1">
                    <span className="text-[10px] uppercase font-bold text-amber-800 block">Keterangan / Kondisi Riil Pengguna:</span>
                    <p className="text-[11px] text-slate-700 italic bg-white p-2 rounded-lg border border-navy-100/80 mt-1">
                      "{booking.customer_notes}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Daftar Peserta ({booking.participant_count} Orang)
              </h2>
              <div className="bg-navy-50/40 rounded-2xl p-4 border border-navy-100 text-xs space-y-2 text-slate-700">
                {booking.participants.map((p, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-navy-100/60 pb-1.5 last:border-0 last:pb-0">
                    <span className="font-medium text-navy-950">{idx + 1}. {p.name}</span>
                    {p.identity_number && (
                      <span className="text-[10px] text-slate-400 font-mono">NIK: {p.identity_number}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add-ons List */}
          {booking.addons.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Add-on Layanan Tambahan</h2>
              <div className="bg-navy-50/40 rounded-2xl p-4 border border-navy-100 divide-y divide-navy-100 text-xs">
                {booking.addons.map((a, idx) => (
                  <div key={idx} className="py-2 first:pt-0 last:pb-0 flex justify-between items-center">
                    <span className="text-navy-900 font-medium">{a.name}</span>
                    <span className="font-bold text-navy-950">Rp {a.price.toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Financial Breakdown */}
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Rincian Pembayaran</h2>
            <div className="bg-navy-50/40 rounded-2xl p-5 border border-navy-100 space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Biaya Paket ({booking.participant_count} orang × Rp {booking.tier_price_per_person.toLocaleString('id-ID')}):</span>
                <span className="font-semibold text-navy-950">Rp {(booking.participant_count * booking.tier_price_per_person).toLocaleString('id-ID')}</span>
              </div>
              {booking.addons.length > 0 && (
                <div className="flex justify-between">
                  <span>Total Add-on:</span>
                  <span className="font-semibold text-navy-950">
                    Rp {booking.addons.reduce((sum, a) => sum + a.price, 0).toLocaleString('id-ID')}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-navy-200 text-sm font-extrabold text-navy-950">
                <span>Total Tagihan:</span>
                <span className="text-navy-950 font-black">Rp {booking.total_amount.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between pt-1 text-xs">
                <span>Minimal DP yang harus dibayar:</span>
                <span className="font-bold text-amber-700">Rp {booking.dp_amount.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between pt-1 text-xs text-navy-950 font-bold bg-navy-100/70 p-2.5 rounded-xl border border-navy-200">
                <span>Sudah Terbayar:</span>
                <span className="text-amber-600">Rp {booking.paid_amount.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between pt-1 text-xs text-slate-700">
                <span>Sisa Tagihan yang Belum Dibayar:</span>
                <span className="font-bold text-navy-950">
                  Rp {Math.max(0, booking.total_amount - booking.paid_amount).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-4 border-t border-navy-100">
            {booking.status === 'waiting_payment' && (
              <button
                id="booking-pay-now-btn"
                onClick={() => setIsPaymentOpen(true)}
                className="flex-1 min-w-[200px] bg-amber-500 hover:bg-amber-400 text-[#0f2252] font-black py-3 px-4 rounded-xl shadow-md text-xs sm:text-sm flex items-center justify-center gap-2 transition"
              >
                <CreditCard className="w-4 h-4" /> BAYAR SEKARANG (QRIS / VA)
              </button>
            )}

            <button
              id="booking-download-pdf-btn"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="flex-1 min-w-[220px] bg-[#0a1638] hover:bg-[#112354] text-amber-400 font-extrabold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md border border-navy-800 disabled:opacity-50 cursor-pointer"
              title="Unduh berkas PDF E-Tiket & Faktur Invoice Resmi Pelanggan"
            >
              {isGeneratingPDF ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              ) : (
                <FileText className="w-4 h-4 text-amber-400" />
              )}
              <span>{isGeneratingPDF ? 'Membuat Dokumen PDF...' : 'Download E-Ticket'}</span>
            </button>

            <a
              id="booking-wa-cs-btn"
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md"
            >
              <Phone className="w-4 h-4" /> WhatsApp CS
            </a>

            <button
              id="booking-print-btn"
              onClick={handlePrint}
              className="py-3 px-4 border border-navy-200 hover:bg-navy-50 text-navy-900 font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 transition"
              title="Cetak langsung menggunakan printer"
            >
              <Printer className="w-4 h-4 text-amber-600" /> Cetak
            </button>

            <button
              id="booking-share-btn"
              onClick={handleCopyShare}
              className="py-3 px-4 border border-navy-200 hover:bg-navy-50 text-navy-900 font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 transition"
            >
              {copiedLink ? <Check className="w-4 h-4 text-amber-600" /> : <Share2 className="w-4 h-4 text-amber-600" />}
              <span>{copiedLink ? 'Tersalin' : 'Bagikan'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        booking={booking}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Email Dispatch Receipt Modal */}
      {showEmailReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowEmailReceiptModal(false)}
          />
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl z-10 border border-navy-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-navy-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-navy-950">Bukti Notifikasi Email Real-Time</h3>
                  <p className="text-[11px] text-slate-500">Konfirmasi status pemesanan & e-tiket langsung ke Gmail</p>
                </div>
              </div>
              <button
                onClick={() => setShowEmailReceiptModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-navy-950"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-navy-50/70 p-3.5 rounded-2xl border border-navy-100 space-y-1.5 font-mono">
                <p><span className="text-slate-500">Penerima (Gmail) :</span> <strong className="text-navy-950">{booking.customer_email}</strong></p>
                <p><span className="text-slate-500">Salinan Resmi     :</span> {officialEmail}</p>
                <p><span className="text-slate-500">Kode Booking      :</span> <strong className="text-amber-700">{booking.booking_code}</strong></p>
                <p><span className="text-slate-500">Status Pengiriman :</span> <span className="text-emerald-700 font-bold">✓ DELIVERED (Real-Time)</span></p>
                <p><span className="text-slate-500">Waktu Kirim       :</span> {booking.email_notified_at || booking.paid_at || booking.created_at}</p>
              </div>

              <div className="border border-navy-100 rounded-2xl p-4 bg-slate-50 text-slate-800 space-y-2">
                <div className="font-bold text-navy-950 border-b border-navy-100 pb-2">
                  Subject: [KONFIRMASI DP BERHASIL] E-Tiket & Bukti Transfer Trip Papandayan - {booking.booking_code}
                </div>
                <div className="text-[11px] space-y-1.5 text-slate-600 leading-relaxed">
                  <p>Halo <strong>{booking.customer_name}</strong>,</p>
                  <p>
                    Pembayaran uang muka (DP) sebesar <strong>Rp {booking.dp_amount.toLocaleString('id-ID')}</strong> untuk paket <strong>{booking.trip_package.name}</strong> telah berhasil diverifikasi secara real-time.
                  </p>
                  <p>
                    Jadwal Trip: <strong>{booking.trip_schedule_date || 'Sesuai Request'}</strong><br/>
                    Titik Kumpul: <strong>{booking.meeting_point}</strong><br/>
                    Total Peserta: <strong>{booking.participant_count} Orang</strong>
                  </p>
                  {booking.customer_notes && (
                    <p className="p-2 bg-white rounded-lg border border-slate-200">
                      <strong>Keterangan Khusus:</strong> {booking.customer_notes}
                    </p>
                  )}
                  <p className="text-slate-500 pt-1">
                    E-tiket barcode resmi Anda siap digunakan di pos registrasi Taman Wisata Alam Gunung Papandayan.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowEmailReceiptModal(false)}
                className="w-full bg-[#0a1638] hover:bg-[#162a65] text-amber-300 font-bold py-2.5 rounded-xl text-xs transition shadow-sm"
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
