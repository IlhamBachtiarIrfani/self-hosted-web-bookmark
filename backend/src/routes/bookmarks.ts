import express from "express";
import { createBookmark, getAllBookmark } from "../controllers/bookmark";
import { baseUrlMiddleware } from "../middleware/common";

const bookmarkRouter = express.Router();

bookmarkRouter.use(baseUrlMiddleware);
bookmarkRouter.get("/", getAllBookmark);
bookmarkRouter.post("/", createBookmark);

export default bookmarkRouter;