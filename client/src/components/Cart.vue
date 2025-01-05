<script setup lang="ts">
import { CircleX } from 'lucide-vue-next'
import { inject, reactive, ref } from 'vue'
import CartItem from './CartItem.vue'
import InfoBlock from './InfoBlock.vue'
import { useCartStore } from '../store/cart'
import { storeToRefs } from 'pinia'
import axios from 'axios'
import { useRouter } from 'vue-router'

type TypeUserCreate = 
  {
   fullName: string
   email: string
   password: string | Date
   phone: string
   role: string
  }
const drawerCart = inject('drawerCart')

//Подписка на товары из Pinia
//Все данные для корзины беру сразу из стора Pinia тк они уже туда записаны
//Использую storeToRefs для получения(подписки) реактивных данных из Pinia
//Обращаюсь к state cart в разных ситуациях либо просто cart или cart.value
const cartStore = useCartStore() 
const { cart, total_cost } = storeToRefs(cartStore)
// console.log(cart)

// Функция удаления товара из корзины и Pinia
// Почти вся логика функций удаления и изменения количества товара ушла в стор Pinia
const handlelDeleteClick = (_id: string ) => {
  cartStore.delete(_id)
}

// Функция увеличения и уменьшения колличества товара в корзине и Pinia
const handlelQuantityClick = (_id: string, action: string) => {
  if (action === 'add') {
    cartStore.increment(_id)
  } else {
    cartStore.decrement(_id)
  }
}
const navigate = useRouter()
const isLoading = ref(false)

//Временно использую дату как рандомный пароль
const today = new Date();
// console.log(today)

const formData = reactive<TypeUserCreate>({
  fullName: '',
  phone: '',
  email: '',
  role: 'client',
  password: today,
})

const total_price =  ref(total_cost.value)
console.log('total_price', total_price.value)

