import express from "express";
import { createBookmark, deleteBookmark, getAllBookmark, getBookmarkById, refreshBookmark, restoreBookmark, subscribeBookmark, updateBookmark } from "../controllers/bookmark";
import { baseUrlMiddleware } from "../middleware/common";

const bookmarkRouter = express.Router();

bookmarkRouter.use(baseUrlMiddleware);

bookmarkRouter.get("/subscribe", subscribeBookmark);
bookmarkRouter.get("/", getAllBookmark);
bookmarkRouter.get("/:id", getBookmarkById);

bookmarkRouter.post("/:id/refresh", refreshBookmark);
bookmarkRouter.post("/", createBookmark);

bookmarkRouter.patch("/:id", updateBookmark);

bookmarkRouter.delete("/:id", deleteBookmark);
bookmarkRouter.post("/:id/restore", restoreBookmark);

export default bookmarkRouter;