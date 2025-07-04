
import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const Dashboard: React.FC = () => {
  const [user, loadingAuth] = useAuthState(auth);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setDisplayName(docSnap.data().displayName || user.email);
          } else {
            setDisplayName(user.email);
          }
        } catch (err) {
          console.error('Error fetching user profile for dashboard:', err);
          setDisplayName(user.email); // Fallback to email on error
        } finally {
          setLoadingProfile(false);
        }
      } else if (!loadingAuth) {
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [user, loadingAuth]);

  if (loadingAuth || loadingProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold mb-4">
        Bienvenido, {displayName || user?.email || 'Usuario'}!
      </h1>
      <h2 className="text-xl font-semibold mb-4">
        Dashboard
      </h2>
      {/* Aquí irá el listado de facturas */}
    </div>
  );
};

export default Dashboard;
