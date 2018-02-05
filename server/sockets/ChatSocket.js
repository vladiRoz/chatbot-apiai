/**
 * Representation for socket connection to chat
 * can be user, sale employee, supervisor
 */
class ChatSocket {

    constructor(iosocket, chatHandler) {
        this.socket = iosocket;
        this.chatHandler = chatHandler;

        this.socket.on(this.getSocketInputString(), (message) => {
            this.onInput(message)
        });
    }

    getSocketInputString() {
        throw new Error('getSocketInputString function was not implemented')
    }

    onInput(msg) {
        throw new Error('onInput function was not implemented')
    }

    emit(action, msg){
        this.socket.emit(action, msg);
    }

    getSocket(){
        return this.socket;
    }

}

module.exports = ChatSocket;