(function() {
  'use strict';

  /* Set load truck modal controller
   * Receive load id 
   * Verify load status to assign truck
   * Get trucks list
   * Assign truck to load
   */

  angular
    .module('loadsAppWeb')
    .controller('LoadTruckSelectModalController', LoadTruckSelectModalController);

  /** @ngInject */
  function LoadTruckSelectModalController($state, load, carrier, Auth, Loads, Carriers, Trucks, $uibModalInstance, DatatableTool, $q, toastr, $filter, $sce) {
	  var vm = this;

    /* Function executed at strart, get load id and verify load  */
    vm.initialize = function() {
      vm.datatableOptions = DatatableTool.getDefaultSettings();
      vm.datatableOptions.paging = false;
      vm.loadId = load;
      vm.carrierInfo = carrier;
      vm.loadingInfo = true;
      vm.savingRequest = false;
      vm.truckOptions = {
        'shortcut': 'active',
        'token': Auth.getUserToken(),
        'page': 1
      };

      vm.dataRequest = {};

      vm.dataTruckSelect = {};
      vm.dataTruckSelect.truck_id = null;

      vm.verifyLoad();
    };

    /* Verify load status to allow assigning the truck */
    vm.verifyLoad = function() {
      var params = {
                    'token': Auth.getUserToken(),
                    'load_id': vm.loadId
                   };

      Loads.getLoadDetails(params)
        .then(function(response){
          vm.loadData = response.result;

          if(vm.loadData.status_loads != 'NOT_ASSIGNED' && vm.loadData.status_loads != 'CANCELADA'){ //&& vm.loadData.info_truck == 0
            vm.getTrucks();
          }else{
            vm.closePopup();
          }
        })
        .catch(function (error) {
          vm.closePopup();
        });
    };

    /* Get trucks list by carrier */
    vm.getTrucks = function() {
      Trucks.trucksForCarrier(vm.truckOptions)
        .then(function(response){
          vm.dataRequest = response.truck_results;

          if(vm.dataRequest.length > 0){
            _.forEach(vm.dataRequest, function(value, key) {

                value.truck_img = false;
                if(angular.isDefined(value.img_truck_imagenes) && value.img_truck_imagenes != null){
                  value.truck_img = value.img_truck_imagenes[0]['imagen-60'];
                }

                value.truck_name = value.brand+' '+value.marca+' '+value.model;

                value.driver_name = value.driver.user.user_first_name+' '+value.driver.user.user_last_name;

                value.truck_status = '';
                  var bgColorBtn = ''
                  , colorBtn = '';

                  switch(value.status){
                    case '1':
                      bgColorBtn = 'bg-color-3';
                      colorBtn = 'color-armadillo';
                      break;
                    case '0':
                      bgColorBtn = 'bg-color-7';
                      colorBtn = 'color-armadillo';
                      break;
                  }

                  value.truck_status = $sce.trustAsHtml('<button class="btn btn-class2 '+bgColorBtn+' '+colorBtn+'">'+$filter('translate')('trucks:table:status:' +value.status+ ':text')+'</button>');
            });
          }
          vm.loadingInfo = false;
        })
        .catch(function (error) {
          vm.loadingInfo = false;
        });
    };

    /* Validate truck selected and send data to API */
    vm.sendConfirmSelect = function(loadTruckSelectFormName) {
      vm.savingRequest = true;
      // Validate form.
      if (loadTruckSelectFormName.$invalid) {
          // If there was an error for required fields.
          if (loadTruckSelectFormName.$error.required) {
              toastr.error($filter('translate')('modals:load_truck_select:form:required:fields:error'));
          } else {
              toastr.error($filter('translate')('modals:load_truck_select:form:required:fields:invalid'));
          }
          vm.savingRequest = false;
          return;
      }

      var defer = $q.defer();

      var params = {
                'truck_id': vm.dataTruckSelect.truck_id,
                'load_id': vm.loadId,
                'token': Auth.getUserToken()
              };

      Carriers.assignTruckToLoad(params)
          .then(function (response) {
                  console.log(response);
                  toastr.success($filter('translate')('modals:load_truck_select:form:success'));
                  vm.closePopup();
              }, function (error) {
                  toastr.error($filter('translate')('modals:load_truck_select:form:required:fields:invalid'));
              });

      vm.savingRequest = false;
    };

    /* Close popup */
    vm.closePopup = function() {
        $uibModalInstance.close();
    };

    vm.initialize();
    
  }
})();
