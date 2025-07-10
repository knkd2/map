// src/firebase.js
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAyOvDG380ac3t-j5AxLj--pzCrllv53cc",
  authDomain: "test-fdd27.firebaseapp.com",
  projectId: "test-fdd27",
  storageBucket: "test-fdd27.appspot.com",
  messagingSenderId: "627347263153",
  appId: "1:627347263153:web:YOUR_APP_ID" // 這行可以先省略
}

// 初始化 Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export { auth }
