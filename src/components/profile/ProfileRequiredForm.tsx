
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { ProfileFormFields } from "@/components/profile/ProfileFormFields";
import { ProfileFormSubmit } from "@/components/profile/ProfileFormSubmit";

export const profileRequiredFormSchema = z.object({
  companyName: z.string().min(1, { message: "Company name is required" }),
  website: z.string().min(1, { message: "Website is required" }),
});

export type ProfileRequiredFormValues = z.infer<typeof profileRequiredFormSchema>;

export interface ProfileRequiredFormProps {
  onSubmit: (values: ProfileRequiredFormValues) => void;
  isLoading?: boolean;
}

export function ProfileRequiredForm({ onSubmit, isLoading = false }: ProfileRequiredFormProps) {
  const form = useForm<ProfileRequiredFormValues>({
    resolver: zodResolver(profileRequiredFormSchema),
    defaultValues: {
      companyName: "",
      website: "",
    },
  });

  function handleSubmit(data: ProfileRequiredFormValues) {
    onSubmit(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <ProfileFormFields form={form} />
        <ProfileFormSubmit 
          isLoading={isLoading} 
          websiteValue={form.watch("website")}
          companyNameValue={form.watch("companyName")}
        />
      </form>
    </Form>
  );
}
