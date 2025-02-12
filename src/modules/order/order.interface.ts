import { Types } from "mongoose";

export interface IOrder {
    user: Types.ObjectId;
    products: {
      product: Types.ObjectId;
      quantity: number;
      price:number;
    }[];
    totalPrice: number;
    status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'canceled';
  }
  