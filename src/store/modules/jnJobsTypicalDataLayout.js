// Typical data layout - an example.
const jn = {
    hasUpdated: false,
    jobs: {
        Account: {

            Account_AdDelete: {},
            Account_InvalidData: {},
            Account_ModifyData: {},
            Login_ModalDialog: {},
            Login_Negative: {},
            Login_Restart: {},
            Login_Smoke: {

                status: {
                    category: 'Account',
                    jobName: 'Login_Smoke',
                    lastBuild: 300,
                    result: 'Success',
                },

                builds: [{}, {}, {
                    category: 'Account',
                    jobName: 'Login_Restart',
                    buildNumber: 167,
                    environment: 'production',
                    building: false,
                    number: 167,
                    fullDisplayName: 'Web » Account » Login_Restart #167',
                    timestamp: 1524115978915,
                    result: 'FAILURE',
                    url: '"https://d-mjenkins-v-01.iwebdc.lan/jenkins/job/Web/job/Account/job/Account_AdDelete/65/",',
                }],

            },
        },
    },
};
