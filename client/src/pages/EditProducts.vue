<script setup lang="ts">
import axios from 'axios'
import { onMounted, reactive, ref } from 'vue'
import { Pencil } from 'lucide-vue-next'

type TypeProductCreate = {
  image: string[]
  type: string
  name: string
  price: number
  description: string
  quantity: number
}

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

const fileInput = ref<HTMLInputElement | null>(null)
const files = ref()

// Если несколько файлов загрузить то приходит FileList {0: File, 1: File, length: 2}
function handleFileChange() {
  // files.value = fileInput.value?.files?[0]
  files.value = fileInput.value?.files?.[0]
}
const fileFormData = new FormData()

//имя 'image' такое же как на сервере в multer
function addFile() {
  // const file = Object.values(files.value)
  // console.log('files.value', ...file)
  // fileFormData.append('image', ...file)
  const file = files.value
  console.log('files.value', file)
  fileFormData.append('image', file)
}

//Промежуточный стейт для хранения ссылки на картинку на сервере не нужен!
// const stateUrl = ref([])

//Загружаю картинку на сервер получаю ссылку на url и сразу же добавляю в 1 общий стейт
const addImage = async () => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/upload`, fileFormData, {
      withCredentials: true,
    })

    console.log('response url', response.data)

    //Промежуточный стейт не нужен push сразу в 1 общий стейт добавляю ссылку
    formData.image.push(response.data.url)
    // stateUrl.value = response.data.url
  } catch (error) {
    console.log(error)
  }
}

const initialState = { image: [], type: '', name: '', description: '', price: 0, quantity: 1 }
// Создание реактивного объекта
const formData = reactive<TypeProductCreate>({ ...initialState })

// Функция для сброса формы
function resetForm() {
  Object.assign(formData, initialState)
}
// Добавление продукта вместе с полученной ссылкой на картинку из запроса выше
const addProduct = async () => {
  try {
    const result = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/admin/product/create`,
      {
        // image: [stateUrl.value],
        ...formData,
      },
      {
        withCredentials: true,
      },
    )
    console.log(result.data)
    await getProducts()
  } catch (error) {
    console.log(error)
  }
}

const products = ref<TypeProducts | []>([])
const isLoading = ref(false)

//Для рендера всех товаров
const getProducts = async () => {
  isLoading.value = true
  try {
    const result = await axios.get(`${import.meta.env.VITE_BASE_URL}/products`)
    console.log(result.data)
    products.value = result.data
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
onMounted(getProducts)
</script>

<template>
  <div class="section">
    <div class="sectionAdd">
      <div class="title">Добавление продуктов</div>

      <form class="formFile" @submit.prevent="">
          <label
            >Загрузка изображения
            <input
              multiple
              ref="fileInput"
              type="file"
              @change="handleFileChange"
              placeholder="Загрузите изображение"
              name="image"
            />
          </label>

          <button
            @click="
              addFile();
              addImage();
              resetForm()
            "
          >
            Добавить изображение
          </button>
        </form>

      <form class="formCreate" @submit.prevent="">

        <label
          >Название продукта
          <input type="text" placeholder="Введите название продукта" v-model="formData.name" />
        </label>
        <label
          >Описание продукта
          <input
            type="text"
            placeholder="Введите описание продукта"
            v-model="formData.description"
          />
        </label>
        <label
          >Стоимость продукта
          <input type="number" placeholder="Введите стоимость" v-model="formData.price" />
        </label>

        <label
          >Тип продукта
          <!-- <input type="text" placeholder="Введите тип: rings/earrings/bracelets/chains" v-model="formData.type" /> -->
          <select v-model="formData.type">
            <option>Выбирете тип</option>
            <option value="rings">rings</option>
            <option value="earrings">earrings</option>
            <option value="bracelets">bracelets</option>
            <option value="chains">chains</option>
          </select>
        </label>
        <button
          @click="
            addProduct();
            resetForm()
          "
        >
          Добавить товар
        </button>
      </form>

    </div>
    
    <div class="sectionEdit">
      <div class="title">Редактирование продуктов</div>
      <div className="header">
        <div>Наименование</div>
        <div>Описание</div>
        <div>Стоимость, руб</div>
        <div>Тип</div>
      </div>
      <ul>
        <li v-for="item in products" :key="item._id">
          <div>{{ item.name }}</div>
          <div>{{ item.description }}</div>
          <div>{{ item.price }}</div>
          <div>{{ item.type }}</div>
          <RouterLink :to="`/admin/products${item._id}`">
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
    max-height: 560px;
    width: 450px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: 20px;
    text-indent: 20px;
    margin-top: 10px;
    border: 1px solid #fca3a3;
    border-radius: 20px;

    .formFile {
    height: auto;
    padding-top: 10px;
    padding-bottom: 10px;
    width: 450px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    // border: 1px solid #fca3a3;
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
        background-color: white;
        color: black;
      }
    }
  }

    .formCreate {
      height: auto;
      padding-top: 10px;
      padding-bottom: 10px;
      width: 450px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 10px;
      // border: 1px solid #fca3a3;
      // border-radius: 20px;
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
    margin-top: 10px;
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
