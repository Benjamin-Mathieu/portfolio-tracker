
<template>
    <div class="flex flex-col lg:flex-row items-stretch justify-between gap-6 px-4 py-8">
        <!-- Balance Card -->
        <div class="bg-gray-900 border border-crypto-green rounded-2xl p-6 flex flex-col justify-center items-center md:items-start transition-all duration-300 hover:shadow-lg lg:w-1/3">
            <span class="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">{{ $t('overview.currentBalance') }}</span>
            <h2 class="text-4xl font-bold text-crypto-green">{{ formattedBalance }}</h2>
        </div>

        <!-- Treemap Chart -->
        <div class="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex-grow lg:w-2/3 h-64 lg:h-auto min-h-[250px] relative overflow-hidden group hover:border-crypto-green transition-all duration-300">
             <div v-if="hasData" class="w-full h-full"> 
                <apexchart type="treemap" height="100%" width="100%" :options="chartOptions" :series="series"></apexchart>
             </div>
             <div v-else class="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                No assets to display
             </div>
        </div>
    </div>
</template>

<script>
import { computed } from "vue";
import { balance, currency, aggregatedPortfolio } from "../store";
import VueApexCharts from "vue3-apexcharts";

export default {
    name: "Overview",
    components: {
        apexchart: VueApexCharts,
    },
    
    setup() {
        const hasData = computed(() => aggregatedPortfolio.value.length > 0);

        const formattedBalance = computed(() => {
            return balance.value.toLocaleString(currency.value === 'eur' ? 'fr-FR' : 'en-US', { 
                style: 'currency', 
                currency: currency.value.toUpperCase() 
            });
        });

        const series = computed(() => {
            return [
                {
                    data: aggregatedPortfolio.value.map((asset) => ({
                        x: asset.symbol.toUpperCase(),
                        y: asset.currentValue,
                    })),
                },
            ];
        });

        const chartOptions = computed(() => {
            const curr = currency.value;
            const total = balance.value;
            return {
                chart: {
                    type: "treemap",
                    background: "transparent",
                    toolbar: { show: false },
                    animations: {
                        enabled: true,
                        easing: 'easeinout',
                        speed: 800,
                    }
                },
                theme: { mode: "dark" },
                colors: ["#10B981", "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899", "#F59E0B", "#EF4444"],
                plotOptions: {
                    treemap: {
                        distributed: true,
                        enableShades: false,
                        borderRadius: 4,
                    },
                },
                dataLabels: {
                    enabled: true,
                    style: {
                        fontSize: "14px",
                        fontWeight: "bold",
                        colors: ["#fff"],
                    },
                    offsetY: -4,
                    formatter: function(text, op) {
                        const value = op.value;
                        const percent = total > 0 ? (value / total * 100).toFixed(1) : 0;
                        return [text, percent + "%"];
                    }
                },
                tooltip: {
                    theme: 'dark',
                    y: {
                        formatter: function (value) {
                            return value.toLocaleString(curr === 'eur' ? 'fr-FR' : 'en-US', {
                                style: "currency",
                                currency: curr.toUpperCase(),
                            });
                        },
                    },
                },
                stroke: {
                    width: 1,
                    colors: ["#111827"] // Match bg-gray-900
                },
                grid: {
                    padding: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    }
                }
            };
        });

        return { 
            balance, 
            currency, 
            series, 
            chartOptions, 
            hasData,
            formattedBalance
        };
    },
}
</script>

<style scoped>
/* Ensure chart container takes full height */
.vue-apexcharts {
    height: 100% !important;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
