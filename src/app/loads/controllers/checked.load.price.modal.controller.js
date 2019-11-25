(function() {
  'use strict';

  /* Checked Load Price modal controller
   * Ask to choose a load price between suggested price or shipper price
   * Send form data to API
   */

  angular
    .module('loadsAppWeb')
    .controller('CheckedLoadPriceModalController', CheckedLoadPriceModalController);

  /** @ngInject */
  function CheckedLoadPriceModalController($state, price, load, $uibModalInstance, $filter, Loads, toastr) {

    /* Set form vars  */
    var vm = this;

    /* Function executed at strart, set form vars  */
    vm.initialize = function() {
      vm.priceSuggested = price;
      vm.loadInfo = load;
    };

    vm.selectPrice = function(suggested){
      if(suggested){
        vm.closePopup(vm.priceSuggested);
      }else{
        vm.closePopup(vm.loadInfo.price);
      }
    }

    vm.closePopup = function(resp) {
        $uibModalInstance.close(resp);
    };

    vm.initialize();
  }
})();
