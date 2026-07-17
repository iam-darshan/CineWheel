import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBTiL3mYQl9Gs-ntz4msAQVj1HuC1sJOko",
  authDomain: "cinewheel-3e29a.firebaseapp.com",
  databaseURL: "https://cinewheel-3e29a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cinewheel-3e29a",
  storageBucket: "cinewheel-3e29a.firebasestorage.app",
  messagingSenderId: "614093434464",
  appId: "1:614093434464:web:b410ae669bfce9410edd05",
  measurementId: "G-PP2HT8N1Z1"
};

const app = initializeApp(firebaseConfig);
export default app;

export const db = getFirestore(app);
export const auth = getAuth(app);
