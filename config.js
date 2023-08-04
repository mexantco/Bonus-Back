import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyAve8Q2HIAEIaHnLWWD0FTPp6cGaOccbiE",
  authDomain: "bonusbank2-5d3de.firebaseapp.com",
  projectId: "bonusbank2-5d3de",
  storageBucket: "bonusbank2-5d3de.appspot.com",
  messagingSenderId: "617626373025",
  appId: "1:617626373025:web:b927dc06119f235b6619e0",
  measurementId: "G-RCMX42GKXV"
  };

  if(!firebase.apps.length){
    const app = firebase.initializeApp(firebaseConfig);
    
   
    firebase.firestore().settings({experimentalForceLongPolling: true});
  
  }