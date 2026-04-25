import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Please define JWT_SECRET in .env.local");
}

const secret = JWT_SECRET;

export type JwtPayload = {
  userId: string;
  email: string;
  fullName: string;
};

export function signAuthToken(
  payload: JwtPayload,
  expiresIn: SignOptions["expiresIn"] = "1d"
) {
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyAuthToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    return null;
  }
}

export function getUserIdFromToken(token: string): string | null {
  const payload = verifyAuthToken(token);

  if (!payload) {
    return null;
  }

  return payload.userId;
}