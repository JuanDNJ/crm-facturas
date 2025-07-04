
import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, storage } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Profile: React.FC = () => {
  const [user, loadingAuth, errorAuth] = useAuthState(auth);
  const [displayName, setDisplayName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [iban, setIban] = useState('');
  const [defaultCurrency, setDefaultCurrency] = useState('EUR'); // Valor por defecto
  const [defaultIVA, setDefaultIVA] = useState<number>(21); // Valor por defecto
  const [defaultIRPF, setDefaultIRPF] = useState<number>(0); // Valor por defecto
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setDisplayName(data.displayName || '');
            setLastName(data.lastName || '');
            setCompanyName(data.companyName || '');
            setTaxId(data.taxId || '');
            setAddress(data.address || '');
            setCity(data.city || '');
            setCountry(data.country || '');
            setPhotoURL(data.photoURL || null);
            setIban(data.iban || generateRandomIban()); // Generar IBAN aleatorio si no existe
            setDefaultCurrency(data.defaultCurrency || 'EUR');
            setDefaultIVA(data.defaultIVA || 21);
            setDefaultIRPF(data.defaultIRPF || 0);
          }
        } catch (err) {
          setErrorProfile('Error al cargar el perfil.');
          console.error('Error fetching user profile:', err);
        } finally {
          setLoadingProfile(false);
        }
      } else if (!loadingAuth) {
        setLoadingProfile(false);
      }
    };

    const generateRandomIban = () => {
      // Genera un IBAN aleatorio simplificado para pruebas (no es un IBAN real válido)
      const countryCode = "ES";
      const checkDigits = Math.floor(Math.random() * 99).toString().padStart(2, '0');
      const bban = Array.from({ length: 20 }, () => Math.floor(Math.random() * 10)).join('');
      return `${countryCode}${checkDigits}${bban}`;
    };

    fetchUserProfile();
  }, [user, loadingAuth]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      console.log('Archivo seleccionado para subir:', e.target.files[0].name);
    }
  };

  const handleUploadPhoto = async () => {
    if (!user) {
      setErrorProfile('No hay usuario autenticado para subir la foto.');
      console.error('Error: No user authenticated for photo upload.');
      return;
    }
    if (!selectedFile) {
      setErrorProfile('Por favor, selecciona un archivo para subir.');
      console.error('Error: No file selected for upload.');
      return;
    }

    setUploadingPhoto(true);
    setErrorProfile(null);
    setSuccessMessage(null);

    console.log('Iniciando subida de foto para UID:', user.uid, 'Archivo:', selectedFile.name);

    try {
      const storageRef = ref(storage, `profile_pictures/${user.uid}/${selectedFile.name}`);
      console.log('Referencia de Storage creada:', storageRef.fullPath);
      const snapshot = await uploadBytes(storageRef, selectedFile);
      console.log('Archivo subido, snapshot:', snapshot);
      const downloadURL = await getDownloadURL(snapshot.ref);

      setPhotoURL(downloadURL);
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, { photoURL: downloadURL }, { merge: true });
      setSuccessMessage('Foto de perfil actualizada con éxito!');
      console.log('Foto subida y URL guardada en Firestore:', downloadURL);
    } catch (err: any) {
      setErrorProfile(`Error al subir la foto de perfil: ${err.message || err.code || 'Error desconocido'}`);
      console.error('Error detallado al subir foto:', err);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoadingProfile(true);
    setErrorProfile(null);
    setSuccessMessage(null);

    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, {
        displayName,
        lastName,
        companyName,
        taxId,
        address,
        city,
        country,
        photoURL,
        iban,
        defaultCurrency,
        defaultIVA,
        defaultIRPF,
      }, { merge: true });
      setSuccessMessage('Perfil actualizado con éxito!');
    } catch (err) {
      setErrorProfile('Error al actualizar el perfil.');
      console.error('Error updating user profile:', err);
    } finally {
      setLoadingProfile(false);
    }
  };

  if (loadingAuth || loadingProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (errorAuth) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
        Error de autenticación: {errorAuth.message}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md">
        No hay usuario autenticado.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Mi Perfil
      </h1>
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
        <p className="text-gray-700 mb-2">{user.email}</p>
      </div>

      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div>
          <label htmlFor="displayName" className="block text-gray-700 text-sm font-bold mb-2">
            Nombre de Usuario
          </label>
          <input
            type="text"
            id="displayName"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">
            Apellidos
          </label>
          <input
            type="text"
            id="lastName"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="companyName" className="block text-gray-700 text-sm font-bold mb-2">
            Nombre de la Empresa
          </label>
          <input
            type="text"
            id="companyName"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="taxId" className="block text-gray-700 text-sm font-bold mb-2">
            NIF/CIF
          </label>
          <input
            type="text"
            id="taxId"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={taxId}
            onChange={(e) => setTaxId(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">
            Dirección
          </label>
          <input
            type="text"
            id="address"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">
            Ciudad
          </label>
          <input
            type="text"
            id="city"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="country" className="block text-gray-700 text-sm font-bold mb-2">
            País
          </label>
          <input
            type="text"
            id="country"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="iban" className="block text-gray-700 text-sm font-bold mb-2">
            IBAN
          </label>
          <input
            type="text"
            id="iban"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={iban}
            onChange={(e) => setIban(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="defaultCurrency" className="block text-gray-700 text-sm font-bold mb-2">
            Moneda por Defecto
          </label>
          <input
            type="text"
            id="defaultCurrency"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={defaultCurrency}
            onChange={(e) => setDefaultCurrency(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="defaultIVA" className="block text-gray-700 text-sm font-bold mb-2">
            IVA por Defecto (%)
          </label>
          <input
            type="number"
            id="defaultIVA"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={defaultIVA}
            onChange={(e) => setDefaultIVA(parseFloat(e.target.value))}
          />
        </div>

        <div>
          <label htmlFor="defaultIRPF" className="block text-gray-700 text-sm font-bold mb-2">
            IRPF por Defecto (%)
          </label>
          <input
            type="number"
            id="defaultIRPF"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={defaultIRPF}
            onChange={(e) => setDefaultIRPF(parseFloat(e.target.value))}
          />
        </div>

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

        {errorProfile && <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md mt-4">{errorProfile}</div>}
        {successMessage && <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-md mt-4">{successMessage}</div>}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-6"
          disabled={loadingProfile}
        >
          {loadingProfile ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Actualizando...
            </div>
          ) : (
            'Actualizar Perfil'
          )}
        </button>
      </form>
    </div>
  );
};

export default Profile;

