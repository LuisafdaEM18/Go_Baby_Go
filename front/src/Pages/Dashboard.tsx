import React from 'react';
import Layout from '../Components/Layout';

const Dashboard: React.FC = () => {
  return (
    <Layout>
      <div className="flex-1 flex flex-col">
        <main className="flex- p-50 overflow-auto">
          {/* Contenido principal del dashboard */}
          <h1 className="text-4xl font-bold text-blue-900 mb-4">Bienvenido</h1>
          <p className="text-gray-700">
          </p>
        </main>
      </div>
    </Layout>
  );
};

export default Dashboard;
