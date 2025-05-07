
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MeterType } from '../MeterTypeCard';

interface OptimizationSectionProps {
  meterTypes: MeterType[];
}

export const OptimizationSection = ({ meterTypes }: OptimizationSectionProps) => {
  // Find the FTM and BTM meter types
  const ftmMeter = meterTypes.find(type => type.id === 'ftm');
  const btmMeter = meterTypes.find(type => type.id === 'btm');
  
  // Check if any meter types are selected
  const hasSelectedMeterTypes = meterTypes.some(type => type.selected);
  
  return (
    <Card className="border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-none">
      <CardHeader className="bg-black border-b-2 border-black rounded-none">
        <CardTitle className="text-base font-bold uppercase tracking-wider text-white">Type of optimisation activated</CardTitle>
      </CardHeader>
      <CardContent className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ftmMeter?.selected && (
            <Card className="overflow-hidden border-2 border-black rounded-none shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all">
              <div className="h-40 bg-te-gray-100 relative">
                <img src="/lovable-uploads/2c050251-ea30-49f9-b719-a85e8c8c54e4.png" alt="Front of the Meter" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-te-orange text-black px-2 py-1 font-mono text-xs border border-black">Active</div>
              </div>
              <CardContent className="p-4 border-t-2 border-black bg-white">
                <h3 className="font-bold uppercase tracking-wider text-black text-sm">Front of the Meter</h3>
                <p className="text-xs text-te-gray-700 sidebar-collapse-text font-mono mt-2">
                  {ftmMeter.description}
                </p>
              </CardContent>
            </Card>
          )}
          
          {btmMeter?.selected && (
            <Card className="overflow-hidden border-2 border-black rounded-none shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all">
              <div className="h-40 bg-te-gray-100 relative">
                <img alt="Behind the Meter" className="w-full h-full object-cover" src="/lovable-uploads/92486d5d-2202-48c8-ab14-f8f1a4c3c7ba.png" />
                <div className="absolute top-2 right-2 bg-te-orange text-black px-2 py-1 font-mono text-xs border border-black">Active</div>
              </div>
              <CardContent className="p-4 border-t-2 border-black bg-white">
                <h3 className="font-bold uppercase tracking-wider text-black text-sm">Behind the Meter</h3>
                <p className="text-xs text-te-gray-700 sidebar-collapse-text font-mono mt-2">
                  {btmMeter.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Show message when no meter types are selected */}
          {!hasSelectedMeterTypes && (
            <div className="col-span-2 text-center py-8 border-2 border-dashed border-black p-4">
              <p className="text-black font-mono sidebar-collapse-text">No optimisation is activated</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
