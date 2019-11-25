(function() {
  'use strict';
/* Fastpay services
 * Get Carrier Factoring Loads
 */
  angular
    .module('loadsAppWeb')
    .service('Fastpay', FastpayServices);

  /** @ngInject */
  function FastpayServices($q, $http, Config, Upload) {
	var vm = this;
	vm.api_endpoint = Config.ENV.API_ENDPOINT;

  vm.getCarrierFactoringLoads = function(params)
  {
    // Defer
        var defer = $q.defer();
        // Url
        var url = vm.api_endpoint + 'loads/getCarrierFactoringLoads';

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
