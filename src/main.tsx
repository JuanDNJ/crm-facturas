import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <ToastContainer
      position="bottom-right"
      toastClassName="bg-gray-800 text-white p-3 rounded-lg shadow-lg"
      aria-label="Notificaciones"
    />
  </StrictMode>,
)
