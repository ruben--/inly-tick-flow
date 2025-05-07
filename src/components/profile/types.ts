
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { isValidUrl } from "@/utils/brandfetch";

// Create validation schema
export const profileSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  website: z.string()
    .min(1, "Website is required")
    .refine(val => isValidUrl(val), 
      "Must be a valid URL (e.g. example.com or https://example.com)"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.string().min(1, "Role is required")
});

export type UserProfileFormValues = z.infer<typeof profileSchema>;

export interface ProfileFormProps {
  userId: string;
  onSuccess?: () => void;
}

export interface ProfileFormFieldsProps {
  form: UseFormReturn<UserProfileFormValues>;
  onWebsiteBlur?: () => void;
}
