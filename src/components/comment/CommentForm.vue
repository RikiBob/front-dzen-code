<script setup>
import { ref } from 'vue'
import { useForm, useField } from 'vee-validate'

import { api } from '@/utils/api.js'
import { commentSchema } from "@/validation/comment-schema.js";

const { handleSubmit, errors, resetForm } = useForm({
  validationSchema: commentSchema,
})

const { value: userName } = useField('userName')
const { value: email } = useField('email')
const { value: homePage } = useField('homePage')
const { value: text } = useField('text')

const file = ref(null)
const fileError = ref('')
const fileName = ref('')
const fileInputRef = ref(null)

const sortBy = ref('createdAt')
const sortOrder = ref('DESC')
const page = ref(1)

const captchaVisible = ref(false)
const captchaImage = ref(null)
const captchaInput = ref('')
const captchaError = ref('')
const captchaValidated = ref(false)
const captchaCheckboxError = ref('')

const loadCaptcha = async () => {
  try {
    const response = await api.getBlob('/captcha')
    captchaImage.value = URL.createObjectURL(response)
    captchaInput.value = ''
    captchaError.value = ''
  } catch (err) {
    captchaError.value = 'Failed to load captcha'
  }
}

const validateCaptcha = async () => {
  try {
    const res = await api.get(`/captcha/validate?enteredValue=${captchaInput.value}`)
    const data = await res.json();

    if (res.status === 200) {
      captchaValidated.value = true
      captchaVisible.value = false
      captchaCheckboxError.value = ''
    } else {
      captchaError.value = data.message || 'Incorrect captcha, try again'
      await loadCaptcha()
      captchaInput.value = ''
    }
  } catch (err) {
    captchaError.value = 'Captcha validation error'
  }
}

const cancelCaptcha = () => {
  captchaVisible.value = false
  captchaInput.value = ''
  captchaError.value = ''
}

const props = defineProps({
  replyTo: {
    type: Object,
    default: null,
  },
})

const allowedFormats = ['image/jpeg', 'image/png', 'image/gif', 'text/plain']

const handleFileChange = (e) => {
  const f = e.target.files[0]
  if (f) {
    if (!allowedFormats.includes(f.type)) {
      fileError.value = 'Only JPG, PNG, GIF, or TXT allowed.'
      file.value = null
    } else {
      fileError.value = ''
      file.value = f
      fileName.value = f.name
    }
  }
}

const insertTag = (tag) => {
  const textarea = document.querySelector('textarea');
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;

  let insertText = '';

  if (tag === 'a') {
    insertText = `<a href="" title=""></a>`;
  } else {
    insertText = `<${tag}></${tag}>`;
  }

  const newValue = value.slice(0, start) + insertText + value.slice(end);
  textarea.value = newValue;

  text.value = newValue;

  const cursorPos = start + insertText.length;
  setTimeout(() => {
    textarea.setSelectionRange(cursorPos, cursorPos);
    textarea.focus();
  }, 0);
};


