
import { useAuth } from '@/contexts/AuthContext';
import { ChecklistWizard } from '@/components/configurator/ChecklistWizard';
import { supabase } from '@/integrations/supabase/client';

const Checklist = () => {
  const { user } = useAuth();

  // Simple page that uses our wizard component
  return (
    <div className="container py-8 mx-auto">
      {user ? (
        <ChecklistWizard />
      ) : (
        <div className="text-center py-16">
          <p>Please log in to access the checklist.</p>
        </div>
      )}
    </div>
  );
};

export default Checklist;
