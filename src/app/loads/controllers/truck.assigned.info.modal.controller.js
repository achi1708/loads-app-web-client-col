(function() {
  'use strict';

  /* Truck assigned info modal controller
   * Get truck id 
   * Look for truck info
   * Redirect to loads by truck
   */

  angular
    .module('loadsAppWeb')
    .controller('TruckAssignedInfoModalController', TruckAssignedInfoModalController);

  /** @ngInject */
  function TruckAssignedInfoModalController($state, truck, Auth, Trucks, $uibModalInstance, $q, toastr, $filter) {
	  var vm = this;

    /* Function executed at strart, get truck id and look for truck info  */
    vm.initialize = function() {
      vm.truckInfoReceived = truck;
      vm.params = {};
      vm.params.id = null;
      vm.params.token = Auth.getUserToken();
      vm.finalTruckData = false;
      vm.loadingInfo = true;

      if(angular.isDefined(vm.truckInfoReceived.id)){
        vm.params.id =  vm.truckInfoReceived.id;

        vm.getTruckSearch();
      }else{
        vm.loadingInfo = false;
      }
    };

    /* Get truck info */
    vm.getTruckSearch = function() {

      Trucks.trucksDetails(vm.params)
        .then(function(response){
          console.log(response);
          vm.finalTruckData = response.Truck_Details[0];

          if(vm.finalTruckData){
            if(angular.isDefined(vm.finalTruckData.skills_truck) && vm.finalTruckData.skills_truck.length){
              var arr_skills = [];
              for(var sk in vm.finalTruckData.skills_truck){
                arr_skills.push(vm.finalTruckData.skills_truck[sk].skills_name);
              }
              vm.finalTruckData.SkillsTruckText = arr_skills.join(', ');
            }else{
              vm.finalTruckData.SkillsTruckText = "---";
            }

            if(angular.isDefined(vm.finalTruckData.truck_availability) && vm.finalTruckData.truck_availability.length){
              var arr_availability = [];
              for(var av in vm.finalTruckData.truck_availability){
                arr_availability.push(vm.finalTruckData.truck_availability[av].availablity_name);
              }
              vm.finalTruckData.AvailabilityTruckText = arr_availability.join(', ');
            }else{
              vm.finalTruckData.AvailabilityTruckText = "---";
            }
          }

          vm.loadingInfo = false;
        })
        .catch(function (error) {
          scope.loadingInfo = false;
        });
    };

    /* Redirect to loads by truck information */
    vm.goToTruckLoads = function() {
      $state.go('private.trucks.loads', {id: vm.finalTruckData.id});
      vm.closePopup();
    };

    /* Close popup */
    vm.closePopup = function() {
        $uibModalInstance.close();
    };

    vm.initialize();
    
  }
})();
