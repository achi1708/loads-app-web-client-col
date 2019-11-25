(function() {
  'use strict';

  /* Notifications controller
   */

  angular
    .module('loadsAppWeb')
    .controller('NotificationsPageController', NotificationsPageController);

  /** @ngInject */
  function NotificationsPageController(toastr, $filter, Config) {
	var vm = this;
	vm.notificationTypeList = "page";
  }
})();
