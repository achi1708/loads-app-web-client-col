/* global malarkey:false, moment:false */
(function() {
  'use strict';
  // This page loads all constants used in the site
  angular
    .module('loadsAppWeb')
    .constant('malarkey', malarkey)
    .constant('moment', moment)
    .constant('Config', {
        ENV: {
            'API_ENDPOINT': 'https://www.loadsapp.co/ServicesApp/public/index.php/api/v1/', // api route
		    'PREFERRED_LANGUAGE': 'en', // prefered language for the site's strings
		    'FALLBACK_LANGUAGE': 'es', // second language
            'INVITE_JOIN_MAIL_BODY_URL': 'http://www.loadsapp.co/WebApp', // url is used when site sends an email in invite to join section
            'GOOGLE_MAPS_KEY': 'AIzaSyCOr68rWTWKlLf2Ipxt4lnmlvTJ0hVKGvE', // Google maps api key
            'STORAGE_ENDPOINT': 'https://www.loadsapp.co/ServicesApp/storage/app/public/' // api storage route

            /*endinject*/
        },
        BUILD: {
            /*inject-build*/
            /*endinject*/
        }

    });

})();
