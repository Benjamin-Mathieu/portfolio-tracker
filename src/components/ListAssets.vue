
<template>
    <div class="list">
        <div class="header-actions">
            <h3>{{ $t('listAssets.yourAssets') }}</h3>
            <div class="data-actions">
                <button @click="exportPortfolio" class="btn-secondary">{{ $t('listAssets.export') }}</button>
                <label class="btn-secondary import-label">
                    {{ $t('listAssets.import') }}
                    <input type="file" @change="handleImport" accept=".json" style="display: none;" />
                </label>
            </div>
        </div>

        <div v-if="aggregatedPortfolio.length === 0" class="empty-state">
            <p>{{ $t('listAssets.noAssets') || "No assets added yet." }}</p>
        </div>

        <div v-else class="portfolio-container">
            <table class="portfolio-table">
                <thead>
                    <tr>
                        <th @click="handleSort('assetName')" class="sortable">
                            {{ $t('listAssets.asset') || "Asset" }}
                            <span v-if="sortBy === 'assetName'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
                        </th>
                        <th @click="handleSort('symbol')" class="sortable">
                            {{ $t('listAssets.symbol') }}
                            <span v-if="sortBy === 'symbol'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
                        </th>
                        <th @click="handleSort('totalQuantity')" class="sortable">
                            {{ $t('listAssets.quantity') }}
                            <span v-if="sortBy === 'totalQuantity'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
                        </th>
                        <th @click="handleSort('currentPrice')" class="sortable">
                            {{ $t('listAssets.currentPrice') || "Price" }}
                            <span v-if="sortBy === 'currentPrice'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
                        </th>
                        <th @click="handleSort('avgPrice')" class="sortable">
                            {{ $t('listAssets.avgPrice') }}
                            <span v-if="sortBy === 'avgPrice'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
                        </th>
                        <th @click="handleSort('totalInvested')" class="sortable">
                            {{ $t('listAssets.totalInvested') }}
                            <span v-if="sortBy === 'totalInvested'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
                        </th>
                        <th @click="handleSort('profitLoss')" class="sortable">
                            {{ $t('listAssets.profitLoss') || "P/L" }}
                            <span v-if="sortBy === 'profitLoss'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
                        </th>
                        <th>{{ $t('listAssets.action') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="asset in sortedPortfolio" :key="asset.symbol">
                        <tr class="asset-row" @click="toggleDetails(asset.symbol)">
                            <td class="asset-name-cell">
                                <img v-if="asset.image" :src="asset.image" class="asset-logo" />
                                <span>{{ asset.assetName }}</span>
                            </td>
                            <td>{{ asset.symbol }}</td>
                            <td>{{ formatCrypto(asset.totalQuantity) }}</td>
                            <td>{{ formatCurrency(asset.currentPrice) }}</td>
                            <td>{{ formatCurrency(asset.avgPrice) }}</td>
                            <td>{{ formatCurrency(asset.totalInvested) }}</td>
                            <td :class="['pl-cell', asset.profitLoss >= 0 ? 'profit' : 'loss']">
                                <div class="pl-values">
                                    <span>{{ formatCurrency(asset.profitLoss) }}</span>
                                    <span class="pl-percent">({{ asset.profitLossPercentage.toFixed(2) }}%)</span>
                                </div>
                            </td>
                            <td>
                                <span class="toggle-icon">{{ expandedAssets.includes(asset.symbol) ? '▼' : '▶' }}</span>
                            </td>
                        </tr>
                        <tr v-if="expandedAssets.includes(asset.symbol)" class="details-row">
                            <td colspan="8">
                                <div class="transactions-list">
                                    <div v-for="t in asset.transactions" :key="t.id" class="transaction-item">
                                        <div class="t-info">
                                            <span class="t-date">{{ formatDate(t.timestamp) }}</span>
                                            <span class="t-qty">{{ formatCrypto(t.quantity) }} {{ t.symbol }}</span>
                                            <span class="t-price">@ {{ formatCurrency(t.purchasePrice) }}</span>
                                        </div>
                                        <div class="t-actions">
                                            <button @click.stop="startEdit(t)" class="btn-icon">✏️</button>
                                            <button @click.stop="confirmDelete(t.id)" class="btn-icon btn-delete">🗑️</button>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>

        <!-- Edit Modal (Simple Inline or Separate) -->
        <teleport v-if="editingTransaction" to="body">
            <div class="modal edit-modal">
                <div class="modal-content">
                    <h3>{{ $t('listAssets.edit') }} {{ editingTransaction.assetName }}</h3>
                    <div class="inputs">
                        <label>{{ $t('modal.quantity') }}</label>
                        <input type="number" step="any" v-model="editingTransaction.quantity" />
                        <label>{{ $t('modal.pricePerCoin') }}</label>
                        <input type="number" step="any" v-model="editingTransaction.purchasePrice" />
                    </div>
                    <div class="actions">
                        <button @click="editingTransaction = null" class="btn-cancel">{{ $t('modal.cancel') }}</button>
                        <button @click="saveEdit" class="btn-submit">{{ $t('modal.save') }}</button>
                    </div>
                </div>
            </div>
        </teleport>
    </div>
</template>

<script>
import { ref, computed } from "vue";
import { aggregatedPortfolio, deleteTransaction, editTransaction, exportPortfolio, importPortfolio } from "../store";

export default {
    name: 'ListAssets',
    setup() {
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
            handleImport
        }
    }
}
</script>

<style scoped lang="scss">
.list {
    margin: 2rem auto;
    max-width: 1000px;
    padding: 1rem;
    color: white;

    .header-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;

        h3 {
            margin: 0;
            font-size: 1.5rem;
        }

        .data-actions {
            display: flex;
            gap: 0.5rem;
        }
    }

    .btn-secondary {
        background: #333;
        color: white;
        border: 1px solid #444;
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        &:hover {
            background: #444;
        }
    }

    .import-label {
        display: inline-block;
    }

    .portfolio-table {
        width: 100%;
        border-collapse: collapse;
        text-align: left;

        th {
            padding: 1rem;
            border-bottom: 2px solid #333;
            color: #aaa;
            font-weight: 500;

            &.sortable {
                cursor: pointer;
                &:hover {
                    color: white;
                }
            }
        }

        .asset-row {
            cursor: pointer;
            &:hover {
                background: #111;
            }
            td {
                padding: 1rem;
                border-bottom: 1px solid #222;
            }
        }

        .asset-name-cell {
            display: flex;
            align-items: center;
            gap: 0.8rem;

            .asset-logo {
                width: 24px;
                height: 24px;
            }
        }

        .pl-cell {
            &.profit {
                color: #4caf50;
            }
            &.loss {
                color: #f44336;
            }

            .pl-values {
                display: flex;
                flex-direction: column;
                .pl-percent {
                    font-size: 0.8rem;
                    opacity: 0.8;
                }
            }
        }

        .toggle-icon {
            font-size: 0.8rem;
            color: #666;
        }
    }

    .details-row {
        background: #0a0a0a;
        td {
            padding: 0;
        }
    }

    .transactions-list {
        padding: 0.5rem 2rem;
        border-bottom: 1px solid #222;

        .transaction-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0;
            border-bottom: 1px solid #1a1a1a;
            &:last-child {
                border-bottom: none;
            }

            .t-info {
                display: flex;
                gap: 1.5rem;
                font-size: 0.9rem;
                .t-date { color: #666; width: 100px; }
                .t-qty { font-weight: 500; width: 150px; }
                .t-price { color: #888; }
            }

            .t-actions {
                display: flex;
                gap: 0.5rem;
            }
        }
    }

    .btn-icon {
        background: transparent;
        border: none;
        cursor: pointer;
        font-size: 1rem;
        opacity: 0.6;
        &:hover {
            opacity: 1;
        }
        &.btn-delete:hover {
            filter: hue-rotate(300deg);
        }
    }
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100000;

    .modal-content {
        background: #111;
        padding: 2rem;
        border-radius: 8px;
        width: 300px;
        color: white;

        .inputs {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin: 1rem 0;

            input {
                background: #222;
                border: 1px solid #444;
                color: white;
                padding: 0.5rem;
                border-radius: 4px;
            }
        }

        .actions {
            display: flex;
            justify-content: flex-end;
            gap: 0.5rem;
        }
    }
}

.btn-cancel {
    background: #333;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
}

.btn-submit {
    background: #4caf50;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    &:disabled {
        background: #2e5a2f;
        cursor: not-allowed;
    }
}

.empty-state {
    text-align: center;
    padding: 3rem;
    color: #666;
    border: 2px dashed #222;
    border-radius: 8px;
}
</style>
