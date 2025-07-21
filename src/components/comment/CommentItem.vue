<script setup>
import { ref } from 'vue'

import CommentItem from "@/components/comment/CommentItem.vue";

const emit = defineEmits(['reply'])
const props = defineProps({ comment: Object });

const isImageModalOpen = ref(false)
const modalImageSrc = ref('')

const openImageModal = (src) => {
  modalImageSrc.value = src
  isImageModalOpen.value = true
}

const closeImageModal = () => {
  isImageModalOpen.value = false
  modalImageSrc.value = ''
}
</script>

<template>
  <div class="comment">
    <div class="comment-header">
      <img :src="comment.picture || '/avatar.png'" alt="avatar" class="avatar" />
      <div class="info">
        <div class="username">{{ comment.user_name }}</div>
        <div class="email">{{ comment.email }}</div>
        <a v-if="comment.home_page" :href="comment.home_page" class="homepage" target="_blank">
          🌐 {{ comment.home_page }}
        </a>
        <div class="time">{{ new Date(comment.comment_created_at).toLocaleString() }}</div>
      </div>
    </div>

    <div class="text" v-html="comment.text" />

    <div v-if="comment.file_url" class="file-container">
      <img
          v-if="comment.file_url.includes('image')"
          :src="comment.file_url"
          class="file-image"
          alt="comment image"
          @click="openImageModal(comment.file_url)"
      />
      <a
          v-else
          :href="comment.file_url"
          class="file-download-button"
          target="_blank"
          download
      >
        📄 Download file
      </a>
    </div>

    <button class="reply-button"
            @click="emit('reply', { uuid: comment.uuid, userName: comment.user_name })">
      💬 Answer
    </button>

    <div class="child-comments" v-if="comment.childComments?.length">
      <CommentItem
          v-for="child in comment.childComments"
          :key="child.uuid"
          :comment="child"
          @reply="emit('reply', $event)"
      />
    </div>

    <div v-if="isImageModalOpen" class="modal-overlay" @click="closeImageModal">
      <img :src="modalImageSrc" class="modal-image" alt="expanded image" />
    </div>

  </div>
</template>

<style scoped>
.comment {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #fdfdfd;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e2e2;
  word-break: break-word;
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
  border: 2px solid #ccc;
  transition: transform 0.2s ease;
}
.avatar:hover { transform: scale(1.05); }

.info {
  display: flex;
  flex-direction: column;
  font-size: 0.85rem;
}

.username { font-weight: 600; font-size: 1rem; color: #222; }
.email { color: #777; font-size: 0.8rem; }
.homepage {
  color: #0077cc;
  font-size: 0.8rem;
  text-decoration: none;
  word-break: break-all;
}
.homepage:hover { text-decoration: underline; }
.time { color: #aaa; font-size: 0.75rem; }

.text {
  font-size: 0.95rem;
  line-height: 1.5;
  margin-top: 0.5rem;
  white-space: pre-wrap;
}

.file-container {
  margin-top: 0.8rem;
}

.file-image {
  max-width: 100%;
  max-height: 240px;
  border-radius: 6px;
  border: 1px solid #ccc;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: zoom-in;
}
.file-image:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

.file-download-button {
  display: inline-block;
  margin-top: 0.3rem;
  padding: 0.5rem 1rem;
  background: #0077cc;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 500;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  transition: background 0.3s, transform 0.2s;
}
.file-download-button:hover {
  background: #005fa3;
  transform: translateY(-2px);
}

.reply-button {
  font-size: 14px;
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  align-self: center;
  margin-top: 10px;
  transition: color 0.3s ease;
}
.reply-button:hover { color: #0077ff; }

.child-comments {
  margin-top: 1rem;
  padding-left: 1rem;
  border-left: 2px dashed #ddd;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease-out;
  cursor: zoom-out;
}

.modal-image {
  width: 80vw;
  height: auto;
  max-height: 90vh;
  image-rendering: pixelated;
  object-fit: contain;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes zoomIn {
  from { transform: scale(0.7); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>

