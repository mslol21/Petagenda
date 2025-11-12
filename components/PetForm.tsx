import React, { useState, useEffect } from 'react';
import { Pet } from '../types';
import Button from './Button';

interface PetFormProps {
  pet?: Pet | null;
  onSubmit: (petData: Omit<Pet, 'id' | 'ownerId'>) => void;
  onCancel: () => void;
}

const PetForm: React.FC<PetFormProps> = ({ pet, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState<number | ''>('');

  useEffect(() => {
    if (pet) {
      setName(pet.name);
      setBreed(pet.breed);
      setAge(pet.age);
    } else {
      setName('');
      setBreed('');
      setAge('');
    }
  }, [pet]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && breed && age !== '') {
      onSubmit({ name, breed, age: Number(age) });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Pet</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>
      <div>
        <label htmlFor="breed" className="block text-sm font-medium text-gray-700">Raça</label>
        <input
          type="text"
          id="breed"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>
      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700">Idade</label>
        <input
          type="number"
          id="age"
          value={age}
          onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
          required
          min="0"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>
      <div className="pt-4 flex justify-end space-x-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
};

export default PetForm;
