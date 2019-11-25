(function() {
  'use strict';

  /* Profile controller
   * Get user data
   * If user is carrier, it'll get trucks info
   * Open profile edition modal
   * Change pic profile*/

  angular
    .module('loadsAppWeb')
    .controller('ProfileController', ProfileController);

  /** @ngInject */
  function ProfileController(toastr, $filter, Config, Trucks, DatatableTool, $q, Auth, uiGmapGoogleMapApi, DTOptionsBuilder, DTColumnBuilder, $sce, $uibModal, $window, $localStorage) {
	var vm = this;

    /* Function executed at strart, set vars and get trucks info  */
	  vm.initialize = function() {
      vm.profileText = Auth.getUserProfile();
      vm.myProfileData = Auth.getUserData();
      vm.specificProfileData = Auth.getUserDataProfile();
      vm.infoCompany = Auth.getUserInfoCompany();
      vm.countTrucks = 0;
      vm.infoTruck = false;
      vm.fileSaving = false;

      if(vm.profileText == 'CARRIER' || vm.profileText == 'OWNER'){
        vm.getCountTrucks();
      }/*else if(vm.profileText == 'DRIVER'){
        vm.getInfoTruck();
      }*/

      vm.infoCompanyFinal = {};
      vm.infoCompanyFinal.mc_number = "---";
      vm.infoCompanyFinal.dot_number = "---";
      vm.infoCompanyFinal.corp_number = "---";
      vm.infoCompanyFinal.address_company = "---";
      vm.infoCompanyFinal.city_company = "---";
      vm.infoCompanyFinal.state_company = "---";
      vm.infoCompanyFinal.country_company = "---";
      vm.infoCompanyFinal.phone_company = "---";
      vm.infoCompanyFinal.email_company = "---";
      if(vm.infoCompany){
        if(angular.isDefined(vm.infoCompany.mc_number)){vm.infoCompanyFinal.mc_number = vm.infoCompany.mc_number;}
        if(angular.isDefined(vm.infoCompany.dot_number)){vm.infoCompanyFinal.dot_number = vm.infoCompany.dot_number;}
        if(angular.isDefined(vm.infoCompany.corp_number)){vm.infoCompanyFinal.corp_number = vm.infoCompany.corp_number;}
        if(angular.isDefined(vm.infoCompany.address_company)){vm.infoCompanyFinal.address_company = vm.infoCompany.address_company;}
        if(angular.isDefined(vm.infoCompany.city_company)){vm.infoCompanyFinal.city_company = vm.infoCompany.city_company;}
        if(angular.isDefined(vm.infoCompany.state_company)){vm.infoCompanyFinal.state_company = vm.infoCompany.state_company;}
        if(angular.isDefined(vm.infoCompany.country_company)){vm.infoCompanyFinal.country_company = vm.infoCompany.country_company;}
        if(angular.isDefined(vm.infoCompany.phone_company)){vm.infoCompanyFinal.phone_company = vm.infoCompany.phone_company;}
        if(angular.isDefined(vm.infoCompany.email_company)){vm.infoCompanyFinal.email_company = vm.infoCompany.email_company;}
      }else{
        if(angular.isDefined(vm.specificProfileData.mc_number)){vm.infoCompanyFinal.mc_number = vm.specificProfileData.mc_number;}
        if(angular.isDefined(vm.specificProfileData.dot_number)){vm.infoCompanyFinal.dot_number = vm.specificProfileData.dot_number;}
        if(angular.isDefined(vm.specificProfileData.corp_number)){vm.infoCompanyFinal.corp_number = vm.specificProfileData.corp_number;}
        if(angular.isDefined(vm.specificProfileData.address_company)){vm.infoCompanyFinal.address_company = vm.specificProfileData.address_company;}
        if(angular.isDefined(vm.specificProfileData.city_company)){vm.infoCompanyFinal.city_company = vm.specificProfileData.city_company;}
        if(angular.isDefined(vm.specificProfileData.state_company)){vm.infoCompanyFinal.state_company = vm.specificProfileData.state_company;}
        if(angular.isDefined(vm.specificProfileData.country_company)){vm.infoCompanyFinal.country_company = vm.specificProfileData.country_company;}
        if(angular.isDefined(vm.specificProfileData.phone_company)){vm.infoCompanyFinal.phone_company = vm.specificProfileData.phone_company;}
        if(angular.isDefined(vm.specificProfileData.email_company)){vm.infoCompanyFinal.email_company = vm.specificProfileData.email_company;}
      }
    };

    /* Get trucks count if user is carrier */
    vm.getCountTrucks = function() {
      var params = {};
      params.token = Auth.getUserToken();

      Trucks.countTrucksxCarrier(params)
        .then(function(response){
          if(angular.isDefined(response.truck_total_results)){
            vm.countTrucks = response.truck_total_results;
          }
        }).catch(function(error){

        });
    };

    /*vm.getInfoTruck = function() {

    };*/

    /* Open profile edition modal */
    vm.openEditProfileModal = function() {
      var modalInstance = $uibModal.open({
        controller: 'EditProfileModalController as editprofile',
        windowClass: 'edit-profile-modal',
        templateUrl: 'app/profile/templates/modal/edit.html',
        resolve: {
            mainData: function() {
                return vm.myProfileData;
            },
            specificData: function() {
                return vm.specificProfileData;
            },
            infoCompany: function() {
                return vm.infoCompany;
            }
        }
      });

      modalInstance.result.then(function(data) {
        $window.location.reload();
      });
    };

    /* Change profile pic */
    vm.uploadImgProfile = function(file, invalidFiles) {
      if (file) {
        // Loading
        vm.fileSaving = true;

        // Upload
        var params = {
            token: Auth.getUserToken(),
            pic: file
        };
        Auth.uploadMyPic(params)
            .then(function(response) {
              console.log(response);
                // Success
                if(angular.isDefined(response.Imagen_user)){
                  var arr_img = angular.fromJson(response.Imagen_user)
                  , test = angular.copy(vm.myProfileData.img_perfil_imagenes[0]);
                  angular.extend(vm.myProfileData.img_perfil_imagenes[0], arr_img);
                  
                }
                toastr.success($filter('translate')('loads:edit:invoice:upload:successfully'));

                // Loading
                vm.fileSaving = false;
            })
            .catch(function(error) {
                // Loading
                vm.fileSaving = false;

                // Message.
                toastr.error($filter('translate')('profile:pic:upload:error'));
            });
    }
    };

    vm.initialize();
  }
})();
