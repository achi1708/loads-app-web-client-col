(function() {
  'use strict';
/* Truck services
 * Get trucks by carrier
 * Get truck info
 * Create truck
 * Update truck
 * Looking for interesting points
 * Count trucks by carrier
 */

  angular
    .module('loadsAppWeb')
    .service('Trucks', TruckServices);

  /** @ngInject */
  function TruckServices($q, $http, Config, Upload) {
	var vm = this;
	vm.api_endpoint_trucks = Config.ENV.API_ENDPOINT + 'trucks/';

	vm.trucksForCarrier = function(params)
	{
		// Defer
        var defer = $q.defer();
        // Url
        var url = vm.api_endpoint_trucks + 'trucksForCarrier';

        // Get
        $http.post(url, params)
            .then(function(response) {
                // Success
                if(response.data.status == 'ok' ){
                	defer.resolve(response.data.message);	
                }else{
					defer.reject(false);                	
                }
            })
            .catch(function(response) {
                // Error

                defer.reject(false);
            });

        return defer.promise;
	};

  vm.trucksDetails = function(params)
  {
    // Defer
        var defer = $q.defer();
        // Url
        var url = vm.api_endpoint_trucks + 'DetailTruck';

        // Get
        $http.post(url, params)
            .then(function(response) {
                // Success
                if(response.data.status == 'ok' ){
                  defer.resolve(response.data.message); 
                }else{
          defer.reject(false);                  
                }
            })
            .catch(function(response) {
                // Error

                defer.reject(false);
            });

        return defer.promise;
  };

  vm.createTruck = function(params)
  {
    // Defer
        var defer = $q.defer();
        // Url
        var url = vm.api_endpoint_trucks + 'createTruck';

        // Get
        Upload.upload({url: url, data: params})
          .then(function(response) {
                // Success
                console.log(response);
                if(response.data.status == 'ok' ){
                  defer.resolve(response.data.message); 
                }else{
                  defer.reject(false);                   
                }
            })
            .catch(function(response) {
                // Error

                defer.reject(false);
            });

        return defer.promise;
  };

  vm.updateTruck = function(params, withImg)
  {
    // Defer
    var defer = $q.defer();
    // Url
    var url = vm.api_endpoint_trucks + 'UpdateTruck';

    if(withImg){
      // Get
      Upload.upload({url: url, data: params})
        .then(function(response) {
              // Success
              //Upload.abort();
              console.log(response);
              if(response.data.status == 'ok' ){
                defer.resolve(response.data.message); 
              }else{
                defer.reject(false);                   
              }
          })
          .catch(function(response) {
              // Error

              defer.reject(false);
          });
    }else{
      console.log(params);
      $http.post(url, params)
          .then(function(response) {
              // Success
              if(response.data.status == 'ok' ){
                defer.resolve(response.data.message); 
              }else{
                defer.reject(false);                  
              }
          })
          .catch(function(response) {
              // Error

              defer.reject(false);
          });
    }

    return defer.promise;
  };

  vm.searchInterestPoints = function(params)
  {
    // Defer
        var defer = $q.defer();
        // Url
        var url = vm.api_endpoint_trucks + 'PointsOfInterest';

        // Get
        $http.post(url, params)
            .then(function(response) {
                // Success
                if(response.data.status == 'ok' ){
                  defer.resolve(response.data.message); 
                }else{
                  defer.reject(false);                  
                }
            })
            .catch(function(response) {
                // Error

                defer.reject(false);
            });

        return defer.promise;
  };

  vm.countTrucksxCarrier = function(params)
  {
    // Defer
        var defer = $q.defer();
        // Url
        var url = vm.api_endpoint_trucks + 'CountTruckxCarrier';

        // Get
        $http.post(url, params)
            .then(function(response) {
                // Success
                if(response.data.status == 'ok' ){
                  defer.resolve(response.data.message); 
                }else{
          defer.reject(false);                  
                }
            })
            .catch(function(response) {
                // Error

                defer.reject(false);
            });

        return defer.promise;
  };


  }
})();
