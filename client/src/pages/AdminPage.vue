<script setup lang="ts">

</script>

<template>
  <div class="container">
    <div class="title">Админ панель</div>
    <nav class="nav">
      <div class="decoration cabinet">Админ панель</div>

      <!-- Для children прописывается полный путь начиная с / "/cabinet/dataPage" -->
      <router-link to="/admin/products" class="decoration"> Продукты </router-link>
      <router-link to="/admin/users" class="decoration"> Пользователи </router-link>
      <router-link to="/admin/orders" class="decoration"> Заказы </router-link>
      
    </nav>

    <!-- ЛЕЙАУТ админка:-->
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
  position: relative;
  @media (max-width: 440px) {
      flex-direction: column;
    }
  .title {
      position: absolute;
      left: 180px;
      top: 10px;;
      color: white;
      font-size: 23px;
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
