(function() {
  'use strict';

  /* Carrier details Directive
   * It shows carrier info in dropdown of carrier table list
   * It is a generic element is loaded when user click in dropdown button of item */

  angular
    .module('loadsAppWeb')
    .directive('carrierDetailsRow', carrierDetailsRow);

  /** @ngInject */
  function carrierDetailsRow($rootScope, Auth, Carriers, $uibModal) {
    return {
        templateUrl: 'app/carriers/templates/directives/carrier-details-row.html', // directive template
        restrict: 'E',
        replace: true,
        scope: {
          carrierInfo: '=' //Input of directive, Carrier info which feeds this directive
        },
        link: function(scope) {
          console.log(scope.carrierInfo);
            scope.carrierData = scope.carrierInfo;
            scope.loadingCarrierData = true;
            /**
             * Initialize
             */
            scope.initialize = function() {
                if(angular.isDefined(scope.carrierData.carrier.user_id)){
                  scope.searchCarrierInfo();
                }
            };

            /* Get all carrier info from data received */
            scope.searchCarrierInfo = function(){
              var params = {};
              params.token = Auth.getUserToken();
              params.page = 1;
              params.id_carrier = scope.carrierData.carrier.user_id;

              Carriers.getCarrierInformation(params)
                .then(function(response){
                  if(response){
                    scope.carrierData = response;

                    if(angular.isDefined(scope.carrierData.carrier_info)){
                      if(angular.isDefined(scope.carrierData.carrier_info.user) && angular.isDefined(scope.carrierData.carrier_info.user.img_perfil)){
                        scope.carrierData.img_perfil_carrier = $.parseJSON('['+scope.carrierData.carrier_info.user.img_perfil+']');
                        scope.carrierData.img_perfil_carrier = scope.carrierData.img_perfil_carrier[0];
                      }
                    }
                  }
                });
            };

            /* Open truck info modal when user clic some truck items */
            scope.openTruckModal = function(truck_id){
              var modalInstance = $uibModal.open({
                controller: 'TruckInfoModalController as truckinfomodal',
                windowClass: 'truck-info-modal',
                templateUrl: 'app/carriers/templates/modal/truck-info-modal.html',
                resolve: {
                    truck: function() {
                        return truck_id;
                    }
                }
              });
            };

            // Initialize
            scope.initialize();
        }
    };
  }
})();
