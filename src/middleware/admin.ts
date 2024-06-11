import { Request, Response, NextFunction } from "express";

const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return res.status(403).send({ error: "Access denied." });
  }
  next();
};

export default adminAuth;
