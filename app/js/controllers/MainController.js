'use strict';

codeEditor.controller('MainController', function MainController($scope, $location) {

    $scope.createNewEditor = function(){
		// redirect
		$location.path('/editor/' + randomString(6));
    };	

});
