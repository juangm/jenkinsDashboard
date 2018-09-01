<template lang="pug">

    .card-header

        a.card-header-id.mr-2(
        v-bind:href="status.url"
        v-bind:class="getResultClassHeader(status.result)"
        ) {{ status.jobName | translate }}

        .card-progress(
        v-bind:class="getResultClassProgress(status.result)")

            span.card-header-suffix(
            v-if="conf.relativeTime"
            ) {{ builds[0] ? getRelativeTime( builds[0].timestamp ) + ' ago' : 'No results for this env.' }}

</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        props: ['status', 'builds'],
        data() {
            return {}
        },
        computed: mapGetters([
                'conf'
            ])

        ,

        methods: {

            getRelativeTime(timestamp) {
                const date = new Date();
                const now = date.getTime();
                const msInMinute = 60000;
                const difference = now - timestamp;
                const minutes = difference / msInMinute;
                const hours = minutes / 60;
                const days = hours / 24;
                const months = days / 30;
                if (days >= 60) return Math.floor(months) + ' months';
                else if (days >= 2) return Math.floor(days) + ' days';
                else if (hours >= 2) return Math.floor(hours) + ' hours';
                return Math.ceil(minutes) + ' minutes';
            },

            getResultClassHeader(result) {
                if ( result === 'SUCCESS' )
                    return 'text-success'
                else if ( result === 'FAILURE' )
                    return 'text-danger'
                else if ( result === 'NONE' )
                    return 'text-secondary'
                else
                    return 'text-success'

            },

            getResultClassProgress(result) {
                if ( result === 'SUCCESS' )
                    return 'bg-success-light'
                else if ( result === 'FAILURE' )
                    return 'bg-danger'
                else if ( result === 'NONE' )
                    return 'bg-secondary'
            },

        },
        updated() {

        }
    }
</script>

<style lang="scss">

    .card {

        &-header {
            position: absolute;
            background-color: #f7f7f7;
            z-index: 6;
            left: -1px;
            right: -1px;
            top: 0;
            height: 50px;
            border: 1px solid #dfdfdf;
            border-radius: .25rem;

            transition: all .5s ease;

            //border-color: #f7f7f7;
            text-align: left;
            //height: 50px;

            &-id {
                display: block;
                top: 50%;
                transform: translateY(-50%);
                transition: all .3s ease;
                position: relative;
                font-size: 13px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                max-width: 100%;
            }

            &-suffix {
                float: right;
                font-size: 13px;
                color: white;
            }
        }

        &-progress {
            position: absolute;
            bottom: -20px;
            left: 0;
            right: 0;
            height: 20px;
            padding: 0 0.75rem;
            background-color: #92d19e;
            //border: 1px solid $color-gray;
            border-bottom-left-radius: .25rem;
            border-bottom-right-radius: .25rem;
            transition: all .5s ease;
        }

        &-body {
            //border-color: #f7f7f7;
            padding: 0.5rem;
            font-size: 12px;
            transition: all .5s ease;
            transition-delay: .4s;

        }

        &-title {
            margin-bottom: 0.25rem;
        }

        &-mask:after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            pointer-events: none;
            background: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(167, 167, 167, 0) 30%, rgba(255, 255, 255, 0.73) 99%, rgba(255, 255, 255, 0.65) 100%);
        }
    }

    .bg-secondary {
        background-color: #6c757d !important;
    }


</style>
