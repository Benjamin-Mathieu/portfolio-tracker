<template>
    <div class="container">
        <div class="top-bar">
            <div>
                <span>
                    {{ $t('nav.currencies') }}:
                    <span
                        style="color: greenyellow"
                    >{{ globalData.active_cryptocurrencies }}</span>
                </span>
            </div>
            <div>
                <span>
                    {{ $t('nav.markets') }}:
                    <span style="color: greenyellow">{{ globalData.markets }}</span>
                </span>
            </div>
            <div>
                <span>
                    {{ $t('nav.dominance') }}:
                    <span
                        style="color: greenyellow"
                        v-if="globalData.market_cap_percentage"
                    >{{ "BTC " + globalData.market_cap_percentage.btc.toFixed(2) + "% ETH " + globalData.market_cap_percentage.eth.toFixed(2) + "%" }}</span>
                </span>
            </div>
            <div class="options">
                <div class="dropdown">
                    <button class="dropbtn">
                        {{ currentLanguage === 'fr' ? '🇫🇷' : '🇬🇧' }}
                    </button>
                    <div class="dropdown-content">
                        <a href="#" @click.prevent="changeLanguage('fr')">🇫🇷 Français</a>
                        <a href="#" @click.prevent="changeLanguage('en')">🇬🇧 English</a>
                    </div>
                </div>
            </div>
        </div>
        <nav class="menu">
            <ul>
                <li
                    @click="$emit('showPortfolio')"
                    :class="toggleMenu === true ? 'isSelected' : null"
                >{{ $t('nav.portfolio') }}</li>
                <li
                    @click="$emit('showCrypto')"
                    :class="toggleMenu === false ? 'isSelected' : null"
                >{{ $t('nav.cryptos') }}</li>
            </ul>
        </nav>
    </div>
</template>



<script>
import { onMounted, computed } from "vue"
import { useI18n } from "vue-i18n"
import { getGlobalData, globalData } from "../store"


export default {
    name: 'Nav',
    props: {
        toggleMenu: {
            type: Boolean
        }
    },
    emits: ['showPortfolio', 'showCrypto'],

    setup() {
        const { locale } = useI18n()

        const currentLanguage = computed(() => locale.value)

        const changeLanguage = (lang) => {
            locale.value = lang
        }

        onMounted(async () => {
            await getGlobalData();
        });

        return { globalData, currentLanguage, changeLanguage }
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

            .dropdown {
                position: relative;
                display: inline-block;

                .dropbtn {
                    background-color: transparent;
                    color: white;
                    padding: 0.5rem;
                    font-size: 1.5rem;
                    border: none;
                    cursor: pointer;
                    border-radius: 4px;
                    transition: background-color 0.3s;

                    &:hover {
                        background-color: rgba(255, 255, 255, 0.1);
                    }
                }

                .dropdown-content {
                    display: none;
                    position: absolute;
                    right: 0;
                    background-color: #1a1b1e;
                    min-width: 120px;
                    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.5);
                    z-index: 100;
                    border-radius: 4px;
                    overflow: hidden;
                    border: 1px solid #333;

                    a {
                        color: white;
                        padding: 12px 16px;
                        text-decoration: none;
                        display: block;
                        font-size: 14px;

                        &:hover {
                            background-color: rgba(173, 255, 47, 0.2);
                        }
                    }
                }

                &:hover .dropdown-content {
                    display: block;
                }
            }
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
