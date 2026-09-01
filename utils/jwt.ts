import jwt, { type JwtPayload } from "jsonwebtoken";

type VerifyResult =
  | { success: true; data: JwtPayload }
  | { success: false; error: string };

const verifyToken = (token: string, secret: string): VerifyResult => {
  try {
    return { success: true, data: jwt.verify(token, secret) as JwtPayload };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

export const jwtUtils = { verifyToken };
