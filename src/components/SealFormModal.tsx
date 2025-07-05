import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { SealForm } from './SealForm';
import type { User } from 'firebase/auth';
import type { Seal, UserProfile, SealFormData } from '../types';

interface SealFormModalProps {
  showModal: boolean;
  onCancel: () => void;
  onSubmit: (data: SealFormData, imageUrl?: string) => Promise<void>;
  editingSeal: Seal | null;
  userProfile: UserProfile | null;
  user: User | null;
}

const SealFormModal: React.FC<SealFormModalProps> = (props) => {
  if (!props.showModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg md:max-w-2xl w-full mx-2 md:mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">{props.editingSeal ? "Editar Sello" : "Crear Nuevo Sello"}</h2>
          <button onClick={props.onCancel} className="text-gray-500 hover:text-gray-700">
            <FaTimes className="text-2xl" />
          </button>
        </div>
        <SealForm {...props} />
      </div>
    </div>
  );
};

export default SealFormModal;
