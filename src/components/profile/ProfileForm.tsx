
import React from "react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { UserProfileFormValues } from "./types";
import { ProfileFormFields } from "./ProfileFormFields";
import { ProfileFormSubmit } from "./ProfileFormSubmit";
import { useProfileSubmit } from "@/hooks/useProfileSubmit";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileFormProps {
  initialData: {
    firstName?: string;
    lastName?: string;
    companyName?: string;
    website?: string;
    role?: string;
  };
  profileLoading?: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ initialData, profileLoading = false }) => {
  const { user } = useAuth();
  const form = useForm<UserProfileFormValues>({
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      companyName: initialData?.companyName || "",
      website: initialData?.website || "",
      role: initialData?.role || ""
    }
  });

  const { isLoading: submitLoading, handleSubmit } = useProfileSubmit({
    userId: user?.id || "",
    initialWebsite: initialData?.website || null,
    onSuccess: () => form.reset(form.getValues())
  });

  const websiteValue = form.watch("website") || "";
  const companyNameValue = form.watch("companyName") || "";

  const onSubmit = (data: UserProfileFormValues) => {
    handleSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <ProfileFormFields 
          form={form} 
          profileLoading={profileLoading}
        />
        <ProfileFormSubmit 
          isLoading={submitLoading} 
          websiteValue={websiteValue}
          companyNameValue={companyNameValue}
        >
          <ProfileFormFields 
            form={form} 
            profileLoading={profileLoading}
          />
        </ProfileFormSubmit>
      </form>
    </Form>
  );
};
