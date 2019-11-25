(function() {
  'use strict';

  /* Carrier assigned info modal controller
   * Receive carrier id 
   * Get carrier info
   */

  angular
    .module('loadsAppWeb')
    .controller('CarrierAssignedInfoModalController', CarrierAssignedInfoModalController);

  /** @ngInject */
  function CarrierAssignedInfoModalController($state, carrier, Auth, Carriers, $uibModalInstance, $q, toastr, $filter) {
	  var vm = this;

    /* Function executed at strart, get carrier id and look for it  */
    vm.initialize = function() {
      vm.carrierInfoReceived = carrier;
      vm.params = {};
      vm.params.id_carrier = null;
      vm.params.page = 1;
      vm.params.token = Auth.getUserToken();
      vm.finalCarrierData = false;
      vm.loadingInfo = true;

      if(angular.isDefined(vm.carrierInfoReceived.user_id)){
        vm.params.id_carrier =  vm.carrierInfoReceived.user_id;

        vm.getCarrierSearch();
      }else{
        vm.loadingInfo = false;
      }
    };

    /* Get carrier info */
    vm.getCarrierSearch = function() {

      Carriers.getCarrierInformation(vm.params)
        .then(function(response){
          console.log(response);
          vm.finalCarrierData = response;

          if(vm.finalCarrierData){
            if(angular.isDefined(vm.finalCarrierData.carrier_info)){
              if(angular.isDefined(vm.finalCarrierData.carrier_info.user) && angular.isDefined(vm.finalCarrierData.carrier_info.user.img_perfil)){
                vm.finalCarrierData.img_perfil_carrier = $.parseJSON('['+vm.finalCarrierData.carrier_info.user.img_perfil+']');
                vm.finalCarrierData.img_perfil_carrier = vm.finalCarrierData.img_perfil_carrier[0];
              }
            }

            if(angular.isDefined(vm.finalCarrierData.SkillsCarrier) && vm.finalCarrierData.SkillsCarrier.length){
              var arr_skills = [];
              for(var sk in vm.finalCarrierData.SkillsCarrier){
                arr_skills.push(vm.finalCarrierData.SkillsCarrier[sk].skills_name);
              }
              vm.finalCarrierData.SkillsCarrierText = arr_skills.join(', ');
            }else{
              vm.finalCarrierData.SkillsCarrierText = "";
            }
          }

          vm.loadingInfo = false;
        });
    };

    /* Close popup */
    vm.closePopup = function() {
        $uibModalInstance.close();
    };

    vm.initialize();
    
  }
})();
