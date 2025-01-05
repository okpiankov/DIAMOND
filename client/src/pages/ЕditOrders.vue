<script setup lang="ts">
import axios from 'axios'
import { onMounted, reactive, ref } from 'vue'
import { Pencil, Search, Trash2 } from 'lucide-vue-next'
// import { useAuthStore } from '@/store/auth'
import dayjs from "dayjs";


type TypeProducts = [
  {
    _id: string
    image: string[]
    type: string
    name: string
    price: number
    description: string
    quantity: number
    // createdAt: string
    // updatedAt: string
    // __v: number
  },
]
type TypeUsers = [
  {
    _id: string
    fullName: string
    email: string
    phone: number
  },
]

type TypeGoods = [
  {
    _id: string | ''
    name: string | ''
    price: number | null
    quantity: number | null
  },
]
type TypeOrders = {
  _id: string | ''
  goods: TypeGoods
  user: { _id: string | ''; fullName: string | ''; phone: string | '' }
  total_price: number | null
  phone: string | ''
  pay: string | ''
  delivery: string | ''
  createdAt: string | ''
  // updatedAt: string | ''
  // __v: number | null
}

type TypeOrderCreate = {
  goods: [
    {
      _id: string | ''
      name: string | ''
      price: number 
      quantity: number 
    },
  ]
  user: string | ''
  phone: string | ''
  pay: string | ''
  delivery: string | ''
}

const users = ref<TypeUsers | []>([])
//Получаю всех пользователей
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

