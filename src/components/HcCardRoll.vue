<template lang="pug">

    .roll.roll-mask

        .roll-col(
        v-for="build in builds"
        v-if="build.result"
        v-bind:key="build.number")

            .card(
            v-bind:class="getResultClass(build.result)")

                .card-body

                    a.build-link(v-bind:href="build.url" v-bind:target="'_blank'")
                        //.card-title {{ build.environment }}
                        span.card-text # {{ build.buildNumber }}

</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        props: ['builds'],
        data() {
            return {}
        },
        computed: mapGetters([
                'conf'
            ])

        ,

        methods: {
            getResultClass(result) {
                if ( result === 'SUCCESS' )
                    return 'bg-success'
                else if ( result === 'FAILURE' )
                    return 'bg-danger'
                else if ( result === 'NONE' )
                    return 'bg-secondary'
            }
        },
        updated() {

        }
    }
</script>

<style lang="scss">


    .roll {
        position: relative;
        padding: 4px;
        white-space: nowrap;
        overflow-x: scroll;
        text-align: left;
        border-radius: 4px;

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


        &::-webkit-scrollbar-track {
            border-top: 1px solid #f7f7f7;
            /*border-top: 1px solid #d8d8d8;*/
            background-color: transparent;
        }

        &::-webkit-scrollbar {
            height: 8px;
            background-color: #f7f7f7;
        }

        &::-webkit-scrollbar-thumb {
            background-color: #9F9F9F;
            border-radius: 10px;
        }

        &-col {
            display: inline-block;
            margin: 0 2px 0 2px;
            width: calc(33% - 4px);

            .card {
                border-color: transparent;
            }

            .card-title {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }

            .card-body {
                //border-color: #f7f7f7;
                padding: 0.5rem;
                font-size: 12px;
                transition: all .5s ease;
                transition-delay: .4s;
                min-height: 50px;

            }

            .card-title {
                margin-bottom: 0.25rem;
            }

            .card-text {
                text-align: center;
            }

            &:first-child .card {
                &:after {
                    content: '';
                    position: absolute;
                    top: -2px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 0;
                    height: 0;
                    border-style: solid;
                    border-width: 10px 9px 0 9px;;
                    border-color: #ffffff transparent transparent transparent;
                }
                &:before {
                    content: '';
                    position: absolute;
                    z-index: 2;
                    top: -5px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 0;
                    height: 0;
                    border-style: solid;
                    border-width: 8px 6px 0 6px;
                    border-color: #007bff transparent transparent transparent;
                }
            }
        }

    }

    .build-link {
        color: #fff !important;
        display: block;
        margin-top: 8px;
    }


</style>
