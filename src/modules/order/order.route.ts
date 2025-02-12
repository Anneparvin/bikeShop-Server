import { Router } from "express";
import { UserRole } from "../user/user.constant";
import { orderController } from "./order.controller";
import auth from "../../middleWare/auth";

const orderRouter = Router();

orderRouter.get("/verify", auth(UserRole.admin), orderController.verifyPayment);

orderRouter
  .route("/")
  .post(auth(UserRole.admin), orderController.createOrder)
  .get(auth(UserRole.user), orderController.getOrders);

  
orderRouter
  .route("/:id")
  .patch(auth(UserRole.admin), orderController.updateOrder)
  .delete(auth(UserRole.admin), orderController.deleteOrder);

export default orderRouter;