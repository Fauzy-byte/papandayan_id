import { Booking } from '../types';

/**
 * Escapes a cell value for CSV formatting according to RFC 4180:
 * - Wrap in quotes if it contains commas, newlines, or quotes
 * - Double any internal quotes
 * - Prefix formulas (=, +, -, @) to prevent formula injection
 */
function escapeCSVCell(value: unknown): string {
  if (value === null || value === undefined) {
    return '""';
  }

  let str = String(value);

  // Prevent CSV formula injection when opened in Microsoft Excel
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }

  // If string contains comma, quote, or newline, escape quotes and wrap in quotes
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return `"${str}"`;
}

export interface CSVExportOptions {
  fileName?: string;
  scopeLabel?: string;
  mode?: 'bookings' | 'participants_detailed';
}

/**
 * Generates and triggers download of Bookings as a standard CSV file.
 * Includes UTF-8 BOM (\uFEFF) so Excel on Windows correctly recognizes Indonesian accents and special characters.
 */
export function exportBookingsToCSV(
  bookings: Booking[],
  options: CSVExportOptions = {}
): void {
  const mode = options.mode || 'bookings';

  let csvContent = '';

  if (mode === 'participants_detailed') {
    // Detailed list where each row is an individual participant/traveler
    const headers = [
      'No',
      'Kode Booking',
      'Tanggal Booking',
      'Paket Trip',
      'Kategori Trip',
      'Tanggal Pelaksanaan',
      'Meeting Point',
      'Tipe Wisatawan',
      'Nama Pemesan (Ketua)',
      'Nomor HP Pemesan',
      'Email Pemesan',
      'No Urut Peserta',
      'Nama Peserta',
      'NIK / No Identitas Peserta',
      'Status Booking',
      'Status Pembayaran',
      'Total Biaya (Rp)',
      'Terbayar (Rp)',
      'Metode Pembayaran',
      'Catatan Khusus'
    ];

    const rows: string[][] = [];
    let rowNumber = 1;

    bookings.forEach((b) => {
      const participants = b.participants && b.participants.length > 0
        ? b.participants
        : [{ name: b.customer_name, identity_number: '-' }];

      participants.forEach((p, idx) => {
        rows.push([
          String(rowNumber++),
          b.booking_code,
          b.created_at || '-',
          b.trip_package?.name || '-',
          b.trip_package?.category || '-',
          b.trip_schedule_date || 'Tanggal Fleksibel',
          b.meeting_point || '-',
          b.customer_type === 'foreign' ? 'Mancanegara (Foreign)' : 'Domestik / Lokal',
          b.customer_name,
          b.customer_phone,
          b.customer_email,
          `Peserta ${idx + 1} dari ${participants.length}`,
          p.name || '-',
          p.identity_number || '-',
          translateBookingStatus(b.status),
          b.paid_amount >= b.total_amount ? 'Lunas' : b.paid_amount > 0 ? 'DP Terbayar' : 'Belum Bayar',
          String(b.total_amount),
          String(b.paid_amount),
          b.payment_method || '-',
          b.customer_notes || '-'
        ]);
      });
    });

    const headerLine = headers.map(escapeCSVCell).join(',');
    const dataLines = rows.map((r) => r.map(escapeCSVCell).join(',')).join('\r\n');
    csvContent = `${headerLine}\r\n${dataLines}`;
  } else {
    // Summary row per booking with participant list condensed
    const headers = [
      'No',
      'Kode Booking',
      'Waktu Booking',
      'Paket Trip',
      'Kategori Trip',
      'Jadwal Pelaksanaan',
      'Meeting Point',
      'Tipe Wisatawan',
      'Nama Pemesan',
      'Nomor WhatsApp / HP',
      'Alamat Email',
      'Jumlah Peserta (Pax)',
      'Daftar Nama & NIK Peserta',
      'Addons / Tambahan',
      'Harga Per Orang (Rp)',
      'Total Tagihan (Rp)',
      'Uang Muka / DP (Rp)',
      'Jumlah Terbayar (Rp)',
      'Sisa Tagihan (Rp)',
      'Status Booking',
      'Status Pembayaran',
      'Metode Pembayaran',
      'Batas Waktu Bayar',
      'Waktu Pelunasan',
      'Catatan Pelanggan'
    ];

    const rows: string[][] = bookings.map((b, index) => {
      const remainingAmount = Math.max(0, b.total_amount - (b.paid_amount || 0));
      
      const participantDetails = (b.participants && b.participants.length > 0)
        ? b.participants.map((p, i) => `${i + 1}. ${p.name}${p.identity_number ? ` (NIK: ${p.identity_number})` : ''}`).join('; ')
        : `${b.customer_name} (1 orang)`;

      const addonsDetail = (b.addons && b.addons.length > 0)
        ? b.addons.map((a) => `${a.name} (Rp ${a.price.toLocaleString('id-ID')})`).join('; ')
        : '-';

      const paymentStatus = b.paid_amount >= b.total_amount
        ? 'Lunas'
        : b.paid_amount > 0
        ? 'DP Terbayar'
        : 'Belum Bayar';

      return [
        String(index + 1),
        b.booking_code,
        b.created_at || '-',
        b.trip_package?.name || '-',
        b.trip_package?.category || '-',
        b.trip_schedule_date || 'Tanggal Fleksibel',
        b.meeting_point || '-',
        b.customer_type === 'foreign' ? 'Mancanegara (Foreign)' : 'Domestik / Lokal',
        b.customer_name,
        b.customer_phone,
        b.customer_email,
        String(b.participant_count || (b.participants ? b.participants.length : 1)),
        participantDetails,
        addonsDetail,
        String(b.tier_price_per_person || 0),
        String(b.total_amount),
        String(b.dp_amount || 0),
        String(b.paid_amount || 0),
        String(remainingAmount),
        translateBookingStatus(b.status),
        paymentStatus,
        b.payment_method || '-',
        b.payment_deadline || '-',
        b.paid_at || '-',
        b.customer_notes || '-'
      ];
    });

    const headerLine = headers.map(escapeCSVCell).join(',');
    const dataLines = rows.map((r) => r.map(escapeCSVCell).join(',')).join('\r\n');
    csvContent = `${headerLine}\r\n${dataLines}`;
  }

  // Prepend UTF-8 Byte Order Mark (BOM) so Microsoft Excel opens it seamlessly without character glitches
  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });

  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  const defaultFileName = mode === 'participants_detailed'
    ? `Daftar_Peserta_Trip_Papandayan_${dateStr}.csv`
    : `Rekap_Booking_Papandayan_${dateStr}.csv`;

  const finalFileName = options.fileName || defaultFileName;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', finalFileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function translateBookingStatus(status: string): string {
  switch (status) {
    case 'waiting_payment':
      return 'Menunggu Pembayaran';
    case 'waiting_confirmation':
      return 'Menunggu Konfirmasi Admin';
    case 'confirmed':
      return 'Dikonfirmasi (Aktif)';
    case 'completed':
      return 'Selesai Dilaksanakan';
    case 'cancelled':
      return 'Dibatalkan';
    case 'refunded':
      return 'Dikembalikan (Refund)';
    default:
      return status;
  }
}
