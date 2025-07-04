
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header: React.FC = () => {
  const [user] = useAuthState(auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    signOut(auth);
    setIsMenuOpen(false); // Cerrar menú al cerrar sesión
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-50">
      <nav className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold z-50">
          <Link to="/" className="text-white no-underline" onClick={() => setIsMenuOpen(false)}>
            CRM Facturas
          </Link>
        </h1>

        {/* Botón de hamburguesa para móviles y tablets */}
        <div className="md:hidden z-50">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Menú de navegación para escritorio */}
        <div className="hidden md:flex space-x-4 items-center">
          {user ? (
            <>
              <Link to="/" className="text-white hover:text-blue-200 transition-colors duration-200">
                Dashboard
              </Link>
              <Link to="/profile" className="text-white hover:text-blue-200 transition-colors duration-200">
                Perfil
              </Link>
              <Link to="/seals" className="text-white hover:text-blue-200 transition-colors duration-200">
                Sellos
              </Link>
              <button
                onClick={handleLogout}
                className="text-white hover:text-blue-200 transition-colors duration-200 focus:outline-none"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-blue-200 transition-colors duration-200">
                Login
              </Link>
              <Link to="/register" className="text-white hover:text-blue-200 transition-colors duration-200">
                Registro
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Menú lateral para móviles y tablets */}
      <div
        className={`fixed inset-0 bg-blue-700 z-40 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-6">
          {user ? (
            <>
              <Link to="/" className="text-white text-2xl hover:text-blue-200 transition-colors duration-200" onClick={toggleMenu}>
                Dashboard
              </Link>
              <Link to="/profile" className="text-white text-2xl hover:text-blue-200 transition-colors duration-200" onClick={toggleMenu}>
                Perfil
              </Link>
              <Link to="/seals" className="text-white text-2xl hover:text-blue-200 transition-colors duration-200" onClick={toggleMenu}>
                Sellos
              </Link>
              <button
                onClick={handleLogout}
                className="text-white text-2xl hover:text-blue-200 transition-colors duration-200 focus:outline-none"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white text-2xl hover:text-blue-200 transition-colors duration-200" onClick={toggleMenu}>
                Login
              </Link>
              <Link to="/register" className="text-white text-2xl hover:text-blue-200 transition-colors duration-200" onClick={toggleMenu}>
                Registro
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
