(function() {
  'use strict';

  /* Load activity info modal controller
   * Receive load activity info 
   */

  angular
    .module('loadsAppWeb')
    .controller('LoadActivityInfoModalController', LoadActivityInfoModalController);

  /** @ngInject */
  function LoadActivityInfoModalController($state, load, Auth, Loads, $uibModalInstance, $q, toastr, $filter) {
	  var vm = this;

    /* Function executed at strart, get load activity info  */
    vm.initialize = function() {
      vm.loadData = load;
    };

    /* Close popup */
    vm.closePopup = function() {
        $uibModalInstance.close();
    };

    vm.initialize();
    
  }
})();
