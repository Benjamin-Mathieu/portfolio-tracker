
<template>
    <teleport v-if="modalOpened" to="body">
        <div class="modal">
            <h1>modal</h1>
        </div>
    </teleport>
</template>

<script>

export default {
    name: 'Modal',
    props: {
        modalOpened: {
            type: Boolean
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.modal {
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(50%, -50%);
    height: 800px;
    width: 200px;
}
</style>
