(function() {
  'use strict';

  /* Loads list controller
   * Get filter data
   * Look for loads list about filters
   * Show load details in dropdown
   */

  angular
    .module('loadsAppWeb')
    .controller('LoadsController', LoadsController);

  /** @ngInject */
  function LoadsController($state, $stateParams, toastr, $translate, $filter, Config, Loads, Auth, DatatableTool, DTOptionsBuilder, DTColumnBuilder, $sce) {
	  var vm = this;

    /* Function executed at strart, Get load filters from url params and get loads list  */
	  vm.initialize = function() {
      var search_type = '';
      vm.profile = Auth.getUserProfile();
      vm.doCustomSearch = false;
      vm.countLoads = 0;

      switch(vm.profile){
        case 'GENERADOR_CARGA':
          search_type = 'my_loads';
          break;
        case 'CARRIER':
        case 'DRIVER':
        case 'OWNER':
          if($stateParams.from || $stateParams.to || $stateParams.pickup || $stateParams.delivery || $stateParams.price_min || $stateParams.price_max || $stateParams.length || $stateParams.size || $stateParams.weight || $stateParams.load_type || $stateParams.shipper || $stateParams.review || $stateParams.deadhead || $stateParams.load_id){
            vm.doCustomSearch = true;
            search_type = 'my_search';
            vm.paramsCustomSearch = {};
            vm.paramsCustomSearch.token = Auth.getUserToken();
            vm.paramsCustomSearch.page = 1;
            if($stateParams.from){
              vm.paramsCustomSearch.from = $stateParams.from;
            }
            if($stateParams.to){
              vm.paramsCustomSearch.to = $stateParams.to;
            }
            if($stateParams.pickup){
              vm.paramsCustomSearch.pickup = moment($stateParams.pickup).format('YYYY-MM-DD');
            }
            if($stateParams.delivery){
              vm.paramsCustomSearch.delivery = moment($stateParams.delivery).format('YYYY-MM-DD');
            }
            if($stateParams.price_min){
              vm.paramsCustomSearch.price_min = $stateParams.price_min;
            }
            if($stateParams.price_max){
              vm.paramsCustomSearch.price_max = $stateParams.price_max;
            }
            if($stateParams.length){
              vm.paramsCustomSearch.length = $stateParams.length;
            }
            if($stateParams.size){
              vm.paramsCustomSearch.size = $stateParams.size;
            }
            if($stateParams.weight){
              vm.paramsCustomSearch.weight = $stateParams.weight;
            }
            if($stateParams.load_type){
              vm.paramsCustomSearch.load_type = $stateParams.load_type;
            }
            if($stateParams.load_id){
              vm.paramsCustomSearch.load_id = $stateParams.load_id;
            }
            if($stateParams.shipper){
              vm.paramsCustomSearch.company = $stateParams.shipper;
            }
            if($stateParams.review){
              vm.paramsCustomSearch.review = $stateParams.review;
            }
            if($stateParams.deadhead){
              vm.paramsCustomSearch.deadhead = $stateParams.deadhead;
            }
          }else{
            if(vm.profile == 'CARRIER' || vm.profile ==  'OWNER'){
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
        'page': 1,
        'id_load': null
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

    /* Change tab filter  */
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
                              vm.countLoads = 0;

                              if(vm.loadsOptions.search_type == 'my_search' && vm.doCustomSearch){
                                // Page
                                vm.paramsCustomSearch.page = DatatableTool.getPage(data);

                                Loads.searchLoads(vm.paramsCustomSearch)
                                  .then(function(response){
                                    var records = DatatableTool.getRecords(response);

                                    if (!angular.isUndefined(records.recordsTotal)) {
                                      vm.countLoads = records.recordsTotal;
                                    }

                                    // Info
                                    if (!angular.isUndefined(records.data)) {
                                        _.forEach(records.data, function(value, key) {

                                            if(vm.profile == 'CARRIER' || vm.profile == 'DRIVER' || vm.profile == 'OWNER'){
                                              value.full_name_shipper = value.info_load_generator.company_name;
                                              value.img_shipper = false;
                                              if(angular.isDefined(value.info_load_generator.user.img_perfil_imagenes) && value.info_load_generator.user.img_perfil_imagenes != null){
                                                value.img_shipper = value.info_load_generator.user.img_perfil_imagenes[0]['imagen-60'];
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

                                            value.price_to_show = "$"+value.price;

                                            if(value.posteverywhere == "1" && value.price == 0){
                                              value.price_to_show = $filter('translate')('loads:table:price:call:text');
                                            }

                                            value.actions = '<i ng-click="loads.showDetailsUnique('+value.load_id+')" class="fa fa-angle-down show-load-details-btn"></i>';
                                        });
                                    }
                                    vm.loadsList = records.data;
                                    records.data = [{img_shipper: false, full_name_shipper: '', status_btn: '', from: '', to: '', pickup_date_formatted: '', delivery_date_formatted: '', distance: '', length_loads: '', weight: '', dimension: '', price_to_show: '', load_date: '', actions: ''}];
                                    callback(records);
                                  })
                                  .catch(function (error) {
                                    vm.loadsList = [];
                                    callback(DatatableTool.getRecords(null));
                                  });

                              }else{
                                if(vm.loadsOptions.search_type == 'my_search'){
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

                                    if (!angular.isUndefined(records.recordsTotal)) {
                                      vm.countLoads = records.recordsTotal;
                                    }

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

                                            value.price_to_show = "$"+value.price;

                                            if(value.posteverywhere == "1" && value.price == 0){
                                              value.price_to_show = $filter('translate')('loads:table:price:call:text');
                                            }

                                            value.actions = '<i ng-click="loads.showDetailsUnique('+value.load_id+')" class="fa fa-angle-down show-load-details-btn"></i>';
                                        });
                                    }
                                    vm.loadsList = records.data;
                                    records.data = [{img_shipper: false, full_name_shipper: '', status_btn: '', from: '', to: '', pickup_date_formatted: '', delivery_date_formatted: '', distance: '', length_loads: '', weight: '', dimension: '', price_to_show: '', load_date: '', actions: ''}];
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
        //alert($translate.instant('loads:table:column:status'));
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
            DTColumnBuilder.newColumn('price_to_show'),
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
            DTColumnBuilder.newColumn('price_to_show'),
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