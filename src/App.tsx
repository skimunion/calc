/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  WorkEntry,
  Employee,
  ViewTab
} from './types';
import {
  getMondayOfWeek,
  shiftWeek,
  formatDateKey,
  getDaysOfWeek,
  parseDateKey
} from './utils/dateUtils';
import {
  calculateWeekSummary,
  generateWeekCSV,
  round
} from './utils/calculations';
import {
  INITIAL_EMPLOYEES,
  INITIAL_LOCATIONS,
  getInitialWorkEntries
} from './utils/initialData';
import { Header } from './components/Header';
import { WeekSummaryBanner } from './components/WeekSummaryBanner';
import { DayColumn } from './components/DayColumn';
import { WorkEntryModal } from './components/WorkEntryModal';
import { WeeklyReportView } from './components/WeeklyReportView';
import { WorkLedgerView } from './components/WorkLedgerView';
import { CrewRosterModal } from './components/CrewRosterModal';
import { DatePickerModal } from './components/DatePickerModal';
import { Calendar, RefreshCw, Sparkles, MapPin, Clock, Layers } from 'lucide-react';

const STORAGE_KEY_ENTRIES = 'buildlog_entries_v3_locations';
const STORAGE_KEY_EMPLOYEES = 'buildlog_employees_v3_locations';

