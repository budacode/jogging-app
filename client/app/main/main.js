'use strict';

angular.module('joggingApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  });

angular.module('joggingApp')
  .filter('dateRange', function() {
    return function(items, from, to) {
      var result = [];

      for (var i = 0; i < items.length; i++) {
        var dateObject = new Date(items[i].date);
        var fromDateObject = new Date(from);
        var toDateObject = new Date(to);

        var validFrom = true;
        var validTo = true;
        if (from !== undefined && fromDateObject.getTime() > dateObject.getTime()) {
          validFrom = false;
        }
        if (to !== undefined && toDateObject.getTime() < dateObject.getTime()) {
          validTo = false;
        }
        if (validFrom && validTo) {
          result.push(items[i]);
        }
      }
      return result;
    };
  });
