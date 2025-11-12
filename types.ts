export enum UserRole {
  CLIENT = 'client',
  PROVIDER = 'provider',
}

export enum Plan {
  GRATUITO = 'Gratuito',
  PROFISSIONAL = 'Profissional',
  PREMIUM = 'Premium',
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Added for login/registration simulation
  role: UserRole;
  plan?: Plan;
  companyName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  ownerId: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
  providerId: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  petId: string;
  providerId: string;
  serviceId: string;
  startTime: Date;
  endTime: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  rating?: number; // 1 to 5 stars
  review?: string;
}

export interface PlanDetails {
    name: Plan;
    price: number;
    features: string[];
    isPopular?: boolean;
}