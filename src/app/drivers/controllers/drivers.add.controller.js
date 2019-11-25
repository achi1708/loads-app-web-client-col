(function() {
  'use strict';

  /* Driver creation controller
   * Set vars to create a driver
   * Validate form
   * Send data to API and show successful message or any error
   */

  angular
    .module('loadsAppWeb')
    .controller('DriversAddController', DriversAddController);

  /** @ngInject */
  function DriversAddController($state, toastr, $filter, Config, Trucks, Drivers, Loads, Carriers, Auth, DatatableTool, $q) {
	  var vm = this;

    /* Function executed at strart, set form vars and get truck list */
	  vm.initialize = function() {
      vm.submitReturnList = false;

      vm.dataNewDriver = {};
      vm.dataNewDriver.profile = 'DRIVER';
      vm.dataNewDriver.token = Auth.getUserToken();
      vm.dataNewDriver.user_first_name = null;
      vm.dataNewDriver.user_last_name = null;
      vm.dataNewDriver.user_phone = null;
      vm.dataNewDriver.user_email = null;
      vm.dataNewDriver.user_contry = null;
      vm.dataNewDriver.user_password = null;
      vm.dataNewDriver.user_confirmpassword = null;
      vm.dataNewDriver.bond_insurance_num_policy = null;
      vm.dataNewDriver.bond_insurance_comp = null,
      vm.dataNewDriver.bond_insurance_num = null;
      vm.dataNewDriver.user_postalcode = null;
      vm.dataNewDriver.name_bank = null;
      vm.dataNewDriver.number_account_bank = null;
      vm.dataNewDriver.user_city = null;
      vm.dataNewDriver.user_state = null;
      vm.dataNewDriver.user_postalcode = null;
      vm.dataNewDriver.driver_license_num = null;
      vm.dataNewDriver.id_truck = null;
      vm.dataNewDriver.type_document = null;
      vm.dataNewDriver.type_document_number = null;

      vm.savingNewDriver = false;
      vm.trucksList = [];

      vm.typeDocumentOptions = [
                             {id: null, name: $filter('translate')('form:default:select:null_option')},
                             {id: 'CC', name: $filter('translate')('sign_up:form:type_document:cc:label')},
                             {id: 'NIT', name: $filter('translate')('sign_up:form:type_document:nit:label')},
                             {id: 'Pasaporte', name: $filter('translate')('sign_up:form:type_document:pas:label')},
                             {id: 'CE', name: $filter('translate')('sign_up:form:type_document:ce:label')},
                             {id: 'NUIP', name: $filter('translate')('sign_up:form:type_document:nuip:label')}
                            ];

      vm.getTruckList();

    };

    /* Send data to API after validate form */
    vm.save = function(postDriverFormName) {
      vm.savingNewDriver = true;
      // Validate form.
      if (postDriverFormName.$invalid) {
          // If there was an error for required fields.
          if (postDriverFormName.$error.required) {
              toastr.error($filter('translate')('loads:add:form:required:fields:error'));
          } else {
              toastr.error($filter('translate')('loads:add:form:required:fields:invalid'));
          }
          vm.savingNewDriver = false;
          return;
      }

      if(vm.dataNewDriver.user_password != vm.dataNewDriver.user_confirmpassword){
        toastr.error($filter('translate')('drivers:add:form:password:validate'));
        vm.savingNewDriver = false;
        return;
      }

      Drivers.createDriver(vm.dataNewDriver)
            .then(function(response) {
                // Success
                console.log(response);
                toastr.success($filter('translate')('drivers:add:form:success'));
                if(vm.submitReturnList){
                  $state.go('private.drivers');
                }else{
                  vm.initialize();
                }
                vm.savingNewDriver = false;
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
                vm.savingNewDriver = false;
            });

    };

    /* Send data to API before set "return list" flag to return the user to driver list after create a new driver */
    vm.submitReturnListFunc = function(postDriverFormName) {
      vm.submitReturnList = true;
      vm.save(postDriverFormName);
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
        });
    };

    vm.initialize();
  }
})();
