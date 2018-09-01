import externalConfJSON from '@/config/dashboardConf.json';

const state = {

    conf: {}, // gets changed after App is created, based on config in /config/dashboardConf.json
    visibleOptions: [
        //'buildCards', // Shows multiple builds for each job on card hover.
        'relativeTime',
        //'force',
        'buildsPerJobCount',
    ],
};

const getters = {

    conf: state => state.conf,
    environment: state => state.conf.environment,
    buildCards: state => state.conf.buildCards,
    relativeTime: state => state.conf.relativeTime,
    showOptions: state => state.conf.showOptions,
    force: state => state.conf.force,
    visibleOptions: state => state.visibleOptions,
};

const mutations = {

    setConfiguration(state, payload) {
        state.conf = payload;
    },

    setEnvironment(state, payload) {
        state.conf.environment = payload;
    },

    toggleConfigurationOption(state, payload) {
        state.conf[payload] = !state.conf[payload];
    },

};

const actions = {

    setConfiguration({ commit }, payload) {

        const value = payload ? Object.assign({}, externalConfJSON, payload) : externalConfJSON;

        commit('setConfiguration', value);
    },

    setEnvironment({ commit }, payload) {

        commit('setEnvironment', payload);

    },

    toggleConfigurationOption({ commit }, payload) {
        commit('toggleConfigurationOption', payload);
    },

    filterEnv({dispatch}, payload) {
        console.log( 'Changed Environment:', payload );
        dispatch('setEnvironment', payload);
        dispatch('filterJn', { filterBy: 'environment', deviceType: 'web' }, { root: true });
    },

    applyOptions({dispatch}, payload) {
        console.log( 'Changed options:', payload );
        dispatch('toggleConfigurationOption', payload);
    },

};

export default {
    state,
    getters,
    mutations,
    actions,
};
