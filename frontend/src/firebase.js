// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth'; // ✅ 이 줄 추가
import { getFirestore } from 'firebase/firestore';

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyBiY5vRfvS8fVuDKuwB_kpLm6R8SRv34Fw",
  authDomain: "my-first-firebase-2025-458711.firebaseapp.com",
  projectId: "my-first-firebase-2025-458711",
  storageBucket: "my-first-firebase-2025-458711.firebasestorage.app",
  messagingSenderId: "533493952547",
  appId: "1:533493952547:web:52b872530a858565fdc196",
  measurementId: "G-YF12K1B79R"
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
