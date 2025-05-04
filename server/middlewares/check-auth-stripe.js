const jwt = require('jsonwebtoken');
 
 module.exports = async (req, res, next) => {
   let token;
   //console.log(req.query.token);
 
   // Check if token is present in the query parameter
   if (req.query.token) {
     try {
       token = req.query.token;
 
       if (!token) {
         res.status(401).json({ message: 'Not authorized, no token' });
         return;
       }
 
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       req.user = decoded; // Attach decoded user info to the request object
       next();
     } catch (error) {
       console.error('Token verification error:', error);
       res.status(401).json({ message: 'Not authorized, token failed' });
     }
   } else {
     res.status(401).json({ message: 'Not authorized, no token in query' });
   }
 };