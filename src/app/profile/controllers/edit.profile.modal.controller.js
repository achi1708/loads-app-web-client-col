(function() {
  'use strict';

  /* Profile edition modal controller
   * Get user data
   * Set form var with user info
   * Validate and send form to API to update profile
   * Validate form by steps*/

  angular
    .module('loadsAppWeb')
    .controller('EditProfileModalController', EditProfileModalController);

  /** @ngInject */
  function EditProfileModalController($state, mainData, specificData, infoCompany, Auth, Trucks, Loads, $uibModalInstance, DatatableTool, $q, toastr, $filter) {
	  var vm = this;

    /* Function executed at strart, get user data and set form vars  */
    vm.initialize = function() {
      vm.mainData = mainData;
      vm.specificData = specificData;
      vm.infoCompany = infoCompany;
      vm.profileEdit = null;
      if(angular.isDefined(vm.mainData.user_profile)){
        if(angular.isDefined(vm.mainData.user_profile[0])){
          vm.profileEdit = vm.mainData.user_profile[0].profile_name;
        }
      }

      vm.formsToValidate = [{form: 'basic_info', validated: false, subtitle: ''},
                {form: 'company_info', validated: false, subtitle: '2'}];
                //{form: 'insurance_info', validated: false, subtitle: '3'}];
      vm.validateForm = vm.formsToValidate[0].form;
      vm.validateFormIndex = 0;
      vm.subtitleForm = vm.formsToValidate[0].subtitle;

      vm.typeDocumentOptions = [
                             {id: null, name: $filter('translate')('form:default:select:null_option')},
                             {id: 'CC', name: $filter('translate')('sign_up:form:type_document:cc:label')},
                             {id: 'NIT', name: $filter('translate')('sign_up:form:type_document:nit:label')},
                             {id: 'Pasaporte', name: $filter('translate')('sign_up:form:type_document:pas:label')},
                             {id: 'CE', name: $filter('translate')('sign_up:form:type_document:ce:label')},
                             {id: 'NUIP', name: $filter('translate')('sign_up:form:type_document:nuip:label')}
                            ];

      vm.optionsGoogleInputCity = {
          types: ['(cities)']
      };

      vm.getItemsSizeLengthLoads();

      vm.dataUser = {};
      vm.dataUser.token = Auth.getUserToken();

      //contact information
      vm.dataUser.user_first_name = (angular.isDefined(vm.mainData.user_first_name)) ? vm.mainData.user_first_name : null;
      vm.dataUser.user_last_name = (angular.isDefined(vm.mainData.user_last_name)) ? vm.mainData.user_last_name : null;
      vm.dataUser.user_phone = (angular.isDefined(vm.mainData.user_phone)) ? vm.mainData.user_phone : null;
      vm.dataUser.user_email = (angular.isDefined(vm.mainData.user_email)) ? vm.mainData.user_email : null;  
      vm.dataUser.user_new_password = null;

      //company information
      vm.dataUser.type_document = (angular.isDefined(vm.mainData.type_document)) ? vm.mainData.type_document : null;
      vm.dataUser.type_document_number = (angular.isDefined(vm.mainData.type_document_number)) ? vm.mainData.type_document_number : null;
      //driver and owner
      vm.dataUser.type_truck = (angular.isDefined(vm.specificData.type_truck)) ? vm.specificData.type_truck.toString() : null;
      vm.dataUser.truck_skill = (angular.isDefined(vm.specificData.truck_skill)) ? vm.specificData.truck_skill.toString() : null;
      vm.dataUser.placa = (angular.isDefined(vm.specificData.placa)) ? vm.specificData.placa : null;

      if(vm.infoCompany){
        vm.dataUser.company_name = (angular.isDefined(vm.infoCompany.company_name)) ? vm.infoCompany.company_name : null;
        vm.dataUser.city_company = (angular.isDefined(vm.infoCompany.city_company)) ? vm.infoCompany.city_company : null;
        vm.dataUser.state_company = (angular.isDefined(vm.infoCompany.state_company)) ? vm.infoCompany.state_company : null;
        vm.dataUser.country_company = (angular.isDefined(vm.infoCompany.country_company)) ? vm.infoCompany.country_company : null;
        vm.dataUser.phone_company = (angular.isDefined(vm.infoCompany.phone_company)) ? vm.infoCompany.phone_company : null;
        vm.dataUser.email_company = (angular.isDefined(vm.infoCompany.email_company)) ? vm.infoCompany.email_company : null;
        vm.dataUser.address_company = (angular.isDefined(vm.infoCompany.address_company)) ? vm.infoCompany.address_company : null;
        vm.dataUser.mc_number = (angular.isDefined(vm.infoCompany.mc_number)) ? vm.infoCompany.mc_number : null;
        vm.dataUser.dot_number = (angular.isDefined(vm.infoCompany.dot_number)) ? vm.infoCompany.dot_number : null;
        vm.dataUser.ein_number = (angular.isDefined(vm.mainData.user_ein_ssn)) ? vm.mainData.user_ein_ssn : null;
        vm.dataUser.corp_number = (angular.isDefined(vm.mainData.corp_number)) ? vm.mainData.corp_number : null;
      }else{
        vm.dataUser.company_name = (angular.isDefined(vm.specificData.company_name)) ? vm.specificData.company_name : null;
        vm.dataUser.city_company = (angular.isDefined(vm.specificData.city_company)) ? vm.specificData.city_company : null;
        vm.dataUser.state_company = (angular.isDefined(vm.specificData.state_company)) ? vm.specificData.state_company : null;
        vm.dataUser.country_company = (angular.isDefined(vm.specificData.country_company)) ? vm.specificData.country_company : null;
        vm.dataUser.phone_company = (angular.isDefined(vm.specificData.phone_company)) ? vm.specificData.phone_company : null;
        vm.dataUser.email_company = (angular.isDefined(vm.specificData.email_company)) ? vm.specificData.email_company : null;
        vm.dataUser.address_company = (angular.isDefined(vm.specificData.address_company)) ? vm.specificData.address_company : null;
        vm.dataUser.mc_number = (angular.isDefined(vm.specificData.mc_number)) ? vm.specificData.mc_number : null;
        vm.dataUser.dot_number = (angular.isDefined(vm.specificData.dot_number)) ? vm.specificData.dot_number : null;
        vm.dataUser.ein_number = (angular.isDefined(vm.mainData.user_ein_ssn)) ? vm.mainData.user_ein_ssn : null;
        vm.dataUser.corp_number = (angular.isDefined(vm.mainData.corp_number)) ? vm.mainData.corp_number : null;
      }

      //insurance information
      vm.dataUser.bond_insurance_num_policy = (angular.isDefined(vm.specificData.bond_insurance_policy_num)) ? vm.specificData.bond_insurance_policy_num : null;
      vm.dataUser.bond_insurance_comp = (angular.isDefined(vm.specificData.bond_insurance_comp)) ? vm.specificData.bond_insurance_comp : null;
      vm.dataUser.bond_insurance_num = (angular.isDefined(vm.mainData.bond_insurance_num)) ? vm.mainData.bond_insurance_num : null;
      vm.dataUser.name_bank = (angular.isDefined(vm.mainData.name_bank)) ? vm.mainData.name_bank : null;
      vm.dataUser.number_account_bank = (angular.isDefined(vm.mainData.number_account_bank)) ? vm.mainData.number_account_bank : null;

      vm.companyCitySelect = (angular.isDefined(vm.specificData.city_company)) ? vm.specificData.city_company : null;
      vm.companyStateSelect = (angular.isDefined(vm.specificData.state_company)) ? vm.specificData.state_company : null;
      vm.companyCountrySelect = (angular.isDefined(vm.specificData.country_company)) ? vm.specificData.country_company : null;
    };

    /* Get load attributes */
    vm.getItemsSizeLengthLoads = function() {
      vm.itemsSizeLenLoads = {};
      Loads.getItemsSizeLengthLoads()
        .then(function(response){
          if(response){
            vm.itemsSizeLenLoads = response;
            if(angular.isDefined(vm.itemsSizeLenLoads.TipoDeCamion_list)){
                vm.setTruckTypesList();
            }

            if(angular.isDefined(vm.itemsSizeLenLoads.TipoDeTrailer_list)){
                vm.setTruckSkillsList();
            }
          }
        }); 
    };

    /* Set truck types list as local var */
    vm.setTruckTypesList = function() {
      vm.truckTypesList = [{id: null, name: $filter('translate')('form:default:select:null_option')}];
      if(vm.itemsSizeLenLoads.TipoDeCamion_list.length){
        for(var i in vm.itemsSizeLenLoads.TipoDeCamion_list){
          vm.truckTypesList.push({id: vm.itemsSizeLenLoads.TipoDeCamion_list[i].idtipo_de_camion, name: vm.itemsSizeLenLoads.TipoDeCamion_list[i].name_tc});
        }
      }
    };

    /* Set truck skills list as local var */
    vm.setTruckSkillsList = function() {
      vm.truckSkillsList = [{id: null, name: $filter('translate')('form:default:select:null_option')}];
      if(vm.itemsSizeLenLoads.TipoDeTrailer_list.length){
        for(var i in vm.itemsSizeLenLoads.TipoDeTrailer_list){
          vm.truckSkillsList.push({id: vm.itemsSizeLenLoads.TipoDeTrailer_list[i].id, name: vm.itemsSizeLenLoads.TipoDeTrailer_list[i].name_ti});
        }
      }
    };

    vm.autoCompleteStateCountry = function() {
        if(angular.isDefined(vm.companyCitySelect.address_components)) {
            for(var i in vm.companyCitySelect.address_components){
                if(vm.companyCitySelect.address_components[i].types.indexOf('administrative_area_level_1') != -1){
                    vm.companyStateSelect = vm.companyCitySelect.address_components[i].long_name;
                    console.log(vm.companyStateSelect);
                }

                if(vm.companyCitySelect.address_components[i].types.indexOf('country') != -1){
                    vm.companyCountrySelect = vm.companyCitySelect.address_components[i].long_name;
                    console.log(vm.companyCountrySelect);
                }
            }
        }
    };

    /* close modal */
    vm.closePopup = function(data_return) {
        $uibModalInstance.close(data_return);
    };

    /* Validate form by steps and update profile  */
    vm.validateEdit = function(userForm) {
    // Validate form.
        if (userForm.$invalid) {
            // If there was an error for required fields.
            if (userForm.$error.required) {
                toastr.error($filter('translate')('sign_up:form:required:fields:error'));
            } else {
                toastr.error($filter('translate')('sign_up:form:required:fields:invalid'));
            }
            return;
        }

        if(userForm.$name == 'editProfileFormName'){

          if(vm.dataUser.user_new_password != null){
            if(vm.dataUser.user_new_password.length > 0){
              var validationPassword = true;

              if(vm.dataUser.user_new_password.length < 8){
                  console.log("longitud");
                  validationPassword = false;                
              }

              if(!vm.dataUser.user_new_password.match(/[a-z]/g)){
                  console.log("lowercase");
                  validationPassword = false;                
              }

              if(!vm.dataUser.user_new_password.match(/[A-Z]/g)){
                  console.log("uppercase");
                  validationPassword = false;                
              }

              if(!vm.dataUser.user_new_password.match(/[0-9]/g)){
                  console.log("numbers");
                  validationPassword = false;                
              }

              if(!vm.dataUser.user_new_password.match(/[@$,<>#:?_*&;]/g)){
                  console.log("especial");
                  validationPassword = false;                
              }

              if(validationPassword !== true){
                  toastr.error($filter('translate')('sign_up:form:password:formar:error'));
                  return;
              }
            }
          }
        }
        else if(userForm.$name == 'editProfileFormName2'){
            if(vm.profileEdit == 'CARRIER'){
                if(!vm.dataUser.mc_number && !vm.dataUser.dot_number){
                    toastr.error($filter('translate')('sign_up:form:required:fields:error'));
                    return;
                }
            }
        }

        vm.formsToValidate[vm.validateFormIndex].validated = true;

        var moreValidateForm = true
        , indexform = 0;


        while(moreValidateForm){
          if(indexform <= vm.validateFormIndex){
            indexform++;
          }else{
            if(angular.isDefined(vm.formsToValidate[indexform])){
              if(vm.profileEdit == 'GENERADOR_CARGA' && indexform == 2){
                  vm.updateProfile();
              }else{
                vm.validateForm = vm.formsToValidate[indexform].form;
                vm.validateFormIndex = indexform;
                vm.subtitleForm = vm.formsToValidate[indexform].subtitle;
              }
            }else{
              vm.updateProfile();
            }
            moreValidateForm = false;
          }
        }
  };

  /* Send data to API and show response  */
  vm.updateProfile = function() {
    var user_new_password = vm.dataUser.user_new_password;
    if(vm.dataUser.user_new_password != null && vm.dataUseruser_new_password != ''){
      vm.dataUser.user_password = CryptoJS.SHA1(vm.dataUser.user_new_password.toString()).toString();
      delete vm.dataUser.user_new_password;
    }

    if(vm.profileEdit != 'GENERADOR_CARGA'){
      if(typeof vm.companyCitySelect != typeof vm.dataUser.city_company){
        vm.dataUser.city_company = (angular.isDefined(vm.companyCitySelect.name) ? vm.companyCitySelect.name : vm.companyCitySelect.formatted_address);  
      }

      if(typeof vm.companyStateSelect != typeof vm.dataUser.state_company){
        vm.dataUser.state_company = (angular.isDefined(vm.companyStateSelect.name) ? vm.companyStateSelect.name : vm.companyStateSelect.formatted_address);  
      }

      if(typeof vm.companyCountrySelect != typeof vm.dataUser.country_company){
        vm.dataUser.country_company = (angular.isDefined(vm.companyCountrySelect.name) ? vm.companyCountrySelect.name : vm.companyCountrySelect.formatted_address);  
      }
    }

    Auth.updateProfile(vm.dataUser)
        .then(function(response) {
          if(angular.isDefined(response.status) && response.status != 'error'){
                toastr.error($filter('translate')('profile:edit:success'));
                vm.closePopup(vm.dataUser);
            }else{
              if(response.message == "user_exist"){
                toastr.error($filter('translate')('sign_up:form:error:user_exists'));
              }else{
                vm.dataUser.user_new_password = user_new_password;
                toastr.error($filter('translate')('profile:edit:error'));
              }
            }
        })
        .catch(function(error) {
            vm.dataUser.user_new_password = user_new_password;
            toastr.error($filter('translate')('profile:edit:error'));
        });
  };

  /* Come back in each step of the form  */
  vm.comeBackForm = function () {
      if(vm.validateFormIndex > 0){
          if(angular.isDefined(vm.formsToValidate[vm.validateFormIndex - 1])){
              vm.validateFormIndex = vm.validateFormIndex - 1;
              vm.validateForm = vm.formsToValidate[vm.validateFormIndex].form;
              vm.subtitleForm = vm.formsToValidate[vm.validateFormIndex].subtitle;
          }
      }
  };

    vm.initialize();
    
  }
})();
