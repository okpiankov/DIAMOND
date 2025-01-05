<script setup lang="ts">
import { Gem } from 'lucide-vue-next'

type TypeProducts = {
  image: string[]
  name: string
  price: number
  description: string
  _id: string
  quantity: number
  createdAt: string
  updatedAt: string
  __v: number
}

const props = defineProps<TypeProducts>()
const emit = defineEmits(['handleAddItem'])

</script>

<template>
  <div
    class="w-[320px] h-[410px] flex flex-col gap-2 border-1 bg-white shadow-inner *:shadow-[0_25px_100px_#fca3a3] border-red-300 border-solid rounded-3xl p-[10px] m-[10px] leading-5 transition duration-500 ease-out transform hover:-translate-y-2 hover:shadow-[0_10px_30px_#f88686] text-lg"
  >
    <!-- Динамический маршрут -->
    <RouterLink :to="`/${props._id}`">
      <img 
        :src="props.image[0]"
        alt="picture"
        class="size-[250px] ml-5 border-solid rounded-3xl items-center object-cover cursor-pointer"
      />

      <strong class="leading-5">{{ props.name }}</strong>
    </RouterLink>

    <div class="h-6">
      <!-- Передача в функцию handleAddItem аргумента id в emit происходит странным образом: -->
      Цена: {{ props.price }} руб.<Gem
        @click="emit('handleAddItem', props._id)"
        class="size-[25px] text-violet-400 relative left-[255px] bottom-[25px] cursor-pointer hover:scale-150 hover:rotate-[360deg] transition-all duration-500 hover:text-violet-600"
      />
    </div>

    <div class="description s:text-[14px] s:leading-3" >{{ props.description }}</div> 
  </div>
</template>

<!-- <template>
   
  <div class="card transition-all duration-300 ">
    Динамический маршрут:
    <RouterLink :to="`/cardBig/${props.id}`"> 
    <img :src="props.image" alt="picture" />
    <strong>{{ props.name }}</strong>
    </RouterLink>
    <div>Цена: {{ props.price }} руб.<Gem class="gem"  /></div>
    <div class="description">{{ props.description }}</div>
  </div>

</template>

<style scoped lang="scss">
.card {
  width: 320px;
  height: 410px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  background-color: white;
  border: 1px solid #fca3a3;
  border-radius: 20px;
  padding: 10px;
  margin: 10px;
  font-size: 18px;
  line-height: 22px;

  box-shadow: inset 0 20px 30px 15px #fca3a3;
  // box-shadow: 0 3px 0 #fca3a3;
  transition: all 0.25s ease-in-out;

  &:hover {
    box-shadow: 0 20px 30px #fca3a3;
    transform: translateY(-5px);
  }

  img {
    border-radius: 20px;
    height: 250px;
    width: 100%;
    align-items: center;
    object-fit: cover;
    cursor: pointer;
  }
  div {
    height: 20px;
  }
  .gem {
    width: 25px;
    height: 25px;
    color: rgb(237, 148, 247);
    position: relative;
    left: 255px;
    bottom: 25px;
   
    cursor: pointer;
    &:hover {
      scale: 1.7;
      color: rgb(230, 0, 255);
      rotate: 360deg;
      transition: rotate 0.38s ease-in-out;
    }
  }
}
</style> -->

<!-- shadow-inner *:shadow-[0_20px_30px_#fca3a3] -->
