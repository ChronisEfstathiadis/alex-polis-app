import { requireAuth } from "@clerk/express";

export const requireAuthDev = () => {
  if (process.env.NODE_ENV === "production") {
    return requireAuth();
  }

  return (req, res, next) => {
    if (req.headers.authorization) {
      return requireAuth()(req, res, next);
    }
    const testUser = req.headers["x-test-user"];

    if (testUser) {
      req.auth = { userId: testUser };
      return next();
    }

    return res.status(401).json({ error: "No token or test header provided" });
  };
};
