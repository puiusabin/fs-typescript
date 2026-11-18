import type { Request, Response, NextFunction } from "express";
import { NewEntrySchema, NewPatientSchema } from "./types.ts";
import { z } from "zod";

const bodyParser =
  (schema: z.ZodType) => (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error: unknown) {
      next(error);
    }
  };

export const newPatientParser = bodyParser(NewPatientSchema);
export const newEntryParser = bodyParser(NewEntrySchema);

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};
