import Vue from 'vue';
import Vuex from 'vuex';
import jenkinsDataModule from './modules/jenkinsDataModule.js';
import confModule from './modules/confModule.js';

Vue.use(Vuex);

export const store = new Vuex.Store({

    modules: {
        jenkinsDataModule,
        confModule,
    },

});

