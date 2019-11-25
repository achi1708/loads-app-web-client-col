(function() {
  'use strict';

  /* Enter action Directive
   * Allow to do something from enter action in forms */

  angular
    .module('loadsAppWeb')
    .directive('ngEnter', NgEnter);

  /** @ngInject */
  function NgEnter($state, $stateParams) {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngEnter, {'event': event});
                });

                event.preventDefault();
            }
        });
    };
  }
})();
