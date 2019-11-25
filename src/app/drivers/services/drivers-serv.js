(function() {
  'use strict';
/* Driver services
 * Get drivers by Carrier
 * Create driver
 */
  angular
    .module('loadsAppWeb')
    .service('Drivers', DriverServices);

  /** @ngInject */
  function DriverServices($q, $http, Config, Upload) {
	var vm = this;
	vm.api_endpoint_drivers = Config.ENV.API_ENDPOINT;

	vm.driversForCarrier = function(params)
	{
		// Defer
        var defer = $q.defer();
        // Url
        var url = vm.api_endpoint_drivers + 'carrier/DriverxCarrierxStatus';

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

  vm.createDriver = function(params)
  {
    // Defer
        var defer = $q.defer();
        // Url
        var url = vm.api_endpoint_drivers + 'driver/CreateDriverProfile';

        // Get
        Upload.upload({url: url, data: params})
          .then(function(response) {
                // Success
                console.log(response);
                if(response.data.status == 'ok' ){
                  defer.resolve(response.data.message); 
                }else{
                  defer.reject(response.data.message);                   
                }
            })
            .catch(function(response) {
                // Error

                defer.reject(false);
            });

        return defer.promise;
  };

  vm.driverById = function(params)
  {
    // Defer
        var defer = $q.defer();
        // Url
        var url = vm.api_endpoint_drivers + 'driver/CarrierXDriverInformation';

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

  vm.updateDriver = function(params)
  {
    // Defer
        var defer = $q.defer();
        // Url
        var url = vm.api_endpoint_drivers + 'driver/CarrierXDriverInformationUpdate';

        // Get
        Upload.upload({url: url, data: params})
          .then(function(response) {
                // Success
                console.log(response);
                if(response.data.status == 'ok' ){
                  defer.resolve(response.data.message); 
                }else{
                  defer.reject(response.data.message);                   
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
