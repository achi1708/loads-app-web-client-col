'use strict';
/* Auth services
 * Login
 * Remember password
 * Signup
 * Update profile
 * Change user pic
 * Logout
 * Functions to resolve if user is authenticated or not
 * Get and set user data and token when user log in site
 */
angular.module('loadsAppWeb')
    .service('Auth', function (Config, $q, $http, $localStorage, Upload)
    {
        this.loginByCredentials = function (params)
        {
            var q = $q.defer();

            $http.post(Config.ENV.API_ENDPOINT + 'security/auth', params)
                .then(function (response) {
                    q.resolve(response.data);
                })
                .catch(function (response) {
                    q.reject(false);
                });

            return q.promise;
        };

        this.rememberMyPassword = function (params)
        {
            var q = $q.defer();

            $http.post(Config.ENV.API_ENDPOINT + 'security/auth/rememberPassword', params)
                .then(function (response) {
                    q.resolve(response.data);
                })
                .catch(function (response) {
                    q.reject(false);
                });

            return q.promise;
        };

        this.doSignUp = function (params)
        {
            var q = $q.defer();

            $http.post(Config.ENV.API_ENDPOINT + 'user/createUser', params)
                .then(function (response) {
                    q.resolve(response.data);
                })
                .catch(function (response) {
                    q.reject(false);
                });

            return q.promise;
        };

        this.updateProfile = function (params)
        {
            var q = $q.defer();

            $http.post(Config.ENV.API_ENDPOINT + 'user/UpdateUser', params)
                .then(function (response) {
                    q.resolve(response.data);
                })
                .catch(function (response) {
                    q.reject(false);
                });

            return q.promise;
        };

        this.uploadMyPic = function(params)
        {
        // Defer
            var defer = $q.defer();
            // Url
            var url = Config.ENV.API_ENDPOINT + 'user/setMyPicImg';

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

        this.logout = function ()
        {
            $localStorage.$reset();

            return true;   
        };

        this.setSessionUser = function (data)
        {
            var q = $q.defer();

            if(angular.isDefined(data.userData))
            {
                $localStorage.userData = data.userData;
                $localStorage.token = data.userData.token;
            }

            if(angular.isDefined(data.Info_perfil))
            {
                $localStorage.userProfile = data.Info_perfil.userProfile;
                $localStorage.userDataProfile = data.Info_perfil.dataUser;
            }

            if(angular.isDefined(data.capabilities))
            {
                $localStorage.userCapabilities = data.capabilities;
            }

            if(angular.isDefined(data.Info_compa))
            {
                $localStorage.userCompany = data.Info_compa;
            }

            q.resolve(true);

            return q.promise;
        }

        this.isAuthenticated = function ()
        {
            var flag = false;
            if(angular.isDefined($localStorage.userData) && angular.isDefined($localStorage.userProfile) && angular.isDefined($localStorage.userCapabilities)){
                flag = true;
            }

            return flag;
        }

        this.getUserData = function ()
        {
            if(angular.isDefined($localStorage.userData)){
                return $localStorage.userData;
            }

            return false;
        }

        this.getUserDataProfile = function ()
        {
            if(angular.isDefined($localStorage.userDataProfile)){
                return $localStorage.userDataProfile;
            }

            return false;
        }

        this.getUserProfile = function ()
        {
            if(angular.isDefined($localStorage.userProfile)){
                return $localStorage.userProfile;
            }

            return false;
        }

        this.getUserInfoCompany = function ()
        {
            if(angular.isDefined($localStorage.userCompany)){
                return $localStorage.userCompany;
            }

            return false;
        }

        this.getUserToken = function ()
        {
            if(angular.isDefined($localStorage.token)){
                return $localStorage.token;
            }

            return false;
        }

        this.setAutomaticAssign = function(newValue)
        {
            var userData = this.getUserData();

            if(userData && (newValue === 1 || newValue === 0)){
                if(angular.isDefined(userData.automatic_asign) && angular.isDefined($localStorage.userData)){
                    $localStorage.userData.automatic_asign = newValue;

                    return true;
                }
            }

            return false;
        }


    });
