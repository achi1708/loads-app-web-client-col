(function() {
  'use strict';

  /* Load edition controller
   * Set form vars
   * Get load attributes
   * Get load info
   * Validate and submit form data
   * Upload images and documents
   */

  angular
    .module('loadsAppWeb')
    .controller('LoadsEditController', LoadsEditController);

  /** @ngInject */
  function LoadsEditController($state, $stateParams, toastr, $filter, Config, Loads, Auth, DatatableTool, $q, $uibModal) {
	  var vm = this;

    /* Function which validates pickup date against delivery date and this doesn't allow pickup date being greater than delivery date */
    vm.allowDeliveryDate = function() {
      if(vm.dataUpdateLoad.pickup_date != null && vm.dataUpdateLoad.pickup_date != ""){
        vm.dateDeliveryDisabled = false;
        if(vm.dataUpdateLoad.delivery_date < vm.dataUpdateLoad.pickup_date){
          vm.dataUpdateLoad.delivery_date = vm.dataUpdateLoad.pickup_date;
        }
      }else{
        vm.dateDeliveryDisabled = true;
        vm.dataUpdateLoad.delivery_date = null;
      }
    };

    /* Function executed at strart, set form vars and get load attributes  */
	  vm.initialize = function() {
      vm.reviewPriceWs = false;
      vm.priceSuggested = 0;
      vm.validStatuses = ['NOT_ASSIGNED'];
      vm.loadId = $stateParams.id|| false;
      vm.loadData = false;
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

      vm.dataUpdateLoad = {};
      vm.dataUpdateLoad.token = Auth.getUserToken();
      vm.dataUpdateLoad.load_id = null;
      vm.dataUpdateLoad.city_pickup = null;
      vm.dataUpdateLoad.pickup_date = null;
      vm.dataUpdateLoad.pickup_address = null;
      vm.dataUpdateLoad.detail_address_pickup = null;
      vm.dataUpdateLoad.lat_pickup_address = null;
      vm.dataUpdateLoad.long_pickup_address = null;
      vm.dataUpdateLoad.zip_code_pickup = null,
      vm.dataUpdateLoad.city_delivery = null;
      vm.dataUpdateLoad.delivery_date = null;
      vm.dataUpdateLoad.delivery_address = null;
      vm.dataUpdateLoad.detail_address_delivery = null;
      vm.dataUpdateLoad.lat_delivery_address = null;
      vm.dataUpdateLoad.long_delivery_address = null;
      vm.dataUpdateLoad.zip_code_delivery = null;
      vm.dataUpdateLoad.weight = null;
      vm.dataUpdateLoad.load_type = null;
      vm.dataUpdateLoad.load_type_select = null;
      vm.dataUpdateLoad.lenght = null;
      vm.dataUpdateLoad.dimension = null;
      vm.dataUpdateLoad.price = null;
      vm.dataUpdateLoad.frecuency_active = 0;
      vm.dataUpdateLoad.load_comments = null;

      vm.loadFilesList = [];

      vm.savingUpdateLoad = false;
      vm.loadingDataDetails = true;

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
            vm.getDataLoad();
          }else{
            $state.go('private.loads');
          }
        })
        .catch(function (error) {
          console.log(error);
          $state.go('private.loads');
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

    /* Get load info  */
    vm.getDataLoad = function() {
      var loadOptions = {
        'token': Auth.getUserToken(),
        'load_id': (vm.loadId) ? vm.loadId : false
      };

      if(loadOptions.load_id){
        Loads.getLoadDetails(loadOptions)
          .then(function(response){
            if(response.result){
              if(vm.validStatuses.indexOf(response.result.status_loads) != -1){
                vm.loadData = response.result;
                if(angular.isDefined(vm.loadData.load_documents) && vm.loadData.load_documents.length){
                  var arr_img = '';
                  var elements_img = '';
                  for(var f_index in vm.loadData.load_documents){
                    arr_img = $.parseJSON('['+vm.loadData.load_documents[f_index].invoice_file+']');
                    elements_img = arr_img[0][0].normal.split("/");
                    vm.loadFilesList.push({id: f_index + 1,
                                           url: arr_img[0][0].normal, 
                                           title: elements_img[elements_img.length - 1]
                                         });
                  }
                }
                vm.setDataToForm();
                vm.loadingDataDetails = false;
              }else{
                $state.go('private.loads');  
                //alert("retorna 1");
              }
            }else{
              $state.go('private.loads');
              //alert("retorna 2");
            }
          })
          .catch(function (error) {
            vm.loadingDataDetails = false;
            $state.go('private.loads');
            //alert("retorna 3");
          });
      }else{
        vm.loadingDataDetails = false;
        //$state.go('private.loads');
        alert("retorna 4");
      }
    };

    /* Set load info in local vars  */
    vm.setDataToForm = function() {
      vm.dataUpdateLoad.load_id = (angular.isDefined(vm.loadData.load_id)) ? vm.loadData.load_id : null;
      vm.dataUpdateLoad.city_pickup = (angular.isDefined(vm.loadData.from)) ? vm.loadData.from : null;
      vm.dataUpdateLoad.pickup_date = (angular.isDefined(vm.loadData.pickup_date)) ? moment(vm.loadData.pickup_date) : null;
      vm.dataUpdateLoad.pickup_address = (angular.isDefined(vm.loadData.pickup_address)) ? vm.loadData.pickup_address : null;
      vm.dataUpdateLoad.detail_address_pickup = (angular.isDefined(vm.loadData.detail_address_pickup)) ? vm.loadData.detail_address_pickup : null;
      vm.dataUpdateLoad.lat_pickup_address = (angular.isDefined(vm.loadData.lat_pickup_adress)) ? vm.loadData.lat_pickup_adress : null;
      vm.dataUpdateLoad.long_pickup_address = (angular.isDefined(vm.loadData.long_pickup_adress)) ? vm.loadData.long_pickup_adress : null;
      vm.dataUpdateLoad.zip_code_pickup = (angular.isDefined(vm.loadData.zip_code_pickup)) ? vm.loadData.zip_code_pickup : null;
      vm.dataUpdateLoad.city_delivery = (angular.isDefined(vm.loadData.to)) ? vm.loadData.to : null;
      vm.dataUpdateLoad.delivery_date = (angular.isDefined(vm.loadData.delivery_date)) ? moment(vm.loadData.delivery_date) : null;
      vm.dataUpdateLoad.delivery_address = (angular.isDefined(vm.loadData.delivery_address)) ? vm.loadData.delivery_address : null;
      vm.dataUpdateLoad.detail_address_delivery = (angular.isDefined(vm.loadData.detail_address_delivery)) ? vm.loadData.detail_address_delivery : null;
      vm.dataUpdateLoad.lat_delivery_address = (angular.isDefined(vm.loadData.lat_delivery_address)) ? vm.loadData.lat_delivery_address : null;
      vm.dataUpdateLoad.long_delivery_address = (angular.isDefined(vm.loadData.long_delivery_address)) ? vm.loadData.long_delivery_address : null;
      vm.dataUpdateLoad.zip_code_delivery = (angular.isDefined(vm.loadData.zip_code_delivery)) ? vm.loadData.zip_code_delivery : null;
      vm.dataUpdateLoad.weight = (angular.isDefined(vm.loadData.weight)) ? parseInt(vm.loadData.weight) : null;
      if(vm.loadData.type_load && vm.loadData.type_load.length > 0){
        vm.dataUpdateLoad.load_type = [];
        for(var index in vm.loadData.type_load){
          //vm.dataUpdateLoad.load_type.push(vm.loadData.type_load[index].id.toString());
          vm.dataUpdateLoad.load_type_select = vm.loadData.type_load[index].id.toString();
        }

        /*if(angular.isDefined(vm.loadTypeList) && vm.loadTypeList.length){
          vm.loadTypeList.forEach(function(item) {
            if(vm.dataUpdateLoad.load_type.indexOf(item.id.toString()) != -1){
              item.checked = true;
            }
          });
        }*/
      }
      vm.dataUpdateLoad.lenght = (angular.isDefined(vm.loadData.length_loads)) ? parseInt(vm.loadData.length_loads) : null;
      if(vm.loadData.dimension && vm.itemsSizeLenLoads.LoadsSize_list.length > 0){
        for(var sizeindex in vm.itemsSizeLenLoads.LoadsSize_list){
          if(vm.itemsSizeLenLoads.LoadsSize_list[sizeindex].name == vm.loadData.dimension){
            vm.dataUpdateLoad.dimension = vm.itemsSizeLenLoads.LoadsSize_list[sizeindex].id.toString();

          }
        }
      }
      vm.dataUpdateLoad.price = (angular.isDefined(vm.loadData.price)) ? vm.loadData.price : null;
      vm.dataUpdateLoad.frecuency_active = (angular.isDefined(vm.loadData.recurrent_load_status)) ? (vm.loadData.recurrent_load_status == 'True' ? 1 : 0) : 0;
      if(angular.isDefined(vm.loadData.recurrent)){
        if(angular.isDefined(vm.loadData.recurrent.id)){
          vm.dataUpdateLoad.frecuency_id = vm.loadData.recurrent.id;
        }
      }

      if(vm.loadData.skills_required_carrier && vm.loadData.skills_required_carrier.length > 0){
        vm.dataUpdateLoad.skills_required_carrier = [];
        for(var carrierskillindex in vm.loadData.skills_required_carrier){
          vm.dataUpdateLoad.skills_required_carrier.push(vm.loadData.skills_required_carrier[carrierskillindex].id.toString());
        }

        if(angular.isDefined(vm.skillsRequiredCarrier) && vm.skillsRequiredCarrier.length){
          vm.skillsRequiredCarrier.forEach(function(item) {
            if(vm.dataUpdateLoad.skills_required_carrier.indexOf(item.id.toString()) != -1){
              item.checked = true;
            }
          });
        }
      }
      vm.dataUpdateLoad.load_comments = (angular.isDefined(vm.loadData.comments)) ? vm.loadData.comments : null;

      vm.dataSelectPickupCity = (angular.isDefined(vm.loadData.from)) ? vm.loadData.from : null;
      vm.dataSelectDeliveryCity = (angular.isDefined(vm.loadData.to)) ? vm.loadData.to : null;
      vm.dataSelectPickupAddress = (angular.isDefined(vm.loadData.pickup_address)) ? vm.loadData.pickup_address : null;
      vm.dataSelectDeliveryAddress = (angular.isDefined(vm.loadData.delivery_address)) ? vm.loadData.delivery_address : null;

      if(vm.loadData.TipoDeCamion && vm.loadData.TipoDeCamion.length > 0){
        for(var index in vm.loadData.TipoDeCamion){
          vm.truckTypeRequired = vm.loadData.TipoDeCamion[index].idtipo_de_camion.toString()
        }
      }

      if(vm.loadData.TipoDeTrailer && vm.loadData.TipoDeTrailer.length > 0){
        for(var index in vm.loadData.TipoDeTrailer){
          vm.trailerTypeRequired = vm.loadData.TipoDeTrailer[index].id.toString()
        }
      }
    };

    /* Validate and send form data to API */
    vm.save = function(postLoadFormName) {
      vm.loadTypeFieldRequired = false;
      vm.carrierSkillsRequired = false;
      vm.savingUpdateLoad = true;
      // Validate form.
      if (postLoadFormName.$invalid) {
          /*if(angular.isDefined(vm.loadTypeList)){
            var loadTypeChecked = 0;
            vm.loadTypeList.forEach(function(item) {
              if (item.checked) loadTypeChecked++;
            });

            if(loadTypeChecked <= 0){
              vm.loadTypeFieldRequired = true;
            }
          }*/

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
          vm.savingUpdateLoad = false;
          return;
      }

      if(vm.dataUpdateLoad.lenght <= 0 || vm.dataUpdateLoad.lenght === null || vm.dataUpdateLoad.lenght === null){
        toastr.error($filter('translate')('loads:add:form:length:value:invalid'));
        vm.savingUpdateLoad = false;
        return;
      }

      if(vm.dataUpdateLoad.weight <= 0 || vm.dataUpdateLoad.weight === null || vm.dataUpdateLoad.weight === null){
        toastr.error($filter('translate')('loads:add:form:weight:value:invalid'));
        vm.savingUpdateLoad = false;
        return;
      }

      if(angular.isDefined(vm.dataUpdateLoad.load_type_select)){
        vm.dataUpdateLoad.load_type.push(vm.dataUpdateLoad.load_type_select);
        vm.dataUpdateLoad.load_type = JSON.stringify(vm.dataUpdateLoad.load_type);
      }

      /*if(angular.isDefined(vm.loadTypeList)){
        vm.dataUpdateLoad.load_type = [];
        vm.loadTypeList.forEach(function(item) {
          if (item.checked) vm.dataUpdateLoad.load_type.push(item.id);
        });

        if(vm.dataUpdateLoad.load_type.length <= 0){
          toastr.error($filter('translate')('loads:add:form:required:fields:error'));
          vm.loadTypeFieldRequired = true;
          vm.savingUpdateLoad = false;
          return;
        }

        vm.dataUpdateLoad.load_type = JSON.stringify(vm.dataUpdateLoad.load_type);
      }*/

      if(angular.isDefined(vm.skillsRequiredCarrier)){
        vm.dataUpdateLoad.skills_required_carrier = [];
        vm.skillsRequiredCarrier.forEach(function(item) {
          if (item.checked) vm.dataUpdateLoad.skills_required_carrier.push(item.id);
        });

        if(vm.dataUpdateLoad.skills_required_carrier.length <= 0){
          toastr.error($filter('translate')('loads:add:form:required:fields:error'));
          vm.carrierSkillsRequired = true;
          vm.savingUpdateLoad = false;
          return;
        }

        vm.dataUpdateLoad.skills_required_carrier = JSON.stringify(vm.dataUpdateLoad.skills_required_carrier);
      }

      vm.dataUpdateLoad.tipodecamion = [];
      if(angular.isDefined(vm.truckTypeRequired)){
        if(vm.truckTypeRequired != '' && vm.truckTypeRequired != '0' && vm.truckTypeRequired != 0){
          vm.dataUpdateLoad.tipodecamion.push(vm.truckTypeRequired);
        }

        if(vm.dataUpdateLoad.tipodecamion.length <= 0){
          toastr.error($filter('translate')('loads:add:form:required:fields:error'));
          vm.savingUpdateLoad = false;
          return;
        }

        vm.dataUpdateLoad.tipodecamion = JSON.stringify(vm.dataUpdateLoad.tipodecamion);
      }

      vm.dataUpdateLoad.tipodetrailer = [];
      if(angular.isDefined(vm.trailerTypeRequired)){
        if(vm.trailerTypeRequired != '' && vm.trailerTypeRequired != '0' && vm.trailerTypeRequired != 0){
          vm.dataUpdateLoad.tipodetrailer.push(vm.trailerTypeRequired);
        }

        if(vm.dataUpdateLoad.tipodetrailer.length <= 0){
          toastr.error($filter('translate')('loads:add:form:required:fields:error'));
          vm.savingUpdateLoad = false;
          return;
        }

        vm.dataUpdateLoad.tipodetrailer = JSON.stringify(vm.dataUpdateLoad.tipodetrailer);
      }

      if(typeof vm.dataSelectPickupCity != typeof vm.dataUpdateLoad.city_pickup){
        vm.dataUpdateLoad.city_pickup = (angular.isDefined(vm.dataSelectPickupCity.name) ? vm.dataSelectPickupCity.name : vm.dataSelectPickupCity.formatted_address);  
      }

      if(typeof vm.dataSelectPickupAddress != typeof vm.dataUpdateLoad.pickup_address){
        vm.dataUpdateLoad.pickup_address = vm.dataSelectPickupAddress.formatted_address;
        vm.dataUpdateLoad.lat_pickup_address = (angular.isDefined(vm.dataSelectPickupAddress.geometry) ? vm.dataSelectPickupAddress.geometry.location.lat() : null);
        vm.dataUpdateLoad.long_pickup_address = (angular.isDefined(vm.dataSelectPickupAddress.geometry) ? vm.dataSelectPickupAddress.geometry.location.lng() : null);

        if(angular.isDefined(vm.dataSelectPickupAddress.address_components)){
          for(var i in vm.dataSelectPickupAddress.address_components){
            if(vm.dataSelectPickupAddress.address_components[i].types.indexOf('administrative_area_level_1') != -1){
              vm.dataUpdateLoad.state_pickup = vm.dataSelectPickupAddress.address_components[i].long_name;
            }

            if(vm.dataSelectPickupAddress.address_components[i].types.indexOf('country') != -1){
              vm.dataUpdateLoad.country_pickup = vm.dataSelectPickupAddress.address_components[i].long_name;
            }
          }
        }
      }

      if(typeof vm.dataSelectDeliveryCity != typeof vm.dataUpdateLoad.city_delivery){
        vm.dataUpdateLoad.city_delivery = (angular.isDefined(vm.dataSelectDeliveryCity.name) ? vm.dataSelectDeliveryCity.name : vm.dataSelectDeliveryCity.formatted_address);  
      }

      if(typeof vm.dataSelectDeliveryAddress != typeof vm.dataUpdateLoad.delivery_address){
        vm.dataUpdateLoad.delivery_address = vm.dataSelectDeliveryAddress.formatted_address;
        vm.dataUpdateLoad.lat_delivery_address = (angular.isDefined(vm.dataSelectDeliveryAddress.geometry) ? vm.dataSelectDeliveryAddress.geometry.location.lat() : null);
        vm.dataUpdateLoad.long_delivery_address = (angular.isDefined(vm.dataSelectDeliveryAddress.geometry) ? vm.dataSelectDeliveryAddress.geometry.location.lng() : null);

        if(angular.isDefined(vm.dataSelectDeliveryAddress.address_components)){
          for(var i in vm.dataSelectDeliveryAddress.address_components){
            if(vm.dataSelectDeliveryAddress.address_components[i].types.indexOf('administrative_area_level_1') != -1){
              vm.dataUpdateLoad.state_delivery = vm.dataSelectDeliveryAddress.address_components[i].long_name;
            }

            if(vm.dataSelectDeliveryAddress.address_components[i].types.indexOf('country') != -1){
              vm.dataUpdateLoad.country_delivery = vm.dataSelectDeliveryAddress.address_components[i].long_name;
            }
          }
        }
      }

      if(vm.reviewPriceWs === true){
        var paramsCheckPrice = {};
        paramsCheckPrice.token = vm.dataUpdateLoad.token;
        paramsCheckPrice.origin_city = vm.dataUpdateLoad.city_pickup;
        paramsCheckPrice.origin_state = angular.isDefined(vm.dataUpdateLoad.state_pickup) ? vm.dataUpdateLoad.state_pickup : vm.dataUpdateLoad.city_pickup;
        paramsCheckPrice.destini_city = vm.dataUpdateLoad.city_delivery;
        paramsCheckPrice.destini_state = angular.isDefined(vm.dataUpdateLoad.state_delivery) ? vm.dataUpdateLoad.state_delivery : vm.dataUpdateLoad.city_delivery;
        paramsCheckPrice.type_equipament = vm.dataUpdateLoad.load_type;
        paramsCheckPrice.skills_required_carrier = vm.dataUpdateLoad.skills_required_carrier;

        Loads.checkLoadPriceWs(paramsCheckPrice)
          .then(function (response) {
                  vm.priceSuggested = response.price;
                  vm.openCheckedPriceModal();
              }, function (error) {


              });
      }else{

        var defer = $q.defer();

        Loads.updateLoad(vm.dataUpdateLoad)
            .then(function (response) {
                    console.log(response);
                    toastr.success($filter('translate')('loads:add:form:success'));
                    $state.go('private.loads');
                }, function (error) {
                    toastr.error($filter('translate')('loads:add:form:required:fields:invalid'));
                });

        vm.savingUpdateLoad = false;
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
                return vm.dataUpdateLoad;
            }
        }
      });

      modalInstance.result.then(function(price) {
          vm.dataUpdateLoad.price = price;

          Loads.updateLoad(vm.dataUpdateLoad)
            .then(function (response) {
                    console.log(response);
                    toastr.success($filter('translate')('loads:add:form:success'));
                    $state.go('private.loads');
                }, function (error) {
                    toastr.error($filter('translate')('loads:add:form:required:fields:invalid'));
                });

            vm.savingUpdateLoad = false;
      });
    };

    /* Upload documents */
    vm.uploadLegalDoc = function(file, invalidFiles) {
            // Upload logo image.
            console.log(file);
            if (file) {
                // Loading
                vm.fileSaving = true;

                var nameFile = vm.dataUpdateLoad.load_id+'_'+moment().milliseconds();

                if(file.name){
                  var nameFileArr = file.name;
                  nameFileArr = nameFileArr.split(".");
                  nameFile = nameFileArr[0];
                }

                // Upload
                var params = {
                    token: Auth.getUserToken(),
                    invoice_name: nameFile,
                    load_id: vm.dataUpdateLoad.load_id,
                    invoice_type: 'legal_doc',
                    pic: file
                };
                Loads.uploadInvoiceToLoad(params)
                    .then(function(response) {
                        // Success
                        var elements_invoice = '';
                        if(angular.isDefined(response.invoice_name) && response.invoice_name.length > 0){
                          elements_invoice = response.invoice_name[0].normal.split("/");
                          vm.loadFilesList.push({url: response.invoice_name[0].normal, name: elements_invoice[elements_invoice.length - 1]});
                        }
                        toastr.success($filter('translate')('loads:edit:invoice:upload:successfully'));

                        // Loading
                        vm.fileSaving = false;
                    })
                    .catch(function(error) {
                        // Error
                        console.log(error);
                        // Loading
                        vm.fileSaving = false;

                        // Message.
                        toastr.error($filter('translate')('loads:edit:invoice:upload:error'));
                    });
            }
        };

    vm.cleanLoadLengthValue = function() {
      if(vm.dataUpdateLoad.lenght !== undefined && vm.dataUpdateLoad.lenght !== null){
        var textToConvert = vm.dataUpdateLoad.lenght.toString();
        textToConvert = textToConvert.replace(/[a-zA-Z\s\W]/gm, "");
        vm.dataUpdateLoad.lenght = parseInt(textToConvert);
      }else{
        vm.dataUpdateLoad.lenght = 0;
      }
    }
    vm.cleanLoadWeightValue = function() {
      if(vm.dataUpdateLoad.weight !== undefined && vm.dataUpdateLoad.weight !== null){
        var textToConvert = vm.dataUpdateLoad.weight.toString();
        textToConvert = textToConvert.replace(/[a-zA-Z\s\W]/gm, "");
        vm.dataUpdateLoad.weight = parseInt(textToConvert);
      }else{
        vm.dataUpdateLoad.weight = 0;
      }
    }

    vm.initialize();
  }
})();
