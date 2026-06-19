import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

import {
getFirestore,
collection,
getDocs,
addDoc
}  from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyDEYmHP-Ir3muyXvkiThYuljQzf23ut9Ls",
authDomain: "atencion-proyecto.firebaseapp.com",
projectId: "atencion-proyecto",
storageBucket: "atencion-proyecto.firebasestorage.app",
messagingSenderId: "774761242973",
appId: "1:774761242973:web:f5d8bdb38461f7ae8748b4"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db, collection, getDocs, addDoc };
