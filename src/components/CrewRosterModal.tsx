import React, { useState } from 'react';
import { X, Users, Plus, Trash2, Briefcase } from 'lucide-react';
import { Employee } from '../types';

interface CrewRosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  onAddEmployee: (name: string, role: string) => void;
  onDeleteEmployee: (id: string) => void;
}

export const CrewRosterModal: React.FC<CrewRosterModalProps> = ({
  isOpen,
  onClose,
  employees,
  onAddEmployee,
  onDeleteEmployee,
}) => {
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setError("Вкажіть прізвище та ім'я працівника");
      return;
    }
    onAddEmployee(newName.trim(), newRole.trim() || 'Загальнобудівельні роботи');
    setNewName('');
    setNewRole('');
    setError('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="roster-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="relative bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl text-white overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 id="roster-modal-title" className="text-lg font-bold text-white">
                Склад бригади та працівників
              </h2>
              <p className="text-xs text-slate-400">
                Список постійних майстрів для швидкого автозаповнення в щоденному журналі
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Закрити вікно бригади"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add Worker Form */}
        <form onSubmit={handleAdd} className="p-6 border-b border-slate-800 bg-slate-950/20 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Додати нового майстра
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                placeholder="ПІБ (напр. Тарас Шевчук)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Спеціальність (напр. Муляр, Плиточник)"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
          </div>

          {error && <p className="text-rose-400 text-xs">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Додати до складу бригади</span>
          </button>
        </form>

        {/* Existing Crew List */}
        <div className="p-6 max-h-72 overflow-y-auto space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Зареєстровані працівники ({employees.length})</span>
          </div>

          {employees.map((emp) => (
            <div
              key={emp.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-slate-700 transition"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-200 font-bold text-xs flex items-center justify-center border border-slate-700">
                  {emp.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{emp.name}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-slate-500" />
                    {emp.role}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onDeleteEmployee(emp.id)}
                aria-label={`Видалити ${emp.name} зі списку`}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
                title="Видалити зі списку"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 flex justify-end bg-slate-950/40">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition cursor-pointer"
          >
            Закрити
          </button>
        </div>
      </div>
    </div>
  );
};
