import React, { useState } from 'react';
import { useFamilyStore } from '../../store/useFamilyStore';
import { FamilyEvent } from '../../types/family';
import { EventDetailModal } from './EventDetailModal';
import { CreateEventModal } from './CreateEventModal';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Flame,
  Cake,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  MapPin,
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const events = useFamilyStore((state) => state.events);
  const users = useFamilyStore((state) => state.users);

  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1)); // October 2026
  const [selectedDay, setSelectedDay] = useState<number>(11); // Default selected Sunday
  const [selectedEvent, setSelectedEvent] = useState<FamilyEvent | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Build events for a specific day in this month
  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter((e) => e.fecha === dateStr);
  };

  // Build birthdays for a specific day in this month
  const getBirthdaysForDay = (day: number) => {
    const monthPad = String(month + 1).padStart(2, '0');
    const dayPad = String(day).padStart(2, '0');
    return users.filter((u) => u.cumpleanos.slice(5) === `${monthPad}-${dayPad}`);
  };

  // Upcoming agenda (next events sorted by date)
  const sortedEvents = [...events].sort((a, b) => a.fecha.localeCompare(b.fecha));

  const dayEvents = getEventsForDay(selectedDay);
  const dayBirthdays = getBirthdaysForDay(selectedDay);

  return (
    <div className="pb-24 max-w-md mx-auto px-4 pt-3">
      {/* Month Navigation Card */}
      <div className="bg-[#FFFDF9] rounded-3xl p-4 sm:p-5 border border-[#EFE7DA] shadow-xs mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#2C2724]">
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs text-[#2C2724]/60 font-medium">
              Calendario Familiar y Asados
            </p>
          </div>
          <div className="flex items-center gap-1 bg-[#FAF6F0] p-1 rounded-2xl border border-[#EFE7DA]">
            <button
              onClick={prevMonth}
              className="p-1.5 hover:bg-white rounded-xl text-stone-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 hover:bg-white rounded-xl text-stone-600 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 text-center text-[11px] font-bold text-stone-400 mb-2">
          <span>Dom</span>
          <span>Lun</span>
          <span>Mar</span>
          <span>Mié</span>
          <span>Jue</span>
          <span>Vie</span>
          <span>Sáb</span>
        </div>

        {/* Monthly Grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isSelected = selectedDay === day;
            const hasEvents = getEventsForDay(day).length > 0;
            const bdays = getBirthdaysForDay(day);
            const hasBirthday = bdays.length > 0;

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`h-10 rounded-2xl flex flex-col items-center justify-center relative text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-[#E07A5F] text-white shadow-sm scale-105 z-10'
                    : 'text-[#2C2724] hover:bg-[#FAF6F0]'
                }`}
              >
                <span>{day}</span>
                <div className="flex gap-0.5 mt-0.5">
                  {hasEvents && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-white' : 'bg-[#E07A5F]'
                      }`}
                    />
                  )}
                  {hasBirthday && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-amber-200' : 'bg-amber-500'
                      }`}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda Detail */}
      <div className="bg-[#FFFDF9] rounded-3xl p-4 sm:p-5 border border-[#EFE7DA] shadow-xs mb-4">
        <div className="flex items-center justify-between mb-3 border-b border-[#EFE7DA] pb-2">
          <h3 className="font-bold text-sm text-[#2C2724] flex items-center gap-1.5">
            <CalendarIcon className="w-4 h-4 text-[#E07A5F]" />
            <span>
              {selectedDay} de {monthNames[month]}
            </span>
          </h3>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="text-xs font-bold text-[#E07A5F] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Planear algo</span>
          </button>
        </div>

        {dayBirthdays.length > 0 && (
          <div className="space-y-2 mb-3">
            {dayBirthdays.map((u) => (
              <div
                key={u.id}
                className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-amber-400 text-white flex items-center justify-center shrink-0">
                  <Cake className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-900">
                    🎂 ¡Cumpleaños de {u.nombre}!
                  </h4>
                  <p className="text-[11px] text-amber-700">
                    Plato favorito: {u.comida_fav}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {dayEvents.length === 0 && dayBirthdays.length === 0 ? (
          <div className="text-center py-4 text-xs text-stone-400">
            No hay actividades familiares registradas para este día.
          </div>
        ) : (
          <div className="space-y-2.5">
            {dayEvents.map((ev) => (
              <div
                key={ev.id}
                onClick={() => setSelectedEvent(ev)}
                className="p-3 rounded-2xl border border-[#EFE7DA] bg-[#FAF6F0] hover:border-[#E07A5F]/50 cursor-pointer transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#E07A5F] text-white flex items-center justify-center shrink-0">
                    {ev.tipo === 'asado' ? <Flame className="w-4 h-4" /> : <CalendarIcon className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#2C2724]">{ev.titulo}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3" />
                        {ev.hora || '13:00'}
                      </span>
                      <span>•</span>
                      <span className="truncate max-w-[140px]">{ev.ubicacion}</span>
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#819B84] bg-[#819B84]/15 px-2 py-0.5 rounded-full shrink-0">
                  Ver detalle
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Agenda: Próximos Encuentros de la Familia */}
      <div className="space-y-2 mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C2724]/70 px-1">
          Próximos Encuentros Familiares
        </h3>
        {sortedEvents.map((ev) => (
          <div
            key={ev.id}
            onClick={() => setSelectedEvent(ev)}
            className="p-3 bg-[#FFFDF9] rounded-2xl border border-[#EFE7DA] flex items-center justify-between cursor-pointer hover:border-[#E07A5F]/40"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#819B84]/20 text-[#647C66] flex items-center justify-center font-bold text-xs">
                {ev.fecha.slice(8, 10)}
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#2C2724]">{ev.titulo}</h4>
                <p className="text-[11px] text-stone-500">{ev.ubicacion}</p>
              </div>
            </div>
            <span className="text-[11px] text-[#E07A5F] font-semibold">
              {ev.items_necesarios.filter((i) => i.completado).length}/{ev.items_necesarios.length} tareas
            </span>
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsCreateOpen(true)}
        className="fixed bottom-20 right-4 z-40 px-4 py-3.5 rounded-full bg-[var(--theme-primary)] active:scale-95 text-white shadow-xl shadow-[var(--theme-primary)]/40 flex items-center gap-2 text-xs font-bold transition-all"
        aria-label="Planear Asado / Reunión"
      >
        <Flame className="w-4 h-4" />
        <span>Planear Asado</span>
      </button>

      {/* Modals */}
      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
      <CreateEventModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        defaultDate={`${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`}
      />
    </div>
  );
};
