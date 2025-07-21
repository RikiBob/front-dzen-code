<script setup>
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";

import {api} from "@/utils/api.js";

const router = useRouter();

const user = ref(null);
const picture = ref(null);

const fetchUser = async () => {
  const res = await api.get('/user')
  const data = await res.json()

  user.value = {
    userName: data.userName,
    email: data.email,
    createdAt: data.createdAt,
  }

  if(data.picture) {
    picture.value = data.picture;
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const goToEditProfile = () => {
  router.push('/user/edit')
}

const deleteProfile = async () => {
  const confirmed = window.confirm(
      "Are you sure you want to delete your profile? This action cannot be undone."
  );
  if (!confirmed) return;

  await api.remove('/user');
  router.push('/login');
};

const logout = async () => {
  await api.post('/auth/logout');
  await router.push('/login');
};

const goToMain = () => {
  router.push('/main');
}

onMounted(fetchUser)
</script>

<template>
  <div class="profile-container" v-if="user">
    <div class="avatar-wrapper">
      <img
          :src="picture || '/avatar.png'"
          alt="Avatar"
          class="avatar-image"
      />
    </div>
    <h2>{{ user.userName }}</h2>
    <p>Email: {{ user.email }}</p>
    <p>Date of registration: {{ formatDate(user.createdAt) }}</p>

    <button class="edit-button" @click="goToEditProfile">
      Edit profile
    </button>

    <button class="logout-button" @click="logout">
      Logout
    </button>

    <button class="delete-button" @click="deleteProfile">
      Delete profile
    </button>
  </div>

  <div class="get-comments-wrapper">
    <button class="get-comments-button" @click="goToMain">
      Get Comments
    </button>
  </div>

</template>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 320px;
  margin: 50px auto;
  font-family: 'Segoe UI', sans-serif;
  text-align: center;
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 10px;
}

.avatar-wrapper {
  display: flex;
  justify-content: center;
}

.avatar-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #98b0cc;
}

.get-comments-wrapper {
  display: flex;
  justify-content: center;
  margin: 20px auto;
  max-width: 320px;
}

.get-comments-button {
  width: 100%;
  max-width: 320px;
  padding: 14px 0;
  font-size: 18px;
  font-weight: 700;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  background: linear-gradient(270deg, #00d2ff, #3a47d5, #ff6a00);
  background-size: 600% 600%;
  animation: gradientShift 10s ease infinite, pulse 2.5s ease-in-out infinite;
  box-shadow: 0 0 12px rgba(255, 106, 0, 0.8);
  transition: box-shadow 0.3s ease;
}

.get-comments-button:hover {
  box-shadow: 0 0 20px rgba(255, 106, 0, 1);
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 12px rgba(255, 106, 0, 0.8);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 25px rgba(255, 106, 0, 1);
  }
}

.edit-button {
  padding: 10px;
  font-size: 14px;
  border: none;
  background: #0077ff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.edit-button:hover {
  background: #0055cc;
}

.delete-button {
  padding: 10px;
  font-size: 14px;
  border: none;
  background: #ff4d4d;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.logout-button {
  padding: 10px;
  font-size: 14px;
  border: none;
  background: #999999;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.logout-button:hover {
  background: #666666;
}

.delete-button {
  padding: 0;
  font-size: 14px;
  border: none;
  background: transparent;
  color: #777777;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.3s ease;
}

.delete-button:hover {
  color: #cc0000;
  background: transparent;
  text-decoration: none;
}
</style>
