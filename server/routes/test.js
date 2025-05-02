import express from 'express';
import { verifyToken } from '../middlewares/auth.js';
import { verifyOwner } from '../middlewares/owner.js';
import { generateRoutineTasks } from '../services/taskService.js';


const router = express.Router();

router.get('/generate-routine-tasks', verifyToken, verifyOwner, async (req, res) => {
console.log("Routine tsaks test...............");
await generateRoutineTasks();

});


export default router;