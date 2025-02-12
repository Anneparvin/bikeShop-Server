import mongoose, { model } from "mongoose";
import bcrypt from 'bcrypt';
import config from "../../config";
import jwt, { SignOptions } from "jsonwebtoken";
import IUserModel, { IUser } from "./user.interface";
import { UserRole } from "./user.constant";

const UserSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.user,
      },
         phone: { type: String, default: "N/A" },
         address: { type: String, default: "N/A" },
         city: { type: String, default: "N/A" },
  },
  
   { timestamps: true });
  
  // Hash password before saving
UserSchema.pre("save", async function (next) {
    if(!this.isModified("password")){
        return next();
    }
this.password = await bcrypt.hash(this.password, 10);
next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(
    candidatePassword:string
):Promise<boolean>{
    return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token method
UserSchema.methods.generateToken = function (): string {
    return jwt.sign(
      { email: this.email, role: this.role },
      config.jwt_access_secret!,
      {
        expiresIn: config.jwt_access_expires_in!,
      } as SignOptions
    );
  };

  const User = mongoose.model<IUser,IUserModel>("User",UserSchema);

export default User;