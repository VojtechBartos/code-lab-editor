'use strict';

codeEditor.service('socketService', function SocketService() {
	return io.connect('http://:5000');;
});