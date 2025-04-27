import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        // Extract and verify token
        const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);

        // Attach user details to request object
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            farmOwnerId: decoded.farmOwnerId || null,
            employeeId: decoded.employeeId || null,
            workerId: decoded.workerId || null,
        };

        next(); // Move to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

export const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 1) { // Assuming 1 is the role ID for Admin
      return res.status(403).json({ error: "Access denied. Admins only." });
  }
  next();
};

export const verifyEmployee = (req, res, next) => {
  if (req.user.role !== 2 || !req.user.employeeId) {
      return res.status(403).json({ error: "Access denied. Employees only." });
  }
  next();
};



export const verifyWorker = (req, res, next) => {
  if (req.user.role !== 3 || !req.user.workerId) {
      return res.status(403).json({ error: "Access denied. Workers only." });
  }
  next();
};
