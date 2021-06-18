const { JWT_SECRET } = require('../secrets/index')
const jwt = require('jsonwebtoken')
const {findBy} = require('../auth/auth-model')

const restricted = (req, res, next) => {
  const token = req.headers.token
  if (!token) {
    return next({ status: 401, message: 'token required'})
  }
  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      next({ status: 401, message: 'token invalid'})
    }
    else {
      req.decodedToken = decodedToken
      next()
    }
  })
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};
const checkUsernameFree = async (req, res, next) => {
 try {
  const [user] = await findBy({username: req.body.username})
  if (user) {
    next({ status: 422, message: 'username taken'})
  } 
  else {
    req.user = user
    next()
  }
 }
 catch (err) {
  next(err)
 }
}

const checkBodyValidation = (req,res,next) => {
  if (!req.body.username || !req.body.password) {
      next({ status: 422, message: "username and password required" })
  }else{
    next()
}
}

const checkUsernameExists = async (req, res, next) => {
 try {
  const [user] = await findBy({username: req.body.username})
  if (!user) {
    next({ status: 401, message: 'invalid credentials'})
  } 
  else {
    req.user = user
    next()
  }
 }
 catch (err) {
  next(err)
 }
}


module.exports = {
  restricted,
  checkUsernameFree,
  checkBodyValidation,
  checkUsernameExists
}