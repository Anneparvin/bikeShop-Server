import AppError from "../../errors/AppError";
import BlacklistedToken from "./blacklistedToken.model";
import { TUser } from "./user.interface";
import User from "./user.model";
 import jwt from "jsonwebtoken";
 import httpStatus from "http-status";
 import bcrypt from 'bcrypt';
 import config from "../../config";
import { createToken } from "./user.utils";
import { userSearchableFields } from "./user.constant";
import QueryBuilder from "../../builder/QueryBuilder";

const registerUserFromDB  = async (userData: TUser) => {
    const user = new User (userData);
    await user.save();
    return user;
};

const loginUserFromDB = async (payload: { email: string; password: string }) => {

  // checking if the user is exist
  const user = await User.findOne({ email: payload?.email }).select("+password");


  if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }


  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  // checking if the user is Blocked
  const isBlocked = user?.isDeleted

  if (isBlocked) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }


  //create token and sent to the  client
  const JwtPayload = {
      userId: user._id.toString(),
      userEmail: user?.email,
      role: user.role,
  };

  const token = createToken(
      JwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
  );

  // console.log("Generated Token:", token);

  return { token };
  // return user;
}





 const logoutUserFromDB  = async (token: string) => {
    const decodedToken: any = jwt.decode(token);
    if (!decodedToken) {
      throw new Error("Invalid token");
    }
  
    const expiryDate = new Date(decodedToken.exp * 1000); 

    // Store the token in the blacklist
    await BlacklistedToken.create({ token, expiresAt: expiryDate });
  };
  
  const isTokenBlacklisted = async (token: string): Promise<boolean> => {
     const blacklisted = await BlacklistedToken.findOne({ token });
    return !!blacklisted;
  };

  // Get all user
const getAllUserFromDB = async (query: Record<string, unknown>) => {

  const userQuery = new QueryBuilder(User.find(),
      query,
  )
      .search(userSearchableFields)
      .filter()
      .sort()
      .paginate()
      .fields();

  const meta = await userQuery.countTotal();
  const result = await userQuery.modelQuery;

  return {
      meta,
      result,
  };
};

// Get Me user
const getMeUserFromDB = async (userEmail: string) => {

  const user = await User.findOne({ email: userEmail })

  return user
};

// Update single user
const updateUserIntoDB = async (
  id: string,
  payload: Partial<TUser>,
) => {
  const result = await User.findOneAndUpdate(
      { _id: id },
      payload,
      {
          new: true,
      },
  );
  return result;
};

// Delete User
const deleteUserFromDB = async (id: string) => {
  const result = await User.findByIdAndUpdate(
      id,
      { isDeleted: true },
      {
          new: true,
      },
  );
  return result;
};

// Password Change Function
const userPasswordChangeIntoDB = async (userEmail: string, payload: { oldPassword: string; newPassword: string }) => {

  const { oldPassword, newPassword } = payload;

  // Find the user by email and select the password field
  const user = await User.findOne({ email: userEmail }).select('+password');

  if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  if (user.status === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  if (user.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  // Compare the old password with the hashed password in the database
//   const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

//   if (!isPasswordMatch) {
//       throw new AppError(httpStatus.UNAUTHORIZED, 'Old password is incorrect!');
//   }


  const newHashedPassword = await bcrypt.hash(
      newPassword,
      Number(config.bcrypt_salt_rounds),
  );


  await User.findOneAndUpdate(
      {
          email: userEmail,
      },
      {
          password: newHashedPassword,
          passwordChangedAt: new Date(),
      },
  );

  return null;
};





  

export const UserService = {
    registerUserFromDB ,
    loginUserFromDB,
     logoutUserFromDB,
     getAllUserFromDB,
     updateUserIntoDB,
     deleteUserFromDB,
     getMeUserFromDB,
     userPasswordChangeIntoDB
  };