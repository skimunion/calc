import { Employee, WorkEntry, WorkCategory } from '../types';
import { getMondayOfWeek, formatDateKey } from './dateUtils';

export const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'emp-1', name: 'Роман', role: 'зам по ніхуям', color: 'amber' },
  { id: 'emp-2', name: 'Назар', role: 'зам', color: 'indigo' },
  { id: 'emp-3', name: 'Ігор', role: 'бос', color: 'emerald' },
  { id: 'emp-4', name: 'Руслан', role: '', color: 'sky' },
  { id: 'emp-5', name: 'Саша', role: '', color: 'purple' },
  { id: 'emp-6', name: 'Славік', role: '', color: 'rose' },
];

export const INITIAL_LOCATIONS: string[] = [
  'Genk Турки',
  'Louven',
  
];

export const WORK_CATEGORIES: WorkCategory[] = [
  'Мурування та кладка',
  'Бетон та фундамент',
  'Малярні роботи',
  'Утеплення та фасад',
  'Загальнобудівельні роботи',
];

/**
 * Generates realistic Ukrainian seed work entries with locations ("де будуть виконувати роботи")
 * and demonstrates independent hours and square meters calculations.
 */
export function getInitialWorkEntries(referenceDate: Date = new Date()): WorkEntry[] {
  const monday = getMondayOfWeek(referenceDate);

  const getDateStr = (offsetDays: number) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + offsetDays);
    return formatDateKey(d);
  };

  const mon = getDateStr(0);
  const tue = getDateStr(1);
  const wed = getDateStr(2);
  const thu = getDateStr(3);
  const fri = getDateStr(4);

  return [
    // Понеділок (Monday)
    
  ];
}
