const ChatBot = require('./ChatBot.js');
const ApiAi = require('apiai');

class APIAIChatBot extends ChatBot {

    constructor() {
        super();
        // this.agent = ApiAi('dcf001e05e1c4dbcbe6d7f859dc5382a');
        this.agent = ApiAi('855642509b4744d697d8c122646f1942');
    }

    sendRequestToAgent(userId, msg) {
        console.log(`User id: ${userId} sending query to agent: ${msg}`);
        return this.agent.textRequest(msg, {sessionId: userId});
    }

    sendResponseToClient(msg) {

    }

}

module.exports = APIAIChatBot;