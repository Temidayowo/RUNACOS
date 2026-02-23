import { z } from "zod";

export const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi",
  "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
] as const;

export const FACULTIES = [
  "Sciences",
  "Management Sciences",
  "Humanities",
  "Law",
  "Engineering",
  "Environmental Sciences",
  "Social Sciences",
  "Education",
] as const;

export const DEPARTMENTS = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Biochemistry",
  "Microbiology",
  "Industrial Chemistry",
  "Statistics",
  "Economics",
  "Accounting",
  "Business Administration",
  "Mass Communication",
  "Political Science",
  "English Language",
  "History",
  "International Relations",
  "Sociology",
  "Public Administration",
] as const;

export const membershipRegistrationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  matricNumber: z.string().min(5, "Invalid matric number"),
  level: z.enum(["100", "200", "300", "400", "500"], {
    errorMap: () => ({ message: "Please select a valid level" }),
  }),
  gender: z.string().min(1, "Please select a gender"),
  department: z.string().min(1, "Please select a department"),
  faculty: z.string().min(1, "Please select a faculty"),
  stateOfOrigin: z.string().min(1, "Please select state of origin"),
  admissionYear: z.number().int().min(2000).max(new Date().getFullYear()),
  academicSession: z.string().optional(),
  semester: z.string().optional(),
  passportUrl: z.string().url("Passport photo is required"),
});

export const duplicateCheckSchema = z.object({
  email: z.string().email().optional(),
  matricNumber: z.string().optional(),
});

export type MembershipRegistrationInput = z.infer<typeof membershipRegistrationSchema>;
export type DuplicateCheckInput = z.infer<typeof duplicateCheckSchema>;
