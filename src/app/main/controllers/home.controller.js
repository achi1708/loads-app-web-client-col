(function() {
  'use strict';

  /* Home controller
   * Get geolocation and set it in a map
   * Get available loads for carrier
   * Get carriers for shipper
   * Show carrier or load details
   */

  angular
    .module('loadsAppWeb')
    .controller('HomeController', HomeController);

  /** @ngInject */
  function HomeController(toastr, $filter, Config, Loads, DatatableTool, MainServ, $q, Auth, uiGmapGoogleMapApi, DTOptionsBuilder, DTColumnBuilder, $timeout) {
	var vm = this;

    /* Function executed at strart, Set table and map vars and get geolocation  */
	  vm.initialize = function() {
      vm.hiddenMap = false;
      vm.nearbyCarriersOrLoads = [];
      vm.userLocation = {};
      vm.userLocation.latitude = false;
      vm.userLocation.longitude = false;
      vm.datatableOptions = DatatableTool.getDefaultSettings();
      vm.datatableOptions.paging = false;
      vm.loadingMap = true;
      vm.loadingData = true;

      try {
        vm.getGeoLocation();
      } catch(err) {
        vm.nearbyCarriersOrLoads = [];
        vm.loadingMap = false;
        vm.loadingData = false;
      }
    };

    /*vm.testList = function() {
      vm.testParams = {};
      vm.testParams.token = Auth.getUserToken();
      vm.testParams.search_type = "not_assigned";
      vm.testParams.page = 1;

      vm.dataExample = [];

      /*vm.newDatatableOptions = angular.extend(DatatableTool.getDefaultOptions2(), {
        ajax: function (data, callback, settings) {
            // Page
            vm.testParams.page = DatatableTool.getPage(data);

            Loads.getByUserRol(vm.testParams)
              .then(function(response){
                var records = DatatableTool.getRecords(response);
                vm.dataExample = records.data;
                callback(records);
              });
        }
      });*/

      /*vm.newDatatableOptions = DTOptionsBuilder.newOptions()
                            .withOption('ajax', function(data, callback, settings){
                              // Page
                              vm.testParams.page = DatatableTool.getPage(data);

                              Loads.getByUserRol(vm.testParams)
                                .then(function(response){
                                  var records = DatatableTool.getRecords(response);
                                  vm.dataExample = records.data;
                                  callback(records);
                                });
                            })
                            .withDataProp('data')
                            .withOption('processing', true)
                            .withOption('serverSide', true)
                            .withOption('searching', false)
                            .withOption('info', false)
                            .withOption('lengthChange', false)
                            .withOption('pageLength', DatatableTool.getLimit(null))
                            .withOption(DatatableTool.getDefaultSettings())
                            .withPaginationType('full_numbers');
      vm.dtColumns = [
          DTColumnBuilder.newColumn('load_id').withTitle('ID')
      ];
    };*/

    /* Load map and set user geolocation */
    vm.initializeMap = function () {
      uiGmapGoogleMapApi.then(function(maps) {
       vm.loadingMap = false;
       vm.map = { center: { latitude: vm.userLocation.latitude, longitude: vm.userLocation.longitude }, zoom: 14 };
      });
    };

    /* Get nearby carriers or loads */
    vm.getNearbyCarriersOrLoads = function() {
      var params = {};
      params.token = Auth.getUserToken();
      params.lat_user = vm.userLocation.latitude;
      params.lon_user = vm.userLocation.longitude;

      //params.lat_user = 4.525;
      //params.lon_user = -74.135;

      MainServ.searchForLocation(params)
        .then(function(response){
          if(angular.isDefined(response.results)){
            vm.nearbyCarriersOrLoads = response.results;
            switch(Auth.getUserProfile()){
              case 'GENERADOR_CARGA':
                vm.fixDataNearbyCarriers();
                break;
              case 'CARRIER':
              case 'OWNER':
                break;
            }
            vm.setMarkers();
            vm.loadingData = false;
          }else{
            vm.nearbyCarriersOrLoads = [];
            vm.loadingData = false;
          }
        }).catch(function(error){
          vm.nearbyCarriersOrLoads = [];
          vm.loadingData = false;
        });
    };

    // fix some data will show to shipper
    vm.fixDataNearbyCarriers = function() {
      if(vm.nearbyCarriersOrLoads.length){
        for(var i in vm.nearbyCarriersOrLoads){
          if(angular.isDefined(vm.nearbyCarriersOrLoads[i].skills_truck) && vm.nearbyCarriersOrLoads[i].skills_truck.length){
            var arr_skills = [];
            for(var sk in vm.nearbyCarriersOrLoads[i].skills_truck){
              arr_skills.push(vm.nearbyCarriersOrLoads[i].skills_truck[sk].skills_name);
            }
            vm.nearbyCarriersOrLoads[i].skills_truck_text = arr_skills.join(', ');
          }
        }
      }
    };

    // Set markers in map
    vm.setMarkers = function(){
      vm.mapMarkers = [];
      if(vm.nearbyCarriersOrLoads.length){
        switch(Auth.getUserProfile()){
          case 'GENERADOR_CARGA':
            for(var i in vm.nearbyCarriersOrLoads){
              if(angular.isDefined(vm.nearbyCarriersOrLoads[i].latitud_truck) && angular.isDefined(vm.nearbyCarriersOrLoads[i].longitud_truck)){
                vm.mapMarkers.push({
                                id: vm.nearbyCarriersOrLoads[i].id,
                                options: {
                                  icon: 'assets/images/common/marker.png'
                                },
                                coords: {
                                    latitude: vm.nearbyCarriersOrLoads[i].latitud_truck,
                                    longitude: vm.nearbyCarriersOrLoads[i].longitud_truck
                                }
                              });
              }
            }
            break;
          case 'CARRIER':
          case 'DRIVER':
          case 'OWNER':
            for(var i in vm.nearbyCarriersOrLoads){
              if(angular.isDefined(vm.nearbyCarriersOrLoads[i].lat_pickup_adress) && angular.isDefined(vm.nearbyCarriersOrLoads[i].long_pickup_adress)){
                vm.mapMarkers.push({
                                id: vm.nearbyCarriersOrLoads[i].id,
                                options: {
                                  icon: 'assets/images/common/marker.png'
                                },
                                coords: {
                                    latitude: vm.nearbyCarriersOrLoads[i].lat_pickup_adress,
                                    longitude: vm.nearbyCarriersOrLoads[i].long_pickup_adress
                                }
                              });
              }
            }
            break;
        }
      }
    };

    /* Get user geolocation */
    vm.getGeoLocation = function() {
      $timeout(function(){
        toastr.info($filter('translate')('home:advice:location:settings:active', {timeOut: 10000}));
      }, 1000);

      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(vm.setGeoLocation);
      }
    };

    /* Set user geolocation in map */
    vm.setGeoLocation = function (position) {
      vm.userLocation.latitude = position.coords.latitude;
      vm.userLocation.longitude = position.coords.longitude;
      vm.initializeMap();
      vm.getNearbyCarriersOrLoads();
    };

    /* Show details in dropdown */
    vm.showDetailsUnique = function(item_id) {
      for(var i in vm.nearbyCarriersOrLoads){
        if(vm.nearbyCarriersOrLoads[i].id == item_id){
          vm.nearbyCarriersOrLoads[i].expanded = !vm.nearbyCarriersOrLoads[i].expanded;
          if(vm.nearbyCarriersOrLoads[i].expanded == true){
            vm.hiddenMap = true;
          }else{
            vm.hiddenMap = false;
          }
        }else{
          vm.nearbyCarriersOrLoads[i].expanded = false;
        }
      }
    };

    vm.initialize();
  }
})();
