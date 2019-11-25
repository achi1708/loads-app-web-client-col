(function() {
  'use strict';

  /* Truck loads controller
   * Set filter options
   * Get loads list by truck
   * Show load details in dropdown
   */

  angular
    .module('loadsAppWeb')
    .controller('TrucksLoadsController', TrucksLoadsController);

  /** @ngInject */
  function TrucksLoadsController($state, $stateParams, toastr, $filter, Config, Loads, Auth, DatatableTool, DTOptionsBuilder, DTColumnBuilder, $sce) {
	  var vm = this;

    /* Function executed at strart, set filters and get loads list  */
	  vm.initialize = function() {
      var search_type = '';
      vm.profile = Auth.getUserProfile();
      vm.doCustomSearch = false;

      switch(vm.profile){
        case 'GENERADOR_CARGA':
          search_type = 'my_loads';
          break;
        case 'CARRIER':
        case 'DRIVER':
        case 'OWNER':
          if($stateParams.id){
            vm.doCustomSearch = true;
            search_type = 'by_truck';
            vm.paramsCustomSearch = {};
            vm.paramsCustomSearch.token = Auth.getUserToken();
            vm.paramsCustomSearch.page = 1;
            vm.paramsCustomSearch.search_type = search_type;
            vm.paramsCustomSearch.id_truck = $stateParams.id;
          }else{
            if(vm.profile == 'CARRIER' || vm.profile == 'OWNER'){
              search_type = 'all';
            }

            if(vm.profile == 'DRIVER'){
              search_type = 'current';
            }
          }
          break;
      }

      vm.loadsOptions = {
        'search_type': (search_type != '') ? search_type : 'my_loads',
        'token': Auth.getUserToken(),
        'page': 1
      };
      vm.loadsList = [];
      vm.loadingLoadData = true;
      vm.initializedList = false;

      vm.loadTab();  
    };

    /* Load table first time or reload it  */
    vm.loadTab = function() {
      if (vm.initializedList) {
        vm.reloadList();
      } else {
        vm.initializeList();
      }
    };

    /* Change filter between all or current  */
    vm.changeCategory = function(cat) {
      vm.loadingLoadData = true;
      vm.loadsOptions.search_type = cat;
      vm.loadsOptions.page = 1;

      vm.loadTab();
    };

    /* Get loads list and set datatable  */
    vm.initializeList = function() {
      vm.datatableOptions = DTOptionsBuilder.newOptions()
                            .withOption('ajax', function(data, callback, settings){

                              if(vm.loadsOptions.search_type == 'by_truck' && vm.doCustomSearch){
                                // Page
                                vm.paramsCustomSearch.page = DatatableTool.getPage(data);

                                Loads.getByUserRol(vm.paramsCustomSearch)
                                  .then(function(response){
                                    var records = DatatableTool.getRecords(response);
                                    console.log(records);

                                    // Info
                                    if (!angular.isUndefined(records.data)) {
                                        _.forEach(records.data, function(value, key) {

                                            if(vm.profile == 'CARRIER' || vm.profile == 'DRIVER' || vm.profile == 'OWNER'){
                                              value.full_name_shipper = value.loadGenerator.company_name;
                                              value.img_shipper = false;
                                              if(angular.isDefined(value.loadGenerator.user.img_perfil_imagenes)){
                                                value.img_shipper = value.loadGenerator.user.img_perfil_imagenes[0]['imagen-60'];
                                              }
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
                                              case 'CANCELADA': 
                                                bgColorBtn = 'bg-color-4';
                                                colorBtn = 'color-armadillo';
                                                break;
                                              case 'PAGADA': 
                                                bgColorBtn = 'bg-color-8';
                                                colorBtn = 'color-white';
                                                break;
                                              default:
                                                bgColorBtn = 'bg-color-7';
                                                colorBtn = 'color-armadillo';
                                                break;
                                            }

                                            value.status_btn = $sce.trustAsHtml('<button class="btn btn-class2 btn-status-load '+bgColorBtn+' '+colorBtn+'">'+$filter('translate')('loads:table:status:' +value.status_loads.toLowerCase()+ ':text')+'</button>');

                                            value.pickup_date_formatted = moment(value.pickup_date, "YYYY-MM-DD HH:mm:ss").format("MMM DD YYYY");
                                            value.delivery_date_formatted = moment(value.delivery_date, "YYYY-MM-DD HH:mm:ss").format("MMM DD YYYY");

                                            value.actions = '<i ng-click="loads.showDetailsUnique('+value.load_id+')" class="fa fa-angle-down show-load-details-btn"></i>';
                                        });
                                    }
                                    vm.loadsList = records.data;
                                    records.data = [{img_shipper: false, full_name_shipper: '', status_btn: '', from: '', to: '', pickup_date_formatted: '', delivery_date_formatted: '', distance: '', length_loads: '', weight: '', dimension: '', price: '', load_date: '', actions: ''}];
                                    callback(records);
                                  })
                                  .catch(function (error) {
                                    vm.loadsList = [];
                                    callback(DatatableTool.getRecords(null));
                                  });

                              }else{
                                if(vm.loadsOptions.search_type == 'by_truck'){
                                  if(vm.profile == 'CARRIER' || vm.profile == 'OWNER'){
                                    vm.loadsOptions.search_type = 'all';
                                  }

                                  if(vm.profile == 'DRIVER'){
                                    vm.loadsOptions.search_type = 'current';
                                  }
                                }
                                // Page
                                vm.loadsOptions.page = DatatableTool.getPage(data);

                                Loads.getByUserRol(vm.loadsOptions)
                                  .then(function(response){
                                    var records = DatatableTool.getRecords(response);

                                    // Info
                                    if (!angular.isUndefined(records.data)) {
                                        _.forEach(records.data, function(value, key) {

                                            if(vm.profile == 'CARRIER' || vm.profile == 'DRIVER' || vm.profile == 'OWNER'){
                                              value.full_name_shipper = value.loadGenerator.company_name;
                                              value.img_shipper = false;
                                              if(angular.isDefined(value.loadGenerator.user.img_perfil_arr) && value.loadGenerator.user.img_perfil_arr != null){
                                                value.img_shipper = value.loadGenerator.user.img_perfil_arr[0]['imagen-60'];
                                              }
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

                                            value.actions = '<i ng-click="loads.showDetailsUnique('+value.load_id+')" class="fa fa-angle-down show-load-details-btn"></i>';
                                        });
                                    }
                                    vm.loadsList = records.data;
                                    records.data = [{img_shipper: false, full_name_shipper: '', status_btn: '', from: '', to: '', pickup_date_formatted: '', delivery_date_formatted: '', distance: '', length_loads: '', weight: '', dimension: '', price: '', load_date: '', actions: ''}];
                                    callback(records);
                                  })
                                  .catch(function (error) {
                                    vm.loadsList = [];
                                    callback(DatatableTool.getRecords(null));
                                  });
                              }
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
      switch(vm.profile){
        case 'GENERADOR_CARGA':
          vm.dtColumns = [
            DTColumnBuilder.newColumn('status_btn'),
            DTColumnBuilder.newColumn('from'),
            DTColumnBuilder.newColumn('to'),
            DTColumnBuilder.newColumn('pickup_date_formatted'),
            DTColumnBuilder.newColumn('delivery_date_formatted'),
            DTColumnBuilder.newColumn('distance'),
            DTColumnBuilder.newColumn('length_loads'),
            DTColumnBuilder.newColumn('weight'),
            DTColumnBuilder.newColumn('dimension'),
            DTColumnBuilder.newColumn('price'),
            DTColumnBuilder.newColumn('load_date'),
            DTColumnBuilder.newColumn('actions')
          ];
          break;
        case 'CARRIER':
        case 'DRIVER':
        case 'OWNER':
          vm.dtColumns = [
            DTColumnBuilder.newColumn('img_shipper'),
            DTColumnBuilder.newColumn('full_name_shipper'),
            DTColumnBuilder.newColumn('from'),
            DTColumnBuilder.newColumn('to'),
            DTColumnBuilder.newColumn('pickup_date_formatted'),
            DTColumnBuilder.newColumn('delivery_date_formatted'),
            DTColumnBuilder.newColumn('length_loads'),
            DTColumnBuilder.newColumn('weight'),
            DTColumnBuilder.newColumn('dimension'),
            DTColumnBuilder.newColumn('price'),
            DTColumnBuilder.newColumn('load_date'),
            DTColumnBuilder.newColumn('status_btn'),
            DTColumnBuilder.newColumn('actions')
          ];
          break;
      }

      vm.loadingLoadData = false;
      vm.initializedList = true;
    };

    /* Reload data table  */
    vm.reloadList = function() {
        // Reload datatables
        DatatableTool.reload();
    };

    /* Show Load details in drop down tab */
    vm.showDetailsUnique = function(load_id) {
      for(var i in vm.loadsList){
        if(vm.loadsList[i].load_id == load_id){
          vm.loadsList[i].expanded = !vm.loadsList[i].expanded;
        }else{
          vm.loadsList[i].expanded = false;
        }
      }
    };

    vm.initialize();
  }
})();
