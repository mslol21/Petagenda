import React, { useState } from 'react';
import { PawPrint } from 'lucide-react';
import { useAuth, RegisterDetails } from '../hooks/useAuth';
import { UserRole } from '../types';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const RegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterDetails & { passwordConfirm: string }>({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    role: UserRole.CLIENT,
    companyName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role: UserRole) => {
    setFormData(prev => ({ ...prev, role, companyName: role === UserRole.CLIENT ? '' : prev.companyName }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.password || formData.password.length < 3) {
      setError('A senha deve ter pelo menos 3 caracteres.');
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      setError('As senhas não coincidem.');
      return;
    }
    if (formData.role === UserRole.PROVIDER && !formData.companyName) {
        setError('O nome da empresa é obrigatório para prestadores de serviço.');
        return;
    }

    const { passwordConfirm, ...registerDetails } = formData;

    const result = register(registerDetails);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-primary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center text-primary-700">
          <PawPrint className="mx-auto h-12 w-auto" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Crie sua conta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Junte-se ao PetSoft Agenda
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            
            {/* Role Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Você é</label>
              <div className="mt-1 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleChange(UserRole.CLIENT)}
                  className={`w-full inline-flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${formData.role === UserRole.CLIENT ? 'bg-primary text-white border-transparent' : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'}`}
                >
                  Cliente
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange(UserRole.PROVIDER)}
                  className={`w-full inline-flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${formData.role === UserRole.PROVIDER ? 'bg-primary text-white border-transparent' : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'}`}
                >
                  Prestador de Serviço
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
              <input id="name" name="name" type="text" required value={formData.name} onChange={handleInputChange} className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>
            
            {formData.role === UserRole.PROVIDER && (
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Nome da Empresa</label>
                <input id="companyName" name="companyName" type="text" required={formData.role === UserRole.PROVIDER} value={formData.companyName} onChange={handleInputChange} className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
              </div>
            )}

            {formData.role === UserRole.CLIENT && (
              <>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Endereço Completo</label>
                  <input id="address" name="address" type="text" value={formData.address} onChange={handleInputChange} placeholder="Rua, Número, Bairro" className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">Cidade</label>
                        <input id="city" name="city" type="text" value={formData.city} onChange={handleInputChange} className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">Estado</label>
                        <input id="state" name="state" type="text" value={formData.state} onChange={handleInputChange} maxLength={2} placeholder="UF" className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                    </div>
                </div>
                <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">CEP</label>
                    <input id="zipCode" name="zipCode" type="text" value={formData.zipCode} onChange={handleInputChange} placeholder="00000-000" className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange} className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
              <input id="password" name="password" type="password" required value={formData.password} onChange={handleInputChange} className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>
            
             <div>
              <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
              <input id="passwordConfirm" name="passwordConfirm" type="password" required value={formData.passwordConfirm} onChange={handleInputChange} className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>


            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

            <div className="pt-2">
              <Button type="submit" className="w-full">
                Cadastrar
              </Button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <button onClick={() => navigate('/login')} className="text-sm text-primary hover:underline">
              Já tem uma conta? Faça login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;