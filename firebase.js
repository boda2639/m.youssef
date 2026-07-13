import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getFirestore }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { getAuth }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyDmvK1jljpqUJdh6GYFmTj6X_hYGJ0kpm8",
    authDomain: "mr-aboda.firebaseapp.com",
    databaseURL: "https://mr-aboda-default-rtdb.firebaseio.com",
    projectId: "mr-aboda",
    storageBucket: "mr-aboda.firebasestorage.app",
    messagingSenderId: "200940795677",
    appId: "1:200940795677:web:1451f8df036f45e32413f4"
};


// تشغيل Firebase
const app = initializeApp(firebaseConfig);


// تشغيل Firestore
const db = getFirestore(app);


// تشغيل Authentication
const auth = getAuth(app);


// تصدير الخدمات
export { app, db, auth };