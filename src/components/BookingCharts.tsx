import React, { useMemo, useState } from 'react';
import { Booking } from '../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  PieChart as PieIcon,
  Calendar,
  CreditCard,
  BarChart3,
  Activity,
  Layers,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';

interface BookingChartsProps {
  bookings: Booking[];
}

// Status definitions and styling
const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  confirmed: { label: 'Terkonfirmasi', color: '#10B981', bg: 'bg-emerald-500' }, // emerald-500
  waiting_payment: { label: 'Menunggu DP/Bayar', color: '#F59E0B', bg: 'bg-amber-500' }, // amber-500
  waiting_confirmation: { label: 'Verifikasi Admin', color: '#3B82F6', bg: 'bg-blue-500' }, // blue-500
  completed: { label: 'Selesai Trip', color: '#6366F1', bg: 'bg-indigo-500' }, // indigo-500
  cancelled: { label: 'Dibatalkan', color: '#EF4444', bg: 'bg-red-500' }, // red-500
  refunded: { label: 'Refund', color: '#8B5CF6', bg: 'bg-purple-500' }, // purple-500
};

export const BookingCharts: React.FC<BookingChartsProps> = ({ bookings }) => {
  const [chartViewMode, setChartViewMode] = useState<'both' | 'daily' | 'payment'>('both');
  const [daysRange, setDaysRange] = useState<7 | 14 | 30>(7);

  // 1. Process Daily Bookings Data (Last N Days)
  const dailyData = useMemo(() => {
    // Collect dates from past N days up to today
    const dateMap: Record<string, {
      date: string;
      displayDate: string;
      total: number;
      confirmed: number;
      pending: number;
      revenue: number;
    }> = {};

    const today = new Date();
    // Default reference date to ensure mock data (around Sept 2026) or live current date is nicely populated
    for (let i = daysRange - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
      dateMap[iso] = {
        date: iso,
        displayDate: dayName,
        total: 0,
        confirmed: 0,
        pending: 0,
        revenue: 0,
      };
    }

    // Populate with real bookings
    bookings.forEach(b => {
      if (!b.created_at) return;
      const bDate = b.created_at.split('T')[0].split(' ')[0];
      if (dateMap[bDate]) {
        dateMap[bDate].total += 1;
        if (b.status === 'confirmed' || b.status === 'completed') {
          dateMap[bDate].confirmed += 1;
        } else if (b.status === 'waiting_payment' || b.status === 'waiting_confirmation') {
          dateMap[bDate].pending += 1;
        }
        if (b.status !== 'cancelled') {
          dateMap[bDate].revenue += b.paid_amount || 0;
        }
      }
    });

    // If bookings don't fall in the standard past 7 days (e.g. initial seed dates 2026-09-20..2026-09-24),
    // let's extract sorted unique dates from the actual bookings if dateMap is largely empty
    const values = Object.values(dateMap);
    const totalFilled = values.reduce((sum, item) => sum + item.total, 0);

    if (totalFilled === 0 && bookings.length > 0) {
      // Group by actual created_at dates
      const actualGroup: Record<string, typeof values[0]> = {};
      bookings.forEach(b => {
        const bDate = (b.created_at ? b.created_at.split('T')[0].split(' ')[0] : '2026-09-23');
        if (!actualGroup[bDate]) {
          const parsed = new Date(bDate);
          const displayDate = !isNaN(parsed.getTime())
            ? parsed.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })
            : bDate;
          actualGroup[bDate] = {
            date: bDate,
            displayDate,
            total: 0,
            confirmed: 0,
            pending: 0,
            revenue: 0,
          };
        }
        actualGroup[bDate].total += 1;
        if (b.status === 'confirmed' || b.status === 'completed') {
          actualGroup[bDate].confirmed += 1;
        } else if (b.status === 'waiting_payment' || b.status === 'waiting_confirmation') {
          actualGroup[bDate].pending += 1;
        }
        if (b.status !== 'cancelled') {
          actualGroup[bDate].revenue += b.paid_amount || 0;
        }
      });
      return Object.values(actualGroup).sort((a, b) => a.date.localeCompare(b.date));
    }

    return values;
  }, [bookings, daysRange]);

  // 2. Process Payment & Booking Status Distribution
  const paymentStatusData = useMemo(() => {
    const counts: Record<string, { count: number; totalPaid: number; totalNominal: number }> = {};

    bookings.forEach(b => {
      const s = b.status || 'waiting_payment';
      if (!counts[s]) {
        counts[s] = { count: 0, totalPaid: 0, totalNominal: 0 };
      }
      counts[s].count += 1;
      counts[s].totalPaid += b.paid_amount || 0;
      counts[s].totalNominal += b.total_amount || 0;
    });

    return Object.entries(counts).map(([statusKey, data]) => {
      const meta = STATUS_META[statusKey] || {
        label: statusKey,
        color: '#64748B',
        bg: 'bg-slate-500',
      };
      return {
        name: meta.label,
        rawStatus: statusKey,
        value: data.count,
        totalPaid: data.totalPaid,
        totalNominal: data.totalNominal,
        percentage: bookings.length > 0 ? ((data.count / bookings.length) * 100).toFixed(1) : '0',
        color: meta.color,
      };
    }).sort((a, b) => b.value - a.value);
  }, [bookings]);

  // 3. Payment Method breakdown
  const paymentMethodData = useMemo(() => {
    const methods: Record<string, number> = {};
    bookings.forEach(b => {
      const m = b.payment_method || 'Transfer Bank / VA';
      methods[m] = (methods[m] || 0) + 1;
    });
    return Object.entries(methods).map(([name, count]) => ({
      name,
      count,
      percentage: bookings.length > 0 ? ((count / bookings.length) * 100).toFixed(1) : '0',
    }));
  }, [bookings]);

  const totalBookingCount = bookings.length;
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.status !== 'cancelled' ? (b.paid_amount || 0) : 0), 0);

  return (
    <div className="mb-8 rounded-3xl bg-white border border-slate-200/80 shadow-md overflow-hidden">
      {/* Visual Header */}
      <div className="p-5 sm:p-6 bg-linear-to-r from-slate-900 via-navy-950 to-blue-950 text-white border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-navy-950 text-[11px] font-black uppercase tracking-wider flex items-center gap-1">
              <Activity className="w-3 h-3" />
              Recharts Visual Intelligence
            </span>
            <span className="text-xs text-blue-200 font-medium hidden sm:inline">
              Grafik Analitik Pemesanan & Pembayaran
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            Visualisasi Ringkasan Booking & Arus Kas Masuk
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Dinamika volume reservasi harian dan proporsi status pembayaran secara grafis interaktif.
          </p>
        </div>

        {/* View Switchers */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex p-1 bg-white/10 rounded-xl border border-white/15 text-xs">
            <button
              onClick={() => setChartViewMode('both')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                chartViewMode === 'both' ? 'bg-amber-400 text-navy-950 shadow-xs' : 'text-slate-200 hover:text-white'
              }`}
            >
              Semua Grafik
            </button>
            <button
              onClick={() => setChartViewMode('daily')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                chartViewMode === 'daily' ? 'bg-amber-400 text-navy-950 shadow-xs' : 'text-slate-200 hover:text-white'
              }`}
            >
              Tren Harian
            </button>
            <button
              onClick={() => setChartViewMode('payment')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                chartViewMode === 'payment' ? 'bg-amber-400 text-navy-950 shadow-xs' : 'text-slate-200 hover:text-white'
              }`}
            >
              Status Bayar
            </button>
          </div>

          <div className="inline-flex p-1 bg-white/10 rounded-xl border border-white/15 text-xs">
            {([7, 14, 30] as const).map(d => (
              <button
                key={d}
                onClick={() => setDaysRange(d)}
                className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer ${
                  daysRange === d ? 'bg-white text-navy-950 shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
                title={`Tampilkan ${d} hari terakhir`}
              >
                {d}H
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Charts */}
      <div className="p-5 sm:p-6 space-y-6 bg-slate-50/50">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart 1: Bar & Area Daily Booking Trends */}
          {(chartViewMode === 'both' || chartViewMode === 'daily') && (
            <div className={`${chartViewMode === 'both' ? 'lg:col-span-7' : 'lg:col-span-12'} bg-white p-5 rounded-2xl border border-slate-200 shadow-xs`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-navy-950">Tren Volume Pemesanan Harian</h3>
                    <p className="text-[11px] text-slate-500">
                      Jumlah booking baru (Terkonfirmasi vs Menunggu Bayar)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block"></span>
                    Terkonfirmasi
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-amber-400 inline-block"></span>
                    Menunggu DP
                  </span>
                </div>
              </div>

              {/* Recharts Bar Chart */}
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                      dataKey="displayDate"
                      tick={{ fontSize: 11, fill: '#64748B' }}
                      tickLine={false}
                      axisLine={{ stroke: '#CBD5E1' }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11, fill: '#64748B' }}
                      tickLine={false}
                      axisLine={{ stroke: '#CBD5E1' }}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-navy-950 text-white p-3 rounded-xl shadow-xl text-xs border border-white/20 min-w-[180px]">
                              <p className="font-bold text-amber-300 border-b border-white/10 pb-1 mb-1.5">
                                {label} ({data.date})
                              </p>
                              <div className="space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-slate-300">Total Reservasi:</span>
                                  <span className="font-bold text-white font-mono">{data.total} tiket</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-emerald-300">Terkonfirmasi:</span>
                                  <span className="font-bold text-emerald-400 font-mono">{data.confirmed}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-amber-300">Menunggu DP:</span>
                                  <span className="font-bold text-amber-400 font-mono">{data.pending}</span>
                                </div>
                                <div className="flex justify-between pt-1 border-t border-white/10">
                                  <span className="text-slate-300">Total Nominal:</span>
                                  <span className="font-bold text-emerald-300 font-mono">
                                    Rp {(data.revenue || 0).toLocaleString('id-ID')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="confirmed" name="Terkonfirmasi" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="pending" name="Menunggu Bayar" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Area Chart: Pendapatan Harian */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                    Arus Kas Masuk Harian (Rp)
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Total: Rp {dailyData.reduce((s, d) => s + (d.revenue || 0), 0).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="w-full h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="displayDate" hide />
                      <YAxis hide />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const d = payload[0].payload;
                            return (
                              <div className="bg-navy-950 text-white px-2.5 py-1.5 rounded-lg text-xs font-mono">
                                <span>{d.displayDate}: </span>
                                <strong className="text-emerald-300">Rp {(d.revenue || 0).toLocaleString('id-ID')}</strong>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#revenueGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Chart 2: Donut / Pie Status Pembayaran */}
          {(chartViewMode === 'both' || chartViewMode === 'payment') && (
            <div className={`${chartViewMode === 'both' ? 'lg:col-span-5' : 'lg:col-span-12'} bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between`}>
              <div>
                <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                      <PieIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-navy-950">Proporsi Status Pembayaran</h3>
                      <p className="text-[11px] text-slate-500">
                        Distribusi pesanan berdasarkan status transaksi
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold bg-slate-100 text-navy-950 px-2 py-0.5 rounded-md">
                    {totalBookingCount} Pesanan
                  </span>
                </div>

                {/* Pie Chart */}
                <div className="w-full h-56 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {paymentStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-navy-950 text-white p-2.5 rounded-xl shadow-lg text-xs border border-white/20">
                                <p className="font-bold flex items-center gap-1.5" style={{ color: data.color }}>
                                  <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: data.color }}></span>
                                  {data.name}
                                </p>
                                <p className="text-slate-300 mt-1 font-mono">
                                  {data.value} Pesanan ({data.percentage}%)
                                </p>
                                <p className="text-emerald-300 font-mono text-[11px]">
                                  Kas: Rp {(data.totalPaid || 0).toLocaleString('id-ID')}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Centered Total Counter */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                    <span className="text-2xl font-black text-navy-950 font-mono leading-none">
                      {totalBookingCount}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                      Total Booking
                    </span>
                  </div>
                </div>

                {/* Status Legend Breakdown */}
                <div className="mt-4 space-y-2 pt-2 border-t border-slate-100">
                  {paymentStatusData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-slate-50 transition">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                        <span className="font-bold text-slate-800">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 font-mono text-[11px]">{item.percentage}%</span>
                        <span className="font-bold text-navy-950 font-mono px-2 py-0.5 bg-slate-100 rounded-md text-[11px]">
                          {item.value} tiket
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Insight Footnote */}
              <div className="mt-4 p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-[11px] text-blue-900 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Rasio Konversi Pembayaran:</strong>
                  <span>
                    Sebesar{' '}
                    <strong>
                      {totalBookingCount > 0
                        ? (
                            (paymentStatusData.filter(p => p.rawStatus === 'confirmed' || p.rawStatus === 'completed')
                              .reduce((s, p) => s + p.value, 0) /
                              totalBookingCount) *
                            100
                          ).toFixed(1)
                        : 0}
                      %
                    </strong>{' '}
                    pesanan berhasil dikonfirmasi dan diverifikasi admin.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
