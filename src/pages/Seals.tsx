import React, { useState, useEffect, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, storage } from '../firebase';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, getDoc as getFirestoreDoc } from 'firebase/firestore'; // Importar getDoc como getFirestoreDoc
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FaEdit, FaTrash, FaBuilding, FaIdCard, FaMapMarkerAlt, FaCity, FaGlobe, FaUser, FaPlus, FaTimes, FaUpload } from 'react-icons/fa';

// Esquema de validación con Zod
const sealSchema = z.object({
  name: z.string().min(1, "El nombre del sello es requerido"),
  description: z.string().optional(),
  imageUrl: z.string().url("La URL de la imagen no es válida").optional().or(z.literal('')), // Permitir cadena vacía
  userAddress: z.string().optional(),
  userCity: z.string().optional(),
  userCountry: z.string().optional(),
  userTaxId: z.string().optional(),
  userName: z.string().optional(),
  userLastName: z.string().optional(),
});

type SealFormData = z.infer<typeof sealSchema>;

interface Seal {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  userAddress?: string;
  userCity?: string;
  userCountry?: string;
  userTaxId?: string;
  userName?: string;
  userLastName?: string;
}

interface UserProfile {
  companyName?: string;
  taxId?: string;
  address?: string;
  city?: string;
  country?: string;
  userName?: string;
  userLastName?: string;
}

