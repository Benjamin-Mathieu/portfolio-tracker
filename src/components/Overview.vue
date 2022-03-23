<template>
    <div class="overview">
        <div>
            <span>Solde actuel</span>
            <h2>{{ balance + " €" }}</h2>
        </div>
        <div>
            <button @click="modalOpened = true" class="btn btn-gradient btn-glow">Ajouter</button>
        </div>
    </div>

    <Modal :modalOpened="modalOpened"></Modal>
</template>

<script>
import { ref } from "vue"
import { balance } from "../store"
import Modal from "./Modal.vue"

export default {
    name: "Overview",
    components: { Modal },

    setup() {
        const modalOpened = ref(false);

        return { balance, modalOpened };
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.overview {
    margin-top: 1rem;
    display: flex;
    justify-content: space-around;
    @include buttonStyle();

    h2 {
        color: $base-color;
    }
    .btn-gradient {
        padding: 0.5rem;
        border-radius: 5px;
    }
}
</style>
