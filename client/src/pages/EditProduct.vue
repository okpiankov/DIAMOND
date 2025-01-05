<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Trash2 } from 'lucide-vue-next'

type TypeProduct = {
  image: string[]
  type: string
  name: string
  price: number
  description: string
  _id: string
  // quantity: number
  // createdAt: string
  // updatedAt: string
  // __v: number
}
const isLoading = ref(false)
const _id = useRoute().params.id
console.log(_id)

//Промежуточный стейт для хранения ссылки на картинку на сервере не нужен!
//const stateUrl = ref('')

const product = ref<TypeProduct>({
  image: [],
  type: '',
  name: '',
  price: 0,
  description: '',
  _id: '',
  // quantity: 1,
  // createdAt: '',
  // updatedAt: '',
  // __v: 0,
})
console.log(product.value.image)

const fileInput = ref<HTMLInputElement | null>(null)
const files = ref()

function handleFileChange() {
  // files.value = fileInput.value?.files?[0]
  files.value = fileInput.value?.files?.[0]
}
const fileFormData = new FormData()

//имя 'image' такое же как на сервере в multer
function addFile() {
  const file = files.value
  console.log('files.value', file)
  fileFormData.append('image', file)
}

//Загружаю картинку на сервер получаю ссылку на url и сразу же добавляю ссылку в 1 общий стейт
const addImage = async () => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/upload`, fileFormData, {
      withCredentials: true,
    })
    console.log('response url', response.data)

    //Промежуточный стейт не нужен push сразу в 1 общий стейт добавляю ссылку
    product.value.image.push(response.data.url)
  } catch (error) {
    console.log(error)
  }
}

//Получение продукта по id
const getProduct = async () => {
  isLoading.value = true
  try {
    const result = await axios.get(`${import.meta.env.VITE_BASE_URL}/products/${_id}`)
    console.log(result.data)
    product.value = result.data
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
onMounted(getProduct)

//Обновление продукта итоговый запрос на сервер
const updateProduct = async () => {
  isLoading.value = true
  try {
    //Не забывай дописывать  value в объекте на отправку product.value
    const result = await axios.patch(`${import.meta.env.VITE_BASE_URL}/admin/products/update`, product.value, {
      withCredentials: true,
    })
    console.log(result)
    await getProduct()
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

const navigate = useRouter()
//Удаление продукта
const deleteProduct = async () => {
  isLoading.value = true
  try {
    const result = await axios.delete(`${import.meta.env.VITE_BASE_URL}/admin/products/delete/${_id}`, {
      withCredentials: true,
    })
    console.log(result.data)

    await navigate.push({ name: 'editProducts' })
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
//2 запроса на удаление файла(картинки) из папки uploads на сервере и картинки из [] картинок в админке
const deleteImage = async (item: string) => {
  try {
    const newImageList = product.value.image.filter((image) => item !== image)
    console.log('newImageList', newImageList)

    //Запрос на удаление картинки из массива картинок в админке
    //через axios.patch а не axios.delete!
    const result = await axios.patch(
      `${import.meta.env.VITE_BASE_URL}/admin/products/updateImage/${_id}`,
      {
        image: newImageList,
        name: product.value.name,
        description: product.value.description,
        price: product.value.price,
        type: product.value.type,
        _id: product.value._id,
      },
      {
        withCredentials: true,
      },
    )
    console.log(result.data)
    await getProduct()

    //Из item(это ссылка на картинку) достаю basename - это имя картинки в конце url
    //basename- заместо id, идентификатор
    const name = (item: string) => {
      return item.split('/').reverse()[0]
    }
    const basename = name(item)
    console.log('basename', basename)

    //Запрос на удаление файла из папки uploads на сервере
    const data = await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/upload/delete/${basename}`,
      // { basename: basename(item), },
      {
        withCredentials: true,
      },
    )
    console.log(data.data)
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div class="wrapper">
    <span>Редактирование продукта</span>

    <form @submit.prevent="" class="formFile">
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
          addImage()
        "
      >
        Добавить изображение
      </button>
    </form>

    <form @submit.prevent="" noValidate class="formEdit">
      <label class="label"
        >Наименование продукта
        <input type="text" name="name" placeholder="Наименование продукта" v-model="product.name" />
      </label>

      <label class="label"
        >Описание продукта
        <input
          type="text"
          name="name"
          placeholder="Описание продукта"
          v-model="product.description"
        />
      </label>
      <label class="label"
        >Стоимость продукта
        <input type="text" name="name" placeholder="Стоимость продукта" v-model="product.price" />
      </label>
      <!-- <label class="label"
        >Ссылка на изображение
        <input
          type="text"
          name="name"
          placeholder="Ссылка на изображение"
          v-model="product.image"
        />
      </label> -->
      <label
        >Тип продукта
        <!-- <input type="text" placeholder="Введите тип: rings/earrings/bracelets/chains" v-model="formData.type" /> -->
        <select v-model="product.type">
          <option>Выбирете тип</option>
          <option value="rings">rings</option>
          <option value="earrings">earrings</option>
          <option value="bracelets">bracelets</option>
          <option value="chains">chains</option>
        </select>
      </label>

      <button @click="updateProduct()" class="buttonEdit">
        {{ isLoading ? 'Сохраняю...' : 'Сохранить' }}
      </button>
      <button @click="deleteProduct()" class="buttonEdit buttonDelete">Удалить товар</button>
    </form>

    <div class="sectionEdit">
      <div class="title">Редактирование картинок в продукте</div>

      <div class="header">
        <div>Ссылка на изображение</div>
        <div>Внешний вид</div>
      </div>
      <!-- class="size-[100px] border-solid rounded-3xl items-center object-cover" -->
      <ul>
        <li v-for="(item, index) in product.image" :key="index">
          <div>{{ item }}</div>
          <img :src="item" alt="picture" class="image" />
          <Trash2 class="pencil" @click="deleteImage(item)" />
        </li>
      </ul>
    </div>
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
      color: white;
      border: 1px solid #fca3a3;
      background-color: black;
      // font-size: 20px;
      padding-left: 10px;
      display: block;
      @media (max-width: 440px) {
        width: 280px;
      }
      // &:focus {
      //   outline-color: #ea4335;
      //   background-color: white;
      // }
    }
    button {
      height: 40px;
      width: 400px;
      border-radius: 20px;
      border: 1px solid white;
      background-color: black;
      // font-size: 22px;
      @media (max-width: 440px) {
        width: 280px;
      }
      &:hover {
        //   border-color: black;
        background-color: #fca3a3;
        color: black;
      }
    }
  }

  .formEdit {
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

.sectionEdit {
  display: flex;
  flex-direction: column;
  width: 700px;
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
      width: 300px;
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
        width: 300px;
        overflow-wrap: break-word;
      }
      .image {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 10px;
        margin-bottom: 10px;
        align-items: center;
      }
      .pencil {
        &:hover {
          color: #fca3a3;
        }
      }
    }
  }
}
</style>
