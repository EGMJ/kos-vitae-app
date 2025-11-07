import { Search, ChevronRight, Plus } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  initials: string;
  condition: string;
}

const mockPatients: Patient[] = [
  { id: '1', name: 'Maria da Silva', initials: 'MS', condition: 'Fisioterapia Motora' },
  { id: '2', name: 'João Santos', initials: 'JS', condition: 'Reabilitação Cardíaca' },
  { id: '3', name: 'Ana Paula Costa', initials: 'AC', condition: 'Fisioterapia Respiratória' },
  { id: '4', name: 'Carlos Eduardo Lima', initials: 'CL', condition: 'Fisioterapia Ortopédica' },
  { id: '5', name: 'Fernanda Oliveira', initials: 'FO', condition: 'Fisioterapia Neurológica' },
  { id: '6', name: 'Roberto Alves', initials: 'RA', condition: 'Fisioterapia Motora' },
  { id: '7', name: 'Patricia Mendes', initials: 'PM', condition: 'Reabilitação Pós-Cirúrgica' },
  { id: '8', name: 'Lucas Ferreira', initials: 'LF', condition: 'Fisioterapia Esportiva' },
];

interface PatientsScreenProps {
  onPatientClick: (patientName: string) => void;
}

export default function PatientsScreen({ onPatientClick }: PatientsScreenProps) {
  return (
    <>
      {/* Safe Area Top */}

      {/* Header */}
      <div className="px-4 pt-4 pb-4">
        <h1 className="text-[24px] text-[#022759]">Meus Pacientes</h1>
      </div>

      {/* Search Bar */}
      <div className="px-4 pb-4">
        <div className="bg-white rounded-lg h-12 flex items-center px-4">
          <Search className="w-5 h-5 text-[#022759] opacity-50" />
          <input
            type="text"
            placeholder="Buscar por nome ou CPF..."
            className="flex-1 ml-2 text-[16px] text-[#022759] placeholder:text-[#022759] placeholder:opacity-40 bg-transparent outline-none"
          />
        </div>
      </div>

      {/* Patient List - Scrollable */}
      <div className="px-4 space-y-3 pb-24 overflow-y-auto flex-1">
        {mockPatients.map((patient) => (
          <button
            key={patient.id}
            type="button"
            onClick={() => onPatientClick(patient.name)}
            className="w-full bg-white rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-shadow cursor-pointer"
          >
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-[#8FC0FF] flex items-center justify-center flex-shrink-0">
              <span className="text-[#022759] text-sm font-medium">
                {patient.initials}
              </span>
            </div>

            {/* Patient Info */}
            <div className="ml-3 flex-1 text-left">
              <p className="text-[16px] font-medium text-[#022759]">
                {patient.name}
              </p>
              <p className="text-[14px] text-[#022759] opacity-70 mt-0.5">
                {patient.condition}
              </p>
            </div>

            {/* Chevron Icon */}
            <ChevronRight className="w-5 h-5 text-[#8FC0FF] flex-shrink-0" />
          </button>
        ))}
      </div>

      {/* Floating Action Button (FAB) */}
      <button
        type="button"
        className="fixed bottom-[100px] right-4 w-14 h-14 rounded-full bg-[#ADFB49] shadow-[0_4px_12px_rgba(173,251,73,0.4)] flex items-center justify-center hover:bg-[#9DE83A] transition-colors z-10 cursor-pointer"
        aria-label="Adicionar paciente"
      >
        <Plus className="w-6 h-6 text-[#022759]" />
      </button>
    </>
  );
}
