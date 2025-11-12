import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { MOCK_PETS, MOCK_SERVICES, TIME_SLOTS } from '../constants';
import Button from '../components/Button';
import Card from '../components/Card';
import { ArrowRight, Calendar, Check, Clock, Dog, Scissors } from 'lucide-react';
import Modal from '../components/Modal';
import { useNotifications } from '../hooks/useNotifications';

const BookingPage: React.FC = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const { addNotification } = useNotifications();

  if (!user) return null;

  const myPets = MOCK_PETS.filter(p => p.ownerId === user.id);

  const selectedService = MOCK_SERVICES.find(s => s.id === selectedServiceId);
  const selectedPet = MOCK_PETS.find(p => p.id === selectedPetId);

  const handleBooking = () => {
    // In a real app, this would save the appointment to the database.
    console.log({
      service: selectedService?.name,
      pet: selectedPet?.name,
      date: selectedDate?.toLocaleDateString('pt-BR'),
      time: selectedTime,
    });
    addNotification(`Novo agendamento para ${selectedPet?.name} confirmado!`);
    setConfirmationModalOpen(true);
  };
  
  const resetFlow = () => {
    setStep(1);
    setSelectedServiceId(null);
    setSelectedPetId(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setConfirmationModalOpen(false);
  }

  const steps = [
    { number: 1, title: 'Serviço', icon: <Scissors/> },
    { number: 2, title: 'Pet', icon: <Dog/> },
    { number: 3, title: 'Data e Hora', icon: <Calendar/> },
    { number: 4, title: 'Confirmação', icon: <Check/> },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Novo Agendamento</h1>
      
      <div className="mb-8">
        <ol className="flex items-center w-full">
          {steps.map((s, index) => (
            <React.Fragment key={s.number}>
              <li className={`flex items-center ${step >= s.number ? 'text-primary' : 'text-gray-500'}`}>
                <span className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${step >= s.number ? 'border-primary bg-primary-50' : 'border-gray-300'}`}>
                    {s.icon}
                </span>
                <span className="ml-2 font-medium hidden sm:inline">{s.title}</span>
              </li>
              {index < steps.length - 1 && <li className="flex-auto border-t-2 mx-4 border-gray-300"></li>}
            </React.Fragment>
          ))}
        </ol>
      </div>

      {step === 1 && (
        <Card title="1. Escolha o serviço">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_SERVICES.map(service => (
              <button
                key={service.id}
                onClick={() => { setSelectedServiceId(service.id); setStep(2); }}
                className={`p-4 border-2 rounded-lg text-left transition-all ${selectedServiceId === service.id ? 'border-primary ring-2 ring-primary' : 'border-gray-200 hover:border-primary-300'}`}
              >
                <h3 className="font-bold text-lg">{service.name}</h3>
                <p className="text-gray-600">{service.duration} min</p>
                <p className="text-primary font-semibold mt-2">R$ {service.price.toFixed(2)}</p>
              </button>
            ))}
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card title="2. Para qual pet?">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {myPets.map(pet => (
              <button
                key={pet.id}
                onClick={() => { setSelectedPetId(pet.id); setStep(3); }}
                className={`p-4 border-2 rounded-lg text-left transition-all ${selectedPetId === pet.id ? 'border-primary ring-2 ring-primary' : 'border-gray-200 hover:border-primary-300'}`}
              >
                <h3 className="font-bold text-lg">{pet.name}</h3>
                <p className="text-gray-600">{pet.breed}</p>
              </button>
            ))}
          </div>
          <Button variant="ghost" className="mt-4" onClick={() => setStep(1)}>Voltar</Button>
        </Card>
      )}

      {step === 3 && (
        <Card title="3. Escolha a data e hora">
           <div className="flex flex-col md:flex-row gap-8">
               <div className="flex-1">
                   <h4 className="font-semibold mb-2">Data</h4>
                   <input 
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value + 'T00:00:00'))}
                    className="p-2 border rounded-md w-full"
                   />
               </div>
               <div className="flex-1">
                   <h4 className="font-semibold mb-2">Horário disponível</h4>
                    {selectedDate ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {TIME_SLOTS.map(time => (
                                <button key={time} onClick={() => {setSelectedTime(time); setStep(4);}} 
                                className={`p-2 border rounded-md text-center transition-colors ${selectedTime === time ? 'bg-primary text-white' : 'hover:bg-primary-50'}`}>
                                    {time}
                                </button>
                            ))}
                        </div>
                    ) : <p className="text-gray-500">Selecione uma data para ver os horários.</p>}
               </div>
           </div>
          <Button variant="ghost" className="mt-4" onClick={() => setStep(2)}>Voltar</Button>
        </Card>
      )}
      
      {step === 4 && (
        <Card title="4. Confirme seu agendamento">
            <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-lg">{selectedService?.name}</p>
                    <p>para <span className="font-medium">{selectedPet?.name}</span></p>
                </div>
                 <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold flex items-center"><Calendar size={16} className="mr-2"/> Data e Hora</p>
                    <p>{selectedDate?.toLocaleDateString('pt-BR')} às {selectedTime}</p>
                </div>
                 <div className="p-4 bg-primary-50 rounded-lg text-primary-800">
                    <p className="font-semibold text-lg">Total a pagar</p>
                    <p className="text-2xl font-bold">R$ {selectedService?.price.toFixed(2)}</p>
                </div>
            </div>
            <div className="mt-6 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(3)}>Voltar</Button>
                <Button onClick={handleBooking} rightIcon={<ArrowRight/>}>Confirmar e Agendar</Button>
            </div>
        </Card>
      )}
      
       <Modal isOpen={isConfirmationModalOpen} onClose={resetFlow} title="Agendamento Confirmado!">
          <div>
            <p className="text-center text-green-500 mb-4">
                <Check size={48} className="mx-auto"/>
            </p>
            <p className="text-gray-600 mb-4 text-center">Seu agendamento foi realizado com sucesso. Um e-mail de confirmação (simulado) foi enviado.</p>
            <div className="p-4 bg-gray-100 rounded-md text-center">
                 <p className="font-bold">{selectedService?.name} para {selectedPet?.name}</p>
                 <p>{selectedDate?.toLocaleDateString('pt-BR')} às {selectedTime}</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={resetFlow}>Ok</Button>
          </div>
      </Modal>
    </div>
  );
};

export default BookingPage;