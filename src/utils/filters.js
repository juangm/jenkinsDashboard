import Vue from 'vue';
import translations from '@/config/dashboardTranslations.json';

Vue.filter('translate', str => {
    const translationKeys = Object.keys( translations );
    if ( translationKeys.includes( str ) ) {
        return translations[ str ];
    }
    return str;
});
