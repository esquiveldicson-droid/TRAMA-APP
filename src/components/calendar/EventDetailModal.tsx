import React, { useState } from 'react';
import { FamilyEvent, AttendanceStatus } from '../../types/family';
import { useFamilyStore } from '../../store/useFamilyStore';
import { Avatar } from '../common/Avatar';
import {
  X,
  MapPin,
  Clock,
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  Plus,
  Flame,
  Cake,
  Users,
} from 'lucide-react';

interface Props {
  event: FamilyEvent | null;
  onClose: () => void;
}

export const EventDetailModal: React.FC<Props> = ({ event, onClose }) => {
  const users = useFamilyStore((state) => state.users);
  const currentUser = useFamilyStore((state) => state.currentUser);
  const updateAttendance = useFamilyStore((state) => state.updateAttendance);
  const toggleChecklistItem = useFamilyStore((state) => state.toggleChecklistItem);
  const showToast = useFamilyStore((state) => state.showToast);

  const [newItemText, setNewItemText] = useState('');

  if (!event) return null;

  const creator = users.find((u) => u.id === event.creador_id);
  const myAttendance = currentUser ? event.asistencias[currentUser.id] || 'tal_vez' : 'tal_vez';

  const handleRSVP = (status: AttendanceStatus) => {
    updateAttendance(event.id, status);
  };

  const handleToggleItem = (itemId: string) => {
    toggleChecklistItem(event.id, itemId);
  };

  const attendanceOptions: Array<{ status: AttendanceStatus; label: string; color: string }> = [
    { status: 'voy', label: '¡Voy seguro!', color: 'bg-emerald-600 text-white' },
    { status: 'tal_vez', label: 'Tal vez', color: 'bg-amber-500 text-white' },
    { status: 'no_voy', label: 'No puedo', color: 'bg-rose-500 text-white' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-[#FFFDF9] w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#EFE7DA] overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-6">
        {/* Header banner */}
        <div className="p-4 sm:p-5 border-b border-[#EFE7DA] bg-[#FAF6F0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#E07A5F] flex items-center justify-center text-white shadow-xs">
              {event.tipo === 'asado' ? (
                <Flame className="w-5 h-5" />
              ) : event.tipo === 'cumpleanos' ? (
                <Cake className="w-5 h-5" />
              ) : (
                <CalendarIcon className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-['Playfair_Display'] font-bold text-base text-[#2C2724]">
                {event.titulo}
              </h3>
              <p className="text-xs text-[#2C2724]/60">
                Organizado por {creator?.nombre || 'Familia'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-200/60 flex items-center justify-center text-stone-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Metadata chips */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 p-2.5 bg-stone-50 rounded-xl border border-stone-200/60">
              <Clock className="w-4 h-4 text-[#E07A5F]" />
              <span className="font-medium text-[#2C2724]">
                {event.fecha} {event.hora ? `a las ${event.hora}` : ''}
              </span>
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-stone-50 rounded-xl border border-stone-200/60">
              <MapPin className="w-4 h-4 text-[#819B84]" />
              <span className="font-medium text-[#2C2724] truncate">
                {event.ubicacion}
              </span>
            </div>
          </div>

          {/* Description */}
          {event.descripcion && (
            <p className="text-xs sm:text-sm text-[#2C2724]/80 bg-[#FAF6F0] p-3 rounded-xl border border-[#EFE7DA]">
              {event.descripcion}
            </p>
          )}

          {/* Attendance Section (RSVP) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C2724]/70 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#E07A5F]" />
                <span>Asistencia Familiar</span>
              </h4>
              <span className="text-xs font-semibold text-[#819B84]">
                {Object.values(event.asistencias).filter((s) => s === 'voy').length} de 5 confirmados
              </span>
            </div>

            {/* My RSVP Button Bar */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {attendanceOptions.map((opt) => {
                const isSelected = myAttendance === opt.status;
                return (
                  <button
                    key={opt.status}
                    onClick={() => handleRSVP(opt.status)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                      isSelected
                        ? `${opt.color} border-transparent shadow-xs scale-102`
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Family List Attendance Breakdown */}
            <div className="space-y-1.5">
              {users.map((user) => {
                const status = event.asistencias[user.id] || 'tal_vez';
                const statusConfig: Record<string, { label: string; badge: string }> = {
                  voy: { label: 'Confirmado', badge: 'bg-emerald-100 text-emerald-800' },
                  tal_vez: { label: 'Tal vez', badge: 'bg-amber-100 text-amber-800' },
                  no_voy: { label: 'No puede', badge: 'bg-rose-100 text-rose-800' },
                };
                const conf = statusConfig[status];

                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#EFE7DA]"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar user={user} size="sm" />
                      <span className="text-xs font-bold text-[#2C2724]">
                        {user.nombre}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${conf.badge}`}>
                      {conf.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Checklist / Shopping List (Block 6, req 55) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C2724]/70">
                Lista de Compras / Tareas
              </h4>
              <span className="text-[11px] text-stone-500 font-medium">
                Toca para asignártelo
              </span>
            </div>

            <div className="space-y-2">
              {event.items_necesarios.map((item) => {
                const assignee = users.find((u) => u.id === item.asignado_a);

                return (
                  <div
                    key={item.id}
                    onClick={() => handleToggleItem(item.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                      item.completado
                        ? 'bg-emerald-50/70 border-emerald-200 text-stone-500 line-through'
                        : 'bg-white border-[#EFE7DA] hover:border-[#E07A5F]/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.completado ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-stone-400 shrink-0" />
                      )}
                      <span className="text-xs font-medium text-[#2C2724]">
                        {item.titulo}
                      </span>
                    </div>

                    {assignee && (
                      <div className="flex items-center gap-1 bg-[#FAF6F0] px-2 py-0.5 rounded-full border border-stone-200 shrink-0">
                        <Avatar user={assignee} size="sm" className="!w-4 !h-4 text-[8px]" />
                        <span className="text-[10px] font-semibold text-stone-700">
                          {assignee.nombre.split(' ')[0]}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
