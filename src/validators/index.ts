import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["EMPLOYEE", "CONTRACTOR"]),
});

export const contractorProfileSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  phone: z.string().min(8, "Phone number must be at least 8 characters"),
  details: z.string().optional(),
});

export const routeSchema = z.object({
  name: z.string().min(3, "Route name must be at least 3 characters"),
  capacity: z.number().int().positive("Capacity must be a positive integer"),
});

export const stopSchema = z.object({
  name: z.string().min(2, "Stop name must be at least 2 characters"),
  location: z.string().optional(),
});

export const createRouteSchema = routeSchema.extend({
  stops: z.array(stopSchema).min(2, "A route must have at least 2 stops"),
});

export const pricingSchema = z.object({
  fromStopId: z.string(),
  toStopId: z.string(),
  amount: z.number().positive("Price must be a positive number"),
});

export const updatePricingSchema = z.object({
  pricing: z.array(pricingSchema),
});

export const bookingSchema = z.object({
  routeId: z.string(),
  fromStopId: z.string(),
  toStopId: z.string(),
  startDate: z.date(),
});
