
<template>
    <teleport v-if="show === true" to="body">
        <div @click.self="$emit('closeModal')" class="modal">
            <div class="modal-content">
                <button id="btn-close" @click="$emit('closeModal')">X</button>

                <transition name="fade" mode="out-in">
                    <section v-if="!assetChosen" class="choose-asset">
                        <div class="header">
                            <h1 style="color: white">Choisissez un coin</h1>
                        </div>
                        <div class="div-input">
                            <input v-model="query" type="text" placeholder="Rechercher" />
                        </div>
                        <div class="list-container">
                            <TransitionGroup name="fade " tag="div">
                                <div
                                    @click="assetChosen = true"
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
                    </section>
                </transition>
            </div>
        </div>
    </teleport>
</template>

<script>
import { ref, watch } from "vue"
import { cryptos, searchCrypto, queryCryptos } from "../store"

export default {
    name: 'Modal',
    props: {
        show: {
            type: Boolean
        }
    },
    emits: ['closeModal'],

    setup() {
        const query = ref('');
        const assetChosen = ref(false);

        watch(query, (newVal, oldVal) => {
            searchCrypto(newVal);
        })

        return { assetChosen, cryptos, query, queryCryptos }
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
            justify-content: center;
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
