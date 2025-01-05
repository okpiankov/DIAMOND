<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Trash2 } from 'lucide-vue-next'


type TypeGoods = [
  {
    _id: string | ''
    name: string | ''
    price: number
    quantity: number
  },
]
type TypeOrders = {
  goods: TypeGoods
  _id: string | ''
  user: string | ''
  pay: string | ''
  delivery: string | ''
  // total_price: number | null
  // createdAt: string | ''
  // updatedAt: string | ''
  // __v: number | null
  
}

const _id = useRoute().params.id
console.log(_id)

const order = ref<TypeOrders>({
  goods: [{ _id: '', name: '', price: 0, quantity: 0 }],
  _id: '',
  user: '',
  pay: '',
  delivery: '',
  // total_price: 0,
  // createdAt: '',
  // updatedAt: '',
  // __v: 0,
})

const isLoading = ref(false)

//Получение заказа по id
const getOrder = async () => {
  isLoading.value = true
  try {
    const result = await axios.get(`${import.meta.env.VITE_BASE_URL}/orders/${_id}`)
    console.log(result.data)
    order.value = result.data
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
onMounted(getOrder)
const price = ref(0)

const navigate = useRouter()
//Функция удаления товара из заказа через обновление массива товаров goods
//Удаление товара из заказа через axios.patch а не axios.delete
const deleteGood = async (_id: string) => {
  try {
    const newGoodsList =  order.value.goods.filter((good) => good._id !== _id)
    console.log(newGoodsList)
    
    //Логика подсчета общей стоимости с учетом quantity
    const arrayPrices =  newGoodsList.map((item) => item.price * item.quantity)
   
    console.log(arrayPrices)
    const data =  arrayPrices.reduce((sum, current) => sum + current, 0)
    console.log(data)
    price.value = data

    const result = await axios.patch(`${import.meta.env.VITE_BASE_URL}/admin/orders/update/${_id}`, {
      goods: newGoodsList,
      _id: order.value._id,
      user: order.value.user,
      total_price: price.value,
      pay: order.value.pay,
      delivery: order.value.delivery,
    }, {
      withCredentials: true,
    })
    await getOrder()

    if(newGoodsList.length === 0) {
      await navigate.push({ name: 'editOrders' })
    }
    console.log(result.data)
  } catch (error) {
    console.log(error)
  }
}

</script>

<template>
  <div class="section">
    <div class="sectionAdd">
      <div class="titleMain">Обновление заказа</div>

      <div>Форма обновления товаров в заказе</div>
    </div>
    <div class="sectionEdit">
      <div class="title">Редактирование товаров в заказе</div>
      <div className="header">
        <div>Id товара</div>
        <div>Наименование товара</div>
        <div>Стоимость товара</div>
        <div>Количество товара</div>
      </div>
      <ul>
        <li v-for="item in order?.goods" :key="item._id">
          <div>{{ item._id }}</div>
          <div>{{ item.name }}</div>
          <div>{{ item.price }}</div>
          <div>{{ item.quantity }}</div>
          <Trash2 @click="deleteGood(item._id)" class="pencil" />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.section {
  display: flex;
  margin-top: 50px;
  width: 100%;
  height: 100%;
  gap: 10px;
  @media (max-width: 1700px) {
    flex-direction: column;
  }
  .titleMain {
    font-size: 20px;
    color: #fca3a3;
    margin-left: 20px;
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
