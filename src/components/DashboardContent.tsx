import React from 'react';
import type { User } from 'firebase/auth';

interface DashboardContentProps {
  displayName: string | null;
  user: User | null | undefined;
  children?: React.ReactNode;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  children,
  displayName,
  user,
}) => {
  return (
    <section className="container mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold mb-4">
        Bienvenido, {displayName || user?.email || 'Usuario'}!
      </h1>
      <h2 className="text-xl font-semibold mb-4">
        Dashboard
      </h2>
      {children}
      {/* Aquí irá el listado de facturas */}
    </section>
  );
};
