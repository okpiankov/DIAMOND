<script setup lang="ts">
const data1 = {
  title: "Золото — не только материал для изготовления украшений, но еще и средство вложения. Именно этот металл является обеспечением мировых валют. Нужно отметить, что цена на него в последние годы стабильно росла. Вместе с тем, год от года увеличиваются и объемы добычи драгоценного металла."
}
const data2 = {
  title: "Как меняли логотипы известных брендов.25 примеров которые вы точно не видели!"
}
</script>

<template>
  <div class="section">
    <!-- <h2>Блог</h2> -->
    <div class="article_1 showTop">
      {{ data1.title }}
    </div>
    <div class="article_2 showTop">{{ data2.title }}</div>
    <div class="article_1 showRight">{{ data1.title }}</div>
    <div class="article_2 showLeft">{{ data2.title }}</div>
    <div class="article_1 showLeft">{{ data1.title }}</div>
    <div class="article_2 showRight">{{ data2.title }}</div>
    <div class="article_1 showRight">{{ data1.title }}</div>
    <div class="article_2 showLeft">{{ data2.title }}</div>
  </div>
</template>

<style scoped lang="scss">
.section {
  height: auto;
  width: 100%;
  border-radius: 37px;
  background-color: black;
  display: grid;
  grid-template-columns: 1fr 1fr;
  // grid-template-rows: 1fr 1fr 1fr;
  row-gap: 20px;
  column-gap: 20px;
  padding: 20px;
  place-items: stretch end;
  color: white;
  font-size: 20px;

  @media (max-width: 440px) {
    row-gap: 7px;
    column-gap: 7px;
    padding: 7px;
  }

  .article_1 {
    height: 450px;
    width: 100%;
    // border: white 2px solid;
    // background-color: #be65fe;
    background-image: url("/gold.webp");
    background-size: cover;
    opacity: 0.9;
    border-radius: 90px;
    grid-row: span 3;
    transition: all 1s ease-in-out;
    transform: translateX(-100%);
    transform: translateX(0);
    // padding: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
    overflow: hidden;

    @media (max-width: 1150px) {
      height: 330px;
      border-radius: 70px;
      padding: 25px;
      line-height: 1.2;
    }
    @media (max-width: 440px) {
      height: 150px;
      border-radius: 30px;
      font-size: 12px;
      padding: 5px;
      line-height: 0.9;
      overflow: hidden;
      padding-top: 35px;
    }
    &:hover {
      scale: 1.3;
      z-index: 5;
      border: red 3px solid;
    }
  }
  .article_2 {
    height: 300px;
    width: 100%;
    // border: red 2px solid;
    // background-color: #6f9fff;
    background-image: url("/brend.jpeg");
    background-size: cover;
    opacity: 0.9;
    border-radius: 60px;
    grid-row: span 2;
    transition: all 1s ease-in-out;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
    overflow: hidden;
    @media (max-width: 1150px) {
      height: 220px;
      border-radius: 50px;
      padding: 25px;
      line-height: 1.2;
    }
    @media (max-width: 440px) {
      height: 100px;
      border-radius: 20px;
      font-size: 12px;
      padding: 5px;
      line-height: 0.9;
      overflow: hidden;
      padding-top: 35px;
    }
    &:hover {
      scale: 1.3;
      z-index: 5;
      border: red 3px solid;
    }
  }
}
.show {
  animation: show 4s;
}
@keyframes show {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.showTop {
  position: relative;
  animation: showTop 2s;
  z-index: 1;
}
@keyframes showTop {
  from {
    top: -100%;
  }
  to {
    top: 0;
  }
}
.showLeft {
  position: relative;
  animation: showLeft 2s;
  z-index: 1;
}
@keyframes showLeft {
  from {
    left: -100%;
  }
  to {
    left: 0;
  }
}

.showRight {
  position: relative;
  animation: showRight 2s;
  z-index: 1;
}
@keyframes showRight {
  from {
    right: -100%;
  }
  to {
    right: 0;
  }
}
</style>
