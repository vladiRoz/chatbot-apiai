/**
 * single entry point for communication with chat bots
 */
class ChatBotManager{

    static setChatBot(chatBot){
        this.chatBot = chatBot
    }

    static sendRequestToChatBot(userId, msg){
        const request = this.chatBot.sendRequestToAgent(userId, msg);
        const promise = new Promise((resolve, reject) => {
            request.on('response', resolve);
            request.on('error', reject);
        });
        request.end();
        return promise;
    }
}

module.exports = ChatBotManager;