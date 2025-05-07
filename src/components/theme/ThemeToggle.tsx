
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Palette } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'default' ? 'teenage-engineering' : 'default');
  };

  return (
    <Button 
      variant="ghost" 
      size="sm"
      onClick={toggleTheme}
      className="flex items-center gap-1"
    >
      <Palette size={16} />
      <span className="text-xs uppercase tracking-wider font-bold">
        {theme === 'default' ? 'TE Theme' : 'Standard Theme'}
      </span>
    </Button>
  );
}
