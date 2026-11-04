import React, { useState, useMemo } from 'react';
import { Search, Edit2, Trash2, ArrowUpDown, MapPin } from 'lucide-react';
import { WorkEntry, WeekSummary } from '../types';
import { WORK_CATEGORIES } from '../utils/initialData';
import { formatHours, formatSquareMeters } from '../utils/calculations';

interface WorkLedgerViewProps {
  summary: WeekSummary;
  allEntries: WorkEntry[];
  onEditEntry: (entry: WorkEntry) => void;
  onDeleteEntry: (id: string) => void;
  onAddEntry: () => void;
}

export const WorkLedgerView: React.FC<WorkLedgerViewProps> = ({
  summary,
  allEntries,
  onEditEntry,
  onDeleteEntry,
  onAddEntry,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [scope, setScope] = useState<'this-week' | 'all-time'>('this-week');
  const [sortField, setSortField] = useState<'date' | 'hours' | 'sqm' | 'employee' | 'location'>('date');
  const [sortAsc, setSortAsc] = useState(false);

  // Filter entries
  const filteredEntries = useMemo(() => {
    let list = scope === 'this-week'
      ? allEntries.filter((e) => e.date >= summary.startDateStr && e.date <= summary.endDateStr)
      : [...allEntries];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (e) =>
          e.employeeName.toLowerCase().includes(q) ||
          (e.location && e.location.toLowerCase().includes(q)) ||
          (e.taskDescription && e.taskDescription.toLowerCase().includes(q)) ||
          (e.notes && e.notes.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'all') {
      list = list.filter((e) => e.category === selectedCategory);
    }

    if (selectedEmployee !== 'all') {
      list = list.filter((e) => e.employeeName === selectedEmployee);
    }

    if (selectedLocation !== 'all') {
      list = list.filter((e) => e.location === selectedLocation);
    }

    // Sort
    list.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'date') cmp = a.date.localeCompare(b.date);
      else if (sortField === 'hours') cmp = a.hoursWorked - b.hoursWorked;
      else if (sortField === 'sqm') cmp = a.squareMeters - b.squareMeters;
      else if (sortField === 'employee') cmp = a.employeeName.localeCompare(b.employeeName);
      else if (sortField === 'location') cmp = (a.location || '').localeCompare(b.location || '');

      return sortAsc ? cmp : -cmp;
    });

    return list;
  }, [allEntries, summary, scope, searchTerm, selectedCategory, selectedEmployee, selectedLocation, sortField, sortAsc]);

  // Unique employees in the dataset
  const uniqueEmployees = useMemo(() => {
    const set = new Set<string>();
    allEntries.forEach((e) => {
      if (e.employeeName) set.add(e.employeeName);
    });
    return Array.from(set).sort();
  }, [allEntries]);

  // Unique locations in the dataset
  const uniqueLocations = useMemo(() => {
    const set = new Set<string>();
    allEntries.forEach((e) => {
      if (e.location) set.add(e.location);
    });
    return Array.from(set).sort();
  }, [allEntries]);

  // Subtotal for filtered entries
  const filteredHours = filteredEntries.reduce((sum, e) => sum + (e.hoursWorked || 0), 0);
  const filteredSqm = filteredEntries.reduce((sum, e) => sum + (e.squareMeters || 0), 0);

  const toggleSort = (field: 'date' | 'hours' | 'sqm' | 'employee' | 'location') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white shadow-md space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Пошук за працівником, об'єктом, описом робіт..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          {/* Scope and Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Scope toggle */}
            <div className="flex bg-slate-950 rounded-xl p-1 border border-slate-800 text-xs">
              <button
                onClick={() => setScope('this-week')}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  scope === 'this-week'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Цей тиждень
              </button>
              <button
                onClick={() => setScope('all-time')}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  scope === 'all-time'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Всі записи ({allEntries.length})
              </button>
            </div>

            {/* Location dropdown (де виконувалися роботи) */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer max-w-[160px] truncate"
            >
              <option value="all">Всі об'єкти</option>
              {uniqueLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            {/* Employee dropdown */}
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer"
            >
              <option value="all">Всі працівники</option>
              {uniqueEmployees.map((emp) => (
                <option key={emp} value={emp}>
                  {emp}
                </option>
              ))}
            </select>

            {/* Category dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer"
            >
              <option value="all">Всі категорії</option>
              {WORK_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <button
              onClick={onAddEntry}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition cursor-pointer"
            >
              + Записати роботу
            </button>
          </div>
        </div>

        {/* Filter summary bar */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
          <div>
            Показано <strong className="text-white">{filteredEntries.length}</strong> записів
          </div>
          <div className="flex items-center gap-4">
            <span>
              Розрахунок 1 (Години): <strong className="text-amber-400">{formatHours(filteredHours)} год.</strong>
            </span>
            <span>
              Розрахунок 2 (Площа): <strong className="text-emerald-400">{formatSquareMeters(filteredSqm)} м²</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950/80 text-slate-300 font-semibold border-b border-slate-800">
              <tr>
                <th
                  onClick={() => toggleSort('date')}
                  className="py-3 px-4 cursor-pointer hover:text-white transition"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Дата</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('employee')}
                  className="py-3 px-4 cursor-pointer hover:text-white transition"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Працівник</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('location')}
                  className="py-3 px-4 cursor-pointer hover:text-white transition"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Де виконуються роботи</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="py-3 px-4">Вид робіт / Категорія</th>
                <th className="py-3 px-4">Примітки</th>
                <th
                  onClick={() => toggleSort('hours')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-white transition text-amber-400"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Години (люд.-год.)</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('sqm')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-white transition text-emerald-400"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Збудовано (м²)</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    Немає записів за обраними критеріями
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => {
                  return (
                    <tr key={entry.id} className="hover:bg-slate-850/60 transition">
                      <td className="py-3 px-4 font-mono text-xs text-slate-400 whitespace-nowrap">
                        {entry.date}
                      </td>
                      <td className="py-3 px-4 font-semibold text-white whitespace-nowrap">
                        {entry.employeeName}
                      </td>
                      <td className="py-3 px-4 text-xs whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-amber-300">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="font-medium truncate max-w-[180px]" title={entry.location}>
                            {entry.location || '—'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                          {entry.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-300 max-w-xs truncate" title={entry.notes || entry.taskDescription || '—'}>
                        {entry.notes ? (
                          <span className="text-slate-300">{entry.notes}</span>
                        ) : entry.taskDescription ? (
                          <span className="text-slate-400">{entry.taskDescription}</span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-amber-400 whitespace-nowrap">
                        {entry.hoursWorked > 0 ? `${formatHours(entry.hoursWorked)} год.` : '—'}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-400 whitespace-nowrap">
                        {entry.squareMeters > 0 ? `${formatSquareMeters(entry.squareMeters)} м²` : '—'}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onEditEntry(entry)}
                            aria-label={`Редагувати запис: ${entry.employeeName}`}
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteEntry(entry.id)}
                            aria-label={`Видалити запис: ${entry.employeeName}`}
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
