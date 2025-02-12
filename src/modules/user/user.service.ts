import BlacklistedToken from "./blacklistedToken.model";
import { IUser } from "./user.interface";
import User from "./user.model";
import jwt from "jsonwebtoken";

const registerUser = async (userData: IUser) => {
    const user = new User (userData);
    await user.save();
    return user;
};

const loginUser = async (payload: IUser) => {
  const user = await User.findOne({email:payload.email}).select(
      "password email role" 
  );
  if(!user || !(await user.comparePassword(payload.password))){
      throw new Error("Invalid email or password");
  }

  const accessToken = await user.generateToken();
  return accessToken;
};


const logoutUser = async (token: string) => {
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
  

export const UserService = {
    registerUser,
    loginUser,
    logoutUser,
  };