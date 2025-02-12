import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { orderService } from "./order.service";
import httpStatus from "http-status";

const createOrder = catchAsync(async (req, res) => {
    const user = req.user;
    const order = await orderService.createOrder(user, req.body, req.ip!);
    console.log(req.body)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "BikeOrder placed successfully",
        data: order,
      });
    });


    const getOrders = catchAsync(async (req, res) => {
        const order = await orderService.getOrders();
      
        sendResponse(res, {
          statusCode: httpStatus.CREATED,
          message: "BikeOrder retrieved successfully",
          data: order,
        });
      });

      const updateOrder = catchAsync(async (req, res) => {
        const {orderId} = req.params;
        const updatedOrder = await orderService.updateOrder(orderId, req.body);

        sendResponse(res, {
          statusCode: httpStatus.CREATED,
          message: "BikeOrder updated successfully",
          data: updatedOrder,
        });
      });

      const deleteOrder = catchAsync(async (req, res) => {
        const {orderId} = req.params;
        const deletedOrder = await orderService.deleteOrder(orderId);

        sendResponse(res, {
          statusCode: httpStatus.CREATED,
          message: "BikeOrder deleted successfully",
          data: deletedOrder,
        });
      })
  

      const verifyPayment = catchAsync(async (req, res) => {
        const order = await orderService.verifyPayment(req.query.order_id as string);
      
        sendResponse(res, {
          statusCode: httpStatus.CREATED,
          message: "BikeOrder verified successfully",
          data: order,
        });
      });    

      export const orderController = { createOrder, verifyPayment, getOrders, updateOrder, deleteOrder };