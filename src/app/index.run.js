(function() {
  'use strict';

  angular
    .module('loadsAppWeb')
    .run(initialize);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

  function initialize(amMoment, $translate, PermPermissionStore, PermRoleStore, Auth) {
    $translate.refresh();
  	/**
     * Moment
     * Configuration of moment JS library (this library allows to show date in different formats)
     */
    moment.locale('en', {
        relativeTime: {
            future: "%s left",
            past: "%s ago",
            s: "seconds",
            m: "1 minute",
            mm: "%d minutes",
            h: "1 hour",
            hh: "%d hours",
            d: "1 day",
            dd: "%d days",
            M: "1 month",
            MM: "%d months",
            y: "1 year",
            yy: "%d years"
        }
    });
    moment.locale('es', {
        relativeTime: {
            future: "%s left",
            past: "%s ago",
            s: "seconds",
            m: "1 minute",
            mm: "%d minutes",
            h: "1 hour",
            hh: "%d hours",
            d: "1 day",
            dd: "%d days",
            M: "1 month",
            MM: "%d months",
            y: "1 year",
            yy: "%d years"
        }
    });

    /* Get current language of site and set it in moment JS's configuration */
  	var currentLang = $translate.proposedLanguage() || $translate.use();
    amMoment.changeLocale(currentLang);

    /**
     * Permissions
     * This function compares current logged user role with permission and returns a logical value
     */
    PermRoleStore
      .defineManyRoles({
        'CARRIER':  function (rol) { return Auth.getUserProfile() == 'CARRIER'; },
        'GENERADOR_CARGA':  function (rol) { return Auth.getUserProfile() == 'GENERADOR_CARGA'; },
        'DRIVER':  function (rol) { return Auth.getUserProfile() == 'DRIVER'; },
        'OWNER':  function (rol) { return Auth.getUserProfile() == 'OWNER'; }
      });
  }

})();
