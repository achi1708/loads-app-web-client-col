(function() {
  'use strict';

  /* Driver edition controller
   */

  angular
    .module('loadsAppWeb')
    .controller('DriversEditController', DriversEditController);

  /** @ngInject */
  function DriversEditController($state, $stateParams, toastr, $filter, Config, Trucks, Drivers, Loads, Auth, DatatableTool, $q) {
	  var vm = this;

    /* Function executed at strart, set form vars and get truck list  */
	  vm.initialize = function() {
      vm.submitReturnList = false;

      vm.driverId = $stateParams.id|| false;
      vm.driverData = false;

      vm.dataUpdateDriver = {};
      vm.dataUpdateDriver.profile = 'DRIVER';
      vm.dataUpdateDriver.token = Auth.getUserToken();
      vm.dataUpdateDriver.driver_id = null;
      vm.dataUpdateDriver.user_first_name = null;
      vm.dataUpdateDriver.user_last_name = null;
      vm.dataUpdateDriver.user_phone = null;
      vm.dataUpdateDriver.user_email = null;
      vm.dataUpdateDriver.user_contry = null;
      vm.dataUpdateDriver.bond_insurance_num_policy = null;
      vm.dataUpdateDriver.bond_insurance_comp = null,
      vm.dataUpdateDriver.bond_insurance_num = null;
      vm.dataUpdateDriver.user_postalcode = null;
      vm.dataUpdateDriver.user_city = null;
      vm.dataUpdateDriver.user_state = null;
      vm.dataUpdateDriver.driver_license_num = null;
      vm.dataUpdateDriver.truck_id = null;
      vm.dataUpdateDriver.type_document = null;
      vm.dataUpdateDriver.type_document_number = null;

      vm.savingUpdateDriver = false;
      vm.submitReturnList = false;
      vm.trucksList = [];

      vm.typeDocumentOptions = [
                             {id: null, name: $filter('translate')('form:default:select:null_option')},
                             {id: 'CC', name: $filter('translate')('sign_up:form:type_document:cc:label')},
                             {id: 'NIT', name: $filter('translate')('sign_up:form:type_document:nit:label')},
                             {id: 'Pasaporte', name: $filter('translate')('sign_up:form:type_document:pas:label')},
                             {id: 'CE', name: $filter('translate')('sign_up:form:type_document:ce:label')},
                             {id: 'NUIP', name: $filter('translate')('sign_up:form:type_document:nuip:label')}
                            ];

      vm.optionsGoogleInputCity = {
        types: ['(cities)']
      };

      vm.getTruckList();
    };

    /* Get truck list */
    vm.getTruckList = function() {
      var options = {
        'shortcut': 'active',
        'token': Auth.getUserToken(),
        'page': 1
      };

      Trucks.trucksForCarrier(options)
        .then(function(response){
          vm.trucksList = response.truck_results;
          vm.getDataDriver();
        });
    };

    /* Get data driver */
    vm.getDataDriver = function() {
      var driverOptions = {
        'token': Auth.getUserToken(),
        'driver_id': (vm.driverId) ? vm.driverId : false
      };

      if(driverOptions.driver_id){
        Drivers.driverById(driverOptions)
          .then(function(response){
            if(response.info){
              vm.driverData = response.info[0];
              vm.setDataToForm();
              vm.loadingDataDetails = false;
            }else{
              $state.go('private.drivers');
            }
          })
          .catch(function (error) {
            vm.loadingDataDetails = false;
            $state.go('private.drivers');
          });
      }else{
        vm.loadingDataDetails = false;
        $state.go('private.drivers');
      }
    };

    /* Set load info in local vars  */
    vm.setDataToForm = function() {
      vm.dataUpdateDriver.driver_id = (angular.isDefined(vm.driverData.user_id)) ? vm.driverData.user_id : null;
      vm.dataUpdateDriver.user_first_name = (angular.isDefined(vm.driverData.user)) ? vm.driverData.user.user_first_name : null;
      vm.dataUpdateDriver.user_last_name = (angular.isDefined(vm.driverData.user)) ? vm.driverData.user.user_last_name : null;
      vm.dataUpdateDriver.user_phone = (angular.isDefined(vm.driverData.user)) ? vm.driverData.user.user_phone : null;
      vm.dataUpdateDriver.user_email = (angular.isDefined(vm.driverData.user)) ? vm.driverData.user.user_email : null;
      vm.dataUpdateDriver.user_contry = (angular.isDefined(vm.driverData.user)) ? vm.driverData.user.user_contry : null;
      vm.dataUpdateDriver.bond_insurance_num_policy = (angular.isDefined(vm.driverData.bond_insurance_num_policy)) ? vm.driverData.bond_insurance_num_policy : null;
      vm.dataUpdateDriver.bond_insurance_comp = (angular.isDefined(vm.driverData.bond_insurance_comp)) ? vm.driverData.bond_insurance_comp : null;
      vm.dataUpdateDriver.bond_insurance_num = (angular.isDefined(vm.driverData.bond_insurance_num)) ? vm.driverData.bond_insurance_num : null;
      vm.dataUpdateDriver.user_postalcode = (angular.isDefined(vm.driverData.user)) ? vm.driverData.user.user_postalcode : null;
      vm.dataUpdateDriver.user_city = (angular.isDefined(vm.driverData.user)) ? vm.driverData.user.user_city : null;
      vm.dataUpdateDriver.user_state = (angular.isDefined(vm.driverData.user)) ? vm.driverData.user.user_state : null;
      vm.dataUpdateDriver.driver_license_num = (angular.isDefined(vm.driverData.driver_license_num)) ? vm.driverData.driver_license_num : null;
      vm.dataUpdateDriver.truck_id = (angular.isDefined(vm.driverData.trucks)) ? vm.driverData.trucks[0].id.toString() : null;
      vm.dataUpdateDriver.type_document = (angular.isDefined(vm.driverData.user)) ? vm.driverData.user.type_document : null;
      vm.dataUpdateDriver.type_document_number = (angular.isDefined(vm.driverData.user)) ? vm.driverData.user.type_document_number : null;
      
    };

    

    /* Validate and send form data to API */
    vm.save = function(postDriverFormName) {
      vm.savingUpdateDriver = true;
      // Validate form.
      if (postDriverFormName.$invalid) {
          // If there was an error for required fields.
          if (postLoadFormName.$error.required) {
              toastr.error($filter('translate')('loads:add:form:required:fields:error'));
          } else {
              toastr.error($filter('translate')('loads:add:form:required:fields:invalid'));
          }
          vm.savingUpdateDriver = false;
          return;
      }

      Drivers.updateDriver(vm.dataUpdateDriver)
            .then(function(response) {
                // Success
                console.log(response);
                toastr.success($filter('translate')('drivers:add:form:success'));
                if(vm.submitReturnList){
                  $state.go('private.drivers');
                }else{
                  vm.initialize();
                }
                vm.savingUpdateDriver = false;
            })
            .catch(function(error) {
              console.log(error);
                // Error
                if(error === 'image_exceeded_limit'){
                  toastr.error($filter('translate')('drivers:add:form:pic_size:over'));
                }else if(error === 'user_exist'){
                  toastr.error($filter('translate')('sign_up:form:error:user_exists'));
                }else{
                  toastr.error($filter('translate')('loads:add:form:required:fields:invalid'));
                }
                // Loading
                vm.savingUpdateDriver = false;
            });

      vm.savingUpdateDriver = false;


    };

    vm.submitReturnListFunc = function(postDriverFormName) {
      vm.submitReturnList = true;
      vm.save(postDriverFormName);
    };

    

    vm.initialize();
  }
})();
