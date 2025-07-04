import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export const useRegisterLogic = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Limpiar errores previos
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Crear un perfil de usuario básico en Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date(),
      });

      // Añadir un sello de ejemplo para el nuevo usuario
      await addDoc(collection(db, "users", user.uid, "seals"), {
        name: "Sello de Ejemplo",
        description: "Este es un sello de ejemplo para ayudarte a empezar. Puedes editarlo o eliminarlo.",
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/crm-facturas.firebasestorage.app/o/pictures%2Fcamion-moderno.png?alt=media&token=9396cd43-a15b-473b-a4a4-3e071513e6e7", // URL de una imagen de ejemplo
        userAddress: "Calle Falsa 123",
        userCity: "Springfield",
        userCountry: "España",
        userTaxId: "X00000000Y",
        userName: "Juan",
        userLastName: "Pérez",
      });

      navigate('/'); // Redirige al Dashboard
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleRegister,
  };
};
