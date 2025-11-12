import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { MOCK_APPOINTMENTS, MOCK_PETS, MOCK_SERVICES, MOCK_USERS } from '../constants';
import Card from '../components/Card';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Dog, PlusCircle, Star, Tag } from 'lucide-react';
import { Appointment, Pet } from '../types';
import Modal from '../components/Modal';
import PetForm from '../components/PetForm';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onSubmit: (id: string, rating: number, review: string) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, appointment, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    
    if (!appointment) return null;
    
    const handleSubmit = () => {
        onSubmit(appointment.id, rating, review);
        onClose();
        setRating(0);
        setReview('');
    }
    
    const service = MOCK_SERVICES.find(s => s.id === appointment.serviceId);
    const provider = MOCK_USERS.find(u => u.id === appointment.providerId);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Avaliar: ${service?.name}`}>
            <div className="space-y-4">
                <p className="text-sm text-gray-500">Prestador: {provider?.companyName}</p>
                <div>
                    <p className="font-medium mb-2">Sua nota:</p>
                    <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, index) => {
                            const starValue = index + 1;
                            return (
                                <button key={starValue} onClick={() => setRating(starValue)}>
                                    <Star size={32} className={`cursor-pointer transition-colors ${starValue <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-200'}`} />
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div>
                    <label htmlFor="review" className="block text-sm font-medium text-gray-700">Comentário (opcional)</label>
                    <textarea 
                        id="review" 
                        rows={4} 
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Conte-nos sobre sua experiência..."
                    />
                </div>
            </div>
             <div className="mt-6 flex justify-end space-x-2">
                <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSubmit} disabled={rating === 0}>Enviar Avaliação</Button>
            </div>
        </Modal>
    )
}

