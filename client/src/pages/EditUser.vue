<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
type TypeUser = {
  fullName: string
  email: string
  phone: string
  _id: string
  role: string
  createdAt: string
  updatedAt: string
  __v: 0
  orders: string[]
}

const _id = useRoute().params.id
console.log(_id)

const user = ref<TypeUser>({
  fullName: '',
  email: '',
  phone: '',
  _id: '',
  role: '',
  createdAt: '',
  updatedAt: '',
  __v: 0,
  orders: [],
})
const isLoading = ref(false)

const navigate = useRouter()
const getUser = async () => {
  isLoading.value = true
  try {
    const result = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/${_id}`)
    // console.log(result.data)
    user.value = result.data
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
onMounted(getUser)

const updateUser = async () => {
  const isLoading = ref(false)
  try {
    //Не забывай дописывать  value в объекте на отправку user.value
    const result = await axios.patch(`${import.meta.env.VITE_BASE_URL}admin/users/update`, user.value, {
      withCredentials: true,
    })
    console.log(result)
    await getUser()
  } catch (error) {
    console.log(error)

  } finally {
    isLoading.value = false
  }
}

const deleteUser = async () => {
  const isLoading = ref(false)
  try {
    const result = await axios.delete(`${import.meta.env.VITE_BASE_URL}/admin/users/delete/${_id}`, {
      withCredentials: true,
    })
    console.log(result.data)

    await navigate.push({ name: 'editUsers' })
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
  
}
</script>

<template>
  <!-- <div class="section">
    <div class="title">Данные пользователя</div>
 
  </div> -->
  <div class="wrapper">
    <span>Редактирование пользователя</span>
    <form @submit.prevent="" noValidate>
      <label class="label"
        >Имя пользователя
        <input type="text" name="fullName" placeholder="Имя пользователя" v-model="user.fullName" />
      </label>

      <label class="label"
        >Email
        <input type="text" name="email" placeholder="Введите еmail" v-model="user.email" />
      </label>
      <label class="label"
        >Номер телефона
        <input type="text" name="name" placeholder="Введите номер телефона" v-model="user.phone" />
      </label>

      <button @click="updateUser()" class="buttonEdit">
        {{ isLoading ? 'Сохраняю...' : 'Сохранить' }}
      </button>
      <button @click="deleteUser()" class="buttonEdit buttonDelete">
        Удалить пользователя
      </button>
    </form>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-left: 20px;
  padding-right: 30px;
  width: 700px;
  height: 100%;
  color: white;
  margin-top: 50px;
  padding-bottom: 20px;
  span {
    font-size: 20px;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    input {
      border: white 1px solid;
      background-color: black;
      border-radius: 7px;
      width: 700px;
      height: 40px;
      font-size: 18px;
      padding-left: 10px;

      &:focus {
        outline: none;
        border-color: white;
      }
    }
    select {
      height: 40px;
      width: 700px;
      border-radius: 7px;
      color: white;
      border: 1px solid white;
      background-color: black;
      font-size: 20px;
      padding-left: 10px;
      display: block;
    }
    .buttonEdit {
      border: white 1px solid;
      border-radius: 7px;
      // width: 25%;
      width: 200px;
      height: 40px;
      background-color: black;
      font-size: 18px;
      cursor: pointer;
      color: white;
      &:hover {
        background-color: #fca3a3;
        color: black;
      }
    }
    .buttonDelete {
      margin-top: 70px;
      &:hover {
        background-color: #fca3a3;
        color: black;
      }
    }
  }
}
</style>
