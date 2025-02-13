import { Router } from "express";
import { productController } from "./product.controller";
import { UserRole } from "../user/user.constant";
import auth from "../../middleWare/auth";

const productRouter = Router();

productRouter
.route("/:id")
.get(auth(UserRole.admin),productController.getProductById)
.patch(auth(UserRole.admin),productController.updateProduct)
.delete(auth(UserRole.admin),productController.deleteProduct)

productRouter
.route("/")
  .get(productController.getAllProducts)
  .post(auth(UserRole.admin),productController.createProduct)
  
export default productRouter;
