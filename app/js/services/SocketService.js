'use strict';

codeEditor.service('socketService', function SocketService() {
	return io.connect(window.location.hostname);
});