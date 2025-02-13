import AppError from "../../errors/AppError";
import Product from "../product/product.model";
import httpStatus from "http-status";
import Order from "./order.model";
import { orderUtils } from "./order.utils";
import { IUser } from "../user/user.interface";
import { error } from "console";

const createOrder = async (
  user: IUser,
  payload: { products: { product: string; quantity: number }[] },
  client_ip: string
) => {
if(!payload?.products?.length)
  throw new AppError(httpStatus.NOT_ACCEPTABLE, "Order is not specified");

const products = payload.products;

let totalPrice = 0;
const productDetails = await Promise.all(
  products.map(async(item)=> {
      const product = await Product.findById(item.product);

      if(product){
          const subtotal = product ? (product.price || 0) * item.quantity : 0;
          totalPrice += subtotal;
          return item;
      }
  })
);

let order = await Order.create({
user,
products:productDetails,
totalPrice,
});

// payment integration
const shurjopayPayload = {
  amount: totalPrice,
  order_id: order._id,
  currency: "BDT",
  customer_name: user.name,
  customer_address: user.address,
  customer_email: user.email,
  customer_phone: user.phone,
  customer_city: user.city,
  client_ip,
};

const payment = await orderUtils.makePaymentAsync(shurjopayPayload);

if(payment?.transactionStatus) {
  order = await order.updateOne({
      transaction:{
          id: payment.sp_order_id,
           transactionStatus: payment.transactionStatus,
                  }
  })
}
return  payment.checkout_url;
};

const getOrders = async() => {
  const data = await Order.find();
  return data;
};

const verifyPayment = async (order_id: string) => {
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

  if (verifiedPayment.length) {
      await Order.findOneAndUpdate(
        {
          "transaction.id": order_id,
        },
        {
          "transaction.bank_status": verifiedPayment[0].bank_status,
          "transaction.sp_code": verifiedPayment[0].sp_code,
          "transaction.sp_message": verifiedPayment[0].sp_message,
          "transaction.transactionStatus": verifiedPayment[0].transaction_status,
          "transaction.method": verifiedPayment[0].method,
          "transaction.date_time": verifiedPayment[0].date_time,
          status:
            verifiedPayment[0].bank_status == "Success"
              ? "Paid"
              : verifiedPayment[0].bank_status == "Failed"
              ? "Pending"
              : verifiedPayment[0].bank_status == "Cancel"
              ? "Cancelled"
              : "",
        }
      );
    }
  
    return verifiedPayment;
  };
  

const updateOrder = async (
  orderId: string,
  updateData: Partial<{ status: string }>
) => {
  if (!updateData || Object.keys(updateData).length === 0) {
    throw new Error("No update data provided!");
  }

  const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedOrder) {
    throw new Error("Order not found!");
  }

  return updatedOrder;
};


const deleteOrder = async (id: string) => {
  const order = await Order.findById(id)
  if (!order) {
    throw new Error("Order not found!");
  }
  
  const deletedOrder = await Order.findByIdAndDelete(id);
  return deletedOrder;
};


export const orderService = {
  createOrder,
  getOrders,
  verifyPayment,
  updateOrder,
  deleteOrder,
};