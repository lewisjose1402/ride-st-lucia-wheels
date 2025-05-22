
import { z } from "zod";

export const CompanyProfileSchema = z.object({
  company_name: z.string().min(2, "Company name must be at least 2 characters"),
  contact_person: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  street_address: z.string().min(5, "Please enter a valid street address"),
  constituency: z.string().min(1, "Please select a constituency"),
  description: z.string().optional(),
});

export type CompanyProfileFormValues = z.infer<typeof CompanyProfileSchema>;
