import React, { useState } from 'react';
import {
  Clock,
  Layers,
  Users,
  Download,
  CalendarCheck,
  MapPin,
  Building2,
  Filter,
  Check,
  BarChart3,
  LayoutGrid,
  Table as TableIcon,
  Sparkles
} from 'lucide-react';
import { WeekSummary, LocationSummary } from '../types';
import { formatHours, formatSquareMeters } from '../utils/calculations';

interface WeekSummaryBannerProps {
  summary: WeekSummary;
  onExportCSV: () => void;
  onViewReport: () => void;
  selectedLocation?: string | null;
  onSelectLocation?: (location: string | null) => void;
}

export const WeekSummaryBanner: React.FC<WeekSummaryBannerProps> = ({
  summary,
  onExportCSV,
  onViewReport,
  selectedLocation = null,
  onSelectLocation,
}) => {
  const [locationsViewMode, setLocationsViewMode] = useState<'cards' | 'table'>('cards');

  const maxDailyHours = Math.max(...summary.days.map((d) => d.totalHours), 1);
  const maxDailySqm = Math.max(...summary.days.map((d) => d.totalSquareMeters), 1);

  // If a specific location is selected, find its summary
  const activeLocationSummary = selectedLocation
    ? summary.locationSummaries.find((l) => l.location === selectedLocation)
    : null;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 mb-6 text-white shadow-xl relative overflow-hidden space-y-6">
      {/* Background Decorative Accent */}
      <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 -top-10 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADER: Title, Date Range & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-xs uppercase tracking-wider border border-amber-500/30">
              Підсумки {summary.weekNumber}-го тижня
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {summary.formattedRange}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Два незалежних підсумки за тиждень
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Окремий облік людино-годин бригади та окремий облік збудованих квадратних метрів (м²) як загалом, так і окремо по кожному об'єкту.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start lg:self-center">
          <button
            onClick={onExportCSV}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            title="Завантажити таблицю CSV з даними за цей тиждень"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Експорт CSV</span>
          </button>
          <button
            onClick={onViewReport}
            className="px-3.5 py-2 rounded-xl bg-slate-700/90 hover:bg-slate-600 border border-slate-600 text-xs font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            title="Детальний тижневий табель і звіт за об'єктами"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Повний табель-звіт</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: ЗАГАЛЬНИЙ ПІДСУМОК (ТАК ЯК Є) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-amber-400" />
            1. Загальний підсумок тижня (всі об'єкти та вся бригада)
          </span>
          {selectedLocation && (
            <span className="text-xs text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Показано загальні показники, обрано об'єкт: {selectedLocation}
            </span>
          )}
        </div>

        {/* Main 4 KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* РОЗРАХУНОК 1: Людино-години */}
          <div className="bg-slate-950/70 border border-amber-500/40 rounded-xl p-4 flex flex-col justify-between shadow-inner hover:border-amber-500/60 transition">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span className="uppercase tracking-wider text-amber-400">Розрахунок 1: Години</span>
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">
                {formatHours(summary.totalManHours)}
              </span>
              <span className="text-xs font-semibold text-slate-400">люд.-год.</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Відпрацьований час</span>
              <span className="text-amber-300 font-medium">
                {summary.daysWithHours} днів робіт
              </span>
            </div>
          </div>

          {/* РОЗРАХУНОК 2: Збудовані квадратні метри */}
          <div className="bg-slate-950/70 border border-emerald-500/40 rounded-xl p-4 flex flex-col justify-between shadow-inner hover:border-emerald-500/60 transition">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span className="uppercase tracking-wider text-emerald-400">Розрахунок 2: Площа</span>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
                {formatSquareMeters(summary.totalSquareMeters)}
              </span>
              <span className="text-xs font-semibold text-slate-400">м²</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Збудований обсяг</span>
              <span className="text-emerald-300 font-medium">
                {summary.daysWithSquareMeters} днів кладки/монтажу
              </span>
            </div>
          </div>

          {/* ДЕ ВИКОНУВАЛИСЬ РОБОТИ (Локації та об'єкти) */}
          <div className="bg-slate-950/70 border border-sky-500/30 rounded-xl p-4 flex flex-col justify-between shadow-inner hover:border-sky-500/50 transition">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span className="uppercase tracking-wider text-sky-400">Де виконувались роботи</span>
              <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-sky-400 tracking-tight">
                {summary.uniqueLocationsCount}
              </span>
              <span className="text-xs font-semibold text-slate-400">об'єктів</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Будівельні майданчики</span>
              <span className="text-sky-300 font-medium">{summary.totalEntries} робіт</span>
            </div>
          </div>

          {/* БРИГАДА */}
          <div className="bg-slate-950/70 border border-purple-500/30 rounded-xl p-4 flex flex-col justify-between shadow-inner hover:border-purple-500/50 transition">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span className="uppercase tracking-wider text-purple-400">Працівників у бригаді</span>
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-purple-400 tracking-tight">
                {summary.uniqueEmployeesCount}
              </span>
              <span className="text-xs font-semibold text-slate-400">майстрів</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Працювали на об'єктах</span>
              <span className="text-purple-300 font-medium">Цього тижня</span>
            </div>
          </div>
        </div>

        {/* Daily Progress Dual Tracks (Години окремо, Квадратні метри окремо) */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Щоденні графіки: Години (жовтий) та Збудовані м² (зелений)</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block" /> Розрахунок 1: Години
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 inline-block" /> Розрахунок 2: Метри кв.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {summary.days.map((day) => {
              const hoursRatio = maxDailyHours > 0 ? (day.totalHours / maxDailyHours) * 100 : 0;
              const sqmRatio = maxDailySqm > 0 ? (day.totalSquareMeters / maxDailySqm) * 100 : 0;

              return (
                <div
                  key={day.date}
                  className="bg-slate-950/60 rounded-lg p-2 border border-slate-800/80 flex flex-col justify-between text-center"
                >
                  <div className="text-[11px] font-semibold text-slate-300">
                    {day.shortDayName}
                  </div>
                  <div className="text-[10px] text-slate-400 mb-2">
                    {day.displayDate.split(' ')[0]}
                  </div>

                  {/* Dual Mini Visual Bars */}
                  <div className="h-10 flex items-end justify-center gap-1 my-1 px-1">
                    <div
                      className="w-2.5 bg-amber-400/90 hover:bg-amber-300 rounded-t transition-all"
                      style={{ height: `${Math.max(hoursRatio, 8)}%` }}
                      title={`${day.dayName}: ${day.totalHours} год.`}
                    />
                    <div
                      className="w-2.5 bg-emerald-400/90 hover:bg-emerald-300 rounded-t transition-all"
                      style={{ height: `${Math.max(sqmRatio, 8)}%` }}
                      title={`${day.dayName}: ${day.totalSquareMeters} м²`}
                    />
                  </div>

                  <div className="mt-1 space-y-0.5 text-[10px]">
                    <div className="font-bold text-amber-400">{day.totalHours} год.</div>
                    <div className="font-bold text-emerald-400">{day.totalSquareMeters} м²</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 2: ОКРЕМИЙ ПІДСУМОК ЗА РІЗНИМИ ЛОКАЦІЯМИ / ОБ'ЄКТАМИ */}
      <div className="pt-4 border-t border-slate-700/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-400" />
                2. Окремий підсумок по кожному об'єкту / локації ({summary.locationSummaries.length} об'єктів)
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Окремі розрахунки
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Людино-години та збудовані квадратні метри пораховано незалежно для кожного будівельного майданчика.
            </p>
          </div>

          {/* View Mode Toggle: Cards vs Table */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setLocationsViewMode('cards')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  locationsViewMode === 'cards'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Відобразити картками"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Картки об'єктів</span>
              </button>
              <button
                type="button"
                onClick={() => setLocationsViewMode('table')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  locationsViewMode === 'table'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Відобразити зведеною таблицею"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Зведена таблиця</span>
              </button>
            </div>
          </div>
        </div>

        {/* Location Filter Chips Bar */}
        {onSelectLocation && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-thin">
            <span className="text-[11px] text-slate-400 shrink-0 font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-slate-500" />
              Швидкий вибір:
            </span>
            <button
              onClick={() => onSelectLocation(null)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                selectedLocation === null
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-950/70 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              <span>Всі об'єкти ({summary.locationSummaries.length})</span>
            </button>

            {summary.locationSummaries.map((loc) => {
              const isSelected = selectedLocation === loc.location;
              return (
                <button
                  key={loc.location}
                  onClick={() => onSelectLocation(isSelected ? null : loc.location)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-sky-500 text-slate-950 font-bold shadow-md ring-1 ring-sky-300'
                      : 'bg-slate-950/70 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <MapPin className={`w-3 h-3 ${isSelected ? 'text-slate-950' : 'text-sky-400'}`} />
                  <span className="truncate max-w-[140px] sm:max-w-[200px]">{loc.location}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                      isSelected ? 'bg-slate-900/40 text-slate-950' : 'bg-slate-800 text-amber-300'
                    }`}
                  >
                    {loc.totalHours}г / {loc.totalSquareMeters}м²
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* View 1: Separate Cards for each location */}
        {locationsViewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {summary.locationSummaries.map((loc) => {
              const isSelected = selectedLocation === loc.location;

              return (
                <div
                  key={loc.location}
                  className={`bg-slate-950/80 rounded-xl p-4 border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-sky-400 bg-sky-950/20 shadow-lg shadow-sky-500/10 ring-1 ring-sky-400/50'
                      : 'border-slate-800/90 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <div>
                    {/* Card Header: Location Name & Counts */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="p-1.5 rounded-lg bg-sky-500/15 text-sky-400 shrink-0">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <h4
                          className="font-bold text-sm text-white truncate"
                          title={loc.location}
                        >
                          {loc.location}
                        </h4>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800 shrink-0">
                        {loc.entryCount} записів
                      </span>
                    </div>

                    {/* ДВА НЕЗАЛЕЖНИХ РОЗРАХУНКИ ДЛЯ ЦЬОГО ОБ'ЄКТА */}
                    <div className="grid grid-cols-2 gap-2 mt-3 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 text-center">
                      {/* Розрахунок 1: Години */}
                      <div className="p-1.5 rounded bg-slate-950/60 border border-slate-800">
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1 font-semibold truncate">
                          <Clock className="w-2.5 h-2.5 text-amber-400 shrink-0" /> Години
                        </span>
                        <div className="mt-0.5 text-base sm:text-lg font-black text-amber-400">
                          {formatHours(loc.totalHours)} <span className="text-[10px] font-medium text-slate-400">год.</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {loc.percentageOfHours}% від тижня
                        </div>
                      </div>

                      {/* Розрахунок 2: Квадратні метри */}
                      <div className="p-1.5 rounded bg-slate-950/60 border border-slate-800">
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1 font-semibold truncate">
                          <Layers className="w-2.5 h-2.5 text-emerald-400 shrink-0" /> Збудовано
                        </span>
                        <div className="mt-0.5 text-base sm:text-lg font-black text-emerald-400">
                          {formatSquareMeters(loc.totalSquareMeters)} <span className="text-[10px] font-medium text-slate-400">м²</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {loc.percentageOfSquareMeters}% від тижня
                        </div>
                      </div>
                    </div>

                    {/* 7-Day Mini Track for this location */}
                    <div className="mt-3 pt-2.5 border-t border-slate-800/70">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span>Дні роботи на об'єкті ({loc.daysWorkedCount} дн.):</span>
                        <span className="text-[9px] text-amber-300">Пн - Нд</span>
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center">
                        {summary.days.map((d) => {
                          const h = loc.dayHours[d.date] || 0;
                          const sqm = loc.daySquareMeters[d.date] || 0;
                          const hasWork = h > 0 || sqm > 0;

                          return (
                            <div
                              key={d.date}
                              className={`p-1 rounded text-[10px] border flex flex-col justify-between ${
                                hasWork
                                  ? 'bg-slate-900 border-slate-700'
                                  : 'bg-slate-950/40 border-slate-800/40 opacity-40'
                              }`}
                              title={`${d.dayName}: ${h} год., ${sqm} м²`}
                            >
                              <span className="text-[9px] text-slate-400 font-medium leading-none">
                                {d.shortDayName}
                              </span>
                              <span className="text-[8px] text-amber-300/80 font-semibold leading-none mt-0.5">
                                {d.date.split('-')[2]}
                              </span>
                              {hasWork ? (
                                <div className="space-y-0.5 mt-0.5 font-bold">
                                  {h > 0 && <span className="block text-[9px] text-amber-400">{h}г</span>}
                                  {sqm > 0 && <span className="block text-[9px] text-emerald-400">{sqm}м²</span>}
                                </div>
                              ) : (
                                <span className="text-slate-600 mt-1">—</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Workers at this location */}
                    <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-300 truncate">
                      <Users className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="text-slate-400 text-[11px] shrink-0">Майстри:</span>
                      <span className="text-[11px] font-medium text-slate-200 truncate" title={loc.employees.join(', ')}>
                        {loc.employees.join(', ')}
                      </span>
                    </div>

                    {/* Categories at this location */}
                    {loc.categories.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {loc.categories.map((c) => (
                          <span
                            key={c}
                            className="text-[10px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800 truncate"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Filter action */}
                  {onSelectLocation && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800/70 flex items-center justify-between">
                      <button
                        onClick={() => onSelectLocation(isSelected ? null : loc.location)}
                        className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          isSelected
                            ? 'bg-sky-500 text-slate-950 font-bold'
                            : 'bg-slate-900 hover:bg-slate-850 text-sky-300 hover:text-white border border-slate-700/80'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Обрано для календаря (показати всі)</span>
                          </>
                        ) : (
                          <>
                            <Filter className="w-3.5 h-3.5" />
                            <span>Показати в календарі тільки цей об'єкт</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* View 2: Compact comparative table for all locations */}
        {locationsViewMode === 'table' && (
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80 shadow-md">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-900 text-slate-300 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Об'єкт / Локація</th>
                  <th className="py-2.5 px-3 text-center">Записів</th>
                  <th className="py-2.5 px-3">Задіяні працівники</th>
                  <th className="py-2.5 px-3 text-right text-amber-400">Розрахунок 1 (Години)</th>
                  <th className="py-2.5 px-3 text-right text-emerald-400">Розрахунок 2 (Збудовано)</th>
                  <th className="py-2.5 px-3 text-right">Частка площі</th>
                  {onSelectLocation && <th className="py-2.5 px-3 text-center">Дія</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {summary.locationSummaries.map((loc) => {
                  const isSelected = selectedLocation === loc.location;
                  return (
                    <tr
                      key={loc.location}
                      className={`hover:bg-slate-850/60 transition ${
                        isSelected ? 'bg-sky-950/30' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-semibold text-white flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span className="truncate max-w-[220px]" title={loc.location}>
                          {loc.location}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center text-xs text-slate-400 font-medium">
                        {loc.entryCount}
                      </td>
                      <td className="py-2.5 px-3 text-xs text-slate-300 max-w-[200px] truncate" title={loc.employees.join(', ')}>
                        {loc.employees.join(', ')}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-amber-400">
                        {formatHours(loc.totalHours)} год.
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {loc.percentageOfHours}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                        {formatSquareMeters(loc.totalSquareMeters)} м²
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {loc.percentageOfSquareMeters}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right text-xs text-slate-300">
                        {loc.percentageOfSquareMeters}%
                      </td>
                      {onSelectLocation && (
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => onSelectLocation(isSelected ? null : loc.location)}
                            className={`px-2 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                              isSelected
                                ? 'bg-sky-500 text-slate-950'
                                : 'bg-slate-800 hover:bg-slate-700 text-sky-300'
                            }`}
                          >
                            {isSelected ? 'Скинути' : 'Фільтр'}
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-900 font-bold border-t-2 border-slate-700">
                <tr>
                  <td className="py-2.5 px-3 text-white" colSpan={3}>
                    ВСЬОГО ЗА ТИЖДЕНЬ ПО ВСІХ {summary.locationSummaries.length} ОБ'ЄКТАХ
                  </td>
                  <td className="py-2.5 px-3 text-right text-amber-400 font-black">
                    {formatHours(summary.totalManHours)} год.
                  </td>
                  <td className="py-2.5 px-3 text-right text-emerald-400 font-black">
                    {formatSquareMeters(summary.totalSquareMeters)} м²
                  </td>
                  <td className="py-2.5 px-3 text-right text-white">
                    100%
                  </td>
                  {onSelectLocation && <td></td>}
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
