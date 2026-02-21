<template>
    <teleport v-if="show === true" to="body">
        <transition name="modal-fade">
            <div @click.self="close()" class="modal-overlay">
                <div class="modal-box w-full max-w-lg" style="max-height: 60vh; overflow-y: auto;">
                    <button 
                        id="btn-close" 
                        @click="close()" 
                        class="close-btn"
                    >
                        <X class="h-4 w-4" />
                    </button>

                    <transition name="slide-fade" mode="out-in">
                        <!-- Step 1: Search coin -->
                        <section v-if="!asset.chosen" class="flex flex-col h-full">
                            <div class="mb-5">
                                <h1 class="text-lg font-bold text-white tracking-tight">{{ $t('modal.chooseCoin') }}</h1>
                                <p class="text-xs text-gray-600 mt-1">Search and select a cryptocurrency</p>
                            </div>
                            <div class="mb-4 relative">
                                <Search class="search-icon" :size="16" />
                                <input 
                                    v-model="query" 
                                    type="text" 
                                    :placeholder="$t('modal.search')" 
                                    class="input-field"
                                    style="padding-left: 2.5rem;"
                                />
                            </div>
                            <div class="overflow-y-auto max-h-[380px] scrollbar-hide">
                                <TransitionGroup name="list" tag="div" class="space-y-0.5">
                                    <div
                                        @click="selectCrypto(crypto)"
                                        class="crypto-result-item"
                                        v-for="crypto in queryCryptos"
                                        :key="crypto.id"
                                    >
                                        <div class="flex items-center gap-3">
                                            <img class="w-8 h-8 rounded-full" style="border: 1px solid rgba(55,65,81,0.3);" :src="crypto.thumb" />
                                            <div>
                                                <p class="font-semibold text-white text-sm">{{ crypto.name }}</p>
                                                <p class="text-xs text-gray-600 uppercase font-medium">{{ crypto.symbol }}</p>
                                            </div>
                                        </div>
                                        <ChevronRight class="h-4 w-4 text-gray-700 group-hover:text-crypto-green transition-all duration-300" />
                                    </div>
                                </TransitionGroup>
                            </div>
                        </section>

                        <!-- Step 2: Enter transaction -->
                        <section v-else class="space-y-5">
                            <div class="flex items-center gap-3 mb-2">
                                <button @click="asset.chosen = false" class="back-btn">
                                    <ArrowLeft class="h-4 w-4" />
                                </button>
                                <h1 class="text-lg font-bold text-white tracking-tight">{{ $t('modal.transaction') }}</h1>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="space-y-1.5">
                                    <label for="inp-qty" class="stat-label">{{ $t('modal.quantity') }}</label>
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
                                <div class="space-y-1.5">
                                    <label for="inp-price" class="stat-label">{{ $t('modal.pricePerCoin') }}</label>
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

                            <div class="total-display">
                                <span class="text-xs font-medium text-gray-500">{{ $t('modal.totalSpent') }}</span>
                                <span class="text-xl font-bold text-glow-green">{{ total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) }}</span>
                            </div>

                            <div class="flex justify-end gap-2.5 pt-1">
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
import { X, ChevronRight, ArrowLeft, Search } from 'lucide-vue-next'

export default {
    name: 'Modal',
    components: { X, ChevronRight, ArrowLeft, Search },
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
    transition: opacity 0.25s ease;
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
    transform: scale(0.95) translateY(10px);
}

.slide-fade-enter-active {
  transition: all 0.25s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(16px);
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.25s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.close-btn {
    position: absolute;
    right: 1rem;
    top: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 0.5rem;
    border: none;
    background: rgba(31, 41, 55, 0.3);
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s ease;
}

.close-btn:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #f87171;
}

.search-icon {
    position: absolute;
    left: 0.875rem;
    top: 50%;
    transform: translateY(-50%);
    color: #374151;
    pointer-events: none;
}

.crypto-result-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem;
    border-radius: 0.625rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.crypto-result-item:hover {
    background: rgba(31, 41, 55, 0.4);
}

.back-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 0.5rem;
    border: 1px solid rgba(55, 65, 81, 0.3);
    background: rgba(17, 24, 39, 0.6);
    color: #9ca3af;
    cursor: pointer;
    transition: all 0.2s ease;
}

.back-btn:hover {
    background: rgba(31, 41, 55, 0.6);
    color: white;
    border-color: rgba(75, 85, 99, 0.4);
}

.total-display {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    border-radius: 0.75rem;
    background: rgba(10, 11, 15, 0.6);
    border: 1px solid rgba(55, 65, 81, 0.2);
}
</style>
