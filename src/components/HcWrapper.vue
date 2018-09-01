<template lang="pug">

    div(v-bind:class="{force: force}")
        HcTitle
        HcHeader
        HcProgress
        HcSymbols
        transition(name="fade")
            router-view(
            v-if="isJobsObjectReady")
        HcFooter

</template>

<script>

    import { mapGetters, mapActions } from 'vuex';
    import { Querystring } from 'request/lib/querystring.js';

    Querystring.prototype.unescape = (val) => val;

    import HcHeader from './HcHeader.vue';
    import HcTitle from './HcTitle.vue';
    import HcSymbols from './HcSymbols.vue';
    import HcProgress from './HcProgress.vue';
    import HcDashboard from './HcDashboard.vue';
    import HcFooter from './HcFooter.vue';

    export default {
        name: 'HcWrapper',
        components: {
            HcTitle,
            HcHeader,
            HcSymbols,
            HcProgress,
            HcDashboard,
            HcFooter,
        },

        computed: mapGetters([
            'isJobsObjectReady',
            'force',
            'deviceTypes',
        ]),

        methods: mapActions([
            'setRefreshTimer',
        ]),

        created() {
            console.log('..........', 'App Initialized');
        },

        mounted() {
            this.$store.dispatch('scheduleUpdateForAllDevices');
            this.$store.dispatch('setRefreshTimer');
        },

        updated() {
            console.log('...');
        },

        beforeDestroy() {
            this.$store.dispatch('cancelRefreshTimer');
        },

    };

</script>


<style lang="scss">
    @import '@/assets/utils.scss';
    @import '@/assets/force.scss';

</style>
