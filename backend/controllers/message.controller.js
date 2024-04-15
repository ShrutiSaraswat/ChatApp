import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  //   console.log("message sent", req.params.id);

  try {
    const { message } = req.body;
    const { id: receiverId } = req.params; // or const id= req.params.id; // yeh humko uss url se hi mil rhi hai ( /api/messages/send/:id )
    // renamed this id as receiverId
    const senderId = req.user._id; // yeh humko protectRoute middleware se milegi

    // find a conversation where participants has a sender and a receiver
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }, // this will give us a conversation btw those users
    });

    // of there is no conversation....then first we hv to create one
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        // messages:[somthing] islye nhi kiya kyuki in conversation model we hv set it to default -> []
      });
    }

    const newMessage = new Message({
      senderId: senderId,
      receiverId: receiverId,
      message: message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id); // pushing the msg ids in messages array of conversation model
    }
    // await conversation.save();
    // await newMessage.save();

    // or

    await Promise.all([conversation.save(), newMessage.save()]); // will take comparitively lesser time as they will run parallely now

    return res.status(201).json(newMessage);
  } catch (err) {
    console.log("Error in sendMessage Controller", err.message);
    return res.status(500).json({ error: "Internal server errror" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params; // id of the user we r chatting to
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages"); // .populate nhi krte toh humko sirf conversation ki message vali array milti jismein msg ids hain
    // .populate("messages") krne se uss message array mein jo ids hain unke corresponding(to each id it contains) pura data milta hai
    //mtlb vo id jo data store krke chal rhi hai pura(vo jiss chiz ki id hai) , vo sab aa jata hai

    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages;

    res.status(200).json(messages);
  } catch (err) {
    console.log("Error in getMessage Controller", err.message);
    return res.status(500).json({ error: "Internal server errror" });
  }
};
