import { z } from "zod";

export const pastQuestionSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  department: z.string().min(1, "Department is required"),
  course: z.string().min(1, "Course is required"),
  year: z.number().int().min(2000).max(2030),
  fileUrl: z.string().url("File URL is required"),
  fileName: z.string(),
  fileSize: z.number(),
  fileType: z.string(),
});

export type PastQuestionInput = z.infer<typeof pastQuestionSchema>;
