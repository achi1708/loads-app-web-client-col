(function() {
  'use strict';

  /* Driver controller
   * Look for drivers and set structure table
   * Show driver details in dropdown section*/

  angular
    .module('loadsAppWeb')
    .controller('DriversController', DriversController);

  /** @ngInject */
  function DriversController($state, $stateParams, toastr, $filter, Config, Drivers, Auth, DatatableTool, DTOptionsBuilder, DTColumnBuilder, $sce) {
	  var vm = this;

    /* Set controller vars
     * execute searching function at the end*/
	  vm.initialize = function() {
      var search_type = '';
      vm.profile = Auth.getUserProfile();

      switch(vm.profile){
        case 'CARRIER':
        case 'OWNER':
          search_type = 'all';
          break;
      }

      vm.driverOptions = {
        'shortcut': (search_type != '') ? search_type : 'all',
        'token': Auth.getUserToken(),
        'page': 1
      };
      vm.driversList = [];
      vm.loadingDriverData = true;
      vm.initializedList = false;

      vm.loadTab();  
    };

    /* look for drivers and reload table list */
    vm.loadTab = function() {
      if (vm.initializedList) {
        vm.reloadList();
      } else {
        vm.initializeList();
      }
    };

    /* change searching param to look for active, inactive or all drivers */
    vm.changeCategory = function(cat) {
      vm.loadingDriverData = true;
      vm.driverOptions.shortcut = cat;
      vm.driverOptions.page = 1;

      vm.loadTab();
    };

    /* Main function that looks for drivers and prepare table list configuration depending of rows received */
    vm.initializeList = function() {
      DatatableTool.setLimit(20);
      vm.datatableOptions = DTOptionsBuilder.newOptions()
                            .withOption('ajax', function(data, callback, settings){
                              // Page
                              vm.driverOptions.page = DatatableTool.getPage(data);
                              console.log(vm.driverOptions.page);

                              Drivers.driversForCarrier(vm.driverOptions)
                                .then(function(response){
                                  var records = DatatableTool.getRecordsDrivers(response);

                                  // Info
                                  if (!angular.isUndefined(records.data)) {
                                      _.forEach(records.data, function(value, key) {

                                          value.driver_img = false;
                                          if(angular.isDefined(value.user.img_perfil_arr) && value.user.img_perfil_arr != null){
                                            value.driver_img = value.user.img_perfil_arr[0]['imagen-60'];
                                          }

                                          value.driver_name = value.user.user_first_name+' '+value.user.user_last_name;

                                          value.driver_details = value.user.user_email+' '+value.user.user_phone;

                                          value.driver_status = '';
                                            var bgColorBtn = ''
                                            , colorBtn = '';

                                            switch(value.user.user_status){
                                              case '1':
                                                bgColorBtn = 'bg-color-3';
                                                colorBtn = 'color-armadillo';
                                                break;
                                              case '0':
                                                bgColorBtn = 'bg-color-7';
                                                colorBtn = 'color-armadillo';
                                                break;
                                            }

                                            value.driver_status = $sce.trustAsHtml('<button class="btn btn-class2 '+bgColorBtn+' '+colorBtn+'">'+$filter('translate')('trucks:table:status:' +value.user.user_status+ ':text')+'</button>');

                                          value.actions = '<i ng-click="drivers.showDetailsUnique('+value.user_id+')" class="fa fa-angle-down show-load-details-btn"></i>';
                                      });
                                  }
                                  vm.driversList = records.data;
                                  records.data = [{driver_img: '', driver_full_name: '', driver_status: '', actions: ''}];
                                  callback(records);
                                })
                                .catch(function (error) {
                                  vm.driversList = [];
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
            DTColumnBuilder.newColumn('driver_img').withTitle(''),
            DTColumnBuilder.newColumn('driver_full_name').withTitle(''),
            DTColumnBuilder.newColumn('driver_status').withTitle(''),
            DTColumnBuilder.newColumn('actions').withTitle('')
          ];
          break;
      }

      vm.loadingDriverData = false;
      vm.initializedList = true;
    };

    /* Function reloads table list and looks for drivers again */
    vm.reloadList = function() {
        // Reload datatables
        DatatableTool.reload();
    };

    /* Show Driver details in drop down tab */
    vm.showDetailsUnique = function(driver_id) {
      console.log(driver_id);
      for(var i in vm.driversList){
        if(vm.driversList[i].user_id == driver_id){
          vm.driversList[i].expanded = !vm.driversList[i].expanded;
        }else{
          vm.driversList[i].expanded = false;
        }
      }
    };

    vm.addDriverByOwnerMsg = function(){
      toastr.info($filter('translate')('drivers:new_driver:owner:alert'));
    }

    vm.initialize();
  }
})();
