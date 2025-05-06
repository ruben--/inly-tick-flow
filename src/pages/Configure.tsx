
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { CheckCircle2, RefreshCcw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ConfigState {
  vppName: string;
  capacityMW: string;
  location: string;
  gridConnectionType: string;
  responseModes: {
    demandResponse: boolean;
    frequencyRegulation: boolean;
    peakShaving: boolean;
    loadFollowing: boolean;
  };
  energySources: {
    solar: boolean;
    wind: boolean;
    batteries: boolean;
    generators: boolean;
  };
  controlSettings: {
    responseTime: string;
    autonomyLevel: string;
    dispatchMethod: string;
  };
}

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

const Configure = () => {
  const [config, setConfig] = useState<ConfigState>({
    vppName: 'My Virtual Power Plant',
    capacityMW: '10',
    location: 'Western Grid',
    gridConnectionType: 'distribution',
    responseModes: {
      demandResponse: true,
      frequencyRegulation: false,
      peakShaving: true,
      loadFollowing: false
    },
    energySources: {
      solar: true,
      wind: true,
      batteries: true,
      generators: false
    },
    controlSettings: {
      responseTime: '30',
      autonomyLevel: 'medium',
      dispatchMethod: 'automatic'
    }
  });
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
    const defaultConfig = {
      vppName: 'My Virtual Power Plant',
      capacityMW: '10',
      location: 'Western Grid',
      gridConnectionType: 'distribution',
      responseModes: {
        demandResponse: true,
        frequencyRegulation: false,
        peakShaving: true,
        loadFollowing: false
      },
      energySources: {
        solar: true,
        wind: true,
        batteries: true,
        generators: false
      },
      controlSettings: {
        responseTime: '30',
        autonomyLevel: 'medium',
        dispatchMethod: 'automatic'
      }
    };
    
    setConfig(defaultConfig);
    toast({
      title: "Reset to defaults",
      description: "Configuration has been reset to default values",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Configure Your VPP</h1>
          <p className="text-muted-foreground mt-1">
            Customize your virtual power plant settings
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          {saving ? (
            <div className="flex items-center">
              <RefreshCcw className="h-4 w-4 mr-1 animate-spin" />
              <span>Saving changes...</span>
            </div>
          ) : lastSaved ? (
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
              <span>Saved at {lastSaved}</span>
            </div>
          ) : null}
        </div>
      </div>

      <Alert className="bg-muted/50">
        <AlertDescription>
          Your configuration is automatically saved as you make changes.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="energy-sources">Energy Sources</TabsTrigger>
          <TabsTrigger value="response-modes">Response Modes</TabsTrigger>
          <TabsTrigger value="control">Control Settings</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Configuration</CardTitle>
              <CardDescription>
                Configure the general settings for your virtual power plant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vppName">VPP Name</Label>
                  <Input 
                    id="vppName"
                    name="vppName"
                    value={config.vppName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacityMW">Capacity (MW)</Label>
                  <Input 
                    id="capacityMW"
                    name="capacityMW"
                    type="number"
                    value={config.capacityMW}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Grid Location</Label>
                  <Select 
                    value={config.location} 
                    onValueChange={(value) => handleSelectChange('location', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Western Grid">Western Grid</SelectItem>
                      <SelectItem value="Eastern Grid">Eastern Grid</SelectItem>
                      <SelectItem value="Northern Grid">Northern Grid</SelectItem>
                      <SelectItem value="Southern Grid">Southern Grid</SelectItem>
                      <SelectItem value="Island Mode">Island Mode</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gridConnectionType">Grid Connection Type</Label>
                  <Select 
                    value={config.gridConnectionType} 
                    onValueChange={(value) => handleSelectChange('gridConnectionType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select connection type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transmission">Transmission Level</SelectItem>
                      <SelectItem value="distribution">Distribution Level</SelectItem>
                      <SelectItem value="microgrid">Microgrid</SelectItem>
                      <SelectItem value="behindmeter">Behind-the-Meter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Energy Sources Tab */}
        <TabsContent value="energy-sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Energy Sources</CardTitle>
              <CardDescription>
                Configure the energy sources that make up your virtual power plant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Solar PV Systems</h3>
                    <p className="text-sm text-muted-foreground">Include solar photovoltaic systems in your VPP</p>
                  </div>
                  <Switch 
                    checked={config.energySources.solar}
                    onCheckedChange={() => handleEnergySourceToggle('solar')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Wind Turbines</h3>
                    <p className="text-sm text-muted-foreground">Include wind generation in your VPP</p>
                  </div>
                  <Switch 
                    checked={config.energySources.wind}
                    onCheckedChange={() => handleEnergySourceToggle('wind')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Battery Storage</h3>
                    <p className="text-sm text-muted-foreground">Include battery energy storage systems</p>
                  </div>
                  <Switch 
                    checked={config.energySources.batteries}
                    onCheckedChange={() => handleEnergySourceToggle('batteries')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Backup Generators</h3>
                    <p className="text-sm text-muted-foreground">Include fossil fuel or biofuel generators</p>
                  </div>
                  <Switch 
                    checked={config.energySources.generators}
                    onCheckedChange={() => handleEnergySourceToggle('generators')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Response Modes Tab */}
        <TabsContent value="response-modes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Grid Response Modes</CardTitle>
              <CardDescription>
                Configure how your VPP responds to grid conditions and signals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Demand Response</h3>
                    <p className="text-sm text-muted-foreground">Respond to utility demand response events</p>
                  </div>
                  <Switch 
                    checked={config.responseModes.demandResponse}
                    onCheckedChange={() => handleResponseModeToggle('demandResponse')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Frequency Regulation</h3>
                    <p className="text-sm text-muted-foreground">Provide grid frequency regulation services</p>
                  </div>
                  <Switch 
                    checked={config.responseModes.frequencyRegulation}
                    onCheckedChange={() => handleResponseModeToggle('frequencyRegulation')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Peak Shaving</h3>
                    <p className="text-sm text-muted-foreground">Reduce peak load on the grid</p>
                  </div>
                  <Switch 
                    checked={config.responseModes.peakShaving}
                    onCheckedChange={() => handleResponseModeToggle('peakShaving')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Load Following</h3>
                    <p className="text-sm text-muted-foreground">Dynamically adjust output based on load</p>
                  </div>
                  <Switch 
                    checked={config.responseModes.loadFollowing}
                    onCheckedChange={() => handleResponseModeToggle('loadFollowing')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Control Settings Tab */}
        <TabsContent value="control" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Control System Settings</CardTitle>
              <CardDescription>
                Configure the control parameters for your VPP
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="responseTime">Response Time (seconds)</Label>
                  <Input 
                    id="responseTime"
                    type="number"
                    value={config.controlSettings.responseTime}
                    onChange={(e) => handleControlSettingChange('responseTime', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="autonomyLevel">Autonomy Level</Label>
                  <Select 
                    value={config.controlSettings.autonomyLevel} 
                    onValueChange={(value) => handleControlSettingChange('autonomyLevel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select autonomy level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Mostly Manual Control</SelectItem>
                      <SelectItem value="medium">Medium - Balanced Control</SelectItem>
                      <SelectItem value="high">High - Highly Autonomous</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dispatchMethod">Dispatch Method</Label>
                  <Select 
                    value={config.controlSettings.dispatchMethod} 
                    onValueChange={(value) => handleControlSettingChange('dispatchMethod', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select dispatch method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual Dispatch</SelectItem>
                      <SelectItem value="scheduled">Scheduled Dispatch</SelectItem>
                      <SelectItem value="automatic">Automatic Dispatch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={handleResetToDefaults}>Reset to Defaults</Button>
        <Button disabled={saving}>
          {saving ? (
            <>
              <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Saved
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Configure;
