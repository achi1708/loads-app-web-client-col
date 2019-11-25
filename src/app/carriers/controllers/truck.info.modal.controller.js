(function() {
  'use strict';

  /* Truck info controller of modal
   * It gets a Truck Id and looks for its information*/

  angular
    .module('loadsAppWeb')
    .controller('TruckInfoModalController', TruckInfoModalController);

  /** @ngInject */
  function TruckInfoModalController($state, truck, $uibModalInstance, $filter, Trucks, Auth, toastr) {
	  var vm = this;
    
    vm.truckId = truck;
    vm.loadingData = true;
    vm.infoTruck = false;

    vm.initialize = function(){
      vm.getInfoTruck();
    };

    /* Get truck info */
    vm.getInfoTruck = function(){
      var params = {};
      params.token = Auth.getUserToken();
      params.id = vm.truckId;

      Trucks.trucksDetails(params)
        .then(function(response){
          if(response.Truck_Details[0]){
            vm.infoTruck = response.Truck_Details[0];

            if(vm.infoTruck.skills_truck){
              var arr_skills = [];
              for(var i in vm.infoTruck.skills_truck){
                arr_skills.push(vm.infoTruck.skills_truck[i].skills_name);
              }

              vm.infoTruck.skills_truck_text = arr_skills.join(',');

              console.log(vm.skills_truck_text);
            }else{
              vm.infoTruck.skills_truck_text = '';
            }

            if(vm.infoTruck.truck_availability){
              var arr_availability = [];
              for(var i in vm.infoTruck.truck_availability){
                arr_availability.push(vm.infoTruck.truck_availability[i].availablity_name);
              }

              vm.infoTruck.truck_availability_text = arr_availability.join(',');
            }else{
              vm.infoTruck.truck_availability_text = '';
            }
          }
          vm.loadingData = false;
          console.log(vm.infoTruck);
        });
    };

    /* Close modal */
    vm.closePopup = function(resp) {
        $uibModalInstance.close(resp);
    };

    vm.initialize();
  }
})();
