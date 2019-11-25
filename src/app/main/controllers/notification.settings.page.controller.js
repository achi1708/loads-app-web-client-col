(function() {
  'use strict';

  /* Notification settings controller
   * Get settings info from auth service
   * Set and save notification settings
   * Set and save auto assign load setting
   */

  angular
    .module('loadsAppWeb')
    .controller('NotificationSettingsPageController', NotificationSettingsPageController);

  /** @ngInject */
  function NotificationSettingsPageController(toastr, $filter, Config, Auth, Notification, MainServ) {
	var vm = this;

	/* Function executed at strart, Set vars and get notification and auto assign settings */
	vm.initialize = function() {
		vm.saving = false;
		vm.settingsValues = {
			statusload_message: 0,
			cancelload_message: 0,
			deliveryload_message: 0,
			assignedload_message: 0,
			carrierprecie_driver: 0,
			carrier_apply_load_driver: 	0
		};
		vm.automaticAssingParams = {
			token: Auth.getUserToken(),
			automatic_load: 0
		}
		vm.userData = Auth.getUserData();

		if(angular.isDefined(vm.userData.statusload_message)){
			vm.settingsValues.statusload_message = vm.userData.statusload_message;
		}

		if(angular.isDefined(vm.userData.cancelload_message)){
			vm.settingsValues.cancelload_message = vm.userData.cancelload_message;
		}

		if(angular.isDefined(vm.userData.deliveryload_message)){
			vm.settingsValues.deliveryload_message = vm.userData.deliveryload_message;
		}

		if(angular.isDefined(vm.userData.assignedload_message)){
			vm.settingsValues.assignedload_message = vm.userData.assignedload_message;
		}

		if(angular.isDefined(vm.userData.automatic_asign)){
			vm.automaticAssingParams.automatic_load = vm.userData.automatic_asign;
		}

		if(angular.isDefined(vm.userData.carrierprecie_driver)){
			vm.settingsValues.carrierprecie_driver = vm.userData.carrierprecie_driver;
		}

		if(angular.isDefined(vm.userData.carrier_apply_load_driver)){
			vm.settingsValues.carrier_apply_load_driver = vm.userData.carrier_apply_load_driver;
		}
	};

	/* Save notification settings */
	vm.saveSettings = function() {
		var params = {
			token: Auth.getUserToken(),
			statusload_message: vm.settingsValues.statusload_message,
			cancelload_message: vm.settingsValues.cancelload_message,
			deliveryload_message: vm.settingsValues.deliveryload_message,
			assignedload_message: vm.settingsValues.assignedload_message,
			carrierprecie_driver: vm.settingsValues.carrierprecie_driver.toString(),
			carrier_apply_load_driver: vm.settingsValues.carrier_apply_load_driver
		};

		Notification.saveUserSettingsMessages(params)
	        .then(function(response){
	          if(response.status == 'ok'){
	          	toastr.success($filter('translate')('notification_settings:save:success'));
	          }else{
	          	toastr.error($filter('translate')('notification_settings:save:error'));
	          }
	        });
	};

	/* Save auto assign settings */
	vm.saveAutoAssign = function() {
		console.log(vm.automaticAssingParams);
		MainServ.setAutomaticLoadAssign(vm.automaticAssingParams)
	        .then(function(response){
	          if(response.status == 'ok'){
	          	var refreshUserData = Auth.setAutomaticAssign(parseInt(vm.automaticAssingParams.automatic_load));
	          	toastr.success($filter('translate')('notification_settings:automatic_assign:save:success'));
	          }else{
	          	toastr.error($filter('translate')('notification_settings:automatic_assign:save:error'));
	          }
	        })
	   		.catch(function(error){
	   			console.log(error);
	   		});
	}
 
	vm.initialize();
  }
})();
