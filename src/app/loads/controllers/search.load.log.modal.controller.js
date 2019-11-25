(function() {
  'use strict';

  /* Load log searching modal controller
   * Set form data filters 
   * Send form data to API
   */

  angular
    .module('loadsAppWeb')
    .controller('SearchLoadLogModalController', SearchLoadLogModalController);

  /** @ngInject */
  function SearchLoadLogModalController($state, $uibModalInstance, $filter, Loads, toastr) {

    /* Set form vars  */
	  var vm = this;
      vm.searchData = {};
      vm.searchData.shortcut = 'custom';
      vm.searchData.date_from = null;
      vm.searchData.date_to = null;
      vm.searchData.load_id = null;

      vm.dateToDisabled = true;
      vm.datePickerMinDate = moment();
      vm.optsDatePicker = {
          singleDatePicker: true,
          showDropdowns: true,
          locale: {
              format: "YYYY-MM-DD",
              applyClass: 'btn-green',
              applyLabel: $filter('translate')('daterangepicker:btn:success:text'),
              fromLabel: $filter('translate')('daterangepicker:label:from'),
              toLabel: $filter('translate')('daterangepicker:label:to'),
              cancelLabel: $filter('translate')('daterangepicker:btn:cancel:text'),
              customRangeLabel: $filter('translate')('daterangepicker:title:text'),
              firstDay: 1
          }
        };

      vm.shortCutTypes = [{id: 'today', name: $filter('translate')('modals:loads_log:search:fields:type:today')},
                          {id: 'yesterday', name: $filter('translate')('modals:loads_log:search:fields:type:yesterday')},
                          {id: 'sevenday', name: $filter('translate')('modals:loads_log:search:fields:type:sevenday')},
                          {id: 'thismonth', name: $filter('translate')('modals:loads_log:search:fields:type:thismonth')},
                          {id: 'lastsixmonths', name: $filter('translate')('modals:loads_log:search:fields:type:lastsixmonths')},
                          {id: 'lastyear', name: $filter('translate')('modals:loads_log:search:fields:type:lastyear')},
                          {id: 'custom', name: $filter('translate')('modals:loads_log:search:fields:type:custom')}];


    /* Validate and send form data to API */
    vm.sendDataLoadsLog = function(searchLoadLogFormName) {
      // Validate form.
      if (searchLoadLogFormName.$invalid) {
          // If there was an error for required fields.
          if (searchLoadLogFormName.$error.required) {
              toastr.error($filter('translate')('modals:loads_log:search:form:required:fields:error'));
          } else {
              toastr.error($filter('translate')('modals:loads_log:search:form:required:fields:invalid'));
          }
          return;
      }

      if(vm.searchData.shortcut == 'custom' && !vm.searchData.load_id){
        if(!vm.searchData.date_from || !vm.searchData.date_to || angular.isDefined(vm.searchData.date_from.startDate) || angular.isDefined(vm.searchData.date_to.startDate)){
          toastr.error($filter('translate')('modals:loads_log:search:form:required:fields:error'));
          return;
        }
      }

      vm.closePopup(vm.searchData);
    };

    /* Close popup */
    vm.closePopup = function(resp) {
        $uibModalInstance.close(resp);
    };

    /* Validate if date_to is greater than date_from */
    vm.allowDateTo = function() {
      if(vm.searchData.date_from != null && vm.searchData.date_from != "" && !angular.isDefined(vm.searchData.date_from.startDate)){
        vm.dateToDisabled = false;
        if(vm.searchData.date_to < vm.searchData.date_from){
          vm.searchData.date_to = vm.searchData.date_from;
        }
      }else{
        vm.dateToDisabled = true;
        vm.searchData.date_to = null;
      }
    };
  }
})();
