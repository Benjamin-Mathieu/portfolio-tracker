<template>
    <section class="portfolio">
        <div style="width: 100%; text-align: center;">
            <Overview></Overview>
        </div>

        <Chart></Chart>
        <ListAssets></ListAssets>
    </section>
</template>

<script>
import { getListCrypto } from "../store";
import Chart from "./Chart.vue";
import ListAssets from "./ListAssets.vue";
import Overview from "./Overview.vue";

export default {
    name: "Widget",
    components: { Chart, ListAssets, Overview },

    setup() {
        getListCrypto(20);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.portfolio {
    margin-top: 1rem;
    width: 100%;
    text-align: center;
}
</style>
