
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Seal } from '../types';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

export const useSealDetailLogic = (sealId: string | null) => {
  const [sealData, setSealData] = useState<Seal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchSeal = async () => {
      if (!sealId || !user) {
        setLoading(false);
        setSealData(null);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const docRef = doc(db, 'users', user.uid, 'seals', sealId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setSealData({ ...docSnap.data(), id: docSnap.id } as Seal);
        } else {
          setError("Sello no encontrado.");
          setSealData(null);
        }
      } catch (err) {
        console.error("Error fetching seal details:", err);
        setError("Error al cargar los detalles del sello.");
        setSealData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSeal();
  }, [sealId, user]);

  return {
    sealData,
    loading,
    error,
  };
};
