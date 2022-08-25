const Message = require("../models/Message");

class messagesController {
    async getMessages(req, res) {
        try {
            const messages = await Message.find({});

            return res.json(messages);
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Messages service is unavailable" });
        }
    }
}

module.exports = new messagesController();
