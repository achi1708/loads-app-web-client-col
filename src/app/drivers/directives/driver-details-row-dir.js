(function() {
  'use strict';

  /* Driver details Directive
   * It shows driver info in dropdown of driver table list
   * It is a generic element is loaded when user click in dropdown button of item */

  angular
    .module('loadsAppWeb')
    .directive('driverDetailsRow', driverDetailsRow);

  /** @ngInject */
  function driverDetailsRow($rootScope, Auth, Drivers, uiGmapGoogleMapApi, $uibModal) {
    return {
        templateUrl: 'app/drivers/templates/directives/driver-details-row.html', // directive template
        restrict: 'E',
        replace: true,
        scope: {
          driverInfo: '=' //Input of directive, Driver info which feeds this directive
        },
        link: function(scope) {
            scope.driverData = {};
            /**
             * Initialize
             * Set driver info in local var
             */
            scope.initialize = function() {
              scope.driverData = scope.driverInfo;
            };

            // Initialize
            scope.initialize();
        }
    };
  }
})();
