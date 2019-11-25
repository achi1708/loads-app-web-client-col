(function() {
  'use strict';

  /* Loads log list controller
   * Set filter data
   * Look for loads log list about filters
   * Show load details in dropdown
   */

  angular
    .module('loadsAppWeb')
    .controller('LoadsLogController', LoadsLogController);

  /** @ngInject */
  function LoadsLogController(toastr, $filter, Config, Loads, Auth, DatatableTool, DTOptionsBuilder, DTColumnBuilder, $sce, $uibModal) {
	  var vm = this;

    /* Function executed at strart, Set first params and look for loads  */
	  vm.initialize = function() {
      vm.profile = Auth.getUserProfile();

      vm.datePicker = {};
      vm.datePicker.date = {startDate: null, endDate: null};
      vm.loadsOptions = {
        'token': Auth.getUserToken(),
        'page': 1
      };
      vm.loadsList = [];
      vm.loadingLoadData = true;
      vm.initializedList = false;

      vm.countLoads = 0;

      vm.loadTab();

      //vm.getLoadsLogData();  
    };

    /* Load table first time or reload it  */
    vm.loadTab = function() {
      if (vm.initializedList) {
        vm.reloadList();
      } else {
        vm.initializeList();
      }
    };

    /* Get loads list and set datatable  */
    vm.initializeList = function() {
      vm.datatableOptions = DTOptionsBuilder.newOptions()
                            .withOption('ajax', function(data, callback, settings){
                                vm.countLoads = 0;
                                // Page
                                vm.loadsOptions.page = DatatableTool.getPage(data);

                                Loads.getLoadsHistoryByUserRol(vm.loadsOptions)
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

                                            value.actions = '<i ng-click="loadslog.showDetailsUnique('+value.load_id+')" class="fa fa-angle-down show-load-details-btn"></i>';
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

    vm.queryLoads = function(params) {
      Loads.getLoadsHistoryByUserRol(params)
        .then(function(response){
          return response;
        }, function(error){
          return false;
        });
    };

    /* Get loads log list  */
    vm.getLoadsLogData = function() {
      vm.loadsList = [];
      
      Loads.getLoadsHistoryByUserRol(vm.loadsOptions)
        .then(function(response){
          console.log(response);
          if(angular.isDefined(response.results)){
            vm.loadsList = response.results;
          }else{
            vm.loadsList = [];
          }

          vm.loadingLoadData = false;
        }, function(error){
          vm.loadsList = [];
          vm.loadingLoadData = false;
        });
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

    /* Open searching params modal */
    vm.openSearchLoadsLogsModal = function() {
      var modalInstance = $uibModal.open({
        controller: 'SearchLoadLogModalController as searchloadlog',
        windowClass: 'search-load-log-modal',
        templateUrl: 'app/loads/templates/modal/search-load-log.html'
      });

      modalInstance.result.then(function(data) {
        if(data.shortcut){
          vm.loadsOptions.shortcut = data.shortcut;
          if(data.shortcut == 'custom'){
            vm.loadsOptions.date_from = moment(data.date_from).format('YYYY-MM-DD');
            vm.loadsOptions.date_to = moment(data.date_to).format('YYYY-MM-DD');
          }else{
            if(angular.isDefined(vm.loadsOptions.date_from)){
              delete vm.loadsOptions.date_from;
            }

            if(angular.isDefined(vm.loadsOptions.date_to)){
              delete vm.loadsOptions.date_to;
            }
          }
        }else{
          if(angular.isDefined(vm.loadsOptions.shortcut)){
            delete vm.loadsOptions.shortcut;
          }

          if(angular.isDefined(vm.loadsOptions.date_from)){
            delete vm.loadsOptions.date_from;
          }

          if(angular.isDefined(vm.loadsOptions.date_to)){
            delete vm.loadsOptions.date_to;
          }
        }

        if(data.load_id){
          vm.loadsOptions.load_id = data.load_id;
        }else{
          if(angular.isDefined(vm.loadsOptions.load_id)){
            delete vm.loadsOptions.load_id;
          }
        }

        vm.reloadList();
      });
    };

    vm.initialize();
  }
})();
