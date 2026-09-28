import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Booking } from '../types';

/**
 * Capture the booking detail DOM element using html2canvas and convert it
 * into a high-resolution, downloadable PDF E-Ticket & Invoice.
 */
export const captureTicketPDF = async (element: HTMLElement, booking: Booking): Promise<void> => {
  // Capture DOM element using html2canvas with retina scale
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: '#ffffff',
    scrollX: 0,
    scrollY: -window.scrollY,
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.98);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Scale image to fit page width
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  // First page
  doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
  heightLeft -= pageHeight;

  // Add subsequent pages if the content extends beyond a single A4 page
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    doc.addPage();
    doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;
  }

  doc.save(`E-Tiket-Papandayan-${booking.booking_code}.pdf`);
};

/**
 * Clean vector-drawn PDF generator for standalone or fallback usage
 */
export const generateBookingPDF = async (booking: Booking): Promise<void> => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const navyDark = [10, 22, 56]; // #0a1638
  const navyAccent = [15, 34, 82]; // #0f2252
  const amberGold = [217, 119, 6]; // #d97706
  const slateText = [71, 85, 105]; // #475569
  const borderGray = [226, 232, 240]; // #e2e8f0

  // 1. TOP HEADER BANNER
  doc.setFillColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.rect(0, 0, pageWidth, 32, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('PAPANDAYAN_ID', margin, 12);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(186, 230, 253);
  doc.text('PT. Pasak Outdoor — Wisata Alam & Pendakian TWA Gunung Papandayan 2.665 MDPL', margin, 18);
  doc.text('Basecamp Pos 1 Camp David, Cisurupan, Garut, Jawa Barat | WA: +62 895-4226-19017', margin, 23);

  // Top Right Badge: OFFICIAL E-TICKET
  doc.setFillColor(amberGold[0], amberGold[1], amberGold[2]);
  doc.roundedRect(pageWidth - margin - 48, 8, 48, 16, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('E-TIKET & INVOICE', pageWidth - margin - 24, 15, { align: 'center' });
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('DOKUMEN RESMI', pageWidth - margin - 24, 20, { align: 'center' });

  // 2. META STRIP: BOOKING CODE & STATUS
  let currentY = 38;

  // Outer Box for Booking ID & Status
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(margin, currentY, contentWidth, 18, 2, 2, 'FD');

  // Booking Code
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('KODE BOOKING (RESERVATION CODE):', margin + 4, currentY + 6);

  doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.setFontSize(13);
  doc.setFont('courier', 'bold');
  doc.text(booking.booking_code, margin + 4, currentY + 13);

  // Status Badge
  const isConfirmed = booking.status === 'confirmed' || booking.status === 'completed';
  const statusLabel = isConfirmed
    ? 'TERKONFIRMASI (RESMI)'
    : booking.status === 'waiting_payment'
    ? 'MENUNGGU PEMBAYARAN'
    : booking.status.toUpperCase();

  const statusBg = isConfirmed ? [220, 252, 231] : [254, 243, 199];
  const statusTextColor = isConfirmed ? [22, 101, 52] : [146, 64, 14];

  doc.setFillColor(statusBg[0], statusBg[1], statusBg[2]);
  doc.setDrawColor(statusTextColor[0], statusTextColor[1], statusTextColor[2]);
  doc.roundedRect(pageWidth - margin - 65, currentY + 4, 61, 10, 2, 2, 'FD');

  doc.setTextColor(statusTextColor[0], statusTextColor[1], statusTextColor[2]);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(statusLabel, pageWidth - margin - 34.5, currentY + 10.5, { align: 'center' });

  // 3. E-TICKET SECTION (BOARDING PASS)
  currentY += 23;

  doc.setFillColor(navyAccent[0], navyAccent[1], navyAccent[2]);
  doc.rect(margin, currentY, contentWidth, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('I. DETAIL E-TIKET & PETUALANGAN', margin + 4, currentY + 5);

  currentY += 7;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.rect(margin, currentY, contentWidth, 54, 'FD');

  // Left Column (Trip Info)
  const col1X = margin + 4;
  const col2X = margin + 65;
  const col3X = pageWidth - margin - 40;

  // Package Name
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('NAMA PAKET TRIP:', col1X, currentY + 6);
  doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text(booking.trip_package.name, col1X, currentY + 11);

  // Duration
  doc.setTextColor(amberGold[0], amberGold[1], amberGold[2]);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(`[ ${booking.trip_package.duration_label} ]`, col1X, currentY + 16);

  // Jadwal Keberangkatan
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('TANGGAL KEBERANGKATAN:', col1X, currentY + 23);
  doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  const formattedDate = booking.trip_schedule_date
    ? new Date(booking.trip_schedule_date).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Sesuai Kesepakatan Jadwal';
  doc.text(formattedDate, col1X, currentY + 28);

  // Titik Kumpul
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('TITIK KUMPUL (MEETING POINT):', col1X, currentY + 35);
  doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text(booking.meeting_point || 'Basecamp Pasak Outdoor Pos 1 Camp David', col1X, currentY + 40);

  // Kategori Wisatawan
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('KATEGORI:', col1X, currentY + 46);
  doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(
    booking.customer_type === 'local' ? 'Wisatawan Domestik (Lokal)' : 'Wisatawan Mancanegara (Foreign)',
    col1X,
    currentY + 50
  );

  // Middle Column (Customer Data)
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('NAMA KETUA / PEMESAN:', col2X, currentY + 6);
  doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text(booking.customer_name, col2X, currentY + 11);

  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('NOMOR WHATSAPP:', col2X, currentY + 17);
  doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text(booking.customer_phone, col2X, currentY + 22);

  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('EMAIL:', col2X, currentY + 28);
  doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text(booking.customer_email, col2X, currentY + 33);

  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('TOTAL PESERTA:', col2X, currentY + 39);
  doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`${booking.participant_count} Orang (Termasuk SIMAKSI & Asuransi)`, col2X, currentY + 44);

  // Right Column: QR Code Container
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(col3X - 5, currentY + 5, 40, 44, 2, 2, 'FD');

  // Load and draw dynamic QR code
  try {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
      booking.booking_code
    )}`;
    const qrImg = await loadImage(qrUrl);
    doc.addImage(qrImg, 'PNG', col3X - 2, currentY + 8, 34, 34);
  } catch {
    doc.setFillColor(navyDark[0], navyDark[1], navyDark[2]);
    doc.rect(col3X + 2, currentY + 12, 26, 26, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.text('QR VERIFIED', col3X + 15, currentY + 26, { align: 'center' });
  }

  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.text('SCAN DI POS 1', col3X + 15, currentY + 45.5, { align: 'center' });

  // 4. PARTICIPANTS LIST
  currentY += 59;
  doc.setFillColor(navyAccent[0], navyAccent[1], navyAccent[2]);
  doc.rect(margin, currentY, contentWidth, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(`II. MANIFEST DAFTAR PESERTA (${booking.participants.length} ORANG)`, margin + 4, currentY + 4.5);

  currentY += 6;
  const participantBoxHeight = Math.max(16, Math.min(32, booking.participants.length * 6 + 6));
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.rect(margin, currentY, contentWidth, participantBoxHeight, 'FD');

  doc.setFontSize(7.5);
  booking.participants.slice(0, 5).forEach((p, idx) => {
    const pY = currentY + 5 + idx * 5.5;
    doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`${idx + 1}. ${p.name}`, margin + 4, pY);

    if (p.identity_number) {
      doc.setFont('courier', 'normal');
      doc.setTextColor(slateText[0], slateText[1], slateText[2]);
      doc.text(`(NIK / Paspor: ${p.identity_number})`, margin + 65, pY);
    }
  });

  if (booking.participants.length > 5) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(slateText[0], slateText[1], slateText[2]);
    doc.text(`... dan ${booking.participants.length - 5} peserta lainnya sesuai manifes registrasi.`, margin + 4, currentY + participantBoxHeight - 2);
  }

  // 5. OFFICIAL INVOICE BREAKDOWN
  currentY += participantBoxHeight + 5;
  doc.setFillColor(navyAccent[0], navyAccent[1], navyAccent[2]);
  doc.rect(margin, currentY, contentWidth, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(`III. RINCIAN FAKTUR TAGIHAN & PEMBAYARAN (INVOICE)`, margin + 4, currentY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`No: INV/${new Date().getFullYear()}/${booking.booking_code}`, pageWidth - margin - 4, currentY + 4.5, {
    align: 'right',
  });

  currentY += 6;

  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, currentY, contentWidth, 6, 'F');
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('Deskripsi Item / Layanan', margin + 4, currentY + 4.2);
  doc.text('Jumlah', margin + 105, currentY + 4.2, { align: 'center' });
  doc.text('Harga Satuan', margin + 135, currentY + 4.2, { align: 'right' });
  doc.text('Subtotal', pageWidth - margin - 4, currentY + 4.2, { align: 'right' });

  currentY += 6;

  // Table Row: Package
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, currentY, contentWidth, 8, 'F');
  doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text(booking.trip_package.name, margin + 4, currentY + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text('Tiket SIMAKSI, Tenda/Logistik, Guide Berlisensi & Pemandu', margin + 4, currentY + 7);

  doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.setFontSize(7.5);
  doc.text(`${booking.participant_count} Pax`, margin + 105, currentY + 5, { align: 'center' });
  doc.text(`Rp ${booking.tier_price_per_person.toLocaleString('id-ID')}`, margin + 135, currentY + 5, {
    align: 'right',
  });
  doc.setFont('helvetica', 'bold');
  doc.text(
    `Rp ${(booking.participant_count * booking.tier_price_per_person).toLocaleString('id-ID')}`,
    pageWidth - margin - 4,
    currentY + 5,
    { align: 'right' }
  );

  currentY += 8;

  // Table Rows: Add-ons
  booking.addons.forEach((addon) => {
    doc.setFillColor(255, 255, 255);
    doc.rect(margin, currentY, contentWidth, 6, 'F');
    doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(`Add-on: ${addon.name}`, margin + 4, currentY + 4.2);
    doc.text('1 Paket', margin + 105, currentY + 4.2, { align: 'center' });
    doc.text(`Rp ${addon.price.toLocaleString('id-ID')}`, margin + 135, currentY + 4.2, { align: 'right' });
    doc.text(`Rp ${addon.price.toLocaleString('id-ID')}`, pageWidth - margin - 4, currentY + 4.2, { align: 'right' });
    currentY += 6;
  });

  // Financial Summary Box (Right Aligned)
  const summaryBoxY = currentY + 2;
  const summaryWidth = 85;
  const summaryX = pageWidth - margin - summaryWidth;

  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(summaryX, summaryBoxY, summaryWidth, 26, 2, 2, 'FD');

  // Total
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Total Biaya Trip:', summaryX + 4, summaryBoxY + 5.5);
  doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.setFont('helvetica', 'bold');
  doc.text(`Rp ${booking.total_amount.toLocaleString('id-ID')}`, pageWidth - margin - 4, summaryBoxY + 5.5, {
    align: 'right',
  });

  // DP Minimum
  doc.setTextColor(amberGold[0], amberGold[1], amberGold[2]);
  doc.setFont('helvetica', 'normal');
  doc.text('Kewajiban DP:', summaryX + 4, summaryBoxY + 11.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`Rp ${booking.dp_amount.toLocaleString('id-ID')}`, pageWidth - margin - 4, summaryBoxY + 11.5, {
    align: 'right',
  });

  // Sudah Dibayar
  doc.setTextColor(22, 101, 52);
  doc.setFont('helvetica', 'normal');
  doc.text('Telah Dibayar:', summaryX + 4, summaryBoxY + 17.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`Rp ${booking.paid_amount.toLocaleString('id-ID')}`, pageWidth - margin - 4, summaryBoxY + 17.5, {
    align: 'right',
  });

  // Sisa Pelunasan
  const remaining = Math.max(0, booking.total_amount - booking.paid_amount);
  doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Sisa Pelunasan di Lokasi:', summaryX + 4, summaryBoxY + 23);
  doc.text(`Rp ${remaining.toLocaleString('id-ID')}`, pageWidth - margin - 4, summaryBoxY + 23, {
    align: 'right',
  });

  // Left side payment instructions
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(margin, summaryBoxY, contentWidth - summaryWidth - 4, 26, 2, 2, 'FD');

  doc.setTextColor(30, 64, 175);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('INFORMASI REKENING RESMI & PELUNASAN:', margin + 4, summaryBoxY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(30, 58, 138);
  doc.text('• Bank BCA: 148-092-8811 a.n PT Pasak Outdoor', margin + 4, summaryBoxY + 11);
  doc.text('• Pelunasan dapat dilakukan transfer H-1 atau tunai saat registrasi di Basecamp.', margin + 4, summaryBoxY + 16);
  doc.text('• Konfirmasi bukti bayar ke WA Official: +62 895-4226-19017', margin + 4, summaryBoxY + 21);

  // 6. RULES & CHECK-IN INSTRUCTIONS (FOOTER)
  const footerBoxY = summaryBoxY + 29;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(margin, footerBoxY, contentWidth, 22, 2, 2, 'FD');

  doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('PANDUAN & KETENTUAN CHECK-IN BASECAMP:', margin + 4, footerBoxY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text('1. Tunjukkan dokumen PDF / E-Tiket ini kepada petugas registrasi di Pos 1 Camp David.', margin + 4, footerBoxY + 9.5);
  doc.text('2. Setiap peserta wajib membawa identitas asli (KTP / SIM / Kartu Pelajar / Paspor) untuk penerbitan SIMAKSI.', margin + 4, footerBoxY + 13.5);
  doc.text('3. Dilarang membawa senjata tajam, narkotika, kembang api, dan wajib membawa kembali sampah turun ke basecamp.', margin + 4, footerBoxY + 17.5);

  // Bottom Security Line
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `E-Tiket resmi terverifikasi secara digital oleh PT. Pasak Outdoor • Dicetak pada ${new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })}`,
    pageWidth / 2,
    pageHeight - 6,
    { align: 'center' }
  );

  // SAVE AS PDF
  const filename = `E-Tiket-Papandayan-${booking.booking_code}.pdf`;
  doc.save(filename);
};

/**
 * Unified downloader: captures screen element via html2canvas or generates vector PDF
 */
export const downloadETicketPDF = async (
  element: HTMLElement | null,
  booking: Booking
): Promise<void> => {
  if (element) {
    try {
      await captureTicketPDF(element, booking);
      return;
    } catch (err) {
      console.warn('html2canvas capture had issues, falling back to direct PDF generator:', err);
    }
  }
  // Fallback to high-definition vector document
  await generateBookingPDF(booking);
};

/**
 * Helper to safely load image as HTMLImageElement for jsPDF
 */
const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = url;
  });
};

export interface InternshipReportOptions {
  reportTitle?: string;
  authorName?: string;
  authorId?: string;
  institutionName?: string;
  mentorName?: string;
  statusFilter?: string;
  dateRangeLabel?: string;
}

/**
 * Official PDF Exporter for Admin Dashboard:
 * Generates an executive, formal accounting and operational report of Firestore bookings
 * specifically designed for internship/PKL accountability, defense, and management records.
 */
export const exportBookingsReportPDF = async (
  bookings: Booking[],
  options?: InternshipReportOptions
): Promise<void> => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 297 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 210 mm
  const margin = 12;
  const contentWidth = pageWidth - margin * 2; // 273 mm

  // Palette
  const navyDark = [10, 22, 56]; // #0a1638
  const navyAccent = [15, 34, 82]; // #0f2252
  const amberGold = [217, 119, 6]; // #d97706
  const emeraldGreen = [16, 185, 129];
  const slateText = [71, 85, 105];
  const borderGray = [226, 232, 240];

  const authorName = options?.authorName || 'Nazar Fauzy';
  const authorId = options?.authorId || 'Peserta Magang IT / Web Developer';
  const institutionName = options?.institutionName || 'Praktik Kerja Lapangan (PKL) / Magang Industri';
  const mentorName = options?.mentorName || 'Pembimbing Lapangan / Admin Operasional PT. Pasak Outdoor';
  const statusFilter = options?.statusFilter || 'Semua Status Pemesanan';
  const reportTitle = options?.reportTitle || 'LAPORAN REKAPITULASI DATA PEMESANAN & TRANSAKSI OPERASIONAL TRIP';

  // Metrics calculation
  const totalBookings = bookings.length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const pendingCount = bookings.filter(b => b.status === 'waiting_payment').length;
  const completedCount = bookings.filter(b => b.status === 'completed').length;
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.status !== 'cancelled' ? b.paid_amount : 0), 0);
  const totalBill = bookings.reduce((sum, b) => sum + (b.status !== 'cancelled' ? b.total_amount : 0), 0);
  const totalPax = bookings.reduce((sum, b) => sum + (b.status !== 'cancelled' ? b.participant_count : 0), 0);

  const now = new Date();
  const printTimestamp = now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) + ' • ' + now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

  // Columns definition (Total: 273mm)
  const columns = [
    { header: 'No', width: 8, align: 'center' as const },
    { header: 'Kode Booking', width: 22, align: 'left' as const },
    { header: 'Tgl Pesan', width: 21, align: 'left' as const },
    { header: 'Paket Wisata', width: 35, align: 'left' as const },
    { header: 'Jadwal & MP', width: 30, align: 'left' as const },
    { header: 'Pemesan & Kontak (Gmail/WA)', width: 49, align: 'left' as const },
    { header: 'Pax', width: 11, align: 'center' as const },
    { header: 'Tagihan / Terbayar', width: 37, align: 'right' as const },
    { header: 'Status Reservasi', width: 28, align: 'center' as const },
    { header: 'Keterangan Riil', width: 32, align: 'left' as const },
  ];

  const renderHeader = (pageNumber: number) => {
    // Top Bar
    doc.setFillColor(navyDark[0], navyDark[1], navyDark[2]);
    doc.rect(0, 0, pageWidth, 22, 'F');

    // Accent line
    doc.setFillColor(amberGold[0], amberGold[1], amberGold[2]);
    doc.rect(0, 22, pageWidth, 1.5, 'F');

    // Brand Name
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('PT. PASAK OUTDOOR INDONESIA — PAPANDAYAN.ID', margin, 9);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(224, 242, 254);
    doc.text('Taman Wisata Alam (TWA) Gunung Papandayan 2.665 MDPL • Pos 1 Basecamp Camp David, Cisurupan, Garut, Jawa Barat', margin, 14);
    doc.text('Email: papadayanindonesia@my67.cloud | WhatsApp Resmi CS: +62 895-4226-19017 | Database: Cloud Firestore GCP', margin, 18.5);

    // Right Side Document Tag
    doc.setFillColor(amberGold[0], amberGold[1], amberGold[2]);
    doc.roundedRect(pageWidth - margin - 65, 5, 65, 12, 1.5, 1.5, 'F');
    doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('DOKUMEN RESMI LAPORAN MAGANG / PKL', pageWidth - margin - 32.5, 10, { align: 'center' });
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`Dicetak: ${printTimestamp}`, pageWidth - margin - 32.5, 14.5, { align: 'center' });
  };

  const renderFooter = (pageNumber: number, totalPagesPlaceholder: number) => {
    doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(slateText[0], slateText[1], slateText[2]);
    doc.text('Papandayan.id Cloud Management System • Terintegrasi Frontend React, Express API & Google Cloud Firestore', margin, pageHeight - 6);

    doc.text(
      `Halaman ${pageNumber} dari ${totalPagesPlaceholder} • Dokumen ini sah dan dapat dipertanggungjawabkan untuk evaluasi magang / PKL`,
      pageWidth - margin,
      pageHeight - 6,
      { align: 'right' }
    );
  };

  const renderTableHeader = (y: number) => {
    doc.setFillColor(navyAccent[0], navyAccent[1], navyAccent[2]);
    doc.rect(margin, y, contentWidth, 7, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);

    let curX = margin;
    columns.forEach(col => {
      const textX = col.align === 'center' ? curX + col.width / 2 : col.align === 'right' ? curX + col.width - 1.5 : curX + 1.5;
      doc.text(col.header, textX, y + 4.8, { align: col.align });
      curX += col.width;
    });

    return y + 7;
  };

  // PAGE 1 SETUP
  renderHeader(1);

  let curY = 27;

  // Title Section
  doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(reportTitle, margin, curY);
  curY += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text(`Rekapitulasi data transaksi dan registrasi pendakian Gunung Papandayan yang tersimpan aktif pada basis data Firestore.`, margin, curY);
  curY += 5;

  // Meta Info Box & Summary Metrics (Side by Side)
  const metaBoxWidth = 118;
  const summaryBoxWidth = contentWidth - metaBoxWidth - 4; // 151 mm

  // 1. Meta Info Box (Left)
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(margin, curY, metaBoxWidth, 19, 1.5, 1.5, 'FD');

  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.text('IDENTITAS PENYUSUN & KETERANGAN LAPORAN:', margin + 3, curY + 4);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text(`• Disusun Oleh   : `, margin + 3, curY + 8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.text(`${authorName} (${authorId})`, margin + 28, curY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text(`• Instansi/Prog  : ${institutionName}`, margin + 3, curY + 11.5);
  doc.text(`• Pembimbing     : ${mentorName}`, margin + 3, curY + 15);
  doc.text(`• Filter Data    : ${statusFilter} • Total ${totalBookings} Data Record`, margin + 3, curY + 18);

  // 2. Summary KPI Metrics (Right)
  const startSummaryX = margin + metaBoxWidth + 4;
  const kpiWidth = (summaryBoxWidth - 6) / 3;

  // KPI 1: Total Bookings
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(startSummaryX, curY, kpiWidth, 19, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text('TOTAL RESERVASI & PAX', startSummaryX + 3, curY + 4.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.text(`${totalBookings} Booking`, startSummaryX + 3, curY + 10);
  doc.setFontSize(7);
  doc.setTextColor(amberGold[0], amberGold[1], amberGold[2]);
  doc.text(`${totalPax} Orang Wisatawan`, startSummaryX + 3, curY + 15);

  // KPI 2: Total Revenue
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(startSummaryX + kpiWidth + 3, curY, kpiWidth, 19, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(6, 95, 70);
  doc.text('PENDAPATAN TERBAYAR (DP/LUNAS)', startSummaryX + kpiWidth + 6, curY + 4.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(4, 120, 87);
  doc.text(`Rp ${totalRevenue.toLocaleString('id-ID')}`, startSummaryX + kpiWidth + 6, curY + 10);
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Total Tagihan: Rp ${totalBill.toLocaleString('id-ID')}`, startSummaryX + kpiWidth + 6, curY + 15);

  // KPI 3: Status Breakdown
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(253, 230, 138);
  doc.roundedRect(startSummaryX + (kpiWidth + 3) * 2, curY, kpiWidth, 19, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(146, 64, 14);
  doc.text('STATUS PEMBAYARAN', startSummaryX + (kpiWidth + 3) * 2 + 3, curY + 4.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(180, 83, 9);
  doc.text(`${confirmedCount} Terkonfirmasi`, startSummaryX + (kpiWidth + 3) * 2 + 3, curY + 10);
  doc.setFontSize(7);
  doc.setTextColor(190, 24, 93);
  doc.text(`${pendingCount} Menunggu DP • ${completedCount} Selesai`, startSummaryX + (kpiWidth + 3) * 2 + 3, curY + 15);

  curY += 23;

  // TABLE SECTION
  curY = renderTableHeader(curY);

  let currentPage = 1;
  const rowHeight = 7.5;

  bookings.forEach((b, index) => {
    // Check page overflow
    if (curY + rowHeight > pageHeight - 20) {
      doc.addPage();
      currentPage++;
      renderHeader(currentPage);
      curY = 27;
      curY = renderTableHeader(curY);
    }

    // Zebra striping
    if (index % 2 === 0) {
      doc.setFillColor(255, 255, 255);
    } else {
      doc.setFillColor(248, 250, 252);
    }
    doc.rect(margin, curY, contentWidth, rowHeight, 'F');
    doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    doc.line(margin, curY + rowHeight, margin + contentWidth, curY + rowHeight);

    doc.setFontSize(6.5);
    doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);

    let curColX = margin;

    // 1. No
    doc.setFont('helvetica', 'normal');
    doc.text(String(index + 1), curColX + columns[0].width / 2, curY + 4.8, { align: 'center' });
    curColX += columns[0].width;

    // 2. Kode Booking
    doc.setFont('helvetica', 'bold');
    doc.text(b.booking_code, curColX + 1, curY + 4.8);
    curColX += columns[1].width;

    // 3. Tgl Pesan
    doc.setFont('helvetica', 'normal');
    const dateText = b.created_at ? b.created_at.split(' ')[0] : '-';
    doc.text(dateText, curColX + 1, curY + 4.8);
    curColX += columns[2].width;

    // 4. Paket Wisata
    doc.setFont('helvetica', 'bold');
    const pkgName = b.trip_package.name.length > 22 ? b.trip_package.name.substring(0, 20) + '..' : b.trip_package.name;
    doc.text(pkgName, curColX + 1, curY + 4.8);
    curColX += columns[3].width;

    // 5. Jadwal & MP
    doc.setFont('helvetica', 'normal');
    const schedText = b.trip_schedule_date || 'Req Khusus';
    const mpShort = b.meeting_point.length > 18 ? b.meeting_point.substring(0, 16) + '..' : b.meeting_point;
    doc.text(`${schedText} • ${mpShort}`, curColX + 1, curY + 4.8);
    curColX += columns[4].width;

    // 6. Pemesan & Kontak
    doc.setFont('helvetica', 'bold');
    const custName = b.customer_name.length > 16 ? b.customer_name.substring(0, 15) + '..' : b.customer_name;
    doc.text(custName, curColX + 1, curY + 3.2);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.8);
    doc.setTextColor(slateText[0], slateText[1], slateText[2]);
    doc.text(`${b.customer_phone} | ${b.customer_email}`, curColX + 1, curY + 6.3);
    curColX += columns[5].width;

    // 7. Pax
    doc.setFontSize(6.5);
    doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`${b.participant_count} Pax`, curColX + columns[6].width / 2, curY + 4.8, { align: 'center' });
    curColX += columns[6].width;

    // 8. Tagihan / Terbayar
    doc.setFont('helvetica', 'bold');
    doc.text(`Rp ${b.total_amount.toLocaleString('id-ID')}`, curColX + columns[7].width - 1.5, curY + 3.2, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.8);
    doc.setTextColor(b.paid_amount >= b.total_amount ? 5 : b.paid_amount > 0 ? 180 : 185, b.paid_amount >= b.total_amount ? 150 : b.paid_amount > 0 ? 83 : 28, 28);
    doc.text(`Bayar: Rp ${b.paid_amount.toLocaleString('id-ID')}`, curColX + columns[7].width - 1.5, curY + 6.3, { align: 'right' });
    curColX += columns[7].width;

    // 9. Status Reservasi
    doc.setFontSize(6.2);
    doc.setFont('helvetica', 'bold');
    if (b.status === 'confirmed') {
      doc.setFillColor(220, 252, 231);
      doc.setDrawColor(187, 247, 208);
      doc.roundedRect(curColX + 1, curY + 1.5, columns[8].width - 2, 4.5, 1, 1, 'FD');
      doc.setTextColor(22, 101, 52);
      doc.text('DIKONFIRMASI', curColX + columns[8].width / 2, curY + 4.7, { align: 'center' });
    } else if (b.status === 'waiting_payment') {
      doc.setFillColor(254, 243, 199);
      doc.setDrawColor(253, 230, 138);
      doc.roundedRect(curColX + 1, curY + 1.5, columns[8].width - 2, 4.5, 1, 1, 'FD');
      doc.setTextColor(180, 83, 9);
      doc.text('MENUNGGU DP', curColX + columns[8].width / 2, curY + 4.7, { align: 'center' });
    } else if (b.status === 'completed') {
      doc.setFillColor(238, 242, 255);
      doc.setDrawColor(199, 210, 254);
      doc.roundedRect(curColX + 1, curY + 1.5, columns[8].width - 2, 4.5, 1, 1, 'FD');
      doc.setTextColor(67, 56, 202);
      doc.text('SELESAI TRIP', curColX + columns[8].width / 2, curY + 4.7, { align: 'center' });
    } else {
      doc.setFillColor(255, 228, 230);
      doc.setDrawColor(254, 205, 211);
      doc.roundedRect(curColX + 1, curY + 1.5, columns[8].width - 2, 4.5, 1, 1, 'FD');
      doc.setTextColor(159, 18, 57);
      doc.text('DIBATALKAN', curColX + columns[8].width / 2, curY + 4.7, { align: 'center' });
    }
    curColX += columns[8].width;

    // 10. Keterangan Riil
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(5.8);
    doc.setTextColor(slateText[0], slateText[1], slateText[2]);
    const notesText = b.customer_notes ? (b.customer_notes.length > 25 ? b.customer_notes.substring(0, 23) + '..' : b.customer_notes) : 'Kondisi Prima / Standar';
    doc.text(notesText, curColX + 1, curY + 4.8);

    curY += rowHeight;
  });

  // SIGNATURE BLOCK (LEMBAR PENGESAHAN LAPORAN MAGANG)
  // Ensure enough room or add new page for signature block
  if (curY + 38 > pageHeight - 15) {
    doc.addPage();
    currentPage++;
    renderHeader(currentPage);
    curY = 32;
  } else {
    curY += 6;
  }

  // Signature Block Frame
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(margin, curY, contentWidth, 32, 2, 2, 'FD');

  const signColWidth = contentWidth / 3;

  // 1. Column 1: Disusun Oleh
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text('Garut, ' + now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), margin + signColWidth / 2, curY + 5, { align: 'center' });
  doc.text('Disusun Oleh (Peserta Magang / PKL):', margin + signColWidth / 2, curY + 9, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.text(`( ${authorName} )`, margin + signColWidth / 2, curY + 24, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text(authorId, margin + signColWidth / 2, curY + 28, { align: 'center' });

  // 2. Column 2: Diperiksa Pembimbing Lapangan
  doc.setFontSize(7);
  doc.text('Diperiksa & Diverifikasi Oleh:', margin + signColWidth + signColWidth / 2, curY + 9, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.text(`( ${mentorName.split('/')[0].trim()} )`, margin + signColWidth + signColWidth / 2, curY + 24, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text('Admin Operasional PT. Pasak Outdoor', margin + signColWidth + signColWidth / 2, curY + 28, { align: 'center' });

  // 3. Column 3: Mengetahui Pimpinan
  doc.setFontSize(7);
  doc.text('Mengetahui & Menyetujui:', margin + signColWidth * 2 + signColWidth / 2, curY + 9, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.text('( Pimpinan Pengelola Papandayan )', margin + signColWidth * 2 + signColWidth / 2, curY + 24, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text('TWA Gunung Papandayan Garut', margin + signColWidth * 2 + signColWidth / 2, curY + 28, { align: 'center' });

  // Add footers on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    renderFooter(i, totalPages);
  }

  // Save PDF
  const filename = `Laporan-Magang-Pemesanan-Papandayan-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}.pdf`;
  doc.save(filename);
};
