import React, { useState, useMemo } from 'react';
import { TripSchedule } from '../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Check, 
  Users, 
  AlertCircle, 
  Sparkles, 
  Clock, 
  List, 
  Grid,
  ShieldCheck
} from 'lucide-react';

interface TripCalendarPickerProps {
  packageType: 'scheduled' | 'private' | 'custom';
  schedules: TripSchedule[];
  selectedScheduleId: number;
  onSelectSchedule: (scheduleId: number) => void;
  customDate: string; // 'YYYY-MM-DD'
  onSelectCustomDate: (dateStr: string) => void;
  participantCount?: number;
}

const MONTH_NAMES_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAY_NAMES_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export const TripCalendarPicker: React.FC<TripCalendarPickerProps> = ({
  packageType,
  schedules,
  selectedScheduleId,
  onSelectSchedule,
  customDate,
  onSelectCustomDate,
  participantCount = 1
}) => {
  // Determine initial calendar month and year based on selected schedule or custom date
  const initialDate = useMemo(() => {
    if (packageType === 'scheduled' && schedules.length > 0) {
      const active = schedules.find(s => s.id === selectedScheduleId) || schedules[0];
      if (active && active.trip_date) {
        const [y, m] = active.trip_date.split('-').map(Number);
        return new Date(y, m - 1, 1);
      }
    } else if (packageType === 'private' && customDate) {
      const [y, m] = customDate.split('-').map(Number);
      if (y && m) {
        return new Date(y, m - 1, 1);
      }
    }
    return new Date();
  }, [packageType, schedules, selectedScheduleId, customDate]);

  const [currentYear, setCurrentYear] = useState<number>(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(initialDate.getMonth());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleJumpToNearestSchedule = () => {
    if (schedules.length > 0) {
      const nearest = schedules.find(s => s.kuota_tersedia > 0) || schedules[0];
      const [y, m] = nearest.trip_date.split('-').map(Number);
      setCurrentYear(y);
      setCurrentMonth(m - 1);
      onSelectSchedule(nearest.id);
    }
  };

  // Build calendar matrix
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Create schedule lookup map: 'YYYY-MM-DD' => TripSchedule
  const scheduleMap = useMemo(() => {
    const map = new Map<string, TripSchedule>();
    schedules.forEach(sch => {
      map.set(sch.trip_date, sch);
    });
    return map;
  }, [schedules]);

  // Selected schedule details
  const selectedSchedule = useMemo(() => {
    return schedules.find(s => s.id === selectedScheduleId);
  }, [schedules, selectedScheduleId]);

  // Format Helper
  const formatIndonesianFullDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Today check
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <div className="bg-slate-50 border border-navy-100 rounded-2xl p-4 sm:p-5 shadow-xs transition-all">
      {/* Top Header: Title & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 font-bold">
              <CalendarIcon className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-navy-950">
              {packageType === 'scheduled' ? 'Pilih Jadwal Keberangkatan (Kalender Visual)' : 'Pilih Tanggal Private Trip'}
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {packageType === 'scheduled' 
              ? 'Pilih tanggal berindikator hijau untuk melihat sisa kuota dan memesan slot secara real-time.' 
              : 'Klik tanggal mana pun yang Anda kehendaki untuk keberangkatan grup private Anda.'}
          </p>
        </div>

        {/* View mode toggle (for scheduled) */}
        {packageType === 'scheduled' && (
          <div className="flex items-center bg-white p-1 rounded-xl border border-navy-100 shadow-2xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                viewMode === 'calendar'
                  ? 'bg-[#0f2252] text-amber-400 shadow-xs'
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Kalender</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                viewMode === 'list'
                  ? 'bg-[#0f2252] text-amber-400 shadow-xs'
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Daftar</span>
            </button>
          </div>
        )}
      </div>

      {viewMode === 'calendar' ? (
        <div>
          {/* Month & Year Navigation Bar */}
          <div className="flex items-center justify-between bg-white border border-navy-100 rounded-xl px-4 py-2.5 mb-3 shadow-2xs">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-navy-900 transition flex items-center gap-1 text-xs font-semibold"
              title="Bulan sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>

            <div className="text-center">
              <span className="font-extrabold text-navy-950 text-sm sm:text-base">
                {MONTH_NAMES_ID[currentMonth]} {currentYear}
              </span>
              {packageType === 'scheduled' && schedules.some(s => s.trip_date.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`)) && (
                <span className="ml-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Ada Jadwal Open
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {packageType === 'scheduled' && (
                <button
                  type="button"
                  onClick={handleJumpToNearestSchedule}
                  className="hidden md:flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 transition"
                  title="Lompat ke jadwal terdekat yang tersedia"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Jadwal Terdekat
                </button>
              )}
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-navy-900 transition flex items-center gap-1 text-xs font-semibold"
                title="Bulan berikutnya"
              >
                <span className="hidden sm:inline">Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid Container */}
          <div className="bg-white border border-navy-100 rounded-2xl p-2.5 sm:p-4 shadow-2xs overflow-hidden">
            {/* Day of Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs mb-2">
              {DAY_NAMES_ID.map((dayName, idx) => (
                <div 
                  key={dayName} 
                  className={`py-1.5 text-[11px] uppercase tracking-wider ${
                    idx === 0 ? 'text-rose-500' : idx === 6 ? 'text-amber-600' : 'text-slate-500'
                  }`}
                >
                  {dayName}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
              {/* Previous Month trailing days */}
              {Array.from({ length: firstDayOfWeek }).map((_, i) => {
                const prevDay = daysInPrevMonth - firstDayOfWeek + i + 1;
                return (
                  <div
                    key={`prev-${i}`}
                    className="min-h-[58px] sm:min-h-[68px] p-1 sm:p-1.5 rounded-xl border border-transparent bg-slate-50/40 text-slate-300 text-[11px] flex flex-col justify-start select-none opacity-40"
                  >
                    <span>{prevDay}</span>
                  </div>
                );
              })}

              {/* Current Month days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isPast = dateKey < todayStr;
                const isToday = dateKey === todayStr;
                const dayOfWeek = (firstDayOfWeek + i) % 7;
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

                if (packageType === 'scheduled') {
                  const schedule = scheduleMap.get(dateKey);
                  const hasSchedule = !!schedule;
                  const isAvailable = hasSchedule && schedule.kuota_tersedia > 0;
                  const isSelected = hasSchedule && selectedScheduleId === schedule.id;

                  return (
                    <div
                      key={`day-${day}`}
                      onClick={() => {
                        if (hasSchedule && isAvailable) {
                          onSelectSchedule(schedule.id);
                        }
                      }}
                      className={`min-h-[58px] sm:min-h-[72px] p-1 sm:p-1.5 rounded-xl border text-left flex flex-col justify-between transition relative ${
                        isSelected
                          ? 'border-[#0f2252] bg-navy-50/80 ring-2 ring-[#0f2252] shadow-sm z-10'
                          : isAvailable
                          ? 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/60 hover:border-emerald-400 cursor-pointer shadow-2xs'
                          : hasSchedule
                          ? 'border-rose-200 bg-rose-50/40 opacity-75 cursor-not-allowed'
                          : 'border-slate-100 bg-white text-slate-400 hover:bg-slate-50/60'
                      }`}
                    >
                      {/* Top row: day number & badge */}
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-xs font-bold leading-none ${
                          isSelected
                            ? 'text-navy-950 font-black'
                            : isAvailable
                            ? 'text-emerald-950'
                            : hasSchedule
                            ? 'text-rose-900'
                            : isWeekend
                            ? 'text-amber-700'
                            : 'text-slate-600'
                        }`}>
                          {day}
                        </span>

                        {isToday && (
                          <span className="text-[8px] font-bold bg-amber-400 text-navy-950 px-1 py-0.2 rounded-md">
                            Hari ini
                          </span>
                        )}
                      </div>

                      {/* Middle/Bottom: Schedule indicator */}
                      {hasSchedule ? (
                        <div className="mt-1">
                          {isAvailable ? (
                            <div>
                              <div className={`flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold px-1 sm:px-1.5 py-0.5 rounded-md ${
                                isSelected
                                  ? 'bg-[#0f2252] text-amber-400'
                                  : 'bg-emerald-600 text-white shadow-2xs'
                              }`}>
                                <Users className="w-2.5 h-2.5 hidden sm:inline" />
                                <span>{schedule.kuota_tersedia} slot</span>
                              </div>
                              <span className="text-[9px] text-emerald-800 font-semibold hidden sm:block mt-0.5 pl-0.5">
                                Open Trip
                              </span>
                            </div>
                          ) : (
                            <span className="text-[9px] sm:text-[10px] font-bold text-rose-700 bg-rose-100 px-1 py-0.5 rounded-md block text-center">
                              Penuh
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="h-4" />
                      )}

                      {/* Selected tick badge */}
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#0f2252] text-amber-400 flex items-center justify-center shadow-xs">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                } else {
                  // Private trip mode (any future date is selectable)
                  const isSelected = customDate === dateKey;

                  return (
                    <button
                      key={`day-${day}`}
                      type="button"
                      disabled={isPast}
                      onClick={() => onSelectCustomDate(dateKey)}
                      className={`min-h-[58px] sm:min-h-[66px] p-1 sm:p-1.5 rounded-xl border text-left flex flex-col justify-between transition relative ${
                        isSelected
                          ? 'border-[#0f2252] bg-navy-50/90 ring-2 ring-[#0f2252] shadow-sm z-10'
                          : isPast
                          ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed opacity-50'
                          : isWeekend
                          ? 'border-amber-200/70 bg-amber-50/30 hover:bg-amber-100/50 hover:border-amber-400 cursor-pointer'
                          : 'border-slate-200/80 bg-white hover:bg-navy-50/40 hover:border-navy-300 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-xs font-bold leading-none ${
                          isSelected
                            ? 'text-[#0f2252] font-black'
                            : isPast
                            ? 'text-slate-300'
                            : isWeekend
                            ? 'text-amber-800'
                            : 'text-navy-900'
                        }`}>
                          {day}
                        </span>

                        {isToday && (
                          <span className="text-[8px] font-bold bg-amber-400 text-navy-950 px-1 rounded-sm">
                            Hari ini
                          </span>
                        )}
                      </div>

                      <div className="mt-1">
                        {isSelected ? (
                          <span className="text-[9px] sm:text-[10px] font-extrabold bg-[#0f2252] text-amber-400 px-1.5 py-0.5 rounded-md inline-block">
                            Terpilih
                          </span>
                        ) : isWeekend && !isPast ? (
                          <span className="text-[9px] font-semibold text-amber-700 bg-amber-100/70 px-1 py-0.2 rounded-sm hidden sm:inline-block">
                            Weekend
                          </span>
                        ) : null}
                      </div>

                      {isSelected && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#0f2252] text-amber-400 flex items-center justify-center shadow-xs">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                }
              })}
            </div>

            {/* Visual Legend Bar */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 px-1">
              <div className="flex flex-wrap items-center gap-3">
                {packageType === 'scheduled' ? (
                  <>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-md bg-emerald-600 border border-emerald-700"></span>
                      <span className="font-semibold text-emerald-900">Tersedia (Bisa Dipesan)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-md bg-rose-200 border border-rose-300"></span>
                      <span className="font-semibold text-rose-800">Slot Penuh</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-amber-100 border border-amber-300"></span>
                    <span className="font-semibold text-amber-800">Weekend (Rekomendasi)</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-[#0f2252] border border-amber-400"></span>
                  <span className="font-bold text-navy-950">Tanggal Terpilih</span>
                </div>
              </div>

              <span className="text-[10px] text-slate-400">
                Pembaruan kuota terintegrasi real-time
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* List Mode for Scheduled Trips */
        <div className="space-y-2.5">
          {schedules.map((sch) => {
            const isAvailable = sch.kuota_tersedia > 0;
            const isSelected = selectedScheduleId === sch.id;
            return (
              <button
                key={sch.id}
                type="button"
                disabled={!isAvailable}
                onClick={() => onSelectSchedule(sch.id)}
                className={`w-full p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
                  isSelected
                    ? 'border-[#0f2252] bg-navy-50 text-navy-950 ring-2 ring-[#0f2252] shadow-xs'
                    : isAvailable
                    ? 'border-navy-100 bg-white hover:border-navy-300 text-navy-900 shadow-2xs'
                    : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#0f2252] text-amber-400' : 'bg-slate-100 text-slate-600'}`}>
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-navy-950">
                      {formatIndonesianFullDate(sch.trip_date)}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {isAvailable ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Tersedia {sch.kuota_tersedia} dari {sch.quota_total} Kuota
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[11px] text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                          Slot Kuota Penuh
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isSelected && (
                    <span className="text-xs font-bold text-[#0f2252] bg-amber-400 px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Dipilih
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Selected Date Information Card */}
      <div className="mt-3 bg-white border border-navy-100 rounded-xl p-3.5 sm:p-4 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">
              Jadwal Trip Terpilih:
            </span>
            <p className="text-sm sm:text-base font-extrabold text-[#0f2252]">
              {packageType === 'scheduled'
                ? selectedSchedule
                  ? formatIndonesianFullDate(selectedSchedule.trip_date)
                  : 'Belum memilih jadwal'
                : formatIndonesianFullDate(customDate) || 'Belum memilih tanggal'}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {packageType === 'scheduled' && selectedSchedule && (
                <>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Sisa Kuota: {selectedSchedule.kuota_tersedia} Peserta
                  </span>
                  {participantCount > selectedSchedule.kuota_tersedia && (
                    <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Jumlah rombongan ({participantCount}) melebihi sisa kuota!
                    </span>
                  )}
                </>
              )}
              {packageType === 'private' && (
                <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  Eksklusif Grup Private (Bebas Pilih Tanggal)
                </span>
              )}
            </div>
          </div>
        </div>

        {packageType === 'private' && (
          <div className="w-full sm:w-auto text-left sm:text-right">
            <span className="text-[10px] text-slate-400 block font-medium">Input Manual (Opsional):</span>
            <input
              type="date"
              value={customDate}
              min={todayStr}
              onChange={(e) => onSelectCustomDate(e.target.value)}
              className="mt-0.5 text-xs font-semibold text-navy-900 border border-navy-200 rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-navy-900 bg-slate-50"
            />
          </div>
        )}
      </div>
    </div>
  );
};