const removeFile = () => {
  file.value = null
  fileName.value = ''
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const emit = defineEmits(['comment-added', 'clear-reply'])

const onSubmit = handleSubmit(async (values) => {
  if (!captchaValidated.value) {
    captchaCheckboxError.value = 'Please confirm captcha'
    captchaVisible.value = true
    await loadCaptcha()
    return
  }

  captchaCheckboxError.value = ''

  const formData = new FormData();
  formData.append('userName', values.userName);
  formData.append('email', values.email);
  formData.append('text', values.text);

  if (values.homePage) {
    formData.append('homePage', values.homePage);
  }

  if (file.value) {
    formData.append('file', file.value);
  }

  if (props.replyTo) {
    formData.append('parentCommentUuid', props.replyTo.uuid);
  }

  formData.append('sortBy', sortBy.value);
  formData.append('sortOrder', sortOrder.value);
  formData.append('page', page.value);

  const { data } = await api.post('/comment', formData)
  emit('comment-added', data)

  resetForm()
  removeFile()
  clearReply()

  captchaValidated.value = false
  captchaInput.value = ''
})

const handleCaptchaClick = async () => {
  captchaCheckboxError.value = ''
  if (!captchaValidated.value) {
    captchaVisible.value = true
    await loadCaptcha()
  }
}

const clearReply = () => {
  emit('clear-reply')
}
</script>

<template>
  <div class="container-wrapper">
    <form class="comment-form-container" @submit.prevent="onSubmit">
      <input type="text" v-model="userName" placeholder="User name" class="input-field" />
      <span class="error-message">{{ errors.userName }}</span>

      <input type="email" v-model="email" placeholder="Email" class="input-field" />
      <span class="error-message">{{ errors.email }}</span>

      <input type="url" v-model="homePage" placeholder="Home Page (optional)" class="input-field" />
      <span class="error-message">{{ errors.homePage }}</span>

      <div class="tag-toolbar">
        <button type="button" @click="insertTag('i')">[i]</button>
        <button type="button" @click="insertTag('strong')">[strong]</button>
        <button type="button" @click="insertTag('code')">[code]</button>
        <button type="button" @click="insertTag('a')">[a]</button>
      </div>

      <textarea v-model="text" placeholder="Write your comment" class="input-field" rows="5"></textarea>
      <span class="error-message">{{ errors.text }}</span>

      <div v-if="props.replyTo" class="reply-info">
        <span class="reply-info__text">
          You answer to: <strong>{{ props.replyTo.userName }}</strong>
        </span>
        <button type="button" @click="clearReply" class="cancel-reply" aria-label="Cancel reply">✖</button>
      </div>

      <label class="file-button">
        <span>Attach File</span>
        <input
            type="file"
            ref="fileInputRef"
            @change="handleFileChange"
            accept="image/jpeg, image/png, image/gif, text/plain"
            class="file-input-hidden"
        />
      </label>

      <span v-if="fileName" class="file-name">
        ✔ {{ fileName }}
        <button type="button" class="remove-file-button" @click="removeFile">✖</button>
      </span>
      <span class="error-message">{{ fileError }}</span>

      <div class="captcha-checkbox" @click="handleCaptchaClick">
        <div class="checkbox-box">
          <span v-if="captchaValidated" class="checkmark">✔</span>
        </div>
        <span>I’m not a robot</span>
      </div>
      <span class="error-message">{{ captchaCheckboxError }}</span>

      <button type="submit" class="submit-button">
        Post Comment
      </button>
    </form>

    <div v-if="captchaVisible" class="captcha-modal">
      <div class="captcha-content">
        <img :src="captchaImage" alt="Captcha" class="captcha-image" />

        <input
            type="text"
            v-model="captchaInput"
            placeholder="Enter captcha text"
            class="input-field"
            autofocus
        />
        <span class="error-message">{{ captchaError }}</span>

        <div class="captcha-buttons">
          <button @click="validateCaptcha" class="btn-validate">Submit</button>
          <button @click="cancelCaptcha" class="btn-cancel">Cancel</button>
          <button @click="loadCaptcha" class="btn-refresh">Change Captcha</button>
        </div>
      </div>
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
}

.comment-form-container {
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

.tag-toolbar {
  display: flex;
  gap: 8px;
  margin-top: -10px;
  margin-bottom: -10px;
}

.tag-toolbar button {
  padding: 5px 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  background: #f9f9f9;
  cursor: pointer;
  border-radius: 3px;
  transition: background 0.3s;
}

.tag-toolbar button:hover {
  background: #eee;
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

.reply-info {
  display: flex;
  align-items: center;
  background-color: #fafafa;
  border-left: 3px solid #888;
  padding: 6px 10px;
  border-radius: 3px;
  font-size: 0.9rem;
  color: #444;
  margin-bottom: 10px;
}

.reply-info__text {
  flex-grow: 1;
  font-weight: 500;
}

.cancel-reply {
  background: transparent;
  border: none;
  color: #bfadad;
  font-size: 1rem;
  cursor: pointer;
  padding: 0 6px;
  transition: color 0.2s ease-in-out;
}

.cancel-reply:hover {
  color: #ef1b1b;
}

.checkbox-box {
   width: 20px;
   height: 20px;
   border: 1px solid #ccc;
   border-radius: 3px;
   background: #fff;
   display: flex;
   align-items: center;
   justify-content: center;
 }

.checkmark {
  color: #0077ff;
  font-size: 14px;
}

.captcha-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  margin-top: -10px;
  user-select: none;
}

.captcha-checkbox input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  background-color: #fff;
  border: 1px solid #ccc;
  width: 20px;
  height: 20px;
  border-radius: 3px;
  display: grid;
  place-content: center;
}

.captcha-checkbox input[type="checkbox"]::before {
  content: "✔";
  transform: scale(0);
  transition: transform 0.2s ease-in-out;
  color: #0077ff;
}

.captcha-checkbox input[type="checkbox"]:checked::before {
  transform: scale(1);
}

.captcha-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.captcha-content {
  background: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  width: 320px;
  text-align: center;
}

.captcha-image {
  max-width: 100%;
  margin-bottom: 1rem;
}

.captcha-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.captcha-buttons button {
  flex: 1 1 30%;
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




