
interface ProgressSummaryProps {
  progress: number;
}

export const ProgressSummary = ({ progress }: ProgressSummaryProps) => {
  if (progress === 100) {
    return (
      <div className="mt-2 text-xs text-black bg-te-orange p-2 border border-black">
        All steps completed! Your VPP is fully configured.
      </div>
    );
  }
  
  return (
    <div className="mt-2 text-xs text-te-gray-600">
      Complete all steps to finalize your VPP configuration.
    </div>
  );
};
