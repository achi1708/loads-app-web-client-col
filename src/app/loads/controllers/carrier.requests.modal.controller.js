(function() {
  'use strict';

  /* Carriers requests list modal controller
   * Receive load id 
   * Get carrier requests by load
   * Assign carrier to load
   */

  angular
    .module('loadsAppWeb')
    .controller('CarrierRequestsModalController', CarrierRequestsModalController);

  /** @ngInject */
  function CarrierRequestsModalController($state, load, Auth, Loads, $uibModalInstance, DatatableTool, $q, toastr, $filter) {
	  var vm = this;

    /* Function executed at strart, get load id and get carrier requests  */
    vm.initialize = function() {
      vm.datatableOptions = DatatableTool.getDefaultSettings();
      vm.datatableOptions.paging = false;
      vm.loadId = load;
      vm.carrierReqList = [];
      vm.loadingInfo = true;
      vm.savingRequest = false;
      vm.loadOptions = {
        'token': Auth.getUserToken(),
        'load_id': vm.loadId,
        'page': 1
      };

      vm.dataRequest = {};
      vm.dataRequest.carrier = null;

      vm.getCarrierRequests();
    };

    /* Get carrier requests */
    vm.getCarrierRequests = function() {
      Loads.getCarrierRequests(vm.loadOptions)
        .then(function(response){
          vm.carrierReqList = response.results;

          if(vm.carrierReqList.length){
            for(var i in vm.carrierReqList){
              if(angular.isDefined(vm.carrierReqList[i].carrier)){
                if(angular.isDefined(vm.carrierReqList[i].carrier.user) && angular.isDefined(vm.carrierReqList[i].carrier.user.img_perfil)){
                  vm.carrierReqList[i].img_perfil_carrier = $.parseJSON('['+vm.carrierReqList[i].carrier.user.img_perfil+']');
                  vm.carrierReqList[i].img_perfil_carrier = vm.carrierReqList[i].img_perfil_carrier[0];
                }
              }

              if(angular.isDefined(vm.carrierReqList[i].SkillsCarrier) && vm.carrierReqList[i].SkillsCarrier.length){
                var arr_skills = [];
                for(var sk in vm.carrierReqList[i].SkillsCarrier){
                  arr_skills.push(vm.carrierReqList[i].SkillsCarrier[sk].skills_name);
                }
                vm.carrierReqList[i].SkillsCarrierText = arr_skills.join(', ');
              }else{
                vm.carrierReqList[i].SkillsCarrierText = "";
              }
            }
          }
          vm.loadingInfo = false;
        })
        .catch(function (error) {
          vm.loadingInfo = false;
        });
    };

    /* Validate radio buttons and send carrier selected to API */
    vm.sendConfirmRequest = function(carrierRequestFormName) {
      vm.savingRequest = true;
      // Validate form.
      if (carrierRequestFormName.$invalid) {
          // If there was an error for required fields.
          if (carrierRequestFormName.$error.required) {
              toastr.error($filter('translate')('modals:carrier_requests:form:required:fields:error'));
          } else {
              toastr.error($filter('translate')('modals:carrier_requests:form:required:fields:invalid'));
          }
          vm.savingRequest = false;
          return;
      }

      var defer = $q.defer();

      var params = {
                'id_request': vm.dataRequest.carrier,
                'token': Auth.getUserToken(),
                'load_id': vm.loadId
              }

      Loads.acceptCarrierRequest(params)
          .then(function (response) {
                  console.log(response);
                  toastr.success($filter('translate')('modals:carrier_requests:form:success'));
                  vm.closePopup();
              }, function (error) {
                  toastr.error($filter('translate')('modals:carrier_requests:form:required:fields:invalid'));
              });

      vm.savingRequest = false;
    };

    /* Redirect to carrier profile */
    vm.seeCarrierProfile = function(carrier_id) {
      vm.closePopup();
      console.log(vm.loadId);
      $state.go('private.carriers.details', {id: carrier_id, load_id: vm.loadId});
    };

    /* Close popup */
    vm.closePopup = function() {
        $uibModalInstance.close();
    };

    vm.initialize();
    
  }
})();
