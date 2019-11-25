(function() {
  'use strict';

  /* Looking for carrier modal controller
   * Set searching form vars 
   * Get load attributes and truck skills list
   * Redirect to carriers view with searching params
   */

  angular
    .module('loadsAppWeb')
    .controller('SearchCarrierModalController', SearchCarrierModalController);

  /** @ngInject */
  function SearchCarrierModalController($state, $uibModalInstance, Loads) {
	  var vm = this;
      vm.searchData = {};
      vm.searchData.company = null;
      vm.searchData.trailer_type = null;
      vm.searchData.len = null;
      vm.searchData.wei = null;
      vm.searchData.size = null;
      vm.searchData.reviews = 0;
      vm.searchData.skils_truck = [];

      /* Redirect to carriers view with params */
      vm.sendDataFormSearch = function() {
        if(angular.isDefined(vm.skillList)){
          vm.skillList.forEach(function(item) {
            if (item.checked) vm.searchData.skils_truck.push(item.id);
          });
        }

      	$state.go('private.carriers.params', { company: vm.searchData.company, trailer_type: vm.searchData.trailer_type, len: vm.searchData.len, wei: vm.searchData.wei, size: vm.searchData.size, skils_truck: vm.searchData.skils_truck, reviews: vm.searchData.reviews });
      	vm.closePopup();
      };

      /* Close modal */
      vm.closePopup = function() {
      	$uibModalInstance.close();
	    };

      /* Get load attributes */
      vm.getItemsSizeLengthLoads = function(){
        vm.itemsSizeLenLoads = {};
        Loads.getItemsSizeLengthLoads()
          .then(function(response){
            if(response){
              vm.itemsSizeLenLoads = response;
              console.log(vm.itemsSizeLenLoads);
              if(angular.isDefined(vm.itemsSizeLenLoads.TrucksSkills_list)){
                vm.setTruckSkillList();
              }
            }
          });
      };

      /* Set truck skills list in local var */
      vm.setTruckSkillList = function() {
        vm.skillList = [];
        if(vm.itemsSizeLenLoads.TrucksSkills_list.length){
          for(var i in vm.itemsSizeLenLoads.TrucksSkills_list){
            vm.skillList.push({id: vm.itemsSizeLenLoads.TrucksSkills_list[i].id, name: vm.itemsSizeLenLoads.TrucksSkills_list[i].skills_name, checked: false});
          }
        }
      };

      /* Set review when it is selected */
      vm.setReview = function(ind){
        ind = parseInt(ind);
        if(ind >=0 && ind <= 5){
          vm.searchData.reviews = ind;
        }
      };

      /* Reset form */
      vm.resetDataFormSearch = function(){
        vm.searchData.company = null;
        vm.searchData.trailer_type = null;
        vm.searchData.len = null;
        vm.searchData.wei = null;
        vm.searchData.size = null;
        vm.searchData.reviews = 0;
        vm.searchData.skils_truck = [];

        vm.setTruckSkillList();
      };

      vm.getItemsSizeLengthLoads();
  }
})();
