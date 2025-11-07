import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';

interface SignupScreenProps {
  onBack: () => void;
  onSignup: () => void;
}

export default function SignupScreen({ onBack, onSignup }: SignupScreenProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    cpf: '',
    professionalId: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    phone: '',
    cpf: '',
  });

  // Função para aplicar máscara de telefone celular: (xx) 9xxxx-xxxx
  const applyPhoneMask = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos (apenas celular)
    const limitedNumbers = numbers.slice(0, 11);
    
    // Aplica a máscara apenas para celular
    if (limitedNumbers.length === 0) {
      return '';
    } else if (limitedNumbers.length <= 2) {
      return `(${limitedNumbers}`;
    } else if (limitedNumbers.length <= 7) {
      // Formato: (xx) xxxxx
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`;
    } else {
      // Formato completo: (xx) 9xxxx-xxxx
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 7)}-${limitedNumbers.slice(7)}`;
    }
  };

  // Função para aplicar máscara de CPF: xxx.xxx.xxx-xx
  const applyCpfMask = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    const limitedNumbers = numbers.slice(0, 11);
    
    // Aplica a máscara
    if (limitedNumbers.length <= 3) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 6) {
      return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3)}`;
    } else if (limitedNumbers.length <= 9) {
      return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3, 6)}.${limitedNumbers.slice(6)}`;
    } else {
      return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3, 6)}.${limitedNumbers.slice(6, 9)}-${limitedNumbers.slice(9)}`;
    }
  };

  // Validação de email
  const validateEmail = (email: string): string => {
    if (!email) return '';
    if (!email.includes('@')) {
      return 'Email deve conter @';
    }
    if (email.split('@').length !== 2 || !email.split('@')[1].includes('.')) {
      return 'Email inválido';
    }
    return '';
  };

  // Validação de telefone (apenas celular)
  const validatePhone = (phone: string): string => {
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length > 0 && numbers.length < 11) {
      return 'Celular deve ter 11 dígitos';
    }
    if (numbers.length === 11) {
      // Celular deve ter 9 como terceiro dígito (após DDD)
      if (numbers[2] !== '9') {
        return 'Celular deve começar com 9 após o DDD';
      }
    }
    return '';
  };

  // Validação de CPF
  const validateCpf = (cpf: string): string => {
    const numbers = cpf.replace(/\D/g, '');
    if (numbers.length > 0 && numbers.length < 11) {
      return 'CPF deve ter 11 dígitos';
    }
    return '';
  };

  const handlePhoneChange = (value: string) => {
    const masked = applyPhoneMask(value);
    setFormData({ ...formData, phone: masked });
    setErrors({ ...errors, phone: validatePhone(masked) });
  };

  const handleCpfChange = (value: string) => {
    const masked = applyCpfMask(value);
    setFormData({ ...formData, cpf: masked });
    setErrors({ ...errors, cpf: validateCpf(masked) });
  };

  const handleEmailChange = (value: string) => {
    setFormData({ ...formData, email: value });
    setErrors({ ...errors, email: validateEmail(value) });
  };

  const handleSubmit = () => {
    // Valida todos os campos
    const emailError = validateEmail(formData.email);
    const phoneError = validatePhone(formData.phone);
    const cpfError = validateCpf(formData.cpf);

    setErrors({
      email: emailError,
      phone: phoneError,
      cpf: cpfError,
    });

    // Verifica se todos os campos estão válidos
    if (
      formData.fullName &&
      formData.email &&
      !emailError &&
      formData.phone &&
      !phoneError &&
      formData.cpf &&
      !cpfError &&
      formData.professionalId &&
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword
    ) {
      onSignup();
    }
  };

  return (
    <>
      {/* Safe Area Top */}

      {/* Header with Back Button */}
      <div className="px-4 pt-4 pb-6 mb-6 flex items-center justify-center relative">
        <button
          type="button"
          onClick={onBack}
          className="absolute left-4 top-4 p-1 hover:opacity-70 transition-opacity cursor-pointer"
          aria-label="Voltar"
        >
          <ChevronLeft className="w-6 h-6 text-[#022759]" />
        </button>
        <h1 className="text-[18px] text-[#022759]">
          Criar Conta
        </h1>
      </div>

      {/* Scrollable Form */}
      <div className="px-4 pb-24 overflow-y-auto space-y-4 flex-1">
        {/* Full Name */}
        <div>
          <label className="text-[14px] font-medium text-[#022759] block mb-2">
            Nome Completo
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="Seu nome completo"
            className="w-full h-12 bg-white rounded-lg px-4 text-[16px] text-[#022759] placeholder:text-[#022759] placeholder:opacity-40 focus:outline-none focus:ring-2 focus:ring-[#ADFB49]"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-[14px] font-medium text-[#022759] block mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleEmailChange(e.target.value)}
            placeholder="seuemail@dominio.com"
            className={`w-full h-12 bg-white rounded-lg px-4 text-[16px] text-[#022759] placeholder:text-[#022759] placeholder:opacity-40 focus:outline-none focus:ring-2 ${
              errors.email ? 'focus:ring-red-500 border border-red-500' : 'focus:ring-[#ADFB49]'
            }`}
          />
          {errors.email && (
            <p className="text-[12px] text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="text-[14px] font-medium text-[#022759] block mb-2">
            Telefone (WhatsApp)
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="(11) 91234-5678"
            maxLength={15}
            className={`w-full h-12 bg-white rounded-lg px-4 text-[16px] text-[#022759] placeholder:text-[#022759] placeholder:opacity-40 focus:outline-none focus:ring-2 ${
              errors.phone ? 'focus:ring-red-500 border border-red-500' : 'focus:ring-[#ADFB49]'
            }`}
          />
          {errors.phone && (
            <p className="text-[12px] text-red-500 mt-1">{errors.phone}</p>
          )}
        </div>

        {/* CPF */}
        <div>
          <label className="text-[14px] font-medium text-[#022759] block mb-2">
            CPF
          </label>
          <input
            type="text"
            value={formData.cpf}
            onChange={(e) => handleCpfChange(e.target.value)}
            placeholder="000.000.000-00"
            maxLength={14}
            className={`w-full h-12 bg-white rounded-lg px-4 text-[16px] text-[#022759] placeholder:text-[#022759] placeholder:opacity-40 focus:outline-none focus:ring-2 ${
              errors.cpf ? 'focus:ring-red-500 border border-red-500' : 'focus:ring-[#ADFB49]'
            }`}
          />
          {errors.cpf && (
            <p className="text-[12px] text-red-500 mt-1">{errors.cpf}</p>
          )}
        </div>

        {/* Professional ID */}
        <div>
          <label className="text-[14px] font-medium text-[#022759] block mb-2">
            Registro Profissional (Ex: CREFITO)
          </label>
          <input
            type="text"
            value={formData.professionalId}
            onChange={(e) => setFormData({ ...formData, professionalId: e.target.value })}
            placeholder="CREFITO 123456"
            className="w-full h-12 bg-white rounded-lg px-4 text-[16px] text-[#022759] placeholder:text-[#022759] placeholder:opacity-40 focus:outline-none focus:ring-2 focus:ring-[#ADFB49]"
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-[14px] font-medium text-[#022759] block mb-2">
            Senha
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Sua senha"
            className="w-full h-12 bg-white rounded-lg px-4 text-[16px] text-[#022759] placeholder:text-[#022759] placeholder:opacity-40 focus:outline-none focus:ring-2 focus:ring-[#ADFB49]"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-[14px] font-medium text-[#022759] block mb-2">
            Confirmar Senha
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            placeholder="Confirme sua senha"
            className="w-full h-12 bg-white rounded-lg px-4 text-[16px] text-[#022759] placeholder:text-[#022759] placeholder:opacity-40 focus:outline-none focus:ring-2 focus:ring-[#ADFB49]"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full h-12 bg-[#ADFB49] rounded-lg shadow-[0_4px_12px_rgba(173,251,73,0.4)] hover:bg-[#9DE83A] transition-colors cursor-pointer font-medium"
          >
            <span className="text-[16px] text-[#022759]">
              Finalizar Cadastro
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
