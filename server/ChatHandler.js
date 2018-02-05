const SocketConsts = require('./sockets/SocketConsts');
const UserSocketConnection = require('./sockets/UserSocketConnection');
const SaleEmployeeSocketConnection = require('./sockets/SaleEmployeeSocketConnection');
const ChatBotManager = require('./chat.bot/ChatBotManager');
const waitUntil = require('wait-until');
require('../StringFormat');


/**
 * Chat Business logics
 */
class ChatHandler {

    constructor(userSocket, saleSocket) {
        this.userSocket = userSocket;
        this.saleSocket = saleSocket;

        // better to have a wrapper
        this.userSockets = new Map();
        this.saleSockets = new Map();

        this.connectionsMappings = new Map();

        this.initUserSockets(this.userSocket, this.onUserConnection.bind(this), this.onUserDisconnect.bind(this));
        this.initUserSockets(this.saleSocket, this.onSaleEmployeeConnect.bind(this), this.onSaleEmployeeDisconnect.bind(this));
    }

    /**
     * init for user and sale employee sockets
     * @param i_Socket
     * @param connectFunc
     * @param disconnectFunc
     */
    initUserSockets(i_Socket, connectFunc, disconnectFunc) {
        i_Socket.on(SocketConsts.SOCKET_CONNECTION, (socket) => {
            connectFunc(socket);

            socket.on(SocketConsts.SOCKET_DISCONNECT, () => {
                disconnectFunc(socket)
            });
        })
    }

    /**
     * callback for UserSocketConnection
     * Business logics of to whom to send the msg will be placed here
     * @param userId
     * @param msg
     */
    onUsertQuery(userId, msg) {

        const userMode = this.userSockets.get(userId);
        if (userMode.getMode() === SocketConsts.MODE_AGENT) {

            ChatBotManager.sendRequestToChatBot(userId, msg)
                .then((response) => {

                    if (response.result.action === SocketConsts.ACTION_INPUT_UNKNOWN) {
                        this.onSwitchToOperator(userId, response)
                    } else {
                        const speech = response.result.fulfillment.speech;
                        this.userSockets.get(userId).emit(SocketConsts.SOCKET_USER_INPUT, speech)
                    }

                }).catch(error => {
                console.log("agent error: " + error)
            })
        } else {
            let saleSocket = this.saleSockets.get(this.connectionsMappings.get(userId));
            saleSocket.emit(SocketConsts.SOCKET_SALE_INPUT, msg);
        }
    }

    /**
     * callback for SaleEmployeeSocketConnection input to user
     * @param saleSocketId
     * @param userId
     * @param msg
     */
    onSaleEmployeeInput(saleSocketId, userId, msg) {
        this.userSockets.get(userId).emit(SocketConsts.SOCKET_USER_INPUT, msg);
    }

    /**
     * swtich user to sale employee
     * @param userId
     * @param response
     */
    onSwitchToOperator(userId, response) {

        console.log("need to switch to operator");

        let userSocket = this.userSockets.get(userId);
        userSocket.emit(SocketConsts.SOCKET_USER_INPUT, SocketConsts.PLEASE_WAIT);

        let availableSaleEmployee = false;

        /**
         * looking for the next available sale employee
         */
        this.saleSockets.forEach((saleSocket, saleSocketId) => {

            if (saleSocket.isSaleEmployeeAvailable()) {
                availableSaleEmployee = true;
                this.connectionsMappings.set(userId, saleSocketId);
                userSocket.setMode(SocketConsts.MODE_SALE_EMPLOYEE);
                saleSocket.setServiceUserSocket(userId);

                const saleMsg = SocketConsts.SALE_EMPLOYEE_CONNECTED.format(userId);
                saleSocket.emit(SocketConsts.SOCKET_SALE_INPUT, saleMsg);

                const userMsg = SocketConsts.SALE_EMPLOYEE_GREETING.format(saleSocketId);
                this.userSockets.get(userId).emit(SocketConsts.SOCKET_USER_INPUT, userMsg);
                saleSocket.setAvailability(false);
            }
        });

        if (!availableSaleEmployee){
            userSocket.emit(SocketConsts.SOCKET_USER_INPUT, SocketConsts.NO_AVAILABLE_SALE);
        }
    }

    onSaleEmployeeConnect(socket) {
        console.log("new sale employee connected id: " + socket.id);
        this.saleSockets.set(socket.id, new SaleEmployeeSocketConnection(socket, this));
    }

    onSaleEmployeeDisconnect(socket) {
        console.log("sale employee disconnected id: ", socket.id);
        this.saleSockets.delete(socket.id)
    }

    onUserConnection(socket) {
        console.log("new user connected id: " + socket.id);
        this.userSockets.set(socket.id, new UserSocketConnection(socket, this));
    }

    onUserDisconnect(socket) {
        console.log("user disconnected id: ", socket.id);
        this.userSockets.delete(socket.id);
        this.connectionsMappings.delete(socket.id);
    }

    getUserSocketInputString() {
        return SocketConsts.SOCKET_USER_INPUT
    }


}

module.exports = ChatHandler;