import mongoose, { Schema, Document } from "mongoose";

interface IBlacklistedToken extends Document {
  token: string;
  expiresAt: Date;
}

const BlacklistedTokenSchema = new Schema<IBlacklistedToken>(
  {
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

const BlacklistedToken = mongoose.model<IBlacklistedToken>(
  "BlacklistedToken",
  BlacklistedTokenSchema
);

export default BlacklistedToken;
