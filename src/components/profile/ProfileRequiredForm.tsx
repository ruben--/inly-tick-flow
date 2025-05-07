
import React from "react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { UserProfileFormValues } from "./types";
import { ProfileFormFields } from "./ProfileFormFields";
import { ProfileFormSubmit } from "./ProfileFormSubmit";
import { useProfileSubmit } from "@/hooks/useProfileSubmit";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileRequiredFormProps {
  initialData: UserProfileFormValues;
  onSuccess?: () => void;
}

export const ProfileRequiredForm: React.FC<ProfileRequiredFormProps> = ({ initialData, onSuccess }) => {
  const { user } = useAuth();
  const form = useForm<UserProfileFormValues>({
    defaultValues: initialData
  });

  const { isLoading, handleSubmit } = useProfileSubmit({
    userId: user?.id || "",
    initialWebsite: initialData?.website || null,
    onSuccess
  });

  const websiteValue = form.watch("website") || "";
  const companyNameValue = form.watch("companyName") || "";

  const onSubmit = (data: UserProfileFormValues) => {
    handleSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <ProfileFormFields form={form} />
        <ProfileFormSubmit 
          isLoading={isLoading} 
          websiteValue={websiteValue} 
          companyNameValue={companyNameValue}
        />
      </form>
    </Form>
  );
};
