<script setup lang="ts">
// import products from '../service/data.ts'
import CardMini from '../components/CardMini.vue'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useCartStore } from '../store/cart'


type TypeProducts = [
  {
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
  },
]

const products = ref<TypeProducts | []>([])
const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true
  try {
    
    //Ошибка это динамическая часть`${}` а не статическая ''
    //Обращение к env файлу в VITE такое: import.meta.env.VITE_BASE_URL и обязательно для переменной BASE_URL приписка VITE_
    // const result = await axios.get('import.meta.env.VITE_BASE_URL/products')
    //const result = await axios.get('http://localhost:3333/products')
    const result = await axios.get(`${import.meta.env.VITE_BASE_URL}/products`)
    console.log(result.data)
    products.value = result.data
   
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
})

// Запись данных карточек товаров в Pinia:
const cartStore = useCartStore()

const handleAddItem = (id: string ) => {
  // Ищу продукт по id  в массиве всех продуктов
  const product = products.value.find((item) => item._id === id)
  console.log(product)
  if (product) {
    cartStore.add(product)
  }
}
// console.log('cookie', document.cookie)
</script>

<template>
  <div v-if="isLoading" class="loading">Загрузка...</div>
  <section>
    <CardMini
      v-for="item in products"
      :key="item._id"
      :image="item.image"
      :name="item.name"
      :price="item.price"
      :description="item.description"
      :_id="item._id"
      :quantity="item.quantity"
      @handleAddItem="handleAddItem(item._id)"
      :createdAt="item.createdAt"
      :updatedAt="item.updatedAt"
      :__v="item.__v"
    />
  </section>
</template>

<style scoped lang="scss">
 .loading {
  font-size: 25px;
}
section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 800px) {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>

<!-- // Чтобы увидеть истинное значение во Vue3 в консоли а не прокси объект надо преобразовать!!!
// Но если в сторе в getters: так (state) => state, то нужно дописать .$state!!!
const cartStore = useCartStore()
console.log(JSON.parse(JSON.stringify(cartStore.$state)))

// user@test.com
const authStore = useAuthStore()
//Чтобы увидеть истинное значение во Vue3 в консоли а не прокси объект надо преобразовать!!!
console.log(JSON.parse(JSON.stringify(authStore.user)))

//Как подписаться на изменения в реактивной переменной вне запросов
watch(products.value, (products) => {
  console.log(`Массив карточек: ${products}`)
})
//Просто через деструкторизацию лучше из стора ничего не забирать правильно использовать хук storeToRefs
// const { cart } = storeToRefs(cartStore) -->

<!-- //Запись данных карточек товаров в Pinia:
//В .set() передавать result.data а не реакт.пер. products.value
// const cartStore = useCartStore()
// cartStore.set(result.data) -->


<!-- // //С прокси объектом, без приписки .$state не получится вообще обратиться к стору
// console.log(cartStore.$state)
// //Смотрим чистое значение из стора Pinia без прокси объекта
// console.log(JSON.parse(JSON.stringify(cartStore.$state)))

// const authStore = useAuthStore()
// //authStore.$state.data.fullName  .$state зачем и с ним и без работает...?
// console.log(JSON.parse(JSON.stringify(authStore.data.fullName))) -->

