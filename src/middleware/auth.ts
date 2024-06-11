import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { config } from "dotenv";

config();

const auth = async (request: Request, response: Response, next: NextFunction) => {
  const token = request.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return response.status(401).send({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || "") as { _id: string };
    const user = await User.findOne({ _id: decoded._id });
    if (!user) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    request.user = user;
    request.token = token;
    next();
  } catch (e) {
    console.log(e);
    response.status(500).json({ message: "Internal server error!" });
  }
};

export default auth;