const products = ref<TypeProducts | []>([])
const searchQuery = ref('')
//Ищу продукты по названию
const getProducts = async () => {
  isLoading.value = true
  try {
    const result = await axios.get(`${import.meta.env.VITE_BASE_URL}/products/name/${searchQuery.value}`)
    console.log(result.data)
    products.value = result.data
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
// //Подписка на  searchQuery(что ввел в инпут поиска)
// watch(
//   () => searchQuery.value,
//   getProducts,
//   // Магия, ищи сейчас, не лениво:
//   { immediate: true },
// )

const price = ref(0)

//Так делать не надо:
// const authStore = useAuthStore()
// //Передаю токен в header запроса чтобы на сервере расшифровать токен и выполнить проверку на этом роуте
// const token = authStore.$state.token
// const headers = { authorization: `Bearer ${token}` };

const formData = reactive<TypeOrderCreate>({
  goods: [
    {
      _id: '',
      name: '',
      price: 0,
      quantity: 1,
    },
  ],
  user: '',
  phone: '',
  pay: '',
  delivery: '',
})

//Создаю новый заказ
const addOrder = async () => {
  //Логика подсчета общей стоимости с учетом quantity
  const arrayPrices = formData.goods.map((item) => item.price * item.quantity)
  console.log(arrayPrices)
  const result = arrayPrices.reduce((sum, current) => sum + current, 0)
  console.log(result)
  price.value = result
  try {
    const result = await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/orders/create`, {
      total_price: price.value,
      ...formData,
    }, {
      withCredentials: true,
    })
    console.log(result.data)
    await getOrders()

  } catch (error) {
    console.log(error) 
  }
}

const orders = ref<TypeOrders[] | []>([])
const isLoading = ref(false)

//Для рендера всех заказов
const getOrders = async () => {
  isLoading.value = true
  try {
    const result = await axios.get(`${import.meta.env.VITE_BASE_URL}/orders/all`)
    console.log(result.data)
    orders.value = result.data

    //Удаляю заказ из списка с общей стоимостью 0
    const orderDelete = result.data.find((item: TypeOrders) => item.total_price === 0)
    console.log(orderDelete)
      if (orderDelete) {
      deleteOrder(orderDelete._id)
    }

  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
onMounted(getOrders)

const deleteOrder = async (_id: string) => {
  try {
    const result = await axios.delete(`${import.meta.env.VITE_BASE_URL}/admin/orders/delete/${_id}`, {
      withCredentials: true,
    })
    await getOrders()

    console.log(result.data)
  } catch (error) {
    console.log(error)
  }
}

</script>

<template>
  <div class="section">
    <div class="sectionUsers">
      <div class="title">Выбор пользователя для создания заказа</div>
      <button @click="getUsers()">Получить пользователей</button>
      <div className="header">
        <div>Имя пользователя</div>
        <div>Телефон пользователя</div>
        <div>Id пользователя</div>
      </div>
      <ul>
        <li v-for="item in users" :key="item._id">
          <div>{{ item.fullName }}</div>
          <div>{{ item.phone }}</div>
          <div>{{ item._id }}</div>
        </li>
      </ul>
    </div>

    <div class="sectionProducts">
      <div class="title">
        Поиск товаров для создания заказа, варианты: кольцо, серьги, браслет, цепь
      </div>
      <!-- <div v-if="products.length === 0" >Ничего не найдено</div> -->
      <form @submit.prevent="">
        <button @click="getProducts()"><Search /></button>
        <input type="text" placeholder="Поиск" v-model="searchQuery" />
      </form>

      <div className="header">
        <div>Наименование товара</div>
        <div>Id товара</div>
        <div>Cтоимость товара,руб</div>
        <div>Тип товара</div>
      </div>
      <ul>
        <li v-for="item in products" :key="item._id">
          <div>{{ item.name }}</div>
          <div>{{ item._id }}</div>
          <div>{{ item.price }}</div>
          <div>{{ item.type }}</div>
        </li>
      </ul>
    </div>

    <div class="sectionAdd">
      <div class="title">Добавление заказа</div>

      <div>Форма создания заказа<br />Воспользуйтесь данными из форм выше</div>
      <form @submit.prevent="">
        <label
          >Id пользователя
          <input type="text" placeholder="Введите id пользователя" v-model="formData.user" />
        </label>
        <!--v-model+ массив  v-model="formData.goods[index]._id"-->
        <ul>
          <li v-for="(item, index) of formData.goods" :key="item._id">
            <label
              >Id товара входящего в заказ
              <input
                type="text"
                v-model="formData.goods[index]._id"
                placeholder="Введите id товара"
              />
              <!-- {{ item._id }} -->
            </label>
            <label
              >Наименование товара входящего в заказ
              <input
                type="text"
                v-model="formData.goods[index].name"
                placeholder="Введите наименование товара"
              />
              <!-- {{ item.name }} -->
            </label>
            <label
              >Стоимость товара входящего в заказ
              <input
                type="number"
                name="price"
                v-model="formData.goods[index].price"
                placeholder="Введите стоимость товара"
              />
              <!-- {{ item.price}} -->
            </label>
            <label
              >Количество товара входящего в заказ
              <input
                type="number"
                name="quantity"
                v-model="formData.goods[index].quantity"
                placeholder="Введите количество товара"
              />
              <!-- {{ item.quantity}} -->
            </label>
          </li>
        </ul>
        <label
          >Способ доставки
          <select name="delivery" v-model="formData.delivery">
            <option value="Выбирете способ доставки">Выбирете способ доставки</option>
            <option value="Сдэк">Сдэк</option>
            <option value="Самовывоз">Самовывоз</option>
          </select>
        </label>
        <label
          >Способ оплаты
          <select name="pay" v-model="formData.pay">
            <option value="Выбирете способ оплаты">Выбирете способ оплаты</option>
            <option value="Карта">Карта</option>
            <option value="Наличные">Наличные</option>
            <option value="Счет">Счет</option>
          </select>
        </label>
        <button @click="addOrder()">Добавить заказ</button>
      </form>
    </div>
    <div class="sectionEdit">
      <div class="title">Редактирование всех заказов</div>
      <div className="header">
        <div>Id заказа</div>
        <!-- <div>Id владельца заказа</div> -->
        <div>Время и дата создания заказа</div>
        <div>Имя владельца заказа и номер телефона</div>
        <div>Общая стоимость, руб</div>
      </div>

      <ul>
        <li v-for="item in orders" :key="item._id">
          <div>{{ item._id }}</div>
          <!-- <div>{{ item.user._id }}</div> -->
          <div>{{dayjs(item.createdAt).format("H:m /DD MMMM YYYY") }}</div>
          <div>
            {{ item?.user?.fullName }}<br />
            {{ item?.user?.phone }}
          </div>
          <!-- <div>{{ item.goods.map((item) => item.name) }}</div> -->
          <div>{{ item.total_price }}</div>
          <Trash2 class="pencil" @click="deleteOrder(item._id)"  />

          <RouterLink :to="`/admin/orders${item._id}`">
            <Pencil class="pencil" @deleteOrder="deleteOrder(item._id)" />
          </RouterLink>
        </li>
      </ul>

    </div>
  </div>
</template>

<style scoped lang="scss">
.section {
  display: flex;
  flex-direction: column;
  margin-top: 50px;
  width: 100%;
  height: 100%;
  gap: 10px;

  .title {
    font-size: 20px;
    color: #fca3a3;
  }

  .sectionUsers {
    display: flex;
    flex-direction: column;
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
    width: 800px;
    
    button {
      border: white 1px solid;
      border-radius: 7px;
      width: 200px;
      height: 40px;
      background-color: #fca3a3;
      font-size: 18px;
      cursor: pointer;
      color: black;

      &:hover {
        background-color: black;
        color: white;
      }
    }
    .title {
      font-size: 20px;
      color: #fca3a3;
    }

    .header {
      height: 55px;
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
          overflow-wrap: break-word;
        }
        .pencil {
          &:hover {
            color: #fca3a3;
          }
        }
      }
    }
  }

  .sectionProducts {
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
    width: 800px;

    .title {
      font-size: 20px;
      color: #fca3a3;
    }

    form {
      height: auto;
      width: 400px;
      display: flex;
      flex-direction: row;

      button {
        height: 40px;
        width: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: none;
        background-color: #fca3a3;
        // font-size: 19px;
        cursor: pointer;
        color: black;
        &:hover {
          background-color: #fff;
          //  border: 3px solid #fca3a3;
        }
      }
      input {
        height: 40px;
        width: 100%;
        border: none;
        background-color: #fca3a3;
        font-size: 20px;
        padding-left: 10px;
        color: black;
        &:focus {
          outline-color: #ea4335;
          background-color: #ffc4c4;
        }
        &::placeholder {
          font-size: 22px;
        }
      }
    }

    .header {
      height: 55px;
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
          overflow-wrap: break-word;
        }
        .pencil {
          &:hover {
            color: #fca3a3;
          }
        }
      }
    }
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
        display: block;
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
    width: 850px;

    .title {
      font-size: 20px;
      color: #fca3a3;
    }
    .header {
      height: 55px;
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
          overflow-wrap: break-word;
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
