(function() {
  'use strict';

  /* Truck edition controller
   * Set form vars
   * Get truck info
   * Get drivers list
   * Get other params for characteristics of truck
   * Validate and submit form data*/

  angular
    .module('loadsAppWeb')
    .controller('TrucksEditController', TrucksEditController);

  /** @ngInject */
  function TrucksEditController($state, $stateParams, toastr, $filter, Config, Trucks, Loads, Carriers, Auth, DatatableTool, $q) {
	  var vm = this;

    /* Function executed at strart, set form vars and get drivers list and other truck params  */
	  vm.initialize = function() {
      vm.submitReturnList = false;
      vm.loadingTruckDetails = true;
      vm.truckId = $stateParams.id|| false;
      vm.truckData = false;

      vm.dataUpdateTruck = {};
      vm.dataUpdateTruck.id_truck = null;
      vm.dataUpdateTruck.token = Auth.getUserToken();
      vm.dataUpdateTruck.brand = null;
      vm.dataUpdateTruck.model = null;
      vm.dataUpdateTruck.year = null;
      vm.dataUpdateTruck.plate = '';
      vm.dataUpdateTruck.plate_trailer = '';
      vm.dataUpdateTruck.id_driver = null;
      vm.dataUpdateTruck.id_truck_type = null;
      vm.dataUpdateTruck.length = null;
      vm.dataUpdateTruck.weight = null,
      vm.dataUpdateTruck.id_capacity_size = null;
      vm.dataUpdateTruck.max_distance = null;
      vm.dataUpdateTruck.additional_info = null;
      vm.dataUpdateTruck.pic = null;
      vm.dataUpdateTruck.skils_truck = [];
      vm.dataUpdateTruck.availablity = [];
      vm.dataUpdateTruck.tipodetrailer = [];

      vm.savingTruck = false;

      vm.plateByTruckType = ['3','4','5','6','8','10','11'];
      vm.allowShowPlateInput = false;

      vm.trailerTypeRequired = null;

      vm.getItemsSizeLengthLoads();
      vm.getMyDrivers();

      vm.truckOptions = {
        'token': Auth.getUserToken(),
        'id': vm.truckId
      };

    };

    vm.checkTruckTypePlate = function() {
      if(vm.plateByTruckType.indexOf(vm.dataUpdateTruck.id_truck_type) != -1){
        vm.allowShowPlateInput = true;
      }else{
        vm.allowShowPlateInput = false;
      }
    };

    /* Get drivers list */
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

            vm.getDataTruck();
          }
        }); 
    };

    /* Get truck info  */
    vm.getDataTruck =  function() {
      Trucks.trucksDetails(vm.truckOptions)
        .then(function(response){
          console.log(response);
          vm.truckData = response.Truck_Details[0];
          vm.setDataToForm();

          vm.loadingTruckDetails = false;
        })
        .catch(function (error) {
          vm.loadingTruckDetails = false;
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

    /* After get truck info, it sets them in locak vars */
    vm.setDataToForm = function() {
      vm.dataUpdateTruck.id_truck = (angular.isDefined(vm.truckData.id)) ? vm.truckData.id : vm.truckId;
      vm.dataUpdateTruck.brand = (angular.isDefined(vm.truckData.brand)) ? vm.truckData.brand : null;
      vm.dataUpdateTruck.model = (angular.isDefined(vm.truckData.model)) ? vm.truckData.model : null;
      vm.dataUpdateTruck.year = (angular.isDefined(vm.truckData.year)) ? parseInt(vm.truckData.year) : null;
      vm.dataUpdateTruck.plate = (angular.isDefined(vm.truckData.plate)) ? vm.truckData.plate : null;
      vm.dataUpdateTruck.plate_trailer = (angular.isDefined(vm.truckData.plate_trailer)) ? vm.truckData.plate_trailer : null;
      vm.dataUpdateTruck.id_driver = (angular.isDefined(vm.truckData.truck_driver)) ? vm.truckData.truck_driver.toString() : null;
      vm.dataUpdateTruck.id_truck_type = (angular.isDefined(vm.truckData.truck_type.id)) ? vm.truckData.truck_type.id.toString() : null;
      vm.dataUpdateTruck.length = (angular.isDefined(vm.truckData.length)) ? parseInt(vm.truckData.length) : null;
      vm.dataUpdateTruck.weight = (angular.isDefined(vm.truckData.weight)) ? parseInt(vm.truckData.weight) : null;
      vm.dataUpdateTruck.id_capacity_size = (angular.isDefined(vm.truckData.truck_capacity.id)) ? vm.truckData.truck_capacity.id.toString() : null;
      vm.dataUpdateTruck.max_distance = (angular.isDefined(vm.truckData.max_distance)) ? parseInt(vm.truckData.max_distance) : null;
      vm.dataUpdateTruck.additional_info = (angular.isDefined(vm.truckData.additional_info)) ? vm.truckData.additional_info : null;
      vm.dataUpdateTruck.pic = (angular.isDefined(vm.truckData.imagenes_trucks) && vm.truckData.imagenes_trucks != null) ? vm.truckData.imagenes_trucks[0]['imagen-270'] : null;

      if(vm.truckData.tipo_de_trailer && vm.truckData.tipo_de_trailer.length > 0){
        for(var index in vm.truckData.tipo_de_trailer){
          vm.trailerTypeRequired = vm.truckData.tipo_de_trailer[index].id.toString();
        }
      }

      vm.checkTruckTypePlate();

      if(angular.isDefined(vm.truckData.skills_truck) && vm.truckData.skills_truck.length > 0){
        vm.dataUpdateTruck.skils_truck = [];
        vm.truckData.skills_truck.forEach(function(item) {
          vm.dataUpdateTruck.skils_truck.push(item.id);
        });

        if(angular.isDefined(vm.skillList) && vm.skillList.length){
          vm.skillList.forEach(function(item) {
            console.log(item.id);
            console.log(vm.dataUpdateTruck.skils_truck.indexOf(item.id));
            if(vm.dataUpdateTruck.skils_truck.indexOf(item.id) != -1){
              item.checked = true;
            }
          });
        }
      }

      if(angular.isDefined(vm.truckData.truck_availability) && vm.truckData.truck_availability.length > 0){
        vm.dataUpdateTruck.availablity = [];
        vm.truckData.truck_availability.forEach(function(item) {
          vm.dataUpdateTruck.availablity.push(item.id);
        });

        if(angular.isDefined(vm.availabilityList) && vm.availabilityList.length){
          vm.availabilityList.forEach(function(item) {
            if(vm.dataUpdateTruck.availablity.indexOf(item.id) != -1){
              item.checked = true;
            }
          });
        }
      }
    };

    /* Validate and send form data to API */
    vm.save = function(postTruckFormName) {
      vm.savingTruck = true;
      var withImg = true;
      // Validate form.
      if (postTruckFormName.$invalid) {
          // If there was an error for required fields.
          if (postTruckFormName.$error.required) {
              toastr.error($filter('translate')('loads:add:form:required:fields:error'));
          } else {
              toastr.error($filter('translate')('loads:add:form:required:fields:invalid'));
          }
          vm.savingTruck = false;
          return;
      }

      vm.dataUpdateTruck.tipodetrailer = [];
      if(angular.isDefined(vm.trailerTypeRequired)){
        if(vm.trailerTypeRequired != '' && vm.trailerTypeRequired != '0' && vm.trailerTypeRequired != 0){
          vm.dataUpdateTruck.tipodetrailer.push(vm.trailerTypeRequired);
        }

        if(vm.dataUpdateTruck.tipodetrailer.length <= 0){
          toastr.error($filter('translate')('loads:add:form:required:fields:error'));
          vm.savingTruck = false;
          return;
        }

        vm.dataUpdateTruck.tipodetrailer = JSON.stringify(vm.dataUpdateTruck.tipodetrailer);
      }

      if(angular.isDefined(vm.skillList)){
        vm.dataUpdateTruck.skils_truck = [];
        vm.skillList.forEach(function(item) {
          if (item.checked) vm.dataUpdateTruck.skils_truck.push(item.id);
        });

        vm.dataUpdateTruck.skils_truck = JSON.stringify(vm.dataUpdateTruck.skils_truck);
      }

      if(angular.isDefined(vm.availabilityList)){
        vm.dataUpdateTruck.availablity = [];
        vm.availabilityList.forEach(function(item) {
          if (item.checked) vm.dataUpdateTruck.availablity.push(item.id);
        });

        vm.dataUpdateTruck.availablity = JSON.stringify(vm.dataUpdateTruck.availablity);
      }

      if(typeof vm.dataUpdateTruck.pic == 'string' || vm.dataUpdateTruck.pic == null){
        delete vm.dataUpdateTruck.pic;
        withImg = false;
      }

      Trucks.updateTruck(vm.dataUpdateTruck, withImg)
            .then(function(response) {
                // Success
                toastr.success($filter('translate')('trucks:edit:form:success'));
                vm.getDataTruck();
                vm.savingTruck = false;
            })
            .catch(function(error) {
                // Error
                if(error === 'image_exceeded_limit'){
                  toastr.error($filter('translate')('trucks:add:form:pic_size:over'));
                }else{
                  toastr.error($filter('translate')('loads:add:form:required:fields:invalid'));
                }
                // Loading
                vm.savingTruck = false;
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
