import express from "express";
import userRouter from "../modules/user/user.route";
import orderRouter from "../modules/order/order.route";
import bikeRouter from "../modules/bike/bike.route";

const router =  express.Router();

router.use("/user", userRouter);
router.use("/bike", bikeRouter);
router.use("/order", orderRouter);

export default router;