import { Router } from "express";
import { HTTP_STATUSES } from "../../types/enums";
import { db } from "../../db/database";

export const testingRouter = Router();

testingRouter.delete("/all-data", async (req, res) => {
  await db.dropDatabase();
  res.sendStatus(HTTP_STATUSES.NO_CONTENT);
});
