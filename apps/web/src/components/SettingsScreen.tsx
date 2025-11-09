import { ChevronRight, Clock, User, Bell, Lock, HelpCircle, LogOut } from 'lucide-react';

interface SettingsScreenProps {
  onTimesheetClick: () => void;
}

interface SettingsItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

export default function SettingsScreen({ onTimesheetClick }: SettingsScreenProps) {
  const settingsItems: SettingsItem[] = [
    { 
      id: '1', 
      icon: <Clock className="w-5 h-5 text-[#8FC0FF]" />, 
      label: 'Consolidado de Ponto',
      onClick: onTimesheetClick
    },
    { 
      id: '2', 
      icon: <User className="w-5 h-5 text-[#8FC0FF]" />, 
      label: 'Dados Pessoais' 
    },
    { 
      id: '3', 
      icon: <Bell className="w-5 h-5 text-[#8FC0FF]" />, 
      label: 'Notificações' 
    },
    { 
      id: '4', 
      icon: <Lock className="w-5 h-5 text-[#8FC0FF]" />, 
      label: 'Privacidade e Segurança' 
    },
    { 
      id: '5', 
      icon: <HelpCircle className="w-5 h-5 text-[#8FC0FF]" />, 
      label: 'Ajuda e Suporte' 
    },
  ];

  return (
    <>
      {/* Safe Area Top */}

      {/* Header */}
      <div className="px-4 pt-4 pb-6">
        <h1 className="text-[24px] text-[#022759]">Ajustes</h1>
      </div>

      {/* Profile Section */}
      <div className="px-4 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center">
          <div className="w-16 h-16 rounded-full bg-[#8FC0FF] flex items-center justify-center flex-shrink-0">
            <span className="text-[#022759] text-xl font-medium">
              FS
            </span>
          </div>
          <div className="ml-4 flex-1">
            <p className="text-[18px] text-[#022759] mb-1">
              Dr. Felipe Silva
            </p>
            <p className="text-[14px] text-[#022759] opacity-70">
              Fisioterapeuta • CREFITO 12345-F
            </p>
          </div>
        </div>
      </div>

      {/* Settings List */}
      <div className="px-4 space-y-3 pb-24">
        {settingsItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={item.onClick}
            className="w-full bg-white rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-shadow cursor-pointer"
          >
            <div className="flex-shrink-0">
              {item.icon}
            </div>
            <span className="ml-3 text-[16px] text-[#022759] flex-1 text-left">
              {item.label}
            </span>
            <ChevronRight className="w-5 h-5 text-[#8FC0FF] flex-shrink-0" />
          </button>
        ))}

        {/* Logout Button */}
        <button 
          type="button"
          className="w-full bg-white rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-shadow mt-6 cursor-pointer"
        >
          <LogOut className="w-5 h-5 text-[#022759] opacity-50" />
          <span className="ml-3 text-[16px] text-[#022759] opacity-50 flex-1 text-left">
            Sair
          </span>
        </button>
      </div>
    </>
  );
}
