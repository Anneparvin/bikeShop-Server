import { Router } from "express";
import { UserRole } from "../user/user.constant";
import { orderController } from "./order.controller";
import auth from "../../middleWare/auth";
import validateRequest from "../../middleWare/validateRequest";
import { OrderValidations } from "./order.validation";

const orderRouter = Router();

orderRouter.post(
  "/", 
  auth(UserRole.admin), 
  validateRequest(OrderValidations.createOrderValidationSchema),
  orderController.createOrder
);

orderRouter.post(
  "/create-order", 
  auth(UserRole.admin, UserRole.customer),
  orderController.addOrder
);

orderRouter.get(
  "/verify", 
  auth(UserRole.admin), 
  orderController.verifyPayment
);

// All order route
orderRouter.get(
  '/',
  auth(UserRole.admin, UserRole.customer),
  orderController.getAllOrders,
);

// All order route
orderRouter.get(
  '/me',
  auth( UserRole.customer),
  orderController.getMeOrder,
);

// Delete Order Route
orderRouter.delete('/:id',
  auth(UserRole.admin, UserRole.customer),
  orderController.deleteOrder
);


// Update Order Route
orderRouter.patch(
  '/:orderId',
  auth(UserRole.customer, UserRole.admin),
  validateRequest(OrderValidations.updateOrderValidationSchema),
  orderController.updateOrder,
);

export default orderRouter;