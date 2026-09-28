import React, { useState, useMemo } from 'react';
import { TripPackage, Booking, Participant, BookingAddonItem } from '../types';
import { ArrowLeft, Users, Plus, Trash2, Calendar, MapPin, CheckCircle2, ShieldAlert, Clock, Sparkles, Mail, AlertTriangle, FileText } from 'lucide-react';
import { useRealtimeClock, formatBookingTimestamp } from '../utils/timeUtils';
import { sendEmailNotification } from '../utils/notificationService';
import { TripCalendarPicker } from '../components/TripCalendarPicker';

interface BookingCreateViewProps {
  packageData: TripPackage;
  onBack: () => void;
  onSubmitBooking: (booking: Booking) => void;
}

export const BookingCreateView: React.FC<BookingCreateViewProps> = ({
  packageData,
  onBack,
  onSubmitBooking
}) => {
  const clock = useRealtimeClock();

  // Form state
  const [selectedScheduleId, setSelectedScheduleId] = useState<number>(
    packageData.type === 'scheduled' && packageData.schedules.length > 0
      ? packageData.schedules.find(s => s.kuota_tersedia > 0)?.id || packageData.schedules[0].id
      : 0
  );
  const [customDate, setCustomDate] = useState<string>('2026-10-01');
  const [meetingPoint, setMeetingPoint] = useState<string>('GN_PAPANDAYAN');
  const [customerType, setCustomerType] = useState<'local' | 'foreign'>('local');

  // Customer Contact
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerNotes, setCustomerNotes] = useState<string>('Kondisi fisik prima, siap mengikuti SOP pendakian Papandayan.');

  // Participants
  const [participants, setParticipants] = useState<Participant[]>([
    { name: '', identity_number: '' }
  ]);

  // Selected Addons
  const [selectedAddonIds, setSelectedAddonIds] = useState<number[]>([]);

  // Validation errors
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Handlers for dynamic participants
  const handleAddParticipant = () => {
    setParticipants([...participants, { name: '', identity_number: '' }]);
  };

  const handleRemoveParticipant = (index: number) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((_, i) => i !== index));
    }
  };

  const handleParticipantChange = (index: number, field: keyof Participant, value: string) => {
    const updated = [...participants];
    updated[index][field] = value;
    setParticipants(updated);
  };

  // Toggle addon
  const handleToggleAddon = (id: number) => {
    if (selectedAddonIds.includes(id)) {
      setSelectedAddonIds(selectedAddonIds.filter(item => item !== id));
    } else {
      setSelectedAddonIds([...selectedAddonIds, id]);
    }
  };

  // Live Price Calculation based on Price Tiers
  const { tierPricePerPerson, totalAddonsPrice, totalAmount, dpAmount } = useMemo(() => {
    const count = participants.length;

    // Find matching tier
    const matchingTiers = packageData.priceTiers.filter(
      t => t.meeting_point === meetingPoint && t.customer_type === customerType
    );

    let pricePerPerson = 0;
    if (matchingTiers.length > 0) {
      // Find tier that matches count
      const matched = matchingTiers.find(t => {
        const min = t.min_participants;
        const max = t.max_participants;
        if (max === null) {
          return count >= min;
        }
        return count >= min && count <= max;
      });

      if (matched) {
        pricePerPerson = matched.price_per_person;
      } else {
        // Default to first or lowest
        pricePerPerson = matchingTiers[0].price_per_person;
      }
    } else {
      // Fallback
      pricePerPerson = packageData.priceTiers[0]?.price_per_person || 350000;
    }

    const baseTicketTotal = pricePerPerson * count;

    // Addons
    const addonsTotal = selectedAddonIds.reduce((sum, id) => {
      const addon = packageData.addons.find(a => a.id === id);
      return sum + (addon ? addon.price : 0);
    }, 0);

    const grandTotal = baseTicketTotal + addonsTotal;
    const dp = Math.round((grandTotal * packageData.min_dp_percentage) / 100);

    return {
      tierPricePerPerson: pricePerPerson,
      totalAddonsPrice: addonsTotal,
      totalAmount: grandTotal,
      dpAmount: dp
    };
  }, [participants.length, meetingPoint, customerType, selectedAddonIds, packageData]);

  // Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanName = customerName.trim();
    if (!cleanName || cleanName.length < 3) {
      setErrorMsg('Nama lengkap penanggung jawab wajib diisi sesuai data identitas asli / KTP (minimal 3 karakter).');
      const el = document.getElementById('input-customer-name');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el?.focus();
      return;
    }

    const cleanEmail = customerEmail.trim().toLowerCase();
    const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    if (!cleanEmail) {
      setErrorMsg('Alamat email penanggung jawab wajib diisi.');
      const el = document.getElementById('input-customer-email');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el?.focus();
      return;
    }
    if (!gmailPattern.test(cleanEmail)) {
      setErrorMsg('Alamat email wajib berformat Gmail resmi (@gmail.com), contoh: nama@gmail.com. Notifikasi real-time & e-tiket akan dikirimkan langsung ke Gmail ini.');
      const el = document.getElementById('input-customer-email');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el?.focus();
      return;
    }

    const digitsOnly = customerPhone.replace(/\D/g, '');
    if (!customerPhone.trim()) {
      setErrorMsg('Nomor WhatsApp penanggung jawab wajib diisi.');
      const el = document.getElementById('input-customer-phone');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el?.focus();
      return;
    }
    if (digitsOnly.length < 12) {
      setErrorMsg(`Nomor WhatsApp harus terdiri minimal 12 nomor (saat ini ${digitsOnly.length} digit). Harap isi nomor WhatsApp aktif minimal 12 digit, contoh: 081234567890 atau 6281234567890.`);
      const el = document.getElementById('input-customer-phone');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el?.focus();
      return;
    }

    const cleanNotes = customerNotes.trim();
    if (!cleanNotes || cleanNotes.length < 3) {
      setErrorMsg('Keterangan / catatan kondisi real pendaki wajib diisi (minimal 3 karakter, contoh: Kondisi fisik prima, siap mendaki).');
      const el = document.getElementById('input-customer-notes');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el?.focus();
      return;
    }

    for (let i = 0; i < participants.length; i++) {
      if (!participants[i].name.trim() || participants[i].name.trim().length < 3) {
        setErrorMsg(`Nama peserta nomor ${i + 1} belum valid sesuai data riil (minimal 3 karakter).`);
        return;
      }
    }

    const selectedSchedule = packageData.schedules.find(s => s.id === selectedScheduleId);

    // Validation for schedules & quotas
    if (packageData.type === 'scheduled') {
      if (!selectedSchedule) {
        setErrorMsg('Silakan pilih salah satu tanggal jadwal keberangkatan yang tersedia pada kalender.');
        return;
      }
      if (selectedSchedule.kuota_tersedia <= 0) {
        setErrorMsg('Slot kuota pada jadwal yang dipilih sudah penuh. Silakan pilih tanggal lain yang bertanda hijau pada kalender.');
        return;
      }
      if (participants.length > selectedSchedule.kuota_tersedia) {
        setErrorMsg(`Jumlah peserta rombongan (${participants.length} orang) melebihi sisa kuota yang tersedia (${selectedSchedule.kuota_tersedia} slot). Harap kurangi peserta atau pilih tanggal dengan kuota mencukupi.`);
        return;
      }
    } else {
      if (!customDate) {
        setErrorMsg('Silakan pilih tanggal keberangkatan private trip pada kalender.');
        return;
      }
    }

    const scheduleDate = packageData.type === 'scheduled' 
      ? selectedSchedule?.trip_date 
      : customDate;

    // Build chosen addons
    const chosenAddons: BookingAddonItem[] = selectedAddonIds.map(id => {
      const a = packageData.addons.find(item => item.id === id)!;
      return { addon_id: a.id, name: a.name, price: a.price };
    });

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = `PAP-${new Date().getFullYear()}-${randomSuffix}`;
    const now = new Date();
    const deadline = new Date(now.getTime() + 6 * 3600 * 1000); // 6 hours payment limit

    const newBooking: Booking = {
      id: Date.now(),
      booking_code: bookingCode,
      trip_package_id: packageData.id,
      trip_package: packageData,
      trip_schedule_id: selectedSchedule?.id,
      trip_schedule_date: scheduleDate,
      meeting_point: meetingPoint,
      customer_type: customerType,
      customer_name: cleanName,
      customer_email: cleanEmail,
      customer_phone: customerPhone.trim(),
      customer_notes: cleanNotes,
      participant_count: participants.length,
      participants: [...participants],
      addons: chosenAddons,
      tier_price_per_person: tierPricePerPerson,
      total_amount: totalAmount,
      dp_amount: dpAmount,
      paid_amount: 0,
      status: 'waiting_payment',
      created_at: formatBookingTimestamp(now),
      payment_deadline: deadline.toISOString(),
      email_notification_status: 'pending'
    };

    // Trigger initial real-time booking email notification
    sendEmailNotification(newBooking, 'booking_created').catch(err => {
      console.warn('Initial booking email dispatch warning:', err);
    });

    onSubmitBooking(newBooking);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-16">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-800 hover:text-navy-950 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Paket Trip
      </button>

      {/* Real-time Status Card & Header */}
      <div className="bg-white p-6 rounded-2xl border border-navy-100 shadow-xs mb-8">
        {/* Realtime Server Time Bar */}
        <div className="mb-4 bg-[#0a183d] text-white p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border border-navy-700/60 shadow-inner">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div>
              <span className="text-[10px] text-blue-200 block uppercase font-bold tracking-wider">
                Waktu Sistem Pemesanan Real-Time
              </span>
              <span className="font-mono text-sm sm:text-base font-extrabold text-amber-300">
                {clock.formatted}
              </span>
            </div>
          </div>
          <div className="text-left sm:text-right text-[11px] text-blue-200/90 border-t sm:border-t-0 pt-1 sm:pt-0 border-blue-900/40">
            <span className="font-semibold text-white">Batas Bayar 6 Jam</span>
            <p className="text-[10px] text-blue-300/70">Slot dikunci otomatis setelah booking dibuat</p>
          </div>
        </div>

        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Formulir Pemesanan Resmi</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 mt-1">
          Pesan: {packageData.name}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Lengkapi data perjalanan dan identitas rombongan Anda di bawah ini. Waktu pemesanan dan verifikasi kuota dicatat secara real-time.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: JADWAL & MEETING POINT */}
        <div className="bg-white p-6 rounded-2xl border border-navy-100 shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wider border-b border-navy-50 pb-3">
            1. Jadwal & Titik Kumpul
          </h2>

          {/* Kalender Interaktif Pemilihan Tanggal & Ketersediaan Kuota */}
          <div>
            <TripCalendarPicker
              packageType={packageData.type}
              schedules={packageData.schedules}
              selectedScheduleId={selectedScheduleId}
              onSelectSchedule={(id) => setSelectedScheduleId(id)}
              customDate={customDate}
              onSelectCustomDate={(dateStr) => setCustomDate(dateStr)}
              participantCount={participants.length}
            />
          </div>

          {/* Meeting Point & Tourist Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Titik Kumpul (Meeting Point)
              </label>
              <select
                value={meetingPoint}
                onChange={(e) => setMeetingPoint(e.target.value)}
                className="w-full rounded-xl border border-navy-200 p-2.5 text-xs focus:ring-2 focus:ring-navy-900"
              >
                <option value="GN_PAPANDAYAN">Basecamp Gunung Papandayan (Camp David)</option>
                <option value="GARUT">Kota Garut (Stasiun / Terminal)</option>
                <option value="BANDUNG">Kota Bandung (Stasiun / Terminal)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategori Wisatawan
              </label>
              <select
                value={customerType}
                onChange={(e) => setCustomerType(e.target.value as any)}
                className="w-full rounded-xl border border-navy-200 p-2.5 text-xs focus:ring-2 focus:ring-navy-900"
              >
                <option value="local">Wisatawan Nusantara (Lokal / KTP)</option>
                <option value="foreign">WNA / Foreign Tourist (Paspor)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: DATA PEMESAN */}
        <div className="bg-white p-6 rounded-2xl border border-navy-100 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-navy-50 pb-3 gap-2">
            <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wider">
              2. Data Pemesan & Keterangan Riil Pengguna
            </h2>
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 w-fit">
              <CheckCircle2 className="w-3 h-3 text-amber-600" />
              Wajib Data Riil & Akun Gmail
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-700">Nama Lengkap Pemesan</label>
                <span className="text-[10px] text-slate-400 font-medium">Sesuai KTP/Paspor</span>
              </div>
              <input
                id="input-customer-name"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Contoh: Budi Pratama"
                required
                className={`w-full rounded-xl border p-2.5 text-xs focus:ring-2 focus:ring-navy-900 transition ${
                  customerName.trim().length > 0 && customerName.trim().length < 3
                    ? 'border-red-300 bg-red-50/30'
                    : 'border-navy-200'
                }`}
              />
              <p className="text-[10px] text-slate-500 mt-1">Nama riil penanggung jawab rombongan.</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-700">Email Pemesan (Wajib Gmail)</label>
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.2 rounded">@gmail.com</span>
              </div>
              <input
                id="input-customer-email"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="nama.anda@gmail.com"
                required
                className={`w-full rounded-xl border p-2.5 text-xs focus:ring-2 focus:ring-navy-900 transition ${
                  customerEmail && !/^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(customerEmail.trim())
                    ? 'border-red-400 bg-red-50/40 text-red-900'
                    : customerEmail && /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(customerEmail.trim())
                    ? 'border-emerald-400 bg-emerald-50/30'
                    : 'border-navy-200'
                }`}
              />
              <p className="text-[10px] text-slate-500 mt-1">
                {customerEmail && !/^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(customerEmail.trim()) ? (
                  <span className="text-red-600 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Wajib format @gmail.com aktif
                  </span>
                ) : (
                  'E-tiket & notifikasi transfer DP dikirimkan ke Gmail ini.'
                )}
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-700">No. WhatsApp Aktif</label>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                  customerPhone.replace(/\D/g, '').length >= 12 
                    ? 'text-emerald-700 bg-emerald-100' 
                    : 'text-amber-700 bg-amber-100'
                }`}>
                  {customerPhone.replace(/\D/g, '').length}/12 digit min
                </span>
              </div>
              <input
                id="input-customer-phone"
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="081234567890 (min 12 digit)"
                required
                className={`w-full rounded-xl border p-2.5 text-xs focus:ring-2 focus:ring-navy-900 transition ${
                  customerPhone.replace(/\D/g, '').length > 0 && customerPhone.replace(/\D/g, '').length < 12
                    ? 'border-red-400 bg-red-50/40'
                    : customerPhone.replace(/\D/g, '').length >= 12
                    ? 'border-emerald-400 bg-emerald-50/30'
                    : 'border-navy-200'
                }`}
              />
              <p className="text-[10px] text-slate-500 mt-1">
                {customerPhone.replace(/\D/g, '').length > 0 && customerPhone.replace(/\D/g, '').length < 12 ? (
                  <span className="text-red-600 font-semibold">
                    Kurang {12 - customerPhone.replace(/\D/g, '').length} digit lagi (wajib minimal 12 digit).
                  </span>
                ) : (
                  'Wajib minimal 12 digit angka untuk briefing & koordinasi pos.'
                )}
              </p>
            </div>
          </div>

          {/* Keterangan Tambahan & Catatan Real Pengguna */}
          <div className="pt-2 border-t border-navy-50">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Keterangan & Catatan Khusus Pendakian (Data Riil Pengguna)
              </label>
              <span className="text-[10px] text-amber-700 font-medium">Wajib diisi data riil</span>
            </div>
            <textarea
              id="input-customer-notes"
              rows={2}
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              placeholder="Contoh: Kondisi fisik seluruh rombongan sehat prima, tidak memiliki riwayat asma/jantung, atau catatan permintaan tenda terpisah..."
              required
              className="w-full rounded-xl border border-navy-200 p-2.5 text-xs focus:ring-2 focus:ring-navy-900"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Digunakan oleh tim ranger & medis Papandayan untuk verifikasi keselamatan dan kelayakan fisik SIMAKSI.
            </p>
          </div>
        </div>

        {/* SECTION 3: DATA PESERTA */}
        <div className="bg-white p-6 rounded-2xl border border-navy-100 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-navy-50 pb-3">
            <div>
              <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wider">
                3. Data Seluruh Peserta ({participants.length} Orang)
              </h2>
              <p className="text-[11px] text-slate-500">Data nama dibutuhkan untuk penerbitan asuransi resmi BKSDA.</p>
            </div>
            <button
              id="add-participant-btn"
              type="button"
              onClick={handleAddParticipant}
              className="inline-flex items-center gap-1 text-xs font-bold text-navy-900 bg-navy-50 hover:bg-navy-100 border border-navy-200/60 px-3 py-1.5 rounded-lg transition"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Peserta
            </button>
          </div>

          <div className="space-y-3">
            {participants.map((p, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-6 text-center text-xs font-bold text-slate-400">{idx + 1}.</span>
                <input
                  type="text"
                  placeholder={`Nama Lengkap Peserta #${idx + 1}`}
                  value={p.name}
                  onChange={(e) => handleParticipantChange(idx, 'name', e.target.value)}
                  required
                  className="flex-1 rounded-xl border border-navy-200 p-2.5 text-xs focus:ring-2 focus:ring-navy-900"
                />
                <input
                  type="text"
                  placeholder="NIK / No. KTP (opsional)"
                  value={p.identity_number || ''}
                  onChange={(e) => handleParticipantChange(idx, 'identity_number', e.target.value)}
                  className="w-40 sm:w-48 rounded-xl border border-navy-200 p-2.5 text-xs focus:ring-2 focus:ring-navy-900 hidden sm:block"
                />
                {participants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveParticipant(idx)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                    title="Hapus peserta"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="pt-2 text-[11px] text-navy-900 bg-navy-50/70 border border-navy-100 p-2.5 rounded-xl flex items-center justify-between">
            <span>Harga otomatis menyesuaikan tier rombongan: <strong>Rp {tierPricePerPerson.toLocaleString('id-ID')}</strong> / orang</span>
            <span className="font-bold text-navy-950">{participants.length} Peserta</span>
          </div>
        </div>

        {/* SECTION 4: ADD-ON (OPSIONAL) */}
        {packageData.addons.length > 0 && (
          <div className="bg-white p-6 rounded-2xl border border-navy-100 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wider border-b border-navy-50 pb-3">
              4. Layanan Tambahan (Add-on Opsional)
            </h2>

            <div className="space-y-2.5">
              {packageData.addons.map((addon) => {
                const isChecked = selectedAddonIds.includes(addon.id);
                return (
                  <label
                    key={addon.id}
                    className={`flex items-start justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                      isChecked
                        ? 'border-navy-900 bg-navy-50/60 shadow-xs'
                        : 'border-navy-100 hover:border-navy-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleAddon(addon.id)}
                        className="mt-0.5 rounded text-navy-900 focus:ring-navy-900"
                      />
                      <div>
                        <p className="text-xs font-bold text-navy-950">{addon.name}</p>
                        {addon.description && (
                          <p className="text-[11px] text-slate-500 mt-0.5">{addon.description}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-navy-900">
                      +Rp {addon.price.toLocaleString('id-ID')}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 5: RINGKASAN BIAYA & SUBMIT */}
        <div className="bg-gradient-to-r from-[#0a1638] via-[#0f2252] to-[#162a65] border-2 border-amber-500 text-white p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-base font-bold border-b border-white/20 pb-3">Ringkasan Estimasi Biaya</h3>

          <div className="space-y-2 text-xs text-blue-100">
            <div className="flex justify-between">
              <span>Paket Trip ({participants.length} orang × Rp {tierPricePerPerson.toLocaleString('id-ID')}):</span>
              <span className="font-semibold text-white">Rp {(tierPricePerPerson * participants.length).toLocaleString('id-ID')}</span>
            </div>
            {totalAddonsPrice > 0 && (
              <div className="flex justify-between">
                <span>Total Add-on Terpilih:</span>
                <span className="font-semibold text-white">Rp {totalAddonsPrice.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-white/20 text-sm font-bold text-white">
              <span>Total Biaya Keseluruhan:</span>
              <span className="text-base font-extrabold text-amber-300">Rp {totalAmount.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-xs text-blue-200 font-semibold bg-[#0a1638]/70 border border-white/10 p-3 rounded-xl">
              <span>Uang Muka Minimal (DP {packageData.min_dp_percentage}%):</span>
              <span className="text-sm font-extrabold text-amber-300">Rp {dpAmount.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-600/90 border border-red-300 text-white text-xs flex items-center gap-2 shadow-sm animate-pulse">
              <ShieldAlert className="w-4 h-4 text-amber-300 shrink-0" />
              <div className="flex-1">
                <strong className="block font-bold">Data Belum Lengkap:</strong>
                <span>{errorMsg}</span>
              </div>
            </div>
          )}

          <button
            id="submit-booking-btn"
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-[#0f2252] font-black py-3.5 rounded-xl shadow-lg transition transform hover:-translate-y-0.5 text-sm uppercase tracking-wider cursor-pointer"
          >
            Lanjut ke Konfirmasi & Pembayaran →
          </button>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-[11px] text-blue-200/80 pt-1 text-center">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Notifikasi real-time ke Gmail Anda & Pasak Outdoor (<strong className="text-amber-300 font-mono">papadayanindonesia@my67.cloud</strong>)</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
