// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCDBM5qLPhBynH9TyE1QjlbsAxttF2FkcQ',
  authDomain: 'qurtesy-finance.firebaseapp.com',
  databaseURL: 'https://qurtesy-finance-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'qurtesy-finance',
  storageBucket: 'qurtesy-finance.firebasestorage.app',
  messagingSenderId: '786467323121',
  appId: '1:786467323121:web:bcefbedfc6ee1265193d50',
  measurementId: 'G-BLWM1TKWR2',
};

// Initialize Firebase
initializeApp(firebaseConfig);
