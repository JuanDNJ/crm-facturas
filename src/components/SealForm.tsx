
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import type { User } from 'firebase/auth';
import type { Seal, UserProfile, SealFormData } from '../types';

// Esquema de validación con Zod (movido aquí para estar junto al formulario)
const sealSchema = z.object({
  name: z.string().min(1, "El nombre del sello es requerido"),
  description: z.string().optional().or(z.literal('')), // Ahora opcional y permite cadena vacía
  userAddress: z.string().optional().or(z.literal('')), // Hacer opcional
  userCity: z.string().optional().or(z.literal('')),    // Hacer opcional
  userCountry: z.string().optional().or(z.literal('')), // Hacer opcional
  userTaxId: z.string().optional().or(z.literal('')),   // Hacer opcional
  userName: z.string().optional().or(z.literal('')),    // Hacer opcional
  userLastName: z.string().optional().or(z.literal('')), // Hacer opcional
  imageUrl: z.string().optional().or(z.literal('')), // Ahora opcional y permite cadena vacía
});

interface SealFormProps {
  onSubmit: (data: SealFormData, imageUrl?: string) => Promise<void>;
  onCancel: () => void;
  editingSeal: Seal | null;
  userProfile: UserProfile | null;
  user: User | null;
}

export const SealForm: React.FC<SealFormProps> = ({ onSubmit, onCancel, editingSeal, userProfile, user }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<SealFormData>({
    resolver: zodResolver(sealSchema),
    mode: "onChange", // Validar en cada cambio para deshabilitar el botón
  });

  useEffect(() => {
    if (editingSeal) {
      setValue("name", editingSeal.name);
      setValue("description", editingSeal.description || undefined);
      setValue("imageUrl", editingSeal.imageUrl || undefined);
      setValue("userAddress", editingSeal.userAddress || '');
      setValue("userCity", editingSeal.userCity || '');
      setValue("userCountry", editingSeal.userCountry || '');
      setValue("userTaxId", editingSeal.userTaxId || '');
      setValue("userName", editingSeal.userName || '');
      setValue("userLastName", editingSeal.userLastName || '');
    } else if (userProfile) {
      console.log("SealForm: userProfile recibido para pre-rellenar:", userProfile);
      // Pre-rellenar con datos del perfil al crear uno nuevo
      setValue("name", userProfile.companyName || '');
      setValue("userAddress", userProfile.address || '');
      setValue("userCity", userProfile.city || '');
      setValue("userCountry", userProfile.country || '');
      setValue("userTaxId", userProfile.taxId || '');
      setValue("userName", userProfile.userName || '');
      setValue("userLastName", userProfile.userLastName || '');
      console.log("SealForm: Valores de userName y userLastName establecidos:", userProfile.userName, userProfile.userLastName);
    } else {
      console.log("SealForm: userProfile no disponible o editingSeal.");
      reset();
    }
  }, [editingSeal, userProfile, setValue, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadImage = async (): Promise<string | undefined> => {
    if (!selectedFile || !user) return undefined;

    setUploading(true);
    try {
      const storageRef = ref(storage, `user_seals/${user.uid}/${Date.now()}_${selectedFile.name}`);
      const snapshot = await uploadBytes(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      toast.success("Imagen subida con éxito!");
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error al subir la imagen.");
      return undefined;
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };

  const handleFormSubmit = async (data: SealFormData) => {
    let imageUrl: string | undefined = editingSeal?.imageUrl;
    if (selectedFile) {
      imageUrl = await uploadImage();
      if (!imageUrl) return; // Detener si la subida falla
    } else if (editingSeal && editingSeal.imageUrl) {
      imageUrl = editingSeal.imageUrl; // Mantener la URL existente si no se sube una nueva
    } else {
      imageUrl = undefined; // Si no hay archivo y no hay URL existente, establecer como undefined
    }
    await onSubmit(data, imageUrl);
    reset();
  };

  const handleValidationErrors = () => {
    console.log("Errores de validación detectados."); // Añadido para depuración
    toast.error("Por favor, revisa los campos marcados en rojo.");
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit, handleValidationErrors)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nombre del Sello (Empresa)</label>
          <input {...register("name")} className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Descripción</label>
          <textarea {...register("description")} className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"></textarea>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="userName" className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
          <input {...register("userName")} className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
        </div>
        <div>
          <label htmlFor="userLastName" className="block text-gray-700 text-sm font-bold mb-2">Apellidos</label>
          <input {...register("userLastName")} className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="userTaxId" className="block text-gray-700 text-sm font-bold mb-2">NIF/CIF</label>
          <input {...register("userTaxId")} className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
        </div>
        <div>
          <label htmlFor="userAddress" className="block text-gray-700 text-sm font-bold mb-2">Dirección</label>
          <input {...register("userAddress")} className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="userCity" className="block text-gray-700 text-sm font-bold mb-2">Ciudad</label>
          <input {...register("userCity")} className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
        </div>
        <div>
          <label htmlFor="userCountry" className="block text-gray-700 text-sm font-bold mb-2">País</label>
          <input {...register("userCountry")} className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
          {errors.userCountry && <p className="text-red-500 text-xs mt-1">{errors.userCountry.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="sealFile" className="block text-gray-700 text-sm font-bold mb-2">Subir Imagen de Sello</label>
        <input type="file" onChange={handleFileChange} className="file-input-style" />
        {uploading && <p className="text-blue-500 text-sm mt-2">Subiendo imagen...</p>}
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" >
          {editingSeal ? "Actualizar" : "Crear"}
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition-all duration-200">
          Cancelar
        </button>
      </div>
    </form>
  );
};
