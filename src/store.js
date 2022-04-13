import { reactive, ref } from 'vue';
import axios from 'axios';

const URL_API = 'https://api.coingecko.com/api/v3';

export const balance = ref(10000);
export const cryptos = ref([]);
export const queryCryptos = ref([]);
export const globalData = ref([]);
export const porfolio = reactive({
    assets: []
});

export const getListCrypto = async (perPage) => {
    await axios.get(`${URL_API}/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=false`,
        {
            headers: {
                'Accept': 'application/json'
            }
        }
    ).then(res => {
        cryptos.value = res.data;
        console.log(res.data);
    }).catch(err => {
        console.error(err);
    });
}

export const searchCrypto = async (query) => {
    await axios.get(`${URL_API}/search?query=${query}`)
        .then(res => {
            console.log(res.data);
            queryCryptos.value = res.data.coins;
        })
        .catch(err => {
            console.error(err);
        });
}

export const getGlobalData = async () => {
    await axios.get(`${URL_API}/global`)
        .then(res => {
            globalData.value = res.data.data;
        })
        .catch(err => {
            console.error(err);
        });
}

export const getPriceCrypto = async (id) => {
    const req = await axios.get(`${URL_API}/simple/price?ids=${id}&vs_currencies=eur`);
    return req.data[id].eur;
}