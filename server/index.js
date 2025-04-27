import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import db from './config/dbconfig.js';
import adminRoutes from './routes/admin.js';
import ownerRoutes from './routes/owner.js';
import testRoutres from './routes/test.js';
import dashboardRoutes from "./routes/owner.js"

import cron from 'node-cron';
import { generateRoutineTasks } from './services/taskService.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Routes
app.use('/api/auth', authRoutes); // Authentication Routes
app.use('/api/admin', adminRoutes); // Admin Routes
app.use('/api/owner', ownerRoutes); // Farm Owner Routes
app.use('/api/test', testRoutres); // Test Routes
app.use("/api", dashboardRoutes);


// Define PORT from environment variables or default to 8080
const PORT = process.env.PORT || 8080;

// Start Server
db.getConnection((err, connection) => {  // ✅ This will now work
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database as id ' + connection.threadId);
    connection.release();
});



cron.schedule('*/5 * * * *', () => {
    console.log("⏱ Running routine task generator...");
    generateRoutineTasks();
  });

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server Running on port ${PORT}`);
});
