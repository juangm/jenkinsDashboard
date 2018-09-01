<template lang="pug">
    div#app
        HcWrapper
</template>

<script>
    import HcWrapper from './components/HcWrapper.vue'


    export default {
        name: 'App',
        components: {
            HcWrapper
        }
    }
</script>

<style lang="scss">

    @import '../node_modules/bootstrap/scss/bootstrap.scss';

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        background-color: #cacaca;
        min-height: 100vh;
    }

</style>
