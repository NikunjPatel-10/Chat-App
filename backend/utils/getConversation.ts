import { ConversationModel } from "../models/ConversationModel";

export async function getConversation(currentUserId: any) {
  if (currentUserId) {
    const currentUserConversation = await ConversationModel.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    })
      .sort({ updatedAt: -1 })
      .populate("messages")
      .populate("sender")
      .populate("receiver");
    const conversation = currentUserConversation.map((conv: any) => {
        
      const countUnseenMsg = conv?.messages?.reduce((prev: any, curr: any) => {
        const msgByUserId = curr?.msgByUserId?.toString();
        if (msgByUserId !== currentUserId) {
          return prev + (curr?.seen ? 0 : 1);
        } else {
          return prev;
        }
      }, 0);

      return {
        _id: conv?._id,
        sender: conv?.sender,
        receiver: conv?.receiver,
        unseenMsg: countUnseenMsg,
        lastMsg: conv.messages[conv?.messages?.length - 1],
      };
    });
    return conversation;
    // socket.emit('conversation', conversation)
  } else {
    return [];
  }
}
