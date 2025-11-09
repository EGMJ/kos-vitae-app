import { ChevronLeft, Play, StopCircle, Clock, MapPin } from 'lucide-react';
import { useState } from 'react';

interface TimeTrackingScreenProps {
  onBack: () => void;
  patientName: string;
  patientAddress: string;
}

export default function TimeTrackingScreen({ 
  onBack, 
  patientName, 
  patientAddress 
}: TimeTrackingScreenProps) {
  const [isInProgress, setIsInProgress] = useState(false);
  const [startTime, setStartTime] = useState<string | null>(null);

  const handleStart = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    setStartTime(timeString);
    setIsInProgress(true);
  };

  const handleFinish = () => {
    // In a real app, this would save the data
    setIsInProgress(false);
    setStartTime(null);
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
          Marcar Ponto
        </h1>
      </div>

      {/* Main Content */}
      <div className="px-4 space-y-4 pb-24">
        {/* Context Card - Patient Info */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <p className="text-[16px] text-[#022759] mb-2">
            Atendimento em andamento:
          </p>
          <h2 className="text-[20px] font-medium text-[#022759] mb-1">
            {patientName}
          </h2>
          <p className="text-[14px] text-[#022759] opacity-70">
            {patientAddress}
          </p>
        </div>

        {/* Action Button */}
        {!isInProgress ? (
          <button
            type="button"
            onClick={handleStart}
            className="w-full bg-[#ADFB49] rounded-xl p-5 shadow-[0_4px_12px_rgba(173,251,73,0.4)] flex items-center hover:bg-[#9DE83A] transition-colors cursor-pointer font-medium"
          >
            <Play className="w-5 h-5 text-[#022759] ml-4" />
            <span className="text-[16px] text-[#022759] ml-3">
              Iniciar Atendimento
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinish}
            className="w-full bg-[#022759] rounded-xl p-5 shadow-[0_4px_12px_rgba(2,39,89,0.3)] flex items-center hover:bg-[#033176] transition-colors cursor-pointer font-medium"
          >
            <StopCircle className="w-5 h-5 text-white ml-4" />
            <span className="text-[16px] text-white ml-3">
              Finalizar Atendimento
            </span>
          </button>
        )}

        {/* Status Panel */}
        {!isInProgress ? (
          // State 1: Waiting to start
          <div className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center min-h-[120px]">
            <Clock className="w-6 h-6 text-[#022759] opacity-40 mb-3" />
            <p className="text-[16px] text-[#022759] opacity-70 text-center">
              Aguardando início do atendimento...
            </p>
          </div>
        ) : (
          // State 2: In progress
          <div className="bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            {/* Start and End Times */}
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <p className="text-[14px] text-[#022759] opacity-70 mb-1">
                  Início
                </p>
                <p className="text-[20px] text-[#022759]">
                  {startTime}
                </p>
              </div>
              <div>
                <p className="text-[14px] text-[#022759] opacity-70 mb-1">
                  Término
                </p>
                <p className="text-[20px] text-[#022759] opacity-70">
                  --:--
                </p>
              </div>
            </div>

            {/* Location Verification */}
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#ADFB49] mt-0.5 flex-shrink-0" />
              <p className="text-[14px] text-[#022759]">
                Local verificado: {patientAddress}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
