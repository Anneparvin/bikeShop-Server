import { TBikeBrand, TBikeStatus, TBikeType } from "./bike.interface";

// Bike Brands
export const BikeBrand: TBikeBrand[] = [
  "Yamaha",
  "Honda",
  "Suzuki",
  "Kawasaki",
  "Ducati",
  "BMW",
  "KTM",
  "Royal Enfield",
  "Harley Davidson",
  "Bajaj",
  "TVS",
  "Hero",
  "Aprilia",
];

// Bike Types
export const BikeType: TBikeType[] = [
  "Sport",
  "Cruiser",
  "Touring",
  "Adventure",
  "Street",
  "Scooter",
  "Electric",
];

// Bike Stock Status
export const BikeStatus: TBikeStatus[] = ["Stock", "Stock Out"];

// Searchable Fields for Bikes
export const BikeSearchableFields = [
  "name",
  "brand",
  "model",
  "type",

];
