import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRoutes from "./routes/user.route";
import teamRoutes from "./routes/team.route";
import adminRoutes from "./routes/admin.route";
import { config } from "dotenv";
import session from "express-session";
import RedisStore from "connect-redis";
import { createClient } from "redis";

config();

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI || "");
const redisClient = createClient({ url: process.env.REDIS_URL || "redis://localhost:6379" });
redisClient.connect().catch(console.error);

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.APP_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(bodyParser.json());
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/team", teamRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
