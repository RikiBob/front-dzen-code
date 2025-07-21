<script setup>
import { computed } from 'vue';

const props = defineProps({
  totalPages: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
  sortBy: {
    type: String,
    default: 'createdAt',
  },
  sortOrder: {
    type: String,
    default: 'DESC',
  },
});

const emit = defineEmits(['update:page', 'update:sortBy', 'update:sortOrder']);

const sortFields = [
  { label: 'Email', value: 'email' },
  { label: 'User Name', value: 'userName' },
  { label: 'Created At', value: 'createdAt' },
];

const sortOrders = [
  { label: 'Ascending', value: 'ASC' },
  { label: 'Descending', value: 'DESC' },
];

const maxVisiblePages = 7;

const pages = computed(() => {
  const pagesArr = [];
  const total = props.totalPages;
  const current = props.currentPage;

  if (total <= maxVisiblePages) {
    for (let i = 1; i <= total; i++) pagesArr.push(i);
  } else {
    if (current <= 4) {
      pagesArr.push(1,2,3,4,5,'...', total);
    } else if (current >= total - 3) {
      pagesArr.push(1,'...', total - 4, total - 3, total - 2, total - 1, total);
    } else {
      pagesArr.push(1,'...', current -1, current, current +1,'...', total);
    }
  }

  return pagesArr;
});

const changePage = (page) => {
  if (page === '...' || page === props.currentPage) return;
  emit('update:page', page);
};

const onSortByChange = (e) => {
  emit('update:sortBy', e.target.value);
};

const onSortOrderChange = (e) => {
  emit('update:sortOrder', e.target.value);
};
</script>

<template>
  <div class="pagination-sort-container">
    <div class="pagination">
      <button
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="nav-button"
          aria-label="Previous page"
      >
        ←
      </button>

      <button
          v-for="page in pages"
          :key="page + (page === currentPage ? '-current' : '')"
          :class="['page-button', { active: page === currentPage, dots: page === '...' }]"
          @click="changePage(page)"
          :disabled="page === '...'"
      >
        {{ page }}
      </button>

      <button
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
          class="nav-button"
          aria-label="Next page"
      >
        →
      </button>
    </div>

    <div class="sort-controls">
      <label for="sort-by-select">Sort by:</label>
      <select id="sort-by-select" :value="sortBy" @change="onSortByChange">
        <option v-for="field in sortFields" :key="field.value" :value="field.value">{{ field.label }}</option>
      </select>

      <label for="sort-order-select">Order:</label>
      <select id="sort-order-select" :value="sortOrder" @change="onSortOrderChange">
        <option v-for="order in sortOrders" :key="order.value" :value="order.value">{{ order.label }}</option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.pagination-sort-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #fff;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.pagination {
  display: flex;
  gap: 0.3rem;
  flex-wrap: nowrap;
}

.page-button,
.nav-button {
  padding: 6px 12px;
  border: 1px solid #ccc;
  background-color: white;
  color: #333;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  user-select: none;
  transition: all 0.2s ease;
  min-width: 32px;
  text-align: center;
}

.page-button:hover:not(:disabled),
.nav-button:hover:not(:disabled) {
  background-color: #0077ff;
  color: white;
  border-color: #0077ff;
}

.page-button {
  padding: 6px 12px;
  border: 1px solid #ccc;
  background-color: white;
  color: #333;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  user-select: none;
  transition: all 0.2s ease;
  min-width: 32px;
  text-align: center;
}

.page-button.active {
  background-color: #0077ff;
  color: white;
  border-color: #0077ff;
  cursor: default;
}

.page-button.dots {
  background-color: transparent;
  color: #aaa;
  border-color: transparent;
  cursor: default;
}

.page-button:disabled,
.nav-button:disabled {
  opacity: 0.5;
  cursor: default;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.9rem;
  color: #444;
}

.sort-controls label {
  font-weight: 600;
}

.sort-controls select {
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  outline: none;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  background-color: white;
}

.sort-controls select:hover,
.sort-controls select:focus {
  border-color: #0077ff;
  box-shadow: 0 0 4px rgba(0, 119, 255, 0.4);
}
</style>
