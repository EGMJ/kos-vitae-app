import { ChevronLeft, MapPin, Clipboard, Clock, Calendar, Archive } from 'lucide-react';

interface PatientDetailScreenProps {
  onBack: () => void;
  patientName: string;
  onStartTimeTracking?: () => void;
}

export default function PatientDetailScreen({ onBack, patientName, onStartTimeTracking }: PatientDetailScreenProps) {
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
          Detalhes do Paciente
        </h1>
      </div>

      {/* Scrollable Content */}
      <div className="px-4 space-y-4 pb-24 overflow-y-auto flex-1">
        {/* Main Information Card */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="flex items-start gap-3 mb-6">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-[#8FC0FF] flex items-center justify-center flex-shrink-0">
              <span className="text-[#022759] text-xl font-medium">
                {patientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>

            {/* Name and Status */}
            <div className="flex-1 pt-1">
              <h2 className="text-[20px] text-[#022759] mb-2">
                {patientName}
              </h2>
              <div className="inline-flex items-center px-2 py-1 rounded bg-[#ADFB49]">
                <span className="text-[12px] text-[#022759]">
                  Particular
                </span>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2 mb-3">
            <MapPin className="w-4 h-4 text-[#022759] opacity-70 mt-0.5 flex-shrink-0" />
            <p className="text-[14px] text-[#022759]">
              Rua das Flores, 123 - Centro
            </p>
          </div>

          {/* Condition */}
          <div className="flex items-start gap-2">
            <Clipboard className="w-4 h-4 text-[#022759] opacity-70 mt-0.5 flex-shrink-0" />
            <p className="text-[14px] text-[#022759]">
              Fisioterapia Motora - Recuperação pós-cirúrgica
            </p>
          </div>
        </div>

        {/* Logistics Card */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <h3 className="text-[16px] text-[#022759] mb-4">
            Logística
          </h3>
          <div className="flex items-start gap-6">
            {/* Time */}
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#8FC0FF] flex-shrink-0" />
              <div className="text-[14px] text-[#022759]">
                <span>Horário Fixo: </span>
                <span className="font-medium">14:30</span>
              </div>
            </div>

            {/* Frequency */}
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#8FC0FF] flex-shrink-0" />
              <div className="text-[14px] text-[#022759]">
                <span>Frequência: </span>
                <span className="font-medium">8/mês</span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Situation Card */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <h3 className="text-[16px] text-[#022759] mb-3">
            Situação Financeira
          </h3>
          <p className="text-[14px] text-[#022759] opacity-70 mb-1">
            Valor pendente (Convênio)
          </p>
          <p className="text-[32px] text-[#022759]">
            R$ 450,00
          </p>
        </div>

        {/* Quick Actions */}
        {onStartTimeTracking && (
          <button 
            type="button"
            onClick={onStartTimeTracking}
            className="w-full bg-[#ADFB49] rounded-2xl py-4 shadow-[0_4px_12px_rgba(173,251,73,0.4)] hover:bg-[#9DE83A] transition-colors cursor-pointer font-medium"
          >
            <span className="text-[16px] text-[#022759]">
              Marcar Ponto de Atendimento
            </span>
          </button>
        )}

        {/* Medical Record Card */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <h3 className="text-[16px] text-[#022759] mb-3">
            Prontuário (Resumo)
          </h3>
          <p className="text-[14px] text-[#022759] opacity-80 mb-4 leading-relaxed">
            Paciente em recuperação de cirurgia no joelho esquerdo. Apresenta boa evolução, mas relata dores leves ao realizar movimentos de flexão. Recomendado acompanhamento contínuo...
          </p>
          <button 
            type="button"
            className="w-full bg-[#ADFB49] rounded-lg py-3 hover:bg-[#9DE83A] transition-colors cursor-pointer font-medium"
          >
            <span className="text-[14px] text-[#022759]">
              Ver Prontuário Avançado
            </span>
          </button>
        </div>

        {/* Archive Action */}
        <div className="flex items-center justify-center gap-2 py-4">
          <Archive className="w-4 h-4 text-[#022759] opacity-70" />
          <button 
            type="button"
            className="text-[14px] font-medium text-[#022759] opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
          >
            Arquivar este paciente
          </button>
        </div>
      </div>
    </>
  );
}
