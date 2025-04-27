import express from "express";
import { addFarm,updateFarm ,getFarms,deleteFarm,getFarmById} from "../controllers/owner/farm.js";   
import { verifyToken } from "../middlewares/auth.js";
import { verifyOwner,verifyFarmOwnership,verifyPondOwnership,
        verifyDeviceOwnership,verifyWorkerOwnership,verifyInstallationOwnership,
        verifyTaskCategoryOwnership,verifyTaskOwnership,verifyExpenseOwnership,
        verifySubscriptionOwnership } from "../middlewares/owner.js";
import { assignTask } from "../controllers/owner/task.js";
import { addPond,editPond,getPond,deletePond } from "../controllers/owner/pond.js";
import {createDevice,updateDevice,deleteDevice,getDeviceById,getDevices} from "../controllers/owner/device.js"
import {addFarmWorker,removeFarmWorkerById,getAllWorkersOfFarmOwner,
        getAllFarmWorkers,getFarmWorkerById,updateFarmWorkerById} from "../controllers/owner/worker.js"
import {createInstallation,getInstallations,getInstallationById,
        updateInstallation,deleteInstallation} from "../controllers/owner/installaton.js"
import { createTaskCategory,getAllTaskCategories,updateTaskCategory,
        deleteTaskCategory,getTaskCategoryById} from "../controllers/owner/task.js";
import { createTask,updateTask,deleteTask,getAllTasks,getTaskById,getTasksByStatus} from "../controllers/owner/task.js";
import { getAllFish,addFishStocking,deleteFishStocking,getAllFishStockings,getStockingByPond } from "../controllers/owner/fish.js";
import {createSubscription,updateSubscriptionStatus,
        changeSubscriptionPackage,cancelSubscription,getMySubscriptions} from "../controllers/owner/subscription.js";
import {createExpense,updateExpense,getExpenseHeads,getExpensesByFarm,
        deleteExpense,getAllExpenses,getExpenseById} from "../controllers/owner/expense.js";
import {getAllPonds} from "../controllers/owner/pond.js"
import {getPondsByFarm} from "../controllers/owner/pond.js"
import { updateFishStocking } from "../controllers/owner/fish.js";
import { getDashboardData } from "../controllers/owner/dashboardController.js";
const router = express.Router();

// Farm routes
router.post("/add-farm", verifyToken, verifyOwner, addFarm);
router.put("/update-farm/:farmId", verifyToken, verifyOwner, verifyFarmOwnership, updateFarm);
router.get("/get-farms", verifyToken, verifyOwner, getFarms);
router.delete("/delete-farm/:farmId", verifyToken, verifyOwner, verifyFarmOwnership, deleteFarm);
router.get("/get-farm/:farmId", verifyToken, verifyOwner, verifyFarmOwnership, getFarmById);

// Pond routes
router.post("/add-pond/:farmId", verifyToken, verifyOwner, verifyFarmOwnership, addPond);
router.put("/edit-pond/:pondId", verifyToken, verifyOwner, verifyPondOwnership, editPond);
router.get("/get-pond/:pondId", verifyToken, verifyOwner, verifyPondOwnership, getPond);
router.delete("/delete-pond/:pondId", verifyToken, verifyOwner, verifyPondOwnership, deletePond);
router.get("/get-ponds", verifyToken, verifyOwner, getAllPonds);
router.get("/get-ponds-by-farm/:farmId", verifyToken, verifyOwner, getPondsByFarm);

// Device routes
router.post("/add-device", verifyToken, verifyOwner, createDevice);
router.put("/update-device/:deviceId", verifyToken, verifyOwner, verifyDeviceOwnership, updateDevice);
router.delete("/delete-device/:deviceId", verifyToken, verifyOwner, verifyDeviceOwnership, deleteDevice);
router.get("/get-devices", verifyToken, verifyOwner, getDevices);
router.get("/get-device/:deviceId", verifyToken, verifyOwner, verifyDeviceOwnership, getDeviceById);

//Worker Routes
router.post("/add-worker",verifyToken,verifyOwner,verifyFarmOwnership,addFarmWorker);
router.delete("/remove-worker/:workerId",verifyToken,verifyOwner,verifyWorkerOwnership,removeFarmWorkerById);
router.get("/get-workers",verifyToken,verifyOwner,getAllWorkersOfFarmOwner);
router.get("/get-farm-workers/:farmId",verifyToken,verifyOwner,verifyFarmOwnership,getAllFarmWorkers);
router.get("/get-farm-worker/:workerId",verifyToken,verifyOwner,verifyWorkerOwnership,getFarmWorkerById);
router.put("/update-farm-worker/:workerId",verifyToken,verifyOwner,verifyWorkerOwnership,updateFarmWorkerById);


