import { Model } from "mongoose";
import { UserRole } from "./user.constant";

export interface IUser {
    name: string;
    email: string;
    password: string;
    role:UserRole;
    phone?: string;
    address?: string;
    city?: string;
  }
  

  export interface IUserMethods{
    comparePassword(candidatePassword:string) :Promise<boolean>;
    generateToken():string;
  }

  // Create a new Model type that knows about IUserMethods...
  type IUserModel = Model<IUser, {}, IUserMethods>;

  export default IUserModel;
  

  

  