import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import { BarChart, Calendar, Home, LogOut, Menu, PawPrint, Scissors, Settings, Users, X } from 'lucide-react';
import NotificationBell from './NotificationBell';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const commonLinks = [
    { to: user?.role === UserRole.CLIENT ? "/client/settings" : "/provider/settings", icon: Settings, text: "Configurações" }
  ];

  const clientLinks = [
    { to: "/client/dashboard", icon: Home, text: "Dashboard" },
    { to: "/client/book", icon: Calendar, text: "Novo Agendamento" },
  ];

  const providerLinks = [
    { to: "/provider/dashboard", icon: Home, text: "Dashboard" },
    { to: "/provider/analytics", icon: BarChart, text: "Análises" },
    { to: "/provider/services", icon: Scissors, text: "Serviços" },
  ];

  const links = user?.role === UserRole.CLIENT ? clientLinks : providerLinks;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center justify-between lg:justify-center">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <PawPrint size={28} /> PetSoft
        </h1>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white">
            <X size={24}/>
        </button>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {links.concat(commonLinks).map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-100 hover:bg-primary-600 hover:text-white'
              }`
            }
          >
            <link.icon className="mr-3 h-5 w-5" />
            {link.text}
          </NavLink>
        ))}
      </nav>
      <div className="p-2 border-t border-primary-700">
         <button
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-2 text-sm font-medium rounded-md text-primary-100 hover:bg-primary-600 hover:text-white"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sair
          </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-40 flex lg:hidden transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="w-64 bg-primary-800">
              <SidebarContent />
          </div>
          <div className="flex-shrink-0 w-14" onClick={() => setSidebarOpen(false)}></div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 bg-primary-800">
            <SidebarContent />
        </div>
      </div>

      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow-md lg:shadow-none lg:border-b">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              {/* Can add search here later */}
            </div>
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              <NotificationBell />
              <span className="text-gray-700">Olá, {user?.name}</span>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;