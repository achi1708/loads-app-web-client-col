(function() {
  'use strict';

  /* Login controller
   * form validation
   * Send data to API and if response is right it'll let the user continue*/

  angular
    .module('loadsAppWeb')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($state, toastr, $filter, Config, Auth) {
	var vm = this;

    // Validate form and send data to API
	vm.doLogin = function (loginFormName)
    {
        // Valid form
        if (loginFormName.$invalid) {

            // Email
            if (!loginFormName.email.$valid && loginFormName.email.$error.required) {
                toastr.error($filter('translate')('login:email:error'));
                return;
            }

            // Password
            if (!loginFormName.password.$valid && loginFormName.password.$error.required) {
                toastr.error($filter('translate')('login:password:error'));
                return;
            }

            toastr.error($filter('translate')('login:invalid:error'));

            return;
        }

        var params = {};
        params.username = vm.credentials.email;
        params.password = CryptoJS.SHA1(vm.credentials.password.toString()).toString(); //Before to send, we excript the password in SHA! encription

        // Service Auth (app/auth/services/auth-serv)
        Auth.loginByCredentials(params)
                .then(function(response) {
                    if(angular.isDefined(response.userData) && angular.isDefined(response.Info_perfil)){
                        Auth.setSessionUser(response)
                            .then(function() {
                                $state.go('private.home');
                            });
                    }else{
                        toastr.error($filter('translate')('login:credentials:invalid'));
                    }
                })
                .catch(function(error) {
                    //console.log(error);
                });

    	
    };

    // Function executed at start 
	vm.initialize = function() {

        // Credentials
        vm.credentials = {
            email: null,
            password: null
        };
    };

    vm.initialize();
  }
})();
