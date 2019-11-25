(function() {
  'use strict';

  /* Looking for loads modal controller
   * Set searching form vars 
   * Get load attributes 
   * Redirect to loads view with searching params
   */

  angular
    .module('loadsAppWeb')
    .controller('SearchLoadModalController', SearchLoadModalController);

  /** @ngInject */
  function SearchLoadModalController($state, $uibModalInstance, $filter, Loads) {
	  var vm = this;
      vm.from_any = false;
      vm.to_any = false;
      vm.price_any = false;
      vm.searchData = {};
      vm.searchData.fromObject = null;
      vm.searchData.from = null;
      vm.searchData.toObject = null;
      vm.searchData.to = null;
      vm.searchData.pickup = null;
      vm.searchData.delivery = null;
      vm.searchData.price_min = null;
      vm.searchData.price_max = null;
      vm.searchData.length = null;
      vm.searchData.size = null;
      vm.searchData.weight = null;
      vm.searchData.load_type = null;
      vm.searchData.load_id = null;
      vm.searchData.deadhead = null;
      vm.searchData.shipper = null;
      vm.searchData.review = 0;

      vm.advancedOptions = false;

      vm.dateDeliveryDisabled = true;
      vm.datePickerMinDate = moment();
      vm.optsDatePicker = {
          singleDatePicker: true,
          showDropdowns: true,
          locale: {
              format: "YYYY-MM-DD",
              applyClass: 'btn-green',
              applyLabel: $filter('translate')('daterangepicker:btn:success:text'),
              fromLabel: $filter('translate')('daterangepicker:label:from'),
              toLabel: $filter('translate')('daterangepicker:label:to'),
              cancelLabel: $filter('translate')('daterangepicker:btn:cancel:text'),
              customRangeLabel: $filter('translate')('daterangepicker:title:text'),
              firstDay: 1
          }
        };

      vm.priceMaxDisabled = true;

      /* if user selects any option in "date from", set vars as null */
      vm.fromAnyChanged = function() {
        if(vm.from_any){
          vm.searchData.fromObject = null;
          vm.searchData.from = null;
        }
      };

      /* if user selects any option in "date to", set vars as null */
      vm.toAnyChanged = function() {
        if(vm.to_any){
          vm.searchData.toObject = null;
          vm.searchData.to = null;
        }
      };

      /* if user selects any option in "price", set vars as null */
      vm.priceAnyChanged = function() {
        if(vm.price_any){
          vm.searchData.price_min = 0;
          vm.searchData.price_max = 0;
        }
      };

      /* Validate form and redirect to loads view with params */
      vm.sendDataFormSearch = function() {
        if(!vm.from_any){
          if(vm.searchData.fromObject != null){
            if(angular.isDefined(vm.searchData.fromObject.address_components)){
              vm.searchData.from = vm.searchData.fromObject.address_components[0].long_name;
            }
          }
        }else{
          vm.searchData.from = 0;
        }

        if(!vm.to_any){
          if(vm.searchData.toObject != null){
            if(angular.isDefined(vm.searchData.toObject.address_components)){
              vm.searchData.to = vm.searchData.toObject.address_components[0].long_name;
            }
          }
        }else{
          vm.searchData.to = 0;
        }

        if(vm.searchData.review == 0){
          vm.searchData.review = null;
        }
      	$state.go('private.loads.params', { from: vm.searchData.from, to: vm.searchData.to, pickup: vm.searchData.pickup, delivery: vm.searchData.delivery, price_min: vm.searchData.price_min, price_max: vm.searchData.price_max, length: vm.searchData.length, size: vm.searchData.size, weight: vm.searchData.weight, load_type: vm.searchData.load_type, load_id: vm.searchData.load_id, shipper: vm.searchData.shipper, review: vm.searchData.review, deadhead: vm.searchData.deadhead});
      	vm.closePopup();
      };

    /* Close modal */
      vm.closePopup = function() {
      	$uibModalInstance.close();
	  };

    /* Validate pickup date and allow to set delivery date */
    vm.allowDeliveryDate = function() {
      if(vm.searchData.pickup != null && vm.searchData.pickup != ""){
        vm.dateDeliveryDisabled = false;
        vm.searchData.delivery = null;
        /*if(vm.searchData.delivery < vm.searchData.pickup){
          vm.searchData.delivery = vm.searchData.pickup;
        }*/
      }else{
        vm.dateDeliveryDisabled = true;
        vm.searchData.delivery = null;
      }
    };

    /* Validate price min and allow to set price max */
    vm.allowPriceMax = function() {
      if(vm.searchData.price_min != null && vm.searchData.price_min >= 0){
        vm.priceMaxDisabled = false;
        if(vm.searchData.price_max < vm.searchData.price_min){
          vm.searchData.price_max = vm.searchData.price_min;
        }
      }else{
        vm.priceMaxDisabled = true;
        vm.searchData.price_max = null;
      }
    };

    /* Advanced filters toogle */
    vm.showHideAdvancedFilters = function(){
      vm.advancedOptions = !vm.advancedOptions;

      if(!vm.advancedOptions){
        vm.resetFilters('advanced');
      }
    };

    /* Reset filters */
    vm.resetFilters = function(mode){
      switch(mode){
        case 'advanced':
          vm.from_any = false;
          vm.to_any = false;
          vm.price_any = false;
          vm.searchData.price_min = null;
          vm.searchData.price_max = null;
          vm.searchData.length = null;
          vm.searchData.size = null;
          vm.searchData.weight = null;
          vm.searchData.load_type = null;
          vm.searchData.load_id = null;
          vm.searchData.shipper = null;
          vm.searchData.review = 0;

          vm.priceMaxDisabled = true;
          break;
        default:
          vm.from_any = false;
          vm.to_any = false;
          vm.price_any = false;
          vm.searchData.fromObject = null;
          vm.searchData.from = null;
          vm.searchData.toObject = null;
          vm.searchData.to = null;
          vm.searchData.pickup = null;
          vm.searchData.delivery = null;
          vm.searchData.price_min = null;
          vm.searchData.price_max = null;
          vm.searchData.length = null;
          vm.searchData.size = null;
          vm.searchData.weight = null;
          vm.searchData.load_type = null;
          vm.searchData.shipper = null;
          vm.searchData.load_id = null;
          vm.searchData.review = 0;

          vm.dateDeliveryDisabled = true;
          vm.datePickerMinDate = moment();
          vm.priceMaxDisabled = true;
          break;
      }
    };

    /* Validate review selected by user */
    vm.setReview = function(ind){
      ind = parseInt(ind);
      if(ind >=0 && ind <= 5){
        vm.searchData.review = ind;
      }
    };

    /* Get load attributes */
    vm.getItemsSizeLengthLoads = function(){
      vm.itemsSizeLenLoads = {};
      Loads.getItemsSizeLengthLoads()
        .then(function(response){
          if(response){
            vm.itemsSizeLenLoads = response;
          }
        });
    };

    vm.getItemsSizeLengthLoads();
  }
})();