//Одновременно  регистрация нового покупателя и оформление заказа
const orderSet = async () => {
  isLoading.value = true
  try {
    //Формирую массив из объектов в которых присутствуют только необходимые поля
    const arrayProducts = cart.value.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }))
    console.log('arrayProducts', arrayProducts)

     const user = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/register`, formData)
     console.log('user', user)

    const arrayOrder =  {
      //После регистрации нового покупателя сразу получаю его id и привязываю к заказу
      user: user.data._id,
      total_price: total_price.value,
      goods: [...arrayProducts],
      pay: '',
      delivery: '',
    }
    
    const result = await axios.post(`${import.meta.env.VITE_BASE_URL}/orders/create`, arrayOrder)
    console.log('order', result)

  } catch (error) {
    console.log(error)
  } finally {
    // isLoading.value = false
    navigate.push('/ordersPage')
  }
}
</script>

<template>
  <div
    class="fixed top-0 left-0 w-full h-full bg-black opacity-60 z-10 cursor-pointer"
    @click="drawerCart = !drawerCart"
  ></div>
  <section
    class="showRight w-[440px] h-full bg-red-200 fixed top-0 right-0 z-20 flex flex-col pt-12 pl-5 pr-5 gap-5 text-xl overflow-y-auto s:w-[340px] s:pl-2"
  >
    <div class="flex items-center gap-20 mb-5 text-xl font-extrabold">
      <CircleX @click="drawerCart = !drawerCart" />
      <div>КОРЗИНА</div>
    </div>
    <CartItem
      v-for="item in cart"
      :key="item._id"
      :name="item.name"
      :price="item.price"
      :image="item.image"
      :description="item.description"
      :quantity="item.quantity"
      :_id="item._id"
      @handlelDeleteClick="handlelDeleteClick"
      @handlelQuantityClick="handlelQuantityClick"
      :createdAt="item.createdAt"
      :updatedAt="item.updatedAt"
      :__v="item.__v"  
    />

    <div v-if="cart.length === 0" class="gap-5 text-[22px]">
      <InfoBlock
        title="Корзина пустая"
        description="Добавьте вашу мечту"
        image="/basket_empty.jpg"
      />
    </div>

    <!-- Карта оформления заказа  -->
    <div class="mb-4">
      <div class="flex justify-start gap-4 text-[22px]">
        <div>Итого:</div>
        <div>{{ total_cost }} руб.</div>
      </div>
      <form @submit.prevent="" class="flex flex-col gap-3 bg-red-200 mt-3">
        <input
          v-model="formData.fullName"
          type="text"
          placeholder="Введите ваше имя"
          class="bg-red-300 h-[40px] border-2 border-white border-solid outline-none pl-1"
        />

        <input
          v-model="formData.phone"
          type="text"
          placeholder="Введите ваш телефон"
          class="bg-red-300 h-[40px] border-2 border-white border-solid outline-none pl-1"
        />

        <input
          v-model="formData.email"
          type="text"
          placeholder="Введите ваш email"
          class="bg-red-300 h-[40px] border-2 border-white border-solid outline-none pl-1"
        />
        <button
          @click="
            orderSet();
            drawerCart = !drawerCart;
            cartStore.clear()
          "
          type="submit"
          class="w-ful h-[50px] bg-red-300 border-2 border-white border-solid rounded-3xl cursor-pointer text-white text-2xl hover:border-black hover:text-black"
        >
          Оформить заказ
        </button>
      </form>
    </div>
  </section>
</template>

<style scoped lang="scss">
.showRight {
  position: fixed;
  animation: showRight 0.8s;
  transition: animation 0.5s ease-in-out;
  z-index: 31;
}
@keyframes showRight {
  from {
    right: -100%;
  }
  to {
    right: 0;
  }
}
</style>

<!-- <template>
  <div class="overlay" @click="drawerCart = !drawerCart"></div>
  <section>
    <div class="cart">
      <CircleX @click="drawerCart = !drawerCart" />
      <div>КОРЗИНА</div>
    </div>
    <CartItem />
    <CartItem />

    <div class="InfoBlock">
      <InfoBlock
        title="Корзина пустая"
        description="Добавьте вашу мечту"
        image="/basket_empty.jpg"
      />

      <InfoBlock
        title="Заказ оформлен!"
        :description="`Ваш заказ ${id} скоро будет передан курьерской службе`"
        image="/basket_full.webp"
      />
    </div>

    <div class="totalPrice">
      <span> Итого:</span>
      <b> totalPrice руб.</b>
    </div>
    <button>Оформить заказ</button>
  </section>
</template>

<style scoped lang="scss">
section {
  width: 440px;
  height: 100%;
  background-color: #ffc4c4;
  position: fixed;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 48px;
  padding-left: 20px;
  padding-right: 20px;
  z-index: 22;
  font-size: 20px;

  .cart {
    display: flex;
    align-items: center;
    gap: 80px;
    font-size: 20px;
    font-weight: 800;
    margin-bottom: 20px;
  }
  .totalPrice {
    display: flex;
    gap: 20px;
  }
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  opacity: 0.6;
  z-index: 12;
  cursor: pointer;
}
button {
  width: 100%;
  height: 50px;
  background-color: #fca3a3;
  border: white 2px solid;
  border-radius: 20px;
  color: white;
  font-weight: 700;
  font-size: 22px;
  cursor: pointer;
  &:hover {
    color: black;
    border-color: black;
  }
}
</style> -->

<!-- // Дополнительная локальная реактивная переменная не нужна тк все данные для корзины беру из Pinia
   // const itemsCart = ref<TypeCart[]>([]) 
// itemsCart.value = cart
// itemsCart.value = cartStore.$state.cart
// console.log(cart)

// watch(
//  cart,
//   (cart) => {
//     itemsCart.value = cart
//   }, { deep: true, immediate: true } 
// )

//Подписка на товары из Pinia обязательно нужно возвращать стор () => cartStore.$state.cart и { immediate: true }
// watch(
//   () => cartStore.$state.cart,
//   () => {
//     itemsCart.value = cartStore.$state.cart
//   },
//   { deep: true, immediate: true },
// ) -->
