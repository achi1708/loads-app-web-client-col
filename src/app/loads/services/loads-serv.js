(function() {
  'use strict';
/* Load services
 * Get different counts of loads
 * Get loads by user profile
 * Get loads log by user profile
 * Get load attributes lists
 * Create and update load
 * Get load info
 * Get carrier requests of a load
 * Create request to apply to the load by carrier
 * Cancel my request sent (carrier)
 * Accept carrier request
 * Upload invoice to the load
 * Looking for loads
 * Report issue
 * Cancel load by shipper
 */

  angular
    .module('loadsAppWeb')
    .service('Loads', LoadServices);

  /** @ngInject */
  function LoadServices($q, $http, Config, Upload) {
	var vm = this;
	vm.api_endpoint_loads = Config.ENV.API_ENDPOINT + 'loads/';

	vm.totalItems = function(params)
	{
		// Defer
        var defer = $q.defer();
        // Url
        var url = vm.api_endpoint_loads + 'LoadsByProfile';

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

  vm.getByUserRol = function(params)
  {
    // Defer
        var defer = $q.defer();
        // Url
        var url = vm.api_endpoint_loads + 'getLoadsforUserRol';

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

  vm.getLoadsHistoryByUserRol = function(params)
  {
    // Defer
        var defer = $q.defer();
        // Url
        var url = vm.api_endpoint_loads + 'getLoadsHistoryforUserRol';

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

  vm.getItemsSizeLengthLoads = function()
  {
    // Defer
        var defer = $q.defer();
        // Url
        var url = vm.api_endpoint_loads + 'getItemsSizeLengthLoads';

        // Get
        $http.post(url)
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

  vm.saveLoad = function(params)
  {
    // Defer
        var defer = $q.defer();
        // Url
        var url = vm.api_endpoint_loads + 'loadPostByLoadGenerator';

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
  
  vm.updateLoad = function(params)
  {
    // Defer
        var defer = $q.defer();
        // Url
        var url = vm.api_endpoint_loads + 'loadupdateByLoadGenerator';

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

  vm.getLoadDetails = function(params)
  {
    // Defer
        var defer = $q.defer();
        // Url
        var url = vm.api_endpoint_loads + 'loadDetails';

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

  vm.getCarrierRequests = function(params)
  {
    // Defer
        var defer = $q.defer();
        // Url
        var url = vm.api_endpoint_loads + 'getRequestCarrierLoads';

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

  vm.acceptCarrierRequest = function(params)
  {
    // Defer
        var defer = $q.defer();
        // Url
        var url = vm.api_endpoint_loads + 'setRequestCarrierLoads';

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

  vm.uploadInvoiceToLoad = function(params)
  {
    // Defer
        var defer = $q.defer();
        // Url
        var url = vm.api_endpoint_loads + 'uploadInvoiceToLoad';

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

  vm.searchLoads = function(params)
  {
    // Defer
        var defer = $q.defer();
        // Url
        var url = vm.api_endpoint_loads + 'searchLoads';

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

  vm.createRequestCarrierLoad = function(params)
  {
    // Defer
        var defer = $q.defer();
        // Url
        var url = vm.api_endpoint_loads + 'CreateRequestCarrierLoads';

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

  vm.cancelRequestCarrierLoad = function(params)
  {
    // Defer
        var defer = $q.defer();
        // Url
        var url = vm.api_endpoint_loads + 'CanceldRequestCarrierLoads';

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

  vm.reportIssueToLoad = function(params)
  {
    // Defer
        var defer = $q.defer();
        // Url
        var url = vm.api_endpoint_loads + 'ReportLoadIssues';

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

  vm.cancelLoad = function(params)
  {
    // Defer
        var defer = $q.defer();
        // Url
        var url = vm.api_endpoint_loads + 'cancelLoad';

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

  vm.checkLoadPriceWs = function(params)
  {
    // Defer
        var defer = $q.defer();
        // Url
        var url = vm.api_endpoint_loads + 'getPriceLoads';

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
