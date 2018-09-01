<template lang="pug">

    .container-fluid
        .row
            .col-12.progress-bar(
            v-bind:style="{maxWidth: Math.ceil(currentProgress * 100) + '%'}"
            )

</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        computed: mapGetters([
            'currentProgress',
        ]),
    }
</script>

<style lang="scss">

    .progress-bar {
        height: 10px;
        max-width: 0;
        background-color: #dff3db !important;
        transition: all 500ms ease;
    }

</style>
