<template>
  <Widget />
</template>

<script>
import Widget from './components/Widget.vue'

export default {
  name: 'App',
  components: {
    Widget
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  box-sizing: border-box;
  color: white;
  background-color: #212429;
}
</style>
