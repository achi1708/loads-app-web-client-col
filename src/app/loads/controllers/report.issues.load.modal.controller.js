(function() {
  'use strict';

  /* Report issues load modal controller
   * Receive load id 
   * Send form data to API
   */

  angular
    .module('loadsAppWeb')
    .controller('ReportIssuesLoadModalController', ReportIssuesLoadModalController);

  /** @ngInject */
  function ReportIssuesLoadModalController($state, load, Auth, Loads, $uibModalInstance, DatatableTool, $q, toastr, $filter) {
	  var vm = this;

    /* Function executed at strart, set form vars  */
    vm.initialize = function() {
      vm.loadId = load;
      vm.dataToSend = {};
      vm.dataToSend.token = Auth.getUserToken();
      vm.dataToSend.load_id = vm.loadId;
      vm.dataToSend.description = null;
      vm.savingReport = false;
    };

    /* Validate and send form data to API */
    vm.sendReport = function(reportIssuesLoadFormName) {
      vm.savingReport = true;
      // Validate form.
      if (reportIssuesLoadFormName.$invalid) {
          // If there was an error for required fields.
          if (reportIssuesLoadFormName.$error.required) {
              toastr.error($filter('translate')('modals:report_issues_load:form:required:fields:error'));
          } else {
              toastr.error($filter('translate')('modals:report_issues_load:form:required:fields:invalid'));
          }
          vm.savingReport = false;
          return;
      }

      var defer = $q.defer();

      Loads.reportIssueToLoad(vm.dataToSend)
          .then(function (response) {
                  toastr.success($filter('translate')('modals:report_issues_load:form:success'));
                  vm.closePopup();
              }, function (error) {
                  toastr.error($filter('translate')('modals:report_issues_load:form:required:fields:invalid'));
              });

      vm.savingReport = false;
    };

    /* Close popup */
    vm.closePopup = function() {
        $uibModalInstance.close();
    };

    vm.initialize();
    
  }
})();
