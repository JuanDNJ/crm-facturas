import React from 'react';
import { FaEdit, FaTrash, FaBuilding, FaUser, FaEye } from 'react-icons/fa';
import type { Seal } from '../types';

interface SealCardProps {
  seal: Seal;
  onEdit: (seal: Seal) => void;
  onDelete: (seal: Seal) => void;
  onView: (seal: Seal) => void;
}

export const SealCard: React.FC<SealCardProps> = ({ seal, onEdit, onDelete, onView }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md flex flex-col bg-gray-50 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center space-x-4 mb-4"> {/* Contenedor superior para imagen y texto */}
        {seal.imageUrl && (
          <div className="flex-shrink-0">
            <img src={seal.imageUrl} alt={seal.name} className="w-16 h-16 object-contain rounded-md border border-gray-200 p-1" />
          </div>
        )}
        <div className="flex-grow">
          <h3 className="text-lg font-bold text-blue-700 flex items-center">
            <FaBuilding className="mr-2 text-blue-500" />{seal.name}
          </h3>
          {(seal.userName || seal.userLastName) && (
            <p className="text-gray-700 text-sm flex items-center">
              <FaUser className="mr-1 text-gray-500" />{seal.userName} {seal.userLastName}
            </p>
          )}
          {seal.description && <p className="text-gray-600 text-xs italic mt-1">{seal.description}</p>}
        </div>
      </div>
      <div className="mt-auto pt-4 flex justify-end space-x-2">
        <button
          onClick={() => onEdit(seal)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded-lg text-sm flex items-center justify-center transition-colors duration-200"
        >
          <FaEdit className="mr-1" /> Editar
        </button>
        <button
          onClick={() => onDelete(seal)}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded-lg text-sm flex items-center justify-center transition-colors duration-200"
        >
          <FaTrash className="mr-1" /> Eliminar
        </button>
        <button
          onClick={() => onView(seal)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded-lg text-sm flex items-center justify-center transition-colors duration-200"
        >
          <FaEye className="mr-1" /> Ver
        </button>
      </div>
    </div>
  );
};
