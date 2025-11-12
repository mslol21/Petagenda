import React, { useState } from 'react';
import { PawPrint } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.CLIENT);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(email, password, role);
    if (success) {
      navigate('/');
    } else {
      setError('Credenciais inválidas. Tente "ana@cliente.com" para cliente ou "joao@petshop.com" para prestador e senha "123".');
    }
  };

  return (
    <div className="min-h-screen bg-primary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center text-primary-700">
          <PawPrint className="mx-auto h-12 w-auto" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Acesse sua conta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Bem-vindo ao PetSoft Agenda
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Você é
              </label>
              <div className="mt-1 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole(UserRole.CLIENT)}
                  className={`w-full inline-flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${role === UserRole.CLIENT ? 'bg-primary text-white border-transparent' : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'}`}
                >
                  Cliente
                </button>
                <button
                  type="button"
                  onClick={() => setRole(UserRole.PROVIDER)}
                  className={`w-full inline-flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${role === UserRole.PROVIDER ? 'bg-primary text-white border-transparent' : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'}`}
                >
                  Prestador de Serviço
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === UserRole.CLIENT ? 'ana@cliente.com' : 'joao@petshop.com'}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>
            
             <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Use '123' para os usuários de teste"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div>
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Ou continue com
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <button
                  type="button"
                  onClick={() => alert('Login com Google não implementado nesta simulação.')}
                  className="w-full inline-flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <svg className="w-5 h-5 mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 488 512"><path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 76.2c-27.7-26.2-64.9-42.3-107.7-42.3-83.2 0-150.9 67.7-150.9 150.9s67.7 150.9 150.9 150.9c97.2 0 130.3-72.9 134.8-109.3H248v-95.2h239.2c4.4 23.3 6.8 48.1 6.8 73.8z"/></svg>
                  Google
                </button>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => alert('Login com Facebook não implementado nesta simulação.')}
                  className="w-full inline-flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <svg className="w-5 h-5 mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 320 512"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg>
                  Facebook
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button onClick={() => navigate('/register')} className="text-sm text-primary hover:underline">
              Não tem uma conta? Cadastre-se
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;