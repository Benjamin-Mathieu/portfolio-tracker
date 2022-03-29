<template>
  <div class="container bg-blur">
    <Nav
      :toggleMenu="toggleMenu"
      @showPortfolio="toggleMenu = true"
      @showCrypto="toggleMenu = false"
    ></Nav>

    <Transition name="toggle" mode="out-in">
      <Portfolio v-if="toggleMenu === true"></Portfolio>
      <Cryptos v-else></Cryptos>
    </Transition>
  </div>
</template>

<script>
import { ref } from "vue";
import Nav from "./Nav.vue";
import Portfolio from "./Portfolio.vue";
import Cryptos from "./Cryptos.vue";

export default {
  name: "Widget",
  components: { Nav, Portfolio, Cryptos },

  setup() {

    const toggleMenu = ref(true);

    return { toggleMenu }
  }
}
</script>

<style scoped lang="scss">
.toggle-enter-active,
.toggle-leave-active {
  transition: all 0.3s ease;
}

.toggle-enter-from,
.toggle-leave-to {
  opacity: 0;
  transform: scale(0.7);
}

.container {
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  .text-gradient {
    text-shadow: 0 0 80px rgb(192 219 255 / 75%), 0 0 32px rgb(65 120 255 / 24%);
    color: white;
  }
}

.bg-blur {
  overflow: hidden;
  // background-color: transparent;
  background: radial-gradient(
    50% 50% at 50% 50%,
    #fc077d10 0,
    rgba(255, 255, 255, 0) 100%
  );

  // &::before {
  //   content: "";
  //   // background: url("../assets/img/bg-space.jpg");
  //   // background-size: cover;

  //   height: 100%;
  //   width: 100%;
  //   position: absolute;
  //   filter: blur(20px);
  //   z-index: -1;
  // }
}
</style>
