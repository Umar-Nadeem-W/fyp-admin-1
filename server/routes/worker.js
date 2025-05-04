// routes/worker.js
import express from 'express';
import { getWorkerPonds } from '../controllers/worker/workerpondController.js';
import { getWorkerDevices } from '../controllers/worker/workerdevice.js';
import {
    getTasksForWorker,
    markTaskAsCompleted
  } from "../controllers/worker/workertaskController.js";
import {verifyToken} from '../middlewares/auth.js';
import { getFishStockForWorker } from "../controllers/worker/workerfishstockcontroller.js";
import { getWorkerDashboardData } from "../controllers/worker/workerdashboardController.js";
const router = express.Router();

router.get("/dashboard", verifyToken, getWorkerDashboardData);
router.get("/worker/fish-stock", verifyToken, getFishStockForWorker);
router.get('/ponds', verifyToken, getWorkerPonds);

router.get("/worker/:u_id", verifyToken, getWorkerDevices); 

router.get("/worker", getTasksForWorker);
router.patch("/mark-completed/:taskId", markTaskAsCompleted);

export default router;
