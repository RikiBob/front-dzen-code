<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}

const goToRegister = () => {
  router.push('/user/register')
}
</script>

<template>
  <div class="container-wrapper">
    <div class="login-container">
      <h1 class="title">🗨️ Comment System SPA</h1>
      <p class="description">
        A single-page web application for posting and managing nested comments. Includes user identification, CAPTCHA, attachments, sorting, pagination, and real-time updates. Built with Vue, NestJS, PostgreSQL, and WebSocket.
      </p>

      <button class="submit-button" @click="goToLogin">Login</button>
      <button class="link-button" @click="goToRegister">Create an account</button>
    </div>
  </div>
</template>

<style scoped>
.container-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f9fbfd;
  padding: 20px;
}

.login-container {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 16px;
  padding: 40px 30px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  max-width: 500px;
  width: 100%;
  text-align: center;
  font-family: 'Segoe UI', sans-serif;
}

.title {
  font-size: 26px;
  color: #333;
  margin-bottom: 16px;
}

.description {
  font-size: 16px;
  color: #555;
  line-height: 1.5;
  margin-bottom: 32px;
}

.submit-button {
  position: relative;
  padding: 12px;
  font-size: 16px;
  border: none;
  background: transparent;
  color: #0077ff;
  cursor: pointer;
  overflow: hidden;
  transition: color 0.3s ease;
}

.submit-button::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 3px;
  background: #0077ff;
  transition: all 0.4s ease;
  transform: translateX(-50%);
}

.submit-button:hover::before {
  width: 100%;
}

.submit-button:hover {
  color: #0055cc;
}

.link-button {
  margin-top: 12px;
  font-size: 14px;
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.link-button:hover {
  color: #0077ff;
}
</style>