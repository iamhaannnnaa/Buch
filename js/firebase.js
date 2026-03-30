import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "DEINEAIzaSyBbyn1si6Rv7HUThs-lYjyGPPtWiOYcUIs",
  authDomain: "gastebuchmalina.firebaseapp.com",
  projectId: "gastebuchmalina",
  storageBucket: "gastebuchmalina.firebasestorage.app",
  messagingSenderId: "931410724521",
  appId: "1:931410724521:web:d5027ed0b08ab325e98bb8",
  measurementId: "G-8ERBJT22X1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
