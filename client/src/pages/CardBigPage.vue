<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '../store/cart'
// import { handleAddItemId } from '../service/localStorage'

type TypeProduct = {
  image: string[]
  type: string
  name: string
  price: number
  description: string
  _id: string
  quantity: number
  createdAt: string
  updatedAt: string
  __v: number
}

const _id = useRoute().params.id
console.log(_id)

const product = ref<TypeProduct>({
  image: [],
  type: '',
  name: '',
  price: 0,
  description: '',
  _id: '',
  quantity: 1,
  createdAt: '',
    updatedAt: '',
  __v: 0
})
const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true
  try {
    const result = await axios.get(`${import.meta.env.VITE_BASE_URL}/products/${_id}`)
    // console.log(result.data)

    product.value = result.data

    // console.log(product.value.image[0])
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
})

// Запись данных карточки товаров в Pinia  @click="cartStore.add(product)":
const cartStore = useCartStore()

// const handleAddItemId = (product: TypeProduct | null) => {
//     cartStore.add(product)
// }

</script>

<template>
  <div v-if="isLoading" class="text-[25px]">Загрузка...</div>
  <div
    class="w-[1000px] min-h-[700px] flex flex-row bg-white border border-red-300 border-solid rounded-[37px] ml-3 mt-3 mr-3 mb-24 m:flex-col m:w-[650px] 2s:w-[500px] s:w-[300px] s:h-full"
  >
    <img
      :src="product?.image[0]"
      alt="image"
      class="size-[700px] items-center object-cover rounded-[37px] m:size-[600px] 2s:size-[400px] s:size-[300px]"
    />

    <div
      class="flex flex-col justify-start text-xl h-full pt-5 pb-5 pr-5 gap-5 m:gap-2 m:pl-5 m:pt-0"
    >
      <strong>{{ product?.name }}</strong>
      <div>Цена: {{ product?.price }} руб.</div>
      <div class="text-lg">
        {{ product?.description }}<br />
        DIAMOND – международный ювелирный бренд, представленный на рынках СНГ, Европы, Ближнего
        Востока, Азии и Америки. В центре внимания бренда – совершенство его произведений и принципы
        высочайшего качества.
      </div>

      <div class="w-3/5 flex flex-col gap-2 text-lg">
        <div>Размеры, мм</div>
        <div class="w-[150px] grid grid-cols-3 gap-2">
          <div class="size">16,5</div>
          <div class="size">17</div>
          <div class="size">17,5</div>
          <div class="size">18</div>
          <div class="size">18,5</div>
          <div class="size">19</div>
        </div>
      </div>
      <button
        @click="cartStore.add(product)"
        class="max-w-[260px] h-[50px] bg-red-300 border-2 border-red-300 border-solid rounded-3xl cursor-pointer text-white text-2xl hover:border-black hover:text-black"
      >
        Добавить в корзину
      </button>
    </div>
  </div>
</template>

<!-- <template>
  <div class="card">
   
    <img :src="product?.image" alt="image" />

    <div class="info">
      <strong>{{ product?.name }}</strong>
      <div>Цена: {{ product?.price }} руб.</div>
      <div class="description">
        {{ product?.description }}<br />
        DIAMOND – международный ювелирный бренд, представленный на рынках СНГ, Европы, Ближнего
        Востока, Азии и Америки. В центре внимания бренда – совершенство его произведений и принципы
        высочайшего качества.
      </div>
      <div class="sizes">
        <div>Размеры, мм</div>
        <div class="sizeBox">
          <div class="size">16,5</div>
          <div class="size">17</div>
          <div class="size">17,5</div>
          <div class="size">18</div>
          <div class="size">18,5</div>
          <div class="size">19</div>
        </div>
      </div>
      <button>Добавить в корзину</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  width: 1000px;
  min-height: 700px;
  display: flex;
  flex-direction: row;
  background-color: white;
  border: 1px solid #fca3a3;
  border-radius: 37px;
  margin: 10px 10px 90px 10px;

  @media (max-width: 1150px) {
    flex-direction: column;
  }

  img {
    width: 700px;
    height: 700px;
    align-items: center;
    object-fit: cover;
    border-radius: 37px;

    @media (max-width: 1150px) {
      width: 600px;
      height: 600px;
    }
  }
  .info {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 25px;
    padding: 20px 20px 20px 0px;
    // background-color: #bcdff8;
    font-size: 20px;

    @media (max-width: 1150px) {
      gap: 10px;
      height: 100%;
      padding: 0 30px 30px 30px;
    }
    .description {
      font-size: 18px;
    }

    .sizes {
      // border: #000000 solid 1px;
      width: 70%;
      display: flex;
      flex-direction: column;
      gap: 10px;
      font-size: 18px;
      .sizeBox {
        width: 150px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);

        gap: 10px;
        .size {
          height: 40px;
          width: 40px;
          border: #fca3a3 solid 2px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          &:hover {
            border-color: black;
          }
        }
      }
    }

    button {
      max-width: 260px;
      height: 50px;
      font-size: 22px;
      border-radius: 20px;
      border: 1px solid #fca3a3;
      background-color: #fca3a3;
      color: white;
      font-weight: 700;

      &:hover {
        color: black;
        border-color: black;
      }
    }
  }
}
</style> -->


<!-- // // Запись данных карточек товаров в Pinia:
// // Обязательно прописывать  .$state!!!

// const cartStore = useCartStore()
// const prevArrayItems = cartStore.$state.cart
// // console.log(prevArrayItems);

// const handleAddItemId = () => {
//   if (!prevArrayItems) {
//     const item = [{ ...product.value, quantity: 1 }]
//     cartStore.set(item)
    
//     return
//   }
//   // console.log(prevArrayItems);

//   const ItemInPrevArray = prevArrayItems.find((item) => item.id === product.value?.id)
//   // console.log(ItemInPrevArray);

//   if (ItemInPrevArray) {
//     return
//   }
//   const item = [...prevArrayItems, { ...product.value, quantity: 1 }]
//   cartStore.set(item)
// }

//Почему то не надо подписываться на id в отличии от react useEffect
// watch(id, () => {
//   функция_запроса(id)
// }) -->