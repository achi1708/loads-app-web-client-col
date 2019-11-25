(function() {
  'use strict';

  /* Truck controller
   * Set filter options
   * Get trucks list
   * Show truck details in dropdown
   */

  angular
    .module('loadsAppWeb')
    .controller('TrucksController', TrucksController);

  /** @ngInject */
  function TrucksController($state, $stateParams, toastr, $filter, Config, Trucks, Auth, DatatableTool, DTOptionsBuilder, DTColumnBuilder, $sce) {
	  var vm = this;

    /* Function executed at strart, set filters and get trucks list  */
	  vm.initialize = function() {
      var search_type = '';
      vm.profile = Auth.getUserProfile();

      switch(vm.profile){
        case 'CARRIER':
        case 'OWNER':
          search_type = 'all';
          break;
      }

      vm.truckOptions = {
        'shortcut': (search_type != '') ? search_type : 'all',
        'token': Auth.getUserToken(),
        'page': 1
      };
      vm.trucksList = [];
      vm.loadingTruckData = true;
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

    /* Change filter between active, inactive or all  */
    vm.changeCategory = function(cat) {
      vm.loadingTruckData = true;
      vm.truckOptions.shortcut = cat;
      vm.truckOptions.page = 1;

      vm.loadTab();
    };

    /* Get trucks list and set datatable  */
    vm.initializeList = function() {
      DatatableTool.setLimit(20);
      vm.datatableOptions = DTOptionsBuilder.newOptions()
                            .withOption('ajax', function(data, callback, settings){
                              // Page
                              vm.truckOptions.page = DatatableTool.getPage(data);
                              console.log(vm.truckOptions.page);

                              Trucks.trucksForCarrier(vm.truckOptions)
                                .then(function(response){
                                  var records = DatatableTool.getRecordsTrucks(response);

                                  // Info
                                  if (!angular.isUndefined(records.data)) {
                                      _.forEach(records.data, function(value, key) {

                                          value.truck_img = false;
                                          console.log(value.img_truck_imagenes);
                                          if(angular.isDefined(value.img_truck_imagenes) && value.img_truck_imagenes != null){
                                            value.truck_img = value.img_truck_imagenes[0]['imagen-60'];
                                          }

                                          value.truck_name = value.brand+'  '+value.model;

                                          value.driver_name = '--';

                                          if(value.driver !== null){
                                            value.driver_name = value.driver.user.user_first_name+' '+value.driver.user.user_last_name;
                                          }

                                          value.truck_status = '';
                                            var bgColorBtn = ''
                                            , colorBtn = '';

                                            switch(value.status){
                                              case '1':
                                                bgColorBtn = 'bg-color-3';
                                                colorBtn = 'color-armadillo';
                                                break;
                                              case '0':
                                                bgColorBtn = 'bg-color-7';
                                                colorBtn = 'color-armadillo';
                                                break;
                                            }

                                            value.truck_status = $sce.trustAsHtml('<button class="btn btn-class2 '+bgColorBtn+' '+colorBtn+'">'+$filter('translate')('trucks:table:status:' +value.status+ ':text')+'</button>');

                                          value.actions = '<i ng-click="trucks.showDetailsUnique('+value.id+')" class="fa fa-angle-down show-load-details-btn"></i>';
                                      });
                                  }
                                  vm.trucksList = records.data;
                                  records.data = [{truck_img: '', truck_full_name: '', truck_status: '', actions: ''}];
                                  callback(records);
                                })
                                .catch(function (error) {
                                  vm.trucksList = [];
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
        case 'CARRIER':
        case 'OWNER':
          vm.dtColumns = [
            DTColumnBuilder.newColumn('truck_img').withTitle(''),
            DTColumnBuilder.newColumn('truck_full_name').withTitle(''),
            DTColumnBuilder.newColumn('truck_status').withTitle(''),
            DTColumnBuilder.newColumn('actions').withTitle('')
          ];
          break;
      }

      vm.loadingTruckData = false;
      vm.initializedList = true;
    };

    /* Reload data table  */
    vm.reloadList = function() {
        // Reload datatables
        DatatableTool.reload();
    };

    /* Show Truck details in drop down tab */
    vm.showDetailsUnique = function(truck_id) {
      for(var i in vm.trucksList){
        if(vm.trucksList[i].id == truck_id){
          vm.trucksList[i].expanded = !vm.trucksList[i].expanded;
        }else{
          vm.trucksList[i].expanded = false;
        }
      }
    };

    vm.initialize();
  }
})();
