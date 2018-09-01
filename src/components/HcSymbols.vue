<template lang="pug">

    .container.container-symbols
        .row
            .col-12

                .row

                    .col-4
                        .symbol-box.bg-success-light Test was successful
                    .col-4
                        .symbol-box No recent test result.
                    .col-4
                        .symbol-box.bg-danger.bg-danger Test failed
</template>

<script>

    export default {
        components: {
        },
        data() {
            return {}
        },
    }
</script>

<style lang="scss">

    .container-symbols {
        padding-top: 10px;
        padding-bottom: 10px;
    }

    .symbol {

        &-box {
            padding: 5px 10px;
            border-radius: 5px;
            color: #ffffff;
            font-size: 12px;
            border-top: 10px solid whitesmoke;
            background-color: #8e9a99 // default inactive color.
        }
    }

</style>
