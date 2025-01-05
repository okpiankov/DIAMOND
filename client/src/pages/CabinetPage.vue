<script setup lang="ts">
// import CartItem from '../components/CartItem.vue'
</script>

<template>
  <div class="left showLeft"></div>
  <div class="right showRight"></div> 
  <div class="container">
    <nav class="nav">
      <div class="decoration cabinet">Личный кабинет</div>

      <!-- Для children прописывается полный путь начиная с / "/cabinet/dataPage" -->
      <router-link to="/cabinet/dataPage" class="decoration"> Пользователь </router-link>

      <router-link to="/cabinet/cartCabinetPage" class="decoration"> Моя корзина </router-link>

      <router-link to="/cabinet/ordersCabinetPage" class="decoration"> Мои заказы </router-link>
    </nav>

    <!-- ЛЕЙАУТ личный кабинет:-->
    <!-- Аналогично как и в App указывать корень <RouterView />-->
    <section>
      <RouterView />
    </section>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  min-height: 800px;
  // height: auto;
  display: flex;
  flex-direction: row;
  gap: 10px;
  // border: black 1px solid;
  border-radius: 37px;
  background-color: black;
  @media (max-width: 440px) {
      flex-direction: column;
    }

  nav {
    width: 170px;
    // min-height: 750px;
    // height: auto;
    background-color: #fca3a3;
    display: flex;
    flex-direction: column;
    gap: 50px;
    // padding-top: 20px;
    font-size: 23px;
    font-weight: 700;
    padding-right: 3px;
    @media (max-width: 440px) {
      gap: 0;
      min-height: auto;
      width: 100%;
    }

    .cabinet {
      font-size: 25px;
      padding-left: 30px;
      box-shadow: #6e0000 0px 0px 10px 0px;
      @media (max-width: 440px) {
      padding-left: 0;
      color: white;
    }
    }
    .decoration {
      border-bottom: 1px solid black;
      // box-shadow: #6e0000 0px 0px 10px 0px;
      &:hover {
        box-shadow: #6e0000 0px 0px 10px 0px;
        color: white;
      }
    }
  }
  section {
    width: 100%;
    min-height: 750px;
    border-top-right-radius: 37px;
    border-bottom-right-radius: 37px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    // padding-top: 48px;
    // background-color: #fff;
  }
}

</style>
