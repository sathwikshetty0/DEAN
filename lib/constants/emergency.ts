export interface EmergencyHotline {
  id: string;
  name: string;
  phone: string;
  region?: string;
}

/** India / Mangaluru emergency numbers */
export const DEFAULT_HOTLINES: EmergencyHotline[] = [
  { id: '112', name: 'National Emergency', phone: '112' },
  { id: '108', name: 'Ambulance', phone: '108' },
  { id: '101', name: 'Police', phone: '101' },
  { id: '102', name: 'Fire', phone: '102' },
  { id: 'mangaluru', name: 'Mangaluru Control Room', phone: '0824-2224000', region: 'Mangaluru' },
];

export const CONTACTS_STORAGE_KEY = 'dean_emergency_contacts';
