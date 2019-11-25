'use strict';
/* Interceptor service 
 * Add token and some params in http header in each http request made in the site
 * Just in the case the user is logged
 */
angular.module('loadsAppWeb')
    .service('AuthInterceptor', function ($q, $localStorage)
    {
        
        return {
            request: function (cfg)
            {
                cfg.headers = cfg.headers || {};

                var customHeaders = {
                    headers: {
                        "Authorization": "",
                        "Content-Type": "application/json"
                    }
                };

                //Get Access Token.
                //$localStorage.$apply();
                var accessToken = $localStorage.token;
                if (accessToken) {
                    customHeaders.headers["Authorization"] = 'Bearer ' + accessToken;
                }

                //Allow us to override the Interceptor configurtion, sending the headers at a http request.
                cfg.headers = angular.extend(customHeaders.headers, cfg.headers);

                return cfg;

            },
            responseError: function(response) {
                return $q.reject(response);
            }
        };

    });

angular.module('loadsAppWeb')
    .config(['$httpProvider',
        function ($httpProvider)
        {

            $httpProvider.interceptors.push('AuthInterceptor');

        }]);
