import React from 'react';
import { TripPackage } from '../types';
import { 
  Clock, 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Check, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight,
  Sparkles,
  Plus
} from 'lucide-react';

interface TripPackageDetailViewProps {
  packageData: TripPackage;
  onBack: () => void;
  onBook: (slug: string) => void;
}

export const TripPackageDetailView: React.FC<TripPackageDetailViewProps> = ({
  packageData,
  onBack,
  onBook
}) => {
  // Group tiers by meeting point
  const tiersByMeetingPoint = packageData.priceTiers.reduce((acc, tier) => {
    if (!acc[tier.meeting_point]) {
      acc[tier.meeting_point] = [];
    }
    acc[tier.meeting_point].push(tier);
    return acc;
  }, {} as Record<string, typeof packageData.priceTiers>);

  const meetingPointNames: Record<string, string> = {
    GN_PAPANDAYAN: 'Basecamp Gunung Papandayan (Camp David)',
    GARUT: 'Kota Garut (Stasiun / Terminal Garut)',
    BANDUNG: 'Kota Bandung (Stasiun Bandung / Terminal Leuwi Panjang)'
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-28">
      {/* Back button */}
      <button
        id="back-to-packages-btn"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-800 hover:text-navy-950 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Semua Paket
      </button>

      {/* Hero Banner */}
      <div className="relative h-64 sm:h-80 rounded-3xl overflow-hidden shadow-md bg-navy-950 mb-6 border border-navy-900">
        <img
          src={
            packageData.slug === 'exploring-one-day-papandayan' ? '/oneday.jpg' :
            packageData.slug === 'sunrise-trip-moment' ? '/sunrise.jpg' :
            packageData.slug === 'camping-ghober-hut-2d1n' ? '/privatecamp.JPG' :
            packageData.slug === 'vip-glamping-pondok-saladah' ? '/vipcamp.jpg' :
            packageData.hero_image
          }
          alt={packageData.name}
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            if (packageData.slug === 'exploring-one-day-papandayan') {
              if (!target.src.endsWith('/oneday.JPG')) {
                target.src = '/oneday.JPG';
              } else {
                target.src = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80';
              }
            } else if (packageData.slug === 'sunrise-trip-moment') {
              if (!target.src.endsWith('/sunrise.JPG')) {
                target.src = '/sunrise.JPG';
              } else {
                target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';
              }
            } else if (packageData.slug === 'camping-ghober-hut-2d1n') {
              if (!target.src.endsWith('/privatecamp.jpg')) {
                target.src = '/privatecamp.jpg';
              } else {
                target.src = 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80';
              }
            } else if (packageData.slug === 'vip-glamping-pondok-saladah') {
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1638]/90 via-[#0f2252]/40 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <span className="bg-[#0f2252] text-amber-300 border border-amber-400/40 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow inline-block mb-2">
            {packageData.category === 'camping' ? 'Camping Adventure' : 'Mountain Trekking'}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow">
            {packageData.name}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" /> Durasi: {packageData.duration_label}
          </p>
        </div>
      </div>

      {/* Short Description */}
      <div className="bg-white p-6 rounded-2xl border border-navy-100 shadow-xs mb-8">
        <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wider mb-2">Tentang Paket Trip</h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          {packageData.short_description}
        </p>
      </div>

      {/* PRICELIST MATRIX BY MEETING POINT */}
      <section className="bg-white p-6 rounded-2xl border border-navy-100 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div>
            <h2 className="text-lg font-bold text-navy-950">Daftar Harga Resmi</h2>
            <p className="text-xs text-slate-500">Harga per orang, transparan tanpa biaya tersembunyi.</p>
          </div>
          <span className="mt-2 sm:mt-0 text-xs font-semibold text-navy-900 bg-navy-50 border border-navy-200 px-3 py-1 rounded-full">
            DP Minimal {packageData.min_dp_percentage}%
          </span>
        </div>

        <div className="space-y-6">
          {Object.entries(tiersByMeetingPoint).map(([mpCode, tiers]) => (
            <div key={mpCode} className="border border-navy-100 rounded-xl overflow-hidden">
              <div className="bg-navy-50 px-4 py-2.5 text-xs font-bold text-navy-950 flex items-center justify-between border-b border-navy-100">
                <span>Meeting Point: {meetingPointNames[mpCode] || mpCode}</span>
                <span className="font-mono text-[11px] text-slate-500">KODE: {mpCode}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-navy-100 font-semibold">
                    <tr>
                      <th className="px-4 py-2.5">Jumlah Peserta</th>
                      <th className="px-4 py-2.5">Kategori Turis</th>
                      <th className="px-4 py-2.5 text-right">Harga / Orang</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-50">
                    {tiers.map((tier) => (
                      <tr key={tier.id} className="hover:bg-navy-50/60 transition">
                        <td className="px-4 py-2.5 font-medium text-navy-950">
                          {tier.min_participants} {tier.max_participants ? `- ${tier.max_participants} orang` : 'orang atau lebih'}
                        </td>
                        <td className="px-4 py-2.5 text-slate-600">
                          {tier.customer_type === 'local' ? 'Wisatawan Nusantara (Lokal)' : 'WNA (Foreign Tourist)'}
                        </td>
                        <td className="px-4 py-2.5 text-right font-extrabold text-navy-900 text-sm">
                          Rp {tier.price_per_person.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Add-ons */}
        {packageData.addons.length > 0 && (
          <div className="mt-6 pt-6 border-t border-navy-100">
            <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wider mb-3">Layanan Tambahan (Add-on Opsional)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {packageData.addons.map((addon) => (
                <div key={addon.id} className="flex justify-between items-center p-3 rounded-xl border border-navy-100 bg-navy-50/50">
                  <div>
                    <span className="text-xs font-bold text-navy-950 block">{addon.name}</span>
                    {addon.description && (
                      <span className="text-[11px] text-slate-500 block mt-0.5">{addon.description}</span>
                    )}
                  </div>
                  <span className="text-xs font-extrabold text-navy-900 whitespace-nowrap ml-3">
                    +Rp {addon.price.toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* FASILITAS & DESTINASI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Fasilitas */}
        <div className="bg-white p-6 rounded-2xl border border-navy-100 shadow-xs">
          <h2 className="text-base font-bold text-navy-950 mb-4 flex items-center gap-2">
            <Check className="w-5 h-5 text-amber-500" /> Fasilitas Termasuk
          </h2>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
            {packageData.facilities.map((fac, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-navy-100 text-navy-900 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span>{fac}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Destinasi */}
        <div className="bg-white p-6 rounded-2xl border border-navy-100 shadow-xs">
          <h2 className="text-base font-bold text-navy-950 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-500" /> Destinasi Eksplorasi
          </h2>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
            {packageData.destinations.map((dest, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-navy-100 text-navy-900 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-2.5 h-2.5" />
                </div>
                <span>{dest}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ITINERARY */}
      <section className="bg-white p-6 rounded-2xl border border-navy-100 shadow-xs mb-8">
        <h2 className="text-base font-bold text-navy-950 mb-1">Itinerary / Susunan Jadwal Trip</h2>
        <p className="text-xs text-slate-500 mb-6">* Waktu kegiatan dapat disesuaikan dengan kondisi fisik rombongan dan cuaca di lapangan.</p>

        <div className="relative border-l-2 border-navy-300 ml-3 space-y-6">
          {packageData.itinerary.map((step, idx) => (
            <div key={idx} className="relative pl-6">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#0f2252] border-2 border-white shadow" />
              <time className="text-xs font-bold text-navy-900 block tracking-wide">{step.time}</time>
              <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">{step.activity}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PERALATAN & SYARAT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-navy-100 shadow-xs">
          <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wider mb-3">Peralatan Wajib Bawa</h2>
          <ul className="space-y-2 text-xs text-slate-700 list-disc list-inside">
            {packageData.required_gear.map((gear, idx) => (
              <li key={idx}>{gear}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-navy-100 shadow-xs">
          <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wider mb-3">Syarat & Ketentuan</h2>
          <ul className="space-y-2 text-xs text-slate-700 list-disc list-inside">
            {packageData.terms.map((term, idx) => (
              <li key={idx}>{term}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* JADWAL TERSEDIA (Untuk Scheduled Trip) */}
      {packageData.type === 'scheduled' && packageData.schedules.length > 0 && (
        <section className="bg-navy-50/60 border border-navy-200 p-6 rounded-2xl mb-8">
          <h2 className="text-base font-bold text-navy-950 mb-1 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-navy-900" /> Jadwal Keberangkatan Terdekat
          </h2>
          <p className="text-xs text-navy-800 mb-4">Pilih tanggal yang tersedia saat mengisi formulir pemesanan.</p>

          <div className="flex flex-wrap gap-2.5">
            {packageData.schedules.map((sch) => {
              const isOpen = sch.kuota_tersedia > 0;
              return (
                <div
                  key={sch.id}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 ${
                    isOpen
                      ? 'bg-white border-navy-300 text-navy-950 shadow-xs'
                      : 'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>{new Date(sch.trip_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isOpen ? 'bg-navy-100 text-navy-900' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {isOpen ? `Sisa ${sch.kuota_tersedia} slot` : 'Penuh'}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* STICKY BOTTOM BAR FOR BOOKING */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur border-t border-navy-100 py-3.5 px-4 shadow-xl">
        <div className="max-w-4xl mx-auto flex justify-between items-center gap-4">
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Mulai dari</span>
            <p className="text-base sm:text-lg font-extrabold text-navy-950">
              Rp {packageData.priceTiers[0]?.price_per_person.toLocaleString('id-ID')}
              <span className="text-xs font-normal text-slate-500"> / org</span>
            </p>
          </div>

          <button
            id="sticky-book-now-btn"
            onClick={() => onBook(packageData.slug)}
            className="bg-amber-500 hover:bg-amber-400 text-[#0f2252] font-black px-6 sm:px-10 py-3 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-xs sm:text-sm flex items-center gap-2 tracking-wide"
          >
            PESAN TRIP INI <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
