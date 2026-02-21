<template>
    <section class="px-6 py-4 max-w-7xl mx-auto w-full">
        <!-- Section header -->
        <div class="flex items-center gap-2.5 mb-5 px-1">
            <div class="section-indicator"></div>
            <h3 class="text-base font-semibold text-white tracking-tight">{{ $t('nav.cryptos') }}</h3>
            <span class="asset-count">{{ cryptos.length }}</span>
        </div>

        <div class="glass-card overflow-hidden" style="padding: 0;">
            <table class="data-table">
                <thead>
                    <tr>
                        <th style="width: 3.5rem; text-align: center;">#</th>
                        <th>{{ $t('cryptos.coin') }}</th>
                        <th style="text-align: right;">{{ $t('cryptos.currentPrice') }}</th>
                        <th style="text-align: right;">{{ $t('cryptos.h24') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr 
                        v-for="crypto in cryptos" 
                        :key="crypto.id"
                    >
                        <td class="text-center text-gray-600 text-xs font-medium tabular-nums">{{ crypto.market_cap_rank }}</td>
                        <td>
                            <div class="flex items-center gap-3">
                                <img class="crypto-img" :src="crypto.image" />
                                <div class="flex flex-col">
                                    <span class="font-semibold text-white text-sm">{{ crypto.name }}</span>
                                    <span class="text-gray-600 text-xs font-medium uppercase">{{ crypto.symbol }}</span>
                                </div>
                            </div>
                        </td>
                        <td class="text-right text-white font-medium text-sm tabular-nums">
                            {{ crypto.current_price.toLocaleString(currency === 'eur' ? 'fr-FR' : 'en-US', { style: 'currency', currency: currency.toUpperCase() }) }}
                        </td>
                        <td class="text-right">
                            <div class="flex items-center justify-end gap-1.5">
                                <span
                                    :class="crypto.price_change_percentage_24h > 0 ? 'change-positive' : 'change-negative'"
                                    class="change-badge"
                                >
                                    <svg v-if="crypto.price_change_percentage_24h > 0" width="10" height="10" viewBox="0 0 10 10" fill="none">
                                        <path d="M5 2L8 6H2L5 2Z" fill="currentColor"/>
                                    </svg>
                                    <svg v-else width="10" height="10" viewBox="0 0 10 10" fill="none">
                                        <path d="M5 8L2 4H8L5 8Z" fill="currentColor"/>
                                    </svg>
                                    {{ Math.abs(crypto.price_change_percentage_24h).toFixed(2) }}%
                                </span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<script>
import { getListCrypto, cryptos, currency } from "../store"

export default {
    name: 'Cryptos',
    setup() {
        getListCrypto(20);

        return { cryptos, currency }
    }
}
</script>

<style scoped>
.section-indicator {
    width: 3px;
    height: 1rem;
    border-radius: 2px;
    background: linear-gradient(180deg, #a3e635, #65a30d);
}

.asset-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.375rem;
    height: 1.375rem;
    border-radius: 0.375rem;
    background: rgba(163, 230, 53, 0.1);
    color: #a3e635;
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 0 0.375rem;
}

.crypto-img {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: 1px solid rgba(55, 65, 81, 0.3);
}

.tabular-nums {
    font-variant-numeric: tabular-nums;
}

.change-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.625rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
}

.change-positive {
    color: #4ade80;
    background: rgba(34, 197, 94, 0.08);
}

.change-negative {
    color: #f87171;
    background: rgba(239, 68, 68, 0.08);
}
</style>
