(function() {
  'use strict';

  /* Fastpay controller
   * Get Carrier Loads which apply factoring
   */

  angular
    .module('loadsAppWeb')
    .controller('FastPayController', FastPayController);

  /** @ngInject */
  function FastPayController(toastr, $filter, Config, Fastpay, DatatableTool, $q, Auth, uiGmapGoogleMapApi, DTOptionsBuilder, DTColumnBuilder, $sce) {
	var vm = this;

    /* Function executed at strart, set vars and get load list */
	  vm.initialize = function() {
      vm.fastPayData = null;
      vm.loadingData = true;
      vm.datatableOptions = DatatableTool.getDefaultSettings();
      vm.datatableOptions.paging = false;

      vm.getCarrierFactoring();
    };

    /* Get carrier factoring loads list */
    vm.getCarrierFactoring = function() {
      var params = {};
      params.token = Auth.getUserToken();
      params.page = 1;

      Fastpay.getCarrierFactoringLoads(params)
        .then(function(response){
          if(angular.isDefined(response.factoring_status) && angular.isDefined(response.results)){
            vm.fastPayData = response;
            vm.loadingData = false;
            if(vm.fastPayData.results.length){
               _.forEach(vm.fastPayData.results, function(value, key) {
                  value.full_name_shipper = value.load_generator_id.company_name;
                  value.img_shipper = false;
                  if(angular.isDefined(value.load_generator_id.user.img_perfil_arr) && value.load_generator_id.user.img_perfil_arr != null){
                    value.img_shipper = value.load_generator_id.user.img_perfil_arr[0]['imagen-60'];
                  }

                  value.status_btn = '';
                  var bgColorBtn = ''
                  , colorBtn = '';

                  switch(value.status_loads){
                    case 'NOT_ASSIGNED':
                      bgColorBtn = 'bg-color-7';
                      colorBtn = 'color-armadillo';
                      break;
                    case 'ACEPTADA':
                      bgColorBtn = 'bg-color-2';
                      colorBtn = 'color-armadillo';
                      break;
                    case 'EN_TRANSITO':
                      bgColorBtn = 'bg-color-5';
                      colorBtn = 'color-armadillo';
                      break;
                    case 'ENTREGADA': 
                      bgColorBtn = 'bg-color-3';
                      colorBtn = 'color-armadillo';
                      break;
                    default:
                      bgColorBtn = 'bg-color-7';
                      colorBtn = 'color-armadillo';
                      break;
                  }

                  value.status_btn = $sce.trustAsHtml('<button class="btn btn-class2 btn-status-load '+bgColorBtn+' '+colorBtn+'">'+$filter('translate')('loads:table:status:' +value.status_loads.toLowerCase()+ ':text')+'</button>');

                  value.pickup_date_formatted = moment(value.pickup_date, "YYYY-MM-DD HH:mm:ss").format("MMM DD YYYY");
                  value.delivery_date_formatted = moment(value.delivery_date, "YYYY-MM-DD HH:mm:ss").format("MMM DD YYYY");

                  value.actions = '<i ng-click="fastpay.showDetailsUnique('+value.load_id+')" class="fa fa-angle-down show-load-details-btn"></i>';
               });
            }
          }else{
            vm.nearbyPoints = null;
            vm.loadingData = false;
          }
        }).catch(function(error){
          vm.nearbyPoints = null;
          vm.loadingData = false;
        });
    };

    /* Show Load details in drop down tab */
    vm.showDetailsUnique = function(load_id) {
      for(var i in vm.fastPayData.results){
        if(vm.fastPayData.results[i].load_id == load_id){
          if(angular.isDefined(vm.fastPayData.results[i].expanded)){
            vm.fastPayData.results[i].expanded = !vm.fastPayData.results[i].expanded;  
          }else{
            vm.fastPayData.results[i].expanded = true;  
          }
        }else{
          vm.fastPayData.results[i].expanded = false;
        }
      }
    };

    vm.initialize();
  }
})();
