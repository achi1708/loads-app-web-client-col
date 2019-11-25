(function() {
  'use strict';

  /* Carrier controller
   * If it receives searching params, it'll prepare filter vars to get carriers 
   * Set and reset filters
   * Look for carriers and set structure table
   * Show carrier details in dropdown section*/

  angular
    .module('loadsAppWeb')
    .controller('CarriersController', CarriersController);

  /** @ngInject */
  function CarriersController($state, $stateParams, toastr, $translate, $filter, Config, Carriers, Auth, DatatableTool, DTOptionsBuilder, DTColumnBuilder, $q, $uibModal) {
    var vm = this;

    /* Set controller vars and set filters if it receive some of them 
     * execute searching function at the end*/
    vm.initialize = function() {
      vm.carriersList = [];
      vm.tabList = "all";
      vm.initializedList = false;
      vm.loadingCarrierData = true;
      //vm.datatableOptions = DatatableTool.getDefaultSettings();
      //vm.datatableOptions.paging = false;
      vm.params = {};
      vm.params.company = $stateParams.company|| false;
      vm.params.trailer_type = $stateParams.trailer_type|| false;
      vm.params.length = $stateParams.len|| false;
      vm.params.weight = $stateParams.wei|| false;
      vm.params.size = $stateParams.size|| false;
      vm.params.skils_truck = $stateParams.skils_truck|| false;
      vm.params.reviews = $stateParams.reviews|| false;

      vm.searchOptions = {};
      vm.searchOptions.page = 1;
      vm.searchOptions.token = Auth.getUserToken();
      if(vm.params.company){
        vm.tabList = "my_search";
        vm.searchOptions.namecarrier = vm.params.company;
      }
      if(vm.params.trailer_type){
        vm.tabList = "my_search";
        vm.searchOptions.type_trailer = vm.params.trailer_type;
      }
      if(vm.params.length){
        vm.tabList = "my_search";
        vm.searchOptions.lenght = vm.params.length;
      }
      if(vm.params.weight){
        vm.tabList = "my_search";
        vm.searchOptions.weight = vm.params.weight;
      }
      if(vm.params.size){
        vm.tabList = "my_search";
        vm.searchOptions.size = vm.params.size;
      }
      if(vm.params.skils_truck){
        vm.tabList = "my_search";
        //vm.searchOptions.skills = JSON.parse("["+vm.params.skils_truck+"]");
        vm.searchOptions.skills = JSON.stringify(vm.params.skils_truck);
      }
      if(vm.params.reviews && vm.params.reviews > 0){
        vm.tabList = "my_search";
        vm.searchOptions.reviews = vm.params.reviews;
      }

      vm.loadTab();

      //vm.searchCarriers();
    };

    /* Set searching params if user select "Searching" tab */
    vm.setSearchParams = function() {
      var deferred = $q.defer();

      vm.searchOptions = {};
      vm.searchOptions.page = 1;
      vm.searchOptions.token = Auth.getUserToken();
      if(vm.params.company){
        vm.tabList = "my_search";
        vm.searchOptions.namecarrier = vm.params.company;
      }
      if(vm.params.trailer_type){
        vm.tabList = "my_search";
        vm.searchOptions.type_trailer = vm.params.trailer_type;
      }
      if(vm.params.length){
        vm.tabList = "my_search";
        vm.searchOptions.lenght = vm.params.length;
      }
      if(vm.params.weight){
        vm.tabList = "my_search";
        vm.searchOptions.weight = vm.params.weight;
      }
      if(vm.params.size){
        vm.tabList = "my_search";
        vm.searchOptions.size = vm.params.size;
      }
      if(vm.params.skils_truck){
        vm.tabList = "my_search";
        vm.searchOptions.skills = JSON.parse("["+vm.params.skils_truck+"]");
      }
      if(vm.params.reviews && vm.params.reviews > 0){
        vm.tabList = "my_search";
        vm.searchOptions.reviews = vm.params.reviews;
      }

      deferred.resolve(true);
      return deferred.promise;
    };

    /* reset all searching filters */
    vm.resetAllFilters = function() {
      vm.tabList = "all";
      vm.params.company = false;
      vm.params.trailer_type = false;
      vm.params.length = false;
      vm.params.weight = false;
      vm.params.size = false;
      vm.params.skils_truck = false;
      vm.params.reviews = false;

      vm.searchOptions.namecarrier = null;
      vm.searchOptions.type_trailer = null;
      vm.searchOptions.lenght = null;
      vm.searchOptions.weight = null;
      vm.searchOptions.size = null;
      vm.searchOptions.skills = null;
      vm.searchOptions.reviews = null;
      
      vm.reloadList();
    };

    /* Function is executed if user click "searching" tab */
    vm.searchWithParams = function() {
      vm.params.company = ($stateParams.company && $stateParams.company != null) ? $stateParams.company : false;
      vm.params.trailer_type = ($stateParams.trailer_type && $stateParams.trailer_type != null) ? $stateParams.trailer_type : false;
      vm.params.length = ($stateParams.len && $stateParams.len != null) ? $stateParams.len : false;
      vm.params.weight = ($stateParams.wei && $stateParams.wei != null) ? $stateParams.wei : false;
      vm.params.size = ($stateParams.size && $stateParams.size != null) ? $stateParams.size : false;
      vm.params.skils_truck = ($stateParams.skils_truck && $stateParams.skils_truck != null) ? $stateParams.skils_truck : false;
      vm.params.reviews = ($stateParams.reviews && $stateParams.reviews != null) ? $stateParams.reviews : false;
      
      vm.setSearchParams()
        .then(function(){
          vm.reloadList();
        });
    };

    /* look for carriers and reload table list */
    vm.loadTab = function() {
      if (vm.initializedList) {
        vm.reloadList();
      } else {
        vm.searchCarriers();
      }
    };

    /* Main function that looks for carriers and prepare table list configuration depending of rows received */
    vm.searchCarriers = function() {
      vm.datatableOptions = DTOptionsBuilder.newOptions()
                            .withOption('ajax', function(data, callback, settings){

                                // Page
                                vm.searchOptions.page = DatatableTool.getPage(data);

                                Carriers.searchCarrierByShipper(vm.searchOptions)
                                  .then(function(response){
                                    var records = DatatableTool.getRecords(response);

                                    // Info
                                    if (!angular.isUndefined(records.data)) {
                                        _.forEach(records.data, function(value, key) {

                                            value.img_perfil_carrier = null;
                                            value.carrier_company_name = null;
                                            if(angular.isDefined(value.carrier)){
                                              if(angular.isDefined(value.carrier.user) && angular.isDefined(value.carrier.user.img_perfil)){
                                                value.img_perfil_carrier = $.parseJSON('['+value.carrier.user.img_perfil+']');
                                                value.img_perfil_carrier = value.img_perfil_carrier[0];
                                              }

                                              value.carrier_company_name = value.carrier.company_name;
                                            }

                                            value.transported = null;
                                            value.transit = null;
                                            value.trucks = null;
                                            if(angular.isDefined(value.LoadsTransported)){
                                              value.transported = value.LoadsTransported;
                                            }

                                            if(angular.isDefined(value.LoadsTransit)){
                                              value.transit = value.LoadsTransit;
                                            }

                                            if(angular.isDefined(value.CantidadTruck)){
                                              value.trucks = value.CantidadTruck;
                                            }

                                            value.SkillsCarrierText = "";
                                            if(angular.isDefined(value.SkillsCarrier) && value.SkillsCarrier.length){
                                              var arr_skills = [];
                                              for(var sk in value.SkillsCarrier){
                                                arr_skills.push(value.SkillsCarrier[sk].skills_name);
                                              }
                                              value.SkillsCarrierText = arr_skills.join(', ');
                                            }
                                        });
                                    }
                                    vm.carriersList = records.data;
                                    records.data = [{img_perfil_carrier: '', carrier_company_name: '', transported: '', transit: '', trucks: '', skills: '', reviews: '', contact: '', actions: ''}];
                                    callback(records);
                                  })
                                  .catch(function (error) {
                                    vm.carriersList = [];
                                    callback(DatatableTool.getRecords(null));
                                  });
                            })
                            .withDataProp('data')
                            .withOption('processing', true)
                            .withOption('serverSide', true)
                            .withOption('searching', false)
                            .withOption('info', false)
                            .withOption('lengthChange', false)
                            .withOption('pageLength', DatatableTool.getLimit(null))
                            .withOption('responsive', true)
                            .withLanguage(DatatableTool.getDefaultLanguageSettings())
                            .withPaginationType('numbers');
      
      vm.dtColumns = [
        DTColumnBuilder.newColumn('img_perfil_carrier'),
        DTColumnBuilder.newColumn('carrier_company_name'),
        DTColumnBuilder.newColumn('transported'),
        DTColumnBuilder.newColumn('transit'),
        DTColumnBuilder.newColumn('trucks'),
        DTColumnBuilder.newColumn('skills'),
        DTColumnBuilder.newColumn('reviews'),
        DTColumnBuilder.newColumn('contact'),
        DTColumnBuilder.newColumn('actions')
      ];

      vm.loadingCarrierData = false;
      vm.initializedList = true;
    };

    /* Function reloads table list and looks for carriers again */
    vm.reloadList = function() {
        // Reload datatables
        DatatableTool.reload();
    };

    /* Show Carrier details in drop down tab */
    vm.showDetailsUnique = function(carrier_id) {
      for(var i in vm.carriersList){
        if(vm.carriersList[i].id == carrier_id){
          vm.carriersList[i].expanded = !vm.carriersList[i].expanded;
        }else{
          vm.carriersList[i].expanded = false;
        }
      }
    };

    vm.initialize();
  }
})();
