<template lang="pug">

    main.container-fluid.dashboard

        .row

            HcCategory(
            v-for="(allJobsInCategory, category) in jobsFiltered"
            v-bind:key="category"
            v-bind:category="category"
            v-bind:allJobsInCategory="allJobsInCategory")

</template>

<script>
    import HcCategory from './HcCategory.vue';
    import { mapGetters } from 'vuex';

    export default {
        name: 'HcDashboard',
        props: ['deviceType'],
        components: {
            HcCategory,
        },
        computed: mapGetters([
            'jobsFiltered',
        ]),
    }
</script>

<style lang="scss">

    .category-group {
        border-radius: 4px;
        //transition: all .1s ease;

        &:hover {
            box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.25);
            position: relative;
            z-index: 1;
        }
    }

    .category-group:nth-child(3n) {
        background-color: #f9f9f9;
    }

    .category-group:nth-child(3n+1) {
        background-color: #f1f1f1;
    }

    .category-group:nth-child(3n+2) {
        background-color: #e9e9e9;
    }
</style>
