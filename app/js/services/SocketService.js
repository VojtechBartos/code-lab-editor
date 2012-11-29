'use strict';

codeEditor.service('socketService', function SocketService() {
	return io.connect('http://localhost:5000');;
});