<script setup lang="ts">
import axios from 'axios'
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useIsLoadingStore, useAuthStore } from '../store/auth'
import { storeToRefs } from 'pinia'
import { emailRegex } from '@/service/validate'
import { useCartStore } from '@/store/cart'

// Передача через emit значения реактивной переменной "popUpAuth = !popUpAuth" т.е true
// Все значения(и транзитные и текущие) передаются через 1 emit

const emit = defineEmits(['popUpLoginForm', 'auth'])
// console.log(emit)
const cartStore = useCartStore()
const IsLoadingStore = useIsLoadingStore()
const { isLoading } = storeToRefs(IsLoadingStore)

const authStore = useAuthStore()
const navigate = useRouter()

const formData = reactive({
  email: 'admin@test.com',
  password: '123',
})

//Валидация формы
const errorEmail = computed(() => {
  const isValid = formData.email.match(emailRegex)
  if (!isValid && formData.email !== '') {
    return 'Это не похоже на Email'
  } else {
    return ''
  }
})
const errorPassword = computed(() => {
  if (formData.password.length < 3 && formData.password !== '') {
    return 'Пароль не менее 3 символов'
  }
  return ''
})

//Важно в запросе на клиенте указывать протокол http а не https
const login = async () => {
  IsLoadingStore.set(true)
  try {
    // const result = await axios.post('https://5063b1fd5cab69bc.mokky.dev/auth', formData)
    //axios.defaults.withCredentials = true;
    const result = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/login`, formData, {
      withCredentials: true,
    })
    console.log(result.data)

    if (result.data.role === 'client') {
      navigate.push({ name: 'dataPage' })
    }
    if (result.data.role === 'admin') {
      navigate.push({ name: 'admin' })
    }

    authStore.set(result.data)
    if (result.data.fullName) {
      emit('popUpLoginForm')
    }

    cartStore.clear()
    
  } catch (error) {
    console.log(error)
  } finally {
    IsLoadingStore.set(false)
    // navigate.push({ name: 'dataPage' })
  }
}
</script>

<template>
  <!-- <div class="overlay" @click="popUpLoginForm = !popUpLoginForm"></div> -->
  <div class="overlay" @click="emit('popUpLoginForm')"></div>
  <!-- <img src="/loader.svg" alt="loader" class="loader" width="220" v-if="isLoading" /> -->
  <div v-if="isLoading" class="loading">Загрузка...</div>
  <form v-else @submit.prevent="" class="show">
    <div class="nameError">{{ errorEmail }}</div>
    <input type="email" placeholder="Логин: user@test.com/admin@test.com" v-model="formData.email" />
    <div class="nameError">{{ errorPassword }}</div>
    <input type="password" placeholder="Пароль: 123" v-model="formData.password" />

    <button @click="login()">Войти</button>
    <div @click="emit('auth')">Регистрация</div>
  </form>
</template>

<style scoped lang="scss">
.loading {
  font-size: 27px;
  position: fixed;
  z-index: 50;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  text-align: center;
  margin-top: 20px;
}
form {
  min-height: 245px;
  width: 360px;
  background-color: #000000 0.8;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
  border: 1px solid #fca3a3;
  border-radius: 20px;
  // box-shadow: 0 0 10px 20px #fca3a3;
  padding: 15px;
  position: fixed;
  top: 120px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 18;
  @media (max-width: 440px) {
    width: 320px;
  }
  .nameError {
    color: white;
    font-size: 17px;
    line-height: 1.2;
    display: contents;
  }
  input {
    height: 45px;
    width: 330px;
    border-radius: 20px;
    border: 1px solid #fca3a3;
    background-color: #fca3a3;
    font-size: 20px;
    padding-left: 10px;
    @media (max-width: 440px) {
      width: 280px;
    }
    &:focus {
      outline-color: #ea4335;
      background-color: white;
    }
  }
  button {
    height: 45px;
    width: 100%;
    border-radius: 20px;
    border: 2px solid white;
    background-color: #fca3a3;
    font-size: 20px;
    @media (max-width: 440px) {
      width: 280px;
    }

    &:hover {
      border-color: black;
      background-color: white;
    }
  }
  div {
    font-size: 20px;
    color: rgb(255, 206, 206);
    cursor: pointer;
    &:hover {
      color: white;
    }
  }
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  opacity: 0.8;
  z-index: 8;
  cursor: pointer;
}
.show {
  animation: show 4s;
}
@keyframes show {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
