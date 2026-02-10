
<template>
    <div class="flex flex-col md:flex-row items-center justify-between gap-6 px-4 py-8">
        <div class="bg-gray-900 border border-crypto-green rounded-2xl p-6 flex flex-col items-center md:items-start transition-all duration-300 hover:shadow-lg">
            <span class="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">{{ $t('overview.currentBalance') }}</span>
            <h2 class="text-4xl font-bold text-crypto-green">{{ balance.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) }}</h2>
        </div>
        <div>
            <button @click="openModal()" class="btn-primary flex items-center gap-2 group">
                <PlusCircle class="h-6 w-6 transition-transform duration-300 group-hover:rotate-90" />
                <span class="text-lg">{{ $t('overview.add') }}</span>
            </button>
        </div>
    </div>

    <Modal :show="modalOpened" @closeModal="modalOpened = false"></Modal>
</template>

<script>
import { ref } from "vue"
import { balance } from "../store"
import Modal from "./ModalAddAsset.vue"
import { PlusCircle } from 'lucide-vue-next'

export default {
    name: "Overview",
    components: { Modal, PlusCircle },

    setup() {
        const modalOpened = ref(false);

        const openModal = () => {
            modalOpened.value = true;
        }

        return { balance, modalOpened, openModal };
    },
}
</script>

<style scoped>
</style>
