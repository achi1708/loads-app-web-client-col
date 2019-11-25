(function() {
  'use strict';

  /* Truck details Directive
   * It shows truck info in dropdown of trucks table list
   * It is a generic element is loaded when user click in dropdown button of item */

  angular
    .module('loadsAppWeb')
    .directive('truckDetailsRow', truckDetailsRow);

  /** @ngInject */
  function truckDetailsRow($rootScope, Auth, Trucks, uiGmapGoogleMapApi, $uibModal, toastr, $filter) {
    return {
        templateUrl: 'app/trucks/templates/directives/truck-details-row.html', // directive template
        restrict: 'E',
        replace: true,
        scope: {
          truckId: '=', //Input of directive, Truck id
          reloadParent: '&' //Input of directive, function which reloads trucks table list
        },
        link: function(scope) {
            scope.truckData = {};
            scope.loadingTruckData = true;
            /**
             * Initialize
             */
            scope.initialize = function() {
                scope.truckOptions = {
                  'token': Auth.getUserToken(),
                  'id': scope.truckId
                };

                scope.getTruckDetails();
            };

            /* Get truck info from data received */
            scope.getTruckDetails =  function() {
              Trucks.trucksDetails(scope.truckOptions)
                .then(function(response){
                  scope.truckData = response.Truck_Details[0];
                  if(angular.isDefined(scope.truckData.skills_truck) && scope.truckData.skills_truck.length){
                    var arr_skills = [];
                    for(var sk in scope.truckData.skills_truck){
                      arr_skills.push(scope.truckData.skills_truck[sk].skills_name);
                    }
                    scope.truckData.SkillsTruckText = arr_skills.join(', ');
                  }else{
                    scope.truckData.SkillsTruckText = "---";
                  }

                  if(angular.isDefined(scope.truckData.truck_availability) && scope.truckData.truck_availability.length){
                    var arr_availability = [];
                    for(var av in scope.truckData.truck_availability){
                      arr_availability.push(scope.truckData.truck_availability[av].availablity_name);
                    }
                    scope.truckData.AvailabilityTruckText = arr_availability.join(', ');
                  }else{
                    scope.truckData.AvailabilityTruckText = "---";
                  }
                  scope.loadingTruckData = false;
                })
                .catch(function (error) {
                  scope.loadingTruckData = false;
                });
            };

            /* Active or inactive truck */
            scope.truckToggleActive = function() {
              var truckStatus = (scope.truckData.status == '1') ? '0' : '1';              
              var truckDataToUpdate = { token: Auth.getUserToken(), id_truck: scope.truckData.id, status: truckStatus};
              Trucks.updateTruck(truckDataToUpdate, false)
                    .then(function(response) {
                        // Success
                        if(truckStatus == '1'){
                          toastr.success($filter('translate')('trucks:details:active:action'));
                        }else{
                          toastr.success($filter('translate')('trucks:details:inactive:action'));
                        }
                        scope.reloadParent();
                    })
                    .catch(function(error) {
                        // Error
                        toastr.error($filter('translate')('trucks:details:active:error'));
                    });
            };

            // Initialize
            scope.initialize();
        }
    };
  }
})();
