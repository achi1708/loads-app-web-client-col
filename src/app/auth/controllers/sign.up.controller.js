(function() {
  'use strict';

  /* Sign up controller
   * Prepare form depending of profile choosed
   * Validate form
   * Send data to API and show successful message or any wrong*/

  angular
    .module('loadsAppWeb')
    .controller('SignUpController', SignUpController);

  /** @ngInject */
  function SignUpController($filter, toastr, $state, Config, Auth, Loads) {
	var vm = this;

    /* Function executed at start
     * Prepare the steps of the form
     * set form vars and configuration of profile select
     * Configuration of location fields
     */
	vm.initialize = function() {

		vm.formsToValidate = [{form: 'basic_info', validated: false, subtitle: ''},
							  {form: 'company_info', validated: false, subtitle: '2'}];
							  //{form: 'insurance_info', validated: false, subtitle: '3'}];
		vm.validateForm = vm.formsToValidate[0].form;
		vm.validateFormIndex = 0;
		vm.subtitleForm = vm.formsToValidate[0].subtitle;

        vm.companyCitySelect = null;
        vm.companyStateSelect = null;
        vm.companyCountrySelect = null;
		
		vm.newUser = {};
		vm.newUser.profile = null;

		//contact information
		vm.newUser.user_first_name = null;
		vm.newUser.user_last_name = null;
		vm.newUser.user_phone = null;
		vm.newUser.user_email = null;
		vm.newUser.user_password = null;

		//company information
		vm.newUser.company_name = null;
		vm.newUser.city_company = null;
		vm.newUser.state_company = null;
        vm.newUser.country_company = null;
		vm.newUser.phone_company = null;
		vm.newUser.email_company = null;
		vm.newUser.address_company = null;
        vm.newUser.type_document = null;
        vm.newUser.type_document_number = null;
        vm.newUser.mc_number = null;
        vm.newUser.dot_number = null;
        vm.newUser.tyc = {name: 'tyc', checked: false};

        //campos nuevos para driver
        vm.newUser.name_company = null;
        vm.newUser.type_document_company = null;
        vm.newUser.number_type_document_company = null;
        vm.newUser.type_truck = null;
        vm.newUser.truck_skill = null;
        vm.newUser.placa = null;
        vm.newUser.plate = null;
        vm.newUser.department_company = null;

		//insurance information
		vm.newUser.bond_insurance_num_policy = null;
		vm.newUser.bond_insurance_comp = null;
		vm.newUser.bond_insurance_num = null;
        vm.newUser.name_bank = null;
        vm.newUser.number_account_bank = null;

		vm.profileOptions = [
							 {id: null, name: $filter('translate')('form:default:select:null_option')},
							 {id: 'CARRIER', name: $filter('translate')('header:profile:carrier:title')},
							 {id: 'GENERADOR_CARGA', name: $filter('translate')('header:profile:generador_carga:title')},
                             {id: 'OWNER', name: $filter('translate')('header:profile:owner:title')},
                             {id: 'DRIVER', name: $filter('translate')('header:profile:driver:title')}
							];

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

        vm.showTrailerPlate = false;

        vm.getItemsSizeLengthLoads();
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
            var trailerPlateReq = 0;
            if(vm.itemsSizeLenLoads.TipoDeCamion_list[i].is_plate_required_for_trailer == true){
                trailerPlateReq = 1;
            }
          vm.truckTypesList.push({id: vm.itemsSizeLenLoads.TipoDeCamion_list[i].idtipo_de_camion, name: vm.itemsSizeLenLoads.TipoDeCamion_list[i].name_tc, trailerPlate: trailerPlateReq});
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

    /* Catch up info about country, state and city selected */
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

    /* Send data to API and do sign up process */
	vm.doSignUp = function() {
		vm.newUser.user_password = CryptoJS.SHA1(vm.newUser.user_password.toString()).toString();

        vm.newUser.city_company = (angular.isDefined(vm.companyCitySelect.name) ? vm.companyCitySelect.name : vm.companyCitySelect.formatted_address);
        vm.newUser.state_company = (angular.isDefined(vm.companyStateSelect.name) ? vm.companyStateSelect.name : vm.companyStateSelect.formatted_address);
        vm.newUser.department_company = (angular.isDefined(vm.companyStateSelect.name) ? vm.companyStateSelect.name : vm.companyStateSelect.formatted_address);
        vm.newUser.country_company = (angular.isDefined(vm.companyCountrySelect.name) ? vm.companyCountrySelect.name : vm.companyCountrySelect.formatted_address);

        if(vm.newUser.profile == 'DRIVER'){
            vm.newUser.driver_data_app = 'CO';
        }else{
            if(angular.isDefined(vm.newUser.driver_data_app)){
                delete vm.newUser.driver_data_app;
            }
        }

		Auth.doSignUp(vm.newUser)
                .then(function(response) {
                	if(angular.isDefined(response.status) && response.status != 'error'){
                        toastr.success($filter('translate')('sign_up:form:success'));
                        $state.go('public.login');
                    }else{
                        if(response.message == "user_exist"){
                            toastr.error($filter('translate')('sign_up:form:error:user_exists'));
                        }else{
                            toastr.error($filter('translate')('sign_up:form:error'));
                        }
                    }
                })
                .catch(function(error) {
                    toastr.error($filter('translate')('sign_up:form:error'));
                });
	};

    /* Validate all step of form and allow to send the data to above function to send data to API */
	vm.validateSignup = function(userForm) {
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

        if(userForm.$name == 'signupFormName'){
            var validationPassword = true;

            if(vm.newUser.user_password.length < 8){
                console.log("longitud");
                validationPassword = false;                
            }

            if(!vm.newUser.user_password.match(/[a-z]/g)){
                console.log("lowercase");
                validationPassword = false;                
            }

            if(!vm.newUser.user_password.match(/[A-Z]/g)){
                console.log("uppercase");
                validationPassword = false;                
            }

            if(!vm.newUser.user_password.match(/[0-9]/g)){
                console.log("numbers");
                validationPassword = false;                
            }

            if(!vm.newUser.user_password.match(/[@$,<>#:?_*&;]/g)){
                console.log("especial");
                validationPassword = false;                
            }

            if(validationPassword !== true){
                toastr.error($filter('translate')('sign_up:form:password:formar:error'));
                return;
            }
        }
        //Validations of step 2
        else if(userForm.$name == 'signupFormName2'){
            if(vm.newUser.profile == 'CARRIER'){
                if(!vm.newUser.mc_number || !vm.newUser.dot_number){
                    toastr.error($filter('translate')('sign_up:form:required:fields:error'));
                    return;
                }

                /*if(!vm.newUser.ein_number && !vm.newUser.corp_number){
                    toastr.error($filter('translate')('sign_up:form:required:fields:error'));
                    return;
                }*/
            }

            if(vm.newUser.profile == 'GENERADOR_CARGA'){
                /*if(!vm.newUser.ein_number && !vm.newUser.corp_number){
                    toastr.error($filter('translate')('sign_up:form:required:fields:error'));
                    return;
                }*/
            }

            if(!vm.newUser.tyc.checked){
                toastr.error($filter('translate')('sign_up:form:required:fields:error_tyc'));
                return;
            }
        }

        //Validations of step 3
        /*if(userForm.$name == 'signupFormName3'){
            if(vm.newUser.profile == 'CARRIER' || vm.newUser.profile == 'OWNER'){
                if(!vm.newUser.bond_insurance_num_policy || !vm.newUser.bond_insurance_comp || !vm.newUser.bond_insurance_num){
                    toastr.error($filter('translate')('sign_up:form:required:fields:error'));
                    return;
                }
            }
        }*/

        vm.formsToValidate[vm.validateFormIndex].validated = true;

        var moreValidateForm = true
        , indexform = 0;

        //Cycle allow continuing to next step or do signup
        while(moreValidateForm){
        	if(indexform <= vm.validateFormIndex){
        		indexform++;
        	}else{
        		if(angular.isDefined(vm.formsToValidate[indexform])){
                    if(vm.newUser.profile == 'GENERADOR_CARGA' && indexform == 2){
                        vm.doSignUp();
                    }else{
                        vm.validateForm = vm.formsToValidate[indexform].form;
                        vm.validateFormIndex = indexform;
                        vm.subtitleForm = vm.formsToValidate[indexform].subtitle;
                    }
        		}else{
        			vm.doSignUp();
        		}
        		moreValidateForm = false;
        	}
        }
	};

    // Come back in step of form
    vm.comeBackForm = function () {
        if(vm.validateFormIndex > 0){
            if(angular.isDefined(vm.formsToValidate[vm.validateFormIndex - 1])){
                vm.validateFormIndex = vm.validateFormIndex - 1;
                vm.validateForm = vm.formsToValidate[vm.validateFormIndex].form;
                vm.subtitleForm = vm.formsToValidate[vm.validateFormIndex].subtitle;
            }
        }
    };

    // Function to redirect to login page
    vm.goToLogin = function () {
        $state.go('public.login');
    };

    // Function to verify if a truck need a second plate
    vm.trailerPlateVerify = function(){
        if(vm.newUser.type_truck != null && vm.newUser.type_truck != ""){
            if(vm.itemsSizeLenLoads.TipoDeCamion_list.length){
                var showTrailerPlate = false;
                for(var i in vm.itemsSizeLenLoads.TipoDeCamion_list){
                    if(vm.newUser.type_truck == vm.itemsSizeLenLoads.TipoDeCamion_list[i].idtipo_de_camion && vm.itemsSizeLenLoads.TipoDeCamion_list[i].is_plate_required_for_trailer == true){
                        showTrailerPlate = true;
                    }
                }

                vm.showTrailerPlate = showTrailerPlate;
            }
        }        
    }

    //Call of function which is executed at start
	vm.initialize();
  }
})();
