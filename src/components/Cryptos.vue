
<template>
    <section class="px-4 py-8 max-w-5xl mx-auto">
        <div class="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-gray-800 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                        <th class="p-4 w-16 text-center">#</th>
                        <th class="p-4">{{ $t('cryptos.coin') }}</th>
                        <th class="p-4 text-right">{{ $t('cryptos.currentPrice') }}</th>
                        <th class="p-4 text-right">{{ $t('cryptos.h24') }}</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-800">
                    <tr class="hover:bg-gray-800 transition-colors duration-200" v-for="crypto in cryptos" :key="crypto.id">
                        <td class="p-4 text-center text-gray-500 font-medium">{{ crypto.market_cap_rank }}</td>
                        <td class="p-4">
                            <div class="flex items-center gap-3">
                                <img class="w-8 h-8 rounded-full" :src="crypto.image" />
                                <span class="font-semibold text-white">{{ crypto.name }}</span>
                            </div>
                        </td>
                        <td class="p-4 text-right text-white font-medium">
                            {{ crypto.current_price.toLocaleString(currency === 'eur' ? 'fr-FR' : 'en-US', { style: 'currency', currency: currency.toUpperCase() }) }}
                        </td>
                        <td class="p-4 text-right">
                            <span
                                :class="crypto.price_change_percentage_24h > 0 ? 'text-green-400' : 'text-red-400'"
                                class="font-bold flex items-center justify-end gap-1"
                            >
                                <svg v-if="crypto.price_change_percentage_24h > 0" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                                </svg>
                                {{ Math.abs(crypto.price_change_percentage_24h).toFixed(2) }}%
                            </span>
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
</style>
