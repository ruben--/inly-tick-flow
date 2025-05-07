
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { UserProfileFormValues } from "./ProfileRequiredForm"; 

interface ProfileFormFieldsProps {
  form: UseFormReturn<UserProfileFormValues>;
  onWebsiteBlur?: () => void;
}

export const ProfileFormFields: React.FC<ProfileFormFieldsProps> = ({ 
  form,
  onWebsiteBlur
}) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First Name <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input placeholder="John" {...field} required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last Name <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input placeholder="Doe" {...field} required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Role <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input placeholder="Energy Manager" {...field} required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="companyName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Name <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input placeholder="Acme Inc." {...field} required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input 
                placeholder="example.com" 
                {...field} 
                onBlur={(e) => {
                  field.onBlur(); // Call the original onBlur
                  if (onWebsiteBlur) onWebsiteBlur(); // Call our custom handler
                }}
                required 
              />
            </FormControl>
            <FormDescription>
              Your company's website URL (e.g. example.com or https://example.com)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
