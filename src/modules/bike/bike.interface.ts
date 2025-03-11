import { Model, Types } from "mongoose";

// Bike Brands
export type TBikeBrand = 
  | "Yamaha"
  | "Honda"
  | "Suzuki"
  | "Kawasaki"
  | "Ducati"
  | "BMW"
  | "KTM"
  | "Royal Enfield"
  | "Harley Davidson"
  | "Bajaj"
  | "TVS"
  | "Hero"
  | "Aprilia";

// Bike Types
export type TBikeType = 
  | "Sport"
  | "Cruiser"
  | "Touring"
  | "Adventure"
  | "Street"
  | "Scooter"
  | "Electric";

// Bike Stock Status
export type TBikeStatus = "Stock" | "Stock Out";

// Bike Product Interface
export interface TBike {
  id?: Types.ObjectId;
  name: string;
  brand: TBikeBrand;
  price: number;
  model: string;
  type: TBikeType;
  description: string;
  stock: number;
  status: TBikeStatus;
  isDeleted: boolean;
  bikeImage: string;
}

// Bike Model Interface
export interface BikeModel extends Model<TBike> {
  isBikeExists(id: string): Promise<TBike | null>;
}
