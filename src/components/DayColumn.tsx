import React from 'react';
import { Plus, Users, Copy, Clock, Layers, MapPin } from 'lucide-react';
import { DaySummary, WorkEntry } from '../types';
import { WorkEntryCard } from './WorkEntryCard';
import { formatHours, formatSquareMeters } from '../utils/calculations';
import { isToday } from '../utils/dateUtils';

interface DayColumnProps {
  day: DaySummary;
  dateObj: Date;
  onAddEntry: (dateStr: string) => void;
  onEditEntry: (entry: WorkEntry) => void;
  onDeleteEntry: (id: string) => void;
  onCopyFromYesterday?: (targetDateStr: string) => void;
  canCopyFromYesterday?: boolean;
}

export const DayColumn: React.FC<DayColumnProps> = ({
  day,
  dateObj,
  onAddEntry,
  onEditEntry,
  onDeleteEntry,
  onCopyFromYesterday,
  canCopyFromYesterday = false,
}) => {
  const currentIsToday = isToday(dateObj);
  const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

  return (
    <div
      className={`flex flex-col rounded-2xl border transition-all ${
        currentIsToday
          ? 'bg-slate-900/95 border-amber-500/50 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/30'
          : isWeekend
          ? 'bg-slate-900/50 border-slate-800/80'
          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700/80'
      }`}
    >
      {/* Day Column Header */}
      <div className="p-3 border-b border-slate-800/80">
        <div className="flex items-center justify-between gap-1 mb-1">
          <h3 className="font-bold text-sm text-white">
            {day.dayName}
          </h3>
          <span className="text-[11px] font-semibold text-slate-400 shrink-0">
            {day.displayDate}
          </span>
        </div>

        {currentIsToday && (
          <div className="mb-1.5">
            <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950">
              Сьогодні
            </span>
          </div>
        )}

        {/* ДВА НЕЗАЛЕЖНИХ ПІДСУМКИ ЗА ДЕНЬ */}
        <div className="bg-slate-950/60 rounded-xl p-2 border border-slate-800/80 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1 text-[11px]">
              <Clock className="w-3 h-3 text-amber-400" /> Годин за день:
            </span>
            <span className="font-bold text-amber-400">
              {formatHours(day.totalHours)} год.
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1 text-[11px]">
              <Layers className="w-3 h-3 text-emerald-400" /> Збудовано:
            </span>
            <span className="font-bold text-emerald-400">
              {formatSquareMeters(day.totalSquareMeters)} м²
            </span>
          </div>

          {day.locationsCount > 0 && (
            <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5 text-amber-400/80" /> Об'єктів:
              </span>
              <span className="font-medium text-slate-300">
                {day.locationsCount}
              </span>
            </div>
          )}
        </div>

        {/* Quick Add Button */}
        <button
          onClick={() => onAddEntry(day.date)}
          className="mt-2.5 w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium border border-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-amber-400" />
          <span>Додати роботу</span>
        </button>
      </div>

      {/* Cards List / Empty State */}
      <div className="p-3 space-y-2.5 flex-1 min-h-[160px] flex flex-col justify-start">
        {day.entries.length === 0 ? (
          <div className="my-auto py-6 px-2 text-center flex flex-col items-center justify-center text-slate-500">
            <Users className="w-7 h-7 text-slate-600 mb-2 stroke-[1.5]" />
            <p className="text-xs font-medium text-slate-400">Роботи не записані</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {isWeekend ? 'Вихідний день' : 'Запишіть години або збудовані м²'}
            </p>

            <div className="mt-3 flex flex-col gap-1.5 w-full max-w-[190px]">
              <button
                onClick={() => onAddEntry(day.date)}
                className="py-1 px-2 rounded-md bg-slate-800/80 hover:bg-slate-700 text-[11px] font-medium text-amber-400 border border-slate-700/60 transition cursor-pointer"
              >
                + Записати
              </button>
              {canCopyFromYesterday && onCopyFromYesterday && (
                <button
                  onClick={() => onCopyFromYesterday(day.date)}
                  className="py-1 px-2 rounded-md bg-slate-800/40 hover:bg-slate-700 text-[10px] font-medium text-slate-300 border border-slate-800 flex items-center justify-center gap-1 transition cursor-pointer"
                  title="Скопіювати список робітників із попереднього дня"
                >
                  <Copy className="w-3 h-3 text-slate-400" />
                  <span>Скопіювати вчорашню бригаду</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          day.entries.map((entry) => (
            <WorkEntryCard
              key={entry.id}
              entry={entry}
              onEdit={onEditEntry}
              onDelete={onDeleteEntry}
            />
          ))
        )}
      </div>
    </div>
  );
};
