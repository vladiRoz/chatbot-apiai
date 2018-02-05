const ShoppingSocket = require('./ChatSocket.js');
const SocketsConsts = require('./SocketConsts.js');

class UserSocketConnection extends ShoppingSocket {

    constructor(socket, chatHandler) {
        super(socket, chatHandler);
        this.mode = SocketsConsts.MODE_AGENT;
    }

    getSocketInputString() {
        return SocketsConsts.SOCKET_USER_INPUT;
    }

    onInput(msg) {
        this.chatHandler.onUsertQuery(this.socket.id, msg);
    }

    setMode(mode){
        this.mode = mode
    }

    getMode(){
        return this.mode
    }


}

module.exports = UserSocketConnection;