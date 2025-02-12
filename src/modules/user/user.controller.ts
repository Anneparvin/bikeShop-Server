import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import { UserService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const registerUser = catchAsync(async (req: Request, res: Response) => {
const data = await UserService.registerUser(req.body);

sendResponse(res,{
    statusCode:httpStatus.CREATED,
    message: "User Registered successfully",
    data,
});
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const data = await UserService.loginUser(req.body);

    sendResponse(res, {
        statusCode: httpStatus.ACCEPTED,
        message: "User Logged in successfully",
        data,
    });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1]; 
    const data = await UserService.logoutUser(token as string);

    sendResponse(res, {
        statusCode: httpStatus.ACCEPTED,
        message: "User Logged out successfully",
        data,
    });


});
  

export const UserController = {
    registerUser,
    loginUser,
    logoutUser,
  };