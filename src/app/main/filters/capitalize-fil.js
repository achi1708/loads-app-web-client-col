(function() {
  'use strict';

  /* Capitalize function */

  angular
    .module('loadsAppWeb')
    .filter('capitalize', Capitalize);

  /** @ngInject */
  function Capitalize() {
    return function(input) {
        return (input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
  }
})();
