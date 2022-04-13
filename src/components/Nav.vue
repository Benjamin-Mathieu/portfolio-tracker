<template>
    <div class="container">
        <div class="top-bar">
            <div>
                <span>
                    Monnaies:
                    <span
                        style="color: greenyellow"
                    >{{ globalData.active_cryptocurrencies }}</span>
                </span>
            </div>
            <div>
                <span>
                    Marchés:
                    <span style="color: greenyellow">{{ globalData.markets }}</span>
                </span>
            </div>
            <div>
                <span>
                    Prédominance:
                    <span
                        style="color: greenyellow"
                    >{{ "BTC " + globalData.market_cap_percentage.btc.toFixed(2) + "% ETH " + globalData.market_cap_percentage.eth.toFixed(2) + "%" }}</span>
                </span>
            </div>
            <div class="options">
                <div>Choix langue</div>
            </div>
        </div>
        <nav class="menu">
            <ul>
                <li
                    @click="$emit('showPortfolio')"
                    :class="toggleMenu === true ? 'isSelected' : null"
                >Portfolio</li>
                <li
                    @click="$emit('showCrypto')"
                    :class="toggleMenu === false ? 'isSelected' : null"
                >Cryptos</li>
            </ul>
        </nav>
    </div>
</template>

<script>import { onMounted } from "vue"
import { getGlobalData, globalData } from "../store"


export default {
    name: 'Nav',
    props: {
        toggleMenu: {
            type: Boolean
        }
    },
    emits: ['showPortfolio, showCrypto'],

    setup() {
        onMounted(async () => {
            await getGlobalData();
        });

        return { globalData }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.container {
    .top-bar {
        width: 100%;
        border-bottom: 1px solid whitesmoke;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        font-size: small;
        div {
            padding: 0.5rem;
        }

        .options {
            margin-left: auto;
        }
    }
    .menu {
        ul {
            display: flex;

            li {
                font-weight: bold;
                list-style: none;
                font-size: 2rem;
                padding: 0.5rem;

                &.isSelected {
                    background-color: greenyellow;
                }

                &:hover {
                    cursor: pointer;
                }
            }
        }
    }
}
</style>
