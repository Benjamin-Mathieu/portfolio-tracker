import { ref } from 'vue';
import axios from 'axios';

const URL_API = 'https://api.coingecko.com/api/v3';

export const balance = ref(10000);
export const cryptos = ref([]);

export const getListCrypto = async () => {
    await axios.get(`${URL_API}/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=10&page=1&sparkline=false`,
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
    })

}