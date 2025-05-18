import React from 'react';
import Layout from '../Components/Layout';

interface DashboardCardProps {
  title: string;
  value: string | number;
  borderColor: string;
  textColor: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, borderColor, textColor }) => {
  return (
    <div className={`bg-white shadow-md rounded-2xl p-5 border-l-4 ${borderColor}`}>
      <h2 className="text-gray-500 text-sm font-semibold">{title}</h2>
      <p className={`text-3xl font-bold mt-2 ${textColor}`}>{value}</p>
    </div>
  );
};

const Dashboard: React.FC = () => {
  return (
    <Layout>
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-8 overflow-auto ">
          <h1 className="text-2xl font-bold text-blue-900 mb-8">Bienvenido</h1>

          {/* Tarjetas del dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard
              title="Formularios Recibidos"
              value={150}
              borderColor="border-blue-600"
              textColor="text-blue-800"
            />
            <DashboardCard
              title="Próximos Eventos"
              value={3}
              borderColor="border-green-600"
              textColor="text-green-800"
            />
            <DashboardCard
              title="Usuarios Activos"
              value={27}
              borderColor="border-purple-600"
              textColor="text-purple-800"
            />
           
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default Dashboard;
