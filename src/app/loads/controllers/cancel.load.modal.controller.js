(function() {
  'use strict';

  /* Cancel load modal controller
   * Receive load id 
   * Set cancel form vars
   * Send form data to API
   */

  angular
    .module('loadsAppWeb')
    .controller('CancelLoadModalController', CancelLoadModalController);

  /** @ngInject */
  function CancelLoadModalController($state, load, Auth, Loads, $uibModalInstance, DatatableTool, $q, toastr, $filter) {
	  var vm = this;

    /* Function executed at strart, set form vars  */
    vm.initialize = function() {
      vm.loadId = load;
      vm.dataToSend = {};
      vm.dataToSend.token = Auth.getUserToken();
      vm.dataToSend.load_id = vm.loadId;
      vm.dataToSend.reason_cancel = null;
      vm.dataToSend.reason_cancel_descrip = null;
      vm.savingCancel = false;

      vm.getItemsSizeLengthLoads();
    };

    /* Get attributes of loads */
    vm.getItemsSizeLengthLoads = function() {
      vm.itemsSizeLenLoads = {};
      Loads.getItemsSizeLengthLoads()
        .then(function(response){
          if(response){
            vm.itemsSizeLenLoads = response;
          }
        }); 
    };

    /* Validate and send form data to API */
    vm.sendCancel = function(cancelLoadFormName) {
      vm.savingCancel = true;
      // Validate form.
      if (cancelLoadFormName.$invalid) {
          // If there was an error for required fields.
          if (cancelLoadFormName.$error.required) {
              toastr.error($filter('translate')('modals:cancel_load:form:required:fields:error'));
          } else {
              toastr.error($filter('translate')('modals:cancel_load:form:required:fields:invalid'));
          }
          vm.savingCancel = false;
          return;
      }

      var defer = $q.defer();

      Loads.cancelLoad(vm.dataToSend)
          .then(function (response) {
                  toastr.success($filter('translate')('modals:cancel_load:form:success'));
                  vm.closePopup(true);
              }, function (error) {
                  toastr.error($filter('translate')('modals:cancel_load:form:required:fields:invalid'));
              });

      vm.savingCancel = false;
    };

    /* Close popup */
    vm.closePopup = function(resp) {
        $uibModalInstance.close(resp);
    };

    vm.initialize();
    
  }
})();
