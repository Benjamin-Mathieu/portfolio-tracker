
<template>
    <div class="flex flex-col md:flex-row items-center justify-between gap-6 px-4 py-8">
        <div class="bg-gray-900 border border-crypto-green rounded-2xl p-6 flex flex-col items-center md:items-start transition-all duration-300 hover:shadow-lg">
            <span class="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">{{ $t('overview.currentBalance') }}</span>
            <h2 class="text-4xl font-bold text-crypto-green">{{ balance.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) }}</h2>
        </div>
    </div>
</template>

<script>
import { balance } from "../store"

export default {
    name: "Overview",
    
    setup() {
        return { balance };
    },
}
</script>

<style scoped>
</style>
