import jnApi from 'jenkins-api';
import { store } from '@/store/store';

export class JenkinsHandler {

    constructor(jnObject) {
        this.jnObject = jnObject || {};
        this.deviceType = jnObject.deviceType || 'web';
        this.path = jnObject.path || 'Web';
        this.user = 'userName'; // Set to Jenkins User
        this.token = 'userToken'; // Set to proper token
        this.url = 'urlJenkins'; // Set to the main jenkins URL
        this.jenkins = jnApi.init(`https://${this.user}:${this.token}@${this.url}`);
        this.countRequestSend = 0;
        this.countResponseReceived = 0;
    }

    getNumberOfJobs() {
        const jn = this.jnObject;
        let sum = 0;
        const categories = Object.keys(jn.jobs);
        categories.forEach(category => {
            const keys = Object.keys(jn.jobs[category]);
            sum += keys.length;
        });
        return sum;
    }

    getJobDetails(category, jobName) {
        return new Promise((resolve, reject) => {
            const path = `${this.path}/job/${category}/job/${jobName}`;
            this.jenkins.job_info(path, { tree: 'color,url,lastBuild[number]' }, (err, data) => {
                if (err) {
                    throw err;
                }
                const processedData = this.processJobDetails(data, category, jobName);
                resolve(processedData);
            });
        });
    }

    getBuildDetails(category, jobName, buildNumber) {
        if (buildNumber < 1) {
            console.log(`'${jobName}' - Not enough builds for this job, skipping to the next one. `);
            return false;
        }
        return new Promise((resolve, reject) => {
            const path = `${this.path}/job/${category}/job/${jobName}`;
            this.jenkins.build_info(path, buildNumber, (err, data) => {
                if (err) { console.warn(err); }
                if (!data || !data.actions[1].parameters) {
                    console.log(`Cannot get "${jobName}" - "${buildNumber}"`);
                    resolve({});
                    return null;
                }
                try {
                    const result = this.processBuildDetails(data, category, jobName, buildNumber);
                    resolve(result);
                }
                catch (e) {
                    console.log(e.message);
                    reject(e);
                }
            });
        });
    }

    generatePromisesForBuilds(data) {
        this.countRequestSend += 1;
        store.dispatch('updateProgressCount', { deviceType: this.deviceType, countType: 'request' });
        const lastBuildNumber = data.lastBuild;
        const { buildsPerJobToBeFetched } = store.getters;
        const buildNumbersToGet = Array(buildsPerJobToBeFetched)
            .fill(lastBuildNumber)
            .map((num, index) => num - index);
        const promisesArr = buildNumbersToGet.map(number => {
            return this.getBuildDetails(data.category, data.jobName, number);
        });
        return promisesArr;
    }

    async generateJobData(category, jobName) {
        const data = await this.getJobDetails(category, jobName);
        this.updateJobStatus(data);
        const buildsArr = await Promise.all(this.generatePromisesForBuilds(data));
        const updatedBuildsArr = this.removeEmptyObjectsFromArr(buildsArr);
        if (!updatedBuildsArr.length) {
            console.log(`'${jobName}' - There are no recent builds for this job`);
            return false;
        }
        this.updateSingleBuild(updatedBuildsArr);
        this.countResponseReceived += 1;
        store.dispatch('updateProgressCount', { deviceType: this.deviceType, countType: 'response' });
        return jobName;
    }

    async generateCategoryData(category) {
        const jobs = Object.keys(this.jnObject.jobs[category]);
        return await Promise.all(jobs.map(job => this.generateJobData(category, job)));
    }

    async generateAllRootJobsData() {
        const allJobs = Object.keys(this.jnObject.jobs);
        return await Promise.all(allJobs.map(job => this.generateCategoryData(job)));
    }

    async updateAllJobs() {
        store.dispatch('updateJobsCount', { deviceType: this.deviceType, jobsCount: this.getNumberOfJobs() });
        store.dispatch('resetProgressCount', this.deviceType);
        this.jnObject.hasUpdated = false;
        console.time(this.path);
        console.log('...GETTING DATA STARTS...');
        await this.generateAllRootJobsData();
        this.jnObject.hasUpdated = true;
        console.log('...GETTING DATA ENDS...');
        console.timeEnd(this.path);
        return this.jnObject;
    }

    // Helper functions
    updateJobStatus(data) {
        this.jnObject.jobs[data.category][data.jobName].status = data;
    }

    updateSingleBuild(data) {
        if (typeof data === 'undefined') {
            console.log('Skipping build update');
        }
        else {
            this.jnObject.jobs[data[0].category][data[0].jobName].builds = data;
        }
    }

    removeEmptyObjectsFromArr(arr) {
        const processedArr = arr.filter((obj) => {
            if (typeof obj !== 'object' || !Object.keys(obj).length) {
                return false;
            }
            return true;
        });
        return processedArr;
    }

    processBuildDetails(data, category, jobName, buildNumber) {
        const buildDetails = `${category} / ${jobName} / ${buildNumber}`;
        try {
            const buildInfo = {
                category,
                jobName,
                buildNumber,
                environment: data.actions[1].parameters[0].value,
                building: data.building,
                number: data.number,
                timestamp: data.timestamp,
                result: data.result,
                url: data.url,
            };
            return buildInfo;
        }
        catch (e) {
            console.log(e.message + buildDetails);
            return 'processBuildDetails err' + buildDetails;
        }
    }

    processJobDetails(data, category, jobName) {
        const details = `${category} / ${jobName}`;
        try {
            const jobInfo = {
                category,
                jobName,
                lastBuild: data.lastBuild.number,
                result: data.color === 'blue' ? 'SUCCESS' : 'FAILURE',
                url: data.url,
            };
            return jobInfo;
        }
        catch (e) {
            console.log(e.message + details);
            return 'processJobDetails err' + details;
        }
    }
}
