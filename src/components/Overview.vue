<template>
    <div class="overview-grid">
        <!-- Balance Card (Hero) -->
        <div class="glass-card-accent balance-card">
            <div class="balance-content">
                <div class="balance-header">
                    <div class="balance-icon-wrap">
                        <Wallet :size="20" />
                    </div>
                    <span class="stat-label" style="margin-bottom: 0;">{{ $t('overview.currentBalance') }}</span>
                </div>
                <h2 class="balance-value text-glow-green">{{ formattedBalance }}</h2>
            </div>
        </div>

        <!-- Invested Card -->
        <div class="glass-card stat-card">
            <div class="stat-card-inner">
                <div class="stat-card-header">
                    <div class="stat-icon-wrap blue">
                        <TrendingUp :size="18" />
                    </div>
                    <span class="stat-label" style="margin-bottom: 0;">{{ $t('overview.totalInvested') }}</span>
                </div>
                <span class="stat-value-sm text-white">{{ formattedInvested }}</span>
            </div>
        </div>

        <!-- P/L Card -->
        <div class="glass-card stat-card">
            <div class="stat-card-inner">
                <div class="stat-card-header">
                    <div class="stat-icon-wrap" :class="totalPL >= 0 ? 'green' : 'red'">
                        <ArrowUpRight v-if="totalPL >= 0" :size="18" />
                        <ArrowDownRight v-else :size="18" />
                    </div>
                    <span class="stat-label" style="margin-bottom: 0;">{{ $t('overview.totalProfitLoss') }}</span>
                </div>
                <div class="flex items-center gap-3">
                    <span class="stat-value-sm" :class="totalPL >= 0 ? 'text-green-400' : 'text-red-400'">
                        {{ formattedPL }}
                    </span>
                    <span class="badge" :class="totalPL >= 0 ? 'badge-green' : 'badge-red'" v-if="totalPLPercent !== 0">
                        {{ totalPL >= 0 ? '+' : '' }}{{ totalPLPercent.toFixed(2) }}%
                    </span>
                </div>
            </div>
        </div>

        <!-- Assets Count Card -->
        <div class="glass-card stat-card">
            <div class="stat-card-inner">
                <div class="stat-card-header">
                    <div class="stat-icon-wrap purple">
                        <Layers :size="18" />
                    </div>
                    <span class="stat-label" style="margin-bottom: 0;">{{ $t('overview.assets') }}</span>
                </div>
                <span class="stat-value-sm text-white">{{ assetCount }}</span>
            </div>
        </div>

        <!-- Treemap Chart -->
        <div class="glass-card chart-card">
            <div class="chart-header">
                <span class="stat-label">{{ $t('overview.allocation') }}</span>
            </div>
             <div v-if="hasData" class="chart-body">
                <apexchart type="treemap" height="100%" width="100%" :options="chartOptions" :series="series"></apexchart>
             </div>
             <div v-else class="chart-empty">
                <PieChart :size="24" class="text-gray-700" />
                <span class="text-gray-600 text-xs font-medium">No data to display</span>
             </div>
        </div>
    </div>
</template>

<script>
import { computed } from "vue";
import { balance, currency, aggregatedPortfolio } from "../store";
import VueApexCharts from "vue3-apexcharts";
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, Layers, PieChart } from 'lucide-vue-next';

export default {
    name: "Overview",
    components: {
        apexchart: VueApexCharts,
        Wallet,
        TrendingUp,
        ArrowUpRight,
        ArrowDownRight,
        Layers,
        PieChart
    },
    
    setup() {
        const hasData = computed(() => aggregatedPortfolio.value.length > 0);
        const assetCount = computed(() => aggregatedPortfolio.value.length);

        const totalInvested = computed(() => {
            return aggregatedPortfolio.value.reduce((acc, a) => acc + a.totalInvested, 0);
        });

        const totalPL = computed(() => {
            return balance.value - totalInvested.value;
        });

        const totalPLPercent = computed(() => {
            if (totalInvested.value === 0) return 0;
            return (totalPL.value / totalInvested.value) * 100;
        });

        const fmt = (val) => {
            return val.toLocaleString(currency.value === 'eur' ? 'fr-FR' : 'en-US', {
                style: 'currency',
                currency: currency.value.toUpperCase()
            });
        };

        const formattedBalance = computed(() => fmt(balance.value));
        const formattedInvested = computed(() => fmt(totalInvested.value));
        const formattedPL = computed(() => {
            const v = totalPL.value;
            return (v >= 0 ? '+' : '') + fmt(v);
        });

        const series = computed(() => {
            return [{
                data: aggregatedPortfolio.value.map((asset) => ({
                    x: asset.symbol.toUpperCase(),
                    y: asset.currentValue,
                })),
            }];
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
                colors: ["#a3e635", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"],
                plotOptions: {
                    treemap: {
                        distributed: true,
                        enableShades: false,
                        borderRadius: 6,
                    },
                },
                dataLabels: {
                    enabled: true,
                    style: {
                        fontSize: "13px",
                        fontWeight: "700",
                        fontFamily: 'Inter, sans-serif',
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
                    style: {
                        fontFamily: 'Inter, sans-serif',
                    },
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
                    width: 2,
                    colors: ["#08090d"]
                },
                grid: {
                    padding: { top: 0, right: 0, bottom: 0, left: 0 }
                }
            };
        });

        return { 
            balance, 
            currency, 
            series, 
            chartOptions, 
            hasData,
            formattedBalance,
            formattedInvested,
            formattedPL,
            totalPL,
            totalPLPercent,
            assetCount
        };
    },
}
</script>

<style scoped>
.overview-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: auto 1fr;
    gap: 1rem;
    padding: 1.5rem;
    width: 100%;
}

/* Balance card spans 1 col */
.balance-card {
    grid-column: 1;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.balance-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.balance-header {
    display: flex;
    align-items: center;
    gap: 0.625rem;
}

.balance-icon-wrap {
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    background: rgba(163, 230, 53, 0.1);
    color: #a3e635;
}

.balance-value {
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1;
}

/* Stat cards */
.stat-card {
    padding: 1.25rem;
}

.stat-card-inner {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.stat-card-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.stat-icon-wrap {
    width: 1.75rem;
    height: 1.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.375rem;
}

.stat-icon-wrap.blue {
    background: rgba(59, 130, 246, 0.1);
    color: #60a5fa;
}

.stat-icon-wrap.green {
    background: rgba(34, 197, 94, 0.1);
    color: #4ade80;
}

.stat-icon-wrap.red {
    background: rgba(239, 68, 68, 0.1);
    color: #f87171;
}

.stat-icon-wrap.purple {
    background: rgba(139, 92, 246, 0.1);
    color: #a78bfa;
}

/* Chart card spans full width */
.chart-card {
    grid-column: 1 / -1;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    min-height: 280px;
}

.chart-header {
    margin-bottom: 0.75rem;
}

.chart-body {
    flex: 1;
    min-height: 0;
}

.chart-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
}

/* ApexCharts override */
.chart-body :deep(.vue-apexcharts) {
    height: 100% !important;
}

/* Responsive */
@media (max-width: 1024px) {
    .overview-grid {
        grid-template-columns: 1fr 1fr;
    }
    .balance-card {
        grid-column: 1 / -1;
    }
    .chart-card {
        grid-column: 1 / -1;
    }
}

@media (max-width: 640px) {
    .overview-grid {
        grid-template-columns: 1fr;
        padding: 1rem;
    }
    .balance-value {
        font-size: 1.5rem;
    }
}
</style>
