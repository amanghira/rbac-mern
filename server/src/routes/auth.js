import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { User } from "../models/User.js";
import { config } from "../config.js";
import { requireAuth } from "../middleware/auth.js";
import { can } from "../middleware/authorize.js";

const router = express.Router();

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await user.verifyPassword(password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ sub: user._id.toString(), role: user.role }, config.jwtSecret, { expiresIn: "2h" });
    res.json({ token, role: user.role, email: user.email });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Dev-only: seed users
router.post("/seed", async (req, res) => {
  const existing = await User.findOne({ email: "admin@demo.io" });
  if (existing) return res.json({ message: "Already seeded" });
  const mk = async (email, role) => {
    const passwordHash = await bcrypt.hash("Passw0rd!", 10);
    return User.create({ email, role, passwordHash });
  };
  await Promise.all([
    mk("admin@demo.io","Admin"),
    mk("editor@demo.io","Editor"),
    mk("viewer@demo.io","Viewer")
  ]);
  res.json({ message: "Seeded users with Passw0rd!" });
});

// Admin can change roles (UI not included; endpoint provided)
router.post("/admin/users/:id/role", requireAuth, can("users:role:update"), async (req, res) => {
  const { role } = req.body;
  if (!["Admin","Editor","Viewer"].includes(role)) return res.status(400).json({ error: "Invalid role" });
  await User.findByIdAndUpdate(req.params.id, { role });
  res.json({ ok: true });
});

export default router;
