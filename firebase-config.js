import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Tus credenciales reales de RuletaWeb
const firebaseConfig = {
  apiKey: "AIzaSyBVI02A9vOeuKqjCRVA-WjIAFeluazJALM",
  authDomain: "ruletapremios-acef9.firebaseapp.com",
  projectId: "ruletapremios-acef9",
  storageBucket: "ruletapremios-acef9.firebasestorage.app",
  messagingSenderId: "1023792024330",
  appId: "1:1023792024330:web:e6eb093cd009cc3ff388f3",
  measurementId: "G-43HGPV8SZ8"
};

// Inicializar Firebase y la base de datos
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Exportar base de datos
export { db };

