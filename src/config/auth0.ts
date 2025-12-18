import { auth } from "express-openid-connect";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.AUTH0_SECRET) {
  throw new Error("Missing AUTH0_SECRET environment variable");
}

export const auth0Config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET, // guaranteed to be defined now
  baseURL: process.env.BASE_URL, // convenient fallback for Vercel
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  authorizationParams: {
    response_type: "code",
    audience: process.env.AUTH0_AUDIENCE,
    scope: "openid profile email",
  },
};

export const auth0Middleware = auth(auth0Config);
