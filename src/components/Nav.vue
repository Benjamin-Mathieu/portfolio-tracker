<template>
    <div class="w-full flex flex-col">
        <div class="w-full border-b border-gray-800 flex items-center text-xs px-4 py-2 text-gray-400 gap-6">
            <div class="flex items-center gap-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
                <div class="flex items-center gap-1">
                    <span>{{ $t('nav.currencies') }}:</span>
                    <span class="text-crypto-green font-medium">{{ globalData.active_cryptocurrencies }}</span>
                </div>
                <div class="flex items-center gap-1">
                    <span>{{ $t('nav.markets') }}:</span>
                    <span class="text-crypto-green font-medium">{{ globalData.markets }}</span>
                </div>
                <div class="flex items-center gap-1">
                    <span>{{ $t('nav.dominance') }}:</span>
                    <span v-if="globalData.market_cap_percentage" class="text-crypto-green font-medium uppercase">
                        BTC {{ globalData.market_cap_percentage.btc.toFixed(1) }}% ETH {{ globalData.market_cap_percentage.eth.toFixed(1) }}%
                    </span>
                </div>
            </div>
            
            <div class="ml-auto relative" style="flex-shrink: 0;">
                <button @click="langOpen = !langOpen" class="flex items-center gap-2 p-1 rounded-md hover:bg-gray-800 transition-colors duration-300">
                    <span class="text-lg">{{ currentLanguage === 'fr' ? '🇫🇷' : '🇬🇧' }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                <div v-if="langOpen" class="fixed inset-0" style="z-index: 40;" @click="langOpen = false"></div>
                <div v-if="langOpen" class="lang-dropdown">
                    <a href="#" @click.prevent="selectLanguage('fr')" class="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-crypto-green transition-colors">
                        <span>🇫🇷</span> Français
                    </a>
                    <a href="#" @click.prevent="selectLanguage('en')" class="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-crypto-green transition-colors">
                        <span>🇬🇧</span> English
                    </a>
                </div>
            </div>
        </div>

        <nav class="px-4 py-6">
            <ul class="flex gap-8">
                <li
                    @click="$emit('showPortfolio')"
                    class="text-2xl font-bold cursor-pointer transition-all duration-300 relative py-2"
                    :class="toggleMenu ? 'text-white' : 'text-gray-600 hover:text-gray-400'"
                >
                    {{ $t('nav.portfolio') }}
                    <div v-if="toggleMenu" class="absolute bottom-0 left-0 w-full h-1 bg-crypto-green rounded-full" style="box-shadow: 0 0 10px greenyellow;"></div>
                </li>
                <li
                    @click="$emit('showCrypto')"
                    class="text-2xl font-bold cursor-pointer transition-all duration-300 relative py-2"
                    :class="!toggleMenu ? 'text-white' : 'text-gray-600 hover:text-gray-400'"
                >
                    {{ $t('nav.cryptos') }}
                    <div v-if="!toggleMenu" class="absolute bottom-0 left-0 w-full h-1 bg-crypto-green rounded-full" style="box-shadow: 0 0 10px greenyellow;"></div>
                </li>
            </ul>
        </nav>
    </div>
</template>


<script>
import { ref, onMounted, computed } from "vue"
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
        const langOpen = ref(false)

        const currentLanguage = computed(() => locale.value)

        const selectLanguage = (lang) => {
            locale.value = lang
            langOpen.value = false
        }

        onMounted(async () => {
            await getGlobalData();
        });

        return { globalData, currentLanguage, selectLanguage, langOpen }
    }
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
.lang-dropdown {
    position: absolute;
    right: 0;
    top: 100%;
    margin-top: 0.25rem;
    width: 10rem;
    background-color: #111827;
    border: 1px solid #1f2937;
    border-radius: 0.5rem;
    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3);
    z-index: 50;
    padding: 0.25rem 0;
}
</style>
