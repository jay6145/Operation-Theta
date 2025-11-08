import { Request, Response, NextFunction } from "express";
import { auth } from "../config/firebase";

interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
  };
}

export async function verifyAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }

  const token = authHeader.split("Bearer ")[1];
  
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Invalid token format" });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    (req as AuthenticatedRequest).user = {
      uid: decodedToken.uid,
      email: decodedToken.email || "",
    };
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}
