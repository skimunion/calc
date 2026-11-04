import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDaySummary,
  calculateWeekSummary,
  round
} from './calculations';
import { WorkEntry } from '../types';

test('години та квадратні метри є повністю незалежними розрахунками', () => {
  const date = new Date(2026, 10, 2); // Monday Nov 2, 2026
  const entries: WorkEntry[] = [
    // Працівник 1: тільки години (прибирання, риштування, підготовка), 0 м²
    {
      id: '1',
      date: '2026-11-02',
      employeeName: 'Олександр Мельник',
      location: 'ЖК Сонячний, Секція 1',
      taskDescription: 'Підготовчі роботи та прийом матеріалів',
      category: 'Загальнобудівельні роботи',
      recordType: 'hours_only',
      hoursWorked: 8,
      squareMeters: 0,
      createdAt: 1000,
    },
    // Працівник 2: тільки метри квадратні (виконано за відрядною формою), 0 годин
    {
      id: '2',
      date: '2026-11-02',
      employeeName: 'Олена Бондаренко',
      location: 'ЖК Сонячний, Секція 2',
      taskDescription: 'Укладання плитки у вестибюлі',
      category: 'Плитка та підлога',
      recordType: 'sqm_only',
      hoursWorked: 0,
      squareMeters: 25,
      createdAt: 2000,
    },
    // Працівник 3: і години, і метри квадратні
    {
      id: '3',
      date: '2026-11-02',
      employeeName: 'Дмитро Кравченко',
      location: 'БЦ Панорама',
      taskDescription: 'Бетонна стяжка',
      category: 'Бетон та фундамент',
      recordType: 'both',
      hoursWorked: 7.5,
      squareMeters: 30,
      createdAt: 3000,
    },
  ];

  const summary = calculateDaySummary(date, entries);

  // Перевірка незалежності розрахунку 1: Людино-години (8 + 0 + 7.5 = 15.5)
  assert.equal(summary.totalHours, 15.5);

  // Перевірка незалежності розрахунку 2: Квадратні метри (0 + 25 + 30 = 55)
  assert.equal(summary.totalSquareMeters, 55);

  assert.equal(summary.entryCount, 3);
  assert.equal(summary.employeeCount, 3);
  assert.equal(summary.locationsCount, 3);
});

test('calculateWeekSummary виконує два окремих розрахунки за тиждень та групує за локаціями', () => {
  const monday = new Date(2026, 10, 2);
  const entries: WorkEntry[] = [
    // Пн: 8 годин, 20 м² на Об'єкті А
    {
      id: 'm1',
      date: '2026-11-02',
      employeeName: 'Олександр Мельник',
      location: 'ЖК Сонячний',
      taskDescription: 'Цегляна кладка',
      category: 'Мурування та кладка',
      hoursWorked: 8,
      squareMeters: 20,
      createdAt: 1,
    },
    // Вт: тільки 8 годин, 0 м² на Об'єкті Б
    {
      id: 't1',
      date: '2026-11-03',
      employeeName: 'Олександр Мельник',
      location: 'Котеджне містечко',
      taskDescription: 'Монтаж риштування',
      category: 'Загальнобудівельні роботи',
      hoursWorked: 8,
      squareMeters: 0,
      createdAt: 2,
    },
    // Ср: тільки 45 м², 0 годин на Об'єкті А
    {
      id: 'w1',
      date: '2026-11-04',
      employeeName: 'Олена Бондаренко',
      location: 'ЖК Сонячний',
      taskDescription: 'Укладання плитки',
      category: 'Плитка та підлога',
      hoursWorked: 0,
      squareMeters: 45,
      createdAt: 3,
    },
  ];

  const weekSummary = calculateWeekSummary(monday, entries);

  // РОЗРАХУНОК 1: Людино-години = 8 + 8 = 16 год.
  assert.equal(weekSummary.totalManHours, 16);

  // РОЗРАХУНОК 2: Збудовані квадратні метри = 20 + 45 = 65 м²
  assert.equal(weekSummary.totalSquareMeters, 65);

  // Перевірка розрахунку за локаціями (де виконувалися роботи)
  const locA = weekSummary.locationSummaries.find((l) => l.location === 'ЖК Сонячний');
  assert.ok(locA);
  assert.equal(locA?.totalHours, 8);
  assert.equal(locA?.totalSquareMeters, 65);
  assert.equal(locA?.dayHours['2026-11-02'], 8);
  assert.equal(locA?.daySquareMeters['2026-11-04'], 45);
  assert.equal(locA?.daysWorkedCount, 2);
  assert.equal(locA?.percentageOfHours, 50);

  const locB = weekSummary.locationSummaries.find((l) => l.location === 'Котеджне містечко');
  assert.ok(locB);
  assert.equal(locB?.totalHours, 8);
  assert.equal(locB?.totalSquareMeters, 0);
  assert.equal(locB?.dayHours['2026-11-03'], 8);
  assert.equal(locB?.percentageOfHours, 50);
});
