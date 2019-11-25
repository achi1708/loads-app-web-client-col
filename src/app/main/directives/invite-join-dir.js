(function() {
  'use strict';

  /* Invite to join dropdown Directive
   * Dropdown that is at header */

  angular
    .module('loadsAppWeb')
    .directive('inviteJoin', InviteJoin);

  /** @ngInject */
  function InviteJoin($rootScope, Auth, $filter, Config, toastr) {
    return {
        templateUrl: 'app/main/templates/directives/invite-join.html',
        restrict: 'E',
        replace: true,
        scope: {
          type: '='
        },
        link: function(scope) {
            /**
             * Initialize
             */
            scope.initialize = function() {
              scope.dataSend = {}
              scope.dataSend.emailsString = '';
            };

            scope.sendMailInvitation = function(inviteJoinFormName){
              if (inviteJoinFormName.$invalid) {
                  // If there was an error for required fields.
                  if (inviteJoinFormName.$error.required) {
                      toastr.error($filter('translate')('header:invite_join:form:required:fields:error'));
                  } else {
                      toastr.error($filter('translate')('header:invite_join:form:required:fields:invalid'));
                  }
                  return;
              }
              var subject = $filter('translate')('header:invite_join:mail:send:subject')
              , body = $filter('translate')('header:invite_join:mail:send:body') + " " + Config.ENV.INVITE_JOIN_MAIL_BODY_URL;
              window.location.href="mailto:"+scope.dataSend.emailsString+"?subject="+subject+"&body="+body;
            };

            scope.shareFacebook = function() {
              FB.ui({
                method: 'share',
                href: Config.ENV.INVITE_JOIN_MAIL_BODY_URL,
                quote: $filter('translate')('header:invite_join:mail:send:body') + " " + Config.ENV.INVITE_JOIN_MAIL_BODY_URL
              }, function(response){});
            };

            scope.shareTwitter = function() {
              var title = $filter('translate')('header:invite_join:mail:send:subject')
              , body = $filter('translate')('header:invite_join:mail:send:body') + " " + Config.ENV.INVITE_JOIN_MAIL_BODY_URL;
              window.open('http://twitter.com/share?url='+Config.ENV.INVITE_JOIN_MAIL_BODY_URL+'&text='+body, '', 'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
            };


            // Initialize
            scope.initialize();
        }
    };
  }
})();
