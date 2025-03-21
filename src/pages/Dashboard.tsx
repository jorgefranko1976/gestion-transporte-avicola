
import React from 'react';
import { Navbar } from '@/components/Navbar';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Bienvenido a LogiFleet</h2>
            <p className="text-gray-600">
              Este es el sistema de gestión de la flota de transporte.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Accesos rápidos</h2>
            <ul className="space-y-2">
              <li><a href="/vehicles" className="text-blue-600 hover:underline">Gestionar vehículos</a></li>
              <li><a href="/drivers" className="text-blue-600 hover:underline">Gestionar conductores</a></li>
              <li><a href="/settings" className="text-blue-600 hover:underline">Configuración</a></li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Estado del sistema</h2>
            <p className="text-gray-600">
              Todos los servicios funcionan correctamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
