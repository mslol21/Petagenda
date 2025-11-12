import React, { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { MOCK_APPOINTMENTS, MOCK_PETS, MOCK_SERVICES, MOCK_USERS } from '../constants';
import Card from '../components/Card';
import { Calendar, Clock, DollarSign, Star, User } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProviderDashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());

  if (!user) return null;

  const myAppointments = MOCK_APPOINTMENTS.filter(a => a.providerId === user.id);

  const getAppointmentDetails = (appt: typeof myAppointments[0]) => {
      const client = MOCK_USERS.find(u => u.id === appt.clientId);
      const pet = MOCK_PETS.find(p => p.id === appt.petId);
      const service = MOCK_SERVICES.find(s => s.id === appt.serviceId);
      return { client, pet, service };
  }

  const appointmentsToday = myAppointments.filter(
    a => a.startTime.toDateString() === selectedDate.toDateString()
  ).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  
  const totalRevenue = useMemo(() => myAppointments
    .filter(a => a.status === 'completed')
    .reduce((sum, appt) => {
        const service = MOCK_SERVICES.find(s => s.id === appt.serviceId);
        return sum + (service?.price || 0);
    }, 0), [myAppointments]);
    
  const reviews = useMemo(() => myAppointments.filter(a => a.status === 'completed' && a.rating), [myAppointments]);
  const averageRating = useMemo(() => {
      if (reviews.length === 0) return 'N/A';
      const totalRating = reviews.reduce((sum, appt) => sum + (appt.rating || 0), 0);
      return (totalRating / reviews.length).toFixed(1);
  }, [reviews]);


  const chartData = useMemo(() => {
    const data: {[key: string]: number} = {};
    myAppointments
        .filter(a => a.status === 'completed')
        .forEach(appt => {
            const service = MOCK_SERVICES.find(s => s.id === appt.serviceId);
            if(service) {
                data[service.name] = (data[service.name] || 0) + 1;
            }
        });
    return Object.entries(data).map(([name, count]) => ({ name, 'serviços': count }));
  }, [myAppointments]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard de {user.companyName}</h1>
        <p className="mt-1 text-lg text-gray-500">Gerencie seus agendamentos e veja o desempenho do seu negócio.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
            <DollarSign className="text-green-500 w-8 h-8 mb-2"/>
            <p className="text-gray-500 text-sm">Faturamento Total</p>
            <p className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</p>
        </Card>
        <Card>
            <Calendar className="text-blue-500 w-8 h-8 mb-2"/>
            <p className="text-gray-500 text-sm">Agendamentos Hoje</p>
            <p className="text-2xl font-bold">{appointmentsToday.length}</p>
        </Card>
        <Card>
            <User className="text-indigo-500 w-8 h-8 mb-2"/>
            <p className="text-gray-500 text-sm">Total de Clientes</p>
            <p className="text-2xl font-bold">{[...new Set(myAppointments.map(a => a.clientId))].length}</p>
        </Card>
         <Card>
            <Star className="text-yellow-500 w-8 h-8 mb-2"/>
            <p className="text-gray-500 text-sm">Avaliação Média</p>
            <p className="text-2xl font-bold">{averageRating} <span className="text-base font-normal">({reviews.length})</span></p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card title="Agendamentos do Dia" titleIcon={<Clock />}>
                <div className="mb-4">
                    <input type="date"
                        value={selectedDate.toISOString().split('T')[0]}
                        onChange={e => setSelectedDate(new Date(e.target.value + 'T00:00:00'))}
                        className="p-2 border rounded-md"
                    />
                </div>
                {appointmentsToday.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {appointmentsToday.map(appt => {
                            const { client, pet, service } = getAppointmentDetails(appt);
                            return (
                                <li key={appt.id} className="py-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-lg font-semibold text-primary">{appt.startTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                                        <p className="font-medium">{service?.name} - {pet?.name}</p>
                                        <p className="text-sm text-gray-500">Cliente: {client?.name}</p>
                                    </div>
                                    <span className="text-lg font-bold">R$ {service?.price.toFixed(2)}</span>
                                </li>
                            )
                        })}
                    </ul>
                ) : (
                    <p className="text-center py-8 text-gray-500">Nenhum agendamento para {selectedDate.toLocaleDateString('pt-BR')}.</p>
                )}
            </Card>
        </div>
        <div>
            <Card title="Serviços Mais Populares">
                <div style={{ width: '100%', height: 400 }}>
                  <ResponsiveContainer>
                    <BarChart data={chartData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value: number) => [value, "Nº de serviços"]}/>
                      <Legend formatter={() => "Nº de serviços"} />
                      <Bar dataKey="serviços" fill="#00A896" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;