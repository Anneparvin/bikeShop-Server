import express from "express";
import userRouter from "../modules/user/user.route";
import productRouter from "../modules/product/product.route";
import orderRouter from "../modules/order/order.route";

const router =  express.Router();

router.use("/user", userRouter);
router.use("/product", productRouter);
router.use("/order", orderRouter);

export default router;