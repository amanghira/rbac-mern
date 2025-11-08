import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["Admin", "Editor", "Viewer"], default: "Viewer" }
}, { timestamps: true });

userSchema.methods.verifyPassword = async function (pw) {
  return bcrypt.compare(pw, this.passwordHash);
};

export const User = mongoose.model("User", userSchema);
