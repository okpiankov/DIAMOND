<script setup lang="ts">
// import{ Gem } from 'lucide-vue-next'

</script>

<template>
  <div class="box mx-auto">
    <div class="flex justify-center items-center border-b border-b-gray-300 w-[85%] h-[5px]">
      <div class="w-full h-[2px] overflow-x-auto relative rounded-lg shadow-lg z-20">
        <div
          class="absolute inset-0 bg-gradient-to-r from-white to-purple-500 animate-scroll rounded-lg"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.box {
  position: fixed;
  z-index: 4;
  top: 115px;
  width: 100%;
  display: flex;
  justify-content: center;
  @media (max-width: 770px) {
    top: 90px;
  }
  @media (max-width: 440px) {
    top: 90px;
  }
}
.animate-scroll {
  animation: scroll 15s infinite linear forwards;
}
@keyframes scroll {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>
