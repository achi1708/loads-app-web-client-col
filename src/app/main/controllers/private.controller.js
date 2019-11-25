(function() {
  'use strict';

  /* Private controller
   * Content pages where user has to be logged
   */

  angular
    .module('loadsAppWeb')
    .controller('PrivateController', PrivateController);

  /** @ngInject */
  function PrivateController() {
	var vm = this;

    vm.isPublicPage = false;
  }
})();
