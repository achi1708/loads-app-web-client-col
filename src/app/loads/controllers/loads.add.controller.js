(function() {
  'use strict';

  /* Load creation controller
   * Set form data
   * Get load attributes
   * Validate and send form data to API
   */

  angular
    .module('loadsAppWeb')
    .controller('LoadsAddController', LoadsAddController);

  /** @ngInject */
  function LoadsAddController($state, toastr, $filter, Config, Loads, Auth, DatatableTool, $q, $uibModal) {
	  var vm = this;

    vm.reviewPriceWs = false;

    /* Function which validates pickup date against delivery date and this doesn't allow pickup date being greater than delivery date */
    vm.allowDeliveryDate = function() {
      if(vm.dataNewLoad.pickup_date != null && vm.dataNewLoad.pickup_date != ""){
        vm.dateDeliveryDisabled = false;
        if(vm.dataNewLoad.delivery_date < vm.dataNewLoad.pickup_date){
          vm.dataNewLoad.delivery_date = vm.dataNewLoad.pickup_date;
        }
      }else{
        vm.dateDeliveryDisabled = true;
        vm.dataNewLoad.delivery_date = null;
      }
    };

    vm.checkOriginZip = function() {
      if(angular.isDefined(vm.dataSelectPickupAddress.address_components)){
        for(var i in vm.dataSelectPickupAddress.address_components){
          if(vm.dataSelectPickupAddress.address_components[i].types.indexOf('postal_code') != -1){
            vm.dataNewLoad.zip_code_pickup = vm.dataSelectPickupAddress.address_components[i].long_name;
          }
        }
      }
    };

    vm.checkDestinationZip = function() {
      console.log(vm.dataSelectPickupAddress);
      if(angular.isDefined(vm.dataSelectDeliveryAddress.address_components)){
        for(var i in vm.dataSelectDeliveryAddress.address_components){
          if(vm.dataSelectDeliveryAddress.address_components[i].types.indexOf('postal_code') != -1){
            vm.dataNewLoad.zip_code_delivery = vm.dataSelectDeliveryAddress.address_components[i].long_name;
          }
        }
      }
    };

    /* Function executed at strart, set form data and get load attributes  */
	  vm.initialize = function() {
      vm.submitReturnList = false;

      vm.priceSuggested = 0;

      vm.dataSelectPickupCity = null;
      vm.dataSelectDeliveryCity = null;
      vm.dataSelectPickupAddress = null;
      vm.dataSelectDeliveryAddress = null;

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

      vm.dataNewLoad = {};
      vm.dataNewLoad.token = Auth.getUserToken();
      vm.dataNewLoad.city_pickup = null;
      vm.dataNewLoad.pickup_date = null;
      vm.dataNewLoad.pickup_address = null;
      vm.dataNewLoad.detail_address_pickup = null;
      vm.dataNewLoad.lat_pickup_address = null;
      vm.dataNewLoad.long_pickup_address = null;
      vm.dataNewLoad.country_pickup = null;
      vm.dataNewLoad.state_pickup = null;
      vm.dataNewLoad.zip_code_pickup = null,
      vm.dataNewLoad.city_delivery = null;
      vm.dataNewLoad.delivery_date = null;
      vm.dataNewLoad.delivery_address = null;
      vm.dataNewLoad.detail_address_delivery = null;
      vm.dataNewLoad.lat_delivery_address = null;
      vm.dataNewLoad.long_delivery_address = null;
      vm.dataNewLoad.country_delivery = null;
      vm.dataNewLoad.state_delivery = null;
      vm.dataNewLoad.zip_code_delivery = null;
      vm.dataNewLoad.weight = null;
      vm.dataNewLoad.load_type = [];
      vm.dataNewLoad.load_type_select = null;
      vm.dataNewLoad.lenght = null;
      vm.dataNewLoad.dimension = null;
      vm.dataNewLoad.price = null;
      vm.dataNewLoad.frecuency_active = 0;
      vm.dataNewLoad.skills_required_carrier = [];
      vm.dataNewLoad.tipodecamion = [];
      vm.dataNewLoad.tipodetrailer = [];

      vm.savingNewLoad = false;
      vm.loadTypeFieldRequired = false;
      vm.carrierSkillsRequired = false;
      vm.truckTypeRequired = null;
      vm.trailerTypeRequired = null;

      vm.optionsGoogleInputCity = {
        types: ['(cities)']
      }

      vm.getItemsSizeLengthLoads();

    };

    /* Get load attributes */
    vm.getItemsSizeLengthLoads = function() {
      vm.itemsSizeLenLoads = {};
      Loads.getItemsSizeLengthLoads()
        .then(function(response){
          if(response){
            vm.itemsSizeLenLoads = response;
            if(angular.isDefined(vm.itemsSizeLenLoads.LoadsSkillsRequired_list)){
              vm.setLoadsSkillsRequiredList();
            }

            if(angular.isDefined(vm.itemsSizeLenLoads.LoadsType_list)){
              vm.setLoadsTypeList();
            }
          }
        }); 
    };

    /* Set load skills list as local var */
    vm.setLoadsSkillsRequiredList = function() {
      vm.skillsRequiredCarrier = [];
      if(vm.itemsSizeLenLoads.LoadsSkillsRequired_list.length){
        for(var i in vm.itemsSizeLenLoads.LoadsSkillsRequired_list){
          vm.skillsRequiredCarrier.push({id: vm.itemsSizeLenLoads.LoadsSkillsRequired_list[i].id, name: vm.itemsSizeLenLoads.LoadsSkillsRequired_list[i].skills_required_name, checked: false});
        }
      }
    };

    /* Set load types list as local var */
    vm.setLoadsTypeList = function() {
      vm.loadTypeList = [];
      if(vm.itemsSizeLenLoads.LoadsType_list.length){
        for(var i in vm.itemsSizeLenLoads.LoadsType_list){
          vm.loadTypeList.push({id: vm.itemsSizeLenLoads.LoadsType_list[i].id, name: vm.itemsSizeLenLoads.LoadsType_list[i].skill_name, checked: false});
        }
      }
    };

    /* Validate form and send data to API */
    vm.save = function(postLoadFormName) {
      vm.loadTypeFieldRequired = false;
      vm.carrierSkillsRequired = false;
      vm.savingNewLoad = true;
      // Validate form.
      if (postLoadFormName.$invalid) {

          if(angular.isDefined(vm.skillsRequiredCarrier)){
            var carrierSkillsChecked = 0;
            vm.skillsRequiredCarrier.forEach(function(item) {
              if (item.checked) carrierSkillsChecked++;
            });

            if(carrierSkillsChecked <= 0){
              vm.carrierSkillsRequired = true;
            }
          }
          // If there was an error for required fields.
          if (postLoadFormName.$error.required) {
              toastr.error($filter('translate')('loads:add:form:required:fields:error'));
          } else {
              toastr.error($filter('translate')('loads:add:form:required:fields:invalid'));
          }
          vm.savingNewLoad = false;
          return;
      }

      if(vm.dataNewLoad.lenght <= 0 || vm.dataNewLoad.lenght === null || vm.dataNewLoad.lenght === null){
        toastr.error($filter('translate')('loads:add:form:length:value:invalid'));
        vm.savingNewLoad = false;
        return;
      }

      if(vm.dataNewLoad.weight <= 0 || vm.dataNewLoad.weight === null || vm.dataNewLoad.weight === null){
        toastr.error($filter('translate')('loads:add:form:weight:value:invalid'));
        vm.savingNewLoad = false;
        return;
      }

      if(angular.isDefined(vm.dataNewLoad.load_type_select)){
        vm.dataNewLoad.load_type.push(vm.dataNewLoad.load_type_select);
        vm.dataNewLoad.load_type = JSON.stringify(vm.dataNewLoad.load_type);
      }

      /*vm.dataNewLoad.load_type = [];
      if(angular.isDefined(vm.loadTypeList)){
        vm.loadTypeList.forEach(function(item) {
          if (item.checked) vm.dataNewLoad.load_type.push(item.id);
        });

        if(vm.dataNewLoad.load_type.length <= 0){
          toastr.error($filter('translate')('loads:add:form:required:fields:error'));
          vm.loadTypeFieldRequired = true;
          vm.savingNewLoad = false;
          return;
        }

        vm.dataNewLoad.load_type = JSON.stringify(vm.dataNewLoad.load_type);
      }*/

      vm.dataNewLoad.skills_required_carrier = [];
      if(angular.isDefined(vm.skillsRequiredCarrier)){
        vm.skillsRequiredCarrier.forEach(function(item) {
          if (item.checked) vm.dataNewLoad.skills_required_carrier.push(item.id);
        });

        if(vm.dataNewLoad.skills_required_carrier.length <= 0){
          toastr.error($filter('translate')('loads:add:form:required:fields:error'));
          vm.carrierSkillsRequired = true;
          vm.savingNewLoad = false;
          return;
        }

        vm.dataNewLoad.skills_required_carrier = JSON.stringify(vm.dataNewLoad.skills_required_carrier);
      }


      vm.dataNewLoad.tipodecamion = [];
      if(angular.isDefined(vm.truckTypeRequired)){
        if(vm.truckTypeRequired != '' && vm.truckTypeRequired != '0' && vm.truckTypeRequired != 0){
          vm.dataNewLoad.tipodecamion.push(vm.truckTypeRequired);
        }

        if(vm.dataNewLoad.tipodecamion.length <= 0){
          toastr.error($filter('translate')('loads:add:form:required:fields:error'));
          vm.savingNewLoad = false;
          return;
        }

        vm.dataNewLoad.tipodecamion = JSON.stringify(vm.dataNewLoad.tipodecamion);
      }

      vm.dataNewLoad.tipodetrailer = [];
      if(angular.isDefined(vm.trailerTypeRequired)){
        if(vm.trailerTypeRequired != '' && vm.trailerTypeRequired != '0' && vm.trailerTypeRequired != 0){
          vm.dataNewLoad.tipodetrailer.push(vm.trailerTypeRequired);
        }

        if(vm.dataNewLoad.tipodetrailer.length <= 0){
          toastr.error($filter('translate')('loads:add:form:required:fields:error'));
          vm.savingNewLoad = false;
          return;
        }

        vm.dataNewLoad.tipodetrailer = JSON.stringify(vm.dataNewLoad.tipodetrailer);
      }

      vm.dataNewLoad.city_pickup = (angular.isDefined(vm.dataSelectPickupCity.name) ? vm.dataSelectPickupCity.name : vm.dataSelectPickupCity.formatted_address);
      vm.dataNewLoad.pickup_address = vm.dataSelectPickupAddress.formatted_address;
      vm.dataNewLoad.lat_pickup_address = (angular.isDefined(vm.dataSelectPickupAddress.geometry) ? vm.dataSelectPickupAddress.geometry.location.lat() : null);
      vm.dataNewLoad.long_pickup_address = (angular.isDefined(vm.dataSelectPickupAddress.geometry) ? vm.dataSelectPickupAddress.geometry.location.lng() : null);
      vm.dataNewLoad.country_pickup = null;
      vm.dataNewLoad.state_pickup = null;

      if(angular.isDefined(vm.dataSelectPickupAddress.address_components)){
        for(var i in vm.dataSelectPickupAddress.address_components){
          if(vm.dataSelectPickupAddress.address_components[i].types.indexOf('administrative_area_level_1') != -1){
            vm.dataNewLoad.state_pickup = vm.dataSelectPickupAddress.address_components[i].long_name;
          }

          if(vm.dataSelectPickupAddress.address_components[i].types.indexOf('country') != -1){
            vm.dataNewLoad.country_pickup = vm.dataSelectPickupAddress.address_components[i].long_name;
          }
        }
      }

      vm.dataNewLoad.city_delivery = (angular.isDefined(vm.dataSelectDeliveryCity.name) ? vm.dataSelectDeliveryCity.name : vm.dataSelectDeliveryCity.formatted_address);
      vm.dataNewLoad.delivery_address = vm.dataSelectDeliveryAddress.formatted_address;
      vm.dataNewLoad.lat_delivery_address = (angular.isDefined(vm.dataSelectDeliveryAddress.geometry) ? vm.dataSelectDeliveryAddress.geometry.location.lat() : null);
      vm.dataNewLoad.long_delivery_address = (angular.isDefined(vm.dataSelectDeliveryAddress.geometry) ? vm.dataSelectDeliveryAddress.geometry.location.lng() : null);
      vm.dataNewLoad.country_delivery = null;
      vm.dataNewLoad.state_delivery = null;

      if(angular.isDefined(vm.dataSelectDeliveryAddress.address_components)){
        for(var i in vm.dataSelectDeliveryAddress.address_components){
          if(vm.dataSelectDeliveryAddress.address_components[i].types.indexOf('administrative_area_level_1') != -1){
            vm.dataNewLoad.state_delivery = vm.dataSelectDeliveryAddress.address_components[i].long_name;
          }

          if(vm.dataSelectDeliveryAddress.address_components[i].types.indexOf('country') != -1){
            vm.dataNewLoad.country_delivery = vm.dataSelectDeliveryAddress.address_components[i].long_name;
          }
        }
      }

      var defer = $q.defer();

      if(vm.reviewPriceWs === true){
        var paramsCheckPrice = {};
        paramsCheckPrice.token = vm.dataNewLoad.token;
        paramsCheckPrice.origin_city = vm.dataNewLoad.city_pickup;
        paramsCheckPrice.origin_state = vm.dataNewLoad.state_pickup;
        paramsCheckPrice.destini_city = vm.dataNewLoad.city_delivery;
        paramsCheckPrice.destini_state = vm.dataNewLoad.state_delivery;
        paramsCheckPrice.type_equipament = vm.dataNewLoad.load_type;
        paramsCheckPrice.skills_required_carrier = vm.dataNewLoad.skills_required_carrier;

        Loads.checkLoadPriceWs(paramsCheckPrice)
          .then(function (response) {
                  vm.priceSuggested = response.price;
                  vm.openCheckedPriceModal();
              }, function (error) {


              });
      }else{
        Loads.saveLoad(vm.dataNewLoad)
        .then(function (response) {
                console.log(response);
                toastr.success($filter('translate')('loads:add:form:success'));
                if(vm.submitReturnList){
                  $state.go('private.loads');
                }else{
                  vm.initialize();
                }
            }, function (error) {
                toastr.error($filter('translate')('loads:add:form:required:fields:invalid'));
            });

        vm.savingNewLoad = false;
      }

    };

    /* Set return load list after save a new load */
    vm.submitReturnListFunc = function(postLoadFormName) {
      vm.submitReturnList = true;
      vm.save(postLoadFormName);
    };

    vm.cleanLoadLengthValue = function() {
      if(vm.dataNewLoad.lenght !== undefined && vm.dataNewLoad.lenght !== null){
        var textToConvert = vm.dataNewLoad.lenght.toString();
        textToConvert = textToConvert.replace(/[a-zA-Z\s\W]/gm, "");
        vm.dataNewLoad.lenght = parseInt(textToConvert);
      }else{
        vm.dataNewLoad.lenght = 0;
      }
    };
    vm.cleanLoadWeightValue = function() {
      if(vm.dataNewLoad.weight !== undefined && vm.dataNewLoad.weight !== null){
        var textToConvert = vm.dataNewLoad.weight.toString();
        textToConvert = textToConvert.replace(/[a-zA-Z\s\W]/gm, "");
        vm.dataNewLoad.weight = parseInt(textToConvert);
      }else{
        vm.dataNewLoad.weight = 0;
      }
    };

    vm.openCheckedPriceModal = function() {
      var modalInstance = $uibModal.open({
        controller: 'CheckedLoadPriceModalController as loadprice',
        windowClass: 'load-price-modal',
        templateUrl: 'app/loads/templates/modal/checked-load-price.html',
        resolve: {
            price: function() {
                return vm.priceSuggested;
            },
            load: function() {
                return vm.dataNewLoad;
            }
        }
      });

      modalInstance.result.then(function(price) {
          vm.dataNewLoad.price = price;

          Loads.saveLoad(vm.dataNewLoad)
            .then(function (response) {
                    console.log(response);
                    toastr.success($filter('translate')('loads:add:form:success'));
                    if(vm.submitReturnList){
                      $state.go('private.loads');
                    }else{
                      vm.initialize();
                    }
                }, function (error) {
                    toastr.error($filter('translate')('loads:add:form:required:fields:invalid'));
                });

            vm.savingNewLoad = false;
      });
    };

    vm.initialize();
  }
})();
