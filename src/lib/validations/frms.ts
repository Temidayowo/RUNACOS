import { z } from "zod";

export const reportFaultSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  location: z.string().min(2, "Location is required"),
  categoryId: z.string().min(1, "Please select a category"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  fileUrl: z.string().optional(),
});

export const updateFaultSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
  adminNotes: z.string().optional(),
  assignedStaffId: z.string().optional(),
  note: z.string().optional(),
});

export type ReportFaultInput = z.infer<typeof reportFaultSchema>;
export type UpdateFaultInput = z.infer<typeof updateFaultSchema>;
