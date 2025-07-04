import React from 'react';
import { FaUpload } from 'react-icons/fa';

interface ProfilePhotoUploaderProps {
  photoURL: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUploadPhoto: () => Promise<void>;
  selectedFile: File | null;
  uploadingPhoto: boolean;
}

export const ProfilePhotoUploader: React.FC<ProfilePhotoUploaderProps> = ({
  photoURL,
  handleFileChange,
  handleUploadPhoto,
  selectedFile,
  uploadingPhoto,
}) => {
  return (
    <div className="mb-6 text-center">
      {photoURL && (
        <img src={photoURL} alt="Foto de Perfil" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
      )}
      {!photoURL && (
        <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center text-gray-500">
          No Photo
        </div>
      )}
      <h2 className="text-xl font-semibold">Email:</h2>
      {/* El email se mostrará en el componente padre, ya que viene del user de Firebase */}

      <div className="mb-4">
        <label htmlFor="profilePhoto" className="block text-gray-700 text-sm font-bold mb-2">
          Subir Foto de Perfil
        </label>
        <input
          type="file"
          id="profilePhoto"
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={handleUploadPhoto}
          className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={!selectedFile || uploadingPhoto}
        >
          {uploadingPhoto ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Subiendo...
            </div>
          ) : (
            'Subir Foto'
          )}
        </button>
      </div>
    </div>
  );
};
