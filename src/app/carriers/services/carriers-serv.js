(function() {
  'use strict';
/* Carrier services
 * Look for carrier by Shipper
 * Get carrier info
 * Get drivers by carrier
 * Assign truck to load
 */
  angular
    .module('loadsAppWeb')
    .service('Carriers', CarrierServices);

  /** @ngInject */
  function CarrierServices($q, $http, Config) {
	var vm = this;
	//vm.api_endpoint_carriers = Config.ENV.API_ENDPOINT + 'shipper/';

	vm.searchCarrierByShipper = function(params)
	{
		// Defer
        var defer = $q.defer();
        // Url
        var url = Config.ENV.API_ENDPOINT + 'shipper/searchCarrier';

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

  vm.getCarrierInformation = function(params)
  {
    // Defer
        var defer = $q.defer();
        // Url
        var url = Config.ENV.API_ENDPOINT + 'carrier/CarrierInformation';

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

  vm.getDriverxCarrier = function(params)
  {
    // Defer
        var defer = $q.defer();
        // Url
        var url = Config.ENV.API_ENDPOINT + 'carrier/DriverxCarrier';

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

  vm.assignTruckToLoad = function(params)
  {
    // Defer
        var defer = $q.defer();
        // Url
        var url = Config.ENV.API_ENDPOINT + 'carrier/assignTruckandDrivertoLoad';

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
