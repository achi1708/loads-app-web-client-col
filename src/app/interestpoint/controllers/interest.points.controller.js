(function() {
  'use strict';

  /* Interesting points controller
   * Get user geolocation
   * Filter places by kinds of interesting points
   * Get places about filters and put them in the map
   */

  angular
    .module('loadsAppWeb')
    .controller('InterestPointsController', InterestPointsController);

  /** @ngInject */
  function InterestPointsController(toastr, $filter, Config, Trucks, DatatableTool, $q, Auth, uiGmapGoogleMapApi, DTOptionsBuilder, DTColumnBuilder, $timeout) {
	var vm = this;

    /* Function executed at strart, set vars and get user geolocation */
	  vm.initialize = function() {
      vm.nearbyPoints = [];
      vm.userLocation = {};
      vm.userLocation.latitude = false;
      vm.userLocation.longitude = false;
      vm.shortcutFilter = null;
      vm.datatableOptions = DatatableTool.getDefaultSettings();
      vm.datatableOptions.paging = false;
      vm.loadingMap = true;
      vm.loadingData = true;
      vm.apikeymaps = Config.ENV.GOOGLE_MAPS_KEY;
      vm.windowOptions = {visible: false};

      vm.filterList = [
                        {name: 'restaurant', full_name: 'Restaurants', checked: true },
                        {name: 'gas_satation', full_name: 'Gas stations', checked: true },
                        {name: 'lodging', full_name: 'Hotels', checked: true },
                        {name: 'parking', full_name: 'Parkings', checked: true }
                      ];

      vm.getGeoLocation();
    };

    /* Load map and set as center the user geolocation point, also it sets places as markers */
    vm.initializeMap = function () {
      uiGmapGoogleMapApi.then(function(maps) {
       vm.loadingMap = false;
       vm.map = { center: { latitude: vm.userLocation.latitude, longitude: vm.userLocation.longitude }, zoom: 14 };
       if(vm.nearbyPoints.length){
        vm.setMarkers();
       }
      });
    };

    /* Main function, get interesting points from API, before it sends user geolocation */
    vm.getNearbyPoints = function() {
      var params = {};
      params.token = Auth.getUserToken();
      params.lat = vm.userLocation.latitude;
      params.long = vm.userLocation.longitude;
      params.shortcut = vm.shortcutFilter;

      Trucks.searchInterestPoints(params)
        .then(function(response){
          if(angular.isDefined(response.PointsOfInterest.results)){
            vm.nearbyPoints = response.PointsOfInterest.results;
            vm.initializeMap();
            vm.loadingData = false;
          }else{
            vm.nearbyPoints = [];
            vm.loadingData = false;
          }
        }).catch(function(error){
          vm.nearbyPoints = [];
          vm.loadingData = false;
        });
    };

    /* Set places as markers in the map */
    vm.setMarkers = function(){
      vm.mapMarkers = [];
      if(vm.nearbyPoints.length){
        switch(Auth.getUserProfile()){
          case 'CARRIER':
          case 'DRIVER':
          case 'OWNER':
            //añadir marcadores
            for(var i=0; i<vm.nearbyPoints.length; i++){
              vm.mapMarkers.push({id: vm.nearbyPoints[i].id, coords: { latitude: vm.nearbyPoints[i].geometry.location.lat, longitude: vm.nearbyPoints[i].geometry.location.lng}, details: {image: (angular.isDefined(vm.nearbyPoints[i].photos)) ? 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=30&maxheight=30&photoreference='+vm.nearbyPoints[i].photos[0].photo_reference+'&key='+vm.apikeymaps : '', name: (angular.isDefined(vm.nearbyPoints[i].name)) ? vm.nearbyPoints[i].name : '--', type: (vm.nearbyPoints[i].types.length) ? vm.nearbyPoints[i].types[0] : '--', opening: (angular.isDefined(vm.nearbyPoints[i].opening_hours)) ? (vm.nearbyPoints[i].opening_hours.weekday_text.length ? vm.nearbyPoints[i].opening_hours.weekday_text.join() : '--') : '--', status: angular.isDefined(vm.nearbyPoints[i].opening_hours) ? ((vm.nearbyPoints[i].opening_hours.open_now === true) ? 'open' : ((vm.nearbyPoints[i].opening_hours.open_now === false) ? 'close' : '--')) : '--', coords: { latitude: vm.nearbyPoints[i].geometry.location.lat, longitude: vm.nearbyPoints[i].geometry.location.lng}}});
            }
            console.log(vm.mapMarkers);            
            break;
        }
      }
    };

    /* Get browser geolocation */
    vm.getGeoLocation = function() {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(vm.setGeoLocation);
      }
    };

    /* Set geolocation founded in local vars */
    vm.setGeoLocation = function (position) {
      vm.userLocation.latitude = position.coords.latitude;
      vm.userLocation.longitude = position.coords.longitude;
      vm.getNearbyPoints();
    };

    /* Set new filter and look for interesting points */
    vm.setFilterPoints = function(){
      var newFilter = [];
      if(angular.isDefined(vm.filterList)){
        vm.filterList.forEach(function(item) {
          if (item.checked) newFilter.push(item.name);
        });

        if(newFilter.length > 0){
          vm.shortcutFilter = newFilter;
        }else{
          vm.shortcutFilter = null;
        }
        vm.loadingData = true;
        vm.getNearbyPoints(); 
      }
    };

    /* marker info window */
    vm.openMapWindow = function(details){
      vm.windowOptions.visible = false;
      vm.detailsMapWindow = details;

      $timeout(function () {
        vm.windowOptions.visible = true;
      }, 1000);
    }

    vm.initialize();
  }
})();
