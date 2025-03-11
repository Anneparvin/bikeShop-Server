import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { orderService } from "./order.service";
import httpStatus from "http-status";

const createOrder = catchAsync(async (req, res) => {
    const user = req.user;
    const result = await orderService.createOrderIntoDB(user, req.body, req.ip!);
    // console.log(result)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        // success:true,
        message: "BikeOrder placed successfully",
        data: result,
      });
    });

    const addOrder = catchAsync(async (req, res) => {
      // const user = req.body;
      const result = await orderService.addOrderIntoDB(req.body);
    

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "BikeOrder added successfully",
      data: result,
    });
  });



    const getAllOrders = catchAsync(async (req, res) => {
      
      const result = await orderService.getAllOrderFromDB(req.body);
      console.log(result);
    
      sendResponse(res, {
        statusCode: httpStatus.OK,
        // success:true,
        message: "All Order get successfully",
        data: result,
      });
    });
  
    // get me order 
const getMeOrder = catchAsync(async (req, res) => {

  const userEmail = req.user?.userEmail
  // console.log(user);
  
  const result = await orderService.getMeOrderFromDB(req.query, userEmail);
  // console.log(result);

  sendResponse(res, {
      statusCode: httpStatus.OK,
      // success:true,
      message: 'All Order get successfully',
      data: result
  });
});

  const updateOrder = catchAsync(async (req, res) => {
        const {orderId} = req.params;
        const updatedOrder = await orderService.updateOrderIntoDB(orderId, req.body);

        sendResponse(res, {
          statusCode: httpStatus.CREATED,
          // success:true,
          message: "BikeOrder updated successfully",
          data: updatedOrder,
        });
      });

      const deleteOrder = catchAsync(async (req, res) => {
        const orderId = req.params.id;
        if (!orderId) {
           res.status(400).json({
              success: false,
              message: "Order ID is required",
          });
      }

      const deletedOrder = await orderService.deleteOrderFromDB(orderId);

      if (!deletedOrder) {
           res.status(404).json({
              success: false,
              message: "Order not found",
          });
      }

        sendResponse(res, {
          statusCode: httpStatus.OK,
          // success:true,
          message: "BikeOrder deleted successfully",
          data: deletedOrder,
        });
      })
  
// verify Order Function
      const verifyPayment = catchAsync(async (req, res) => {
        const result = await orderService.verifyPayment(req.query.order_id as string);
      
        sendResponse(res, {
          statusCode: httpStatus.CREATED,
          // success:true,
          message: "BikeOrder verified successfully",
          data: result,
        });
      });    

      export const orderController = { createOrder, addOrder, verifyPayment, getAllOrders , updateOrder, deleteOrder, getMeOrder};