import { z } from "zod";

// Enum validation for brand, type, and status
const bikeBrandEnum = z.enum([
  "Yamaha", "Honda", "Suzuki", "Kawasaki", "Ducati", "BMW", "KTM", "Royal Enfield", "Harley Davidson", "Bajaj", "TVS", "Hero", "Aprilia"
]);

const bikeTypeEnum = z.enum([
  "Sport", "Cruiser", "Touring", "Adventure", "Street", "Scooter", "Electric"
]);

const bikeStatusEnum = z.enum(["Stock", "Stock Out"]);

// Bike Validation Schema
export const createBikeValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Bike name is required"),
    brand: bikeBrandEnum,
    price: z.number().min(1, "Price must be greater than 0"),
    model: z.string().min(1, "Model is required"),
    type: bikeTypeEnum,
    description: z.string().min(10, "Description must be at least 10 characters"),
    stock: z.number().min(0, "Stock must be 0 or greater"),
    status: bikeStatusEnum.default("Stock"),
    isDeleted: z.boolean().default(false),
    bikeImage: z.string().min(1, "Bike image URL or path is required"),
  }),
});


export const updateBikeValidationSchema = z.object({
  body: createBikeValidationSchema.shape.body.partial(),
});


 export const BikeValidations = {
    createBikeValidationSchema,
    updateBikeValidationSchema
};
