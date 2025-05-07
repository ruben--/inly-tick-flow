
import { useState, useEffect } from 'react';
import { ConfigState, defaultConfig } from './types';
import { toast } from '@/hooks/use-toast';

// Helper function to get stored config from local storage
const getStoredConfig = (): ConfigState | null => {
  const storedConfig = localStorage.getItem('vppConfig');
  if (storedConfig) {
    try {
      return JSON.parse(storedConfig);
    } catch (e) {
      console.error('Error parsing stored config:', e);
      return null;
    }
  }
  return null;
};

export const useConfigState = () => {
  const [config, setConfig] = useState<ConfigState>(defaultConfig);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Load stored configuration on initial load
  useEffect(() => {
    const storedConfig = getStoredConfig();
    if (storedConfig) {
      setConfig(storedConfig);
      setLastSaved(new Date().toLocaleTimeString());
    }
  }, []);

  // Save configuration when it changes with debounce
  useEffect(() => {
    setSaving(true);
    const timer = setTimeout(() => {
      localStorage.setItem('vppConfig', JSON.stringify(config));
      setSaving(false);
      setLastSaved(new Date().toLocaleTimeString());
      toast({
        title: "Configuration saved",
        description: `Your changes have been saved automatically at ${new Date().toLocaleTimeString()}`,
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [config]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResponseModeToggle = (mode: keyof ConfigState['responseModes']) => {
    setConfig(prev => ({
      ...prev,
      responseModes: {
        ...prev.responseModes,
        [mode]: !prev.responseModes[mode]
      }
    }));
  };

  const handleEnergySourceToggle = (source: keyof ConfigState['energySources']) => {
    setConfig(prev => ({
      ...prev,
      energySources: {
        ...prev.energySources,
        [source]: !prev.energySources[source]
      }
    }));
  };

  const handleControlSettingChange = (setting: keyof ConfigState['controlSettings'], value: string) => {
    setConfig(prev => ({
      ...prev,
      controlSettings: {
        ...prev.controlSettings,
        [setting]: value
      }
    }));
  };

  const handleResetToDefaults = () => {
    setConfig(defaultConfig);
    toast({
      title: "Reset to defaults",
      description: "Configuration has been reset to default values",
    });
  };

  return {
    config,
    saving,
    lastSaved,
    handleInputChange,
    handleSelectChange,
    handleResponseModeToggle,
    handleEnergySourceToggle,
    handleControlSettingChange,
    handleResetToDefaults,
  };
};
