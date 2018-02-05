/**
 * Base class for Chat bots
 */
class ChatBot {

    constructor(){

    }

    sendRequestToAgent(userId, msg){
        throw new Error('sendToAgent not implemented');
    }

    sendResponseToClient(){
        throw new Error('sendToAgent not implemented');
    }

}

module.exports = ChatBot;