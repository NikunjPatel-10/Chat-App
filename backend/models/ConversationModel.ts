import { model, Schema } from "mongoose";

const messageSchema = new Schema(
  {
    text: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      default: "",
    },
    seen: {
      type: Boolean,
      default: false,
    },
    msgByUserId: {
      type: Schema.ObjectId,
      required: true,
      ref: "Users",
    },
  },
  {
    timestamps: true,
  }
);

const conversationSchema = new Schema(
  {
    sender: {
      type: Schema.ObjectId,
      required: true,
      ref: "Users",
    },
    receiver: {
      type: Schema.ObjectId,
      required: true,
      ref: "Users",
    },
    messages: [
      {
        type: Schema.ObjectId,
        ref: "Message",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const MessageModel = model<any>("Message", messageSchema);
export const ConversationModel = model<any>("Conversation", conversationSchema);
