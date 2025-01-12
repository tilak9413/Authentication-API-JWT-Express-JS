import users from "../model/user.js";
import jwt from "jsonwebtoken";

const checkUserAuth = async (req, res, next) => {
  let token
  const { authorization } = req.headers
  if (authorization && authorization.startsWith('Bearer')) {
    try {

      token = authorization.split(' ')[1]

 
      const { userID } = jwt.verify(token, process.env.SCRATE)

      console.log(userID)
      req.user = await users.findById(userID).select('-password')

      next()
    } catch (error) {
      console.log(error)
      res.status(401).send({ "status": "failed", "message": "Unauthorized User" })
    }
  }
  if (!token) {
    res.status(401).send({ "status": "failed", "message": "Unauthorized User, No Token" })
  }
};

export default checkUserAuth;
