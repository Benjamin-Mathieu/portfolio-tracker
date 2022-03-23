<template>
    <div class="list">
        <h3>Vos actifs</h3>
    </div>
</template>

<script>
import { ref } from "vue";

export default {
    name: 'ListAssets',
    script() {
        const assets = ref([]);

        return { assets }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
