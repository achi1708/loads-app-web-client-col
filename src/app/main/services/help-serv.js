(function() {
  'use strict';

/* Help services (Get info from API)
 * Get Terms and conditions
 * Get Eula info
 * Get Privacy and Policy
 * Get FAQs
 */

  angular
    .module('loadsAppWeb')
    .service('HelpServ', HelpServices);

  /** @ngInject */
  function HelpServices($q, $http, Config) {
	var vm = this;
	vm.api_endpoint = Config.ENV.STORAGE_ENDPOINT;

	vm.getTyC = function(language)
	{
    console.log(language);
		// Defer
        var defer = $q.defer();
        // Url
        var url = '';
        if(language == 'es'){
          url = vm.api_endpoint + 'about/tyc-es.html';
        }else{
          url = vm.api_endpoint + 'about/tyc.html';
        }

        // Get
        $http.get(url)
            .then(function(response) {
                // Success
                defer.resolve(response);
            })
            .catch(function(response) {
                // Error

                defer.reject(false);
            });

        return defer.promise;
	};

  vm.getEula = function(language)
  {
    // Defer
        var defer = $q.defer();
        // Url
        var url = '';
        if(language == 'es'){
          url = vm.api_endpoint + 'about/eula-es.html';
        }else{
          url = vm.api_endpoint + 'about/eula.html';
        }

        // Get
        $http.get(url)
            .then(function(response) {
                // Success
                defer.resolve(response);
            })
            .catch(function(response) {
                // Error

                defer.reject(false);
            });

        return defer.promise;
  };

  vm.getPrivacyPolicy = function(language)
  {
    // Defer
        var defer = $q.defer();
        // Url
        var url = '';
        if(language == 'es'){
          url = vm.api_endpoint + 'about/privacy-policy-es.html';
        }else{
          url = vm.api_endpoint + 'about/privacy-policy.html';
        }

        // Get
        $http.get(url)
            .then(function(response) {
                // Success
                defer.resolve(response);
            })
            .catch(function(response) {
                // Error

                defer.reject(false);
            });

        return defer.promise;
  };

  vm.getFaqs = function(language)
  {
    // Defer
        var defer = $q.defer();
        // Url
        var url = '';
        if(language == 'es'){
          url = vm.api_endpoint + 'about/faq-es.html';
        }else{
          url = vm.api_endpoint + 'about/faq.html';
        }

        // Get
        $http.get(url)
            .then(function(response) {
                // Success
                defer.resolve(response);
            })
            .catch(function(response) {
                // Error

                defer.reject(false);
            });

        return defer.promise;
  };
  }
})();
