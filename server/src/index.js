import { correlationId } from '../middleware.correlation.js'
import { limiter } from '../middleware.rateLimit.js'
import { validate, schemas } from '../middleware.validate.js'
import adminRouterFactory from '../routes.admin.js'
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./db.js";
import { config } from "./config.js";
import authRoutes from "./routes/auth.js";
import postsRoutes from "./routes/posts.js";
import { requireAuth } from './middleware/auth.js';
import { User } from './models/User.js';



export const requireRole = (role) => (req, res, next) =>
  (req.user?.role === role) ? next() : res.status(403).json({ error: 'Forbidden' });


const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(correlationId)   // adds x-correlation-id + JSON request logs
app.use(limiter)         // 100 req / 5 min per IP

app.get("/api/health", (req,res)=> res.json({ok:true}));
app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use('/api/admin', requireAuth, adminRouterFactory({ User, requireRole }));


connectDB().then(() => {
  app.listen(config.port, () => {
    console.log(`[server] http://0.0.0.0:${config.port}`);
  });
});
