/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, storage } from '../firebase';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, getDoc as getFirestoreDoc, query, orderBy, limit, startAfter } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { toast } from 'react-toastify';

import type { Seal, UserProfile, SealFormData } from '../types';

  export const useSealsLogic = () => {
  const SEALS_PER_PAGE = 10; // Define cuántos sellos cargar por página

  const [user, loadingAuth] = useAuthState(auth);
  const [seals, setSeals] = useState<Seal[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false); // Nuevo estado para la carga de más sellos
  const [lastVisible, setLastVisible] = useState<import('firebase/firestore').QueryDocumentSnapshot | null>(null); // Último documento visible para paginación
  const [hasMore, setHasMore] = useState(true); // Indica si hay más sellos para cargar
  const [editingSeal, setEditingSeal] = useState<Seal | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false); // Renombrado de showModal
  const [selectedSealIdForView, setSelectedSealIdForView] = useState<string | null>(null);
  const [showSealDetailModal, setShowSealDetailModal] = useState(false);

  const fetchSeals = useCallback(async (initialLoad: boolean = true) => {
    if (!user) return;

    setLoading(initialLoad); // Solo mostrar loading spinner completo en la carga inicial
    setLoadingMore(!initialLoad); // Mostrar loading spinner de "más" en cargas subsiguientes

    try {
      const sealsCollectionRef = collection(db, 'users', user.uid, 'seals');
      let q;

      if (initialLoad) {
        q = query(sealsCollectionRef, orderBy("name"), limit(SEALS_PER_PAGE));
      } else {
        if (!lastVisible) {
          setHasMore(false);
          return;
        }
        q = query(sealsCollectionRef, orderBy("name"), startAfter(lastVisible), limit(SEALS_PER_PAGE));
      }

      const documentSnapshots = await getDocs(q);
      const newSeals = documentSnapshots.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Seal[];

      setSeals(prevSeals => initialLoad ? newSeals : [...prevSeals, ...newSeals]);
      setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
      setHasMore(newSeals.length === SEALS_PER_PAGE);

      // Fetch de perfil de usuario (solo en la carga inicial)
      if (initialLoad) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getFirestoreDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          const profile: UserProfile = {
            ...data,
            userName: data.userName || data.displayName, // Priorizar userName, fallback a displayName
            userLastName: data.userLastName || data.lastName, // Priorizar userLastName, fallback a lastName
          };
          setUserProfile(profile);
        }
      }

    } catch (error) {
      console.error("Error fetching seals or profile:", error);
      toast.error("Error al cargar los datos.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [user, lastVisible]); // Dependencias actualizadas

  useEffect(() => {
    if (user) {
      fetchSeals(true); // Carga inicial de sellos y perfil
    }
  }, [user]);

  const loadMoreSeals = useCallback(() => {
    if (hasMore && !loadingMore) {
      fetchSeals(false); // Cargar más sellos
    }
  }, [hasMore, loadingMore, fetchSeals]);

  const handleFormSubmit = async (data: SealFormData, imageUrlToSave?: string) => {
    if (!user) {
      toast.error("Usuario no autenticado.");
      return;
    }

    const sealData = { ...data, imageUrl: imageUrlToSave ?? editingSeal?.imageUrl ?? '' };

    try {
      if (editingSeal) {
        const sealDocRef = doc(db, 'users', user.uid, 'seals', editingSeal.id);
        await updateDoc(sealDocRef, sealData);
        // Actualizar el sello en el estado local
        setSeals(seals.map(s => s.id === editingSeal.id ? { ...s, ...sealData } : s));
        toast.success("Sello actualizado con éxito!");
      } else {
        const sealsCollectionRef = collection(db, 'users', user.uid, 'seals');
        const docRef = await addDoc(sealsCollectionRef, sealData);
        // Añadir el nuevo sello al principio de la lista para que sea visible inmediatamente
        setSeals(prevSeals => [{ ...sealData, id: docRef.id, createdAt: new Date() } as Seal, ...prevSeals]);
        toast.success("Sello creado con éxito!");
      }
      setIsFormVisible(false);
      setEditingSeal(null);
    } catch (error) {
      console.error("Error saving seal:", error);
      toast.error("Error al guardar el sello.");
    }
  };

  const handleEdit = (seal: Seal) => {
    setEditingSeal(seal);
    setIsFormVisible(true);
  };

  const handleDelete = async (seal: Seal) => {
    if (!user || !confirm("¿Estás seguro de que quieres eliminar este sello?")) return;

    try {
      if (seal.imageUrl) {
        try {
          const imageRef = ref(storage, seal.imageUrl);
          await deleteObject(imageRef);
        } catch (storageError: unknown) {
          if (
            typeof storageError === 'object' &&
            storageError !== null &&
            'code' in storageError &&
            (storageError as { code?: string }).code !== 'storage/object-not-found'
          ) {
            throw storageError;
          }
        }
      }
      const sealDocRef = doc(db, 'users', user.uid, 'seals', seal.id);
      await deleteDoc(sealDocRef);
      setSeals(seals.filter(s => s.id !== seal.id));
      toast.success("Sello eliminado con éxito!");
    } catch (error) {
      console.error("Error deleting seal:", error);
      toast.error("Error al eliminar el sello.");
    }
  };

  const handleAddNew = () => {
    setEditingSeal(null);
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setEditingSeal(null);
    setIsFormVisible(false);
  };

  const handleViewSeal = (sealId: string) => {
    setSelectedSealIdForView(sealId);
    setShowSealDetailModal(true);
  };

  const handleCloseSealDetailModal = () => {
    setSelectedSealIdForView(null);
    setShowSealDetailModal(false);
  };

  return {
    user,
    loadingAuth,
    seals,
    loading,
    editingSeal,
    userProfile,
    isFormVisible,
    handleFormSubmit,
    handleEdit,
    handleDelete,
    handleAddNew,
    handleCancel,
    loadMoreSeals,
    hasMore,
    loadingMore,
    selectedSealIdForView,
    showSealDetailModal,
    handleViewSeal,
    handleCloseSealDetailModal,
  };
};