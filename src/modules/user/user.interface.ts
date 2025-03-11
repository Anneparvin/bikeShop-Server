import { Model, Types} from "mongoose";
import { UserRole } from "./user.constant";

export interface TUser {
    id?: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role:UserRole;
    status: 'in-progress' | 'blocked';
    phone: string;
    address: string;
    city: string;
    isDeleted: boolean;
    passwordChangedAt?: Date;
  }
  

  export interface UserModel extends Model<TUser> {

    isUserExistsByCustomId(email: string): Promise<TUser>;

    getPublicUserData(userId: string): Promise<Pick<TUser, 'id' | 'name' | 'email' | 'role' | 'status' | 'isDeleted' | 'phone' | 'address'>>;

    //instance methods for checking if passwords are matched
    isPasswordMatched(
        plainTextPassword: string,
        hashedPassword: string,
    ): Promise<boolean>;

    passwordChangedAt: {
        type: Date,
        default: null,
    },
}

export type TUserRole = keyof typeof UserRole;