import { Schema, model } from "mongoose";
import { TBike, BikeModel } from "./bike.interface";
import AppError from "../../errors/AppError";
import httpStatus from 'http-status';

// Enum validation for brand, type, and status (optional if you're using zod validation elsewhere)
const bikeBrandEnum = ["Yamaha", "Honda", "Suzuki", "Kawasaki", "Ducati", "BMW", "KTM", "Royal Enfield", "Harley Davidson", "Bajaj", "TVS", "Hero", "Aprilia"];
const bikeTypeEnum = ["Sport", "Cruiser", "Touring", "Adventure", "Street", "Scooter", "Electric"];
const bikeStatusEnum = ["Stock", "Stock Out"];

// Bike Schema for Mongoose
const BikeSchema = new Schema<TBike>({
  name: { type: String, required: true },
  brand: { type: String, required: true, enum: bikeBrandEnum },
  price: { type: Number, required: true },
  model: { type: String, required: true },
  type: { type: String, required: true, enum: bikeTypeEnum },
  description: { type: String, required: true },
  stock: { type: Number, required: true, min: 0 },
  status: { type: String, required: true, enum: bikeStatusEnum, default: "Stock" },
  isDeleted: { type: Boolean, default: false },
  bikeImage: { type: String, required: true },
}, { timestamps: true });


// Middleware to exclude deleted bicycles from find queries
BikeSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

BikeSchema.pre('findOne', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

// Middleware to validate quantity and update status before saving
BikeSchema.pre('save', function (next) {
    if (this.stock < 0) {
        throw new AppError(httpStatus.BAD_REQUEST, 'QuantityStock cannot be negative');
    }

    // Set status based on quantity
    if (this.stock === 0) {
        this.status = 'Stock Out';
    } else {
        this.status = 'Stock';
    }
    next();
});

// Middleware to validate quantity and update status before updating
BikeSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();

    // Ensure the update object is not null
    if (!update || typeof update !== 'object') {
        return next();
    }

    // Check if update is of type UpdateQuery
    if ('quantity' in update) {
        if (update.stock < 0) {
            throw new AppError(httpStatus.BAD_REQUEST, 'QuantityStock cannot be negative');
        }

        // Set status based on quantity
        if (update.stock === 0) {
            update.status = 'Stock Out';
        } else if (update.quantity > 0) {
            update.status = 'Stock';
        }
    }

    next();
});

// Static method to check if a bike exists
BikeSchema.statics.isBikeExists = async function (id: string) {
    return await Bike.findOne({ _id: id, isDeleted: false });
};


// Create and export Bike model
export const Bike = model<TBike, BikeModel>("Bike", BikeSchema);
