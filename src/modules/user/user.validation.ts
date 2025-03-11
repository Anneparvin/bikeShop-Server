import { z } from "zod";

// User Registration Validation Schema
 const userValidationSchema = z.object({
  body:z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "customer"]).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  })
});

// User Login Validation Schema
 const loginValidationSchema = z.object({
  body:z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
  })
});

// Update User Validation Schema
 const updateUserValidationSchema = z.object({
    body:z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        status: z.enum(['in-progress' , 'blocked']).optional(),
        city: z.string().optional(),
        role: z.enum(['admin' , 'customer']).optional(),
    })
});

// Password Change Validation Schema
 const passwordChangeUserValidationSchema = z.object({
    body:z.object({
        oldPassword: z.string().min(1, "Old password is required"),
        newPassword: z.string().min(6, "New password must be at least 6 characters"),
    })
});

export const UserValidation = {
    userValidationSchema,
    loginValidationSchema,
    updateUserValidationSchema,
    passwordChangeUserValidationSchema
};