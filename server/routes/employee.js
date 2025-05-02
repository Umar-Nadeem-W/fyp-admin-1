import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { verifyEmployee } from "../middlewares/employee.js";
import { verifyFarmAccess } from "../middlewares/employee.js";
import { getFarms, getFarmById } from "../controllers/employee/farm.js";
import { getAllPackages } from "../controllers/employee/packagesController.js";
const router = express.Router();

router.get('/get-farms', verifyToken, getFarms);
router.get("/get-farm/:farmId", verifyToken, verifyEmployee, verifyFarmAccess, getFarmById);
router.get("/packages", verifyToken, getAllPackages);

export default router;