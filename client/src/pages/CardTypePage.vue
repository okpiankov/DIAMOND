<script setup lang="ts">
import { useCartStore } from '@/store/cart';
import axios from 'axios'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import CardMini from '../components/CardMini.vue';

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

//К  title  обращаться .query.title непосредственно в fetchProducts и  watch()
const type = useRoute()
console.log(type.query.type)


const getProducts = async () => {
  isLoading.value = true
  try {
    // const result = await axios.get(`https://5063b1fd5cab69bc.mokky.dev/products?type=${type.query.type}`)
    const result = await axios.get(`${import.meta.env.VITE_BASE_URL}/products/type/${type.query.type}`)
    console.log(result.data)

    products.value = result.data

    // console.log(products.value)
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(getProducts)

watch(() => type.query.type, getProducts)

// Запись данных карточек товаров в Pinia:
const cartStore = useCartStore()

const handleAddItem = (_id: string ) => {
  // Ищу продукт по id  в массиве всех продуктов
  const product = products.value.find((item) => item._id === _id)
  console.log(product)
  if (product) {
    cartStore.add(product)
  } 
}
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
