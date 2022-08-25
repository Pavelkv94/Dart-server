const ws = require('ws');
const Message = require('../models/Message');

const wss = new ws.Server({
    port: 5050,
}, () => console.log(`WS Server started on 5050`))


wss.on('connection', function connection(ws) {
    ws.on('message', function (message) {
        message = JSON.parse(message)
        const newMessage = new Message(message)
        await newMessage.save();
        const messages = Message.find({});
        
        switch (message.event) {
            case 'message':
                broadcastMessage(message)
                break;
            case 'connection':
                broadcastMessage(messages)
                break;
        }
    })
})

function broadcastMessage(message, id) {
    wss.clients.forEach(client => {
        client.send(JSON.stringify(message))
    })
}