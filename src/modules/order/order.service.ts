import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import Order from "./order.model";
import { orderUtils } from "./order.utils";
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { TOrder } from "./order.interface";
import User from "../user/user.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { isValidStatusTransition, OrderSearchableFields } from "./order.constant";
import { Bike } from "../bike/bike.model";

const createOrderIntoDB = async (
  user: JwtPayload,
  payload: { products: { product: string; quantity: number }[] },
  client_ip: string
) => {
  const userId = user?.userId;

  // Validate user existence
  const userData = await User.isUserExistsByCustomId(user.userEmail);
  if (!userData) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Validate payload
  if (!payload?.products || payload?.products?.length === 0) {
      throw new AppError(httpStatus.BAD_REQUEST, 'No products in the order');
  }

  // Process each product in the order
  let totalPrice = 0;
  const productsWithObjectId = payload.products.map((product) => ({
      product: new Types.ObjectId(product.product),
      quantity: product.quantity,
  }));

  for (const product of productsWithObjectId) {
      const bike = await Bike.findById(product.product);
      if (!bike) {
          throw new AppError(httpStatus.NOT_FOUND, `Bike with ID ${product.product} not found`);
      }


      // Deduct the stock
      bike.stock -= product.quantity;
      await bike.save();

      // Calculate total price
      totalPrice += bike.price * product.quantity;
  }


  const orderData = {
      products: productsWithObjectId,
      user: new Types.ObjectId(userId),
      totalPrice,
      status: 'Pending',
  } as TOrder;

  let order = await Order.create(orderData);

  // Payment integration
  const shurjopayPayload = {
      amount: totalPrice,
      order_id: order._id,
      currency: "BDT",
      customer_name: userData.name,
      customer_address: userData.address || "Chittagong",
      customer_email: userData.email,
      customer_phone: userData.phone || "01917549876",
      customer_city: userData.address || "block A, Bou bajar, Chittagong",
      client_ip,
  };


  const payment = await orderUtils.makePaymentAsync(shurjopayPayload);

  if (payment?.transactionStatus) {
      const updatedOrder = await Order.findByIdAndUpdate(
          order._id,
          {
              transaction: {
                  id: payment.sp_order_id,
                  transactionStatus: payment.transactionStatus,
              },
          },
          { new: true }
      );

      if (!updatedOrder) {
          throw new AppError(httpStatus.NOT_FOUND, 'Order not found after update');
      }

      order = updatedOrder;
  }

  return {
      paymentUrl: payment.checkout_url,
  };
};


 const addOrderIntoDB = async(data: any) =>{
    try{
        const order = new Order(data);
        await order.save();
        return order;
    }catch(error:any){
        throw new Error(`Error creating order: ${error.message}`);
    }
 }


// get All Order
const getAllOrderFromDB = async (query: Record<string, unknown>) => {

  const orderQuery = new QueryBuilder(Order.find()
      .populate("user")
      .populate({
          path: "products",
          populate: {
              path: 'product',
          },
      }),
      query,
  )
      .search(OrderSearchableFields)
      .filter()
      .sort()
      .paginate()
      .fields();

  const meta = await orderQuery.countTotal();
  const result = await orderQuery.modelQuery;

  return {
      meta,
      result,
  };
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

  // Get Me Order Data
const getMeOrderFromDB = async (query: Record<string, unknown>, userEmail: string) => {

  const orders = await Order.find()
      .populate({
          path: "user",
          match: { email: userEmail },
      })
      .populate({
          path: "products",
          populate: {
              path: 'product',
          },
      })

  const filteredOrders = orders.filter(order => order.user !== null);

  const orderQuery = new QueryBuilder(Order.find({ _id: { $in: filteredOrders.map(order => order._id) } }), query)
      .search(OrderSearchableFields)
      .filter()
      .sort()
      .paginate()
      .fields();

  const meta = await orderQuery.countTotal();
  const result = await orderQuery.modelQuery;

  return {
      meta,
      result,
  };
};


  

// Update Order
const updateOrderIntoDB = async (id: string, payload: Partial<TOrder>) => {
  // Find the order
  const order = await Order.findById(id).populate('products.product');
  if (!order) {
      throw new AppError(httpStatus.NOT_FOUND, 'This Order is not found!');
  }

  // Check if status is being updated
  if (payload.status && payload.status !== order.status) {
      if (!isValidStatusTransition(order.status, payload.status)) {
          throw new AppError(
              httpStatus.BAD_REQUEST,
              `Invalid status transition from ${order.status} to ${payload.status}`
          );
      }
  }


  if (payload.products) {
      for (const updatedProduct of payload.products) {
          // Find the corresponding product in the order
          const existingProduct = order.products.find(
              (p) => p.product._id.toString() === updatedProduct.product.toString()
          );

          if (!existingProduct) {
              throw new AppError(httpStatus.NOT_FOUND, 'Bike not found in the order!');
          }

          // Find the bicycle in the database
          const bike = await Bike.isBikeExists(updatedProduct.product.toString());
          if (!bike) {
              throw new AppError(httpStatus.NOT_FOUND, 'Bike not found!');
          }

          // Check if the requested quantity is available in stock
          const quantityDifference = updatedProduct.quantity - existingProduct.quantity;
          if (quantityDifference > 0 && bike.stock < quantityDifference) {
              throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient stock for this bike!');
          }

          // Update the bike stock quantity
          await Bike.findByIdAndUpdate(
              bike.id,
              { $inc: { quantity: -quantityDifference } },
              { new: true }
          );

          // Update the product quantity in the order
          existingProduct.quantity = updatedProduct.quantity;
      }
  }

  // Recalculate the total price of the order
  if (payload.products) {
      let totalPrice = 0;
      for (const product of order.products) {
          const bike = await Bike.isBikeExists(product.product.toString());
          if (!bike) {
              throw new AppError(httpStatus.NOT_FOUND, 'Bike not found!');
          }
          totalPrice += bike.price * product.quantity;
      }
      payload.totalPrice = totalPrice;
  }

  // Update the order
  const result = await Order.findOneAndUpdate(
      { _id: id },
      { ...payload, products: order.products },
      { new: true }
  );

  return result;
};



const deleteOrderFromDB = async (id: string) => {
  const order = await Order.findById(id)
  if (!order) {
    throw new Error("Order not found!");
  }
  
  const deletedOrder = await Order.findByIdAndDelete(id);
  return deletedOrder;
};


export const orderService = {
  createOrderIntoDB,
  addOrderIntoDB,
  getAllOrderFromDB,
  deleteOrderFromDB,
  updateOrderIntoDB,
  verifyPayment,
  getMeOrderFromDB
};