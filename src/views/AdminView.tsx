import React, { useState, useMemo } from 'react';
import { Booking, BookingStatus, FaqItem } from '../types';
import { 
  Users, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Eye, 
  Check, 
  XCircle,
  AlertCircle,
  Calendar,
  Layers,
  ShieldCheck,
  LogOut,
  Globe,
  Lock,
  Mail,
  Download,
  MapPin,
  Sparkles,
  Wand2,
  Database,
  User as UserIcon,
  FileDown,
  FileText,
  FileSpreadsheet,
  X,
  HelpCircle,
  Camera
} from 'lucide-react';
import type { User as FirebaseUser } from 'firebase/auth';
import { generateBookingPDF, exportBookingsReportPDF } from '../utils/pdfGenerator';
import { exportBookingsToCSV } from '../utils/csvExporter';
import { BookingCharts } from '../components/BookingCharts';
import { AdminFaqManager } from '../components/AdminFaqManager';
import { AdminGalleryManager } from '../components/AdminGalleryManager';
import { INITIAL_FAQS } from '../data/faqData';
import { GalleryItem } from '../types';
import { INITIAL_GALLERIES } from '../data/galleryData';

interface AdminViewProps {
  bookings: Booking[];
  onUpdateBookingStatus: (id: number, newStatus: BookingStatus) => void;
  onViewBooking: (code: string) => void;
  onLogout?: () => void;
  onBackToVisitor?: () => void;
  onOpenMapsGuide?: () => void;
  onOpenImageStudio?: () => void;
  firebaseUser?: FirebaseUser | null;
  onSignInGoogle?: () => void;
  onSignOutGoogle?: () => void;
  faqs?: FaqItem[];
  onAddFaq?: (faq: Omit<FaqItem, 'id' | 'created_at'>) => void;
  onUpdateFaq?: (faq: FaqItem) => void;
  onDeleteFaq?: (id: string) => void;
  onResetFaqs?: () => void;
  galleries?: GalleryItem[];
  onAddGallery?: (item: Omit<GalleryItem, 'id'>) => void;
  onUpdateGallery?: (item: GalleryItem) => void;
  onDeleteGallery?: (id: number) => void;
  onResetGalleries?: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  bookings,
  onUpdateBookingStatus,
  onViewBooking,
  onLogout,
  onBackToVisitor,
  onOpenMapsGuide,
  onOpenImageStudio,
  firebaseUser,
  onSignInGoogle,
  onSignOutGoogle,
  faqs = INITIAL_FAQS,
  onAddFaq,
  onUpdateFaq,
  onDeleteFaq,
  onResetFaqs,
  galleries = INITIAL_GALLERIES,
  onAddGallery,
  onUpdateGallery,
  onDeleteGallery,
  onResetGalleries
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'bookings' | 'faqs' | 'galleries'>('bookings');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Metrics
  const metrics = useMemo(() => {
    const totalBookings = bookings.length;
    const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
    const pendingCount = bookings.filter(b => b.status === 'waiting_payment').length;
    const completedCount = bookings.filter(b => b.status === 'completed').length;
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.status !== 'cancelled' ? b.paid_amount : 0), 0);

    // Filter booking hari ini (berdasarkan format tanggal sistem atau 2026-09-23)
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const todayBookings = bookings.filter(b => {
      if (!b.created_at) return false;
      return b.created_at.includes(todayStr) || b.created_at.includes('2026-09-23');
    });

    const todayBookingsCount = todayBookings.length;
    const todayRevenue = todayBookings.reduce((sum, b) => sum + (b.status !== 'cancelled' ? b.paid_amount : 0), 0);
    const todayPendingCount = todayBookings.filter(b => b.status === 'waiting_payment').length;

