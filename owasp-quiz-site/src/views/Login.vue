<template>
  <div class="login-container">
    <h1>登入</h1>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="密碼" required />
      <button type="submit">登入</button>
    </form>
    <button @click="signInWithGoogle" class="google-login-button">
      使用 Google 登入
    </button>
    <p>
      還沒有帳號？<router-link to="/register">前往註冊</router-link>
    </p>
    <router-link to="/home">返回</router-link>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { auth } from '@/firebase'; // 確保路徑正確
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();
const googleProvider = new GoogleAuthProvider(); // 建立 Google 登入提供者

const login = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push('/');
  } catch (err) {
    error.value = '登入失敗：' + err.message;
  }
};

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Google 登入成功，result 包含使用者資訊 (result.user) 等
    router.push('/');
  } catch (err) {
    error.value = 'Google 登入失敗：' + err.message;
    // 處理錯誤，例如彈出視窗被封鎖、使用者取消等
    console.error('Google 登入錯誤:', err);
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  position: absolute;
  top: 50%; /* 將元素的頂部放置在其父元素的垂直中心 */
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  transform: translateY(-50%); /* 僅垂直方向調整位置 */
  padding: 2rem;
  text-align: left;
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(12, 114, 192, 0.1);
  z-index: 10;
}
input {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.5rem;
}
button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer; /* 添加滑鼠懸停效果 */
}
button:hover {
  background-color: #0056b3;
}
.error {
  color: red;
  margin-top: 1rem;
}
p {
  margin-top: 1rem;
}
a {
  color: #007bff;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
</style>