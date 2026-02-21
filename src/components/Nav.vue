<template>
    <header class="nav-wrapper" style="position: relative; z-index: 10;">
        <!-- Top ticker bar -->
        <div class="ticker-bar">
            <div class="flex items-center gap-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
                <div class="ticker-item">
                    <span class="ticker-label">{{ $t('nav.currencies') }}:</span>
                    <span class="ticker-value">{{ globalData.active_cryptocurrencies?.toLocaleString() }}</span>
                </div>
                <div class="ticker-dot"></div>
                <div class="ticker-item">
                    <span class="ticker-label">{{ $t('nav.markets') }}:</span>
                    <span class="ticker-value">{{ globalData.markets?.toLocaleString() }}</span>
                </div>
                <div class="ticker-dot"></div>
                <div class="ticker-item">
                    <span class="ticker-label">{{ $t('nav.dominance') }}:</span>
                    <span v-if="globalData.market_cap_percentage" class="ticker-value uppercase">
                        BTC {{ globalData.market_cap_percentage.btc.toFixed(1) }}%
                        <span class="ticker-separator">·</span>
                        ETH {{ globalData.market_cap_percentage.eth.toFixed(1) }}%
                    </span>
                </div>
            </div>
            
            <div class="ml-auto flex items-center gap-2" style="flex-shrink: 0;">
                <!-- Currency selector -->
                <div class="relative">
                    <button @click="currencyOpen = !currencyOpen" class="selector-btn">
                        <span class="selector-icon">{{ currency === 'eur' ? '€' : '$' }}</span>
                        <ChevronDown :size="14" :class="{ 'rotate-180': currencyOpen }" class="transition-transform duration-300 text-gray-600" />
                    </button>
                    <div v-if="currencyOpen" class="fixed inset-0" style="z-index: 40;" @click="currencyOpen = false"></div>
                    <div v-if="currencyOpen" class="dropdown-menu">
                        <a href="#" @click.prevent="selectCurrency('eur')" class="dropdown-item" :class="{ 'active': currency === 'eur' }">
                            <span class="text-lg">€</span>
                            <span>EUR</span>
                            <span v-if="currency === 'eur'" class="ml-auto text-crypto-green">✓</span>
                        </a>
                        <a href="#" @click.prevent="selectCurrency('usd')" class="dropdown-item" :class="{ 'active': currency === 'usd' }">
                            <span class="text-lg">$</span>
                            <span>USD</span>
                            <span v-if="currency === 'usd'" class="ml-auto text-crypto-green">✓</span>
                        </a>
                    </div>
                </div>

                <!-- Language selector -->
                <div class="relative">
                    <button @click="langOpen = !langOpen" class="selector-btn">
                        <Globe :size="14" class="text-gray-500" />
                        <span class="text-sm">{{ currentLanguage === 'fr' ? '🇫🇷' : '🇬🇧' }}</span>
                        <ChevronDown :size="14" :class="{ 'rotate-180': langOpen }" class="transition-transform duration-300 text-gray-600" />
                    </button>
                    <div v-if="langOpen" class="fixed inset-0" style="z-index: 40;" @click="langOpen = false"></div>
                    <div v-if="langOpen" class="dropdown-menu">
                        <a href="#" @click.prevent="selectLanguage('fr')" class="dropdown-item" :class="{ 'active': currentLanguage === 'fr' }">
                            <span>🇫🇷</span>
                            <span>Français</span>
                            <span v-if="currentLanguage === 'fr'" class="ml-auto text-crypto-green">✓</span>
                        </a>
                        <a href="#" @click.prevent="selectLanguage('en')" class="dropdown-item" :class="{ 'active': currentLanguage === 'en' }">
                            <span>🇬🇧</span>
                            <span>English</span>
                            <span v-if="currentLanguage === 'en'" class="ml-auto text-crypto-green">✓</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main nav -->
        <nav class="main-nav">
            <div class="nav-tabs">
                <button
                    @click="$emit('showPortfolio')"
                    class="nav-tab"
                    :class="{ 'active': toggleMenu }"
                >
                    <LayoutDashboard :size="20" />
                    <span>{{ $t('nav.portfolio') }}</span>
                </button>
                <button
                    @click="$emit('showCrypto')"
                    class="nav-tab"
                    :class="{ 'active': !toggleMenu }"
                >
                    <Coins :size="20" />
                    <span>{{ $t('nav.cryptos') }}</span>
                </button>
            </div>
        </nav>
    </header>
</template>


<script>
import { ref, onMounted, computed } from "vue"
import { useI18n } from "vue-i18n"
import { getGlobalData, globalData, currency, getListCrypto } from "../store"
import { LayoutDashboard, Coins, Globe, ChevronDown } from 'lucide-vue-next'


export default {
    name: 'Nav',
    components: {
        LayoutDashboard,
        Coins,
        Globe,
        ChevronDown
    },
    props: {
        toggleMenu: {
            type: Boolean
        }
    },
    emits: ['showPortfolio', 'showCrypto'],

    setup() {
        const { locale } = useI18n()
        const langOpen = ref(false)
        const currencyOpen = ref(false)

        const currentLanguage = computed(() => locale.value)

        const selectLanguage = (lang) => {
            locale.value = lang
            langOpen.value = false
        }

        const selectCurrency = (curr) => {
            currency.value = curr
            currencyOpen.value = false
            getListCrypto(20)
        }

        onMounted(async () => {
            await getGlobalData();
        });

        return { globalData, currentLanguage, selectLanguage, langOpen, currency, selectCurrency, currencyOpen }
    }
}
</script>

<style scoped>
.nav-wrapper {
    width: 100%;
}

/* Ticker bar */
.ticker-bar {
    display: flex;
    align-items: center;
    padding: 0.5rem 1.5rem;
    border-bottom: 1px solid rgba(31, 41, 55, 0.25);
    font-size: 0.6875rem;
    color: #4b5563;
    background: rgba(10, 11, 15, 0.6);
}

.ticker-item {
    display: flex;
    align-items: center;
    gap: 0.375rem;
}

.ticker-label {
    color: #374151;
}

.ticker-value {
    color: #a3e635;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
}

.ticker-dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #1f2937;
}

.ticker-separator {
    color: #374151;
    margin: 0 0.125rem;
}

/* Selector buttons */
.selector-btn {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid transparent;
    background: transparent;
    color: #9ca3af;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: inherit;
}

.selector-btn:hover {
    background: rgba(31, 41, 55, 0.4);
    border-color: rgba(55, 65, 81, 0.3);
}

.selector-icon {
    font-size: 0.875rem;
    font-weight: 600;
    color: #d1d5db;
}

/* Main nav */
.main-nav {
    padding: 0 1.5rem;
    border-bottom: 1px solid rgba(31, 41, 55, 0.2);
}

.nav-tabs {
    display: flex;
    gap: 0;
}

.nav-tab {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 1rem 1.25rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #4b5563;
    background: none;
    border: none;
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease;
    font-family: inherit;
    letter-spacing: -0.01em;
}

.nav-tab:hover {
    color: #9ca3af;
}

.nav-tab.active {
    color: white;
}

.nav-tab.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0.5rem;
    right: 0.5rem;
    height: 2px;
    background: linear-gradient(90deg, #a3e635, #65a30d);
    border-radius: 2px 2px 0 0;
    box-shadow: 0 0 12px rgba(163, 230, 53, 0.4);
}

/* Dropdown active state */
.dropdown-item.active {
    background: rgba(31, 41, 55, 0.3);
    color: white;
}
</style>
