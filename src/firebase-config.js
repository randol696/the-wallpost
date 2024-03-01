import {initializeApp} from "firebase/app";
import {getFirestore} from "@firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyAfC4s-qYAYp6cv1E8wfHkk9Qo4DKNoYq4",
    authDomain: "the-wall-app-86171.firebaseapp.com",
    projectId: "the-wall-app-86171",
    storageBucket: "the-wall-app-86171.appspot.com",
    messagingSenderId: "49312935064",
    appId: "1:49312935064:web:d3244c6af359d0f169b4ed",
    measurementId: "G-XNM5QKS9XJ"
};

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)