<script setup lang="ts">
import axios from 'axios'
import { onMounted, reactive, ref } from 'vue'
import { Pencil } from 'lucide-vue-next'

type TypeUserCreate = 
  {
   fullName: string
   email: string
   password: string | Date
   phone: string
   role: string
  }

type TypeUsers = [
  {
    fullName: string
    email: string
    phone: number
    _id: string
    // role: string
    // password: string
  },
]
const today = new Date();

const initialState = { fullName: '', email: 'user@test.com', password: today, phone: '', role: 'client'  }
// Создание реактивного объекта
const formData = reactive<TypeUserCreate>({ ...initialState })

// Функция для сброса формы
function resetForm() {
  Object.assign(formData, initialState)
}
// Добавление пользователя использую тот же роут сервера что и при регистрации
const addUsers = async () => {
  try {
    const result = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/register`, 
      formData
    )
    console.log(result.data)
    await getUsers()
    
  } catch (error) {
    console.log(error)
  }
}

const users = ref<TypeUsers | []>([])
const isLoading = ref(false)

//Для рендера всех пользователей
const getUsers = async () => {
  isLoading.value = true
  try {
    const result = await axios.get(`${import.meta.env.VITE_BASE_URL}/users`)
    console.log(result.data)
    users.value = result.data
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
onMounted(getUsers)
</script>

<template>
  <div class="section">
    <div class="sectionAdd">
      <div class="title">Добавление пользователя</div>

  
      <div>Форма создания пользователя</div>
      <form @submit.prevent="">
        <!-- <label
        >Ссылка на изображение
        <input type="text" placeholder="Введите url" v-model="formData.image" />
      </label> -->

        <label
          >Имя пользователя
          <input type="text" placeholder="Введите имя пользователя" v-model="formData.fullName" />
        </label>
        <label
          >Email
          <input
            type="text"
            placeholder="Введите еmail"
            v-model="formData.email"
          />
        </label>
        <label
          >Номер телефона
          <input type="tel" placeholder="Введите номер телефона" v-model="formData.phone" />
        </label>

        <button
          @click="
            addUsers();
            resetForm()
          "
        >
          Добавить пользователя
        </button>
      </form>
    </div>
    <div class="sectionEdit">
      <div class="title">Редактирование пользователя</div>
      <div className="header">
        <div>Имя</div>
        <div>Еmail</div>
        <div>Телефон</div>
      </div>
      <ul>
        <li v-for="item in users" :key="item._id">
          <div>{{ item.fullName }}</div>
          <div>{{ item.email }}</div>
          <div>{{ item.phone }}</div>
          <RouterLink :to="`/admin/users${item._id}`">
            <Pencil class="pencil" />
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.section {
  display: flex;
  flex-direction: row;
  margin-top: 50px;
  width: 100%;
  height: 100%;
  gap: 10px;
  @media (max-width: 1700px) {
    flex-direction: column;
  }
  .title {
    font-size: 20px;
    color: #fca3a3;
  }
  .sectionAdd {
    color: white;
    height: auto;
    width: 450px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: 20px;
    text-indent: 20px;
    margin-top: 10px;
    form {
      height: auto;
      padding-top: 10px;
      padding-bottom: 10px;
      width: 450px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 10px;
      border: 1px solid #fca3a3;
      border-radius: 20px;
      @media (max-width: 440px) {
        width: 320px;
      }
      label {
        color: white;
        font-size: 18px;
      }
      input {
        height: 40px;
        width: 400px;
        color: black;
        border: 1px solid #fca3a3;
        background-color: #fca3a3;
        font-size: 20px;
        padding-left: 10px;
        display: block;
        @media (max-width: 440px) {
          width: 280px;
        }
        &:focus {
          outline-color: #ea4335;
          background-color: white;
        }
      }
      select {
        height: 40px;
        width: 400px;
        color: black;
        border: 1px solid #fca3a3;
        background-color: #fca3a3;
        font-size: 20px;
        padding-left: 10px;
        display: block;
      }
      button {
        height: 40px;
        width: 400px;
        border-radius: 20px;
        border: 2px solid white;
        background-color: #fca3a3;
        font-size: 22px;
        @media (max-width: 440px) {
          width: 280px;
        }
        &:hover {
          //   border-color: black;
          background-color: white;
          color: black;
        }
      }
    }
  }
  .sectionEdit {
    display: flex;
    flex-direction: column;
    // justify-content: center;
    // align-items: center;
    gap: 10px;
    border: 1px solid #fca3a3;
    border-radius: 20px;
    padding-top: 10px;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
    color: white;
    @media (max-width: 1700px) {
      width: 800px;
    }
    .title {
      font-size: 20px;
      color: #fca3a3;
    }
    .header {
      height: 30px;
      display: flex;
      justify-content: flex-start;
      gap: 15px;
      border-bottom: 1px solid white;
      div {
        width: 170px;
      }
    }
    ul {
      padding: 0;
      margin: 0;
      height: auto;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      gap: 15px;
      li {
        display: flex;
        align-items: center;
        gap: 15px;
        height: auto;
        width: 100%;
        border-bottom: 1px solid white;

        div {
          width: 170px;
        }
        .pencil {
          &:hover {
            color: #fca3a3;
          }
        }
      }
    }
  }
}
</style>