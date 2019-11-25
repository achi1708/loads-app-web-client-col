(function() {
  'use strict';

  /* Load details Directive
   * It shows load info in dropdown of trucks table list
   * It is a generic element is loaded when user click in dropdown button of item */

  angular
    .module('loadsAppWeb')
    .directive('loadDetailsRow', loadDetailsRow);

  /** @ngInject */
  function loadDetailsRow($rootScope, Auth, Loads, uiGmapGoogleMapApi, uiGmapIsReady, $uibModal, $filter) {
    return {
        templateUrl: 'app/loads/templates/directives/load-details-row.html', // directive template
        restrict: 'E',
        replace: true,
        scope: {
          loadId: '=', //Input of directive, Load id
          reloadParent: '&', //Input of directive, Funcion from loads table which reload items of the table
          posteverywhere: '=' //Input of directive, posteverywhere info
        },
        link: function(scope) {
            scope.loadingMap = true;
            scope.loadData = {};
            scope.loadingLoadData = true;
            scope.loadInvoiceImgFilesList = [];
            scope.loadInvoiceDocsFilesList = [];
            scope.loadLegalImgFilesList = [];
            scope.loadLegalDocsFilesList = [];
            scope.legalDocFileSaving = false;
            scope.userDataProfile = Auth.getUserDataProfile();
            scope.userProfile = Auth.getUserProfile();
            scope.userDataGeneral = Auth.getUserData();
            scope.letApply = false;
            scope.seePrice = false;

            if(scope.userDataGeneral.carrier_apply_load_driver == 1){
              scope.letApply = true;
              scope.seePrice = true;
            }else if(scope.userDataGeneral.carrierprecie_driver == 1){
              scope.seePrice = true;
            }
            
            /**
             * Initialize
             */
            scope.initialize = function() {
                scope.loadOptions = {
                  'token': Auth.getUserToken(),
                  'load_id': scope.loadId
                };

                scope.getLoadDetails();
            };

            /* Load the map and set load coordinates */
            scope.initializeMap = function(){
              if(angular.isDefined(scope.loadData.from_lat) && scope.loadData.from_lat != "" && angular.isDefined(scope.loadData.from_long) && scope.loadData.from_long != "" && angular.isDefined(scope.loadData.to_lat) && scope.loadData.to_lat != "" && angular.isDefined(scope.loadData.to_long) && scope.loadData.to_long != ""){
                uiGmapGoogleMapApi.then(function(maps) {
                 scope.loadingMap = false;
                 scope.map = { center: { latitude: scope.loadData.from_lat, longitude: scope.loadData.from_long }, zoom: 14 };
                 scope.markers = [
                                  {id: 111, coords: { latitude: scope.loadData.from_lat, longitude: scope.loadData.from_long}, options: {} },
                                  {id: 222, coords: { latitude: scope.loadData.to_lat, longitude: scope.loadData.to_long}, options: {} }];

                 if(angular.isDefined(scope.loadData.info_truck)){
                    if(angular.isDefined(scope.loadData.info_truck.latitud_truck) && angular.isDefined(scope.loadData.info_truck.longitud_truck)){
                      scope.markers.push({id: 333, coords: {latitude: scope.loadData.info_truck.latitud_truck, longitude: scope.loadData.info_truck.longitud_truck}, options: { icon: "assets/images/common/truck-marker.png"} });
                    }
                  }
                });

                uiGmapIsReady.promise(1).then(function(maps) {
                  google.maps.event.trigger(maps, 'resize');
                });
              }
            };

            /* Get load info */
            scope.getLoadDetails =  function() {
              Loads.getLoadDetails(scope.loadOptions)
                .then(function(response){
                  scope.loadData = response.result;
                  if(angular.isDefined(scope.loadData.load_documents) && scope.loadData.load_documents.length){
                    var arr_img = '';
                    var elements_img = '';
                    for(var f_index in scope.loadData.load_documents){
                      if(scope.loadData.load_documents[f_index].type_file == 'pdf'){
                        elements_img = scope.loadData.load_documents[f_index].invoice_file.split("/");

                        if(scope.loadData.load_documents[f_index].invoice_type == 'legal_doc'){
                          scope.loadLegalDocsFilesList.push({
                            id: f_index + 1,
                            url: scope.loadData.load_documents[f_index].invoice_file, 
                            title: elements_img[elements_img.length - 1],
                            invoice_name: scope.loadData.load_documents[f_index].invoice_name
                          });
                        }else{
                          scope.loadInvoiceDocsFilesList.push({
                            id: f_index + 1,
                            url: scope.loadData.load_documents[f_index].invoice_file, 
                            title: elements_img[elements_img.length - 1],
                            invoice_name: scope.loadData.load_documents[f_index].invoice_name
                          });
                        }
                      }else{
                        arr_img = $.parseJSON('['+scope.loadData.load_documents[f_index].invoice_file+']');
                        elements_img = arr_img[0][0].normal.split("/");

                        if(scope.loadData.load_documents[f_index].invoice_type == 'legal_doc'){
                          scope.loadLegalImgFilesList.push({
                            id: f_index + 1,
                            url: arr_img[0][0].normal, 
                            invoice_name: elements_img[elements_img.length - 1],
                            title: scope.loadData.load_documents[f_index].invoice_name
                          });
                        }else{
                          scope.loadInvoiceImgFilesList.push({
                            id: f_index + 1,
                            url: arr_img[0][0].normal, 
                            invoice_name: elements_img[elements_img.length - 1],
                            title: scope.loadData.load_documents[f_index].invoice_name
                          });
                        }
                      }
                    }
                  }
                  if(angular.isDefined(scope.loadData.status_loads)){
                    var bgColorBtn = ''
                    , colorBtn = '';
                    switch(scope.loadData.status_loads){
                      case 'NOT_ASSIGNED':
                        bgColorBtn = 'bg-color-7';
                        colorBtn = 'color-armadillo';
                        break;
                      case 'ACEPTADA':
                        bgColorBtn = 'bg-color-2';
                        colorBtn = 'color-armadillo';
                        break;
                      case 'EN_TRANSITO':
                        bgColorBtn = 'bg-color-5';
                        colorBtn = 'color-armadillo';
                        break;
                      case 'ENTREGADA': 
                        bgColorBtn = 'bg-color-3';
                        colorBtn = 'color-armadillo';
                        break;
                      default:
                        bgColorBtn = 'bg-color-7';
                        colorBtn = 'color-armadillo';
                        break;
                    }

                    scope.loadData.status_load_btnbg = bgColorBtn;
                    scope.loadData.status_load_btncolor = colorBtn;
                    scope.loadData.status_load_btntext = $filter('translate')('loads:table:status:' +scope.loadData.status_loads.toLowerCase()+ ':text');
                  }
                  if(angular.isDefined(scope.loadData.type_load) && scope.loadData.type_load.length){
                    var arr_typeload = [];
                    for(var i in scope.loadData.type_load){
                      arr_typeload.push(scope.loadData.type_load[i].skill_name);
                    }
                    scope.loadData.type_load_text = arr_typeload.join(', ');
                  }else{
                    scope.loadData.type_load_text = "";
                  }
                  if(angular.isDefined(scope.loadData.skills_required_carrier) && scope.loadData.skills_required_carrier.length){
                    var arr_carrier_skills_required = [];
                    for(var i in scope.loadData.skills_required_carrier){
                      arr_carrier_skills_required.push(scope.loadData.skills_required_carrier[i].skills_required_name);
                    }
                    scope.loadData.carrier_skills_required_text = arr_carrier_skills_required.join(', ');
                  }else{
                    scope.loadData.carrier_skills_required_text = "";
                  }
                  if(angular.isDefined(scope.loadData.TipoDeCamion) && scope.loadData.TipoDeCamion.length){
                    var arr_tipo_camion = [];
                    for(var i in scope.loadData.TipoDeCamion){
                      arr_tipo_camion.push(scope.loadData.TipoDeCamion[i].name_tc);
                    }
                    scope.loadData.TipoDeCamion_text = arr_tipo_camion.join(', ');
                  }else{
                    scope.loadData.TipoDeCamion_text = "";
                  }

                  if(angular.isDefined(scope.loadData.TipoDeTrailer) && scope.loadData.TipoDeTrailer.length){
                    var arr_tipo_trailer = [];
                    for(var i in scope.loadData.TipoDeTrailer){
                      arr_tipo_trailer.push(scope.loadData.TipoDeTrailer[i].name_ti);
                    }
                    scope.loadData.TipoDeTrailer_text = arr_tipo_trailer.join(', ');
                  }else{
                    scope.loadData.TipoDeTrailer_text = "";
                  }

                  scope.loadData.price_to_show = scope.loadData.price;
                  if(scope.loadData.posteverywhere == "1" && scope.loadData.price == 0){
                    scope.loadData.price_to_show = $filter('translate')('loads:table:price:call:text');
                  }
                  scope.initializeMap();
                  scope.verifyOptionsDropdown();
                  scope.loadingLoadData = false;
                })
                .catch(function (error) {
                  scope.loadingLoadData = false;
                });
            };

            /* Call Carrier request list modal */
            scope.openCarrierRequestModal = function() {
              var modalInstance = $uibModal.open({
                controller: 'CarrierRequestsModalController as carrierrequests',
                windowClass: 'carrier-requests-modal',
                templateUrl: 'app/loads/templates/modal/carrier-requests.html',
                resolve: {
                    load: function() {
                        return scope.loadId;
                    }
                }
              });

              modalInstance.result.then(function() {
                  scope.loadingLoadData = true;
                  scope.initialize();
              });
            };

            /* Call Carrier assigned info modal */
            scope.openCarrierAssignedInfoModal = function() {
              var modalInstance = $uibModal.open({
                controller: 'CarrierAssignedInfoModalController as carrierassignedinfo',
                windowClass: 'carrier-assigned-info-modal',
                templateUrl: 'app/loads/templates/modal/carrier-assigned-info.html',
                resolve: {
                    carrier: function() {
                        return scope.loadData.carrier;
                    }
                }
              });
            };

            /* Call Load activity info modal */
            scope.openLoadActivityInfoModal = function() {
              var modalInstance = $uibModal.open({
                controller: 'LoadActivityInfoModalController as loadactivityinfo',
                windowClass: 'load-activity-info-modal',
                templateUrl: 'app/loads/templates/modal/load-activity-info.html',
                resolve: {
                    load: function() {
                        return scope.loadData;
                    }
                }
              });
            };

            /* Call Truck assigned info modal */
            scope.openTruckAssignedInfoModal = function() {
              var modalInstance = $uibModal.open({
                controller: 'TruckAssignedInfoModalController as truckassignedinfo',
                windowClass: 'truck-assigned-info-modal',
                templateUrl: 'app/loads/templates/modal/truck-assigned-info.html',
                resolve: {
                    truck: function() {
                        return scope.loadData.info_truck;
                    }
                }
              });
            };

            /* Call Truck list to assign modal */
            scope.openChooseTruckModal = function() {
              var modalInstance = $uibModal.open({
                controller: 'LoadTruckSelectModalController as loadtruckselect',
                windowClass: 'load-truck-select-modal',
                templateUrl: 'app/loads/templates/modal/load-truck-select.html',
                resolve: {
                    load: function() {
                        return scope.loadId;
                    },
                    carrier: function() {
                        return scope.loadData.carrier;
                    }
                }
              });

              modalInstance.result.then(function() {
                  scope.loadingLoadData = true;
                  scope.initialize();
              });
            };

            /* Call Report issues modal */
            scope.openReportIssuesLoadModal = function() {
              var modalInstance = $uibModal.open({
                controller: 'ReportIssuesLoadModalController as reportissuesload',
                windowClass: 'report-issues-load-modal',
                templateUrl: 'app/loads/templates/modal/report-issues-load.html',
                resolve: {
                    load: function() {
                        return scope.loadId;
                    }
                }
              });
            };

            /* Call cancel load by shipper modal */
            scope.openCancelLoadModal = function() {
              var modalInstance = $uibModal.open({
                controller: 'CancelLoadModalController as cancelload',
                windowClass: 'cancel-load-modal',
                templateUrl: 'app/loads/templates/modal/cancel-load.html',
                resolve: {
                    load: function() {
                        return scope.loadId;
                    }
                }
              });

              modalInstance.result.then(function(data) {
                if(data === true){
                  scope.reloadParent();
                }
              });
            };

            /* Call Apply to load by carrier modal */
            scope.createRequestCarrierLoad = function() {
              Loads.createRequestCarrierLoad(scope.loadOptions)
                .then(function(response){
                  if(angular.isDefined(response.request_created)){
                    if(angular.isDefined(response.request_created.idrequest_loads)){
                      scope.loadingMap = true;
                      scope.loadingLoadData = true;
                      scope.getLoadDetails();
                    }
                  }
                });
            };

            /* Call Cancel my request to apply to the load modal */
            scope.cancelRequestCarrierLoad = function() {
              Loads.cancelRequestCarrierLoad(scope.loadOptions)
                .then(function(response){
                  scope.loadingMap = true;
                  scope.loadingLoadData = true;
                  scope.getLoadDetails();
                });
            };

            /* Validate if dropdown is able to show depending on user profile*/
            scope.verifyOptionsDropdown = function() {
              scope.allowDropdown = false;
              var profile = Auth.getUserProfile();

              switch(profile){
                case 'CARRIER':
                case 'OWNER':
                  if(scope.loadData.status_loads =='ACEPTADA' || scope.loadData.status_loads =='EN_TRANSITO'){
                    scope.allowDropdown = true;
                  }
                  
                  break;
                case 'GENERADOR_CARGA':
                  if(scope.loadData.status_loads !='CANCELADA'){
                    scope.allowDropdown = true;
                  }
                  break;
              }
            };

            /* Upload images and documents to the load */
            scope.uploadLegalDoc = function(file, invalidFiles) {
                  // Upload logo image.
                  //console.log(file);
                  if (file) {
                      // Loading
                      scope.legalDocFileSaving = true;
                      var nameFile = scope.loadId+'_'+moment().milliseconds();

                      if(file.name){
                        var nameFileArr = file.name;
                        nameFileArr = nameFileArr.split(".");
                        nameFile = nameFileArr[0];
                      }

                      // Upload
                      var params = {
                          token: Auth.getUserToken(),
                          invoice_name: nameFile,
                          load_id: scope.loadId,
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
                                  scope.loadLegalDocsFilesList.push({url: response.invoice_name, name: elements_invoice[elements_invoice.length - 1]});
                                }else{
                                  elements_invoice = response.invoice_name[0].normal.split("/");
                                  scope.loadLegalImgFilesList.push({url: response.invoice_name[0].normal, name: elements_invoice[elements_invoice.length - 1]});
                                }   
                              }

                              // Loading
                              scope.legalDocFileSaving = false;
                          })
                          .catch(function(error) {
                              // Error
                              console.log(error);
                              // Loading
                              scope.legalDocFileSaving = false;
                          });
                  }
              };

            // Initialize
            scope.initialize();
        }
    };
  }
})();
