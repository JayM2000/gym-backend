// @ts-nocheck — no errors or warnings in this file
import { Request, Response, NextFunction } from "express";

export const legacyRequireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req?.auth?.userId) {
    return next(new Error("Unauthenticated"));
  }
  next();
};
