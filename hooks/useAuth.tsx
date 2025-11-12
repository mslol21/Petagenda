
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, UserRole, Plan } from '../types';
import { MOCK_USERS } from '../constants';

// This is the type for the data passed to the register function
export type RegisterDetails = Omit<User, 'id' | 'plan'>;


interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  register: (details: RegisterDetails) => { success: boolean, message: string };
  updatePlan: (plan: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS); // Manage users in state

  const login = (email: string, password: string, role: UserRole): boolean => {
    const foundUser = users.find(u => u.email === email && u.password === password && u.role === role);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };
  
  const register = (details: RegisterDetails): { success: boolean, message: string } => {
    if (users.find(u => u.email === details.email)) {
      return { success: false, message: 'Este e-mail já está cadastrado.' };
    }

    const newUser: User = {
      ...details,
      id: `user_${new Date().getTime()}`,
      plan: details.role === UserRole.PROVIDER ? Plan.GRATUITO : undefined,
    };
    
    setUsers(prevUsers => [...prevUsers, newUser]);
    setUser(newUser); // Automatically log in the new user
    
    return { success: true, message: 'Cadastro realizado com sucesso!' };
  };


  const updatePlan = (plan: any) => {
    if (user && user.role === UserRole.PROVIDER) {
      setUser({ ...user, plan });
      setUsers(currentUsers => currentUsers.map(u => u.id === user.id ? { ...u, plan } : u));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updatePlan }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};