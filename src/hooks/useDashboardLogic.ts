import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export const useDashboardLogic = () => {
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

  return {
    user,
    loadingAuth,
    displayName,
    loadingProfile,
  };
};
