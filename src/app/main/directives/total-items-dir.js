(function() {
  'use strict';

  /* Loads counter module Directive
   * Module shows total ofa: current loads, loads pending to assign, posted loads, available trucks, all loads */

  angular
    .module('loadsAppWeb')
    .directive('totalItems', TotalItems);

  /** @ngInject */
  function TotalItems($rootScope, Loads, Auth) {
    return {
        templateUrl: 'app/main/templates/directives/total-items.html',
        restrict: 'E',
        replace: true,
        scope: {},
        link: function(scope) {
            /**
             * Initialize
             */
            scope.initialize = function() {

              scope.totalItems = {};
              scope.loadingItemsData = true;

              scope.getTotalItems();
            };

            scope.getTotalItems = function(){
              var params = {token: Auth.getUserToken()};
              Loads.totalItems(params)
                .then(function(response) {
                  scope.totalItems.current_loads = (response.loads_current) ? response.loads_current : 0;
                  scope.totalItems.pending_assign = (response.loads_pending) ? response.loads_pending : 0;
                  scope.totalItems.posted_loads = (response.loads_post) ? response.loads_post : 0;
                  scope.totalItems.available_trucks = (response.total_trucks) ? response.total_trucks : 0;
                  scope.totalItems.all_loads = (response.total_loads) ? response.total_loads : 0;
                  scope.loadingItemsData = false;
                });
            }

            // Initialize
            scope.initialize();
        }
    };
  }
})();
