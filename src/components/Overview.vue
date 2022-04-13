<template>
    <div class="overview">
        <div class="user-balance">
            <span style="font-size: 28px">Solde actuel</span>
            <h2>{{ balance + " €" }}</h2>
        </div>
        <div>
            <button @click="openModal()" class="btn btn-gradient btn-glow">Ajouter</button>
        </div>
    </div>

    <Modal :show="modalOpened" @closeModal="modalOpened = false"></Modal>
</template>

<script>
import { ref } from "vue"
import { balance } from "../store"
import Modal from "./ModalAddAsset.vue"

export default {
    name: "Overview",
    components: { Modal },

    setup() {
        const modalOpened = ref(false);

        const openModal = () => {
            modalOpened.value = true;
            console.log(modalOpened.value);
        }

        return { balance, modalOpened, openModal };
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

    .user-balance {
        border: 2px solid greenyellow;
        border-radius: 8px;
        padding: 1rem;
    }

    h2 {
        color: greenyellow;
    }
    .btn-gradient {
        padding: 0.5rem;
        border-radius: 5px;
    }
}
</style>
