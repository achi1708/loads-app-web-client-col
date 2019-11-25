(function() {
  'use strict';

  /* Invite Join controller
   */

  angular
    .module('loadsAppWeb')
    .controller('InviteJoinPageController', InviteJoinPageController);

  /** @ngInject */
  function InviteJoinPageController(toastr, $filter, Config) {
	var vm = this;
	vm.type = "page";
  }
})();
