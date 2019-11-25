(function() {
  'use strict';

  /* Public controller
   * Content pages where user doesn't need to be logged
   */

  angular
    .module('loadsAppWeb')
    .controller('PublicController', PublicController);

  /** @ngInject */
  function PublicController() {
	var vm = this;

    vm.isPublicPage = true;
  }
})();
