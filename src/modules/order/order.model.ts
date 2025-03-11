import { model, Schema } from "mongoose";
import { TOrder } from "./order.interface";

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
                ref: 'Bike', 
                required: true 
            },
      quantity: {
         type: Number, 
        required: true
        }
      },
    ],
    totalPrice: { 
        type: Number, 
        required: true 
    },
    status: {
         type: String, 
         enum: ['Pending', 'Paid', 'Shipped', 'Delivered', 'Canceled'], 
         default: 'Pending' },
    transaction: {
            id: String,
            transactionStatus: String,
            bank_status: String,
            sp_code: String,
            sp_message: String,
            method: String,
            date_time: String,
        },
  }, 
  { 
    timestamps: true 
});
  
const Order =model<TOrder>('Order', orderSchema);

export default Order;
  