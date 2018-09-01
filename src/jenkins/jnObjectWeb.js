export const jnObjectWeb = {
    deviceType: 'web',
    path: 'Web',
    filterBy: 'environment',
    filterOptions: ['production', 'test', 'uat'],
    hasUpdated: false,
    jobs: {

        Account: {
            // Account_AdDelete: {},
            // Account_InvalidData: {},
            // Account_ModifyData: {},
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
                    timestamp: 1524115978915,
                    result: 'FAILURE',
                }],
            },
        },
        Advertisement: {
            Advertisement_Smoke: {},
        },
        Bouncing_Server: {
            // BouncingServer_CookieRenew: {},
            BouncingServer_Search: {},
            BouncingServer_Smoke: {},

        },
        Funnel: {
            // Funnel_General: {},
            Funnel_MissingMandatoryFields: {},
            Funnel_PlacingAds: {},
        },
        MainPage: {
            MainPage_Cookies: {},
            MainPage_Navigation: {},
            MainPage_Search: {},
            MainPage_SocialMedia: {},

        },
        NewPropertyPage: {
            NPP_ContactDialog_Smoke: {},
            // NPP_PriceAlert_Smoke: {},
            NPP_ReportMistake_Smoke: {},
            // NPP_Share: {},
            NPP_Share_Smoke: {},
            NPP_Smoke: {},
            // NPP_TopInfoCheck: {},
        },
        PRO: {
            PRO_LoginNegative: {},
            PRO_LoginSmoke: {},
        },
        Search: {
            DirectSearch_Error: {},
            DirectSearch_Smoke: {},
            SaleSearch_Basic: {},
            SaleSearch_NoResults: {},
        },
    },
};

