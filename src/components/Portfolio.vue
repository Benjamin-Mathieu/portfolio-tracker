<template>
    <section class="w-full max-w-7xl mx-auto" style="position: relative; z-index: 1;">
        <div class="flex flex-col">
            <Overview class="w-full"></Overview>
            <ListAssets></ListAssets>
        </div>
    </section>
</template>

<script>
import { getListCrypto } from "../store";
import ListAssets from "./ListAssets.vue";
import Overview from "./Overview.vue";

export default {
    name: "Portfolio",
    components: { ListAssets, Overview },

    setup() {
        getListCrypto(20);
    }
}
</script>

<style scoped>
</style>
