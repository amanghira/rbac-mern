import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

postSchema.index({ authorId: 1, createdAt: -1 });

export const Post = mongoose.model("Post", postSchema);
