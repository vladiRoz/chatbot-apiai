

const ServerConsts = require('./server/ServerConsts.js');
const SocketConsts = require('./server/sockets/SocketConsts.js');
const ChatHandler = require('./server/ChatHandler');

const ChatBotManager = require('./server/chat.bot/ChatBotManager.js');
const APIAIChatBot = require('./server/chat.bot/APIAIChatBot.js');

/**
 * inject chatBot into BotManager
 */
ChatBotManager.setChatBot(new APIAIChatBot());

// express listen to connections
const app = require('express')();
const http = require('http').Server(app);
// sockets listener
const io = require('socket.io')(http);

/**
 * init chat logics
 */
new ChatHandler(io.of(SocketConsts.SOCKET_CLIENT), io.of(SocketConsts.SOCKET_SALE_EMPLOYEE));

app.get('/' + ServerConsts.HTTP_GET_USER, (req, res) => {
    res.sendFile( __dirname + "/client/" + "user.html");
});

app.get('/' + ServerConsts.HTTP_GET_SALE_EMPLOYEE, (req, res) => {
    res.sendFile( __dirname + "/client/" + "sale_employee.html");
});


http.listen(ServerConsts.SERVER_PORT, () => { console.log("server listening on localhost:1234")});