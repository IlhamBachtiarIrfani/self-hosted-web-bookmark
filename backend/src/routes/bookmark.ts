import express from "express";
import { createBookmark, getAllBookmark, subscribeBookmark } from "../controllers/bookmark";
import { baseUrlMiddleware } from "../middleware/common";

const bookmarkRouter = express.Router();

bookmarkRouter.use(baseUrlMiddleware);
bookmarkRouter.get("/", getAllBookmark);
bookmarkRouter.get("/subscribe", subscribeBookmark);
bookmarkRouter.post("/", createBookmark);

export default bookmarkRouter;