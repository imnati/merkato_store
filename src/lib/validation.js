import { z } from "zod";

export const checkoutSchema = z.object({
  consigneeName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be under 100 characters"),
  contactPhone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number must be under 20 characters"),
  streetAddress: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must be under 200 characters"),
  cityName: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(100, "City must be under 100 characters"),
});

export const loginSchema = z.object({
  identityEmail: z
    .string()
    .email("Please enter a valid email address"),
  credentialPassword: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be under 100 characters"),
  identityEmail: z
    .string()
    .email("Please enter a valid email address"),
  targetMarketRegion: z.string().min(1, "Please select a region"),
  securePassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be under 50 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.securePassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  identityEmail: z
    .string()
    .email("Please enter a valid email address"),
});

export const productSchema = z.object({
  formName: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name must be under 100 characters"),
  formSku: z
    .string()
    .min(3, "SKU must be at least 3 characters")
    .max(50, "SKU must be under 50 characters"),
  formBrand: z
    .string()
    .min(2, "Brand must be at least 2 characters")
    .max(100, "Brand must be under 100 characters"),
  formCategory: z.string().min(1, "Please select a category"),
  formPrice: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Price must be a positive number",
    }),
  formStock: z
    .string()
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
      message: "Stock must be a non-negative integer",
    }),
});
