<script setup>
import keji from "./keji/index.vue";
import { useRouter } from "vitepress";
import SVGnest from "/public/svg/SVGnest";
import SVGvue from "/public/svg/SVGvue";
import SVGreact from "/public/svg/SVGreact";

const svg = SVGnest;
const vueSvg = SVGvue;
const router = useRouter();
const handleClick = (url) => {
  router.go(url);
};
</script>
<template>
  <div>
    <div class="containers">
      <div class="drop" style="--clr: #ff0f5b">
        <div
          class="content absolute z-10"
          @click="handleClick('/articles/BackEnd/NestJs/')"
        >
          <h2 v-html="svg"></h2>
          <p style="font-weight: 800">NEST</p>
          <a href="#"></a>
        </div>
      </div>
      <div class="drop" style="--clr: #be01fe">
        <div class="content">
          <keji />
          <!-- <h2 v-html="svg"></h2>
        <p style="font-weight: 800">NEST</p>
        <a href="#"></a> -->
        </div>
      </div>
      <div class="drop" style="--clr: #01b4ff">
        <div class="content" @click="handleClick('/articles/FontEnd/react/')">
          <h2 v-html="SVGreact"></h2>
          <p style="font-weight: 800">React</p>
          <a href="#"></a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "./home.scss";
.container {
  margin-top: -30px;
}
.pp {
  width: 80px;
  height: 80px;
  background-color: transparent;
  border-radius: 50%;
  box-shadow: inset 2px 5px 10px #0000001a, inset -2px -5px 10px #fff,
    15px 15px 10px #0000000d, 15px 10px 15px #00000006;
  display: grid;
  place-content: center;
  font-size: 2rem;
}
</style>
