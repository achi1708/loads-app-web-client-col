(function() {
  'use strict';

  /* Aside Directive
   * Left panel where is main menu */

  angular
    .module('loadsAppWeb')
    .directive('appAside', AppAside);

  /** @ngInject */
  function AppAside($state, $rootScope, Auth) {
    return {
        templateUrl: 'app/main/templates/directives/app-aside.html',
        restrict: 'E',
        replace: true,
        scope: {},
        link: function(scope) {
            /**
             * Initialize
             */
            scope.initialize = function() {
                scope.profile = Auth.getUserProfile();
                scope.loadsActive = $state.includes('private.loads');
                scope.carriersActive = $state.includes('private.carriers');

                if(scope.profile){
                  scope.profile = scope.profile.toLowerCase();
                }
            };

            // Initialize
            scope.initialize();
        }
    };
  }
})();
