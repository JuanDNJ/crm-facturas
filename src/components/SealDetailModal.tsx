
import React from 'react';
import { FaTimes, FaBuilding, FaUser, FaIdCard, FaMapMarkerAlt, FaCity, FaGlobe } from 'react-icons/fa';
import { useSealDetailLogic } from '../hooks/useSealDetailLogic';

interface SealDetailModalProps {
  sealId: string | null;
  showModal: boolean;
  onClose: () => void;
}

export const SealDetailModal: React.FC<SealDetailModalProps> = ({ sealId, showModal, onClose }) => {
  const { sealData, loading, error } = useSealDetailLogic(sealId);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg md:max-w-2xl w-full mx-2 md:mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Detalles del Sello</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes className="text-2xl" />
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}

        {error && <p className="text-red-500 text-center">{error}</p>}

        {sealData && !loading && (
          <div className="space-y-4">
            {sealData.imageUrl && (
              <div className="flex justify-center mb-4">
                <img src={sealData.imageUrl} alt={sealData.name} className="max-h-48 object-contain rounded-md border border-gray-200 p-1" />
              </div>
            )}
            <p className="text-lg font-bold flex items-center"><FaBuilding className="mr-2 text-blue-500" />{sealData.name}</p>
            {sealData.description && <p className="text-gray-700 text-sm italic">{sealData.description}</p>}

            <div className="border-t border-gray-200 pt-4 mt-4">
              <p className="text-lg font-semibold mb-2 text-gray-800">Datos Fiscales:</p>
              <ul className="space-y-1 text-gray-600 text-sm">
                {sealData.userName && <li className="flex items-center"><FaUser className="mr-2 text-gray-500" /><strong>Nombre:</strong> {sealData.userName}</li>}
                {sealData.userLastName && <li className="flex items-center"><FaUser className="mr-2 text-gray-500" /><strong>Apellidos:</strong> {sealData.userLastName}</li>}
                {sealData.userTaxId && <li className="flex items-center"><FaIdCard className="mr-2 text-gray-500" /><strong>NIF/CIF:</strong> {sealData.userTaxId}</li>}
                {sealData.userAddress && <li className="flex items-center"><FaMapMarkerAlt className="mr-2 text-gray-500" /><strong>Dirección:</strong> {sealData.userAddress}</li>}
                {sealData.userCity && <li className="flex items-center"><FaCity className="mr-2 text-gray-500" /><strong>Ciudad:</strong> {sealData.userCity}</li>}
                {sealData.userCountry && <li className="flex items-center"><FaGlobe className="mr-2 text-gray-500" /><strong>País:</strong> {sealData.userCountry}</li>}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
