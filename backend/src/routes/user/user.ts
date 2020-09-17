import bcrypt from 'bcryptjs';
import express from 'express';
import jwt from 'jsonwebtoken';
import { authSecret } from '../../config';
import { AuthFailureResponse, NotFoundResponse, SuccessResponse } from '../../core/ApiResponse';
import User from '../../database/model/User';
import UserRepo from '../../database/repository/UserRepo';
import asyncHandler from '../../helpers/asyncHandler';
import validator from '../../helpers/validator';
import schema from "./schema";

const router = express.Router()

router.post('/login', validator(schema.getUser), asyncHandler(async (req, res, next) => {
    var user = await UserRepo.findOne(req.body.username);

    if (!user) { 
      return new NotFoundResponse('User not found', {auth: false, token: null}).send(res);
    }
      
      // check if the password is valid
      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsValid) return new AuthFailureResponse('Password is invalid', {auth: false, token: null}).send(res);
  
      // if user is found and password is valid
      // create a token
      var token = jwt.sign({ id: user._id }, authSecret, {
        expiresIn: 86400 // expires in 24 hours
      });
  
      // return the information including token as JSON
      return new SuccessResponse('Successful', { auth: true, token: token }).send(res);
})); 

router.post('/register', validator(schema.getUser), asyncHandler(async(req, res, next) => {

    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  
    const { user: createdUser } = await UserRepo.create({username: req.body.username, password: hashedPassword} as User)
    var token = jwt.sign({ id: createdUser._id }, authSecret, {
        expiresIn: 86400 // expires in 24 hours
      });
      return new SuccessResponse('Successful', { auth: true, token: token }).send(res);
  }));

export default router;