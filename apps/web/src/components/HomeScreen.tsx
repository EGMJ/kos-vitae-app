import { Clock, MapPin } from 'lucide-react';

interface HomeScreenProps {
  onFinancialClick?: () => void;
}

export default function HomeScreen({ onFinancialClick }: HomeScreenProps) {
  const professionalName = 'Silva';

  return (
    <>
      {/* Safe Area Top */}
      {/* Header */}
      <div className="px-4 pt-4 pb-6 flex items-center justify-between">
        <h1 className="text-[18px] font-medium text-[#022759]">
          Olá, Dr(a). {professionalName}
        </h1>
        <div className="w-10 h-10 rounded-full bg-[#8FC0FF] flex items-center justify-center">
          <span className="text-[#022759] text-sm font-medium">
            {professionalName.charAt(0)}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 space-y-4 pb-24">
        {/* Next Patient Card */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)] relative">
          <div className="pr-28">
            <p className="text-[16px] text-[#022759]">
              Próximo Paciente
            </p>
            <h2 className="text-[22px] font-medium text-[#022759] mt-1">
              Maria da Silva
            </h2>
            
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-[#8FC0FF]" />
                <span className="text-[14px] text-[#022759]">14:30</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-[#8FC0FF]" />
                <span className="text-[14px] text-[#022759]">Rua das Flores, 123</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button 
            type="button"
            className="absolute top-4 right-4 bg-[#ADFB49] rounded-lg px-4 py-3 hover:bg-[#9DE83A] transition-colors cursor-pointer font-medium"
          >
            <span className="text-[14px] text-[#022759]">
              Iniciar Rota
            </span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Patients Today Card */}
          <div className="bg-white rounded-xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)] text-center">
            <p className="text-[32px] text-[#022759]">
              08
            </p>
            <p className="text-[14px] text-[#022759] opacity-70 mt-1">
              Pacientes de Hoje
            </p>
          </div>

          {/* Completed Card */}
          <div className="bg-white rounded-xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)] text-center">
            <p className="text-[32px] text-[#022759]">
              02
            </p>
            <p className="text-[14px] text-[#022759] opacity-70 mt-1">
              Concluídos
            </p>
          </div>
        </div>

        {/* Financial Summary Card */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <p className="text-[16px] text-[#022759]">
            Financeiro (Este Mês)
          </p>
          <p className="text-[36px] text-[#022759] mt-2">
            R$ 4.320,50
          </p>
          <p className="text-[14px] text-[#022759] opacity-70 mt-1">
            Prev. a receber: R$ 3.800,00
          </p>
          <button 
            type="button"
            onClick={onFinancialClick}
            className="text-[14px] text-[#8FC0FF] mt-3 hover:underline cursor-pointer font-medium"
          >
            Ver detalhes
          </button>
        </div>
      </div>
    </>
  );
}
