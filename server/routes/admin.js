import express from "express";
import { approveEmployee,addEmployee,updateEmployee,getAllEmployees,getEmployeeById,getEmployeeByUserId,deleteEmployee } from "../controllers/admin/employee.js";
import { verifyToken, verifyAdmin } from "../middlewares/auth.js";
import {getAllUsers,deleteUser,getUserById,updateUser,addUser,} from "../controllers/admin/user.js"
import { getAllPackages, getPackageById, createPackage, updatePackage,deletePackage } from "../controllers/admin/package.js";
import {getAllFarms,getFarmById,createFarm,updateFarm,deleteFarm,changeFarmStatus,getFarmsByOwnerId} from "../controllers/admin/farm.js";
const router = express.Router();



//user routes
router.get("/users", verifyToken, verifyAdmin, getAllUsers);
router.delete("/users/:userId", verifyToken, verifyAdmin, deleteUser);
router.get("/users/:userId", verifyToken, verifyAdmin, getUserById);
router.put("/users/:userId", verifyToken, verifyAdmin, updateUser);
router.post("/users", verifyToken, verifyAdmin, addUser);




//employee routes
router.get("/employees", verifyToken, verifyAdmin, getAllEmployees);
router.get("/employees/:employeeId", verifyToken, verifyAdmin, getEmployeeById);
router.get("/employees/user/:userId", verifyToken, verifyAdmin, getEmployeeByUserId);
router.post("/employees", verifyToken, verifyAdmin, addEmployee);
router.put("/employees/:employeeId", verifyToken, verifyAdmin, updateEmployee);
router.delete("/employees/:employeeId", verifyToken, verifyAdmin, deleteEmployee);
router.put("/approve-employee/:employeeId", verifyToken, verifyAdmin, approveEmployee);



//package routes
router.get("/packages", verifyToken, verifyAdmin, getAllPackages);
router.get("/packages/:packageId", verifyToken, verifyAdmin, getPackageById);
router.post("/packages", verifyToken, verifyAdmin, createPackage);
router.put("/packages/:packageId", verifyToken, verifyAdmin, updatePackage);
router.delete("/packages/:packageId", verifyToken, verifyAdmin, deletePackage);


//farm routes
router.get("/farms", verifyToken, verifyAdmin, getAllFarms);
router.get("/farms/:farmId", verifyToken, verifyAdmin, getFarmById);
router.post("/farms", verifyToken, verifyAdmin, createFarm);
router.put("/farms/:farmId", verifyToken, verifyAdmin, updateFarm);
router.delete("/farms/:farmId", verifyToken, verifyAdmin, deleteFarm);
router.put("/farms/status/:farmId", verifyToken, verifyAdmin, changeFarmStatus);
router.get("/farms/owner/:ownerId", verifyToken, verifyAdmin, getFarmsByOwnerId);


export default router;
