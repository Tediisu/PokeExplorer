// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { initializeAuth,  getReactNativePersistence } from 'firebase/auth';
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDw2LJxhlPWrpKEoa260FYHvzIUGwrQk0k",
//   authDomain: "pokeexplorer-359fc.firebaseapp.com",
//   projectId: "pokeexplorer-359fc",
//   storageBucket: "pokeexplorer-359fc.firebasestorage.app",
//   messagingSenderId: "385080060064",
//   appId: "1:385080060064:web:c9f3f66e2aca3d0203c1c5"
// };

// // Initialize Firebase
// export const app = initializeApp(firebaseConfig);
// export const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// });

// ✅ CORRECT: React Native Firebase SDK
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

// Your Firebase config (app auto-initializes from google-services.json)
export { auth };
export default firebase;
