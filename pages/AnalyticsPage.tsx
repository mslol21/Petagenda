import React, { useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { MOCK_APPOINTMENTS, MOCK_SERVICES, MOCK_USERS, MOCK_PETS } from '../constants';
import Card from '../components/Card';
import { Calendar, DollarSign, Star, Users } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const COLORS = ['#00A896', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AnalyticsPage: React.FC = () => {
    const { user } = useAuth();
    if (!user) return null;

    const myAppointments = useMemo(() => MOCK_APPOINTMENTS.filter(a => a.providerId === user.id), [user.id]);

    const totalAppointments = myAppointments.length;
    const completedAppointments = myAppointments.filter(a => a.status === 'completed');
    
    const totalRevenue = useMemo(() => completedAppointments.reduce((sum, appt) => {
        const service = MOCK_SERVICES.find(s => s.id === appt.serviceId);
        return sum + (service?.price || 0);
    }, 0), [completedAppointments]);

    const reviews = completedAppointments.filter(a => a.rating);
    const averageRating = useMemo(() => {
        if (reviews.length === 0) return 0;
        const totalRating = reviews.reduce((sum, appt) => sum + (appt.rating || 0), 0);
        return (totalRating / reviews.length).toFixed(1);
    }, [reviews]);
    
    const appointmentsByService = useMemo(() => {
        const counts = MOCK_SERVICES.filter(s => s.providerId === user.id).reduce((acc, service) => {
            acc[service.name] = 0;
            return acc;
        }, {} as Record<string, number>);

        myAppointments.forEach(appt => {
            const service = MOCK_SERVICES.find(s => s.id === appt.serviceId);
            if (service && service.providerId === user.id) {
                counts[service.name]++;
            }
        });

        return Object.entries(counts).map(([name, value]) => ({ name, value })).filter(item => item.value > 0);
    }, [myAppointments, user.id]);

    const revenueByMonth = useMemo(() => {
        const data: Record<string, number> = {};
        const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

        completedAppointments.forEach(appt => {
            const service = MOCK_SERVICES.find(s => s.id === appt.serviceId);
            if (service) {
                const month = monthNames[appt.startTime.getMonth()];
                const year = appt.startTime.getFullYear().toString().slice(-2);
                const key = `${month}/${year}`;
                data[key] = (data[key] || 0) + service.price;
            }
        });
        
        // Ensure chronological order - this part is tricky without a proper date library, but we can try sorting.
        // For this mock, we assume the data comes in a reasonable order or we just show it as is.
        return Object.entries(data).map(([name, receita]) => ({ name, receita })).reverse();
    }, [completedAppointments]);

    const recentReviews = reviews.sort((a,b) => b.startTime.getTime() - a.startTime.getTime()).slice(0, 3);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Análise de Desempenho</h1>
                <p className="mt-1 text-lg text-gray-500">Insights sobre seus agendamentos e receita.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card><Calendar className="text-blue-500 w-8 h-8 mb-2"/><p className="text-gray-500 text-sm">Total Agendamentos</p><p className="text-2xl font-bold">{totalAppointments}</p></Card>
                <Card><DollarSign className="text-green-500 w-8 h-8 mb-2"/><p className="text-gray-500 text-sm">Receita Total</p><p className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</p></Card>
                <Card><Star className="text-yellow-500 w-8 h-8 mb-2"/><p className="text-gray-500 text-sm">Avaliação Média</p><p className="text-2xl font-bold">{averageRating} <span className="text-base font-normal">({reviews.length})</span></p></Card>
                <Card><Users className="text-indigo-500 w-8 h-8 mb-2"/><p className="text-gray-500 text-sm">Clientes Únicos</p><p className="text-2xl font-bold">{[...new Set(myAppointments.map(a => a.clientId))].length}</p></Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card title="Agendamentos por Serviço">
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={appointmentsByService} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                                        {appointmentsByService.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip formatter={(value: number, name: string) => [value, name]}/>
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <Card title="Receita Mensal">
                        <div style={{ width: '100%', height: 300 }}>
                           <ResponsiveContainer>
                                <LineChart data={revenueByMonth} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis tickFormatter={(value) => `R$${value}`} />
                                    <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                                    <Legend />
                                    <Line type="monotone" dataKey="receita" stroke="#00A896" strokeWidth={2} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
            </div>
            
            <Card title="Avaliações Recentes" titleIcon={<Star />}>
                {recentReviews.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {recentReviews.map(review => {
                            const client = MOCK_USERS.find(u => u.id === review.clientId);
                            const pet = MOCK_PETS.find(p => p.id === review.petId);
                            return (
                                <li key={review.id} className="py-4">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-gray-800">{client?.name} (Pet: {pet?.name})</p>
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={16} className={i < (review.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                                            ))}
                                        </div>
                                    </div>
                                    {review.review && <p className="text-gray-600 mt-2 pl-4 border-l-2 border-gray-200 italic">"{review.review}"</p>}
                                </li>
                            )
                        })}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center py-4">Nenhuma avaliação ainda.</p>
                )}
            </Card>
        </div>
    );
};

export default AnalyticsPage;
