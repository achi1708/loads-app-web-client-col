(function() {
  'use strict';

  /* Notification list Directive
   * Dropdown with notification list */

  angular
    .module('loadsAppWeb')
    .directive('notificationList', NotificationList);

  /** @ngInject */
  function NotificationList($rootScope, Auth, Notification) {
    return {
        templateUrl: 'app/main/templates/directives/notification-list.html',
        restrict: 'E',
        replace: true,
        scope: {
          listType: '='
        },
        link: function(scope) {
            /**
             * Initialize
             */
            scope.initialize = function() {
                scope.fakeNotificationList = [];

                scope.fakeNotificationList.push({active: true, text: 'Shipper name has accepted your request ID load 203384', date: '2017-08-06 15:00:00'});
                scope.fakeNotificationList.push({active: true, text: 'Shipper name has accepted your request ID load 203384', date: '2017-08-06 15:01:00'});
                scope.fakeNotificationList.push({active: true, text: 'Shipper name has accepted your request ID load 203384', date: '2017-08-06 15:02:00'});
                scope.fakeNotificationList.push({active: false, text: 'Shipper name has accepted your request ID load 203384', date: '2017-08-03 15:03:00'});

                scope.notifOptions = {
                  'token': Auth.getUserToken(),
                  'page': 1
                };
                scope.notificationList = [];

                scope.getNotifications();
            };

            scope.getNotifications =  function() {
              Notification.getNotifications(scope.notifOptions)
                .then(function(response){
                  if(angular.isDefined(response.notif_results)){
                    scope.notificationList = response.notif_results;
                  }
                });
            };

            // Initialize
            scope.initialize();
        }
    };
  }
})();
