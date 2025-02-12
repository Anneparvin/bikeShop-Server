import { model, Schema } from "mongoose";
import { IOrder } from "./order.interface";

const orderSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, 
    products: [
        {
            product: { 
                type: Schema.Types.ObjectId, 
                ref: 'Product', 
                required: true 
            },
      quantity: {
         type: Number, 
        required: true
        },
      price: {
         type: Number, 
        required: true
        },
      },
    ],
    totalPrice: { 
        type: Number, 
        required: true 
    },
    status: {
         type: String, 
         enum: ['pending', 'paid', 'shipped', 'delivered', 'canceled'], 
         default: 'pending' },
  }, 
  { 
    timestamps: true 
});
  
const Order =model<IOrder>('Order', orderSchema);

export default Order;
  