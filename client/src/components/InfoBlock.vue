<script setup lang="ts">
defineProps({
  title: String,
  description: String,
  image: String,
})
</script>

<template>
  <div class="flex flex-col gap-7">
    <img :src="image" alt="Info image" class="size-48 rounded-3xl" />
    <div>{{ title }}</div>
    <div>{{ description }}</div>
  </div>
</template>


<!-- <template>
  <div>
    <img :src="image" alt="Info image" />
    <div>{{ title }}</div>
    <div>{{ description }}</div>
  </div>
</template>

<style scoped lang="scss">
div {
  display: flex;
  flex-direction: column;
  gap: 30px;
  img {
    height: 200px;
    width: 200px;
    border-radius: 35px;
  }
}
</style> -->