    return {
      totalBookings,
      confirmedCount,
      pendingCount,
      completedCount,
      totalRevenue,
      todayBookingsCount,
      todayRevenue,
      todayPendingCount
    };
  }, [bookings]);

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchStatus = selectedStatus === 'all' || b.status === selectedStatus;
      const matchQuery = 
        b.booking_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.customer_phone.includes(searchQuery) ||
        b.trip_package.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchQuery;
    });
  }, [bookings, selectedStatus, searchQuery]);

  // Export to PDF Modal & Configuration States
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportScope, setExportScope] = useState<'all' | 'filtered'>('all');
  const [authorName, setAuthorName] = useState<string>('Nazar Fauzy');
  const [authorId, setAuthorId] = useState<string>('Peserta Magang IT / Web Developer');
  const [institutionName, setInstitutionName] = useState<string>('Praktik Kerja Lapangan (PKL) / Magang Industri');
  const [mentorName, setMentorName] = useState<string>('Pembimbing Lapangan / Admin Operasional PT. Pasak Outdoor');
  const [reportTitle, setReportTitle] = useState<string>('LAPORAN REKAPITULASI DATA PEMESANAN & TRANSAKSI OPERASIONAL TRIP');
  const [csvExportMode, setCsvExportMode] = useState<'bookings' | 'participants_detailed'>('bookings');
  const [csvNotification, setCsvNotification] = useState<string | null>(null);
  const [isDownloadingZip, setIsDownloadingZip] = useState<boolean>(false);

  const showCsvNotification = (msg: string) => {
    setCsvNotification(msg);
    setTimeout(() => {
      setCsvNotification(null);
    }, 4000);
  };

  const handleExportCSV = (mode: 'bookings' | 'participants_detailed' = csvExportMode) => {
    try {
      const dataset = exportScope === 'filtered' ? filteredBookings : bookings;
      const scopeLabel = exportScope === 'filtered'
        ? `Status_${selectedStatus}`
        : 'All_Bookings';

      exportBookingsToCSV(dataset, {
        mode,
        scopeLabel
      });

      showCsvNotification(
        mode === 'participants_detailed'
          ? `Sukses mengunduh CSV Roster Peserta (${dataset.length} booking)!`
          : `Sukses mengunduh CSV Ringkasan Booking (${dataset.length} baris)!`
      );
    } catch (err) {
      console.error('Failed to export CSV:', err);
    }
  };

  const handleQuickExportCSV = (mode: 'bookings' | 'participants_detailed' = 'bookings') => {
    try {
      const dataset = filteredBookings.length > 0 ? filteredBookings : bookings;
      exportBookingsToCSV(dataset, {
        mode,
        scopeLabel: selectedStatus !== 'all' ? `Status_${selectedStatus}` : 'Current_View'
      });
      showCsvNotification(
        mode === 'participants_detailed'
          ? `File CSV Peserta (${dataset.length} booking) berhasil diunduh untuk arsip offline.`
          : `File CSV Rekap Pemesanan (${dataset.length} baris) berhasil diunduh untuk arsip offline.`
      );
    } catch (err) {
      console.error('Failed to quick export CSV:', err);
    }
  };

  const handleDownloadBackupZip = async () => {
    setIsDownloadingZip(true);
    try {
      // Force fresh binary fetch from server to prevent empty cached download in iframe
      const res = await fetch(`/api/download-backup?t=${Date.now()}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const blob = await res.blob();
      if (blob.size === 0) {
        throw new Error('File hasil download kosong (0 bytes)');
      }
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'papandayan-source-code.zip';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        window.URL.revokeObjectURL(url);
      }, 2000);
    } catch (err) {
      console.warn('Direct blob download error, falling back to window location:', err);
      window.location.href = `/api/download-backup?t=${Date.now()}`;
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const dataset = exportScope === 'filtered' ? filteredBookings : bookings;
      const filterLabel = exportScope === 'filtered'
        ? `Status: ${selectedStatus.toUpperCase()}${searchQuery ? ` • Pencarian: "${searchQuery}"` : ''}`
        : 'Semua Status (Seluruh Basis Data Firestore)';

      await exportBookingsReportPDF(dataset, {
        reportTitle,
        authorName,
        authorId,
        institutionName,
        mentorName,
        statusFilter: filterLabel,
      });
      setIsExportModalOpen(false);
    } catch (err) {
      console.error('Failed to export PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
      {/* Toast Notification for CSV Export */}
      {csvNotification && (
        <div className="mb-4 p-4 rounded-2xl bg-emerald-500 text-white shadow-lg flex items-center justify-between gap-3 text-xs animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
            <span className="font-bold">{csvNotification}</span>
          </div>
          <button
            onClick={() => setCsvNotification(null)}
            className="p-1 hover:bg-white/20 rounded-lg transition cursor-pointer text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Security Data Protection Banner */}
      <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-navy-950 block text-sm">Mode Administrator Operasional</span>
            <p className="text-amber-900 text-xs">
              Sesi terenkripsi aktif. Data pribadi pelanggan (NIK, Kontak, Riwayat Pembayaran) dilindungi untuk privasi wisatawan.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-end">
          <button
            id="admin-download-backup-zip-btn"
            onClick={handleDownloadBackupZip}
            disabled={isDownloadingZip}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#0a1638] hover:bg-[#14265c] text-amber-300 rounded-xl font-bold transition shadow-xs cursor-pointer border border-navy-700 text-xs disabled:opacity-60"
            title="Download Arsip Lengkap Proyek .ZIP (169 KB, Per 23 September 2026 16:45 WIB)"
          >
            {isDownloadingZip ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Mengunduh .ZIP...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Backup .ZIP (169 KB)</span>
              </>
            )}
          </button>

          <button
            id="admin-export-csv-top-btn"
            onClick={() => handleQuickExportCSV('bookings')}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition shadow-xs cursor-pointer text-xs"
            title="Download Rekap Pemesanan & Peserta sebagai File CSV (.csv) untuk dibuka di Excel offline"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-white" />
            <span>Export CSV</span>
          </button>

          <button
            id="admin-export-pdf-top-btn"
            onClick={() => setIsExportModalOpen(true)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-navy-950 rounded-xl font-black transition shadow-xs cursor-pointer text-xs"
            title="Unduh Laporan Rekapitulasi Pemesanan Resmi untuk Kebutuhan Magang / PKL"
          >
            <FileDown className="w-3.5 h-3.5 text-navy-950" />
            <span>Export to PDF</span>
          </button>

          {onBackToVisitor && (
            <button
              id="admin-to-visitor-btn"
              onClick={onBackToVisitor}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-navy-950 rounded-xl border border-slate-200 font-bold transition shadow-xs cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-navy-700" />
              <span>Tampilan Pengunjung</span>
            </button>
          )}

          {onLogout && (
            <button
              id="admin-logout-btn"
              onClick={onLogout}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition shadow-xs cursor-pointer"
              title="Kunci Panel dan Keluar dari Mode Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Kunci & Logout</span>
            </button>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-md uppercase tracking-wider">
            Portal Manajemen Terproteksi
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 mt-2">
            Panel Manajemen Reservasi Trip
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola data pemesanan, verifikasi pembayaran manual / DP, dan pantau status peserta pendakian.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-xs text-navy-950">
          <Mail className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Notifikasi Booking Real-time Masuk ke: <strong className="font-mono text-blue-900 font-bold">nazar.fauzy11@gmail.com</strong></span>
        </div>
      </div>

      {/* Admin Primary Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2.5 mb-8 border-b border-navy-100 pb-4">
        <button
          id="btn-admin-tab-bookings"
          onClick={() => setActiveAdminTab('bookings')}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer ${
            activeAdminTab === 'bookings'
              ? 'bg-[#0f2252] text-amber-300 shadow-md ring-2 ring-navy-900'
              : 'bg-white text-slate-600 hover:text-navy-900 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4 text-amber-400" />
          <span>Reservasi & Booking Trip</span>
          <span className={`ml-1 text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
            activeAdminTab === 'bookings' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
          }`}>
            {bookings.length}
          </span>
        </button>

        <button
          id="btn-admin-tab-faq"
          onClick={() => setActiveAdminTab('faqs')}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer ${
            activeAdminTab === 'faqs'
              ? 'bg-[#0f2252] text-amber-300 shadow-md ring-2 ring-navy-900'
              : 'bg-white text-slate-600 hover:text-navy-900 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>Kelola Tanya Jawab FAQ</span>
          <span className="ml-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-400 text-navy-950 font-black font-mono">
            {faqs.length} FAQ
          </span>
        </button>

        <button
          id="btn-admin-tab-gallery"
          onClick={() => setActiveAdminTab('galleries')}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer ${
            activeAdminTab === 'galleries'
              ? 'bg-[#0f2252] text-amber-300 shadow-md ring-2 ring-navy-900'
              : 'bg-white text-slate-600 hover:text-navy-900 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Camera className="w-4 h-4 text-amber-400" />
          <span>Kelola Foto Galeri (.JPG/.PNG)</span>
          <span className="ml-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-400 text-navy-950 font-black font-mono">
            {galleries.length} Foto
          </span>
        </button>
      </div>

      {activeAdminTab === 'faqs' ? (
        <AdminFaqManager
          faqs={faqs}
          onAddFaq={onAddFaq || (() => {})}
          onUpdateFaq={onUpdateFaq || (() => {})}
          onDeleteFaq={onDeleteFaq || (() => {})}
          onResetFaqs={onResetFaqs}
        />
      ) : activeAdminTab === 'galleries' ? (
        <AdminGalleryManager
          galleries={galleries}
          onAddGallery={onAddGallery || (() => {})}
          onUpdateGallery={onUpdateGallery || (() => {})}
          onDeleteGallery={onDeleteGallery || (() => {})}
          onResetGalleries={onResetGalleries}
        />
      ) : (
        <>
          {/* Ringkasan Statistik Monitoring Harian Admin */}
      <div className="mb-8 p-6 rounded-3xl bg-linear-to-r from-[#071330] via-[#0c1d47] to-[#142b66] text-white border-2 border-amber-400/70 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-wide text-white flex items-center gap-2">
                Ringkasan Statistik Monitoring Harian Admin
              </h2>
              <p className="text-xs text-blue-200 mt-0.5">
                Pemantauan aktivitas reservasi, pergerakan kas masuk, dan antrean booking hari ini secara real-time.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold bg-amber-400 text-navy-950 px-3 py-1 rounded-full self-start sm:self-auto uppercase tracking-wider">
            Monitoring Aktif
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* 1. Total Booking Hari Ini */}
          <div className="bg-white/10 hover:bg-white/15 border border-white/20 p-4 rounded-2xl transition backdrop-blur-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-blue-200 block">Total Booking Hari Ini</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-amber-300 font-mono">
                  {metrics.todayBookingsCount}
                </span>
                <span className="text-xs text-blue-200">Pesanan Masuk</span>
              </div>
              <p className="text-[11px] text-blue-300/80 mt-1">
                Aktivitas reservasi baru yang tercatat pada hari ini.
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          {/* 2. Total Pendapatan */}
          <div className="bg-white/10 hover:bg-white/15 border border-white/20 p-4 rounded-2xl transition backdrop-blur-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-blue-200 block">Total Pendapatan Terverifikasi</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono">
                  Rp {metrics.totalRevenue.toLocaleString('id-ID')}
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80 mt-1">
                Hari ini: <strong className="text-white">Rp {metrics.todayRevenue.toLocaleString('id-ID')}</strong> (Dana DP & Pelunasan)
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-400/30">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          {/* 3. Jumlah Booking Pending */}
          <div className="bg-white/10 hover:bg-white/15 border border-white/20 p-4 rounded-2xl transition backdrop-blur-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-amber-200 block">Jumlah Booking Pending</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-rose-300 font-mono">
                  {metrics.pendingCount}
                </span>
                <span className="text-xs text-rose-200">Menunggu DP</span>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <button
                  onClick={() => setSelectedStatus('waiting_payment')}
                  className="text-[11px] font-bold text-navy-950 bg-amber-300 hover:bg-amber-200 px-2.5 py-1 rounded-lg transition inline-flex items-center gap-1 shadow-xs"
                >
                  <Filter className="w-3 h-3" />
                  <span>Filter Pending ({metrics.pendingCount})</span>
                </button>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0 border border-rose-400/30">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-navy-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-navy-100 text-navy-900 flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block font-medium">Total Pesanan</span>
            <span className="text-2xl font-bold text-navy-950">{metrics.totalBookings}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-navy-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-navy-50 text-navy-900 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block font-medium">Pesanan Terkonfirmasi</span>
            <span className="text-2xl font-bold text-navy-950">{metrics.confirmedCount}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-navy-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block font-medium">Menunggu Bayar</span>
            <span className="text-2xl font-bold text-amber-700">{metrics.pendingCount}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-navy-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block font-medium">Total Dana Masuk</span>
            <span className="text-xl font-bold text-navy-950">
              Rp {metrics.totalRevenue.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>

      {/* Visualisasi Interaktif Recharts: Tren Harian & Status Pembayaran */}
      <BookingCharts bookings={bookings} />

      {/* Internal Admin AI Tools & Cloud Integration Section */}
      <div className="mb-8 p-6 rounded-3xl bg-linear-to-br from-[#0a1638] via-[#102250] to-[#183170] text-white shadow-xl border border-blue-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-navy-950 text-[11px] font-black uppercase tracking-wider">
                Khusus Admin Operasional
              </span>
              <span className="text-xs text-blue-200">Tools Bantu Cerdas & Grounding</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              Pusat Eksklusif Tools AI & Database Cloud Firestore
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {firebaseUser ? (
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-semibold text-white">Google Admin: {firebaseUser.email}</span>
                {onSignOutGoogle && (
                  <button
                    onClick={onSignOutGoogle}
                    className="text-xs text-rose-300 hover:text-rose-100 ml-1 underline cursor-pointer"
                  >
                    Logout
                  </button>
                )}
              </div>
            ) : onSignInGoogle ? (
              <button
                onClick={onSignInGoogle}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-navy-950 rounded-xl font-bold text-xs transition shadow-xs cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>Hubungkan Google Auth</span>
              </button>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Maps Grounding */}
          <div className="p-4 rounded-2xl bg-white/10 border border-white/10 flex flex-col justify-between hover:bg-white/15 transition">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-rose-300 bg-rose-950/60 px-2 py-0.5 rounded-md">
                  Maps Grounding
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">Panduan Peta & Navigasi Live</h3>
              <p className="text-xs text-blue-100/80 mt-1 leading-relaxed">
                Akses koordinat, rute basecamp ke Hutan Mati & Pondok Saladah berbasis Google Maps aktual.
              </p>
            </div>
            {onOpenMapsGuide && (
              <button
                onClick={onOpenMapsGuide}
                className="mt-4 w-full py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Buka Peta & Rute</span>
              </button>
            )}
          </div>

          {/* Card 2: AI Image Studio */}
          <div className="p-4 rounded-2xl bg-white/10 border border-white/10 flex flex-col justify-between hover:bg-white/15 transition">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-navy-950 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-md">
                  Gemini Flash Image
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">Studio Foto & Desain Kreatif</h3>
              <p className="text-xs text-blue-100/80 mt-1 leading-relaxed">
                Generate materi promosi, banner wisata, emblem trip, atau edit foto pendakian untuk media sosial.
              </p>
            </div>
            {onOpenImageStudio && (
              <button
                onClick={onOpenImageStudio}
                className="mt-4 w-full py-2 bg-amber-400 hover:bg-amber-300 text-navy-950 font-black text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Buka Studio Foto AI</span>
              </button>
            )}
          </div>

          {/* Card 3: Cloud Firestore Sync Status */}
          <div className="p-4 rounded-2xl bg-white/10 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500 text-white flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">Cloud Firestore Database</h3>
              <p className="text-xs text-blue-100/80 mt-1 leading-relaxed">
                Data pesanan otomatis tersinkronisasi dua arah ke koleksi database Firestore secara realtime.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-white/10 flex items-center justify-between text-xs text-blue-200">
              <span>Collection: <strong className="text-white font-mono">bookings</strong></span>
              <span className="text-amber-300 font-bold">{bookings.length} Data Aktif</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-navy-100 shadow-xs mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedStatus === 'all'
                ? 'bg-[#0f2252] text-amber-300'
                : 'bg-navy-50 text-navy-900 hover:bg-navy-100'
            }`}
          >
            Semua ({bookings.length})
          </button>
          <button
            onClick={() => setSelectedStatus('waiting_payment')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedStatus === 'waiting_payment'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            Menunggu Bayar ({metrics.pendingCount})
          </button>
          <button
            onClick={() => setSelectedStatus('confirmed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedStatus === 'confirmed'
                ? 'bg-[#0f2252] text-amber-300'
                : 'bg-navy-50 text-navy-900 hover:bg-navy-100'
            }`}
          >
            Dikonfirmasi ({metrics.confirmedCount})
          </button>
          <button
            onClick={() => setSelectedStatus('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedStatus === 'completed'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
            }`}
          >
            Selesai ({metrics.completedCount})
          </button>
          <button
            onClick={() => setSelectedStatus('cancelled')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedStatus === 'cancelled'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
            }`}
          >
            Dibatalkan
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          {/* Export to CSV Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              id="admin-export-csv-table-btn"
              onClick={() => handleQuickExportCSV('bookings')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
              title="Export daftar pemesanan terfilter ke CSV Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-white" />
              <span>Export CSV</span>
            </button>

            <button
              id="admin-export-participants-csv-table-btn"
              onClick={() => handleQuickExportCSV('participants_detailed')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-3 py-2 bg-navy-900 hover:bg-navy-800 text-amber-300 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer shrink-0 border border-navy-700"
              title="Export daftar rincian setiap peserta/traveler (Nama & NIK) ke CSV"
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Roster Peserta CSV</span>
            </button>
          </div>

          <button
            id="admin-export-pdf-table-btn"
            onClick={() => setIsExportModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-navy-950 rounded-xl text-xs font-black transition shadow-xs cursor-pointer shrink-0"
            title="Export data pemesanan Firestore ke Laporan Resmi PDF"
          >
            <FileDown className="w-4 h-4 text-navy-950" />
            <span>Export to PDF</span>
          </button>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kode, nama, nomor HP..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-navy-200 text-xs focus:ring-2 focus:ring-navy-900"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-navy-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f2252] text-white uppercase font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3 text-amber-400">Kode Booking</th>
                <th className="px-5 py-3">Paket Trip & Jadwal</th>
                <th className="px-5 py-3">Pemesan & Kontak</th>
                <th className="px-5 py-3">Peserta</th>
                <th className="px-5 py-3">Total / Terbayar</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400 text-xs">
                    Tidak ada reservasi yang sesuai dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-navy-50/40 transition">
                    <td className="px-5 py-4 font-mono font-bold text-navy-950">
                      {b.booking_code}
                      <span className="block text-[10px] text-slate-400 font-sans mt-0.5">{b.created_at}</span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-navy-950">{b.trip_package.name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {b.trip_schedule_date || 'Tanggal Fleksibel'} • MP: {b.meeting_point}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-navy-950">{b.customer_name}</p>
                      <p className="text-[11px] text-slate-500">{b.customer_phone}</p>
                      <p className="text-[11px] text-slate-400">{b.customer_email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-navy-900">{b.participant_count} Orang</span>
                      <span className="block text-[10px] text-slate-500 uppercase">{b.customer_type}</span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-navy-950">Rp {b.total_amount.toLocaleString('id-ID')}</p>
                      <p className="text-[11px] text-amber-600 font-semibold">Terbayar: Rp {b.paid_amount.toLocaleString('id-ID')}</p>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={b.status}
                        onChange={(e) => onUpdateBookingStatus(b.id, e.target.value as BookingStatus)}
                        className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border transition cursor-pointer ${
                          b.status === 'confirmed'
                            ? 'bg-navy-50 text-navy-950 border-navy-300'
                            : b.status === 'waiting_payment'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : b.status === 'completed'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}
                      >
                        <option value="waiting_payment">Menunggu Bayar</option>
                        <option value="confirmed">Dikonfirmasi</option>
                        <option value="completed">Selesai</option>
                        <option value="cancelled">Dibatalkan</option>
                      </select>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => generateBookingPDF(b)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-white hover:text-amber-300 bg-[#0a1638] hover:bg-[#14265c] px-2.5 py-1.5 rounded-lg transition border border-navy-800 cursor-pointer shadow-xs"
                          title="Unduh E-Tiket & Invoice PDF"
                        >
                          <Download className="w-3.5 h-3.5 text-amber-400" /> PDF
                        </button>
                        <button
                          onClick={() => onViewBooking(b.booking_code)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-navy-950 hover:text-navy-900 bg-amber-400 hover:bg-amber-300 px-2.5 py-1.5 rounded-lg transition cursor-pointer shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" /> Buka Tiket
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}

      {/* EXPORT TO PDF MODAL (LAPORAN RESMI MAGANG / PKL) */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-navy-100 w-full max-w-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="bg-[#0a1638] p-6 text-white flex items-start justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20"></div>
              <div className="flex items-start gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                  <FileDown className="w-6 h-6" />
                </div>
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold text-[10px] tracking-wider uppercase mb-1">
                    Dokumen Pertanggungjawaban Magang / PKL
                  </span>
                  <h3 className="text-xl font-black text-white tracking-tight">Export Laporan Pemesanan (PDF)</h3>
                  <p className="text-slate-300 text-xs mt-1">
                    Generate dokumen rekapitulasi data reservasi Firestore resmi berformat A4 Landscape lengkap dengan lembar pengesahan tanda tangan.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition cursor-pointer relative z-10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs">
              {/* Scope Selection */}
              <div>
                <label className="block text-navy-950 font-bold text-xs mb-2">Pilih Cakupan Data yang Diekspor:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setExportScope('all')}
                    className={`p-3.5 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${
                      exportScope === 'all'
                        ? 'border-navy-900 bg-navy-50/70 ring-2 ring-navy-900/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                      exportScope === 'all' ? 'border-navy-900 bg-navy-900' : 'border-slate-300'
                    }`}>
                      {exportScope === 'all' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                    </div>
                    <div>
                      <span className="font-extrabold text-navy-950 block text-xs">Semua Data Firestore</span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        Mencakup seluruh {bookings.length} reservasi tanpa terpengaruh filter tampilan.
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExportScope('filtered')}
                    className={`p-3.5 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${
                      exportScope === 'filtered'
                        ? 'border-navy-900 bg-navy-50/70 ring-2 ring-navy-900/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                      exportScope === 'filtered' ? 'border-navy-900 bg-navy-900' : 'border-slate-300'
                    }`}>
                      {exportScope === 'filtered' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                    </div>
                    <div>
                      <span className="font-extrabold text-navy-950 block text-xs">Data Terfilter Saat Ini</span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        Mencakup {filteredBookings.length} data dengan status "{selectedStatus.toUpperCase()}"
                        {searchQuery ? ` & cari "${searchQuery}"` : ''}.
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Form Metadata Identitas Magang */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-navy-900 font-extrabold text-xs">
                  <FileText className="w-4 h-4 text-amber-500" />
                  <span>Kustomisasi Identitas Laporan Magang / PKL</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1 text-[11px]">Nama Peserta Magang / Penyusun:</label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Contoh: Nazar Fauzy"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-navy-900 font-semibold text-navy-950"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1 text-[11px]">NIM / Posisi Magang:</label>
                    <input
                      type="text"
                      value={authorId}
                      onChange={(e) => setAuthorId(e.target.value)}
                      placeholder="Contoh: Peserta Magang IT / Web Developer"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-navy-900 font-semibold text-navy-950"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1 text-[11px]">Nama Kampus / Sekolah / Instansi:</label>
                    <input
                      type="text"
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      placeholder="Contoh: Universitas / SMK / Program PKL"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-navy-900 font-semibold text-navy-950"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1 text-[11px]">Pembimbing Lapangan / Verifikator:</label>
                    <input
                      type="text"
                      value={mentorName}
                      onChange={(e) => setMentorName(e.target.value)}
                      placeholder="Contoh: Pembimbing Lapangan PT. Pasak Outdoor"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-navy-900 font-semibold text-navy-950"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-bold mb-1 text-[11px]">Judul Utama Laporan:</label>
                    <input
                      type="text"
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-navy-900 font-semibold text-navy-950"
                    />
                  </div>
                </div>
              </div>

              {/* Document Specification Box */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-[11px] space-y-1">
                  <p className="font-bold text-emerald-950">Fitur Kelengkapan Dokumen PDF Resmi:</p>
                  <ul className="list-disc list-inside text-emerald-800 space-y-0.5">
                    <li>KOP Surat Resmi PT. Pasak Outdoor Indonesia & TWA Gunung Papandayan Garut.</li>
                    <li>Format tabular A4 Landscape dengan penomoran halaman otomatis (Halaman X dari Y).</li>
                    <li>Ringkasan finansial (Total Omzet, Dana Terbayar, Pax) & Lembar Pengesahan Tanda Tangan 3 Pihak.</li>
                    <li>Kolom lengkap: Kode Booking, Tgl Pesan, Paket, Pemesan (Gmail & WhatsApp 12 Digit), serta Keterangan Riil.</li>
                  </ul>
                </div>
              </div>

              {/* CSV Export Option Card */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs text-emerald-950">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Format File CSV untuk Pencatatan & Arsip Offline</span>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full">
                    Excel & Google Sheets Compatible
                  </span>
                </div>
                <p className="text-[11px] text-emerald-900 leading-relaxed">
                  Pilih mode data CSV yang ingin diekspor untuk memudahkan administrasi di lapangan tanpa internet:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setCsvExportMode('bookings')}
                    className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 cursor-pointer ${
                      csvExportMode === 'bookings'
                        ? 'border-emerald-600 bg-white ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-emerald-200/80 hover:bg-white/60 bg-white/40'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                      csvExportMode === 'bookings' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                    }`}>
                      {csvExportMode === 'bookings' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-navy-950 block">Ringkasan Pemesanan</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        1 baris per kode booking lengkap dengan kontak & nominal.
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCsvExportMode('participants_detailed')}
                    className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 cursor-pointer ${
                      csvExportMode === 'participants_detailed'
                        ? 'border-emerald-600 bg-white ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-emerald-200/80 hover:bg-white/60 bg-white/40'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                      csvExportMode === 'participants_detailed' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                    }`}>
                      {csvExportMode === 'participants_detailed' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-navy-950 block">Roster Setiap Peserta (Nama & NIK)</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        1 baris per orang peserta untuk absen pos SIMAKSI BKSDA.
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Project Zip Archive Download Box */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2.5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Download className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-navy-950 text-xs">Arsip Backup Lengkap Kode & Proyek (.ZIP)</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-mono font-bold text-[10px]">169 KB</span>
                      </div>
                      <span className="text-[11px] text-amber-900 block mt-0.5">
                        Pembaruan per 23 September 2026 pukul 16.45 WIB (Frontend, Backend, Database Rules).
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadBackupZip}
                    disabled={isDownloadingZip}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0a1638] hover:bg-[#14265c] text-amber-300 rounded-xl font-bold transition shadow-xs text-xs whitespace-nowrap cursor-pointer disabled:opacity-60"
                  >
                    {isDownloadingZip ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                        <span>Mengunduh .ZIP...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5 text-amber-400" />
                        <span>Unduh .ZIP (169 KB)</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-2.5 bg-white/70 rounded-xl border border-amber-200/80 text-[10px] text-amber-900 leading-relaxed">
                  💡 <strong>Panduan Ekstrak Windows / WinRAR:</strong> Pastikan ukuran file terunduh adalah <strong>±169 KB</strong>. Di Windows Explorer, klik kanan file lalu pilih <em>"Extract All..." (Ekstrak Semua)</em> atau di WinRAR pilih <em>"Extract to papandayan-project-backup-20260923-1645/"</em>.
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-slate-500 text-center sm:text-left">
                Sumber Data: Basis Data Firestore (<span className="font-mono font-bold text-navy-900">{exportScope === 'all' ? bookings.length : filteredBookings.length} baris</span>)
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(false)}
                  disabled={isExporting}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold transition cursor-pointer text-xs"
                >
                  Tutup
                </button>

                <button
                  type="button"
                  onClick={() => handleExportCSV()}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow-md cursor-pointer text-xs"
                  title="Unduh file format CSV (.csv) untuk dibuka di spreadsheet Excel secara offline"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Unduh File CSV</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-navy-950 rounded-xl font-black transition shadow-md cursor-pointer disabled:opacity-50 text-xs"
                >
                  {isExporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin"></div>
                      <span>Menyusun Dokumen...</span>
                    </>
                  ) : (
                    <>
                      <FileDown className="w-4 h-4" />
                      <span>Unduh Laporan PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
