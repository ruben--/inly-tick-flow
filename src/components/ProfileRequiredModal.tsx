
import { useState } from 'react';
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useProfileSubmit } from '@/hooks/useProfileSubmit';
import { ProfileRequiredForm, ProfileRequiredFormValues } from '@/components/profile/ProfileRequiredForm';
import { ProfileLoadingState } from '@/components/profile/ProfileLoadingState';

interface ProfileRequiredModalProps {
  userId: string;
  onSuccess: () => void;
}

export function ProfileRequiredModal({ userId, onSuccess }: ProfileRequiredModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'form' | 'loading'>('form');
  
  const { submit, isLoading } = useProfileSubmit({
    userId,
    onSuccess: () => {
      setStep('loading');
      setTimeout(() => {
        onSuccess();
      }, 1500); // Show loading state for 1.5 seconds
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  async function handleSubmit(values: ProfileRequiredFormValues) {
    setError(null);
    await submit(values);
  }

  if (step === 'loading') {
    return (
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Setting Up Your Profile</DialogTitle>
        </DialogHeader>
        <ProfileLoadingState />
      </DialogContent>
    );
  }

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Complete Your Profile</DialogTitle>
      </DialogHeader>

      {error && (
        <Alert variant="destructive" className="my-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mt-4">
        <p className="text-sm text-muted-foreground mb-6">
          Please provide your company details to continue. This information will be used to personalize your experience.
        </p>
        
        <ProfileRequiredForm 
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>

      <DialogFooter className="mt-6">
        <p className="text-xs text-muted-foreground">
          Your profile information can be updated later from your settings.
        </p>
      </DialogFooter>
    </DialogContent>
  );
}
