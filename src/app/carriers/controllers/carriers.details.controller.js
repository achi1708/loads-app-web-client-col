(function() {
  'use strict';

  /* Carrier details controller
   * It gets a Carrier Id and looks for their information
   * Look for user data and related info about load if this page is charged after load page*/

  angular
    .module('loadsAppWeb')
    .controller('CarriersDetailsController', CarriersDetailsController);

  /** @ngInject */
  function CarriersDetailsController($state, $stateParams, toastr, $filter, Config, Carriers, Auth, Loads, DatatableTool, $q) {
	  var vm = this;

    /* Function executed at start, it gets carrier Id and load Id (optional) and executes searching function */
	  vm.initialize = function() {
      vm.carrierId = $stateParams.id|| false;
      vm.loadId = $stateParams.load_id|| false;
      vm.loadCarrierRequestOpts = {
        'token': Auth.getUserToken(),
        'load_id': vm.loadId,
        'page': 1
      };
      vm.loadInfoOpts = {
        'token': Auth.getUserToken(),
        'load_id': vm.loadId
      };
      vm.loadCarrierRequest = false;
      vm.loadData = false;
      vm.shipperCanAcceptRequest = false;
      vm.carrierData = false;

      vm.loadingDataDetails = true;

      vm.myData = Auth.getUserDataProfile();

      vm.getCarrierInfo();
    };

    /* Get info about load */
    vm.getLoadInfo = function() {
      Loads.getLoadDetails(vm.loadInfoOpts)
        .then(function(response){
          vm.loadData = response.result;

          if(angular.isDefined(vm.loadData.info_load_generator)){
            var shipperData = Auth.getUserDataProfile();
            if(vm.loadData.info_load_generator.user_id == shipperData.user_id){
              vm.shipperCanAcceptRequest = true;
            }
          }
        })
        .catch(function (error) {
        });
    };

    /* Get info about carrier request to load */
    vm.getLoadRequestByCarrier = function() {
      Loads.getCarrierRequests(vm.loadCarrierRequestOpts)
        .then(function(response){
          var carrierReqList = response.results;

          if(carrierReqList.length){
            for(var i in carrierReqList){
              if(carrierReqList[i].carrier.user_id == vm.carrierData.carrier_info.user_id){
                vm.loadCarrierRequest = carrierReqList[i];
              }
            }
          }
        })
        .catch(function (error) {
        });
    };

    /* Get info about carrier */
    vm.getCarrierInfo = function() {
      var carrierOptions = {
        'token': Auth.getUserToken(),
        'page': 1,
        'id_carrier': (vm.carrierId) ? vm.carrierId : false
      };

      if(carrierOptions.id_carrier){
        Carriers.getCarrierInformation(carrierOptions)
          .then(function(response){
            if(response){
              vm.carrierData = response;

              if(angular.isDefined(vm.carrierData.carrier_info)){
                if(angular.isDefined(vm.carrierData.carrier_info.user) && angular.isDefined(vm.carrierData.carrier_info.user.img_perfil)){
                  vm.carrierData.img_perfil_carrier = $.parseJSON('['+vm.carrierData.carrier_info.user.img_perfil+']');
                  vm.carrierData.img_perfil_carrier = vm.carrierData.img_perfil_carrier[0];
                }
              }

              if(vm.loadId){
                vm.getLoadRequestByCarrier();
                vm.getLoadInfo();
              }

              vm.loadingDataDetails = false;
            }else{
              vm.loadingDataDetails = false;
              $state.go('private.home');
            }
          })
          .catch(function (error) {
            vm.loadingDataDetails = false;
            $state.go('private.home');
          });
      }else{
        vm.loadingDataDetails = false;
        $state.go('private.home');
      }
    };

    /* Function allows shipper accepting some carrier request of the load */
    vm.answerRequestByCarrier = function() {
      if(vm.loadCarrierRequest && vm.shipperCanAcceptRequest){

        var params = {
                'id_request': vm.loadCarrierRequest.id_request,
                'token': Auth.getUserToken(),
                'load_id': vm.loadId
              }

        Loads.acceptCarrierRequest(params)
            .then(function (response) {
                    toastr.success($filter('translate')('modals:carrier_requests:form:success'));
                    vm.shipperCanAcceptRequest = false;
                }, function (error) {
                    toastr.error($filter('translate')('modals:carrier_requests:form:required:fields:invalid'));
                });

      }
    };

    vm.initialize();
  }
})();
