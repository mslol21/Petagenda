
import React, { useState } from 'react';
import { CheckCircle, PawPrint, Star } from 'lucide-react';
import { PLAN_DETAILS } from '../constants';
import { PlanDetails } from '../types';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';

const PricingPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanDetails | null>(null);
  const navigate = useNavigate();

  const handleSelectPlan = (plan: PlanDetails) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };
  
  const confirmSubscription = () => {
    setIsModalOpen(false);
    // In a real app, this would redirect to Stripe checkout.
    // Here, we'll just navigate to registration.
    alert(`Obrigado por escolher o plano ${selectedPlan?.name}! Continue para criar sua conta.`);
    navigate('/register');
  };

  return (
    <>
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-24 lg:px-8">
          <div className="text-center">
            <PawPrint className="mx-auto h-12 w-auto text-primary" />
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Planos para todos os tamanhos de negócio
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              Escolha o plano que melhor se adapta às suas necessidades e comece a otimizar seus agendamentos hoje mesmo.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {PLAN_DETAILS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg shadow-lg border-2 ${plan.isPopular ? 'border-primary' : 'border-gray-200'} flex flex-col`}
              >
                <div className="p-8 bg-white rounded-t-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-semibold text-gray-900">{plan.name}</h3>
                    {plan.isPopular && (
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-secondary text-gray-900">
                            <Star className="-ml-1 mr-1.5 h-4 w-4" />
                            Popular
                        </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-baseline text-gray-900">
                    <span className="text-5xl font-extrabold tracking-tight">R${plan.price}</span>
                    <span className="ml-1 text-xl font-semibold">/mês</span>
                  </div>
                </div>
                <div className="p-8 bg-gray-50 flex-grow">
                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <div className="flex-shrink-0">
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">{feature}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-8 bg-gray-100 rounded-b-lg">
                  <Button
                    onClick={() => handleSelectPlan(plan)}
                    className="w-full"
                    variant={plan.isPopular ? 'primary' : 'secondary'}
                  >
                    Assinar plano
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
             <button onClick={() => navigate('/login')} className="text-sm text-primary hover:underline">
              Já tem uma conta? Faça login.
            </button>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Confirmar Plano ${selectedPlan?.name}`}>
        <div>
          <p className="text-gray-600 mb-4">Você está prestes a assinar o plano <span className="font-bold">{selectedPlan?.name}</span> por <span className="font-bold">R${selectedPlan?.price}/mês</span>.</p>
          <p className="text-sm text-gray-500">Esta é uma simulação. Em um aplicativo real, você seria redirecionado para uma página de pagamento segura (Stripe).</p>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
          <Button onClick={confirmSubscription}>Confirmar Assinatura</Button>
        </div>
      </Modal>
    </>
  );
};

export default PricingPage;