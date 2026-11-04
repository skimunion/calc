/**
 * Date manipulation and formatting utilities for the weekly calendar in Ukrainian.
 */

// Format Date object to YYYY-MM-DD
export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Parse YYYY-MM-DD to a local Date object safely at noon to avoid timezone shift
export function parseDateKey(key: string): Date {
  const parts = key.split('-').map(Number);
  if (parts.length !== 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) {
    return new Date();
  }
  return new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
}

// Get the Monday of the week containing the given date
export function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setHours(12, 0, 0, 0);
  const day = d.getDay(); // 0 is Sunday, 1 is Monday, ...
  const diff = day === 0 ? -6 : 1 - day; // If Sunday, go back 6 days; otherwise go to Monday
  d.setDate(d.getDate() + diff);
  return d;
}

// Get all 7 days of the week starting from Monday
export function getDaysOfWeek(mondayDate: Date): Date[] {
  const days: Date[] = [];
  const base = new Date(mondayDate);
  base.setHours(12, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const nextDay = new Date(base);
    nextDay.setDate(base.getDate() + i);
    days.push(nextDay);
  }
  return days;
}

// Get ISO week number and year
export function getWeekNumber(date: Date): { week: number; year: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return { week: weekNo, year: d.getUTCFullYear() };
}

// Shift week by N weeks
export function shiftWeek(currentMonday: Date, weeks: number): Date {
  const d = new Date(currentMonday);
  d.setDate(d.getDate() + weeks * 7);
  return d;
}

export const MONTH_NAMES_UK = [
  'січ.', 'лют.', 'бер.', 'квіт.', 'трав.', 'черв.',
  'лип.', 'серп.', 'вер.', 'жовт.', 'лист.', 'груд.'
];

export const MONTH_NAMES_GENITIVE_UK = [
  'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
  'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
];

export const DAY_NAMES = [
  'Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота'
];

export const SHORT_DAY_NAMES = [
  'Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'
];

// e.g. "2 – 8 листопада 2026 р."
export function formatWeekRange(monday: Date): string {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const startDay = monday.getDate();
  const endDay = sunday.getDate();
  const startMonthIdx = monday.getMonth();
  const endMonthIdx = sunday.getMonth();
  const year = sunday.getFullYear();

  if (startMonthIdx === endMonthIdx) {
    return `${startDay} – ${endDay} ${MONTH_NAMES_GENITIVE_UK[startMonthIdx]} ${year} р.`;
  }
  return `${startDay} ${MONTH_NAMES_UK[startMonthIdx]} – ${endDay} ${MONTH_NAMES_UK[endMonthIdx]} ${year} р.`;
}

export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}
