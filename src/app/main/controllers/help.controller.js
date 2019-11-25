(function() {
  'use strict';

  /* Help controller
   * Get each one of help topics
   * Append topic to content appointed 
   */

  angular
    .module('loadsAppWeb')
    .controller('HelpController', HelpController);

  /** @ngInject */
  function HelpController(toastr, $filter, Config, HelpServ, $window) {
	var vm = this;

  /* Function executed at strart, Determinate current site language and get each one of help texts  */
	vm.initialize = function() {
	  var lang = $window.navigator.language || $window.navigator.userLanguage;
    console.log(lang.substr(0,2)); 
	  
	  if(lang){
	  	if(lang.substr(0,2) == 'es'){
	  		vm.languageHelp = "es";
	  	}else{
	  		vm.languageHelp = "en";
	  	}
	  }else{
	  	vm.languageHelp = "en";
	  }


      vm.getTermsAndConditions();
      vm.getEula();
      vm.getPrivacyPolicy();
      vm.getFaqs();
    };

    /* Get terms and conditions */
    vm.getTermsAndConditions = function() {
    	HelpServ.getTyC(vm.languageHelp)
        .then(function(response){
          if(response.data){
          	var elem = angular.element(response.data);
          	angular.element(document.getElementById("content-terms-conditions")).append(elem);
          }
        }).catch(function(error){
        	console.log("error");
        });
    };

    /* Get Eula */
    vm.getEula = function() {
    	HelpServ.getEula(vm.languageHelp)
        .then(function(response){
          if(response.data){
          	var elem = angular.element(response.data);
          	angular.element(document.getElementById("content-eula")).append(elem);
          }
        }).catch(function(error){
        	console.log("error");
        });
    };

    /* Get Privacy Policy */
    vm.getPrivacyPolicy = function() {
    	HelpServ.getPrivacyPolicy(vm.languageHelp)
        .then(function(response){
          if(response.data){
          	var elem = angular.element(response.data);
          	angular.element(document.getElementById("content-privacy-policy")).append(elem);
          }
        }).catch(function(error){
        	console.log("error");
        });
    };

    /* Get Faqs */
    vm.getFaqs = function() {
    	HelpServ.getFaqs(vm.languageHelp)
        .then(function(response){
          if(response.data){
          	var elem = angular.element(response.data);
          	angular.element(document.getElementById("content-faqs")).append(elem);
          }
        }).catch(function(error){
        	console.log("error");
        });
    };

	vm.initialize();
  }
})();
