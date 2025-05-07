
export interface ConfigState {
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

export const defaultConfig: ConfigState = {
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
