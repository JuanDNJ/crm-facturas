import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center mb-6">Registro</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
