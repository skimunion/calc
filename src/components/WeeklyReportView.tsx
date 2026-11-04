import React from 'react';
import {
  Printer,
  Download,
  Clock,
  Layers,
  Users,
  Calendar,
  Building2,
  MapPin
} from 'lucide-react';
import { WeekSummary, WorkEntry } from '../types';
import { formatHours, formatSquareMeters } from '../utils/calculations';

interface WeeklyReportViewProps {
  summary: WeekSummary;
  allEntries: WorkEntry[];
  onExportCSV: () => void;
  onPrint: () => void;
}

export const WeeklyReportView: React.FC<WeeklyReportViewProps> = ({
  summary,
  onExportCSV,
  onPrint,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner & Print Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white print:border-none print:p-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Підсумковий звіт за тиждень
            </span>
            <span className="text-xs text-slate-400">
              Тиждень {summary.weekNumber} • {summary.year}
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Окремий облік людино-годин та збудованих квадратних метрів
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Офіційний табель відпрацьованого часу, відомість виконаної площі та об'єкти виконання робіт за період {summary.formattedRange}.
          </p>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          <button
            onClick={onExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-2 transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Завантажити CSV</span>
          </button>
          <button
            onClick={onPrint}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Роздрукувати звіт</span>
          </button>
        </div>
      </div>

      {/* Printable Report Paper Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8 text-white shadow-xl print:bg-white print:text-black print:border-none print:p-2 print:shadow-none">
        {/* Printable Formal Header */}
        <div className="border-b border-slate-800 print:border-gray-300 pb-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-white border border-amber-500/40 p-1 flex items-center justify-center shadow-sm overflow-hidden shrink-0 print:border-gray-400">
                <img
                  src="/logo.png"
                  alt="CICWMA Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black tracking-wider text-amber-400 print:text-black uppercase">
                    CICWMA
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white print:text-black">
                  Звіт виконання робіт: Години та Квадратні метри
                </h1>
                <p className="text-xs text-slate-400 print:text-gray-600">
                  Табель трудомісткості та відомість збудованої площі за об'єктами
                </p>
              </div>
            </div>

            <div className="text-right text-xs text-slate-400 print:text-gray-600">
              <div><strong className="text-white print:text-black">Період звітності:</strong> {summary.formattedRange}</div>
              <div><strong className="text-white print:text-black">Календарний тиждень:</strong> {summary.weekNumber}-й тиждень ({summary.year})</div>
              <div><strong className="text-white print:text-black">Дата формування:</strong> {new Date().toLocaleDateString('uk-UA')}</div>
            </div>
          </div>
        </div>

        {/* Executive Totals Cards - Два незалежних розрахунки */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Розрахунок 1 (Людино-години) */}
          <div className="bg-slate-950/80 print:bg-gray-50 border border-amber-500/40 print:border-gray-300 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-amber-400 print:text-gray-700 font-bold uppercase tracking-wider">
              <span>Розрахунок 1: Години</span>
              <Clock className="w-4 h-4 text-amber-400 print:text-gray-700" />
            </div>
            <div className="mt-2 text-3xl font-black text-amber-400 print:text-black">
              {formatHours(summary.totalManHours)} <span className="text-xs font-medium text-slate-400 print:text-gray-600">люд.-год.</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400 print:text-gray-600">
              Всього відпрацьовано бригадою
            </div>
          </div>

          {/* Card 2: Розрахунок 2 (Квадратні метри) */}
          <div className="bg-slate-950/80 print:bg-gray-50 border border-emerald-500/40 print:border-gray-300 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-emerald-400 print:text-gray-700 font-bold uppercase tracking-wider">
              <span>Розрахунок 2: Площа</span>
              <Layers className="w-4 h-4 text-emerald-400 print:text-gray-700" />
            </div>
            <div className="mt-2 text-3xl font-black text-emerald-400 print:text-black">
              {formatSquareMeters(summary.totalSquareMeters)} <span className="text-xs font-medium text-slate-400 print:text-gray-600">м²</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400 print:text-gray-600">
              Всього збудовано на об'єктах
            </div>
          </div>

          {/* Card 3: Де виконувались роботи */}
          <div className="bg-slate-950/80 print:bg-gray-50 border border-sky-500/40 print:border-gray-300 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-sky-400 print:text-gray-700 font-bold uppercase tracking-wider">
              <span>Де виконувались роботи</span>
              <MapPin className="w-4 h-4 text-sky-400 print:text-gray-700" />
            </div>
            <div className="mt-2 text-3xl font-black text-sky-400 print:text-black">
              {summary.uniqueLocationsCount} <span className="text-xs font-medium text-slate-400 print:text-gray-600">об'єктів</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400 print:text-gray-600">
              Будівельні майданчики та локації
            </div>
          </div>

          {/* Card 4: Бригада */}
          <div className="bg-slate-950/80 print:bg-gray-50 border border-purple-500/40 print:border-gray-300 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-purple-400 print:text-gray-700 font-bold uppercase tracking-wider">
              <span>Працівників у бригаді</span>
              <Users className="w-4 h-4 text-purple-400 print:text-gray-700" />
            </div>
            <div className="mt-2 text-3xl font-black text-purple-400 print:text-black">
              {summary.uniqueEmployeesCount} <span className="text-xs font-medium text-slate-400 print:text-gray-600">майстрів</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400 print:text-gray-600">
              У {summary.totalEntries} зареєстрованих роботах
            </div>
          </div>
        </div>

        {/* Section 1: Де виконувалися роботи (Об'єкти та локації) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white print:text-black flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400 print:text-gray-700" />
              1. Де виконувались роботи (Об'єкти та будівельні майданчики)
            </h3>
            <span className="text-xs text-slate-400 print:text-gray-600">
              Звіт трудомісткості та збудованої площі по кожному об'єкту
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 print:border-gray-300">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950/80 print:bg-gray-100 text-slate-300 print:text-black font-semibold border-b border-slate-800 print:border-gray-300">
                <tr>
                  <th className="py-3 px-4">Об'єкт / Де виконувались роботи</th>
                  <th className="py-3 px-4 text-center">К-сть робіт</th>
                  <th className="py-3 px-4 text-center">Задіяні працівники</th>
                  <th className="py-3 px-4 text-right">Розрахунок 1: Людино-годин</th>
                  <th className="py-3 px-4 text-right">Розрахунок 2: Збудовано (м²)</th>
                  <th className="py-3 px-4 text-right">Частка площі</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-gray-200">
                {summary.locationSummaries.map((loc) => (
                  <tr key={loc.location} className="hover:bg-slate-850/50 print:hover:bg-transparent">
                    <td className="py-2.5 px-4 font-semibold text-white print:text-black flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 print:text-gray-700 shrink-0" />
                      <span>{loc.location}</span>
                    </td>
                    <td className="py-2.5 px-4 text-center">{loc.entryCount}</td>
                    <td className="py-2.5 px-4 text-center text-xs text-slate-400 print:text-gray-600">
                      {loc.employees.join(', ')}
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-amber-400 print:text-black">
                      {formatHours(loc.totalHours)} год.
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-emerald-400 print:text-black">
                      {formatSquareMeters(loc.totalSquareMeters)} м²
                    </td>
                    <td className="py-2.5 px-4 text-right font-medium text-slate-300 print:text-gray-800">
                      {loc.percentageOfSquareMeters}%
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-950 print:bg-gray-100 font-bold border-t-2 border-slate-700 print:border-black">
                <tr>
                  <td className="py-3 px-4 text-white print:text-black">
                    РАЗОМ ПО ВСІХ ОБ'ЄКТАХ
                  </td>
                  <td className="py-3 px-4 text-center text-white print:text-black">
                    {summary.totalEntries}
                  </td>
                  <td className="py-3 px-4 text-center text-white print:text-black">
                    {summary.uniqueEmployeesCount} працівників
                  </td>
                  <td className="py-3 px-4 text-right text-base text-amber-400 print:text-black font-black">
                    {formatHours(summary.totalManHours)} год.
                  </td>
                  <td className="py-3 px-4 text-right text-base text-emerald-400 print:text-black font-black">
                    {formatSquareMeters(summary.totalSquareMeters)} м²
                  </td>
                  <td className="py-3 px-4 text-right text-base text-white print:text-black">
                    100%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Section 2: Щоденні підсумки (Понеділок – Неділя) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white print:text-black flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400 print:text-gray-700" />
              2. Щоденний облік: Години та Квадратні метри (Понеділок – Неділя)
            </h3>
            <span className="text-xs text-slate-400 print:text-gray-600">
              Два окремих щоденних підсумки
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 print:border-gray-300">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950/80 print:bg-gray-100 text-slate-300 print:text-black font-semibold border-b border-slate-800 print:border-gray-300">
                <tr>
                  <th className="py-3 px-4">День тижня</th>
                  <th className="py-3 px-4">Дата</th>
                  <th className="py-3 px-4 text-center">Об'єктів</th>
                  <th className="py-3 px-4 text-center">Робітників</th>
                  <th className="py-3 px-4 text-right text-amber-400 print:text-black">
                    Розрахунок 1: Людино-годин
                  </th>
                  <th className="py-3 px-4 text-right text-emerald-400 print:text-black">
                    Розрахунок 2: Збудовано (м²)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-gray-200">
                {summary.days.map((day) => (
                  <tr
                    key={day.date}
                    className={`hover:bg-slate-850/50 print:hover:bg-transparent ${
                      day.totalHours > 0 || day.totalSquareMeters > 0 ? '' : 'text-slate-500 print:text-gray-400'
                    }`}
                  >
                    <td className="py-2.5 px-4 font-semibold text-white print:text-black">
                      {day.dayName}
                    </td>
                    <td className="py-2.5 px-4 text-slate-400 print:text-gray-600">
                      {day.displayDate}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      {day.locationsCount > 0 ? day.locationsCount : '—'}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      {day.employeeCount > 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 print:bg-gray-200 font-medium">
                          {day.employeeCount}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-amber-400 print:text-black">
                      {formatHours(day.totalHours)} год.
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-emerald-400 print:text-black">
                      {formatSquareMeters(day.totalSquareMeters)} м²
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-950 print:bg-gray-100 font-bold border-t-2 border-slate-700 print:border-black">
                <tr>
                  <td className="py-3 px-4 text-white print:text-black" colSpan={2}>
                    ПІДСУМОК ЗА ТИЖДЕНЬ
                  </td>
                  <td className="py-3 px-4 text-center text-white print:text-black">
                    {summary.uniqueLocationsCount}
                  </td>
                  <td className="py-3 px-4 text-center text-white print:text-black">
                    {summary.uniqueEmployeesCount}
                  </td>
                  <td className="py-3 px-4 text-right text-base text-amber-400 print:text-black font-black">
                    {formatHours(summary.totalManHours)} год.
                  </td>
                  <td className="py-3 px-4 text-right text-base text-emerald-400 print:text-black font-black">
                    {formatSquareMeters(summary.totalSquareMeters)} м²
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Section 3: Індивідуальний табель працівників та виконані квадратні метри */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white print:text-black flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400 print:text-gray-700" />
              3. Індивідуальний табель працівників та виконані квадратні метри (Години та м²)
            </h3>
            <span className="text-xs text-slate-400 print:text-gray-600">
              Окремий підсумок годин та окремий підсумок квадратних метрів по кожному члену бригади
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 print:border-gray-300">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950/80 print:bg-gray-100 text-slate-300 print:text-black font-semibold border-b border-slate-800 print:border-gray-300">
                <tr>
                  <th className="py-3 px-4">ПІБ працівника</th>
                  {summary.days.map((d) => {
                    const parts = d.date.split('-');
                    const dayNum = parts[2];
                    const monthNum = parts[1];
                    return (
                      <th
                        key={d.date}
                        className="py-2.5 px-2 text-center text-xs whitespace-nowrap border-l border-slate-800/60 print:border-gray-300"
                      >
                        <div className="font-bold text-white print:text-black">
                          {d.shortDayName}
                        </div>
                        <div className="text-[10px] font-semibold text-amber-300 print:text-gray-700 mt-0.5">
                          {dayNum}.{monthNum}
                        </div>
                      </th>
                    );
                  })}
                  <th className="py-3 px-3 text-center border-l border-slate-800/60 print:border-gray-300">
                    Днів
                  </th>
                  <th className="py-3 px-4 text-right text-amber-400 print:text-black border-l border-slate-800/60 print:border-gray-300">
                    Всього годин
                  </th>
                  <th className="py-3 px-4 text-right text-emerald-400 print:text-black border-l border-slate-800/60 print:border-gray-300">
                    Всього збудовано
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-gray-200">
                {summary.employeeSummaries.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-6 text-center text-slate-500">
                      Немає записів за цей тиждень
                    </td>
                  </tr>
                ) : (
                  summary.employeeSummaries.map((emp) => (
                    <tr key={emp.employeeName} className="hover:bg-slate-850/50 print:hover:bg-transparent">
                      <td className="py-2.5 px-4 font-semibold text-white print:text-black flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400 print:bg-black inline-block" />
                        {emp.employeeName}
                      </td>

                      {summary.days.map((d) => {
                        const h = emp.dayHours[d.date];
                        const sqm = emp.daySquareMeters[d.date];
                        return (
                          <td
                            key={d.date}
                            className="py-2 px-2 text-center text-xs border-l border-slate-800/60 print:border-gray-300"
                          >
                            {h || sqm ? (
                              <div>
                                {h ? <span className="font-bold text-amber-300 print:text-black">{h}г</span> : null}
                                {sqm ? <div className="text-[10px] text-emerald-400 print:text-gray-600">{sqm}м²</div> : null}
                              </div>
                            ) : (
                              <span className="text-slate-600 print:text-gray-400">—</span>
                            )}
                          </td>
                        );
                      })}

                      <td className="py-2.5 px-3 text-center font-medium border-l border-slate-800/60 print:border-gray-300">
                        {emp.daysWorkedCount}
                      </td>
                      <td className="py-2.5 px-4 text-right font-bold text-amber-400 print:text-black border-l border-slate-800/60 print:border-gray-300">
                        {formatHours(emp.totalHours)} год.
                      </td>
                      <td className="py-2.5 px-4 text-right font-bold text-emerald-400 print:text-black border-l border-slate-800/60 print:border-gray-300">
                        {formatSquareMeters(emp.totalSquareMeters)} м²
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot className="bg-slate-950 print:bg-gray-100 font-bold border-t-2 border-slate-700 print:border-black">
                <tr>
                  <td className="py-2.5 px-4 text-white print:text-black">
                    РАЗОМ ЗА ДЕНЬ:
                  </td>
                  {summary.days.map((d) => (
                    <td
                      key={d.date}
                      className="py-2 px-1 text-center text-xs border-l border-slate-800/60 print:border-gray-300"
                    >
                      {d.totalHours > 0 || d.totalSquareMeters > 0 ? (
                        <div className="space-y-0.5">
                          {d.totalHours > 0 ? (
                            <span className="block font-black text-amber-400 print:text-black">
                              {d.totalHours}г
                            </span>
                          ) : null}
                          {d.totalSquareMeters > 0 ? (
                            <span className="block text-[10px] text-emerald-400 print:text-gray-800 font-bold">
                              {d.totalSquareMeters}м²
                            </span>
                          ) : null}
                        </div>
                      ) : (
                        <span className="text-slate-600 print:text-gray-400">—</span>
                      )}
                    </td>
                  ))}
                  <td className="py-2.5 px-3 text-center text-white print:text-black text-xs border-l border-slate-800/60 print:border-gray-300">
                    {summary.uniqueEmployeesCount} майстрів
                  </td>
                  <td className="py-2.5 px-4 text-right text-base text-amber-400 print:text-black font-black whitespace-nowrap border-l border-slate-800/60 print:border-gray-300">
                    {formatHours(summary.totalManHours)} год.
                  </td>
                  <td className="py-2.5 px-4 text-right text-base text-emerald-400 print:text-black font-black whitespace-nowrap border-l border-slate-800/60 print:border-gray-300">
                    {formatSquareMeters(summary.totalSquareMeters)} м²
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Section 4: Розподіл за видами робіт */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white print:text-black flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400 print:text-gray-700" />
              4. Розподіл за видами будівельних робіт
            </h3>
            <span className="text-xs text-slate-400 print:text-gray-600">
              Години та квадратні метри за кожним видом робіт
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {summary.categorySummaries.map((cat) => (
              <div
                key={cat.category}
                className="bg-slate-950/60 print:bg-gray-50 border border-slate-800 print:border-gray-300 rounded-xl p-3.5 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-white print:text-black">
                    {cat.category}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 print:text-black">
                    {cat.totalSquareMeters} м² ({cat.percentageOfSquareMeters}%)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 print:bg-gray-300 h-2 rounded-full overflow-hidden my-2">
                  <div
                    className="bg-emerald-400 print:bg-gray-800 h-full rounded-full"
                    style={{ width: `${Math.min(cat.percentageOfSquareMeters, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 print:text-gray-600">
                  <span>{cat.entryCount} робіт у журналі</span>
                  <span className="font-bold text-amber-400 print:text-black">{cat.totalHours} людино-годин</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Sign-Off and Certification Block */}
        <div className="pt-6 border-t border-slate-800 print:border-gray-400">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-slate-400 print:text-gray-700">
            <div className="space-y-8">
              <p>
                Підтверджую, що зазначені людино-години ({summary.totalManHours} год.) та виконані обсяги
                ({summary.totalSquareMeters} м²) за {summary.weekNumber}-й тиждень перевірені та відповідають щоденному обліку на об'єктах.
              </p>
              <div className="pt-4 border-t border-slate-700 print:border-black flex justify-between">
                <span>Виконроб / Начальник дільниці</span>
                <span>Підпис: ____________</span>
              </div>
            </div>

            <div className="space-y-8">
              <p>
                Затверджено керівником проєкту / технаглядом для звітності та закриття табелів обліку робочого часу.
              </p>
              <div className="pt-4 border-t border-slate-700 print:border-black flex justify-between">
                <span>Керівник проєкту / Технагляд</span>
                <span>Підпис: ____________</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
