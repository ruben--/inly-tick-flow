
import React from 'react';

type SaveIndicatorProps = {
  saving: boolean;
  lastSaved: Date | null;
};

export const SaveIndicator = ({ saving, lastSaved }: SaveIndicatorProps) => {
  return (
    <div className="fixed bottom-4 right-4 flex items-center space-x-2 text-sm bg-white/10 backdrop-blur-md p-2 rounded-md shadow text-white border border-white/20">
      <span className="text-gray-200">
        {saving ? (
          <>
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500 animate-pulse mr-1.5"></span>
            Saving...
          </>
        ) : lastSaved ? (
          <>
            <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
            Saved at {lastSaved.toLocaleTimeString()}
          </>
        ) : (
          'Not saved yet'
        )}
      </span>
    </div>
  );
};
