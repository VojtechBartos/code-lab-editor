'use strict';

codeEditor.controller('EditorController', function EditorController($scope, $routeParams, socketService, user) {

	// if user is not defined, generate new hash user
	if(!user.hash)
		user.hash = randomString(6);

	// default selections
	$scope.syntax = 'text';
	$scope.theme = (!user.theme) ? 'ace/theme/github' : user.theme;

	// init editor with default theme
	var editor = ace.edit("editor");
	editor.setTheme($scope.theme);

	// init
	var inited = false;
	socketService.emit('init', { user: user, document: $routeParams.document });
	socketService.on('init', function (data) {
		editor.setValue(data.text);
		editor.getSession().setMode("ace/mode/" + data.syntax);
		
		$scope.syntax = data.syntax;
		$scope.$apply();

		inited = true;
	});

	// updates text and syntax
	socketService.on('updateText', function (data) { editor.setValue(data.text); });
	socketService.on('updateSyntax', function (syntax) {
		editor.getSession().setMode("ace/mode/" + syntax);

		$scope.syntax = syntax;
		$scope.$apply();
	});

	

	/**
	 * Watchers
	 */

	// code editor
    $scope.$watch('editor', function(){
    	if(inited == true)
			socketService.emit('updateText', {
			  	document: $routeParams.document, 
			  	text: editor.getValue()
			});
    }, true);

    // syntax selection
    $scope.$watch('syntax', function(){
    	editor.getSession().setMode("ace/mode/" + $scope.syntax);

    	if(inited == true)
    		socketService.emit('updateSyntax', { document: $routeParams.document, syntax: $scope.syntax });
    }, true);

    // local theme selection
    $scope.$watch('theme', function(){
    	editor.setTheme($scope.theme);

    	user.theme = $scope.theme;
    }, true);


});
