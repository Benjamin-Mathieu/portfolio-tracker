
<template>
    <section class="cryptos">
        <table>
            <th>Rang</th>
            <th>Monnaie</th>
            <th>Cours actuel</th>
            <th>24h</th>
            <tr class="row" v-for="crypto in cryptos" :key="crypto.id">
                <td>{{ crypto.market_cap_rank }}</td>
                <td class="td-logo">
                    <img class="logo-crypto" :src="crypto.image" />
                    <p>{{ crypto.name }}</p>
                </td>
                <td>{{ crypto.current_price + " €" }}</td>
                <td>
                    <span
                        :class="crypto.price_change_percentage_24h > 0 ? 'text-green' : 'text-red'"
                    >{{ crypto.price_change_percentage_24h.toFixed(2) + " %" }}</span>
                </td>
            </tr>
        </table>
    </section>
</template>

<script>
import { getListCrypto, cryptos } from "../store"

export default {
    name: 'Cryptos',
    setup() {
        getListCrypto(20);

        return { cryptos }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.text-green {
    color: #4eaf0a;
}
.text-red {
    color: crimson;
}

.cryptos {
    width: 80%;
    padding: 0.5rem;

    table {
        width: 100%;

        th {
            text-align: left;
        }

        th,
        td {
            padding: 0.25rem;
        }

        .row {
            .td-logo {
                display: flex;
                align-items: center;
            }
            .logo-crypto {
                height: 20px;
                width: 20px;
                padding-right: 0.5rem;
            }
        }
    }
}
</style>
