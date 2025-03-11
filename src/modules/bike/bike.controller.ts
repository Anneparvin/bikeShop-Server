import catchAsync from "../../utils/catchAsync";
import { Request, Response,NextFunction} from "express";
import { bikeService} from "./bike.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";


const createBike = catchAsync(async (req: Request, res: Response) => {
    const result = await bikeService.createBikeIntoDB(req.body);

sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Bike created successfully",
    data: result,
});
});

const getAllBikes = catchAsync(async(req: Request, res:Response)=> {
const result = await bikeService.getAllBikesFromDB(req.query);


sendResponse(res, {
    statusCode: httpStatus.OK,
   
    message: "Bike retrieved successfully",
    data: result,  
});
});

const getSingleBike = catchAsync(
    async (req: Request, res: Response) => {
        const {id} = req.params;
        const result = await bikeService.getSingleBikeFromDB(id);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            message: "Single Bike successfully Found",
            data: result,
        });
    });

    
    const updateBike = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;

    // Log bikeId and request body for debugging
    console.log('Bike ID:', id);
    console.log('Request Body:', req.body);

        const result = await bikeService.updateBikeIntoDB( id, req.body);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            message: 'bike is updated succesfully',
            data: result,
        });
    });
    
    const deleteBike = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await bikeService.deleteBikeFromDB(id);
    
        sendResponse(res, {
            statusCode: httpStatus.OK,
            message: 'Bike is deleted succesfully',
            data: result,
        });
    });

        export const bikeController = {
            createBike,
            getAllBikes,
            getSingleBike,
            updateBike,
            deleteBike
          };    
