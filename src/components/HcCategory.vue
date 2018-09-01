<template lang="pug">

    .col-xl-3.col-md-6.category-group(v-bind:class="categoryStatus")

        .row

            .col-12.category-title {{ category | translate }}

            HcCard(
            v-for="job in allJobsInCategory"
            v-if="job.builds.length"
            v-bind:key="job.status.jobName"
            v-bind:status="job.status"
            v-bind:builds="job.builds")

</template>

<script>
    import HcCard from './HcCard.vue';

    export default {
        props: ['category', 'allJobsInCategory'],
        components: {
            HcCard,
        },
        data() {
            return {}
        },
        computed: {

            categoryStatus() {

                const category = this.allJobsInCategory;
                const jobsArr = Object.keys(category);
                const numberOfJobs = jobsArr.length;
                let successCounter = 0;
                let noResultCounter = 0;
                let result;

                jobsArr.forEach(job => {
                    if (category[job].status.result === 'SUCCESS') {
                        successCounter += 1;
                    }
                    else if (category[job].status.result === 'NONE') {
                        noResultCounter += 1;
                    }
                });

                if (successCounter === numberOfJobs) result = 'success';
                else if (noResultCounter === numberOfJobs) result = 'no-result';
                else if (successCounter === 0) result = 'failure';
                else result = 'mixed';

                return `category-${result}`;

            },

        },

        methods: {},

        created() {
        },
        updated() {

        }
    }
</script>

<style lang="scss">

    .category {
        &-group {
            border-right: 1px solid #e1dfdf;
            border-bottom: 1px solid #e1dfdf;
            border-radius: 0;
        }
        &-title {
            padding: .75rem 0 .75rem 0;
        }
        &-success {
            background-color: #dff3db !important;
        }
        &-mixed {
            background-color: #fffcda !important;
        }
        &-failure {
            background-color: #f8e9e9 !important;
        }
        &-no-result {
            background-color: #f9f9f9 !important;
        }
    }

</style>
