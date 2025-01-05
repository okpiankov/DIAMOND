<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const searchQuery = ref('')
const navigate = useRouter()
console.log(navigate)

//Получаю фразу введенную пользователем из инпута,
//формирую из нее url и перенаправляю пользователя на этот url
const handleSubmit = () => {
  if (!searchQuery.value) {
    return
  }
  const url = `/search?title=${searchQuery.value}`
  searchQuery.value = ''
  navigate.push(url)
}
</script>

<template>
  <form @submit.prevent="">
    <button @click="handleSubmit"><Search /></button>
    <input type="text" placeholder="Поиск" v-model="searchQuery" />
  </form>
</template>

<style scoped lang="scss">
form {
  height: 60px;
  width: 260px;
  display: flex;
  flex-direction: row;
  button {
    height: 40px;
    width: 40px;
    border: none;
    border-bottom: black 1px solid;
    background-color: #fca3a3;
    font-size: 19px;
    cursor: pointer;
  }
  input {
    height: 40px;
    width: 100%;
    border: none;
    background-color: #fca3a3;
    border-bottom: black 1px solid;
    font-size: 20px;
    padding-left: 10px;
    &:focus {
      outline-color: #ea4335;
      background-color: #ffc4c4;
    }
    &::placeholder {
      font-size: 22px;
    }
  }
}
</style>
