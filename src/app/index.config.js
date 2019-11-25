(function() {
  'use strict';
  // Configuration that it is executed at start of all when angular's components is loading
  angular
    .module('loadsAppWeb')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastrConfig, $translateProvider, $httpProvider, uiGmapGoogleMapApiProvider, ngImageGalleryOptsProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Set params of toastr plugin (It is the plugin shows alerts or messages)
    toastrConfig.allowHtml = true; // allow making alert with html code
    toastrConfig.timeOut = 3000; // time it spends showing the message
    toastrConfig.positionClass = 'toast-top-right'; // css class that resolves where it will show the alert
    toastrConfig.preventDuplicates = false; 
    toastrConfig.progressBar = false;

    /**
     * Translate
     * Configuration about location of all languages texts
     */
    $translateProvider.useStaticFilesLoader({//@see http://angular-translate.github.io/docs/#/guide/12_asynchronous-loading
        files: [{
            prefix: 'app/main/assets/locales/',
            suffix: '.json'
        }]
    });
    $translateProvider.registerAvailableLanguageKeys(['en', 'es'], {
        'en': 'en', 'es': 'es'
    });
    $translateProvider.preferredLanguage('es');
    $translateProvider.fallbackLanguage('en');
    $translateProvider.determinePreferredLanguage();
    $translateProvider.useSanitizeValueStrategy('escapeParameters');
    $translateProvider.forceAsyncReload(true);

    //Configuration Google maps library
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyCOr68rWTWKlLf2Ipxt4lnmlvTJ0hVKGvE',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });

    // Configuration about gallery
    ngImageGalleryOptsProvider.setOpts({
        thumbnails      :   true,
        thumbSize       :   80,
        inline          :   false,
        bubbles         :   true,
        bubbleSize      :   20,
        imgBubbles      :   false,
        bgClose         :   false,
        piracy          :   false,
        imgAnim         :   'fadeup',
    });

  }

})();
