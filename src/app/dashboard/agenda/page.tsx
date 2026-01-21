"use client";

import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Clock, Car, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AgendaPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Generate calendar days
  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
      if (current.getMonth() !== month && current.getDay() === 0 && i > 20) break;
    }
    
    return days;
  };

  const appointments = [
    { date: 15, time: "08:00", customer: "João Silva", car: "Toyota Corolla", service: "Revisão" },
    { date: 15, time: "09:30", customer: "Maria Santos", car: "Honda Civic", service: "Freios" },
    { date: 15, time: "11:00", customer: "Pedro Costa", car: "VW Golf", service: "Diagnóstico" },
    { date: 16, time: "14:00", customer: "Ana Oliveira", car: "Chevrolet Onix", service: "Troca de óleo" },
    { date: 16, time: "16:00", customer: "Carlos Ferreira", car: "Fiat Argo", service: "Suspensão" },
    { date: 20, time: "10:00", customer: "Lucas Silva", car: "Ford Ka", service: "Alinhamento" },
  ];

  const calendarDays = generateCalendarDays(currentDate);
  const today = new Date();
  
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter(apt => apt.date === day.getDate());
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Agenda</h1>
          <p className="text-white/50 text-sm">Gerencie os agendamentos da oficina</p>
        </div>

        <div className="flex items-center gap-3">
          <Button className="cyan-button h-9">
            <Plus className="w-4 h-4 mr-1" />
            Novo Agendamento
          </Button>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white/[0.02] border border-white/5 rounded-lg overflow-hidden">
        {/* Calendar Header */}
        <div className="border-b border-white/5 p-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigateMonth(-1)}
              className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <h2 className="text-lg font-semibold text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            
            <button 
              onClick={() => navigateMonth(1)}
              className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 border-b border-white/5">
          {weekDays.map((day) => (
            <div key={day} className="p-3 text-center">
              <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
                {day}
              </span>
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday = day.toDateString() === today.toDateString();
            const dayAppointments = getAppointmentsForDay(day);
            
            return (
              <div
                key={index}
                className={`
                  min-h-[80px] p-2 border-r border-b border-white/5
                  ${!isCurrentMonth ? 'opacity-30' : ''}
                  ${isToday ? 'bg-electric-cyan/10' : ''}
                  hover:bg-white/[0.02] transition-colors
                `}
              >
                <div className={`text-sm font-medium mb-1 ${isToday ? 'text-electric-cyan' : isCurrentMonth ? 'text-white' : 'text-white/40'}`}>
                  {day.getDate()}
                </div>
                
                <div className="space-y-1">
                  {dayAppointments.slice(0, 2).map((apt, i) => (
                    <div
                      key={i}
                      className="group"
                    >
                      <div className="text-xs p-1.5 bg-white/5 border border-white/10 rounded cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all duration-200">
                        <div className="font-medium text-white truncate">
                          {apt.customer}
                        </div>
                        <div className="text-white/50 text-xs mt-0.5">
                          {apt.car} • {apt.service}
                        </div>
                      </div>
                    </div>
                  ))}
                  {dayAppointments.length > 2 && (
                    <div className="text-xs text-white/40 p-1 text-center">
                      +{dayAppointments.length - 2} mais
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="mt-6 bg-white/[0.02] border border-white/5 rounded-lg overflow-hidden">
        <div className="border-b border-white/5 p-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Agendamentos de Hoje
          </h3>
        </div>

        <div className="divide-y divide-white/5">
          {appointments
            .filter(apt => apt.date === today.getDate())
            .map((apt, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors group"
              >
                <div className="w-16 text-center">
                  <span className="font-mono text-electric-cyan text-sm">{apt.time}</span>
                </div>

                <div className="w-2 h-2 rounded-full bg-electric-cyan" />

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{apt.customer}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/50 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Car className="w-3 h-3" />
                      {apt.car}
                    </span>
                    <span>•</span>
                    <span>{apt.service}</span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-electric-cyan hover:bg-electric-cyan/10"
                >
                  Ver detalhes
                </Button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
