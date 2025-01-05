<script setup lang="ts">
import Order from '../components/Order.vue'
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/store/auth';
// import { useAuthStore } from '../store/auth'

type TypeGoods = [
  {
    _id: string | ''
    name: string | ''
    price: number | null
    quantity: number | null
  },
]
type TypeOrder = {
  // user: { fullName: string | null; email: string | null; tel: string | null }
  goods: TypeGoods
  _id: string | ''
  user: string | ''
  total_price: number | null
  createdAt: string | ''
    updatedAt: string | ''
  __v: number | null
  phone: string | null
  pay: string | null
  delivery: string | null
}
const authStore = useAuthStore()
//Так делать нельзя:
// //Передаю токен в header запроса чтобы на сервере расшифровать токен и выполнить проверку на этом роуте
// const token = authStore.$state.token
// const headers = { authorization: `Bearer ${token}` };
// // console.log('headers', headers)

const orders = ref<TypeOrder[] | []>([])
const isLoading = ref(false)

//Передаю id пользователя в url и получаю в ответе массив его заказов
onMounted(async () => {
  isLoading.value = true
  try {
    //Как было на mokky.dev
    // Связываю покупателя именно с его заказами через orders?_relations=users  &  user_id на mokky.dev
    // const result = await axios.get(
    //   `https://5063b1fd5cab69bc.mokky.dev/orders?_relations=users&user_id=${authStore.$state._id}`,
    // )
    const result = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/orders?id=${authStore.$state._id}`)
    // console.log(result.data)
    orders.value = result.data
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
})

// //Вариант получения заказов через получение самого пользователя, а у него уже есть  массив всех заказов
// //Получаю пользователя чтобы через populate() вытащить все его заказы из []
// onMounted(async () => {
//   isLoading.value = true
//   try {
//     const result = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/${authStore.$state._id}`)
//     console.log('populate', result.data)
//     // users.value = result.data
//   } catch (error) {
//     console.log(error)
//   } finally {
//     isLoading.value = false
//   }
// })

</script>

<template>
  <div class="mt-5 ml-5 text-2xl text-white s:text-center">Мои заказы</div>
  <div v-if="isLoading" class="text-[25px] text-white ml-5">Загрузка...</div>
  <div v-else-if="orders.length === 0" class="mt-5 ml-5 text-2xl text-white">У вас нет заказов</div>
  <section class="w-full h-full flex flex-col gap-5 mb-5 overflow-y-auto s:items-center">
    <Order
      v-for="order in orders"
      :key="order._id"
      :_id="order?._id"
      :user="order?.user"
      :phone="order?.phone"
      :pay="order?.pay"
      :delivery="order?.delivery"
      :totalPrice="order?.total_price"
      :goods="order?.goods"
    />
    <div class="flex justify-center max-w-[500px]">
      <img
        v-if="orders.length > 0"
        src="/basket_full.webp"
        alt="Info image"
        class="size-48 rounded-3xl"
      />
    </div>
  </section>
</template>

<!-- <template>
  <div class="title">Мои заказы</div>
  <section>
    <Order />
    <Order />
    <Order />
  </section>
</template>

<style scoped lang="scss">
.title {
  margin: 20px 0px 0px 20px;
  font-size: 25px;
  color: white;
}
section {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}
</style> -->
