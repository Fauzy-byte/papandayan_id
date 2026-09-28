import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Heart, Lock } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useRealtimeClock } from '../utils/timeUtils';

interface FooterProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenHelp: (topic?: string) => void;
  isAdmin?: boolean;
  onOpenAdminLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onNavigate, 
  onOpenHelp,
  isAdmin = false,
  onOpenAdminLogin
}) => {
  const clock = useRealtimeClock();
  return (
    <footer className="bg-[#0a1638] text-blue-100 border-t-4 border-amber-500">
      {/* Official Social Banner (Exactly like the PDF / Flyer footer) */}
      <div className="bg-[#0f2252] border-b border-navy-800 py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span>Official Social Media papandayan_id</span>
          </div>
          <div className="flex items-center gap-6">
            <a 
              href="https://instagram.com/papandayan_id" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 text-sm font-bold text-white hover:text-amber-400 transition"
            >
              <span className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-amber-400 text-xs">📷</span>
              <span>@papandayan_id</span>
            </a>
            <span className="text-navy-700">|</span>
            <a 
              href="https://tiktok.com/@papandayan_id" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 text-sm font-bold text-white hover:text-amber-400 transition"
            >
              <span className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-amber-400 text-xs">🎵</span>
              <span>@papandayan_id</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <BrandLogo size="lg" showSubtitle={true} variant="light" />

            <p className="text-sm text-blue-200/80 leading-relaxed">
              Trip organizer resmi di bawah naungan PT. Pasak Outdoor Garut (NIB: 1130320094709). Melayani VIP Camp, Private Camp, Sunrise Trip, dan One Day Exploring dengan fasilitas lengkap dan tim profesional.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              Izin Resmi Wisata Alam BKSDA Garut
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-base font-bold mb-4 tracking-wide uppercase text-xs text-amber-400 flex items-center gap-1.5">
              <span>Paket Trip Unggulan</span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button 
                  onClick={() => onNavigate('package-detail', 'vip-camp-papandayan')}
                  className="hover:text-amber-400 transition flex items-center gap-1.5 text-blue-100"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  VIP Camp Papandayan
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('package-detail', 'private-camp-papandayan')}
                  className="hover:text-amber-400 transition flex items-center gap-1.5 text-blue-100"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Private Camp Papandayan
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('package-detail', 'sunrise-trip-moment')}
                  className="hover:text-amber-400 transition flex items-center gap-1.5 text-blue-100"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Sunrise Trip Moment
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('package-detail', 'exploring-one-day-papandayan')}
                  className="hover:text-amber-400 transition flex items-center gap-1.5 text-blue-100"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Explore One Day Papandayan
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('packages')}
                  className="text-amber-400 hover:text-amber-300 font-bold mt-2 inline-flex items-center gap-1"
                >
                  Lihat Semua Paket →
                </button>
              </li>
            </ul>
          </div>

          {/* Help & Policies */}
          <div>
            <h4 className="text-white text-base font-bold mb-4 tracking-wide uppercase text-xs text-amber-400">
              Bantuan & Ketentuan
            </h4>
            <ul className="space-y-2.5 text-sm text-blue-200/90">
              <li>
                <button 
                  onClick={() => onOpenHelp('faq')}
                  className="hover:text-amber-400 transition"
                >
                  FAQ (Pertanyaan Umum)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenHelp('booking')}
                  className="hover:text-amber-400 transition"
                >
                  Panduan Cara Booking
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenHelp('payment')}
                  className="hover:text-amber-400 transition"
                >
                  Pembayaran & DP
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenHelp('refund')}
                  className="hover:text-amber-400 transition"
                >
                  Kebijakan Refund & Pembatalan
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('articles')}
                  className="hover:text-amber-400 transition"
                >
                  Tips & Artikel Pendakian
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Basecamp */}
          <div className="space-y-3">
            <h4 className="text-white text-base font-bold mb-4 tracking-wide uppercase text-xs text-amber-400">
              Kantor & Kontak
            </h4>
            <div className="flex items-start gap-3 text-sm text-blue-200/80">
              <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <span>Perum Rancabango Intan Residence, Blok H 15, Rancabango, Tarogong Kaler, Garut, Jawa Barat</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-blue-200/80">
              <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
              <div className="space-y-1">
                <a 
                  href="https://wa.me/62895422619017" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="block hover:text-amber-300 transition"
                >
                  0895-4226-19017 <span className="text-xs text-amber-400 font-medium">(Admin 1)</span>
                </a>
                <a 
                  href="https://wa.me/62895635967327" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="block hover:text-amber-300 transition"
                >
                  0895-6359-67327 <span className="text-xs text-amber-400 font-medium">(Admin 2)</span>
                </a>
                <a 
                  href="tel:085314114128" 
                  className="block hover:text-amber-300 transition text-xs text-blue-300/80 pt-0.5"
                >
                  +62 853 1411 4128 <span className="text-[11px] text-blue-400 font-normal">(Hotline Pasak Outdoor)</span>
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-blue-200/80">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <a 
                href="mailto:papadayanindonesia@my67.cloud" 
                className="hover:text-amber-300 transition"
                title="Email Resmi papandayan_id"
              >
                papadayanindonesia@my67.cloud
              </a>
            </div>
          </div>

        </div>

        {/* Real-time System Status Bar */}
        <div className="mt-10 py-3 px-4 rounded-xl bg-[#071026] border border-navy-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-blue-200/90 gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-white font-medium">Sistem Pemesanan Real-Time Aktif</span>
            <span className="text-navy-600 hidden sm:inline">•</span>
            <span className="text-blue-300 hidden sm:inline">Pembaruan Kuota & Jadwal Langsung</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-amber-300 font-bold">
            <span className="text-[10px] text-blue-300 font-sans font-normal">Waktu Sistem:</span>
            <span>{clock.formatted}</span>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-6 pt-6 border-t border-navy-800/80 flex flex-col sm:flex-row justify-between items-center text-xs text-blue-300/60 gap-4">
          <p>© 2026 papandayan_id — PT. Pasak Outdoor Garut (NIB: 1130320094709). Seluruh hak cipta dilindungi.</p>
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1">
              Dibuat dengan <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> untuk petualang Indonesia
            </span>

            {onOpenAdminLogin && (
              <>
                <span className="text-navy-700 hidden sm:inline">•</span>
                <button
                  id="footer-staff-portal-btn"
                  onClick={onOpenAdminLogin}
                  className="flex items-center gap-1 text-[11px] text-blue-300/50 hover:text-amber-400 transition cursor-pointer"
                  title="Akses Staf Operasional PT. Pasak Outdoor"
                >
                  <Lock className="w-3 h-3 text-slate-500" />
                  <span>{isAdmin ? 'Panel Admin (Aktif)' : 'Portal Staf & Admin'}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

