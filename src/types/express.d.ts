import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string;
        email: string;
        name: string;
        picture?: string;
        [key: string]: any;
      };
    }
  }
}

declare module "express-serve-static-core" {
  interface Request {
    oidc: {
      isAuthenticated: () => boolean;
      user?: {
        sub: string;
        email: string;
        name: string;
        picture?: string;
        [key: string]: any;
      };
      login: (options?: any) => void;
      logout: (options?: any) => void;
    };
  }
}
