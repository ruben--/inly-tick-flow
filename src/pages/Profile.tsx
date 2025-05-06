
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/components/profile/ProfileForm";

export default function Profile() {
  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-medium">Your Profile</CardTitle>
          <CardDescription>
            Update your personal and company information
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ProfileForm />
        </CardContent>
      </Card>
    </div>
  );
}
