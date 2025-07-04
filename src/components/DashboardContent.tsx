import React from 'react';
import type { User } from 'firebase/auth';

interface DashboardContentProps {
  displayName: string | null;
  user: User | null | undefined;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  displayName,
  user,
}) => {
  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold mb-4">
        Bienvenido, {displayName || user?.email || 'Usuario'}!
      </h1>
      <h2 className="text-xl font-semibold mb-4">
        Dashboard
      </h2>
      {/* Aquí irá el listado de facturas */}
    </div>
  );
};