export default function App() {
  const initialMonday = useMemo(() => getMondayOfWeek(new Date()), []);
  const [currentMonday, setCurrentMonday] = useState<Date>(initialMonday);
  const [activeTab, setActiveTab] = useState<ViewTab>('calendar');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Load entries from localStorage or fallback to Ukrainian initial seed data
  const [entries, setEntries] = useState<WorkEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ENTRIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return getInitialWorkEntries(new Date());
  });

  // Load crew employees
  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EMPLOYEES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_EMPLOYEES;
  });

  // Persist entries to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(entries));
    } catch {
      // ignore
    }
  }, [entries]);

  // Persist employees to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EMPLOYEES, JSON.stringify(employees));
    } catch {
      // ignore
    }
  }, [employees]);

  // Compute Weekly calculations and aggregates
  const weekSummary = useMemo(() => {
    return calculateWeekSummary(currentMonday, entries, employees);
  }, [currentMonday, entries, employees]);

  // Existing unique locations across entries
  const existingLocations = useMemo(() => {
    const set = new Set<string>(INITIAL_LOCATIONS);
    entries.forEach((e) => {
      if (e.location) set.add(e.location);
    });
    return Array.from(set);
  }, [entries]);

  // Modals state
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<WorkEntry | null>(null);
  const [modalDefaultDate, setModalDefaultDate] = useState<string>(formatDateKey(currentMonday));
  const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Week navigation handlers
  const handlePrevWeek = useCallback(() => {
    setCurrentMonday((prev) => shiftWeek(prev, -1));
  }, []);

  const handleNextWeek = useCallback(() => {
    setCurrentMonday((prev) => shiftWeek(prev, 1));
  }, []);

  const handleToday = useCallback(() => {
    setCurrentMonday(getMondayOfWeek(new Date()));
  }, []);

  // Open modal to add entry for a specific date
  const handleOpenAddForDate = useCallback((dateStr: string) => {
    setEditingEntry(null);
    setModalDefaultDate(dateStr);
    setIsEntryModalOpen(true);
  }, []);

  // Open modal from header
  const handleOpenAddGeneric = useCallback(() => {
    setEditingEntry(null);
    setModalDefaultDate(formatDateKey(currentMonday));
    setIsEntryModalOpen(true);
  }, [currentMonday]);

  // Open modal to edit entry
  const handleEditEntry = useCallback((entry: WorkEntry) => {
    setEditingEntry(entry);
    setModalDefaultDate(entry.date);
    setIsEntryModalOpen(true);
  }, []);

  // Save entry (create or update)
  const handleSaveEntry = useCallback(
    (entryData: Omit<WorkEntry, 'id' | 'createdAt'> & { id?: string }) => {
      if (entryData.id) {
        // Edit existing
        setEntries((prev) =>
          prev.map((item) =>
            item.id === entryData.id
              ? {
                  ...item,
                  ...entryData,
                  location: entryData.location || item.location,
                  hoursWorked: Number(entryData.hoursWorked) || 0,
                  squareMeters: Number(entryData.squareMeters) || 0,
                }
              : item
          )
        );
      } else {
        // Add new
        const newEntry: WorkEntry = {
          ...entryData,
          id: `entry-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          location: entryData.location || 'Головний об’єкт',
          hoursWorked: Number(entryData.hoursWorked) || 0,
          squareMeters: Number(entryData.squareMeters) || 0,
          createdAt: Date.now(),
        };
        setEntries((prev) => [newEntry, ...prev]);
      }
    },
    []
  );

  // Delete entry
  const handleDeleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Copy previous day's crew to target date
  const handleCopyFromYesterday = useCallback(
    (targetDateStr: string) => {
      const targetDate = parseDateKey(targetDateStr);
      const yesterday = new Date(targetDate);
      yesterday.setDate(targetDate.getDate() - 1);
      const yesterdayStr = formatDateKey(yesterday);

      const yesterdayEntries = entries.filter((e) => e.date === yesterdayStr);
      if (yesterdayEntries.length === 0) return;

      const newEntries: WorkEntry[] = yesterdayEntries.map((prev) => ({
        id: `entry-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        date: targetDateStr,
        employeeId: prev.employeeId,
        employeeName: prev.employeeName,
        location: prev.location,
        taskDescription: `${prev.taskDescription} (Продовження)`,
        category: prev.category,
        recordType: prev.recordType || 'both',
        hoursWorked: prev.hoursWorked,
        squareMeters: prev.squareMeters,
        notes: 'Скопійовано з попереднього дня',
        createdAt: Date.now(),
      }));

      setEntries((prev) => [...newEntries, ...prev]);
    },
    [entries]
  );

  // CSV Export
  const handleExportCSV = useCallback(() => {
    const csvContent = generateWeekCSV(weekSummary, entries);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `CICWMA_Тиждень_${weekSummary.weekNumber}_${weekSummary.startDateStr}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [weekSummary, entries]);

  // Print
  const handlePrint = useCallback(() => {
    setActiveTab('report');
    setTimeout(() => {
      window.print();
    }, 200);
  }, []);

  // Roster handlers
  const handleAddEmployee = useCallback((name: string, role: string) => {
    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      name,
      role,
    };
    setEmployees((prev) => [...prev, newEmp]);
  }, []);

  const handleDeleteEmployee = useCallback((id: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  }, []);

  // Reset to sample data helper
  const handleResetSampleData = useCallback(() => {
    const sample = getInitialWorkEntries(currentMonday);
    setEntries(sample);
  }, [currentMonday]);

  // Array of 7 dates for the active week
  const weekDays = useMemo(() => getDaysOfWeek(currentMonday), [currentMonday]);

  // If a location filter is selected, compute displayed days for that location
  const displayedDays = useMemo(() => {
    if (!selectedLocation) return weekSummary.days;
    return weekSummary.days.map((day) => {
      const locEntries = day.entries.filter(
        (e) => (e.location || '').trim().toLowerCase() === selectedLocation.trim().toLowerCase()
      );
      const totalHours = round(locEntries.reduce((sum, e) => sum + (Number(e.hoursWorked) || 0), 0));
      const totalSquareMeters = round(locEntries.reduce((sum, e) => sum + (Number(e.squareMeters) || 0), 0));
      return {
        ...day,
        entries: locEntries,
        entryCount: locEntries.length,
        totalHours,
        totalSquareMeters,
        locationsCount: locEntries.length > 0 ? 1 : 0,
      };
    });
  }, [weekSummary.days, selectedLocation]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Main Navigation Header */}
      <Header
        currentWeekMonday={currentMonday}
        formattedRange={weekSummary.formattedRange}
        weekNumber={weekSummary.weekNumber}
        year={weekSummary.year}
        totalManHours={weekSummary.totalManHours}
        totalSquareMeters={weekSummary.totalSquareMeters}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        onToday={handleToday}
        onOpenDatePicker={() => setIsDatePickerOpen(true)}
        onOpenAddEntry={handleOpenAddGeneric}
        onOpenRoster={() => setIsRosterModalOpen(true)}
        onPrint={handlePrint}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Weekly Summary Banner with both overall totals and separate location breakdown */}
        {activeTab !== 'report' && (
          <WeekSummaryBanner
            summary={weekSummary}
            onExportCSV={handleExportCSV}
            onViewReport={() => setActiveTab('report')}
            selectedLocation={selectedLocation}
            onSelectLocation={setSelectedLocation}
          />
        )}

        {/* View 1: 7-Day Weekly Calendar Columns */}
        {activeTab === 'calendar' && (
          <div>
            {/* Location filter active notification */}
            {selectedLocation && (
              <div className="mb-4 bg-sky-950/70 border border-sky-500/50 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-sky-200 shadow-md">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>
                    Активний фільтр: календар показує записи та щоденні суми тільки для об'єкта{' '}
                    <strong className="text-white font-bold underline">{selectedLocation}</strong>
                  </span>
                </div>
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="px-3 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 hover:text-white border border-sky-500/40 font-semibold transition cursor-pointer self-start sm:self-auto"
                >
                  Скинути фільтр (показати всі об'єкти)
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400" />
                Щоденні табелі робіт (Понеділок – Неділя)
              </span>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-400">
                  Натисніть «+ Додати роботу» для запису годин або виконаних м²
                </span>
                <button
                  onClick={handleResetSampleData}
                  className="text-xs text-slate-400 hover:text-amber-400 transition flex items-center gap-1 cursor-pointer"
                  title="Перезавантажити зразкові записи за цей тиждень"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Скинути до зразка</span>
                </button>
              </div>
            </div>

            {/* 7 Columns: Monday to Sunday */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3 sm:gap-4">
              {displayedDays.map((daySummary, index) => {
                const dateObj = weekDays[index];
                const yesterdayDate = new Date(dateObj);
                yesterdayDate.setDate(dateObj.getDate() - 1);
                const yesterdayKey = formatDateKey(yesterdayDate);
                const hasYesterdayEntries = entries.some((e) => e.date === yesterdayKey);

                return (
                  <DayColumn
                    key={daySummary.date}
                    day={daySummary}
                    dateObj={dateObj}
                    onAddEntry={handleOpenAddForDate}
                    onEditEntry={handleEditEntry}
                    onDeleteEntry={handleDeleteEntry}
                    onCopyFromYesterday={handleCopyFromYesterday}
                    canCopyFromYesterday={hasYesterdayEntries && daySummary.entries.length === 0}
                  />
                );
              })}
            </div>

            {/* Bottom Week-End Grand Totals Bar: ДВА НЕЗАЛЕЖНИХ РОЗРАХУНКИ + ОКРЕМО ЗА ЛОКАЦІЯМИ */}
            <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h3 className="font-bold text-white text-base">
                      Підсумок {weekSummary.weekNumber}-го тижня (2 окремих розрахунки)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    Окремо відпрацьовані години бригади та окремо збудована площа на об'єктах ({weekSummary.formattedRange})
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      Розрахунок 1 (Години):
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-amber-400">
                      {weekSummary.totalManHours} год.
                    </span>
                  </div>

                  <div className="flex flex-col border-l border-slate-800 pl-6">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium flex items-center gap-1">
                      <Layers className="w-3 h-3 text-emerald-400" />
                      Розрахунок 2 (Площа):
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-emerald-400">
                      {weekSummary.totalSquareMeters} м²
                    </span>
                  </div>

                  <div className="flex flex-col border-l border-slate-800 pl-6">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-sky-400" />
                      Об'єктів:
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-sky-400">
                      {weekSummary.uniqueLocationsCount}
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveTab('report')}
                    className="ml-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold transition shadow-md shadow-amber-500/20 cursor-pointer"
                  >
                    Повний табель-звіт та друк
                  </button>
                </div>
              </div>

              {/* Окремий рядок підсумків за кожним об'єктом / локацією */}
              <div className="pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-sky-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    Окремі підсумки за кожним об'єктом ({weekSummary.locationSummaries.length}):
                  </span>
                  {selectedLocation && (
                    <button
                      onClick={() => setSelectedLocation(null)}
                      className="text-[11px] text-sky-300 hover:underline cursor-pointer"
                    >
                      Скинути фільтр
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
                  {weekSummary.locationSummaries.map((loc) => {
                    const isSelected = selectedLocation === loc.location;
                    return (
                      <button
                        key={loc.location}
                        onClick={() => setSelectedLocation(isSelected ? null : loc.location)}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-sky-950/60 border-sky-400 ring-1 ring-sky-400'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-xs font-bold text-white truncate" title={loc.location}>
                            {loc.location}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {loc.entryCount} робіт
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] mt-1 pt-1 border-t border-slate-800">
                          <span className="font-bold text-amber-400">{loc.totalHours} год.</span>
                          <span className="font-bold text-emerald-400">{loc.totalSquareMeters} м²</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View 2: Work Ledger Table */}
        {activeTab === 'ledger' && (
          <WorkLedgerView
            summary={weekSummary}
            allEntries={entries}
            onEditEntry={handleEditEntry}
            onDeleteEntry={handleDeleteEntry}
            onAddEntry={handleOpenAddGeneric}
          />
        )}

        {/* View 3: Weekly Report & Timesheet Audit */}
        {activeTab === 'report' && (
          <WeeklyReportView
            summary={weekSummary}
            allEntries={entries}
            onExportCSV={handleExportCSV}
            onPrint={handlePrint}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500 print:hidden flex items-center justify-center gap-2">
        <img src="/logo.png" alt="CICWMA Logo" className="w-5 h-5 object-contain rounded bg-white/90 p-0.5" />
        <p>CICWMA • Незалежний облік людино-годин та збудованих квадратних метрів за об'єктами</p>
      </footer>

      {/* Add / Edit Entry Modal */}
      <WorkEntryModal
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        onSave={handleSaveEntry}
        initialEntry={editingEntry}
        defaultDate={modalDefaultDate}
        employees={employees}
        existingLocations={existingLocations}
      />

      {/* Crew Roster Modal */}
      <CrewRosterModal
        isOpen={isRosterModalOpen}
        onClose={() => setIsRosterModalOpen(false)}
        employees={employees}
        onAddEmployee={handleAddEmployee}
        onDeleteEmployee={handleDeleteEmployee}
      />

      {/* Jump to Date Picker Modal */}
      <DatePickerModal
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        currentMonday={currentMonday}
        onSelectDate={(newMonday) => setCurrentMonday(newMonday)}
      />
    </div>
  );
}
