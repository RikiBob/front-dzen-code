<script setup>
import {useField, useForm} from "vee-validate";
import {useRouter} from "vue-router";

import {loginSchema} from "@/validation/login-schema.js";
import {api} from "@/utils/api.js"

const router = useRouter();

const { handleSubmit, errors } = useForm({
  validationSchema: loginSchema
})

const { value: email } = useField('email')
const { value: password } = useField('password')

const onSubmit = handleSubmit(async (values) => {
  await api.post('/auth/login', values);
  await router.push('/user');
})

const goToRegister = () => {
  router.push('/user/register');
};
</script>

<template>
  <div class="container-wrapper">
    <form class="login-container" @submit.prevent="onSubmit">
      <input type="text" v-model="email" placeholder="Email" class="input-field" />
      <span class="error-message">{{ errors.email }}</span>

      <input type="password" v-model="password" placeholder="Password" class="input-field" />
      <span class="error-message">{{ errors.password }}</span>

      <button class="submit-button" type="submit">Sing In</button>

      <button class="link-button" type="button" @click="goToRegister">Create Account</button>
    </form>
  </div>
</template>

<style scoped>
.container-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.login-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 300px;
  margin: 100px auto;
  font-family: 'Segoe UI', sans-serif;
}

.input-field {
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  padding: 10px 5px;
  font-size: 16px;
  transition: all 0.3s ease;
  outline: none;
  position: relative;
}

.input-field::placeholder {
  color: #aaa;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.input-field:focus {
  border-bottom: 2px solid #0077ff;
}

.input-field:focus::placeholder {
  transform: translateY(-12px);
  opacity: 0.7;
}

.input-field:hover {
  border-bottom: 2px solid #0077ff;
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

.error-message {
  color: #ff4d4f;
  font-size: 13px;
  margin-top: -10px;
  margin-bottom: -10px;
  padding-left: 5px;
  transition: opacity 0.3s ease;
}

.link-button {
  font-size: 14px;
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  text-decoration: underline;
  align-self: center;
  margin-top: -10px;
  transition: color 0.3s ease;
}

.link-button:hover {
  color: #0077ff;
}
</style>