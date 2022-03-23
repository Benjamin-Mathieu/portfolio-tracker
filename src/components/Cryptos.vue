
<template>
    <section class="cryptos">
        <div class="list" v-for="crypto in cryptos" :key="crypto.id">
            <div class="p-logo">
                <img class="logo-crypto" :src="crypto.image" />
                <p>{{ crypto.name }}</p>
            </div>
            <div>
                <p>{{ crypto.current_price + " €" }}</p>
            </div>
        </div>
    </section>
</template>

<script>
import { getListCrypto, cryptos } from "../store"

export default {
    name: 'Cryptos',
    setup() {
        getListCrypto();

        return { cryptos }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.cryptos {
    width: 80%;
    padding: 0.5rem;
    .list {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;

        .p-logo {
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
</style>
