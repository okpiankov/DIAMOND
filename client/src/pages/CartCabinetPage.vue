<script setup lang="ts">
import CartItem from '../components/CartItem.vue'
import InfoBlock from '../components/InfoBlock.vue'
import { useCartStore } from '../store/cart'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import axios from 'axios'
import { storeToRefs } from 'pinia'

//Подписка на товары из Pinia
//Все данные для корзины беру сразу из стора Pinia тк они уже туда записаны
//Использую storeToRefs для получения(подписки) реактивных данных из Pinia
//Обращаюсь к state cart в разных ситуациях либо просто cart или cart.value
const authStore = useAuthStore()
const cartStore = useCartStore() 
const { cart, total_cost } = storeToRefs(cartStore)

// Функция удаления товара из корзины и Pinia
// Почти вся логика функций удаления и изменения количества товара ушла в стор Pinia
const handlelDeleteClick = (_id: string) => {
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

const isLoading = ref(false)
const formData = reactive({
  pay: '',
  delivery: '',
})

const navigate = useRouter()

//Так делать не надо:
// const authStore = useAuthStore()
// //Передаю токен в header запроса чтобы на сервере расшифровать токен и выполнить проверку на этом роуте
// const token = authStore.$state.token
// const headers = { authorization: `Bearer ${token}` };
// console.log('headers', headers)
const logOut = (err: string) => {
  if(err) {
  authStore.clear()
  navigate.push({ name: 'home' })}
}

//Cоздание заказа
const orderSet = async () => {
  isLoading.value = true
  try {
    //Формирую массив из объектов в которых присутствуют только необходимые поля
    const arrayProducts = cart.value.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }))
    // console.log(arrayProducts);

    const arrayOrder = {
      // Указываю id user в таком формате: user_id для связи покупателя именно его заказами
      user: authStore.$state._id,
      ...formData,
      total_price: total_cost.value,
      goods: [...arrayProducts],
    }
    const result = await axios.post(`${import.meta.env.VITE_BASE_URL}/orders/create`, arrayOrder, {
      withCredentials: true,
    })
    console.log(result.data)

  } catch (error: Error) {
    console.log(error)
    logOut(error.response?.data?.message)

  } finally {
    // isLoading.value = false
    navigate.push('ordersCabinetPage')
  }
}

</script>

<template>
  <section
    class="w-full h-full flex flex-col gap-5 pb-5 text-xl overflow-y-auto s:w-[310px] s:items-center"
  >
    <div class="text-2xl text-white mt-5 ml-5">Моя корзина</div>
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

    <div v-if="cart.length === 0" class="flex flex-col gap-5 text-white indent-5 text-[22px]">
      <InfoBlock
        title="Корзина пустая"
        description="Добавьте вашу мечту"
        image="/basket_empty.jpg"
      />
    </div>

    <!-- Карта оформления заказа  -->
    <div class="mb-4 max-w-[370px] s:w-[310px]">
      <div class="flex justify-start gap-4 text-[22px] text-white">
        <div>Итого:</div>
        <div>{{ total_cost }} руб.</div>
      </div>
      <form @submit.prevent="" class="flex flex-col gap-3 mt-3">
        <select
          name="pay"
          v-model="formData.pay"
          class="bg-red-300 h-[40px] border-2 border-white border-solid outline-none active-outline-color-red"
        >
          <option disabled value="">Выберите способ оплаты:</option>
          <option>Карта</option>
          <option>Наличные</option>
          <option>Счет</option>
        </select>

        <select
          name="delivery"
          v-model="formData.delivery"
          class="bg-red-300 h-[40px] border-2 border-white border-solid outline-none"
        >
          <option disabled value="">Выберите способ доставки:</option>
          <option>Самовывоз</option>
          <option>СДЭК</option>
        </select>

        <button
          @click="
            orderSet();
            cartStore.clear()
          "
          class="w-ful h-[50px] bg-red-300 border-2 border-white border-solid rounded-3xl cursor-pointer text-white text-2xl hover:border-black hover:text-black"
        >
          Оформить заказ
        </button>
      </form>
    </div>
  </section>
</template>

<!-- <template>
  <section>
    <div class="title">Мои заказы</div>
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
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-size: 20px;
  padding-bottom: 20px;
  
  //   background-color: white;
  // color: white;

  .title {
    margin: 20px 0px 0px 20px;
    font-size: 25px;
    color: white;
  }
  .InfoBlock {
    display: flex;
    flex-direction: column;
    gap: 20px;
    color: white;
    text-indent: 20px;
  }

  .totalPrice {
    display: flex;
    gap: 20px;
    color: white;
    text-indent: 20px;
  }
  button {
    max-width: 370px;
    height: 50px;
    background-color: #fca3a3;
    border: white 2px solid;
    border-radius: 20px;
    // color: white;
    font-weight: 700;
    font-size: 22px;
    cursor: pointer;
    &:hover {
      color: black;
      border-color: black;
      background-color:white;
    }
  }
}
</style> -->
