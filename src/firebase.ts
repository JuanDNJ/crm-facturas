
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Importar getStorage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKrUdXJAper3UwZ3Pql_Q5v9Nzp6zTbRY",
  authDomain: "crm-facturas.firebaseapp.com",
  projectId: "crm-facturas",
  storageBucket: "crm-facturas.firebasestorage.app",
  messagingSenderId: "1092535786069",
  appId: "1:1092535786069:web:a874faab3b2e0690f692dc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Inicializar Firebase Storage

export { auth, db, storage };
