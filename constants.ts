import { User, Pet, Service, Appointment, UserRole, Plan, PlanDetails } from './types';

export const MOCK_USERS: User[] = [
  { id: 'client1', name: 'Ana Silva', email: 'ana@cliente.com', password: '123', role: UserRole.CLIENT },
  { id: 'provider1', name: 'Dr. João Vet', email: 'joao@petshop.com', password: '123', role: UserRole.PROVIDER, plan: Plan.PROFISSIONAL, companyName: 'PetShop Cão Feliz' },
];

export const MOCK_PETS: Pet[] = [
  { id: 'pet1', name: 'Bolinha', breed: 'Poodle', age: 5, ownerId: 'client1' },
  { id: 'pet2', name: 'Rex', breed: 'Golden Retriever', age: 2, ownerId: 'client1' },
];

export const MOCK_SERVICES: Service[] = [
  { id: 'service1', name: 'Banho e Tosa', duration: 60, price: 80, providerId: 'provider1' },
  { id: 'service2', name: 'Consulta Veterinária', duration: 45, price: 150, providerId: 'provider1' },
  { id: 'service3', name: 'Vacinação V10', duration: 30, price: 120, providerId: 'provider1' },
  { id: 'service4', name: 'Corte de Unhas', duration: 15, price: 30, providerId: 'provider1' },
];

const today = new Date();
export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'appt1', clientId: 'client1', petId: 'pet1', providerId: 'provider1', serviceId: 'service1', startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 10, 0), endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 11, 0), status: 'scheduled' },
  { id: 'appt2', clientId: 'client1', petId: 'pet2', providerId: 'provider1', serviceId: 'service2', startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 14, 0), endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 14, 45), status: 'scheduled' },
  { id: 'appt3', clientId: 'client1', petId: 'pet1', providerId: 'provider1', serviceId: 'service3', startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10, 9, 0), endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10, 9, 30), status: 'completed', rating: 5, review: 'O atendimento foi excelente! Bolinha ficou muito calmo.' },
  { id: 'appt4', clientId: 'client1', petId: 'pet2', providerId: 'provider1', serviceId: 'service1', startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 20, 11, 0), endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 20, 12, 0), status: 'completed', rating: 4, review: 'Gostei do serviço, mas atrasou um pouco.' },
  { id: 'appt5', clientId: 'client1', petId: 'pet1', providerId: 'provider1', serviceId: 'service2', startTime: new Date(today.getFullYear(), today.getMonth() -1, 15, 15, 0), endTime: new Date(today.getFullYear(), today.getMonth() -1, 15, 15, 45), status: 'completed', rating: 5 },
  { id: 'appt6', clientId: 'client1', petId: 'pet2', providerId: 'provider1', serviceId: 'service2', startTime: new Date(today.getFullYear(), today.getMonth() -2, 5, 10, 0), endTime: new Date(today.getFullYear(), today.getMonth() -2, 5, 10, 45), status: 'completed', rating: 4 },
];


export const PLAN_DETAILS: PlanDetails[] = [
    {
        name: Plan.GRATUITO,
        price: 0,
        features: [
            'Até 20 agendamentos/mês',
            '1 funcionário',
            'Gestão de clientes',
            'Suporte comunitário'
        ]
    },
    {
        name: Plan.PROFISSIONAL,
        price: 39.90,
        features: [
            'Até 150 agendamentos/mês',
            'Até 5 funcionários',
            'Lembretes automáticos por e-mail',
            'Dashboard de Análises',
            'Suporte prioritário por e-mail'
        ],
        isPopular: true
    },
    {
        name: Plan.PREMIUM,
        price: 99.90,
        features: [
            'Agendamentos ilimitados',
            'Funcionários ilimitados',
            'Pagamento online (Stripe)',
            'Notificações por SMS (Em breve)',
            'Suporte dedicado 24/7'
        ]
    }
];

export const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
];