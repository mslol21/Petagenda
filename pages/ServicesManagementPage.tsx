
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { MOCK_SERVICES } from '../constants';
import { Service, Plan } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ServicesManagementPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!user) return null;

  const planLimits = { [Plan.GRATUITO]: 3, [Plan.PROFISSIONAL]: 10, [Plan.PREMIUM]: Infinity };
  const currentLimit = user.plan ? planLimits[user.plan] : 0;

  const [services, setServices] = useState<Service[]>(MOCK_SERVICES.filter(s => s.providerId === user.id));
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);

  const canAddMore = services.length < currentLimit;

  const handleOpenModal = (service: Service | null = null) => {
    if (!service && !canAddMore) {
      alert(`Seu plano ${user.plan} permite apenas ${currentLimit} serviços. Faça upgrade para adicionar mais.`);
      navigate('/pricing');
      return;
    }
    setEditingService(service || { providerId: user.id });
    setModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingService(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    if (editingService.id) {
      // Edit
      setServices(services.map(s => s.id === editingService!.id ? editingService as Service : s));
    } else {
      // Add
      setServices([...services, { ...editingService, id: `service${services.length + 2}` } as Service]);
    }
    handleCloseModal();
  };
  
  const handleDelete = (id: string) => {
    if(window.confirm("Tem certeza que deseja excluir este serviço?")) {
        setServices(services.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Serviços</h1>
          <p className="mt-1 text-gray-500">Adicione, edite ou remova os serviços que você oferece.</p>
        </div>
        <Button onClick={() => handleOpenModal()} leftIcon={<PlusCircle size={18}/>}>
          Novo Serviço
        </Button>
      </div>
      
      {!canAddMore && user.plan !== Plan.PREMIUM && (
        <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
          <p className="font-bold">Limite de serviços atingido!</p>
          <p>Seu plano {user.plan} permite até {currentLimit} serviços. <button onClick={() => navigate('/pricing')} className="underline font-semibold">Faça um upgrade</button> para adicionar mais.</p>
        </div>
      )}

      <Card>
        <ul className="divide-y divide-gray-200">
          {services.map(service => (
            <li key={service.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <p className="font-semibold text-lg">{service.name}</p>
                <div className="flex space-x-4 text-sm text-gray-500 mt-1">
                  <span>Duração: {service.duration} min</span>
                  <span>Preço: R$ {service.price.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex space-x-2 mt-3 sm:mt-0">
                <Button variant="ghost" size="sm" onClick={() => handleOpenModal(service)} leftIcon={<Edit size={16} />}>Editar</Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(service.id)} className="text-red-600 hover:bg-red-50" leftIcon={<Trash2 size={16} />}>Excluir</Button>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingService?.id ? 'Editar Serviço' : 'Novo Serviço'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Serviço</label>
            <input type="text" id="name" value={editingService?.name || ''} onChange={e => setEditingService({...editingService, name: e.target.value})} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duração (minutos)</label>
                <input type="number" id="duration" value={editingService?.duration || ''} onChange={e => setEditingService({...editingService, duration: Number(e.target.value)})} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Preço (R$)</label>
                <input type="number" step="0.01" id="price" value={editingService?.price || ''} onChange={e => setEditingService({...editingService, price: Number(e.target.value)})} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
              </div>
          </div>
          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="ghost" onClick={handleCloseModal}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ServicesManagementPage;