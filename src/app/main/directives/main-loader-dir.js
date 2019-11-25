(function() {
  'use strict';

  /* Loader Directive
   * Loader loop image */

  angular
    .module('loadsAppWeb')
    .directive('mainLoader', MainLoader);

  /** @ngInject */
  function MainLoader() {
    return {
        templateUrl: 'app/main/templates/directives/main-loader.html',
        restrict: 'E',
        replace: true,
        scope: {},
        link: function(scope) {
            
        }
    };
  }
})();
