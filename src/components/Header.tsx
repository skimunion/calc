import React from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Users,
  BarChart3,
  ListOrdered,
  CalendarDays,
  Printer
} from 'lucide-react';
import { ViewTab } from '../types';

interface HeaderProps {
  currentWeekMonday: Date;
  formattedRange: string;
  weekNumber: number;
  year: number;
  totalManHours: number;
  totalSquareMeters: number;
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
  onOpenDatePicker: () => void;
  onOpenAddEntry: () => void;
  onOpenRoster: () => void;
  onPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  formattedRange,
  weekNumber,
  totalManHours,
  totalSquareMeters,
  activeTab,
  onTabChange,
  onPrevWeek,
  onNextWeek,
  onToday,
  onOpenDatePicker,
  onOpenAddEntry,
  onOpenRoster,
  onPrint,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      {/* Top Branding & Main Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="h-11 w-11 rounded-xl bg-white/95 border border-amber-500/40 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/10 overflow-hidden shrink-0">
              <img
                src="/logo.png"
                alt="CICWMA Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                  <span className="text-amber-400">CICWMA</span>
                  <span className="text-xs uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                    Облік робіт
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                Будівельний календар • Людино-години та м²
              </p>
            </div>
          </div>

          {/* Week Navigation Controls */}
          <div className="flex items-center gap-2 bg-slate-800/90 p-1.5 rounded-xl border border-slate-700/80 shadow-sm">
            <button
              onClick={onPrevWeek}
              aria-label="Попередній тиждень"
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Попередній тиждень"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={onToday}
              className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors cursor-pointer"
              title="Перейти на поточний тиждень"
            >
              Сьогодні
            </button>

            <button
              onClick={onOpenDatePicker}
              className="px-3 py-1 text-xs sm:text-sm font-medium rounded-lg hover:bg-slate-700 text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Обрати конкретну дату або тиждень"
            >
              <CalendarDays className="w-4 h-4 text-amber-400" />
              <span>
                Тиждень {weekNumber} • <strong className="text-white">{formattedRange}</strong>
              </span>
            </button>

            <button
              onClick={onNextWeek}
              aria-label="Наступний тиждень"
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Наступний тиждень"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenRoster}
              className="px-3 py-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
              title="Керування списком працівників бригади"
            >
              <Users className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Бригада</span>
            </button>

            <button
              onClick={onPrint}
              className="px-3 py-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
              title="Роздрукувати тижневий табель / звіт"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Друк звіту</span>
            </button>

            <button
              onClick={onOpenAddEntry}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Записати роботу</span>
            </button>
          </div>
        </div>

        {/* View Switcher Sub-nav */}
        <div className="mt-3.5 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <nav className="flex space-x-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800" aria-label="Розділи">
            <button
              onClick={() => onTabChange('calendar')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === 'calendar'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>Тижневий календар</span>
            </button>

            <button
              onClick={() => onTabChange('ledger')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === 'ledger'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ListOrdered className="w-4 h-4" />
              <span>Журнал робіт</span>
            </button>

            <button
              onClick={() => onTabChange('report')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === 'report'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Підсумок за тиждень</span>
            </button>
          </nav>

          {/* Quick Real-Time Metrics Indicator */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 bg-slate-800/70 px-2.5 py-1 rounded-lg border border-slate-700/60">
              <span className="text-slate-400">Людино-годин:</span>
              <span className="font-bold text-amber-400">{totalManHours} год.</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/70 px-2.5 py-1 rounded-lg border border-slate-700/60">
              <span className="text-slate-400">Збудовано:</span>
              <span className="font-bold text-emerald-400">{totalSquareMeters} м²</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
