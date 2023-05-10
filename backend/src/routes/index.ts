import express from "express";
import bookmarksRouter from "./bookmarks";

const router = express.Router();

router.use('/bookmarks', bookmarksRouter);

export default router;