router.get("/dashboard", getDashboardData);

// Installation routes
router.post("/create-installation", verifyToken, verifyOwner,verifyPondOwnership,verifyDeviceOwnership, createInstallation);
router.get("/get-installations", verifyToken, verifyOwner, getInstallations);
router.get("/get-installation/:installationId", verifyToken, verifyOwner,verifyInstallationOwnership, getInstallationById);
router.put("/update-installation/:installationId", verifyToken, verifyOwner,verifyInstallationOwnership, updateInstallation);
router.delete("/delete-installation/:installationId", verifyToken, verifyOwner,verifyInstallationOwnership, deleteInstallation);
router.post("/assign-task", verifyToken, verifyOwner, assignTask);



// Task Category routes
router.post("/create-task-category", verifyToken, verifyOwner, createTaskCategory);
router.get("/get-all-task-categories", verifyToken, verifyOwner, getAllTaskCategories);    
router.put("/update-task-category/:taskCategoryId", verifyToken, verifyOwner,verifyTaskCategoryOwnership, updateTaskCategory);
router.delete("/delete-task-category/:taskCategoryId", verifyToken, verifyOwner,verifyTaskCategoryOwnership, deleteTaskCategory); 
router.get("/get-task-category/:taskCategoryId", verifyToken, verifyOwner,verifyTaskCategoryOwnership, getTaskCategoryById);


// Task routes
router.post("/create-task", verifyToken, verifyOwner, createTask);
router.put("/update-task/:taskId", verifyToken, verifyOwner,verifyTaskOwnership, updateTask);
router.delete("/delete-task/:taskId", verifyToken, verifyOwner,verifyTaskOwnership, deleteTask);
router.get("/get-all-tasks", verifyToken, verifyOwner, getAllTasks);
router.get("/get-task/:taskId", verifyToken, verifyOwner,verifyTaskOwnership, getTaskById);
router.get("/get-tasks-by-status", verifyToken, verifyOwner, getTasksByStatus);



// Fish Stocking routes 
router.post("/add-fish-stock", verifyToken, verifyOwner,verifyPondOwnership, addFishStocking); // Add fish stocking
router.get("/get-all-fish-stockings", verifyToken, verifyOwner, getAllFishStockings); // Get all fish stockings
router.get("/get-stockings-by-pond/:pondId", verifyToken, verifyOwner,verifyPondOwnership, getStockingByPond); // Get fish stocking by pond
router.delete("/delete-fish-stock/:stockId", verifyToken, verifyOwner, deleteFishStocking); // Delete fish stocking
router.get("/get-all-fish", verifyToken, verifyOwner, getAllFish); // Get all fish species
router.put("/update-fish-stock/:stockId", verifyToken, verifyOwner, updateFishStocking);



// Subscription routes (if needed in the future)
router.post("/create-subscription", verifyToken, verifyOwner, createSubscription); // Create subscription
router.get("/get-my-subscriptions", verifyToken, verifyOwner, getMySubscriptions); // Get all subscriptions for the farm owner
router.put("/update-subscription/:subscriptionId", verifyToken, verifyOwner,verifySubscriptionOwnership, updateSubscriptionStatus); // Update subscription status
router.put("/change-subscription-package/:subscriptionId", verifyToken, verifyOwner,verifySubscriptionOwnership, changeSubscriptionPackage); // Change subscription package
router.delete("/cancel-subscription/:subscriptionId", verifyToken, verifyOwner,verifySubscriptionOwnership, cancelSubscription); // Cancel subscription



// Expense routes
router.post("/create-expense", verifyToken, verifyOwner,verifyFarmOwnership, createExpense); // Create expense
router.put("/update-expense/:expenseId", verifyToken, verifyOwner,verifyExpenseOwnership, updateExpense); // Update expense
router.get("/get-expenses/:farmId", verifyToken, verifyOwner,verifyFarmOwnership, getExpensesByFarm); // Get all expenses for a specific farm
router.delete("/delete-expense/:expenseId", verifyToken, verifyOwner,verifyExpenseOwnership, deleteExpense); // Delete expense
router.get("/get-expense-heads", verifyToken, verifyOwner, getExpenseHeads); // Get all expense heads
router.get("/get-all-expenses", verifyToken, verifyOwner, getAllExpenses); // Get all expenses for the farm owner
router.get("/get-expense/:expenseId", verifyToken, verifyOwner,verifyExpenseOwnership, getExpenseById); // Get specific expense by ID


export default router;
