(function() {
  'use strict';

  /* Load details controller
   * Get load id
   * Get load attributes
   * Get load data
   * Allow user to do actions over the load
   */

  angular
    .module('loadsAppWeb')
    .controller('LoadsDetailsController', LoadsDetailsController);

  /** @ngInject */
  function LoadsDetailsController($state, $stateParams, toastr, $filter, Config, Loads, Auth, DatatableTool, $q, uiGmapGoogleMapApi, uiGmapIsReady, $uibModal) {
	  var vm = this;

    /* Function executed at strart, Get load id, set some vars about loading map, upload images and get load attributes */
	  vm.initialize = function() {
      vm.loadId = $stateParams.id|| false;
      vm.loadData = false;

      vm.loadInvoiceImgFilesList = [];
      vm.loadInvoiceDocsFilesList = [];
      vm.loadLegalImgFilesList = [];
      vm.loadLegalDocsFilesList = [];
      vm.legalDocFileSaving = false;
      vm.dataUpdateLoad = {};

      vm.loadingDataDetails = true;
      vm.loadingMap = true;

      vm.myData = Auth.getUserDataProfile();
      vm.userProfile = Auth.getUserProfile();
      vm.userDataGeneral = Auth.getUserData();
      vm.letApply = false;
      vm.seePrice = false;

      if(vm.userDataGeneral.carrier_apply_load_driver == 1){
        vm.letApply = true;
        vm.seePrice = true;
      }else if(vm.userDataGeneral.carrierprecie_driver == 1){
        vm.seePrice = true;
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

    /* Get load info */
    vm.getDataLoad = function() {
      var loadOptions = {
        'token': Auth.getUserToken(),
        'load_id': (vm.loadId) ? vm.loadId : false
      };

      if(loadOptions.load_id){
        Loads.getLoadDetails(loadOptions)
          .then(function(response){
            if(response.result){
              vm.loadData = response.result;
              if(angular.isDefined(vm.loadData.load_documents) && vm.loadData.load_documents.length){
                var arr_img = '';
                var elements_img = '';
                for(var f_index in vm.loadData.load_documents){
                  if(vm.loadData.load_documents[f_index].type_file == 'pdf'){
                    elements_img = vm.loadData.load_documents[f_index].invoice_file.split("/");

                    if(vm.loadData.load_documents[f_index].invoice_type == 'legal_doc'){
                      vm.loadLegalDocsFilesList.push({
                        id: f_index + 1,
                        url: vm.loadData.load_documents[f_index].invoice_file, 
                        title: elements_img[elements_img.length - 1],
                        invoice_name: vm.loadData.load_documents[f_index].invoice_name
                      });
                    }else{
                      vm.loadInvoiceDocsFilesList.push({
                        id: f_index + 1,
                        url: vm.loadData.load_documents[f_index].invoice_file, 
                        title: elements_img[elements_img.length - 1],
                        invoice_name: vm.loadData.load_documents[f_index].invoice_name
                      });
                    }
                  }else{
                    arr_img = $.parseJSON('['+vm.loadData.load_documents[f_index].invoice_file+']');
                    elements_img = arr_img[0][0].normal.split("/");

                    if(vm.loadData.load_documents[f_index].invoice_type == 'legal_doc'){
                      vm.loadLegalImgFilesList.push({
                        id: f_index + 1,
                        url: arr_img[0][0].normal, 
                        invoice_name: elements_img[elements_img.length - 1],
                        title: vm.loadData.load_documents[f_index].invoice_name
                      });
                    }else{
                      vm.loadInvoiceImgFilesList.push({
                        id: f_index + 1,
                        url: arr_img[0][0].normal, 
                        invoice_name: elements_img[elements_img.length - 1],
                        title: vm.loadData.load_documents[f_index].invoice_name
                      });
                    }
                  }
                }
              }

              if(angular.isDefined(vm.loadData.type_load) && vm.loadData.type_load.length){
                var arr_typeload = [];
                for(var i in vm.loadData.type_load){
                  arr_typeload.push(vm.loadData.type_load[i].skill_name);
                }
                vm.loadData.type_load_text = arr_typeload.join(', ');
              }else{
                vm.loadData.type_load_text = "";
              }

              if(angular.isDefined(vm.loadData.skills_required_carrier) && vm.loadData.skills_required_carrier.length){
                var arr_carrier_skills_required = [];
                for(var i in vm.loadData.skills_required_carrier){
                  arr_carrier_skills_required.push(vm.loadData.skills_required_carrier[i].skills_required_name);
                }
                vm.loadData.carrier_skills_required_text = arr_carrier_skills_required.join(', ');
              }else{
                vm.loadData.carrier_skills_required_text = "";
              }

              if(angular.isDefined(vm.loadData.TipoDeCamion) && vm.loadData.TipoDeCamion.length){
                var arr_tipo_camion = [];
                for(var i in vm.loadData.TipoDeCamion){
                  arr_tipo_camion.push(vm.loadData.TipoDeCamion[i].name_tc);
                }
                vm.loadData.TipoDeCamion_text = arr_tipo_camion.join(', ');
              }else{
                vm.loadData.TipoDeCamion_text = "";
              }

              if(angular.isDefined(vm.loadData.TipoDeTrailer) && vm.loadData.TipoDeTrailer.length){
                var arr_tipo_trailer = [];
                for(var i in vm.loadData.TipoDeTrailer){
                  arr_tipo_trailer.push(vm.loadData.TipoDeTrailer[i].name_ti);
                }
                vm.loadData.TipoDeTrailer_text = arr_tipo_trailer.join(', ');
              }else{
                vm.loadData.TipoDeTrailer_text = "";
              }

              vm.loadData.price_to_show = vm.loadData.price;
              if(vm.loadData.posteverywhere == "1" && vm.loadData.price == 0){
                vm.loadData.price_to_show = $filter('translate')('loads:table:price:call:text');
              }
              
              vm.initializeMap();
              vm.loadingDataDetails = false;
            }else{
              $state.go('private.loads');
            }
          })
          .catch(function (error) {
            vm.loadingDataDetails = false;
            $state.go('private.loads');
          });
      }else{
        vm.loadingDataDetails = false;
        $state.go('private.loads');
      }
    };

    /* Load the map and set load coordinates */
    vm.initializeMap = function(){
      if(angular.isDefined(vm.loadData.from_lat) && vm.loadData.from_lat != "" && angular.isDefined(vm.loadData.from_long) && vm.loadData.from_long != "" && angular.isDefined(vm.loadData.to_lat) && vm.loadData.to_lat != "" && angular.isDefined(vm.loadData.to_long) && vm.loadData.to_long != ""){
        uiGmapGoogleMapApi.then(function(maps) {
         vm.loadingMap = false;
         vm.map = { center: { latitude: vm.loadData.from_lat, longitude: vm.loadData.from_long }, zoom: 14 };
         vm.markers = [
            {id: 111, coords: { latitude: vm.loadData.from_lat, longitude: vm.loadData.from_long}},
            {id: 222, coords: { latitude: vm.loadData.to_lat, longitude: vm.loadData.to_long}}];
        });

        uiGmapIsReady.promise(1).then(function(maps) {
          google.maps.event.trigger(maps, 'resize');
        });
      }
    };

    /* Call Carrier request list modal */
    vm.openCarrierRequestModal = function() {
      var modalInstance = $uibModal.open({
        controller: 'CarrierRequestsModalController as carrierrequests',
        windowClass: 'carrier-requests-modal',
        templateUrl: 'app/loads/templates/modal/carrier-requests.html',
        resolve: {
            load: function() {
                return vm.loadId;
            }
        }
      });

      modalInstance.result.then(function() {
          vm.loadingDataDetails = true;
          vm.initialize();
      });
    };

    /* Call Carrier assigned info modal */
    vm.openCarrierAssignedInfoModal = function() {
      var modalInstance = $uibModal.open({
        controller: 'CarrierAssignedInfoModalController as carrierassignedinfo',
        windowClass: 'carrier-assigned-info-modal',
        templateUrl: 'app/loads/templates/modal/carrier-assigned-info.html',
        resolve: {
            carrier: function() {
                return vm.loadData.carrier;
            }
        }
      });
    };

    /* Call Load activity info modal */
    vm.openLoadActivityInfoModal = function() {
      var modalInstance = $uibModal.open({
        controller: 'LoadActivityInfoModalController as loadactivityinfo',
        windowClass: 'load-activity-info-modal',
        templateUrl: 'app/loads/templates/modal/load-activity-info.html',
        resolve: {
            load: function() {
                return vm.loadData;
            }
        }
      });
    };

    /* Call Truck assigned info modal */
    vm.openTruckAssignedInfoModal = function() {
      var modalInstance = $uibModal.open({
        controller: 'TruckAssignedInfoModalController as truckassignedinfo',
        windowClass: 'truck-assigned-info-modal',
        templateUrl: 'app/loads/templates/modal/truck-assigned-info.html',
        resolve: {
            truck: function() {
                return vm.loadData.info_truck;
            }
        }
      });
    };

    /* Call Truck list to assign modal */
    vm.openChooseTruckModal = function() {
      var modalInstance = $uibModal.open({
        controller: 'LoadTruckSelectModalController as loadtruckselect',
        windowClass: 'load-truck-select-modal',
        templateUrl: 'app/loads/templates/modal/load-truck-select.html',
        resolve: {
            load: function() {
                return vm.loadId;
            },
            carrier: function() {
                return vm.loadData.carrier;
            }
        }
      });

      modalInstance.result.then(function() {
          vm.loadingDataDetails = true;
          vm.initialize();
      });
    };

    /* Call Report issues modal */
    vm.openReportIssuesLoadModal = function() {
      var modalInstance = $uibModal.open({
        controller: 'ReportIssuesLoadModalController as reportissuesload',
        windowClass: 'report-issues-load-modal',
        templateUrl: 'app/loads/templates/modal/report-issues-load.html',
        resolve: {
            load: function() {
                return vm.loadId;
            }
        }
      });
    };

    /* Call Apply to load by carrier modal */
    vm.createRequestCarrierLoad = function() {
      var loadOptions = {
        'token': Auth.getUserToken(),
        'load_id': (vm.loadId) ? vm.loadId : false
      };
      Loads.createRequestCarrierLoad(loadOptions)
        .then(function(response){
          if(angular.isDefined(response.request_created)){
            if(angular.isDefined(response.request_created.idrequest_loads)){
              vm.loadingMap = true;
              vm.loadingDataDetails = true;
              vm.getDataLoad();
            }
          }
        });
    };

    /* Call Cancel my request to apply to the load modal */
    vm.cancelRequestCarrierLoad = function() {
      var loadOptions = {
        'token': Auth.getUserToken(),
        'load_id': (vm.loadId) ? vm.loadId : false
      };
      Loads.cancelRequestCarrierLoad(loadOptions)
        .then(function(response){
          vm.loadingMap = true;
          vm.loadingDataDetails = true;
          vm.getDataLoad();
          vm.legalDocFileSaving = false;
        });
    };

    /* Upload images and documents to the load */
    vm.uploadLegalDoc = function(file, invalidFiles) {
        // Upload logo image.
        if (file) {
            // Loading
            vm.legalDocFileSaving = true;

            var nameFile = vm.loadId+'_'+moment().milliseconds();

            if(file.name){
              var nameFileArr = file.name;
              nameFileArr = nameFileArr.split(".");
              nameFile = nameFileArr[0];
            }

            // Upload
            var params = {
                token: Auth.getUserToken(),
                invoice_name: nameFile,
                load_id: vm.loadId,
                invoice_type: 'legal_doc',
                pic: file
            };
            Loads.uploadInvoiceToLoad(params)
                .then(function(response) {
                    // Success
                    var elements_invoice = '';
                    if(angular.isDefined(response.invoice_name) && response.invoice_name.length > 0){
                      if(response.type_file =='pdf'){
                        elements_invoice = response.invoice_name.split("/");
                        vm.loadLegalDocsFilesList.push({url: response.invoice_name, name: elements_invoice[elements_invoice.length - 1]});
                      }else{
                        elements_invoice = response.invoice_name[0].normal.split("/");
                        vm.loadLegalImgFilesList.push({url: response.invoice_name[0].normal, name: elements_invoice[elements_invoice.length - 1]});
                      }
                    }

                    // Loading
                    vm.legalDocFileSaving = false;
                })
                .catch(function(error) {
                    // Error
                    // Loading
                    vm.legalDocFileSaving = false;
                });
        }
    };

    vm.initialize();
  }
})();
