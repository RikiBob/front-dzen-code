<script setup>
import CommentItem from "@/components/comment/CommentItem.vue";

defineProps({ comments: Array })
const emit = defineEmits(['reply'])
</script>

<template>
  <div class="comment-list">
    <CommentItem v-for="comment in comments"
                 :key="comment.uuid"
                 :comment="comment"
                 @reply="emit('reply', $event)" />
  </div>
</template>

<style scoped>
.comment-list {
  display: flex;
  flex-direction: column;
}
</style>
