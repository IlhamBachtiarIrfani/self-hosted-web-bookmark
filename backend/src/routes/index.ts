import express from "express";
import bookmarkRouter from "./bookmark";

const router = express.Router();

router.use('/bookmark', bookmarkRouter);

export default router;