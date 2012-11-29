'use strict';

codeEditor.factory('user', function($rootScope, localStorage) {

	// get user
	var user = localStorage.user ? JSON.parse(localStorage.user) : {
		name: undefined,
		hash: undefined,
		theme: undefined
	};

	// watch user
  	$rootScope.$watch(function() { return user; }, function() {
    	localStorage.user = JSON.stringify(user);
  	}, true);


  	return user;
});
