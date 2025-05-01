// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Firebase 설정
const firebaseConfig = {
  apiKey: 'AIzaSyANohFRVbky9G2Synlb7RVhP6qraVw-4ds',
  authDomain: 'fir-d3b8e.firebaseapp.com',
  projectId: 'fir-d3b8e',
  storageBucket: 'fir-d3b8e.firebasestorage.app',
  messagingSenderId: '1039855103377',
  appId: '1:1039855103377:web:90a767c599485df9363e30',
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Authentication 객체 가져오기
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 외부에서 쓸 수 있도록 export
import { getFirestore } from 'firebase/firestore';
const db = getFirestore(app);
export { auth, provider, db };
