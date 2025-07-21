<script setup>
import {useField, useForm} from "vee-validate";
import {useRouter} from "vue-router";
import {ref} from "vue";

import {editProfileSchema} from "@/validation/edit-profile-schema.js";
import {api} from "@/utils/api.js";

const router = useRouter();

const { handleSubmit, errors } = useForm({
  validationSchema: editProfileSchema
})

const { value: userName } = useField('userName')
const { value: password } = useField('password')

const picture = ref(null);
const fileError = ref("");
const fileName = ref("");
const fileInputRef = ref(null);

const allowedFormats = ['image/jpeg', 'image/png', 'image/gif'];

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    if (!allowedFormats.includes(file.type)) {
      fileError.value = "Unsupported file format. Please upload JPEG, PNG, or GIF.";
      picture.value = null;
    } else {
      fileError.value = "";
      picture.value = file;
      fileName.value = file.name;
    }
  }
};

const removeFile = () => {
  picture.value = null;
  fileName.value = "";

  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
};

const onSubmit = handleSubmit(async (values) => {
  const formData = new FormData();

  if (userName.value) {
    formData.append('userName', values.userName);
  }

  if (password.value) {
    formData.append('password', values.password);
  }

  if (picture.value) {
    formData.append('picture', picture.value);
  }

  await api.patch('/user', formData,);

  await router.push('/user');
});

function cancelEdit() {
  router.push('/user');
}
</script>

<template>
  <div class="container-wrapper">
    <form class="edit-profile-container" @submit.prevent="onSubmit">
      <input type="text" v-model="userName" placeholder="User name" class="input-field"/>
      <span class="error-message">{{ errors.userName }}</span>

      <input type="text" v-model="password" placeholder="Password" class="input-field"/>
      <span class="error-message">{{ errors.password }}</span>

      <label class="file-button">
        <span>Attach Profile Picture</span>
        <input type="file"
               ref="fileInputRef"
               @change="handleFileChange"
               accept="image/jpeg, image/png, image/gif"
               class="file-input-hidden"
        />
      </label>
      <span v-if="fileName" class="file-name">
        ✔ {{ fileName }}
        <button type="button" class="remove-file-button" @click="removeFile">✖</button>
      </span>
      <span class="error-message">{{ fileError }}</span>


      <button class="submit-button" type="submit">Edit Profile</button>

      <button type="button" class="btn-cancel" @click="cancelEdit">
        Back to Profile
      </button>
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

.btn-cancel {
  padding: 0;
  font-size: 14px;
  border: none;
  background: transparent;
  color: #777777;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.3s ease;
}

.btn-cancel:hover {
  color: #222;
  text-decoration: none;
}

.edit-profile-container {
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

.file-button {
  display: inline-block;
  position: relative;
  padding: 12px;
  font-size: 16px;
  border: none;
  background: transparent;
  color: #0077ff;
  cursor: pointer;
  overflow: hidden;
  transition: color 0.3s ease;
  text-align: center;
}

.file-button::before {
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

.file-button:hover::before {
  width: 100%;
}

.file-button:hover {
  color: #0055cc;
}

.file-input-hidden {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.file-name {
  font-size: 14px;
  color: #28a745;
  margin-top: -10px;
  margin-bottom: -10px;
  padding-left: 5px;
}

.remove-file-button {
  background: none;
  border: none;
  color: #bfadad;
  cursor: pointer;
  margin-left: 5px;
  font-size: 14px;
}

.remove-file-button:hover {
  color: #ef1b1b;
}

.error-message {
  color: #ff4d4f;
  font-size: 13px;
  margin-top: -10px;
  margin-bottom: -10px;
  padding-left: 5px;
  transition: opacity 0.3s ease;
}
</style>