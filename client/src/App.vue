<script setup lang="ts">
// import { storeToRefs } from 'pinia'
import { RouterLink, RouterView } from 'vue-router'
import { UserRound, ShoppingCart, Menu, Gem, LogOut } from 'lucide-vue-next'
import DrawerRightMenu from './components/RightMenu.vue'
import Cart from './components/Cart.vue'
import { provide, ref } from 'vue'
import LoginForm from './components/LoginForm.vue'
import { useCartStore } from './store/cart'
import { useAuthStore } from './store/auth'
import { useRouter } from 'vue-router'
import Banner from './components/Banner.vue'

const drawerCart = ref(false)
const drawerRightMenu = ref(false)
const popUpLoginForm = ref(false) // реакт.переменная передается через emit через 2 компонента

//Тест provide
provide('drawerCart', drawerCart)

const closeRightMenu = () => {
  drawerRightMenu.value = false
}

// useAuthStore().$state и useCartStore().$state не верно!, так работаю с состоянием, а не стором
const cartStore = useCartStore()
const authStore = useAuthStore()
// const { cart } = storeToRefs(cartStore)
// const { isAuth } = storeToRefs(authStore)
const navigate = useRouter()

const Login = () => {
  if (authStore.$state.fullName === '') {
    //либо работате как открытие формы авторизации
    popUpLoginForm.value = !popUpLoginForm.value
  } else {
    //либо при логине только перенаправляет в личный кабинет
    navigate.push({ name: 'dataPage' })
  }
}
</script>

<template>
  <DrawerRightMenu v-if="drawerRightMenu" @closeRightMenu="closeRightMenu" />
  <Cart v-if="drawerCart" />
  <!-- <Auth v-if="popUpAuth" :popUpAuth="popUpAuth" Почему нельзя передать реактивную переменную через :?/> -->
  <!-- Важно!!! название в род.комп. @popUpAuth такое же как и в доч.комп. в const emit = defineEmits(['popUpAuth']) -->
  <!-- <Auth v-if="popUpAuth" @popUpAuth="popUpAuth = !popUpAuth" /> -->
  <LoginForm v-if="popUpLoginForm" @popUpLoginForm="popUpLoginForm = !popUpLoginForm" />
  <Banner />
  <div class="container">
    <header>
      <div class="logo">
        <div>
          <Gem class="gem" />
          <RouterLink to="/" class="name">DIAMOND</RouterLink>
        </div>
        <div>8-800-777-77-77</div>
      </div>
      <div class="nav">
        <!-- Обращаю внимание тк в authStore тип строка token:'' то и все последующие сравнения  -->
        <!-- со сторокой .token !== '' верно!  .token !== null ошибка! -->
        <UserRound
          v-if="authStore.$state.role === 'client' || authStore.$state.fullName === ''"
          class="userRound"
          @click="Login()"
          :class="{ active: authStore.$state.fullName !== '' }"
        />
        <ShoppingCart
          class="shoppingCart"
          @click="drawerCart = !drawerCart"
          v-if="authStore.$state.fullName === ''"
          :class="{ active: cartStore.$state.cart.length !== 0 }"
        />
        <ShoppingCart
          class="shoppingCart"
          @click="navigate.push({ name: 'cartCabinetPage' })"
          v-if="authStore.$state.role === 'client' && authStore.$state.fullName !== ''"
          :class="{ active: cartStore.$state.cart.length !== 0 }"
        />
        <Menu
          v-if="authStore.$state.role === 'client' || authStore.$state.fullName === ''"
          class="menu"
          @click="drawerRightMenu = !drawerRightMenu"
        />
        <LogOut
          @click="
            authStore.clear();
            navigate.push({ name: 'home' })
          "
          v-if="authStore.$state.fullName !== ''"
          class="logOut"
        />
      </div>
    </header>

    <!-- ЛЕЙАУТ корневой роут:-->
    <section>
      <RouterView />
    </section>
  </div>
</template>

<style scoped lang="scss">
.loading {
  font-size: 22px;
  z-index: 60;
  color: white;
  text-align: center;
  margin-top: 20px;
}
.container {
  width: 85%;
  height: 100%;
  margin: auto;
  border-radius: 20px;
  /* background-color: rgb(252, 167, 237); */
  background-color: black;
  display: flex;
  flex-direction: column;
  gap: 30px;

  header {
    width: 100%;
    height: 120px;
    /* background-color: #84c5f9; */
    background-color: black;
    // border-bottom: 1px solid white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    position: sticky;
    top: 0;
    z-index: 3;
    @media (max-width: 770px) {
      flex-direction: column;
      height: 80px;
      box-shadow: 0 0 20px 30px black;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-left: 30px;
      margin-right: 30px;
      @media (max-width: 440px) {
        justify-content: space-between;
        margin-top: 10px;
        margin-left: 0px;
        margin-right: 0px;
        // gap: 10px;
      }
      div {
        display: flex;
        .gem {
          width: 30px;
          height: 30px;
          // color: rgb(230, 0, 255);
          animation: show 5s infinite;
        }
        @keyframes show {  
          0%,
          100% {
            color: white;
            opacity: 1;
            rotate: -38deg;
            background-color: rgb(230, 0, 255);
            border-radius: 15px;
            box-shadow: 0 -17px 12px 22px rgb(230, 0, 255);
          }
          50% {
            color: rgb(245, 153, 255);
            opacity: 0.1;
            rotate: 0deg;

          }
        }
      }
    }
    .nav {
      display: flex;
      align-items: center;
      gap: 50px;
      margin-left: 30px;
      margin-right: 30px;
      @media (max-width: 440px) {
        margin-bottom: 10px;
      }
    }
    .name {
      font-size: 23px;
      font-weight: 900;
    }
  }
  section {
    width: 100%;
    min-height: 800px;
    // height: 100%;
    border: 1px solid #fca3a3;
    box-shadow: 0 0 20px 30px #fca3a3;
    border-radius: 37px;
    background-color: #ffc4c4;
    display: flex;
    // flex-direction: row;
    flex-direction: column;
    align-items: center;
    // justify-content: center;
    margin-bottom: 35px;
    @media (max-width: 440px) {
      min-height: 200px;
      // min-height: auto;
    }
  }
}
.active {
  color: rgb(230, 0, 255);
  font-weight: 900;
  stroke-width: 3px;
}
.logOut {
  color: red;
}
</style>
