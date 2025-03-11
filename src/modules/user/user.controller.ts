import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import { UserService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

// register user
const registerUser = catchAsync(async (req: Request, res: Response) => {
const data = await UserService.registerUserFromDB(req.body);

sendResponse(res,{
    statusCode:httpStatus.CREATED,
    message: "User Registered successfully",
    data,
});
});


// login user
const loginUser = catchAsync(async (req: Request, res: Response) => {
    const data = await UserService.loginUserFromDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.ACCEPTED,
        message: "User Logged in successfully",
        data,
    });
});

// logout user
const logoutUser = catchAsync(async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1]; 
    const data = await UserService.logoutUserFromDB(token as string);

    sendResponse(res, {
        statusCode: httpStatus.ACCEPTED,
        // success:true,
        message: "User Logged out successfully",
        data,
    });


 });

// get all user
const getAllUser = catchAsync(async (req: Request, res: Response) => {
   const result = await UserService.getAllUserFromDB(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        // success:true,
        message: "AllUser get successfully",
        data: result,
    });


 });

//  get me as user
const getMeUser = catchAsync(async (req: Request, res: Response) => {
    const userEmail = req.user?.userEmail

    const result = await UserService.getMeUserFromDB(userEmail);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        // success:true,
        message: "User get successfully",
        data: result,
    });
});


//  Update user
const updateUser = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;

    const result = await UserService.updateUserIntoDB(userId, req.body);


    sendResponse(res, {
        statusCode: httpStatus.OK,
        // success:true,
        message: "User is updated successfully",
        data: result,
    });
});


//  delete user
const deleteUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await UserService.deleteUserFromDB(id);
    console.log(id);


    sendResponse(res, {
        statusCode: httpStatus.OK,
        // success:true,
        message: "User is deleted successfully",
        data: result,
    });
});

// Password Changes User
const userPasswordChange = catchAsync(async (req, res) => {

    const userEmail = req.user?.userEmail;
    
    const result = await UserService.userPasswordChangeIntoDB(userEmail, req.body );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'User password changes succesfully',
        data: result,
    });
});



  

export const UserController = {
    registerUser,
    loginUser,
    logoutUser,
    getAllUser,
    updateUser,
    deleteUser,
    getMeUser,
    userPasswordChange
  };