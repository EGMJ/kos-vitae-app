import { Home, Users, Map, Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import HomeScreen from './components/HomeScreen';
import PatientsScreen from './components/PatientsScreen';
import PatientDetailScreen from './components/PatientDetailScreen';
import TimeTrackingScreen from './components/TimeTrackingScreen';
import SettingsScreen from './components/SettingsScreen';
import TimesheetScreen from './components/TimesheetScreen';
import FinancialScreen from './components/FinancialScreen';
import RoutesScreen from './components/asdf';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [showTimeTracking, setShowTimeTracking] = useState(false);
  const [showTimesheet, setShowTimesheet] = useState(false);
  const [showFinancial, setShowFinancial] = useState(false);
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);

  const handlePatientClick = (patientName: string) => {
    setSelectedPatient(patientName);
    setShowTimeTracking(false);
  };

  const handleBackToPatients = () => {
    setSelectedPatient(null);
    setShowTimeTracking(false);
  };

  const handleStartTimeTracking = () => {
    setShowTimeTracking(true);
  };

  const handleBackFromTimeTracking = () => {
    setShowTimeTracking(false);
  };

  const handleTimesheetClick = () => {
    setShowTimesheet(true);
  };

  const handleBackFromTimesheet = () => {
    setShowTimesheet(false);
  };

  const handleFinancialClick = () => {
    setShowFinancial(true);
  };

  const handleBackFromFinancial = () => {
    setShowFinancial(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setActiveTab('home');
  };

  const handleSignup = () => {
    setIsAuthenticated(true);
    setShowSignup(false);
    setActiveTab('home');
  };

  const handleSignupClick = () => {
    setShowSignup(true);
  };

  const handleBackToLogin = () => {
    setShowSignup(false);
  };

  // Detecção de scroll para mostrar/esconder tab bar
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isAuthenticated) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollTop = container.scrollTop;
          const scrollDifference = Math.abs(currentScrollTop - lastScrollTop.current);
          
          // Só atualiza se houver uma diferença significativa (evita flickering)
          if (scrollDifference > 5) {
            // Detecta a direção do scroll
            if (currentScrollTop > lastScrollTop.current) {
              // Scroll para baixo - mostra o tab bar
              setIsTabBarVisible(true);
            } else if (currentScrollTop < lastScrollTop.current && currentScrollTop > 30) {
              // Scroll para cima - esconde o tab bar (apenas se não estiver no topo)
              setIsTabBarVisible(false);
            }
            
            lastScrollTop.current = currentScrollTop;
          }
          
          ticking = false;
        });
        
        ticking = true;
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [isAuthenticated]);

  // If not authenticated, show login or signup screens
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#E7ECF1] ">
        {/* Mobile Frame */}
        <div className="relative  bg-[#E7ECF1] overflow-hidden flex flex-col">
          {!showSignup ? (
            <LoginScreen onLogin={handleLogin} onSignupClick={handleSignupClick} />
          ) : (
            <SignupScreen onBack={handleBackToLogin} onSignup={handleSignup} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E7ECF1] ">
      {/* Mobile Frame */}
      <div className="relative  bg-[#E7ECF1] overflow-hidden flex flex-col">
        {/* Screen Content */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
          {activeTab === 'home' && !showFinancial && (
            <HomeScreen onFinancialClick={handleFinancialClick} />
          )}
          {activeTab === 'home' && showFinancial && (
            <FinancialScreen onBack={handleBackFromFinancial} />
          )}
          {activeTab === 'patients' && !selectedPatient && !showTimeTracking && (
            <PatientsScreen onPatientClick={handlePatientClick} />
          )}
          {activeTab === 'patients' && selectedPatient && !showTimeTracking && (
            <PatientDetailScreen 
              onBack={handleBackToPatients}
              patientName={selectedPatient}
              onStartTimeTracking={handleStartTimeTracking}
            />
          )}
          {activeTab === 'patients' && selectedPatient && showTimeTracking && (
            <TimeTrackingScreen 
              onBack={handleBackFromTimeTracking}
              patientName={selectedPatient}
              patientAddress="Rua das Flores, 123 - Centro"
            />
          )}
          {activeTab === 'routes' && <RoutesScreen />}
          {activeTab === 'settings' && !showTimesheet && (
            <SettingsScreen onTimesheetClick={handleTimesheetClick} />
          )}
          {activeTab === 'settings' && showTimesheet && (
            <TimesheetScreen onBack={handleBackFromTimesheet} />
          )}
        </div>

        {/* Tab Bar */}
        <div 
          className={`fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)] h-[84px] transition-transform duration-300 ease-in-out z-20 ${
            isTabBarVisible ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="flex items-center justify-around h-full px-4">
            {/* Home Tab */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('home');
                setShowFinancial(false);
              }}
              className="flex flex-col items-center gap-1 cursor-pointer"
            >
              <Home
                className={`w-6 h-6 ${
                  activeTab === 'home' ? 'text-[#ADFB49]' : 'text-[#022759] opacity-50'
                }`}
              />
              <span
                className={`text-[12px] ${
                  activeTab === 'home'
                    ? 'text-[#ADFB49]'
                    : 'text-[#022759] opacity-50'
                }`}
              >
                Início
              </span>
            </button>

            {/* Patients Tab */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('patients');
                setSelectedPatient(null);
              }}
              className="flex flex-col items-center gap-1 cursor-pointer"
            >
              <Users
                className={`w-6 h-6 ${
                  activeTab === 'patients' ? 'text-[#ADFB49]' : 'text-[#022759] opacity-50'
                }`}
              />
              <span
                className={`text-[12px] ${
                  activeTab === 'patients'
                    ? 'text-[#ADFB49]'
                    : 'text-[#022759] opacity-50'
                }`}
              >
                Pacientes
              </span>
            </button>

            {/* Routes Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('routes')}
              className="flex flex-col items-center gap-1 cursor-pointer"
            >
              <Map
                className={`w-6 h-6 ${
                  activeTab === 'routes' ? 'text-[#ADFB49]' : 'text-[#022759] opacity-50'
                }`}
              />
              <span
                className={`text-[12px] ${
                  activeTab === 'routes'
                    ? 'text-[#ADFB49]'
                    : 'text-[#022759] opacity-50'
                }`}
              >
                Rotas
              </span>
            </button>

            {/* Settings Tab */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('settings');
                setShowTimesheet(false);
              }}
              className="flex flex-col items-center gap-1 cursor-pointer"
            >
              <Settings
                className={`w-6 h-6 ${
                  activeTab === 'settings' ? 'text-[#ADFB49]' : 'text-[#022759] opacity-50'
                }`}
              />
              <span
                className={`text-[12px] ${
                  activeTab === 'settings'
                    ? 'text-[#ADFB49]'
                    : 'text-[#022759] opacity-50'
                }`}
              >
                Ajustes
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
