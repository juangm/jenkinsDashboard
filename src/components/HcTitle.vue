<template lang="pug">

    .container-fluid
        .row
            .col-xl-12.hc-title
                span &bull;&nbsp; Immoweb &nbsp; QA &nbsp; Healthcheck &nbsp; Dashboard &nbsp;&bull;
                span.pl-2 Auto Refresh Active ( {{ refreshInterval / 60000 }} minutes )
                span.pl-2 &bull;&nbsp; Disable AdBlock for this site to allow multiple requests.
                a(href="https://d-mjenkins-v-01.iwebdc.lan/jenkins/" target="_blank")
                    img.hc-title-logo(src="https://d-mjenkins-v-01.iwebdc.lan/jenkins/static/f39f4e30/images/headshot.png")

</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        computed: mapGetters([
            'refreshInterval'
        ]),
    }

</script>

<style lang="scss">
    .hc-title {
        color: #4d4c4c;
        text-align: center;
        font-weight: bold;
        letter-spacing: 1px;
        text-shadow: 0 0 1px #b1bab2;
        &-logo {
            position: absolute;
            left: 10px;
            top: 8px;
            z-index: 10;
            background-color: white;
            border-radius: 10rem;
            padding: 10px;
            border: 1px solid #cacaca;
            box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.23);
            transition: all .3s ease;
            width: 59px;
            height: 58px;

            &:hover {
                background: #f4f4f4
            }
        }
    }
</style>
