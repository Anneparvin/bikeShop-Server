import catchAsync from "../../utils/catchAsync";
import { Request, Response,NextFunction} from "express";
import { productService } from "./product.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import Product from "./product.model";


const createProduct = catchAsync(async (req: Request, res: Response) => {
const productData = req.body;
const newProduct = await productService.createProductFromDB(productData);

sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Bike created successfully",
    data: newProduct,
});
});

const getAllProducts = catchAsync(async(req: Request, res:Response)=> {
const products = await productService.getAllProductsFromDB(req.query);


sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Bike retrieved successfully",
    data: products,  
});
});

const getProductById = catchAsync(
    async (req: Request, res: Response) => {
        const productId = req.params.id;
        const product = await productService.getSingleProductsFromDB(productId);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            message: "Single Bike successfully Found",
            data: product,
        });
    });

    
    
    // const updateProduct = catchAsync(async (req: Request, res: Response, next: NextFunction):Promise<void> => {
    //     const productId = req.params.id;
    //     const { price, stock } = req.body;

    //     if (price === undefined || stock === undefined) {
    //         res.status(400).json({ message: 'Price and stock are required' });
    //         return;
    //     }
    
    //     if (!productId) {
    //          res.status(400).json({
    //             success: false,
    //             message: "Product ID is required",
    //         });
    //     }
    
    //     const updated = await productService.updateProductById(productId, req.body);
    
    //     if (!updated) {
    //          res.status(404).json({
    //             success: false,
    //             message: "Product not found or update failed",
    //         });
    //     }
    
    //     return sendResponse(res, {
    //         statusCode: httpStatus.OK,
    //         message: "Product updated successfully",
    //         data: updated,
    //     });
    // });
    
    const updateProduct = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const productId = req.params.id;
        const { price, stock } = req.body;
    
        if (price === undefined || stock === undefined) {
            res.status(400).json({ message: 'Price and stock are required' });
            return;
        }
    
        if (!productId) {
            res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
            return;
        }
    
        // Check if the product exists
        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            res.status(404).json({
                success: false,
                message: "Product not found",
            });
            return;
        }
    
        const updated = await productService.updateProductById(productId, req.body);
    
        if (!updated) {
            res.status(404).json({
                success: false,
                message: "Product not found or update failed",
            });
            return;
        }
    
        console.log("Updated Product in Service:", updated); // Debugging: Check the updated product
    
        return sendResponse(res, {
            statusCode: httpStatus.OK,
            message: "Product updated successfully",
            data: updated,
        });
    });
    
    const deleteProduct = catchAsync(async (req: Request, res: Response) => {
        const productId = req.params.id;

        if (!productId) {
             res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }

        const deleted = await productService.deleteProductById(productId);

        if (!deleted) {
             res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        sendResponse(res, {
            statusCode: httpStatus.OK,
            message: "Bike deleted successfully",
            data:deleted
          });
        });

        export const productController = {
            createProduct,
            getAllProducts,
            getProductById,
            updateProduct,
            deleteProduct,
          };    
