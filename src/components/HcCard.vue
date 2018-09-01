<template lang="pug">

    .col-6.col-card(
    v-bind:class="{'card-inactive': status.result === 'NONE'}")

        .card.card-container(
        v-bind:class="confRelatedClasses")

            HcCardHeader(
            v-bind:status="status"
            v-bind:builds="builds")

            HcCardRoll(
            v-bind:builds="builds")

</template>

<script>
    import HcCardHeader from './HcCardHeader.vue';
    import HcCardRoll from './HcCardRoll.vue';

    export default {
        components: {
            HcCardHeader,
            HcCardRoll
        },
        props: ['status', 'builds'],
        data() {
            return {}
        },
        computed: {
            confRelatedClasses() {
                return {
                    'static' : !this.$store.getters.buildCards, // disables interaction with single card on hover.
                }
            },
        },

        methods: {},
        updated() {

        }
    }
</script>

<style lang="scss">

    .card {
        //border-color: #f7f7f7;
        border-radius: 4px;
        border: 0;

        &-container {
            min-height: 66px;
            margin-bottom: 1rem;
        }

        &-inactive {
            opacity: 0.7;
            pointer-events: none;

        }

        &:not(.static):hover {

            .card-header {
                top: -50px;
                background-color: #007bff;
                border-color: transparent !important;
                box-shadow: 0 1px 6px 0 rgba(0, 123, 255, 0.48);
                border-radius: 4px;
            }
            .roll {
                //top: -50px;
            }
            .roll-col:first-child {
                .card {
                    //background-color: #70f38d;
                    animation: flash 1s normal forwards ease;
                }
            }
            .card-progress {
                opacity: 0;
            }
            .card-header-id {
                white-space: normal;
                color: #fff !important;
            }
        }

    }


</style>
