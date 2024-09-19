import express from "express";
import { Server } from "socket.io";
import http from "http";
import { getUserDetailsFromToken } from "../utils/getUserDetailsFromToken";
import { UserModel } from "../models/UserModel";
import { ConversationModel, MessageModel } from "../models/ConversationModel";
import { getConversation } from "../utils/getConversation";

export const app = express();

/**
 * socket connection
 */

export const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

// online user
// const onlineUser = new Set();

io.on("connection", async (socket) => {
  console.log("connect User", socket.id);

  const token = socket.handshake.auth.token;

  const user = await getUserDetailsFromToken(token);

  socket.join(user?._id.toString());
  // onlineUser.add(user?._id)
  socket.on("message-page", async (userId) => {
    const userDetails = await UserModel.findById(userId).select("-password");
    const payload = {
      _id: userDetails?._id,
      name: userDetails?.name,
      email: userDetails?.email,
      profilePicture: userDetails?.profilePicture,
    };
    socket.emit("message-user", payload);

    // get previous message
    const getConversationMessage = await ConversationModel.findOne({
      $or: [
        { sender: user?._id, receiver: userId },
        { sender: userId, receiver: user?._id },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    socket.emit("message", getConversationMessage?.messages || []);
  });

  // new messages

  socket.on("new-message", async (data: any) => {
    console.log("new message", data);

    // check if the conversation is available between both users
    let conversation = await ConversationModel.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data.sender },
      ],
    });

    if (!conversation) {
      const createConversation = await new ConversationModel({
        sender: data?.sender,
        receiver: data?.receiver,
      });
      // Await the save() operation to get the saved conversation
      conversation = await createConversation.save();
    }

    const message = await new MessageModel({
      text: data.text,
      imageUrl: data.imageUrl,
      videoUrl: data.videoUrl,
      msgByUserId: data?.msgByUserId,
    });

    const saveMessage = await message.save();

    const updateConversation = await ConversationModel.updateOne(
      { _id: conversation?._id },
      {
        $push: { messages: saveMessage?._id },
      }
    );

    const getConversationMessage = await ConversationModel.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data.sender },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    // console.log("getConversation" , getConversationMessage);

    io.to(data?.sender).emit("message", getConversationMessage?.messages || []);
    io.to(data?.receiver).emit(
      "message",
      getConversationMessage?.messages || []
    );

    // to send conversation in sidebar
    const conversationSender = await getConversation(data?.sender);
    const conversationReceiver = await getConversation(data?.receiver);

    io.to(data?.sender).emit("conversation", conversationSender);
    io.to(data?.receiver).emit("conversation", conversationReceiver);

    // Now `conversation` is the actual document, you can access `.toJSON()` or `.json()`
  });

  // sidebar

  socket.on("sidebar", async (currentUserId: any) => {
    const conversation = await getConversation(currentUserId);
    socket.emit("conversation", conversation);
  });

  socket.on("seen", async (msgByUserId) => {
    let conversation = await ConversationModel.findOne({
     $or: [
        { sender: user?._id, receiver: msgByUserId },
        { sender: msgByUserId, receiver: user?._id },
      ],
    });

    const conversationMessageId = conversation?.messages || [];
    console.log("conversationMessageId", conversationMessageId);
    

    // update seen message in database 
    const updateMessages = await MessageModel.updateMany(
      { _id: { $in: conversationMessageId }, msgByUserId : msgByUserId },
      { $set : { seen: true } }
    );

    console.log("updatedMessage" , updateMessages);
    
    // send conversation
    const conversationSender = await getConversation(user?._id.toString());
    const conversationReceiver = await getConversation(msgByUserId);

    io.to(user?._id?.toString()).emit('conversation', conversationSender)
    io.to(msgByUserId).emit('conversation', conversationReceiver)

  });

  // disconnect
  socket.on("disconnect", () => {
    // onlineUser.delete(user?._id)
    console.log("disconnect user", socket.id);
  });
});
