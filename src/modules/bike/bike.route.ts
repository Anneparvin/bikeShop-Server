import { Router } from "express";
import { bikeController} from "./bike.controller";
import { UserRole } from "../user/user.constant";
import auth from "../../middleWare/auth";
import validateRequest from "../../middleWare/validateRequest";
import { BikeValidations } from "./bike.validation";

const bikeRouter = Router();

// Create Bicycle Route
bikeRouter.post(
  '/create-bike',
   auth(UserRole.admin),
  validateRequest(BikeValidations.createBikeValidationSchema),
  bikeController.createBike,
);


// All Bicycle data get route
bikeRouter.get('/',
  // auth(UserRole.admin, UserRole.customer),
  bikeController.getAllBikes
);


// Single Bicycle  Data get Route
bikeRouter.get('/:id',
  // auth(UserRole.admin, UserRole.customer), 
  bikeController.getSingleBike
);


// Delete Bicycle Route
bikeRouter.delete('/:id',
  auth(UserRole.admin), 
  bikeController.deleteBike
);


// Update Bicycle Data
bikeRouter.patch(
  '/:id',
  auth( UserRole.admin ),
  validateRequest( BikeValidations.updateBikeValidationSchema ),
  bikeController.updateBike,
);


  
export default bikeRouter;
