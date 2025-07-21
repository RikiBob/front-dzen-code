<script setup>
import { ref, onMounted } from 'vue'
import {useRouter} from "vue-router";

import { api } from "@/utils/api.js";
import { useWebSocket } from "@/utils/useWebSoket.js";
import CommentForm from "@/components/comment/CommentForm.vue";
import CommentList from "@/components/comment/CommentList.vue";
import PaginationSort from "@/components/comment/PaginationSort.vue";

const comments = ref([])
const replyTo = ref(null)
const router = useRouter()

const currentPage = ref(1)
const totalPages = ref(1)
const sortBy = ref('createdAt')
const sortOrder = ref('DESC')

const fetchMainComments = async () => {
  const res = await api.get('/comment/main', {
    params: {
      page: currentPage.value,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
    }
  })

  const data = await res.json()

  comments.value = data.data
  totalPages.value = data.totalPages
}

function handleReply(payload) {
  replyTo.value = payload
}

function handlePageChange(page) {
  currentPage.value = page
  fetchMainComments()
}

function handleSortByChange(newSortBy) {
  sortBy.value = newSortBy
  fetchMainComments()
}

function handleSortOrderChange(newSortOrder) {
  sortOrder.value = newSortOrder
  fetchMainComments()
}

function goToProfile() {
  router.push('/user')
}

onMounted(fetchMainComments)

useWebSocket('comments:update', (newData) => {
  fetchMainComments()
})
</script>

<template>
  <div class="main-container">
    <aside class="sidebar">
      <button class="btn-profile" @click="goToProfile">← Back to Profile</button>

      <CommentForm
          :reply-to="replyTo"
          :current-page="currentPage"
          :sort-by-prop="sortBy"
          :sort-order-prop="sortOrder"
          @clear-reply="replyTo = null"
          @comment-added="fetchMainComments"
      />
    </aside>

    <section class="content">
      <PaginationSort
          :totalPages="totalPages"
          :currentPage="currentPage"
          :sortBy="sortBy"
          :sortOrder="sortOrder"
          @update:page="handlePageChange"
          @update:sortBy="handleSortByChange"
          @update:sortOrder="handleSortOrderChange"
      />

      <CommentList :comments="comments" @reply="handleReply" />
    </section>
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  gap: 2rem;
  padding: 2rem;
}

.sidebar {
  width: 300px;
  position: sticky;
  top: 2rem;
  align-self: flex-start;
}

.btn-profile {
  display: inline-block;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background-color: #0077ff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  user-select: none;
  transition: background-color 0.2s ease;
}

.btn-profile:hover {
  background-color: #005bb5;
}

.content {
  flex: 1;
  min-width: 0;
}
</style>
