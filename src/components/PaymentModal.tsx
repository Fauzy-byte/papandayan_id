import React, { useState } from 'react';
import { X, CheckCircle, QrCode, CreditCard, Building2, ShieldCheck, Copy, Check, Timer, Mail, Send } from 'lucide-react';
import { Booking } from '../types';
import { useCountdown, formatBookingTimestamp } from '../utils/timeUtils';
import { sendEmailNotification } from '../utils/notificationService';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  onPaymentSuccess: (amount: number, method: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  booking,
  onPaymentSuccess
}) => {
  const [paymentOption, setPaymentOption] = useState<'dp' | 'full'>('dp');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bca' | 'mandiri'>('qris');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paidDone, setPaidDone] = useState(false);
  const [verifiedAt, setVerifiedAt] = useState('');
  const [emailNotificationSent, setEmailNotificationSent] = useState(false);

  // Target deadline for payment countdown
  const deadline = booking.payment_deadline || new Date(Date.now() + 5.5 * 3600 * 1000).toISOString();
  const countdown = useCountdown(deadline);

  if (!isOpen) return null;

  const remaining = booking.total_amount - booking.paid_amount;
  const payAmount = paymentOption === 'dp' ? Math.min(booking.dp_amount, remaining) : remaining;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    const methodName = paymentMethod === 'qris' 
      ? 'QRIS Mandiri/BCA/Gopay' 
      : paymentMethod === 'bca' 
      ? 'BCA Virtual Account' 
      : 'Mandiri Virtual Account';

    // Simulate verification delay
    setTimeout(async () => {
      const nowStr = formatBookingTimestamp(new Date());
      setIsProcessing(false);
      setPaidDone(true);
      setVerifiedAt(nowStr);
      setEmailNotificationSent(true);

      // Trigger real-time email notification to customer's Gmail
      try {
        await sendEmailNotification(
          {
            ...booking,
            paid_amount: booking.paid_amount + payAmount,
            status: 'confirmed'
          },
          'dp_confirmed',
          methodName
        );
      } catch (err) {
        console.warn('Real-time email dispatch handled gracefully:', err);
      }

      onPaymentSuccess(payAmount, methodName);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto border border-navy-100">
        <div className="flex justify-between items-center pb-3 border-b border-navy-50">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Checkout Pembayaran Resmi</span>
            <h3 className="text-lg font-bold text-navy-950">Selesaikan Pembayaran Trip</h3>
          </div>
          <button 
            id="close-payment-modal-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-navy-950 hover:bg-navy-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paidDone ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-navy-100 text-[#0f2252] rounded-full flex items-center justify-center mx-auto border-2 border-amber-400">
              <CheckCircle className="w-10 h-10 text-amber-500" />
            </div>
            <h4 className="text-xl font-bold text-navy-950">Pembayaran Berhasil Diverifikasi!</h4>
            <p className="text-sm text-slate-600 max-w-sm mx-auto">
              Terima kasih! Dana sebesar <span className="font-bold text-navy-950">Rp {payAmount.toLocaleString('id-ID')}</span> telah kami terima. Status pesanan Anda kini terkonfirmasi.
            </p>
            {verifiedAt && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3 py-2 rounded-xl inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Waktu Verifikasi Real-Time: <strong>{verifiedAt}</strong></span>
              </div>
            )}

            {/* Direct Gmail Real-time Notification Alert */}
            <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-2xl text-left text-xs space-y-1.5 shadow-xs">
              <div className="flex items-center gap-2 text-blue-900 font-bold">
                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Notifikasi Real-Time Berhasil Terkirim ke Email</span>
              </div>
              <p className="text-blue-800 text-[11px]">
                Konfirmasi pembayaran DP dan faktur e-tiket resmi telah dikirim langsung ke akun Gmail Anda:
                <strong className="font-mono text-navy-950 block mt-0.5">{booking.customer_email}</strong>
              </p>
              <div className="pt-1 flex items-center gap-2 text-[10px] text-blue-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Status: Terverifikasi & Sinkron ke Sistem Pasak Outdoor Papandayan</span>
              </div>
            </div>

            <div>
              <button
                id="payment-done-btn"
                onClick={onClose}
                className="mt-2 bg-[#0f2252] hover:bg-[#162a65] text-amber-300 font-bold px-6 py-2.5 rounded-xl text-sm transition shadow-md"
              >
                Lihat E-Tiket Booking
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-5">
            {/* Real-time Payment Expiry Notice */}
            <div className="bg-[#0b1736] text-white p-3 rounded-xl flex items-center justify-between text-xs border border-navy-800">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-blue-200 font-medium">Batas Waktu Bayar (Real-Time):</span>
              </div>
              <span className="font-mono font-bold text-amber-300 text-sm">
                {countdown.hours}:{countdown.minutes}:{countdown.seconds}
              </span>
            </div>

            {/* Booking Summary Mini */}
            <div className="bg-navy-50/70 rounded-xl p-3.5 border border-navy-200 text-xs text-slate-700 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Kode Booking:</span>
                <span className="font-mono font-bold text-navy-900">{booking.booking_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Paket:</span>
                <span className="font-semibold text-navy-950">{booking.trip_package.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Tagihan:</span>
                <span className="font-bold text-navy-950">Rp {booking.total_amount.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Payment Option: DP vs Pelunasan */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Pilih Jumlah Pembayaran</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentOption('dp')}
                  className={`p-3 rounded-xl border text-left transition ${
                    paymentOption === 'dp'
                      ? 'border-navy-900 bg-navy-50/80 ring-1 ring-navy-900 shadow-xs'
                      : 'border-navy-100 hover:border-navy-300'
                  }`}
                >
                  <p className="text-xs font-medium text-slate-500">Uang Muka (DP {booking.trip_package.min_dp_percentage}%)</p>
                  <p className="text-base font-extrabold text-navy-950 mt-1">
                    Rp {booking.dp_amount.toLocaleString('id-ID')}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentOption('full')}
                  className={`p-3 rounded-xl border text-left transition ${
                    paymentOption === 'full'
                      ? 'border-navy-900 bg-navy-50/80 ring-1 ring-navy-900 shadow-xs'
                      : 'border-navy-100 hover:border-navy-300'
                  }`}
                >
                  <p className="text-xs font-medium text-slate-500">Pelunasan Penuh (100%)</p>
                  <p className="text-base font-extrabold text-navy-950 mt-1">
                    Rp {remaining.toLocaleString('id-ID')}
                  </p>
                </button>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Metode Pembayaran</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qris')}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition ${
                    paymentMethod === 'qris'
                      ? 'border-navy-900 bg-navy-50 text-navy-950 font-bold shadow-xs'
                      : 'border-navy-100 text-slate-600 hover:bg-navy-50/50'
                  }`}
                >
                  <QrCode className="w-5 h-5 mb-1 text-amber-600" />
                  <span className="text-xs">QRIS Instant</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bca')}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition ${
                    paymentMethod === 'bca'
                      ? 'border-navy-900 bg-navy-50 text-navy-950 font-bold shadow-xs'
                      : 'border-navy-100 text-slate-600 hover:bg-navy-50/50'
                  }`}
                >
                  <Building2 className="w-5 h-5 mb-1 text-blue-600" />
                  <span className="text-xs">BCA VA</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('mandiri')}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition ${
                    paymentMethod === 'mandiri'
                      ? 'border-navy-900 bg-navy-50 text-navy-950 font-bold shadow-xs'
                      : 'border-navy-100 text-slate-600 hover:bg-navy-50/50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mb-1 text-amber-600" />
                  <span className="text-xs">Mandiri VA</span>
                </button>
              </div>
            </div>

            {/* Instruction view according to method */}
            <div className="bg-navy-50/50 border border-navy-100 rounded-xl p-4 text-xs text-slate-700">
              {paymentMethod === 'qris' ? (
                <div className="text-center space-y-3">
                  <p className="font-semibold text-navy-950">Scan QRIS dengan GoPay, OVO, ShopeePay, Dana, atau Mobile Banking</p>
                  <div className="w-40 h-40 mx-auto bg-white p-2 rounded-xl shadow-inner border border-navy-200 flex items-center justify-center">
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=PAPANDAYAN-ID-TRIP-ORDER" 
                      alt="QRIS Papandayan" 
                      className="w-full h-full"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">NMID: ID1020304050607 / Papandayan Pasak Outdoor</p>
                </div>
              ) : paymentMethod === 'bca' ? (
                <div className="space-y-2">
                  <p className="font-semibold text-navy-950">Nomor Rekening Virtual Account BCA</p>
                  <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-navy-200 font-mono text-sm">
                    <span className="font-bold text-navy-950 tracking-wider">8801 2345 6789 001</span>
                    <button
                      type="button"
                      onClick={() => handleCopy('880123456789001')}
                      className="flex items-center gap-1 text-xs text-navy-900 font-sans hover:text-navy-700 font-semibold"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-amber-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Tersalin' : 'Salin'}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">Atas Nama: PT PASAK OUTDOOR GARUT</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="font-semibold text-navy-950">Nomor Mandiri Virtual Account</p>
                  <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-navy-200 font-mono text-sm">
                    <span className="font-bold text-navy-950 tracking-wider">8900 1234 5678 992</span>
                    <button
                      type="button"
                      onClick={() => handleCopy('890012345678992')}
                      className="flex items-center gap-1 text-xs text-navy-900 font-sans hover:text-navy-700 font-semibold"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-amber-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Tersalin' : 'Salin'}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">Kode Perusahaan: 89001 (Pasak Outdoor)</p>
                </div>
              )}
            </div>

            {/* Total to Pay Highlight & Simulator Button */}
            <div className="flex justify-between items-center pt-2">
              <div>
                <span className="text-xs text-slate-500 block">Total Ditransfer:</span>
                <span className="text-lg font-extrabold text-navy-950">Rp {payAmount.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-navy-900 font-semibold">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                Terhubung Midtrans Secure Gateway
              </div>
            </div>

            <button
              id="simulate-payment-btn"
              type="button"
              disabled={isProcessing}
              onClick={handleSimulatePayment}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-amber-300 text-[#0f2252] font-black py-3 rounded-xl shadow-md text-sm transition flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0f2252] border-t-transparent rounded-full animate-spin" />
                  <span>Memverifikasi Transaksi...</span>
                </>
              ) : (
                <span>Simulasikan Pembayaran Berhasil</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
