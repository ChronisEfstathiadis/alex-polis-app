import { ZodError } from "zod";
import type { ZodSchema, ZodIssue } from "zod";
import type { Request, Response, NextFunction } from "express";

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue: ZodIssue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        return res.status(400).json({
          error: "Validation failed",
          details: errorMessages,
        });
      }

      return res.status(500).json({
        error: "Internal server error",
      });
    }
  };
};
