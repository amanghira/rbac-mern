
import express from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { Post } from "../models/Post.js";

const PostSchema = z.object({
  title: z.string().min(1).max(120),
  body:  z.string().min(1).max(1000),
});

const router = express.Router();

// Public read
router.get("/", async (req, res) => {
  const posts = await Post.find({}).sort({ createdAt: -1 }).lean();
  res.json(posts.map((p) => ({ ...p, id: p._id })));
});

// Create (Admin, Editor)
router.post("/", requireAuth, async (req, res) => {
  const role = req.user.role;
  if (role !== "Admin" && role !== "Editor")
    return res.status(403).json({ error: "Forbidden" });
  try {
    const data = PostSchema.parse(req.body);
    const created = await Post.create({ ...data, authorId: req.user.id });
    res.status(201).json({ id: created._id });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});


// Update
router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const data = PostSchema.partial().parse(req.body);
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Not found" });
    const isOwner = post.authorId.toString() === req.user.id;
    if (req.user.role !== "Admin" && !isOwner) return res.status(403).json({ error: "Forbidden" });
    Object.assign(post, data);
    await post.save();
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Delete
router.delete("/:id", requireAuth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Not found" });
  const isOwner = post.authorId.toString() === req.user.id;
  if (req.user.role !== "Admin" && !isOwner) return res.status(403).json({ error: "Forbidden" });
  await Post.deleteOne({ _id: post._id });
  res.json({ ok: true });
});

export default router;
