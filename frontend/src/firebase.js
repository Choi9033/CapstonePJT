// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth'; // ✅ 이 줄 추가
import { getFirestore } from 'firebase/firestore';

// Firebase 설정
const firebaseConfig = {
  apiKey: 'AIzaSyCRgMoP3VwVQ7-KXM-ctmQE7zPg8OYdZME',
  authDomain: 'my-first-firebase-2025-6287e.firebaseapp.com',
  projectId: 'my-first-firebase-2025-6287e',
  storageBucket: 'my-first-firebase-2025-6287e.firebasestorage.app',
  messagingSenderId: '282714407847',
  appId: '1:282714407847:web:3312c03385c2e316042c82',
  measurementId: 'G-EMXERDWKHX',
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Authentication 객체 가져오기
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Firestore 객체 가져오기
const db = getFirestore(app);

// 외부에서 쓸 수 있도록 export
export { auth, provider, db };
