(function() {
  'use strict';

/* Notification services
 * Get notification list
 * Set new notifications as read
 * Save notification settings
 */

  angular
    .module('loadsAppWeb')
    .service('Notification', NotificationServices);

  /** @ngInject */
  function NotificationServices($q, $http, Config) {
	var vm = this;
	vm.api_endpoint = Config.ENV.API_ENDPOINT + 'notification/';

	vm.getNotifications = function(params)
	{
		// Defer
        var defer = $q.defer();
        // Url
        var url = vm.api_endpoint + 'userNotificationList';

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

  vm.setReadNotifications = function(params)
  {
    // Defer
        var defer = $q.defer();
        // Url
        var url = vm.api_endpoint + 'makeAsReadNotifications';

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

  vm.saveUserSettingsMessages = function(params)
  {
        var defer = $q.defer();
        // Url
        var url = Config.ENV.API_ENDPOINT + 'user/user-settings-message';

        // Get
        $http.post(url, params)
            .then(function(response) {
                // Success
                defer.resolve(response.data);
            })
            .catch(function(response) {
                // Error

                defer.reject(false);
            });

        return defer.promise;
  };
  }
})();
