import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface TimesheetScreenProps {
  onBack: () => void;
}

interface DailyRecord {
  id: string;
  date: string;
  appointments: number;
  hours: string;
}

const mockRecords: DailyRecord[] = [
  { id: '1', date: 'Segunda, 27 Out', appointments: 4, hours: '6h 30m' },
  { id: '2', date: 'Terça, 28 Out', appointments: 3, hours: '5h 15m' },
  { id: '3', date: 'Quarta, 29 Out', appointments: 5, hours: '7h 45m' },
  { id: '4', date: 'Quinta, 30 Out', appointments: 4, hours: '6h 00m' },
  { id: '5', date: 'Sexta, 31 Out', appointments: 3, hours: '4h 30m' },
  { id: '6', date: 'Segunda, 3 Nov', appointments: 4, hours: '6h 15m' },
  { id: '7', date: 'Terça, 4 Nov', appointments: 5, hours: '7h 30m' },
  { id: '8', date: 'Quarta, 5 Nov', appointments: 3, hours: '5h 00m' },
  { id: '9', date: 'Quinta, 6 Nov', appointments: 4, hours: '6h 45m' },
  { id: '10', date: 'Sexta, 7 Nov', appointments: 4, hours: '6h 20m' },
];

export default function TimesheetScreen({ onBack }: TimesheetScreenProps) {
  const [currentMonth, setCurrentMonth] = useState('Outubro 2025');

  const handlePreviousMonth = () => {
    // In a real app, this would navigate to previous month
    setCurrentMonth('Setembro 2025');
  };

  const handleNextMonth = () => {
    // In a real app, this would navigate to next month
    setCurrentMonth('Novembro 2025');
  };

  return (
    <>
      {/* Safe Area Top */}

      {/* Header with Back Button */}
      <div className="px-4 pt-4 pb-4 flex items-center justify-center relative">
        <button
          type="button"
          onClick={onBack}
          className="absolute left-4 top-4 p-1 hover:opacity-70 transition-opacity cursor-pointer"
          aria-label="Voltar"
        >
          <ChevronLeft className="w-6 h-6 text-[#022759]" />
        </button>
        <h1 className="text-[18px] text-[#022759]">
          Consolidado de Ponto
        </h1>
      </div>

      {/* Scrollable Content */}
      <div className="px-4 pb-24 overflow-y-auto flex-1">
        {/* Month Selector */}
        <div className="bg-white rounded-lg h-12 flex items-center justify-between px-4 mb-4">
          <button
            type="button"
            onClick={handlePreviousMonth}
            className="p-1 hover:opacity-70 transition-opacity cursor-pointer"
            aria-label="Mês anterior"
          >
            <ChevronLeft className="w-5 h-5 text-[#8FC0FF]" />
          </button>
          <span className="text-[16px] text-[#022759]">
            {currentMonth}
          </span>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1 hover:opacity-70 transition-opacity cursor-pointer"
            aria-label="Próximo mês"
          >
            <ChevronRight className="w-5 h-5 text-[#8FC0FF]" />
          </button>
        </div>

        {/* Summary Cards Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Total Hours Card */}
          <div className="bg-white rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center">
            <p className="text-[28px] text-[#022759] mb-2">
              132h 45m
            </p>
            <p className="text-[14px] text-[#022759] opacity-70 text-center">
              Horas no Mês
            </p>
          </div>

          {/* Total Appointments Card */}
          <div className="bg-white rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center">
            <p className="text-[28px] text-[#022759] mb-2">
              88
            </p>
            <p className="text-[14px] text-[#022759] opacity-70 text-center">
              Atendimentos
            </p>
          </div>
        </div>

        {/* Daily Records Section */}
        <h2 className="text-[16px] text-[#022759] mb-4">
          Registros Diários
        </h2>

        {/* Daily Records List */}
        <div className="space-y-3 mb-6">
          {mockRecords.map((record) => (
            <button
              key={record.id}
              type="button"
              className="w-full bg-white rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-shadow cursor-pointer"
            >
              <div className="flex-1 text-left">
                <p className="text-[16px] text-[#022759] mb-1">
                  {record.date}
                </p>
                <p className="text-[14px] text-[#022759] opacity-70">
                  {record.appointments} atendimentos • {record.hours}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#8FC0FF] flex-shrink-0" />
            </button>
          ))}
        </div>

        {/* Sign Button */}
        <div className="pt-4 pb-4">
          <button 
            type="button"
            className="w-full bg-[#ADFB49] rounded-lg h-12 shadow-[0_4px_12px_rgba(173,251,73,0.4)] hover:bg-[#9DE83A] transition-colors cursor-pointer font-medium"
          >
            <span className="text-[16px] text-[#022759]">
              Assinar Folha de Ponto (Outubro)
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
