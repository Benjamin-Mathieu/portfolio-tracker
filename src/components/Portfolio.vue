
<template>
    <section class="w-full">
        <Overview></Overview>
        <div class="flex flex-col items-center gap-8">
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
