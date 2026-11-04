import React, { useState } from 'react';
import { X, Calendar, ArrowRight } from 'lucide-react';
import { formatDateKey, parseDateKey, getMondayOfWeek } from '../utils/dateUtils';

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMonday: Date;
  onSelectDate: (targetMonday: Date) => void;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  isOpen,
  onClose,
  currentMonday,
  onSelectDate,
}) => {
  const [selectedDateStr, setSelectedDateStr] = useState(formatDateKey(currentMonday));

  if (!isOpen) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDateStr) return;
    const targetDate = parseDateKey(selectedDateStr);
    const targetMonday = getMondayOfWeek(targetDate);
    onSelectDate(targetMonday);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="datepicker-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="relative bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-sm shadow-2xl text-white overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <h2 id="datepicker-modal-title" className="text-base font-bold text-white">
              Перейти до обраного тижня
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Закрити вибір дати"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleApply} className="p-5 space-y-4">
          <p className="text-xs text-slate-300">
            Оберіть будь-який день, і календар автоматично перейде до повного робочого тижня (з понеділка по неділю).
          </p>

          <div>
            <label htmlFor="jump-date-input" className="block text-xs font-semibold text-slate-300 mb-1">
              Оберіть дату:
            </label>
            <input
              id="jump-date-input"
              type="date"
              value={selectedDateStr}
              onChange={(e) => setSelectedDateStr(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              Скасувати
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>Перейти до тижня</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
