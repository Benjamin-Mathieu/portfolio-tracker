
<template>
    <teleport v-if="show === true" to="body">
        <transition name="modal-fade">
            <div @click.self="close()" class="modal-overlay">
                <div class="modal-box w-full max-w-lg" style="max-height: 50vh; overflow-y: auto;">
                    <button 
                        id="btn-close" 
                        @click="close()" 
                        class="absolute right-4 top-4 text-gray-500 hover:text-red-500 transition-colors duration-300 font-bold text-xl"
                    >
                        <X class="h-6 w-6" />
                    </button>

                    <transition name="slide-fade" mode="out-in">
                        <section v-if="!asset.chosen" class="flex flex-col h-full">
                            <div class="mb-6">
                                <h1 class="text-2xl font-bold text-white">{{ $t('modal.chooseCoin') }}</h1>
                            </div>
                            <div class="mb-4">
                                <input 
                                    v-model="query" 
                                    type="text" 
                                    :placeholder="$t('modal.search')" 
                                    class="input-field"
                                />
                            </div>
                            <div class="overflow-y-auto max-h-[400px] scrollbar-hide">
                                <TransitionGroup name="list" tag="div" class="space-y-1">
                                    <div
                                        @click="selectCrypto(crypto)"
                                        class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-all duration-300 group"
                                        v-for="crypto in queryCryptos"
                                        :key="crypto.id"
                                    >
                                        <div class="flex items-center gap-3">
                                            <img class="w-8 h-8 rounded-full" :src="crypto.thumb" />
                                            <div>
                                                <p class="font-semibold">{{ crypto.name }}</p>
                                                <p class="text-xs text-gray-400">{{ crypto.symbol.toUpperCase() }}</p>
                                            </div>
                                        </div>
                                        <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-crypto-green">
                                            <ChevronRight class="h-5 w-5" />
                                        </div>
                                    </div>
                                </TransitionGroup>
                            </div>
                        </section>

                        <section v-else class="space-y-6">
                            <div class="flex items-center gap-4 mb-2">
                                <button @click="asset.chosen = false" class="text-gray-400 hover:text-white transition-colors duration-300">
                                    <ArrowLeft class="h-6 w-6" />
                                </button>
                                <h1 class="text-2xl font-bold text-white">{{ $t('modal.transaction') }}</h1>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="space-y-2">
                                    <label for="inp-qty" class="text-sm font-medium text-gray-400">{{ $t('modal.quantity') }}</label>
                                    <input
                                        v-model="asset.qty"
                                        type="number"
                                        min="0"
                                        step="any"
                                        placeholder="0.00"
                                        id="inp-qty"
                                        class="input-field"
                                    />
                                </div>
                                <div class="space-y-2">
                                    <label for="inp-price" class="text-sm font-medium text-gray-400">{{ $t('modal.pricePerCoin') }}</label>
                                    <input 
                                        v-model="asset.price" 
                                        type="number" 
                                        min="0" 
                                        step="any" 
                                        id="inp-price" 
                                        class="input-field"
                                    />
                                </div>
                            </div>

                            <div class="bg-gray-900 p-4 rounded-xl flex justify-between items-center">
                                <h3 class="text-lg font-medium text-gray-300">{{ $t('modal.totalSpent') }}</h3>
                                <span class="text-2xl font-bold text-crypto-green">{{ total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) }}</span>
                            </div>

                            <div class="flex justify-end gap-3 pt-4">
                                <button class="btn-secondary" @click="close()">{{ $t('modal.cancel') }}</button>
                                <button class="btn-primary" @click="submitTransaction" :disabled="!isValid">{{ $t('modal.add') }}</button>
                            </div>
                        </section>
                    </transition>
                </div>
            </div>
        </transition>
    </teleport>
</template>


<script>
import { computed } from "@vue/reactivity";
import { reactive, ref, watch } from "vue"
import { searchCrypto, queryCryptos, getPriceCrypto, addTransaction } from "../store"
import { X, ChevronRight, ArrowLeft } from 'lucide-vue-next'

export default {
    name: 'Modal',
    components: { X, ChevronRight, ArrowLeft },
    props: {
        show: {
            type: Boolean
        }
    },
    emits: ['closeModal'],

    setup(props, { emit }) {
        const query = ref('');
        const asset = reactive({
            id: '',
            name: '',
            symbol: '',
            chosen: false,
            price: 0,
            qty: 0,
        });

        watch(query, (newVal) => {
            searchCrypto(newVal);
        });

        const total = computed(() => {
            return asset.qty * asset.price;
        })

        const isValid = computed(() => {
            return asset.qty > 0 && asset.price > 0;
        });

        const close = () => {
            emit('closeModal');
            query.value = '';
            asset.chosen = false;
            asset.qty = 0;
            asset.price = 0;
        }

        const selectCrypto = async (crypto) => {
            asset.id = crypto.id;
            asset.name = crypto.name;
            asset.symbol = crypto.symbol;
            asset.chosen = true;
            const price = await getPriceCrypto(crypto.id);
            asset.price = price;
        }

        const submitTransaction = () => {
            if (!isValid.value) return;

            addTransaction({
                assetId: asset.id,
                assetName: asset.name,
                symbol: asset.symbol.toUpperCase(),
                quantity: asset.qty,
                purchasePrice: asset.price
            });

            close();
        }

        return { asset, query, queryCryptos, total, isValid, selectCrypto, close, submitTransaction }
    }
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-fade-enter-active .modal-box,
.modal-fade-leave-active .modal-box {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-fade-enter-from .modal-box,
.modal-fade-leave-to .modal-box {
    transform: scale(0.9);
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