const Seals: React.FC = () => {
  const [user] = useAuthState(auth);
  const [seals, setSeals] = useState<Seal[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSeal, setEditingSeal] = useState<Seal | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingSealId, setUploadingSealId] = useState<string | null>(null); // Nuevo estado para la carga de imagen por sello
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null); // Estado para el perfil del usuario
  const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar el modal

  const imageInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({}); // Referencias para los inputs de imagen de cada sello

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<SealFormData>({
    resolver: zodResolver(sealSchema),
  });

  useEffect(() => {
    const fetchSealsAndProfile = async () => {
      if (user) {
        setLoading(true);
        // Fetch de sellos
        const sealsCollectionRef = collection(db, 'users', user.uid, 'seals');
        const sealsData = await getDocs(sealsCollectionRef);
        setSeals(sealsData.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Seal[]);

        // Fetch de perfil de usuario
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getFirestoreDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserProfile(userDocSnap.data() as UserProfile);
        }
        setLoading(false);
      }
    };

    fetchSealsAndProfile();
  }, [user]);

  // Función para resetear el formulario y pre-rellenar con datos del perfil
  const resetFormWithProfileData = React.useCallback(() => {
    if (userProfile) {
      const defaultName = userProfile.companyName || "";
      reset({
        name: defaultName,
        description: '', // La descripción es opcional y no se pre-rellena con datos fiscales
        imageUrl: '',
        userAddress: userProfile.address || '',
        userCity: userProfile.city || '',
        userCountry: userProfile.country || '',
        userTaxId: userProfile.taxId || '',
        userName: userProfile.userName || '',
        userLastName: userProfile.userLastName || '',
      });
    } else {
      reset();
    }
    setEditingSeal(null);
    setSelectedFile(null);
  }, [userProfile, reset]);

  // Llamar a resetFormWithProfileData cuando el perfil del usuario esté disponible
  useEffect(() => {
    if (userProfile && !editingSeal) {
      resetFormWithProfileData();
    }
  }, [userProfile, editingSeal, resetFormWithProfileData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadImage = async (): Promise<string | undefined> => {
    if (!selectedFile || !user) return undefined;

    setUploading(true);
    try {
      const storageRef = ref(storage, `user_seals/${user.uid}/${selectedFile.name}`);
      const snapshot = await uploadBytes(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      toast.success("Imagen subida con éxito!");
      return downloadURL;
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Error al subir la imagen: ${error.message}`);
        console.error("Error uploading image:", error);
      } else {
        toast.error("Error desconocido al subir la imagen.");
        console.error("Unknown error uploading image:", error);
      }
      return undefined;
    } finally {
      setUploading(false);
      setSelectedFile(null); // Limpiar el archivo seleccionado
    }
  };

  const onSubmit = async (data: SealFormData) => {
    if (!user) {
      toast.error("Usuario no autenticado.");
      return;
    }

    let imageUrl = data.imageUrl;
    if (selectedFile) {
      imageUrl = await uploadImage();
      if (!imageUrl) return; // Si la subida falla, no continuar
    }

    try {
      if (editingSeal) {
        // Actualizar sello existente
        const sealDocRef = doc(db, 'users', user.uid, 'seals', editingSeal.id);
        await updateDoc(sealDocRef, { ...data, imageUrl });
        setSeals(seals.map(s => s.id === editingSeal.id ? { ...s, ...data, imageUrl } : s));
        toast.success("Sello actualizado con éxito!");
      } else {
        // Crear nuevo sello
        const sealsCollectionRef = collection(db, 'users', user.uid, 'seals');
        const docRef = await addDoc(sealsCollectionRef, { ...data, imageUrl });
        setSeals([...seals, { ...data, id: docRef.id, imageUrl }]);
        toast.success("Sello creado con éxito!");
      }
      resetFormWithProfileData(); // Resetear y pre-rellenar después de guardar
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Error al guardar el sello: ${error.message}`);
        console.error("Error saving seal:", error);
      } else {
        toast.error("Error desconocido al guardar el sello.");
        console.error("Unknown error saving seal:", error);
      }
    }
  };

  const onEdit = (seal: Seal) => {
    setEditingSeal(seal);
    setValue("name", seal.name);
    setValue("description", seal.description || '');
    setValue("imageUrl", seal.imageUrl || '');
    setValue("userAddress", seal.userAddress || '');
    setValue("userCity", seal.userCity || '');
    setValue("userCountry", seal.userCountry || '');
    setValue("userTaxId", seal.userTaxId || '');
    setValue("userName", seal.userName || '');
    setValue("userLastName", seal.userLastName || '');
    setShowModal(true); // Mostrar el modal al editar
  };

  const onDelete = async (seal: Seal) => {
    if (!user || !confirm("¿Estás seguro de que quieres eliminar este sello?")) return;

    try {
      // Eliminar imagen de Storage si existe
      if (seal.imageUrl && seal.imageUrl !== '') {
        try {
          const imageRef = ref(storage, seal.imageUrl);
          await deleteObject(imageRef);
          toast.info("Imagen de sello eliminada de Storage.");
        } catch (storageError: unknown) {
          if (
            typeof storageError === "object" &&
            storageError !== null &&
            "code" in storageError &&
            (storageError as { code?: unknown }).code === 'storage/object-not-found'
          ) {
            console.warn("La imagen asociada al sello no se encontró en Storage, continuando con la eliminación del documento.", storageError);
          } else {
            throw storageError; // Re-lanzar otros errores de Storage
          }
        }
      }

      // Eliminar documento de Firestore
      const sealDocRef = doc(db, 'users', user.uid, 'seals', seal.id);
      await deleteDoc(sealDocRef);
      setSeals(seals.filter(s => s.id !== seal.id));
      toast.success("Sello eliminado con éxito!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Error al eliminar el sello: ${error.message}`);
        console.error("Error deleting seal:", error);
      } else {
        toast.error("Error desconocido al eliminar el sello.");
        console.error("Unknown error deleting seal:", error);
      }
    }
  };

  const addSampleSeal = async () => {
    if (!user) {
      toast.error("Usuario no autenticado.");
      return;
    }

    try {
      const sealsCollectionRef = collection(db, 'users', user.uid, 'seals');
      const newSeal = {
        name: "Sello de Ejemplo",
        description: "Este es un sello de ejemplo para ayudarte a empezar. Puedes editarlo o eliminarlo.",
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/crm-facturas.firebasestorage.app/o/pictures%2Fcamion-moderno.png?alt=media&token=9396cd43-a15b-473b-a4a4-3e071513e6e7", // URL de una imagen de ejemplo
        userAddress: "Calle Falsa 123",
        userCity: "Springfield",
        userCountry: "España",
        userTaxId: "X00000000Y",
        userName: "Juan",
        userLastName: "Pérez",
      };
      const docRef = await addDoc(sealsCollectionRef, newSeal);
      setSeals(prevSeals => [...prevSeals, { ...newSeal, id: docRef.id }]);
      toast.success("Sello de ejemplo añadido con éxito!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Error al añadir el sello de ejemplo: ${error.message}`);
        console.error("Error adding sample seal:", error);
      } else {
        toast.error("Error desconocido al añadir el sello de ejemplo.");
        console.error("Unknown error adding sample seal:", error);
      }
    }
  };

  const handleImageUploadForSeal = async (sealId: string, file: File) => {
    if (!user) {
      toast.error("Usuario no autenticado.");
      return;
    }

    setUploadingSealId(sealId);
    try {
      const storageRef = ref(storage, `user_seals/${user.uid}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const sealDocRef = doc(db, 'users', user.uid, 'seals', sealId);
      await updateDoc(sealDocRef, { imageUrl: downloadURL });

      setSeals(prevSeals =>
        prevSeals.map(seal =>
          seal.id === sealId ? { ...seal, imageUrl: downloadURL } : seal
        )
      );
      toast.success("Imagen del sello actualizada con éxito!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Error al subir la imagen del sello: ${error.message}`);
        console.error("Error uploading image for seal:", error);
      } else {
        toast.error("Error desconocido al subir la imagen del sello.");
        console.error("Unknown error uploading image for seal:", error);
      }
    } finally {
      setUploadingSealId(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div></div>;
  }

  if (!user) {
    return <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md">Debes iniciar sesión para gestionar tus sellos.</div>;
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <ToastContainer position="bottom-right" aria-label={undefined} />
        <h1 className="text-3xl font-bold mb-6 text-center">Gestión de Sellos</h1>

        <div className="mb-4 flex justify-end">
          <button
            onClick={() => {
              resetFormWithProfileData(); // Resetear el formulario y editingSeal
              setShowModal(true); // Abrir el modal
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
          >
            <FaPlus className="mr-2" /> Crear Nuevo Sello
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Mis Sellos</h2>
            {seals.length === 0 ? (
              <div className="text-center p-4">
                <p className="text-gray-600 mb-4">No tienes sellos creados aún. ¿Quieres añadir un sello de ejemplo para empezar?</p>
                <button
                  onClick={addSampleSeal}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center mx-auto transition-colors duration-200"
                >
                  <FaPlus className="mr-2" /> Añadir Sello de Ejemplo
                </button>
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {seals.map((seal) => (
                  <div key={seal.id} className="border p-6 rounded-lg shadow-lg flex flex-col bg-gray-50 hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-2xl font-bold mb-3 text-blue-700 flex items-center">
                      <FaBuilding className="mr-2 text-blue-500" />{seal.name}
                    </h3>
                    {seal.imageUrl && (
                      <div className="mb-4 flex justify-center relative group">
                        <img src={seal.imageUrl} alt={seal.name} className="max-h-40 object-contain rounded-md border border-gray-200 p-1" />
                        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <input
                            type="file"
                            ref={el => { imageInputRefs.current[seal.id] = el; }}
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleImageUploadForSeal(seal.id, e.target.files[0]);
                              }
                            }}
                          />
                          {uploadingSealId === seal.id ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                          ) : (
                            <button
                              onClick={() => imageInputRefs.current[seal.id]?.click()}
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-full text-sm flex items-center shadow-lg"
                            >
                              <FaUpload className="mr-1" /> Subir
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                    {seal.description && <p className="text-gray-700 text-sm mb-3 italic">{seal.description}</p>}

                    <div className="mt-auto pt-4 border-t border-gray-200">
                      <p className="text-lg font-semibold mb-2 text-gray-800">Datos Fiscales:</p>
                      <ul className="space-y-1 text-gray-600 text-sm">
                        {seal.userName && <li className="flex items-center"><FaUser className="mr-2 text-gray-500" /><strong>Nombre:</strong> {seal.userName}</li>}
                        {seal.userLastName && <li className="flex items-center"><FaUser className="mr-2 text-gray-500" /><strong>Apellidos:</strong> {seal.userLastName}</li>}
                        {seal.userTaxId && <li className="flex items-center"><FaIdCard className="mr-2 text-gray-500" /><strong>NIF/CIF:</strong> {seal.userTaxId}</li>}
                        {seal.userAddress && <li className="flex items-center"><FaMapMarkerAlt className="mr-2 text-gray-500" /><strong>Dirección:</strong> {seal.userAddress}</li>}
                        {seal.userCity && <li className="flex items-center"><FaCity className="mr-2 text-gray-500" /><strong>Ciudad:</strong> {seal.userCity}</li>}
                        {seal.userCountry && <li className="flex items-center"><FaGlobe className="mr-2 text-gray-500" /><strong>País:</strong> {seal.userCountry}</li>}
                      </ul>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        onClick={() => onEdit(seal)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg text-sm flex items-center transition-colors duration-200"
                      >
                        <FaEdit className="mr-2" /> Editar
                      </button>
                      <button
                        onClick={() => onDelete(seal)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg text-sm flex items-center transition-colors duration-200"
                      >
                        <FaTrash className="mr-2" /> Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Modal para crear/editar sello */}
            {showModal && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg md:max-w-2xl w-full mx-2 md:mx-4">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">{editingSeal ? "Editar Sello" : "Crear Nuevo Sello"}</h2>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        resetFormWithProfileData();
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FaTimes className="text-2xl" />
                    </button>
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nombre del Sello (Nombre de la Empresa)</label>
                        <input
                          type="text"
                          id="name"
                          {...register("name")}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {errors.name && <p className="text-red-500 text-xs italic mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Descripción (Opcional)</label>
                        <textarea
                          id="description"
                          {...register("description")}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        ></textarea>
                        {errors.description && <p className="text-red-500 text-xs italic mt-1">{errors.description.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="imageUrl" className="block text-gray-700 text-sm font-bold mb-2">URL de Imagen (opcional)</label>
                      <input
                        type="text"
                        id="imageUrl"
                        {...register("imageUrl")}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      {errors.imageUrl && <p className="text-red-500 text-xs italic mt-1">{errors.imageUrl.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="userName" className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
                        <input
                          type="text"
                          id="userName"
                          {...register("userName")}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {errors.userName && <p className="text-red-500 text-xs italic mt-1">{errors.userName.message}</p>}
                      </div>
                      <div>
                        <label htmlFor="userLastName" className="block text-gray-700 text-sm font-bold mb-2">Apellidos</label>
                        <input
                          type="text"
                          id="userLastName"
                          {...register("userLastName")}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {errors.userLastName && <p className="text-red-500 text-xs italic mt-1">{errors.userLastName.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="userTaxId" className="block text-gray-700 text-sm font-bold mb-2">NIF/CIF</label>
                        <input
                          type="text"
                          id="userTaxId"
                          {...register("userTaxId")}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {errors.userTaxId && <p className="text-red-500 text-xs italic mt-1">{errors.userTaxId.message}</p>}
                      </div>
                      <div>
                        <label htmlFor="userAddress" className="block text-gray-700 text-sm font-bold mb-2">Dirección</label>
                        <input
                          type="text"
                          id="userAddress"
                          {...register("userAddress")}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {errors.userAddress && <p className="text-red-500 text-xs italic mt-1">{errors.userAddress.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="userCity" className="block text-gray-700 text-sm font-bold mb-2">Ciudad</label>
                        <input
                          type="text"
                          id="userCity"
                          {...register("userCity")}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {errors.userCity && <p className="text-red-500 text-xs italic mt-1">{errors.userCity.message}</p>}
                      </div>
                      <div>
                        <label htmlFor="userCountry" className="block text-gray-700 text-sm font-bold mb-2">País</label>
                        <input
                          type="text"
                          id="userCountry"
                          {...register("userCountry")}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {errors.userCountry && <p className="text-red-500 text-xs italic mt-1">{errors.userCountry.message}</p>}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="sealFile" className="block text-gray-700 text-sm font-bold mb-2">Subir Imagen de Sello</label>
                      <input
                        type="file"
                        id="sealFile"
                        className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                        onChange={handleFileChange}
                      />
                      {uploading && <p className="text-blue-500 text-sm mt-2">Subiendo imagen...</p>}
                    </div>

                    <div className="flex justify-end space-x-4">
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={uploading}
                      >
                        {editingSeal ? "Actualizar Sello" : "Crear Sello"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowModal(false);
                          resetFormWithProfileData();
                        }}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div> {/* Cierre del div bg-white p-6 rounded-lg shadow-md w-full */}
        </div> {/* Cierre del div flex flex-col md:flex-row gap-6 */}
      </div> {/* Cierre del div container mx-auto p-4 */}
    </>
  );
};

export default Seals;