const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewingAppointment, setReviewingAppointment] = useState<Appointment | null>(null);
  
  // Pet Management State
  const [myPets, setMyPets] = useState(() => MOCK_PETS.filter(p => p.ownerId === user?.id));
  const [isPetModalOpen, setPetModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  if (!user) return null;

  const myAppointments = appointments.filter(a => a.clientId === user.id);
  
  const upcomingAppointments = myAppointments
    .filter(a => a.startTime > new Date() && a.status === 'scheduled')
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    
  const pastAppointments = myAppointments
    .filter(a => a.startTime <= new Date())
    .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
    
  const getAppointmentDetails = (appt: typeof myAppointments[0]) => {
      const pet = myPets.find(p => p.id === appt.petId);
      const service = MOCK_SERVICES.find(s => s.id === appt.serviceId);
      const provider = MOCK_USERS.find(u => u.id === appt.providerId);
      return { pet, service, provider };
  }
  
  const handleOpenReviewModal = (appt: Appointment) => {
    setReviewingAppointment(appt);
    setReviewModalOpen(true);
  }

  const handleReviewSubmit = (id: string, rating: number, review: string) => {
    // This is a simulation. In a real app, you would send this to a backend.
    setAppointments(currentAppointments =>
      currentAppointments.map(a =>
        a.id === id ? { ...a, rating, review } : a
      )
    );
    alert('Obrigado pela sua avaliação!');
  };

  // Pet Management Handlers
  const handleAddNewPet = () => {
    setEditingPet(null);
    setPetModalOpen(true);
  };

  const handleEditPet = (pet: Pet) => {
    setEditingPet(pet);
    setPetModalOpen(true);
  };
  
  const handleClosePetModal = () => {
    setPetModalOpen(false);
    setEditingPet(null);
  };

  const handlePetSubmit = (petData: Omit<Pet, 'id' | 'ownerId'>) => {
    if (editingPet) { // Editing existing pet
      setMyPets(myPets.map(p => p.id === editingPet.id ? { ...p, ...petData } : p));
    } else { // Adding new pet
      const newPet: Pet = {
        ...petData,
        id: `pet_${new Date().getTime()}`,
        ownerId: user.id,
      };
      setMyPets([...myPets, newPet]);
    }
    handleClosePetModal();
  };


  return (
    <>
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Seu Dashboard, {user.name}!</h1>
        <p className="mt-1 text-lg text-gray-500">Tudo sobre seus pets e agendamentos em um só lugar.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary-500 text-white">
          <h3 className="text-xl font-bold">{upcomingAppointments.length}</h3>
          <p>Agendamentos Futuros</p>
        </Card>
        <Card className="bg-secondary-500 text-gray-900">
           <h3 className="text-xl font-bold">{myPets.length}</h3>
           <p>Pets Cadastrados</p>
        </Card>
        <Card>
           <h3 className="text-xl font-bold">{pastAppointments.length}</h3>
           <p>Agendamentos Passados</p>
        </Card>
      </div>

      <Card title="Próximos Agendamentos" titleIcon={<Calendar/>}>
        {upcomingAppointments.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {upcomingAppointments.map(appt => {
              const { pet, service, provider } = getAppointmentDetails(appt);
              return (
                <li key={appt.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1 space-y-1">
                    <p className="text-lg font-semibold text-primary">{service?.name} para {pet?.name}</p>
                     <p className="text-sm text-gray-600">com <span className="font-medium">{provider?.companyName}</span></p>
                    <p className="text-sm text-gray-500 flex items-center"><Clock size={14} className="mr-2"/>{appt.startTime.toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="mt-2 sm:mt-0">Ver Detalhes</Button>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Você não tem agendamentos futuros.</p>
            <Button onClick={() => navigate('/client/book')} className="mt-4" leftIcon={<PlusCircle size={18}/>}>
              Agendar Serviço
            </Button>
          </div>
        )}
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Seus Pets" titleIcon={<Dog/>}>
            {myPets.length > 0 ? (
              <>
                <div className="mb-4 text-right">
                  <Button onClick={handleAddNewPet} size="sm" leftIcon={<PlusCircle size={16}/>}>
                    Adicionar Outro Pet
                  </Button>
                </div>
                <ul className="space-y-4">
                    {myPets.map(pet => (
                        <li key={pet.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <div>
                                <p className="font-bold">{pet.name}</p>
                                <p className="text-sm text-gray-600">{pet.breed}, {pet.age} anos</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => handleEditPet(pet)}>Editar</Button>
                        </li>
                    ))}
                </ul>
              </>
            ) : (
              <div className="text-center py-8">
                <Dog size={48} className="mx-auto text-gray-300" />
                <p className="mt-4 text-lg font-medium text-gray-700">Nenhum pet cadastrado.</p>
                <p className="mt-1 text-sm text-gray-500">Clique no botão abaixo para adicionar seu primeiro pet.</p>
                <Button onClick={handleAddNewPet} className="mt-6" leftIcon={<PlusCircle size={18}/>}>
                  Cadastrar Pet
                </Button>
              </div>
            )}
        </Card>

        <Card title="Histórico de Agendamentos" titleIcon={<Tag/>}>
            {pastAppointments.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                    {pastAppointments.slice(0, 5).map(appt => {
                         const { pet, service } = getAppointmentDetails(appt);
                         return (
                            <li key={appt.id} className="py-3 flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{service?.name} - {pet?.name}</p>
                                    <p className="text-sm text-gray-500">{appt.startTime.toLocaleDateString('pt-BR')}</p>
                                </div>
                                <div className="text-right">
                                  {appt.status === 'completed' && !appt.rating && (
                                    <Button variant="secondary" size="sm" onClick={() => handleOpenReviewModal(appt)}>Avaliar</Button>
                                  )}
                                  {appt.status === 'completed' && appt.rating && (
                                    <div className="flex items-center">
                                      {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} className={i < appt.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'} />
                                      ))}
                                    </div>
                                  )}
                                  {appt.status === 'cancelled' && <span className="text-xs text-red-600">Cancelado</span>}
                                </div>
                            </li>
                         )
                    })}
                </ul>
            ) : <p className="text-gray-500">Nenhum histórico encontrado.</p>}
        </Card>
      </div>
    </div>
    <ReviewModal
      isOpen={isReviewModalOpen}
      onClose={() => setReviewModalOpen(false)}
      appointment={reviewingAppointment}
      onSubmit={handleReviewSubmit}
    />
     <Modal
      isOpen={isPetModalOpen}
      onClose={handleClosePetModal}
      title={editingPet ? 'Editar Pet' : 'Adicionar Novo Pet'}
    >
        <PetForm
            pet={editingPet}
            onSubmit={handlePetSubmit}
            onCancel={handleClosePetModal}
        />
    </Modal>
    </>
  );
};

export default ClientDashboard;