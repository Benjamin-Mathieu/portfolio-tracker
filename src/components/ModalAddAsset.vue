
<template>
    <teleport v-if="show === true" to="body">
        <div @click.self="close()" class="modal">
            <div class="modal-content">
                <button id="btn-close" @click="close()">X</button>

                <transition name="fade" mode="out-in">
                    <section v-if="!asset.chosen" class="choose-asset">
                        <div class="header">
                            <h1 style="color: white">Choisissez un coin</h1>
                        </div>
                        <div class="div-input">
                            <input v-model="query" type="text" placeholder="Rechercher" />
                        </div>
                        <div class="list-container">
                            <TransitionGroup name="fade " tag="div">
                                <div
                                    @click="asset.chosen = true; getPrice(crypto.id)"
                                    class="crypto"
                                    v-for="crypto in queryCryptos"
                                    :key="crypto.id"
                                >
                                    <div class="p-logo">
                                        <img class="logo-crypto" :src="crypto.thumb" />
                                        <p>{{ crypto.name + " " + crypto.symbol.toUpperCase() }}</p>
                                    </div>
                                    <div>
                                        <p>></p>
                                    </div>
                                </div>
                            </TransitionGroup>
                        </div>
                    </section>

                    <section v-else class="transaction">
                        <div class="header">
                            <h1 style="color: white">Transaction</h1>
                        </div>
                        <div class="inputs">
                            <div>
                                <label for="inp-qty">Quantité</label>
                                <input
                                    v-model="asset.qty"
                                    type="text"
                                    placeholder="0.00"
                                    id="inp-qty"
                                />
                            </div>
                            <div>
                                <label for="inp-price">Prix par coin</label>
                                <input v-model="asset.price" type="text" id="inp-price" />
                            </div>
                        </div>
                        <div class="total">
                            <h3>Total dépensé</h3>
                            <span>{{ total + " €" }}</span>
                        </div>
                    </section>
                </transition>
            </div>
        </div>
    </teleport>
</template>

<script>
import { computed } from "@vue/reactivity";
import { onMounted, reactive, ref, watch } from "vue"
import { cryptos, searchCrypto, queryCryptos, getPriceCrypto } from "../store"

export default {
    name: 'Modal',
    props: {
        show: {
            type: Boolean
        }
    },
    emits: ['closeModal'],

    setup(props, { emit }) {
        const query = ref('');
        const asset = reactive({
            chosen: false,
            price: '',
            qty: '',
        });

        watch(query, (newVal, oldVal) => {
            searchCrypto(newVal);
        });

        const total = computed(() => {
            if (asset.qty !== '') {
                return asset.qty * asset.price;
            } else {
                return 0;
            }
        })

        const close = () => {
            emit('closeModal');
            query.value = '';
            asset.chosen = false;
        }

        const getPrice = async (id) => {
            const price = await getPriceCrypto(id);
            asset.price = price;
        }

        return { asset, cryptos, query, queryCryptos, total, getPrice, close }
    }
}
</script>

<style scoped lang="scss">
.modal {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 99999;
    background-color: rgba(0, 0, 0, 0.4);
    color: white;

    .modal-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: black;
        height: 50%;
        width: 35%;
        border-radius: 0.5rem;
        padding: 2rem;

        section.choose-asset {
            display: flex;
            flex-direction: column;
            height: 100%;

            .list-container {
                overflow: auto;
                -ms-overflow-style: none; /* IE and Edge */
                scrollbar-width: none; /* Firefox  */
                &-webkit-scrollbar {
                    display: none;
                }
                .crypto {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0.5rem;

                    &:hover {
                        cursor: pointer;
                    }
                    .p-logo {
                        display: flex;
                        align-items: center;
                        .logo-crypto {
                            height: 24px;
                            width: 24px;
                            padding-right: 1rem;
                        }
                    }
                }
            }
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #btn-close {
            position: absolute;
            right: 1.5rem;
            top: 1.5rem;
            padding: 0.5em;
            color: crimson;
            background-color: transparent;
            border: none;
        }

        .div-input {
            margin: 1rem 0;
            input {
                width: calc(100% - 1rem);
                padding: 0.5rem;
                background-color: transparent;
                border: none;
                color: white;
                &:hover {
                    border: 1px solid greenyellow;
                }
            }
        }
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
