
import { OemType } from './types';

// Helper to generate id from domain
export const generateIdFromDomain = (domain: string): string => {
  return domain.replace(/\./g, '-').replace(/https?:\/\/|\/$/g, '');
};

export const defaultOemData: OemType[] = [
  {
    id: generateIdFromDomain('tesla.com'),
    name: 'Tesla',
    domain: 'tesla.com',
    logo: null,
    selected: true,
  },
  {
    id: generateIdFromDomain('lgensol.com'),
    name: 'LG Energy Solution',
    domain: 'lgensol.com',
    logo: null,
    selected: true,
  },
  {
    id: generateIdFromDomain('sonnengroup.com'),
    name: 'Sonnen',
    domain: 'sonnengroup.com',
    logo: null,
    selected: true,
  },
  {
    id: generateIdFromDomain('byd.com'),
    name: 'BYD',
    domain: 'byd.com',
    logo: null,
    selected: true,
  },
  {
    id: generateIdFromDomain('enphase.com'),
    name: 'Enphase',
    domain: 'enphase.com',
    logo: null,
    selected: true,
  },
  {
    id: generateIdFromDomain('panasonic.com'),
    name: 'Panasonic',
    domain: 'panasonic.com',
    logo: null,
    selected: true,
  },
  {
    id: generateIdFromDomain('samsungsdi.com'),
    name: 'Samsung SDI',
    domain: 'samsungsdi.com',
    logo: null,
    selected: true,
  },
  {
    id: generateIdFromDomain('generac.com'),
    name: 'Generac',
    domain: 'generac.com',
    logo: null,
    selected: true,
  },
  {
    id: generateIdFromDomain('solaredge.com'),
    name: 'SolarEdge',
    domain: 'solaredge.com',
    logo: null,
    selected: true,
  },
  {
    id: generateIdFromDomain('alphaess.com'),
    name: 'Alpha ESS',
    domain: 'alphaess.com',
    logo: null,
    selected: true,
  },
  {
    id: generateIdFromDomain('pylontech.com.cn'),
    name: 'Pylontech',
    domain: 'pylontech.com.cn',
    logo: null,
    selected: true,
  },
  {
    id: generateIdFromDomain('solar.huawei.com'),
    name: 'Huawei Solar',
    domain: 'solar.huawei.com',
    logo: null,
    selected: true,
  },
  {
    id: generateIdFromDomain('e3dc.com'),
    name: 'E3/DC',
    domain: 'e3dc.com',
    logo: null,
    selected: true,
  },
  {
    id: generateIdFromDomain('varta-ag.com'),
    name: 'VARTA',
    domain: 'varta-ag.com',
    logo: null,
    selected: true,
  },
  {
    id: generateIdFromDomain('deltaww.com'),
    name: 'Delta',
    domain: 'deltaww.com',
    logo: null,
    selected: true,
  },
  {
    id: generateIdFromDomain('growatt.com'),
    name: 'Growatt',
    domain: 'growatt.com',
    logo: null,
    selected: true,
  },
  {
    id: generateIdFromDomain('fox-ess.com'),
    name: 'FOX ESS',
    domain: 'fox-ess.com',
    logo: null,
    selected: true,
  },
  {
    id: generateIdFromDomain('goodwe.com'),
    name: 'GoodWe',
    domain: 'goodwe.com',
    logo: null,
    selected: true,
  },
  {
    id: generateIdFromDomain('ecoflow.com'),
    name: 'EcoFlow',
    domain: 'ecoflow.com',
    logo: null,
    selected: true,
  },
  {
    id: generateIdFromDomain('franklinwh.com'),
    name: 'Franklin WH',
    domain: 'franklinwh.com',
    logo: null,
    selected: true,
  },
];
