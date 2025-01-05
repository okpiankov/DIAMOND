<script setup lang="ts">
import { useRouter } from 'vue-router';

const navigate = useRouter()
</script>

<template>
  <div
    class="bg-black rounded-[37px] w-full min-h-[800px] flex flex-col items-center gap-5 overflow-y-auto cursor-pointer  pb-5"
    @click="navigate.push('/')"
  >
    <div class="mt-5 ml-5 text-2xl text-white">Ваш заказ оформлен!</div>
    <div class="ml-5 text-2xl text-white">Скоро мы свяжемся с вами по оплате</div>
    <div class="flex justify-center max-w-[500px]">
      <img src="/basket_full.webp" alt="Info image" class="size-48 rounded-3xl" />
    </div>
  </div>
</template>

