import { reactive, ref, computed } from 'vue';
import axios from 'axios';

const URL_API = 'https://api.coingecko.com/api/v3';

export const currency = ref('eur');
export const curs_sym = computed(() => currency.value === 'eur' ? '€' : '$');

export const cryptos = ref([]);
export const queryCryptos = ref([]);
export const globalData = ref([]);

// Transactions state with local storage persistence
const savedTransactions = localStorage.getItem('transactions');
export const transactions = ref(savedTransactions ? JSON.parse(savedTransactions) : []);

export const saveTransactions = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions.value));
};

export const addTransaction = (transaction) => {
    transactions.value.push({
        ...transaction,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
    });
    saveTransactions();
};

export const deleteTransaction = (id) => {
    transactions.value = transactions.value.filter(t => t.id !== id);
    saveTransactions();
};

export const editTransaction = (id, updatedData) => {
    const index = transactions.value.findIndex(t => t.id === id);
    if (index !== -1) {
        transactions.value[index] = { ...transactions.value[index], ...updatedData };
        saveTransactions();
    }
};

export const importPortfolio = (data) => {
    try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
            transactions.value = parsed;
            saveTransactions();
            return true;
        }
    } catch (e) {
        console.error("Failed to import portfolio:", e);
    }
    return false;
};

export const exportPortfolio = () => {
    const dataStr = JSON.stringify(transactions.value, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'portfolio.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
};

// Aggregated Portfolio Logic
export const aggregatedPortfolio = computed(() => {
    const map = new Map();

    transactions.value.forEach(t => {
        if (!map.has(t.symbol)) {
            map.set(t.symbol, {
                assetId: t.assetId,
                assetName: t.assetName,
                symbol: t.symbol,
                totalQuantity: 0,
                totalCost: 0,
                transactions: []
            });
        }
        const asset = map.get(t.symbol);
        asset.totalQuantity += parseFloat(t.quantity);
        asset.totalCost += parseFloat(t.quantity) * parseFloat(t.purchasePrice);
        asset.transactions.push(t);
    });

    // Calculate exchange rate (Base EUR -> Target Currency)
    let rate = 1;
    if (currency.value !== 'eur' && globalData.value && globalData.value.total_market_cap) {
        const caps = globalData.value.total_market_cap;
        if (caps.eur && caps[currency.value]) {
            rate = caps[currency.value] / caps.eur;
        }
    }

    return Array.from(map.values()).map(asset => {
        // Find current price and image from cryptos list if available
        const cryptoData = cryptos.value.find(c => c.symbol.toUpperCase() === asset.symbol.toUpperCase());
        const currentPrice = cryptoData ? cryptoData.current_price : 0;
        const image = cryptoData ? cryptoData.image : null;

        // Apply rate to historical cost basis
        const totalInvested = asset.totalCost * rate;

        const avgPrice = asset.totalQuantity > 0 ? totalInvested / asset.totalQuantity : 0;
        const currentValue = asset.totalQuantity * currentPrice;
        const profitLoss = currentValue - totalInvested;
        const profitLossPercentage = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

        // Convert transactions for display
        const displayTransactions = asset.transactions.map(t => ({
            ...t,
            purchasePrice: parseFloat(t.purchasePrice) * rate,
            originalPrice: t.purchasePrice // Keep original for reference if needed
        }));

        return {
            ...asset,
            image,
            currentPrice,
            avgPrice,
            totalInvested,
            currentValue,
            profitLoss,
            profitLossPercentage,
            transactions: displayTransactions
        };
    });
});

export const balance = computed(() => {
    return aggregatedPortfolio.value.reduce((acc, asset) => acc + asset.currentValue, 0);
});

export const getListCrypto = async (perPage) => {
    try {
        const res = await axios.get(`${URL_API}/coins/markets?vs_currency=${currency.value}&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=false`, {
            headers: { 'Accept': 'application/json' }
        });
        cryptos.value = res.data;
    } catch (err) {
        console.error(err);
    }
}

export const searchCrypto = async (query) => {
    if (!query) {
        queryCryptos.value = [];
        return;
    }
    try {
        const res = await axios.get(`${URL_API}/search?query=${query}`);
        queryCryptos.value = res.data.coins;
    } catch (err) {
        console.error(err);
    }
}

export const getGlobalData = async () => {
    try {
        const res = await axios.get(`${URL_API}/global`);
        globalData.value = res.data.data;
    } catch (err) {
        console.error(err);
    }
}

export const getPriceCrypto = async (id) => {
    try {
        const req = await axios.get(`${URL_API}/simple/price?ids=${id}&vs_currencies=${currency.value}`);
        return req.data[id][currency.value];
    } catch (err) {
        console.error(err);
        return 0;
    }
}