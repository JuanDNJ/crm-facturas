import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, storage } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import type { UserProfile } from '../types';

export const useProfileLogic = () => {
  const [user, loadingAuth, errorAuth] = useAuthState(auth);
  const [userName, setUserName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [iban, setIban] = useState('');
  const [defaultCurrency, setDefaultCurrency] = useState('EUR');
  const [defaultIVA, setDefaultIVA] = useState<number>(21);
  const [defaultIRPF, setDefaultIRPF] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const generateRandomIban = () => {
    const countryCode = "ES";
    const checkDigits = Math.floor(Math.random() * 99).toString().padStart(2, '0');
    const bban = Array.from({ length: 20 }, () => Math.floor(Math.random() * 10)).join('');
    return `${countryCode}${checkDigits}${bban}`;
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            setUserName(data.userName || '');
            setUserLastName(data.userLastName || '');
            setCompanyName(data.companyName || '');
            setTaxId(data.taxId || '');
            setAddress(data.address || '');
            setCity(data.city || '');
            setCountry(data.country || '');
            setPhotoURL(data.photoURL || null);
            setIban(data.iban || generateRandomIban());
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorProfile(`Error al subir la foto de perfil: ${err.message}`);
        console.error('Error detallado al subir foto:', err);
      } else if (typeof err === 'object' && err !== null && 'code' in err) {
        setErrorProfile(`Error al subir la foto de perfil: ${(err as { code?: string }).code || 'Error desconocido'}`);
        console.error('Error detallado al subir foto:', err);
      } else {
        setErrorProfile('Error al subir la foto de perfil: Error desconocido');
        console.error('Error detallado al subir foto:', err);
      }
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
        userName,
        userLastName,
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

  return {
    user,
    loadingAuth,
    errorAuth,
    userName,
    setUserName,
    userLastName,
    setUserLastName,
    companyName,
    setCompanyName,
    taxId,
    setTaxId,
    address,
    setAddress,
    city,
    setCity,
    country,
    setCountry,
    photoURL,
    setPhotoURL,
    iban,
    setIban,
    defaultCurrency,
    setDefaultCurrency,
    defaultIVA,
    setDefaultIVA,
    defaultIRPF,
    setDefaultIRPF,
    selectedFile,
    setSelectedFile,
    loadingProfile,
    setLoadingProfile,
    errorProfile,
    setErrorProfile,
    successMessage,
    setSuccessMessage,
    uploadingPhoto,
    setUploadingPhoto,
    handleFileChange,
    handleUploadPhoto,
    handleUpdateProfile,
  };
};
