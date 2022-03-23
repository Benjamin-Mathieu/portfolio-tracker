<template>
    <nav class="menu">
        <ul>
            <li
                @click="$emit('showPortfolio')"
                :class="toggleMenu === true ? 'isSelected' : null"
            >Portfolio</li>
            <li
                @click="$emit('showCrypto')"
                :class="toggleMenu === false ? 'isSelected' : null"
            >Cryptos</li>
        </ul>
    </nav>
</template>

<script>

export default {
    name: 'Nav',
    props: {
        toggleMenu: {
            type: Boolean
        }
    },
    emits: ['showPortfolio, showCrypto']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.menu {
    margin: 3rem 0;
    ul {
        display: flex;

        li {
            font-weight: bold;
            list-style: none;
            font-size: 2rem;
            padding: 0.5rem;

            &.isSelected {
                background-color: red;
            }

            &:hover {
                cursor: pointer;
            }
        }
    }
}
</style>
