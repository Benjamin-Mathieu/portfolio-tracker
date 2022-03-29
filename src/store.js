import { ref } from 'vue';
import axios from 'axios';

const URL_API = 'https://api.coingecko.com/api/v3';

export const balance = ref(10000);
export const cryptos = ref([]);
export const queryCryptos = ref([]);

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