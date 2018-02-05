const ShoppingSocket = require('./ChatSocket.js');
const SocketsConsts = require('./SocketConsts.js');

class SaleEmployeeSocketConnection extends ShoppingSocket {

    constructor(socket, chatHandler) {
        super(socket, chatHandler);
        this.isAvailable = true;
        this.servingUserSocket = -1;
    }

    getSocketInputString() {
        return SocketsConsts.SOCKET_SALE_INPUT;
    }

    onInput(msg) {
        if (this.servingUserSocket !== -1) {
            this.chatHandler.onSaleEmployeeInput(this.socket.id, this.servingUserSocket, msg);
        }
    }

    setAvailability(isAvailable){
        this.isAvailable = isAvailable
    }

    isSaleEmployeeAvailable(){
        return this.isAvailable;
    }

    getServingSocket(){
        return this.servingUserSocket;
    }

    setServiceUserSocket(socketId){
        this.servingUserSocket = socketId
    }

}

module.exports = SaleEmployeeSocketConnection;