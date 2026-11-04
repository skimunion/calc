import React from 'react';
import { Clock, Layers, Edit2, Trash2, FileText, MapPin } from 'lucide-react';
import { WorkEntry } from '../types';
import { formatHours, formatSquareMeters } from '../utils/calculations';

interface WorkEntryCardProps {
  entry: WorkEntry;
  onEdit: (entry: WorkEntry) => void;
  onDelete: (id: string) => void;
}

const getCategoryStyle = (category: string) => {
  switch (category) {
    case 'Мурування та кладка':
    case 'Masonry & Brickwork':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    case 'Гіпсокартонні роботи':
    case 'Drywall & Partitions':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    case 'Штукатурні роботи':
    case 'Plastering & Stucco':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    case 'Плитка та підлога':
    case 'Flooring & Tiling':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    case 'Бетон та фундамент':
    case 'Concrete & Foundation':
      return 'bg-zinc-500/10 text-zinc-300 border-zinc-500/30';
    case 'Покрівля та каркас':
    case 'Roofing & Framing':
      return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
    case 'Утеплення та фасад':
    case 'Insulation & Facade':
      return 'bg-teal-500/10 text-teal-400 border-teal-500/30';
    case 'Малярні роботи':
    case 'Painting & Coating':
      return 'bg-pink-500/10 text-pink-400 border-pink-500/30';
    default:
      return 'bg-slate-500/10 text-slate-300 border-slate-500/30';
  }
};

export const WorkEntryCard: React.FC<WorkEntryCardProps> = ({
  entry,
  onEdit,
  onDelete,
}) => {
  const hasHours = entry.hoursWorked > 0;
  const hasSqm = entry.squareMeters > 0;

  return (
    <div className="group bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl p-3 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      {/* Top: Employee & Action Buttons */}
      <div>
        <div className="flex items-start justify-between gap-1.5 mb-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
              {entry.employeeName.charAt(0).toUpperCase()}
            </div>
            <h4 className="text-xs sm:text-sm font-semibold text-white truncate" title={entry.employeeName}>
              {entry.employeeName}
            </h4>
          </div>

          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
            <button
              onClick={() => onEdit(entry)}
              aria-label={`Редагувати запис: ${entry.employeeName}`}
              className="p-1 rounded-md text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition cursor-pointer"
              title="Редагувати запис"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(entry.id)}
              aria-label={`Видалити запис: ${entry.employeeName}`}
              className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
              title="Видалити запис"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ДЕ ВИКОНУЮТЬСЯ РОБОТИ (Локація / Об'єкт) */}
        {entry.location && (
          <div className="mb-1.5 flex items-center gap-1 text-[11px] text-amber-300/90 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 truncate" title={`Місце виконання: ${entry.location}`}>
            <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate font-medium">{entry.location}</span>
          </div>
        )}

        {/* Work Category Badge */}
        <div className="mb-2">
          <span
            className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-md border ${getCategoryStyle(
              entry.category
            )}`}
          >
            {entry.category}
          </span>
        </div>

        {/* Work Performed Description (якщо є) */}
        {entry.taskDescription && (
          <p className="text-xs text-slate-300 mb-2.5 line-clamp-2 leading-relaxed">
            {entry.taskDescription}
          </p>
        )}

        {entry.notes && (
          <div className="text-[11px] text-slate-400 mb-2.5 bg-slate-950/40 p-2 rounded-lg border border-slate-800/60 flex items-start gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
            <span className="italic line-clamp-2">{entry.notes}</span>
          </div>
        )}
      </div>

      {/* Два незалежних розрахунки (Години та Квадратні метри) */}
      <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-1 text-center bg-slate-950/40 rounded-lg p-1.5">
        {/* Розрахунок 1: Години */}
        <div className="flex flex-col items-center justify-center p-1 rounded bg-slate-900/60 border border-slate-800 overflow-hidden">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1 truncate w-full">
            <Clock className="w-2.5 h-2.5 text-amber-400 shrink-0" /> Години
          </span>
          <span className="text-xs font-bold text-amber-400 truncate w-full">
            {hasHours ? `${formatHours(entry.hoursWorked)} год.` : '0 год.'}
          </span>
        </div>

        {/* Розрахунок 2: Квадратні метри */}
        <div className="flex flex-col items-center justify-center p-1 rounded bg-slate-900/60 border border-slate-800 overflow-hidden">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1 truncate w-full">
            <Layers className="w-2.5 h-2.5 text-emerald-400 shrink-0" /> Збудовано
          </span>
          <span className="text-xs font-bold text-emerald-400 truncate w-full">
            {hasSqm ? `${formatSquareMeters(entry.squareMeters)} м²` : '0 м²'}
          </span>
        </div>
      </div>
    </div>
  );
};
