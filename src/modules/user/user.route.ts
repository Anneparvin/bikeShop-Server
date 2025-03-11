import { Router } from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middleWare/validateRequest";
import { UserValidation } from "./user.validation";
import { UserRole } from "./user.constant";
import auth from "../../middleWare/auth";

const userRouter = Router();

userRouter.post("/register",
    validateRequest(UserValidation.userValidationSchema),
    UserController.registerUser);

userRouter.post("/login", 
    validateRequest(UserValidation.loginValidationSchema),
    UserController.loginUser);

 userRouter.post("/logout", 
    UserController.logoutUser);

// get All user route
 userRouter.get("/", 
    auth(UserRole.admin, UserRole.customer),
    UserController.getAllUser,
);


// get me user route
 userRouter.get("/me", 
    auth(UserRole.admin, UserRole.customer),
    UserController.getMeUser,
);

//  Update user route
userRouter.patch(
    '/:userId',
    auth(UserRole.admin, UserRole.customer),
    validateRequest(UserValidation.updateUserValidationSchema),
    UserController.updateUser,
);

// Delete user route
userRouter.delete(
    '/:id',
    auth(UserRole.admin),
    UserController.deleteUser,
);


// Password change user route
userRouter.patch(
    '/passwordchange/:userEmail',
    auth(UserRole.customer, UserRole.admin),
    validateRequest(UserValidation.passwordChangeUserValidationSchema),
    UserController.userPasswordChange,
);


 



export default userRouter;