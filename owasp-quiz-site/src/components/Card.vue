<template>
  <div class="card" @click="emit('toggle', item.id)">
    <h2>{{ item.title }}</h2>
    <p v-if="activeCard === item.id">{{ item.desc }}</p>
  </div>
</template>

<script setup>
defineProps({
  item: Object,
  activeCard: Number,
})
const emit = defineEmits(['toggle'])
</script>

<style scoped>
.card {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;
  background: #fff;
}
.card:hover {
  background: #f5f5f5;
}
.card p {
  margin-top: 0.5rem;
  color: #555;
}
</style>
