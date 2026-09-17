import { Request, Response, NextFunction } from 'express';
import { ZodType } from "zod";

type RequestSource = "body" | "query" | "params";

export const validate = (schema: ZodType, source: RequestSource = "body") => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    // Body schemas may coerce strings to numbers/dates. Query and params are
    // validated without reassignment because Express 5 exposes req.query as a getter.
    if (source === "body") req.body = result.data;
    next();
  };
};
