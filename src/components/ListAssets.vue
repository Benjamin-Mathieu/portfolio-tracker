
<template>
    <div class="px-4 py-8 max-w-7xl mx-auto">
        <div class="flex items-center justify-between mb-8">
            <h3 class="text-2xl font-bold text-white">{{ $t('listAssets.yourAssets') }}</h3>
            <div class="flex gap-3">
                <button @click="openModal" class="btn-secondary flex items-center gap-2">
                    <PlusCircle class="h-4 w-4" />
                    {{ $t('overview.add') }}
                </button>
                <button @click="exportPortfolio" class="btn-secondary flex items-center gap-2">
                    <Download class="h-4 w-4" />
                    {{ $t('listAssets.export') }}
                </button>
                <label class="btn-secondary flex items-center gap-2 cursor-pointer">
                    <Upload class="h-4 w-4" />
                    {{ $t('listAssets.import') }}
                    <input type="file" @change="handleImport" accept=".json" class="hidden" />
                </label>
            </div>
        </div>

        <div v-if="aggregatedPortfolio.length === 0" class="text-center py-20 border-2 border-dashed border-gray-800 rounded-2xl">
            <p class="text-gray-500 text-lg">{{ $t('listAssets.noAssets') || "No assets added yet." }}</p>
        </div>

        <div v-else class="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-gray-800 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                        <th @click="handleSort('assetName')" class="p-4 cursor-pointer hover:text-white transition-colors">
                            <div class="flex items-center gap-2">
                                {{ $t('listAssets.asset') || "Asset" }}
                                <span v-if="sortBy === 'assetName'" class="text-crypto-green">                                <ChevronUp v-if="sortOrder === 'asc'" class="h-4 w-4 inline" /><ChevronDown v-else class="h-4 w-4 inline" /></span>
                            </div>
                        </th>
                        <th @click="handleSort('symbol')" class="p-4 cursor-pointer hover:text-white transition-colors">
                            <div class="flex items-center gap-2">
                                {{ $t('listAssets.symbol') }}
                                <span v-if="sortBy === 'symbol'" class="text-crypto-green">                                <ChevronUp v-if="sortOrder === 'asc'" class="h-4 w-4 inline" /><ChevronDown v-else class="h-4 w-4 inline" /></span>
                            </div>
                        </th>
                        <th @click="handleSort('totalQuantity')" class="p-4 cursor-pointer hover:text-white transition-colors">
                            <div class="flex items-center gap-2">
                                {{ $t('listAssets.quantity') }}
                                <span v-if="sortBy === 'totalQuantity'" class="text-crypto-green">                                <ChevronUp v-if="sortOrder === 'asc'" class="h-4 w-4 inline" /><ChevronDown v-else class="h-4 w-4 inline" /></span>
                            </div>
                        </th>
                        <th @click="handleSort('currentPrice')" class="p-4 cursor-pointer hover:text-white transition-colors">
                            <div class="flex items-center gap-2">
                                {{ $t('listAssets.currentPrice') || "Price" }}
                                <span v-if="sortBy === 'currentPrice'" class="text-crypto-green">                                <ChevronUp v-if="sortOrder === 'asc'" class="h-4 w-4 inline" /><ChevronDown v-else class="h-4 w-4 inline" /></span>
                            </div>
                        </th>
                        <th @click="handleSort('avgPrice')" class="p-4 cursor-pointer hover:text-white transition-colors">
                            <div class="flex items-center gap-2">
                                {{ $t('listAssets.avgPrice') }}
                                <span v-if="sortBy === 'avgPrice'" class="text-crypto-green">                                <ChevronUp v-if="sortOrder === 'asc'" class="h-4 w-4 inline" /><ChevronDown v-else class="h-4 w-4 inline" /></span>
                            </div>
                        </th>
                        <th @click="handleSort('totalInvested')" class="p-4 cursor-pointer hover:text-white transition-colors">
                            <div class="flex items-center gap-2">
                                {{ $t('listAssets.totalInvested') }}
                                <span v-if="sortBy === 'totalInvested'" class="text-crypto-green">                                <ChevronUp v-if="sortOrder === 'asc'" class="h-4 w-4 inline" /><ChevronDown v-else class="h-4 w-4 inline" /></span>
                            </div>
                        </th>
                        <th @click="handleSort('profitLoss')" class="p-4 cursor-pointer hover:text-white transition-colors">
                            <div class="flex items-center gap-2">
                                {{ $t('listAssets.profitLoss') || "P/L" }}
                                <span v-if="sortBy === 'profitLoss'" class="text-crypto-green">                                <ChevronUp v-if="sortOrder === 'asc'" class="h-4 w-4 inline" /><ChevronDown v-else class="h-4 w-4 inline" /></span>
                            </div>
                        </th>
                        <th class="p-4">{{ $t('listAssets.action') }}</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-800">
                    <template v-for="asset in sortedPortfolio" :key="asset.symbol">
                        <tr 
                            class="hover:bg-gray-800 cursor-pointer transition-colors duration-200 group" 
                            @click="toggleDetails(asset.symbol)"
                        >
                            <td class="p-4">
                                <div class="flex items-center gap-3">
                                    <img v-if="asset.image" :src="asset.image" class="w-8 h-8 rounded-full" />
                                    <span class="font-semibold text-white">{{ asset.assetName }}</span>
                                </div>
                            </td>
                            <td class="p-4 text-gray-400 font-medium">{{ asset.symbol }}</td>
                            <td class="p-4 text-white font-medium">{{ formatCrypto(asset.totalQuantity) }}</td>
                            <td class="p-4 text-white font-medium">{{ formatCurrency(asset.currentPrice) }}</td>
                            <td class="p-4 text-white font-medium">{{ formatCurrency(asset.avgPrice) }}</td>
                            <td class="p-4 text-white font-medium">{{ formatCurrency(asset.totalInvested) }}</td>
                            <td class="p-4">
                                <div :class="[asset.profitLoss >= 0 ? 'text-green-400' : 'text-red-400', 'flex flex-col']">
                                    <span class="font-bold">{{ formatCurrency(asset.profitLoss) }}</span>
                                    <span class="text-xs opacity-80">{{ asset.profitLossPercentage.toFixed(2) }}%</span>
                                </div>
                            </td>
                            <td class="p-4">
                                <ChevronDown 
                                    class="h-5 w-5 text-gray-600 group-hover:text-white transition-transform duration-300"
                                    :class="{ 'rotate-180': expandedAssets.includes(asset.symbol) }"
                                />
                            </td>
                        </tr>
                        <tr v-if="expandedAssets.includes(asset.symbol)">
                            <td colspan="8" class="p-0 bg-gray-800">
                                <div class="px-8 py-4 space-y-2 border-l-2 border-crypto-green ml-4 my-2">
                                    <div v-for="t in asset.transactions" :key="t.id" class="flex items-center justify-between py-2 border-b border-gray-700 transaction-item">
                                        <div class="flex gap-8 text-sm">
                                            <span class="text-gray-500 w-24">{{ formatDate(t.timestamp) }}</span>
                                            <span class="text-white font-medium w-32">{{ formatCrypto(t.quantity) }} {{ t.symbol }}</span>
                                            <span class="text-gray-400">@ {{ formatCurrency(t.purchasePrice) }}</span>
                                        </div>
                                        <div class="flex gap-2 t-actions">
                                            <button @click.stop="startEdit(t)" class="p-2 hover:bg-gray-800 rounded-md text-gray-400 hover:text-blue-400 transition-colors">
                                                <Pencil class="h-4 w-4" />
                                            </button>
                                            <button @click.stop="confirmDelete(t.id)" class="p-2 hover:bg-gray-800 rounded-md text-gray-400 hover:text-red-400 transition-colors">
                                                <Trash2 class="h-4 w-4" />
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

        <teleport v-if="editingTransaction" to="body">
            <div class="modal-overlay">
                <div class="modal-box w-full max-w-md">
                    <h3 class="text-xl font-bold text-white mb-6">{{ $t('listAssets.edit') }} {{ editingTransaction.assetName }}</h3>
                    <div class="space-y-4">
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-gray-400">{{ $t('modal.quantity') }}</label>
                            <input type="number" step="any" v-model="editingTransaction.quantity" class="input-field" />
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-gray-400">{{ $t('modal.pricePerCoin') }}</label>
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
import { aggregatedPortfolio, deleteTransaction, editTransaction, exportPortfolio, importPortfolio } from "../store";
import { Download, Upload, ChevronDown, ChevronUp, Pencil, Trash2, PlusCircle } from 'lucide-vue-next';
import Modal from "./ModalAddAsset.vue";

export default {
    name: 'ListAssets',
    components: { Download, Upload, ChevronDown, ChevronUp, Pencil, Trash2, PlusCircle, Modal },
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
            return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val);
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
.t-actions {
    opacity: 0;
    transition: opacity 0.2s ease;
}
.transaction-item:hover .t-actions {
    opacity: 1;
}
</style>
