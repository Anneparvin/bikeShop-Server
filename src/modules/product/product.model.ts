import mongoose from "mongoose";
import { IProduct } from "./product.interface";

const productSchema = new mongoose.Schema<IProduct>({
    name: { 
        type: String, 
        required: true 
    },
    brand: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    model: { 
        type: String, 
        required: true 
    },
    stock: { 
        type: Number, 
        required: true, 
        default: 0 
    }, 
  }, 
  { 
    timestamps: true 
});

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;