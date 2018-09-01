<template lang="pug">

    header.container-fluid.box-shadow-bottom-1
        .row.justify-content-center.pt-2
            .col-xl-4.pb-2.nowrap-lg

                h4.inline-block-mid.mr-1.pt-1 Type:

                div.inline-block-mid

                    template(v-for="device in deviceTypes")
                        router-link.btn.btn-primary.ml-2(
                        tag="button"
                        v-bind:to="{ name: 'dashboard', params: { deviceType: device } }"
                        v-on:click.native="updateCurrentView(device)"
                        v-bind:class="{'btn-success': currentDeviceType === device}"
                        ) {{ device | translate }}
                            .loading-spinner(
                            v-bind:class="{'loading-finished': updatedDeviceTypes.includes(device)}"
                            )
            .col-xl-4.pb-2

                transition(name="fade" mode="out-in")

                    div(v-if="currentDeviceType === 'web'" key="filterOne")

                        h4.inline-block-mid.ml-2.pt-1.mr-1 Filter:

                        button.btn.btn-primary.ml-2(
                        v-for="option in filterOptionsWeb"
                        v-on:click="filterEnv(option)"
                        v-bind:class="{ 'btn-success': environment === option}"
                        ) {{ option | translate }}

                    div(v-else key="filterTwo")

                        h4.inline-block-mid.ml-2.pt-1 Filter :

                        button.btn.btn-primary.ml-2.btn-success.inactive Test


            .col-xl-4.pb-2(v-if="showOptions")

                div.inline-block-mid
                    button.btn.btn-primary.ml-2(
                    v-for="option in visibleOptions"
                    v-if="option !== 'buildsPerJobCount'"
                    v-on:click="applyOptions(option)"
                    v-bind:class="{ 'btn-success': conf[option] === true }"
                    ) {{ option | translate }}

                div.inline-block-mid.limited-width-sm(v-if="visibleOptions.includes('buildsPerJobCount')")
                    .input-group.pl-2
                        .input-group-prepend
                            button.btn.btn-success(v-on:click="updateCurrentView(currentDeviceType)") Builds
                        input.form-control(
                        v-bind:value="buildsPerJobToBeFetched"
                        v-on:input="setBuildsPerJobToBeFetched"
                        type="number"
                        min="1"
                        max="1000"
                        placeholder="#")

                div.inline-block-mid.limited-width-sm(v-if="visibleOptions.includes('buildsPerJobCount')")
                    .input-group.pl-2
                        .input-group-prepend
                            button.btn.btn-success.inactive Minutes
                        input.form-control(
                        v-bind:value="refreshInterval / 60000"
                        v-on:input="setRefreshInterval"
                        type="number"
                        min="1"
                        max="99"
                        placeholder="#")

</template>

<script>

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';

    function parseBooleanStrings(obj) {
        const keys = Object.keys(obj);
        keys.forEach(key => {
            if (['true', 'false'].includes(obj[key])) {
                obj[key] = JSON.parse(obj[key]);
            }
        });
        return obj;
    }

    export default {
        data() {
            return {}
        },

        computed: mapGetters([
            'conf',
            'buildsPerJobCount',
            'buildsPerJobToBeFetched',
            'environment',
            'buildCards',
            'relativeTime',
            'showOptions',
            'visibleOptions',
            'currentDeviceType',
            'deviceTypes',
            'filterOptionsWeb',
            'updatedDeviceTypes',
            'refreshInterval'
        ]),

        methods: mapActions([
            'updateCurrentView',
            'filterEnv',
            'applyOptions',
            'setBuildsPerJobToBeFetched',
            'setRefreshInterval',
            'updateRefreshTimer',
        ]),

        watch: {
            $route(to, from) {
                const deviceTo = to.params.deviceType;
                const deviceFrom = from.params.deviceType;
                const queryTo = to.query;
                const queryFrom = from.query;

                if (deviceFrom !== deviceTo ) {
                    if (!this.deviceTypes.includes(deviceTo)) {
                        console.log('Incorrect URL - wrong device type.');
                        return false;
                    }
                    this.updateCurrentView(to.params.deviceType)
                }

                if (queryTo !== queryFrom) {
                    this.$store.dispatch('setConfiguration', parseBooleanStrings(this.$route.query));
                    if (!Object.keys(queryTo).length) {
                        this.$router.replace({ query: queryFrom });
                    }
                }
            },
        },

        created() {
            this.$store.dispatch('setConfiguration', parseBooleanStrings(this.$route.query));
        },

        mounted() {
            const landingDeviceType = this.$route.params.deviceType;
            this.updateCurrentView(landingDeviceType);
        }

    }
</script>

<style lang="scss">

    header {
        background-color: #fff;
    }

    .loading {

        &-finished {
            width: 0 !important;
            height: 0 !important;
            margin-left: 0 !important;

            &.loading-spinner:after {
                width: 0 !important;
                height: 0 !important;
                border: 0 !important;
            }

        }
    }

    .limited-width-sm {
        max-width: 150px;
    }

    .span-success {
        color: #fff !important;
        background-color: #28a745 !important;
        border-color: #28a745 !important;
        cursor: default;
    }

    @-webkit-keyframes spin2 {
        from { -webkit-transform: rotate(0deg);}
        to { -webkit-transform: rotate(360deg);}
    }

    @keyframes spin {
        from { transform: scale(1) rotate(0deg);}
        to { transform: scale(1) rotate(360deg);}
    }



    .loading-spinner {
        display: inline-block;
        width: 15px;
        height: 15px;
        margin-left: 5px;
        transition: all 500ms ease;
        margin-bottom: -2px;
    }
    .loading-spinner:after {
        content: " ";
        display: block;
        width: 6px;
        height: 11px;
        margin: 1px;
        border-radius: 50%;
        border: 6px solid #fff;
        border-color: #fff transparent #fff transparent;
        animation: lds-dual-ring 1.2s linear infinite;
    }
    @keyframes lds-dual-ring {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
