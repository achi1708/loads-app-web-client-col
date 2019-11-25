(function() {
  'use strict';

  /* Datatable services
   * Functions to build and to control rows and actions in data table */

  angular
    .module('loadsAppWeb')
    .service('DatatableTool', DatatableServices);

  /** @ngInject */
  function DatatableServices($q, $http, Config, $filter) {
	  var vm = this;

    vm.pageLength = 7;

  	vm.getDefaultSettings = function()
  	{
  		  var config = {
          searching: false,
          ordering: true,
          info: false,
          lengthChange: false
        };

        return config;
  	};

    vm.getDefaultLanguageSettings = function()
    {
      return {
        emptyTable: $filter('translate')('loads:list:empty:text'),
        processing: $filter('translate')('table:loading_data:text'),
        //processing: $compile('<loading-icon class="full-height full-height-absolute"></loading-icon>')($rootScope),
        paginate: {
          previous: $filter('translate')('table:pagination:prev:text'),
          next: $filter('translate')('table:pagination:next:text'),
          first: $filter('translate')('table:pagination:first:text'),
          last: $filter('translate')('table:pagination:last:text'),
        }
      };
    };

    vm.setLimit = function(data) {
      vm.pageLength = data;
    };

    vm.getLimit = function(data) {
      var limit = vm.pageLength;

      if (!angular.isUndefined(data) && data != null) {
          limit = data.length;
      }

      return limit;
    };

    /**
     * Returns the page for the tables
     * @param data
     */
    vm.getPage = function(data) {
        console.log(data);
        var page = 1;

        if (!angular.isUndefined(data)) {
            page = parseInt(data.start / vm.getLimit(data)) + 1;
        }

        return page;
    };

    vm.getRecords = function(data) {
        var records = {
            recordsTotal: 0,
            recordsFiltered: 0,
            data: []
        };

        if (data && !angular.isUndefined(data.total_results_system) && !angular.isUndefined(data.results)) {
            records.recordsTotal = data.total_results_system;
            records.recordsFiltered = data.total_results_system;
            records.data = data.results;
        }

        return records;
    };

    vm.getRecordsTrucks = function(data) {
        var records = {
            recordsTotal: 0,
            recordsFiltered: 0,
            data: []
        };

        if (data && !angular.isUndefined(data.truck_total_results) && !angular.isUndefined(data.truck_results)) {
            records.recordsTotal = data.truck_total_results;
            records.recordsFiltered = data.truck_total_results;
            records.data = data.truck_results;
        }

        return records;
    };

    vm.getRecordsDrivers = function(data) {
        var records = {
            recordsTotal: 0,
            recordsFiltered: 0,
            data: []
        };

        if (data && !angular.isUndefined(data.list_drivers)) {
            records.recordsTotal = data.list_drivers.length;
            records.recordsFiltered = data.list_drivers.length;
            records.data = data.list_drivers;
        }

        return records;
    };

    /**
     * Returns an instance for datatables.
     */
    vm.getInstance = function() {
        // Instance
        var instance = null;

        // Tables
        var tables = $.fn.dataTable.tables(true);
        if (angular.isArray(tables) && tables.length > 0) {
            instance = $(tables[0]).DataTable();
        }

        return instance;
    };

    /**
     * Reload the datatables
     */
    vm.reload = function() {
        var table = vm.getInstance();

        if (table) {
            var callback = null,
                resetPaging = true;
            table.ajax.reload(callback, resetPaging);
        }
    };
  }
})();
