import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { User } from "../models/User.js";

export async function requireAuth(req, res, next) {
  const auth = req.header("Authorization");
  if (!auth) return res.status(401).json({ error: "Missing Authorization" });
  try {
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;
    const payload = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(payload.sub).lean();
    if (!user) return res.status(401).json({ error: "Invalid user" });
    req.user = { id: user._id.toString(), role: user.role, email: user.email };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
