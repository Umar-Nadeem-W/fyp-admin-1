import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import db from './config/dbconfig.js';

// Routes
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import ownerRoutes from './routes/owner.js';
import employeeRoutes from './routes/employee.js';
import testRoutes from './routes/test.js';
import dashboardRoutes from './routes/owner.js';
import admindashboardRoutes from './routes/admin.js';
import packageRoutes from './routes/admin.js';
import stripeRoutes from './routes/stripe.js';
import employeeDashboardRoutes from "./routes/employee.js";
import workerRoutes from "./routes/worker.js";

// Services
import { generateRoutineTasks } from './services/taskService.js';

// Load environment variables
dotenv.config();

const app = express();

// CORS middleware
app.use(cors());

// IMPORTANT: Parse JSON for regular routes but NOT for Stripe webhook
// Standard middleware - DON'T apply this to webhook routes
app.use((req, res, next) => {
  if (req.originalUrl === '/api/stripe/webhook') {
    // Skip bodyParser for webhook route
    next();
  } else {
    // Apply JSON bodyParser for all other routes
    express.json({ limit: '50mb' })(req, res, next);
  }
});

// Mount all API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/test', testRoutes);
app.use('/api/employee', employeeRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", admindashboardRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api", employeeDashboardRoutes);
app.use("/api/worker", workerRoutes);
// Stripe routes including webhook - must come LAST
app.use("/api/stripe", stripeRoutes);

// Connect to MySQL
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error connecting to database:', err.stack);
        return;
    }
    console.log('✅ Connected to MySQL as ID', connection.threadId);
    connection.release();
});

// CRON task
cron.schedule('*/5 * * * *', () => {
    console.log("⏱ Running routine task generator...");
    generateRoutineTasks();
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});