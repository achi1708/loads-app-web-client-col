(function() {
  'use strict';

  /* Header Directive
   * Left panel where is main menu */

  angular
    .module('loadsAppWeb')
    .directive('appHeader', AppHeader);

  /** @ngInject */
  function AppHeader($rootScope, Auth, $state, $uibModal, Notification, $timeout) {
    return {
        templateUrl: 'app/main/templates/directives/app-header.html',
        restrict: 'E',
        replace: true,
        scope: {},
        link: function(scope) {
            /**
             * Initialize
             */
            scope.initialize = function() {
                scope.notificationTypeList = "widget";
                scope.profile = Auth.getUserProfile();
                scope.user = Auth.getUserData();
                scope.userDataProfile = Auth.getUserDataProfile();
                scope.notificationsCount = '';

                if(scope.profile){
                  scope.profile = scope.profile.toLowerCase();
                }
                //scope.appTitle = angular.copy($rootScope.appTitle);

                scope.getInfoNotifications();
            };

            /* Get notification list and set new notifications count */
            scope.getInfoNotifications =  function() {
              scope.notifOptions = {
                'token': Auth.getUserToken(),
                'page': 1
              };

              Notification.getNotifications(scope.notifOptions)
                .then(function(response){
                  if(angular.isDefined(response.notif_total_results)){
                    if(response.notif_total_results > 0){
                      var countNotifAux = 0;
                      scope.notificationsCount = '';
                      for(var i in response.notif_results){
                        if(response.notif_results[i].is_read == 'N'){
                          countNotifAux++;
                        }
                      }
                      
                      scope.notificationsCount = (countNotifAux > 0) ? countNotifAux : '';
                    }
                  }
                });
            };

            /* Logout option */
            scope.logout = function() {
              Auth.logout();
              $state.go('public.login');
            };

            /* Call carrier searching modal */
            scope.openSearchCarriersModal = function() {
              var modalInstance = $uibModal.open({
                controller: 'SearchCarrierModalController as searchcarrier',
                windowClass: 'search-carrier-modal',
                templateUrl: 'app/main/templates/modal/search-carrier.html'
              });
            };

            /* Call loads searching modal */
            scope.openSearchLoadsModal = function() {
              var modalInstance = $uibModal.open({
                controller: 'SearchLoadModalController as searchload',
                windowClass: 'search-load-modal',
                templateUrl: 'app/main/templates/modal/search-load.html'
              });
            };

            /* Redirect to profile page */
            scope.goToProfile = function(){
              $state.go('private.my_profile');
            };

            /* Set new notifications as read */
            scope.setReadNotifications = function(){
              if(!angular.element('#notify-header-item-dropdown').hasClass('show')){
                $timeout(function () {
                  var params = {};
                  params.token = Auth.getUserToken();
                  Notification.setReadNotifications(params)
                    .then(function(response){
                      scope.getInfoNotifications();
                    });
                }, 2000);
              }
            }

            // Initialize
            scope.initialize();
        }
    };
  }
})();
