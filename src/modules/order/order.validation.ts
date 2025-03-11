import { z } from "zod";


export const TOrderStatusSchema = z.enum(["Pending", "Paid", "Shipped", "Completed", "Cancelled"]);


export const createOrderValidationSchema = z.object({
    body:z.object({

        user: z.string().min(1, 'User ID is required'),
        products: z.array(
            z.object({
                product: z.string().min(1, 'Product ID is required'),
                quantity: z.number().min(1, 'Quantity must be at least 1'),
            })
        ).min(1, 'At least one product is required'),
        totalPrice: z.number().min(0, 'Total price must be at least 0'),
        status: z.enum(['Pending', 'Paid', 'Shipped', 'Delivered', 'Canceled']).optional(),
        transaction: z.object({
            id: z.string().optional(),
            transactionStatus: z.string().optional(),
            bank_status: z.string().optional(),
            sp_code: z.string().optional(),
            sp_message: z.string().optional(),
            method: z.string().optional(),
            date_time: z.string().optional(),
        }).optional(),
    })
    });


// Update Zod Route Validation
 const updateOrderValidationSchema = z.object({
    body: z.object({
        quantity: z.number().positive().optional(),
        status: TOrderStatusSchema.optional()
    })
});



export const OrderValidations = {
    createOrderValidationSchema,
    updateOrderValidationSchema
};