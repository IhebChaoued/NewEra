import express from "express";
import upload from "../../middlewares/uploadMiddleware";
import { registerUser, loginUser } from "../controllers/userController";

const router = express.Router();

/**
 * @route   POST /api/user/register
 * @desc    Register new user (candidate)
 */
router.post("/register", upload.single("cv"), registerUser);

/**
 * @route   POST /api/user/login
 * @desc    User login
 */
router.post("/login", loginUser);

export default router;
