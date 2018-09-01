import { JenkinsHandler } from '@/jenkins/JenkinsHandlerClass.js';
import { jnObjectWeb } from '@/jenkins/jnObjectWeb';
import { jnObjectAndroid } from '@/jenkins/jnObjectAndroid';
import { jnObjectIOS } from '@/jenkins/jnObjectIOS.js';
import { jnObjectAPIGW } from '@/jenkins/jnObjectAPIGW.js';

const state = {
    currentDeviceType: 'web',
    buildsPerJobToBeFetched: 3,
    refreshTimer: null,
    refreshInterval: 10 * 60 * 1000, // Milliseconds
    jnObjectStructures: {
        'web': jnObjectWeb,
        'android': jnObjectAndroid,
        'ios': jnObjectIOS,
        'apigw': jnObjectAPIGW,
    },
    web: {
        jobsFiltered: {}, // updates after jn object has been fetched
        updateTimestamp: 123123,
        buildsPerJobFetched: null,
        count: {
            jobs: 0,
            request: 0,
            response: 0,
        },
        jn: {
            hasUpdated: false,
            jobs: {},
        },
    },
    android: {
        jobsFiltered: {},
        updateTimestamp: 123123,
        buildsPerJobFetched: null,
        count: {
            jobs: 0,
            request: 0,
            response: 0,
        },
        jn: {
            hasUpdated: false,
            jobs: {},
        },
    },
    ios: {
        jobsFiltered: {},
        updateTimestamp: 123123,
        buildsPerJobFetched: null,
        count: {
            jobs: 0,
            request: 0,
            response: 0,
        },
        jn: {
            hasUpdated: false,
            jobs: {},
        },
    },
    apigw: {
        jobsFiltered: {},
        updateTimestamp: 123123,
        buildsPerJobFetched: null,
        count: {
            jobs: 0,
            request: 0,
            response: 0,
        },
        jn: {
            hasUpdated: false,
            jobs: {},
        },
    },

};

const getters = {
    getJn: state => state[state.currentDeviceType].jn,

    jobsFiltered: state => state[state.currentDeviceType].jobsFiltered,

    currentProgress(state) {
        const { jobs, request, response } = state[state.currentDeviceType].count;
        return (request + response) / (jobs * 2);
    },

    currentDeviceType: state => state.currentDeviceType,

    isJobsObjectReady(state) {
        const isJobsObjectPopulated = (typeof state[state.currentDeviceType].jn.jobs !== 'undefined') &&
            !!Object.keys(state[state.currentDeviceType].jn.jobs).length;
        const hasJobsBeenFiltered = (typeof state[state.currentDeviceType].jobsFiltered !== 'undefined') &&
            !!Object.keys(state[state.currentDeviceType].jobsFiltered).length;
        return isJobsObjectPopulated || hasJobsBeenFiltered;
    },

    deviceTypes: state => Object.keys(state.jnObjectStructures),

    filterOptionsWeb: state => typeof state.jnObjectStructures.web !== 'undefined' && state.jnObjectStructures.web.filterOptions,

    updatedDeviceTypes(state) {
        const types = Object.keys(state.jnObjectStructures);
        const updatedTypes = types.filter(type => state[type].jn.hasUpdated);
        return updatedTypes;
    },

    buildsPerJobToBeFetched: state => state.buildsPerJobToBeFetched,

    refreshInterval: state => state.refreshInterval,
};

const mutations = {
    setJn(state, jnObject) {
        state[jnObject.deviceType].jn = jnObject;
    },

    setJobsFiltered(state, payload) {
        state[payload.deviceType].jobsFiltered = payload.jobsFiltered;
    },

    updateCurrentView(state, payload) {
        state.currentDeviceType = payload;
    },

    updateLastTimestamp(state, deviceType) {
        const currentTimestamp = new Date().getTime();
        state[deviceType].updateTimestamp = currentTimestamp;
    },

    updateBuildsPerJobFetched(state, payload) {
        state[payload.deviceType].buildsPerJobFetched = payload.count;
    },

    updateProgressCount(state, payload) {
        const { deviceType, countType } = payload;
        state[deviceType].count[countType] += 1;
    },

    resetProgressCount(state, deviceType) {
        state[deviceType].count.request = 0;
        state[deviceType].count.response = 0;
    },

    updateJobsCount(state, payload) {
        const { deviceType, jobsCount } = payload;
        state[deviceType].count.jobs = jobsCount;
    },

    setBuildsPerJobToBeFetched(state, payload) {
        state.buildsPerJobToBeFetched = payload;
    },

    setRefreshTimer(state, payload) {
        state.refreshTimer = payload;
    },

    cancelRefreshTimer(state) {
        clearInterval(state.refreshTimer);
    },

    setRefreshInterval(state, payload) {
        state.refreshInterval = payload;
    },
};

