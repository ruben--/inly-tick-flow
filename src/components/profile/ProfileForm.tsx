
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { ProfileFormFields } from "@/components/profile/ProfileFormFields";
import { ProfileFormSubmit } from "@/components/profile/ProfileFormSubmit";
import { ProfileData } from "./types";

export const profileFormSchema = z.object({
  companyName: z.string().min(1, { message: "Company name is required" }),
  website: z.string().min(1, { message: "Website is required" }),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export interface ProfileFormProps {
  onSubmit: (values: ProfileFormValues) => void;
  isLoading?: boolean;
  initialData?: ProfileData | null;
}

export function ProfileForm({ onSubmit, isLoading = false, initialData }: ProfileFormProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      companyName: initialData?.companyName || "",
      website: initialData?.website || "",
    },
  });

  function handleSubmit(data: ProfileFormValues) {
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
