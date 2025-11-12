
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserRole, Plan } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import { PLAN_DETAILS } from '../constants';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const { user, updatePlan } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;
  
  const currentPlanDetails = PLAN_DETAILS.find(p => p.name === user.plan);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="mt-1 text-gray-500">Gerencie suas informações pessoais e de assinatura.</p>
      </div>

      <Card title="Informações do Perfil">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input type="text" defaultValue={user.name} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" defaultValue={user.email} disabled className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100" />
          </div>
          {user.role === UserRole.PROVIDER && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome da Empresa</label>
              <input type="text" defaultValue={user.companyName} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
          )}
          <div className="text-right">
            <Button>Salvar Alterações</Button>
          </div>
        </form>
      </Card>
      
      {user.role === UserRole.PROVIDER && user.plan && (
        <Card title="Seu Plano de Assinatura">
            <div className="p-6 bg-primary-50 rounded-lg">
                <h3 className="text-2xl font-bold text-primary-800">Plano {user.plan}</h3>
                {currentPlanDetails && (
                    <ul className="mt-4 space-y-2">
                        {currentPlanDetails.features.map(feature => (
                           <li key={feature} className="flex items-center text-gray-700">
                               <CheckCircle className="h-5 w-5 text-green-500 mr-2"/>
                               {feature}
                           </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="mt-6 text-center">
                <p className="text-gray-600">Deseja alterar seu plano?</p>
                <Button onClick={() => navigate('/pricing')} className="mt-2">Ver todos os planos</Button>
            </div>
        </Card>
      )}

      <Card title="Segurança">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Alterar Senha</label>
            <input type="password" placeholder="Nova senha" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
           <div>
            <input type="password" placeholder="Confirmar nova senha" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div className="text-right">
            <Button>Alterar Senha</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SettingsPage;
