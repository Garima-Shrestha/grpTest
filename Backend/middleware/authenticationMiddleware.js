import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;


const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; 
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
    
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token.' });
  }
};


export const authenticateRole = (roles)=>{
  return (req, res, next) => {
    if(!roles.includes(req.user.role)){
      return res.status(403).json({error: 'Forbidden'})
    }
    next();
  }
}

export default authenticateToken;