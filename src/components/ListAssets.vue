<template>
    <div class="px-6 pb-8 max-w-7xl mx-auto w-full">
        <!-- Section header -->
        <div class="flex items-center justify-between mb-5">
            <h3 class="text-base font-semibold text-white tracking-tight flex items-center gap-2.5">
                <div class="section-indicator"></div>
                {{ $t('listAssets.yourAssets') }}
                <span v-if="aggregatedPortfolio.length > 0" class="asset-count">{{ aggregatedPortfolio.length }}</span>
            </h3>
            <div class="flex gap-2">
                <button @click="openModal" class="btn-primary" style="padding: 0.5rem 1rem; font-size: 0.75rem;">
                    <PlusCircle class="h-3.5 w-3.5" />
                    {{ $t('overview.add') }}
                </button>
                <button @click="exportPortfolio" class="btn-secondary" style="padding: 0.5rem 0.875rem; font-size: 0.75rem;">
                    <Download class="h-3.5 w-3.5" />
                    {{ $t('listAssets.export') }}
                </button>
                <label class="btn-secondary cursor-pointer" style="padding: 0.5rem 0.875rem; font-size: 0.75rem;">
                    <Upload class="h-3.5 w-3.5" />
                    {{ $t('listAssets.import') }}
                    <input type="file" @change="handleImport" accept=".json" class="hidden" />
                </label>
            </div>
        </div>

        <!-- Empty state -->
        <div v-if="aggregatedPortfolio.length === 0" class="empty-state">
            <div class="empty-state-icon">
                <Layers :size="24" />
            </div>
            <h3>{{ $t('listAssets.noAssets') }}</h3>
            <p>{{ $t('listAssets.noAssetsDescription') }}</p>
            <button @click="openModal" class="btn-primary" style="margin-top: 1.25rem; font-size: 0.75rem;">
                <PlusCircle class="h-4 w-4" />
                {{ $t('listAssets.addFirst') }}
            </button>
        </div>

        <!-- Table -->
        <div v-else class="glass-card overflow-hidden" style="padding: 0;">
            <table class="data-table">
                <thead>
                    <tr>
                        <th @click="handleSort('assetName')" class="cursor-pointer group">
                            <div class="th-inner">
                                {{ $t('listAssets.asset') }}
                                <span v-if="sortBy === 'assetName'" class="sort-icon">
                                    <ChevronUp v-if="sortOrder === 'asc'" class="h-3 w-3" />
                                    <ChevronDown v-else class="h-3 w-3" />
                                </span>
                            </div>
                        </th>
                        <th @click="handleSort('currentPrice')" class="cursor-pointer">
                            <div class="th-inner">
                                {{ $t('listAssets.currentPrice') }}
                                <span v-if="sortBy === 'currentPrice'" class="sort-icon">
                                    <ChevronUp v-if="sortOrder === 'asc'" class="h-3 w-3" />
                                    <ChevronDown v-else class="h-3 w-3" />
                                </span>
                            </div>
                        </th>
                        <th @click="handleSort('totalQuantity')" class="cursor-pointer">
                            <div class="th-inner">
                                {{ $t('listAssets.quantity') }}
                                <span v-if="sortBy === 'totalQuantity'" class="sort-icon">
                                    <ChevronUp v-if="sortOrder === 'asc'" class="h-3 w-3" />
                                    <ChevronDown v-else class="h-3 w-3" />
                                </span>
                            </div>
                        </th>
                        <th @click="handleSort('avgPrice')" class="cursor-pointer">
                            <div class="th-inner">
                                {{ $t('listAssets.avgPrice') }}
                                <span v-if="sortBy === 'avgPrice'" class="sort-icon">
                                    <ChevronUp v-if="sortOrder === 'asc'" class="h-3 w-3" />
                                    <ChevronDown v-else class="h-3 w-3" />
                                </span>
                            </div>
                        </th>
                        <th @click="handleSort('totalInvested')" class="cursor-pointer">
                            <div class="th-inner">
                                {{ $t('listAssets.totalInvested') }}
                                <span v-if="sortBy === 'totalInvested'" class="sort-icon">
                                    <ChevronUp v-if="sortOrder === 'asc'" class="h-3 w-3" />
                                    <ChevronDown v-else class="h-3 w-3" />
                                </span>
                            </div>
                        </th>
                        <th @click="handleSort('profitLoss')" class="cursor-pointer">
                            <div class="th-inner">
                                {{ $t('listAssets.profitLoss') }}
                                <span v-if="sortBy === 'profitLoss'" class="sort-icon">
                                    <ChevronUp v-if="sortOrder === 'asc'" class="h-3 w-3" />
                                    <ChevronDown v-else class="h-3 w-3" />
                                </span>
                            </div>
                        </th>
                        <th style="width: 3rem;"></th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="asset in sortedPortfolio" :key="asset.symbol">
                        <tr 
                            class="cursor-pointer group"
                            @click="toggleDetails(asset.symbol)"
                        >
                            <td>
                                <div class="flex items-center gap-3">
                                    <img v-if="asset.image" :src="asset.image" class="asset-img" />
                                    <div class="flex flex-col">
                                        <span class="font-semibold text-white text-sm">{{ asset.assetName }}</span>
                                        <span class="text-gray-600 text-xs font-medium uppercase">{{ asset.symbol }}</span>
                                    </div>
                                </div>
                            </td>
                            <td class="text-white font-medium text-sm tabular-nums">{{ formatCurrency(asset.currentPrice) }}</td>
                            <td class="text-gray-300 font-medium text-sm tabular-nums">{{ formatCrypto(asset.totalQuantity) }}</td>
                            <td class="text-gray-400 text-sm tabular-nums">{{ formatCurrency(asset.avgPrice) }}</td>
                            <td class="text-white font-medium text-sm tabular-nums">{{ formatCurrency(asset.totalInvested) }}</td>
                            <td>
                                <div class="flex flex-col">
                                    <span class="text-sm font-bold tabular-nums" :class="asset.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'">
                                        {{ formatCurrency(asset.profitLoss) }}
                                    </span>
                                    <span class="text-xs tabular-nums" :class="asset.profitLossPercentage >= 0 ? 'text-green-400' : 'text-red-400'" style="opacity: 0.7;">
                                        {{ asset.profitLossPercentage >= 0 ? '+' : '' }}{{ asset.profitLossPercentage.toFixed(2) }}%
                                    </span>
                                </div>
                            </td>
                            <td>
                                <ChevronDown 
                                    class="h-4 w-4 text-gray-700 group-hover:text-gray-500 transition-all duration-300"
                                    :class="{ 'rotate-180 text-gray-500': expandedAssets.includes(asset.symbol) }"
                                />
                            </td>
                        </tr>

                        <!-- Expanded detail row -->
                        <tr v-if="expandedAssets.includes(asset.symbol)" class="expanded-row">
                            <td colspan="7" style="padding: 0;">
                                <div class="expanded-content">
                                    <div v-for="t in asset.transactions" :key="t.id" class="transaction-row">
                                        <div class="flex gap-6 items-center text-sm">
                                            <span class="text-gray-600 text-xs w-20 tabular-nums">{{ formatDate(t.timestamp) }}</span>
                                            <span class="text-white font-medium tabular-nums">{{ formatCrypto(t.quantity) }} <span class="text-gray-500">{{ t.symbol }}</span></span>
                                            <span class="text-gray-500">@</span>
                                            <span class="text-gray-400 tabular-nums">{{ formatCurrency(t.purchasePrice) }}</span>
                                        </div>
                                        <div class="flex gap-1 t-actions">
                                            <button @click.stop="startEdit(t)" class="action-btn edit">
                                                <Pencil class="h-3.5 w-3.5" />
                                            </button>
                                            <button @click.stop="confirmDelete(t.id)" class="action-btn delete">
                                                <Trash2 class="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>

        <!-- Edit modal -->
        <teleport v-if="editingTransaction" to="body">
            <div class="modal-overlay">
                <div class="modal-box w-full max-w-md">
                    <h3 class="text-lg font-bold text-white mb-6">{{ $t('listAssets.edit') }} {{ editingTransaction.assetName }}</h3>
                    <div class="space-y-4">
                        <div class="space-y-2">
                            <label class="stat-label">{{ $t('modal.quantity') }}</label>
                            <input type="number" step="any" v-model="editingTransaction.quantity" class="input-field" />
                        </div>
                        <div class="space-y-2">
                            <label class="stat-label">{{ $t('modal.pricePerCoin') }}</label>
                            <input type="number" step="any" v-model="editingTransaction.purchasePrice" class="input-field" />
                        </div>
                    </div>
                    <div class="flex justify-end gap-3 mt-8">
                        <button @click="editingTransaction = null" class="btn-secondary">{{ $t('modal.cancel') }}</button>
                        <button @click="saveEdit" class="btn-primary">{{ $t('modal.save') }}</button>
                    </div>
                </div>
            </div>
        </teleport>
    </div>
    
    <Modal :show="modalOpened" @closeModal="modalOpened = false"></Modal>
