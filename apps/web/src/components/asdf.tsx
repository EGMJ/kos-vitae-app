import { MapPin } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RouteStop {
  id: string;
  patientName: string;
  address: string;
  time: string;
  isNext: boolean;
}

const routeStops: RouteStop[] = [
  {
    id: '1',
    patientName: 'Maria da Silva',
    address: 'Rua das Flores, 123',
    time: '14:30',
    isNext: true,
  },
  {
    id: '2',
    patientName: 'João Santos',
    address: 'Av. Principal, 456',
    time: '15:30',
    isNext: false,
  },
];

export default function RoutesScreen() {
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(true);
  const lastScrollTop = useRef(0);

  // Detecção de scroll para mostrar/esconder bottom sheet
  // Detecta scroll no container principal do App.tsx
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Encontra o container scrollável principal (do App.tsx)
          const container = document.querySelector('.flex-1.overflow-y-auto') as HTMLElement;
          if (!container) return;
          
          const currentScrollTop = container.scrollTop;
          const scrollDifference = Math.abs(currentScrollTop - lastScrollTop.current);
          
          // Só atualiza se houver uma diferença significativa (evita flickering)
          if (scrollDifference > 10) {
            // Detecta a direção do scroll
            if (currentScrollTop > lastScrollTop.current) {
              // Scroll para baixo - mostra o bottom sheet
              setIsBottomSheetVisible(true);
            } else if (currentScrollTop < lastScrollTop.current && currentScrollTop > 50) {
              // Scroll para cima - esconde o bottom sheet (apenas se não estiver no topo)
              setIsBottomSheetVisible(false);
            }
            
            lastScrollTop.current = currentScrollTop;
          }
          
          ticking = false;
        });
        
        ticking = true;
      }
    };

    // Encontra o container scrollável do App.tsx
    const findContainer = () => {
      return document.querySelector('.flex-1.overflow-y-auto') as HTMLElement;
    };

    const container = findContainer();
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      lastScrollTop.current = container.scrollTop;
    }
    
    // Tenta novamente após um pequeno delay caso não tenha encontrado
    const timeoutId = setTimeout(() => {
      const delayedContainer = findContainer();
      if (delayedContainer && !container) {
        delayedContainer.addEventListener('scroll', handleScroll, { passive: true });
        lastScrollTop.current = delayedContainer.scrollTop;
      }
    }, 100);
    
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="relative h-full">
      {/* Map Background */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1693107493680-a05d590a8cd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwbWFwJTIwYWVyaWFsJTIwdmlld3xlbnwxfHx8fDE3NjE4ODg2ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Mapa da cidade"
          className="w-full h-full object-cover"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-[#022759] opacity-60" />
      </div>

      {/* Content Over Map */}
      <div className="relative h-full flex flex-col">
        {/* Safe Area Top */}

        {/* Header */}
        <div className="px-4 pt-4 pb-6">
          <h1 className="text-[24px] text-white">
            Sua Rota de Hoje
          </h1>
        </div>

        {/* Spacer to push bottom sheet down */}
        <div className="flex-1 min-h-[400px]" />

        {/* Spacer para o bottom sheet fixo */}
        <div className="h-[300px]" />
      </div>

      {/* Bottom Sheet Panel - Fixed na viewport */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-[20px] shadow-[0_-4px_16px_rgba(0,0,0,0.15)] pb-24 transition-transform duration-300 ease-in-out z-30 ${
          isBottomSheetVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Handle */}
        <div className="flex justify-center pt-4 pb-4">
          <div className="w-12 h-1 bg-[#E7ECF1] rounded-full" />
        </div>

        {/* Panel Content */}
        <div className="px-4">
          {/* Title */}
          <h2 className="text-[18px] text-[#022759] mb-2">
            Próximas Paradas (3)
          </h2>

          {/* Route Summary */}
          <p className="text-[14px] text-[#022759] opacity-70 mb-6">
            Total: <span className="font-medium">1h 45m</span> (<span className="font-medium">32 km</span>)
          </p>

          {/* Stops List */}
          <div className="space-y-2 mb-4">
            {routeStops.map((stop) => (
              <div
                key={stop.id}
                className="bg-[#E7ECF1] rounded-lg p-4 flex items-center"
              >
                <MapPin
                  className={`w-5 h-5 flex-shrink-0 ${
                    stop.isNext ? 'text-[#ADFB49]' : 'text-[#8FC0FF]'
                  }`}
                />
                <div className="ml-3 flex-1">
                  <p className="text-[16px] font-medium text-[#022759]">
                    {stop.patientName}
                  </p>
                  <p className="text-[14px] text-[#022759] opacity-70">
                    {stop.address} - <span className="font-medium">{stop.time}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Start Navigation Button */}
          <button 
            type="button"
            className="w-full bg-[#ADFB49] rounded-lg h-12 hover:bg-[#9DE83A] transition-colors cursor-pointer font-medium"
          >
            <span className="text-[16px] text-[#022759]">
              Iniciar Próxima Rota
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
