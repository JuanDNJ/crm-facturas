
import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { SealForm } from './SealForm';
import type { User } from 'firebase/auth';
import type { Seal, UserProfile, SealFormData } from '../types';

interface SealFormSidebarProps {
  onSubmit: (data: SealFormData, imageUrl?: string) => Promise<void>;
  onCancel: () => void;
  editingSeal: Seal | null;
  userProfile: UserProfile | null;
  user: User | null;
}

const SealFormSidebar: React.FC<SealFormSidebarProps> = (props) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">{props.editingSeal ? "Editar Sello" : "Crear Nuevo Sello"}</h2>
        <button onClick={props.onCancel} className="text-gray-500 hover:text-gray-700">
          <FaTimes className="text-2xl" />
        </button>
      </div>
      <SealForm {...props} />
    </div>
  );
};

export default SealFormSidebar;
