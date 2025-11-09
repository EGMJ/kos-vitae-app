import { useState } from 'react';

interface LoginScreenProps {
  onLogin: () => void;
  onSignupClick: () => void;
}

export default function LoginScreen({ onLogin, onSignupClick }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Simular login - em produção, aqui seria a validação real
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* Safe Area Top */}

      {/* Header */}
      <div className="px-4 pt-[52px]">
        <h1 className="text-[24px] text-[#022759]">
          Bem-vindo(a) de volta
        </h1>
        <p className="text-[16px] text-[#022759] opacity-70 mt-2">
          Acesse sua conta para continuar.
        </p>
      </div>

      {/* Form */}
      <div className="px-4 mt-12">
        {/* Email Field */}
        <div className="mb-4">
          <label className="text-[14px] font-medium text-[#022759] block mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seuemail@dominio.com"
            className="w-full h-12 bg-white rounded-lg px-4 text-[16px] text-[#022759] placeholder:text-[#022759] placeholder:opacity-40 focus:outline-none focus:ring-2 focus:ring-[#ADFB49]"
          />
        </div>

        {/* Password Field */}
        <div className="mb-2">
          <label className="text-[14px] font-medium text-[#022759] block mb-2">
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
            className="w-full h-12 bg-white rounded-lg px-4 text-[16px] text-[#022759] placeholder:text-[#022759] placeholder:opacity-40 focus:outline-none focus:ring-2 focus:ring-[#ADFB49]"
          />
        </div>

        {/* Forgot Password Link */}
        <div className="text-right mb-4">
          <button 
            type="button"
            className="text-[14px] font-medium text-[#8FC0FF] hover:underline cursor-pointer"
          >
            Esqueceu a senha?
          </button>
        </div>

        {/* Login Button */}
        <button
          type="button"
          onClick={handleLogin}
          className="w-full h-12 bg-[#ADFB49] rounded-lg shadow-[0_4px_12px_rgba(173,251,73,0.4)] hover:bg-[#9DE83A] transition-colors cursor-pointer font-medium"
        >
          <span className="text-[16px] text-[#022759]">
            Entrar
          </span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-8">
          <div className="flex-1 h-px bg-[#022759] opacity-20" />
          <span className="text-[12px] text-[#022759] opacity-50">ou</span>
          <div className="flex-1 h-px bg-[#022759] opacity-20" />
        </div>

        {/* Social Login Buttons */}
        <button 
          type="button"
          className="w-full h-12 bg-white rounded-lg border border-[#E7ECF1] flex items-center justify-center gap-3 mb-3 hover:bg-[#E7ECF1] transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-[16px] font-medium text-[#022759]">
            Continuar com Google
          </span>
        </button>

        <button 
          type="button"
          className="w-full h-12 bg-white rounded-lg border border-[#E7ECF1] flex items-center justify-center gap-3 hover:bg-[#E7ECF1] transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#000000">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          <span className="text-[16px] font-medium text-[#022759]">
            Continuar com Apple
          </span>
        </button>
      </div>

      {/* Signup Link */}
      <div className="text-center mt-4 mb-8">
        <p className="text-[14px] text-[#022759] opacity-70">
          Não tem uma conta?{' '}
          <button
            type="button"
            onClick={onSignupClick}
            className="text-[#8FC0FF] hover:underline cursor-pointer font-medium"
          >
            Cadastre-se
          </button>
        </p>
      </div>
    </div>
  );
}
