'use strict';

var codeEditor = angular.module('codeEditor', ['ngResource']);

codeEditor.config(function($routeProvider/*, $locationProvider*/) {
  //$locationProvider.html5Mode(true);
  $routeProvider.
      when('/', {
        controller: 'MainController',
        templateUrl: 'views/main.html'
      }).
      when('/editor/:document', {
        controller: 'EditorController',
        templateUrl: 'views/editor.html'
      }).
      when('/about', {
        templateUrl: 'views/about.html'
      });
});


codeEditor.directive('codeEditor', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            
            // view -> model
            elm.bind('keyup', function() {
                scope.$apply(function() {
                    ctrl.$setViewValue(elm.html());
                });
            });
     
            // model -> view
            ctrl.render = function() {
                elm.html(ctrl.$viewValue);
            };

            // load init value from DOM
            ctrl.$setViewValue(elm.html());
        }
    };
});