</template>

<script>
import { ref, computed } from "vue";
import { aggregatedPortfolio, deleteTransaction, editTransaction, exportPortfolio, importPortfolio, currency } from "../store";
import { Download, Upload, ChevronDown, ChevronUp, Pencil, Trash2, PlusCircle, Layers } from 'lucide-vue-next';
import Modal from "./ModalAddAsset.vue";

export default {
    name: 'ListAssets',
    components: { Download, Upload, ChevronDown, ChevronUp, Pencil, Trash2, PlusCircle, Layers, Modal },
    setup() {
        const modalOpened = ref(false);
        const expandedAssets = ref([]);
        const editingTransaction = ref(null);
        const sortBy = ref('totalInvested');
        const sortOrder = ref('desc');

        const sortedPortfolio = computed(() => {
            const sorted = [...aggregatedPortfolio.value];
            sorted.sort((a, b) => {
                let valA = a[sortBy.value];
                let valB = b[sortBy.value];
                
                if (typeof valA === 'string') {
                    valA = valA.toLowerCase();
                    valB = valB.toLowerCase();
                }

                if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1;
                if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1;
                return 0;
            });
            return sorted;
        });

        const handleSort = (field) => {
            if (sortBy.value === field) {
                sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
            } else {
                sortBy.value = field;
                sortOrder.value = 'desc';
            }
        };

        const toggleDetails = (symbol) => {
            const index = expandedAssets.value.indexOf(symbol);
            if (index > -1) {
                expandedAssets.value.splice(index, 1);
            } else {
                expandedAssets.value.push(symbol);
            }
        };

        const formatCurrency = (val) => {
            return new Intl.NumberFormat(currency.value === 'eur' ? 'fr-FR' : 'en-US', { style: 'currency', currency: currency.value.toUpperCase() }).format(val);
        };

        const formatCrypto = (val) => {
            return parseFloat(val).toFixed(8).replace(/\.?0+$/, "");
        };

        const formatDate = (isoStr) => {
            return new Date(isoStr).toLocaleDateString();
        };

        const confirmDelete = (id) => {
            if (confirm("Are you sure you want to delete this transaction?")) {
                deleteTransaction(id);
            }
        };

        const startEdit = (t) => {
            editingTransaction.value = { ...t };
        };

        const saveEdit = () => {
            if (editingTransaction.value) {
                editTransaction(editingTransaction.value.id, {
                    quantity: parseFloat(editingTransaction.value.quantity),
                    purchasePrice: parseFloat(editingTransaction.value.purchasePrice)
                });
                editingTransaction.value = null;
            }
        };

        const handleImport = (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                const success = importPortfolio(e.target.result);
                if (success) {
                    alert("Portfolio imported successfully!");
                } else {
                    alert("Failed to import portfolio. Please check the file format.");
                }
            };
            reader.readAsText(file);
        };

        const openModal = () => {
             modalOpened.value = true;
        };

        return { 
            aggregatedPortfolio, 
            sortedPortfolio,
            sortBy,
            sortOrder,
            handleSort,
            expandedAssets, 
            editingTransaction,
            toggleDetails, 
            formatCurrency, 
            formatCrypto,
            formatDate,
            confirmDelete,
            startEdit,
            saveEdit,
            exportPortfolio,
            handleImport,
            modalOpened,
            openModal
        }
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

.th-inner {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    user-select: none;
}

.th-inner:hover {
    color: #9ca3af;
}

.sort-icon {
    color: #a3e635;
}

.asset-img {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: 1px solid rgba(55, 65, 81, 0.3);
}

.tabular-nums {
    font-variant-numeric: tabular-nums;
}

.expanded-row td {
    background: rgba(10, 11, 15, 0.5);
}

.expanded-content {
    padding: 0.5rem 1.25rem 0.5rem 3.5rem;
    border-left: 2px solid rgba(163, 230, 53, 0.2);
    margin-left: 1.25rem;
}

.transaction-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.625rem 0;
    border-bottom: 1px solid rgba(31, 41, 55, 0.15);
}

.transaction-row:last-child {
    border-bottom: none;
}

.t-actions {
    opacity: 0;
    transition: opacity 0.2s ease;
}

.transaction-row:hover .t-actions {
    opacity: 1;
}

.action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.375rem;
    border-radius: 0.375rem;
    border: none;
    background: transparent;
    cursor: pointer;
    color: #4b5563;
    transition: all 0.2s ease;
}

.action-btn.edit:hover {
    color: #60a5fa;
    background: rgba(59, 130, 246, 0.08);
}

.action-btn.delete:hover {
    color: #f87171;
    background: rgba(239, 68, 68, 0.08);
}
</style>
