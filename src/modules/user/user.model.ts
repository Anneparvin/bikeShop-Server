import mongoose, { model } from "mongoose";
import bcrypt from 'bcrypt';
import config from "../../config";
import jwt, { SignOptions } from "jsonwebtoken";
import  {TUser, UserModel } from "./user.interface";
import { UserRole } from "./user.constant";

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        validate: {
            validator: function (value: string) {
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value)
            },
            message: '{VALUE} is not a valid email',
        },
        immutable: true,
    },
    password: { 
        type: String,
        required: [true, 'Password id is required'],
        select: false
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.customer,
      },
      status: {
        type: String,
        enum: ['in-progress', 'blocked'],
        default: 'in-progress',
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    passwordChangedAt: {
        type: Date,
        default: null,
    },
    phone: { type: String, default: "N/A" },
    address: { type: String, default: "N/A" },
    city: { type: String, default: "N/A" },
  },
  
   { timestamps: true });
  

// Hash password before saving
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")){
        return next();
    }
this.password = await bcrypt.hash(this.password, 10);
next();
});




userSchema.pre("save", async function (next) {
    if (!this.isModified("email")) {
      return next();
    }
  
    const existingUser = await User.findOne({ email: this.email });
    if (existingUser) {
      return next(new Error("Email already exists. Please use a different email."));
    }
  
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
      this.passwordChangedAt = new Date();
    }
  
    next();
  });



  userSchema.methods.comparePassword = async function (
    candidatePassword: string
  ): Promise<boolean> {
    if (!this.password) {
      throw new Error("No password found for this user.");
    }
    return await bcrypt.compare(candidatePassword, this.password);
  };
  

// Generate JWT token method
userSchema.methods.generateToken = function (): string {
    return jwt.sign(
      { email: this.email, role: this.role },
      config.jwt_access_secret!,
      {
        expiresIn: config.jwt_access_expires_in!,
      } as SignOptions
    );
  };

  userSchema.statics.getPublicUserData = function (userId: string) {
    return this.findById(userId).select('id name email isDeleted status role address mobile');
};

// Existing ID
userSchema.statics.isUserExistsByCustomId = async function (email: string) {
    return await User.findOne({ email })
};

// Password Matched
userSchema.statics.isPasswordMatched = async function (
    plainTextPassword,
    hashedPassword,
) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
};




userSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});




  const User = mongoose.model<TUser,UserModel>("User",userSchema);

export default User;