import { ChevronLeft, FileText } from 'lucide-react';

interface FinancialScreenProps {
  onBack: () => void;
}

interface FuturePayment {
  id: string;
  month: string;
  reference: string;
  value: string;
}

const futurePayments: FuturePayment[] = [
  { id: '1', month: 'Dezembro/25', reference: 'Ref. Setembro/25', value: 'R$ 4.150,00' },
  { id: '2', month: 'Janeiro/26', reference: 'Ref. Outubro/25', value: 'R$ 4.320,50' },
  { id: '3', month: 'Fevereiro/26', reference: 'Ref. Novembro/25', value: 'R$ 0,00' },
];

export default function FinancialScreen({ onBack }: FinancialScreenProps) {
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
          Acompanhamento Financeiro
        </h1>
      </div>

      {/* Scrollable Content */}
      <div className="px-4 pb-24 overflow-y-auto flex-1 space-y-4">
        {/* Current Month Accumulation Card */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <p className="text-[16px] text-[#022759] mb-2">
            Acumulado (Outubro 2025)
          </p>
          <p className="text-[36px] text-[#022759] mb-2">
            R$ 4.320,50
          </p>
          <p className="text-[14px] text-[#022759] opacity-70">
            Recebimento previsto em Janeiro/26
          </p>
        </div>

        {/* Next Payment Card - Highlighted */}
        <div className="bg-[#ADFB49] rounded-2xl p-4 shadow-[0_4px_12px_rgba(173,251,73,0.4)]">
          <p className="text-[16px] text-[#022759] mb-2">
            Próximo Pagamento (05 Nov)
          </p>
          <p className="text-[36px] text-[#022759] mb-2">
            R$ 3.800,00
          </p>
          <p className="text-[14px] text-[#022759] opacity-80 font-medium">
            Referente a Agosto/25
          </p>
        </div>

        {/* Future Payments Section */}
        <div className="pt-2">
          <h2 className="text-[16px] text-[#022759] mb-4">
            Próximos Recebimentos
          </h2>

          {/* Future Payments List */}
          <div className="space-y-3">
            {futurePayments.map((payment) => (
              <div
                key={payment.id}
                className="bg-white rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="text-[16px] text-[#022759] mb-1">
                    {payment.month}
                  </p>
                  <p className="text-[14px] text-[#022759] opacity-70">
                    {payment.reference}
                  </p>
                </div>
                <p className="text-[16px] font-medium text-[#022759]">
                  {payment.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Full Statement Button */}
        <button 
          type="button"
          className="w-full bg-white rounded-lg h-12 shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center px-4 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-shadow mt-6 cursor-pointer"
        >
          <FileText className="w-5 h-5 text-[#022759]" />
          <span className="ml-3 text-[14px] text-[#022759]">
            Ver extrato completo
          </span>
        </button>
      </div>
    </>
  );
}
