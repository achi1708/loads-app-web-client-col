(function() {
  'use strict';

  /* Forgot password controller
   * form validation
   * Send data to API and receiving a response*/

  angular
    .module('loadsAppWeb')
    .controller('ForgotPasswordController', ForgotPasswordController);

  /** @ngInject */
  function ForgotPasswordController($state, toastr, $filter, Config, Auth) {
	var vm = this;

    // Validate form and send data to API
	vm.sendRequest = function (forgotPasswordFormName)
    {
        // Valid form
        if (forgotPasswordFormName.$invalid) {

            // Email
            if (!forgotPasswordFormName.email.$valid && forgotPasswordFormName.email.$error.required) {
                toastr.error($filter('translate')('forgot_password:email:error'));
                return;
            }

            toastr.error($filter('translate')('forgot_password:invalid:error'));

            return;
        }

        var params = {};
        params.email = vm.data.email;

        // Service Auth (app/auth/services/auth-serv)
        Auth.rememberMyPassword(params)
                .then(function(response) {
                    if(angular.isDefined(response.status) && response.status == "ok"){
                        toastr.success($filter('translate')('forgot_password:request:success'));
                        $state.go('private.home');
                    }else{
                        toastr.error($filter('translate')('forgot_password:data:invalid'));
                    }
                })
                .catch(function(error) {
                    //console.log(error);
                });

    	
    };

	vm.initialize = function() {

        // Forgot Password data
        vm.data = {
            email: null
        };
    };

    vm.initialize();
  }
})();
