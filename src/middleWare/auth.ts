import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import User from "../modules/user/user.model";
import BlacklistedToken from "../modules/user/blacklistedToken.model";

const auth = (...requiredRoles: string[]) => {
    return catchAsync(async(req:Request, res:Response, next:NextFunction)=> {
        const token = req.headers.authorization;

         // checking if the token is missing
         if(!token){
            throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
         }

          // Check if token is blacklisted
      const isBlacklisted = await BlacklistedToken.findOne({ token });
      if (isBlacklisted) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Token is invalid or expired!");
      }


          // checking if the given token is valid
          const decoded = jwt.verify(
            token,
            config.jwt_access_secret as string
          ) as JwtPayload;

          const {role, email, iat} = decoded;

         // checking if the user is exist
         const user = await User.findOne({email});

         if(!user){
            throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");  
         }
         
         
         // Check if the user has the required role
       if(requiredRoles && !requiredRoles.includes(role)) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            "You are not authorized  hi!"  
        );
       } 

       req.user = user;
       next();
    });
}

export default auth;