const actions = {

    updateLastTimestamp({ commit }, payload) {
        commit('updateLastTimestamp', payload);
    },

    updateCurrentView({ commit, dispatch, state, getters }, deviceType) {
        if (!getters.deviceTypes.includes(deviceType)) {
            console.log('Please enter correct device type.');
            return false;
        }
        commit('updateCurrentView', deviceType);
        dispatch('checkTimestamp', deviceType);
    },

    updateProgressCount({ commit }, payload) {
        commit('updateProgressCount', payload);
    },

    resetProgressCount({ commit }, deviceType) {
        commit('resetProgressCount', deviceType);
    },

    updateJobsCount({ commit }, payload) {
        commit('updateJobsCount', payload);
    },

    checkTimestamp({ dispatch, state, getters }, deviceType) {
        const currentTimestamp = new Date().getTime();
        const lastUpdateTimestamp = state[deviceType].updateTimestamp;
        const timestampDifferenceMinutes = (currentTimestamp - lastUpdateTimestamp) / (1000 * 60);
        const hasBuildsPerJobCountChanged = state.buildsPerJobToBeFetched !== state[deviceType].buildsPerJobFetched;
        const minutesBetweenUpdate = getters.refreshInterval / 60000;
        const tooEarlyUpdateMessage = `Last time updated: ${Math.ceil(timestampDifferenceMinutes)} minute(s) ago.
Next update scheduled in ${minutesBetweenUpdate - Math.ceil(timestampDifferenceMinutes)} minute(s).`;
        if (timestampDifferenceMinutes > minutesBetweenUpdate || hasBuildsPerJobCountChanged) {
            dispatch('fetchData', deviceType);
        } else {
            console.log(tooEarlyUpdateMessage);
        }
    },

    scheduleUpdateForAllDevices({ dispatch, getters }) {
        getters.deviceTypes.forEach( type => dispatch('checkTimestamp', type));
    },

    fetchData({ commit, dispatch, state }, deviceType) {
        dispatch('updateLastTimestamp', deviceType);
        dispatch('updateBuildsPerJobFetched', { deviceType, count: state.buildsPerJobToBeFetched });
        console.log(`Fetching data for '${deviceType}'`);
        const jnInstance = new JenkinsHandler(state.jnObjectStructures[deviceType]);
        jnInstance.updateAllJobs()
            .then(fetchedJnObject => {
                commit('setJn', fetchedJnObject);
                console.log('jn Object successfully updated.');
                return fetchedJnObject;
            })
            .then((fetchedJnObject) => {
                dispatch('filterJn', fetchedJnObject);
                return true;
            })
            .catch(err => {
                console.log(err);
            });
    },

    filterJn({ commit, state, rootState }, jnObject) {
        const filteredJn = { jobs: {} };
        const currentJn = state[jnObject.deviceType].jn;
        const categories = Object.keys(currentJn.jobs);
        categories.forEach(category => {
            const jobs = Object.keys(currentJn.jobs[category]);
            filteredJn.jobs[category] = {};
            jobs.forEach(job => {
                filteredJn.jobs[category][job] = { builds: [], status: {} };
                const filteredJob = filteredJn.jobs[category][job];
                const unfilteredJob = currentJn.jobs[category][job];
                const filterBy = jnObject.filterBy === 'environment' ? rootState.confModule.conf.environment : '';
                filteredJob.builds = filterBy !== '' ?
                    filterBuilds(unfilteredJob.builds, filterBy) : unfilteredJob.builds;
                if (!filteredJob.builds || !filteredJob.builds.length) {
                    filteredJob.status = {
                        lastBuild: null,
                        result: 'NONE',
                        category: unfilteredJob.status.category,
                        jobName: unfilteredJob.status.jobName,
                    };
                    console.log(`No recent builds for this job: '${job}'`);
                    return false;
                }
                filteredJob.status = {
                    lastBuild: filteredJob.builds[0].number,
                    result: filteredJob.builds[0].result,
                    category: unfilteredJob.status.category,
                    jobName: unfilteredJob.status.jobName,
                };
            });
        });
        commit('setJobsFiltered', {
            deviceType: jnObject.deviceType,
            jobsFiltered: filteredJn.jobs,
        });
        console.log('jn Object has been filtered --', rootState.confModule.conf.environment);
    },

    setBuildsPerJobToBeFetched({commit}, event) {
        commit('setBuildsPerJobToBeFetched', parseInt(event.target.value, 10));
    },

    updateBuildsPerJobFetched({commit}, paylaod) {
        commit('updateBuildsPerJobFetched', paylaod);
    },

    setRefreshTimer({ commit, dispatch, getters }) {
        const interval = setInterval(() => {
            dispatch('scheduleUpdateForAllDevices');
            console.log('SettingInterval');
        }, getters.refreshInterval);

        commit('setRefreshTimer', interval);
    },

    cancelRefreshTimer({ commit }) {
        commit('cancelRefreshTimer');
    },

    setRefreshInterval({ commit, dispatch }, event) {
        const value = event.target.value;
        const ms = value >= 1 ? value * 60000 : 60000;
        commit('setRefreshInterval', ms);
        dispatch('updateRefreshTimer');
    },

    updateRefreshTimer({ dispatch }) {
        dispatch('cancelRefreshTimer');
        dispatch('setRefreshTimer');
    },
};

function filterBuilds(buildsArr, filterBy) {
    if (typeof buildsArr === 'undefined') {
        return false;
    }
    const filteredArr = buildsArr.filter(buildObj => {
        if (buildObj.environment === filterBy) {
            return true;
        }
        return false;
    });
    return filteredArr;
}

export default {
    state,
    getters,
    mutations,
    actions,
};
