import React from 'react';
import { useDashboardLogic } from '../hooks/useDashboardLogic';
import { DashboardContent } from '../components/DashboardContent';

const Dashboard: React.FC = () => {
  const {
    user,
    loadingAuth,
    displayName,
    loadingProfile,
  } = useDashboardLogic();

  if (loadingAuth || loadingProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  };

  return (
    <DashboardContent
      displayName={displayName}
      user={user}
    >

      <p>Aquí irá el contenido del dashboard</p>
    </DashboardContent>
  );
};

export default Dashboard;