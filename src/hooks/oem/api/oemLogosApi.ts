
import { supabase } from '@/integrations/supabase/client';
import { OemType } from '../types';

/**
 * Loads OEM logo data from the database for a specific user
 */
export async function loadOemLogoData(userId: string) {
  const { data, error } = await supabase
    .from('user_configs')
    .select('*')
    .eq('user_id', userId)
    .eq('config_type', 'oem_logos')
    .maybeSingle();
    
  if (error) throw error;
  return data;
}

/**
 * Saves OEM logo data to the database
 */
export async function saveOemLogoData(userId: string, oemLogos: OemType[]) {
  // Check if the user already has a config
  const { data, error } = await supabase
    .from('user_configs')
    .select('id')
    .eq('user_id', userId)
    .eq('config_type', 'oem_logos')
    .maybeSingle();
  
  if (error) throw error;
  
  if (data) {
    // Update existing config
    const { error: updateError } = await supabase
      .from('user_configs')
      .update({ 
        config_data: { oemLogos },
        updated_at: new Date().toISOString()
      })
      .eq('id', data.id);
      
    if (updateError) throw updateError;
  } else {
    // Insert new config
    const { error: insertError } = await supabase
      .from('user_configs')
      .insert({
        user_id: userId,
        config_type: 'oem_logos',
        config_data: { oemLogos }
      });
      
    if (insertError) throw insertError;
  }
}

/**
 * Fetches a logo for a specific OEM
 */
export async function fetchOemLogo(domain: string) {
  const response = await supabase.functions.invoke('fetch-brand-logo', {
    body: { website: domain }
  });
  
  if (response.error) throw response.error;
  return response.data?.logoImage || null;
}
