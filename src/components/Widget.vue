<template>
  <div class="main-container">
    <!-- Ambient background effects -->
    <div class="ambient-bg"></div>
    
    <Nav
      :toggleMenu="toggleMenu"
      @showPortfolio="toggleMenu = true"
      @showCrypto="toggleMenu = false"
    ></Nav>

    <Transition name="toggle" mode="out-in">
      <div class="w-full flex justify-center" style="position: relative; z-index: 1;">
        <Portfolio v-if="toggleMenu === true"></Portfolio>
        <Cryptos v-else></Cryptos>
      </div>
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
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.toggle-enter-from,
.toggle-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.main-container {
  min-height: 100vh;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.ambient-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
  background:
    radial-gradient(ellipse 80% 50% at 50% -30%, rgba(163, 230, 53, 0.03), transparent),
    radial-gradient(ellipse 50% 40% at 85% 20%, rgba(59, 130, 246, 0.03), transparent),
    radial-gradient(ellipse 40% 50% at 10% 60%, rgba(139, 92, 246, 0.02), transparent);
}
</style>
