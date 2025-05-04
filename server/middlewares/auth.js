import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Access denied. Invalid token format." });
    }

    const token = authHeader.split(' ')[1]; // Extract token after Bearer

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            farmOwnerId: decoded.farmOwnerId || null,
            employeeId: decoded.employeeId || null,
            workerId: decoded.workerId || null,
        };

        next(); // Token is valid, proceed
    } catch (error) {
        console.error(error);
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