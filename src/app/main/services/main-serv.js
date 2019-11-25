(function() {
  'use strict';

/* Generic services
 * Set automatic assign in loads
 * Get nearby loafs or carriers from user location
 */

  angular
    .module('loadsAppWeb')
    .service('MainServ', MainServices);

  /** @ngInject */
  function MainServices($q, $http, Config) {
	var vm = this;
	vm.api_endpoint = Config.ENV.API_ENDPOINT;

	vm.searchForLocation = function(params)
	{
		// Defer
        var defer = $q.defer();
        // Url
        var url = vm.api_endpoint + 'searchForLocation';

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

  vm.setAutomaticLoadAssign =  function(params)
  {
    var defer = $q.defer();
        // Url
        var url = vm.api_endpoint + 'loads/setAutomaticLoad';

        // Get
        $http.post(url, params)
            .then(function(response) {
                // Success
               defer.resolve(response.data); 
            })
            .catch(function(response) {
                // Error

                defer.reject(response);
            });

        return defer.promise;
  };

  }
})();
