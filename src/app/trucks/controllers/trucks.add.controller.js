(function() {
  'use strict';

  /* Truck creation controller
   * Set form vars
   * Get drivers list
   * Get other params for characteristics of truck
   * Validate and submit form data*/

  angular
    .module('loadsAppWeb')
    .controller('TrucksAddController', TrucksAddController);

  /** @ngInject */
  function TrucksAddController($state, toastr, $filter, Config, Trucks, Loads, Carriers, Auth, DatatableTool, $q) {
	  var vm = this;

    /* Function executed at strart, set form vars and get drivers list and other truck params  */
	  vm.initialize = function() {
      vm.submitReturnList = false;

      vm.dataNewTruck = {};
      vm.dataNewTruck.token = Auth.getUserToken();
      vm.dataNewTruck.brand = null;
      vm.dataNewTruck.model = null;
      vm.dataNewTruck.year = null;
      vm.dataNewTruck.plate = '';
      vm.dataNewTruck.plate_trailer = '';
      vm.dataNewTruck.id_driver = null;
      vm.dataNewTruck.id_truck_type = null;
      vm.dataNewTruck.length = null;
      vm.dataNewTruck.weight = null,
      vm.dataNewTruck.id_capacity_size = null;
      vm.dataNewTruck.max_distance = null;
      vm.dataNewTruck.additional_info = null;
      vm.dataNewTruck.skils_truck = [];
      vm.dataNewTruck.availablity = [];
      vm.dataNewTruck.tipodetrailer = [];

      vm.plateByTruckType = ['3','4','5','6','8','10','11'];
      vm.allowShowPlateInput = false;

      vm.savingNewTruck = false;

      vm.getItemsSizeLengthLoads();
      vm.getMyDrivers();

      vm.trailerTypeRequired = null;

    };

    vm.checkTruckTypePlate = function() {
      if(vm.plateByTruckType.indexOf(vm.dataNewTruck.id_truck_type) != -1){
        vm.allowShowPlateInput = true;
      }else{
        vm.allowShowPlateInput = false;
      }
    };

    /* Get drivers list  */
    vm.getMyDrivers = function(){
      var params = {};
      params.token = Auth.getUserToken();
      vm.myDriversList = [];

      Carriers.getDriverxCarrier(params)
        .then(function(response){
          if(response.list_drivers){
            vm.myDriversList = response.list_drivers;
          }
        });      
    };

    /* Get truck skills list, availabilities and brands  */
    vm.getItemsSizeLengthLoads = function() {
      vm.itemsSizeLenLoads = {};
      Loads.getItemsSizeLengthLoads()
        .then(function(response){
          if(response){
            console.log(response);
            vm.itemsSizeLenLoads = response;
            if(angular.isDefined(vm.itemsSizeLenLoads.TrucksSkills_list)){
              vm.setTruckSkillList();
            }

            if(angular.isDefined(vm.itemsSizeLenLoads.TruckAvailability_list)){
              vm.setTruckAvailabilityList();
            }

            if(angular.isDefined(vm.itemsSizeLenLoads.BrandsTruck_list)){
              vm.brandTruckList = vm.itemsSizeLenLoads.BrandsTruck_list;
            }else{
              vm.brandTruckList = [];
            }
          }
        }); 
    };

    /* Set truck skills list in local var to be used in checkboxes */
    vm.setTruckSkillList = function() {
      vm.skillList = [];
      if(vm.itemsSizeLenLoads.TrucksSkills_list.length){
        for(var i in vm.itemsSizeLenLoads.TrucksSkills_list){
          vm.skillList.push({id: vm.itemsSizeLenLoads.TrucksSkills_list[i].id, name: vm.itemsSizeLenLoads.TrucksSkills_list[i].skills_name, checked: false});
        }
      }
    };

    /* Set truck availabilities list in local var to be used in checkboxes */
    vm.setTruckAvailabilityList = function() {
      vm.availabilityList = [];
      if(vm.itemsSizeLenLoads.TruckAvailability_list.length){
        for(var i in vm.itemsSizeLenLoads.TruckAvailability_list){
          vm.availabilityList.push({id: vm.itemsSizeLenLoads.TruckAvailability_list[i].id, name: vm.itemsSizeLenLoads.TruckAvailability_list[i].availablity_name, checked: false});
        }
      }
    };

    /* Validate and send form data to API */
    vm.save = function(postTruckFormName) {
      vm.savingNewTruck = true;
      // Validate form.
      if (postTruckFormName.$invalid) {
          // If there was an error for required fields.
          if (postTruckFormName.$error.required) {
              toastr.error($filter('translate')('loads:add:form:required:fields:error'));
          } else {
              toastr.error($filter('translate')('loads:add:form:required:fields:invalid'));
          }
          vm.savingNewTruck = false;
          return;
      }

      vm.dataNewTruck.tipodetrailer = [];
      if(angular.isDefined(vm.trailerTypeRequired)){
        if(vm.trailerTypeRequired != '' && vm.trailerTypeRequired != '0' && vm.trailerTypeRequired != 0){
          vm.dataNewTruck.tipodetrailer.push(vm.trailerTypeRequired);
        }

        if(vm.dataNewTruck.tipodetrailer.length <= 0){
          toastr.error($filter('translate')('loads:add:form:required:fields:error'));
          vm.savingNewTruck = false;
          return;
        }

        vm.dataNewTruck.tipodetrailer = JSON.stringify(vm.dataNewTruck.tipodetrailer);
      }

      if(angular.isDefined(vm.skillList)){
        vm.skillList.forEach(function(item) {
          if (item.checked) vm.dataNewTruck.skils_truck.push(item.id);
        });
      }

      if(angular.isDefined(vm.availabilityList)){
        vm.availabilityList.forEach(function(item) {
          if (item.checked) vm.dataNewTruck.availablity.push(item.id);
        });
      }

      vm.dataNewTruck.skils_truck = JSON.stringify(vm.dataNewTruck.skils_truck);

      vm.dataNewTruck.availablity = JSON.stringify(vm.dataNewTruck.availablity);

      Trucks.createTruck(vm.dataNewTruck)
            .then(function(response) {
                // Success
                console.log(response);
                toastr.success($filter('translate')('trucks:add:form:success'));
                if(vm.submitReturnList){
                  $state.go('private.trucks');
                }else{
                  vm.initialize();
                }
                vm.savingNewTruck = false;
            })
            .catch(function(error) {
                // Error
                if(error === 'image_exceeded_limit'){
                  toastr.error($filter('translate')('trucks:add:form:pic_size:over'));
                }else{
                  toastr.error($filter('translate')('loads:add:form:required:fields:invalid'));
                }
                // Loading
                vm.savingNewTruck = false;
            });

    };

    /* Set return list var and send form data to API */
    vm.submitReturnListFunc = function(postTruckFormName) {
      vm.submitReturnList = true;
      vm.save(postTruckFormName);
    };

    vm.initialize();
  }
})();
