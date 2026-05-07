import { AlertStatus, EmergencyType, RoutingMode } from '@/lib/types/app.types';

export const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatTime = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

export const formatDateTime = (dateStr: string): string => {
  return `${formatDate(dateStr)}, ${formatTime(dateStr)}`;
};

export const formatRelativeTime = (dateStr: string): string => {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
};

export const formatPhone = (phone: string): string => {
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{5})$/);
  if (match) {
    return `+${match[1]} ${match[2]}-${match[3]}`;
  }
  return phone;
};


export const formatTimer = (startDateStr: string): string => {
  const start = new Date(startDateStr).getTime();
  const now = Date.now();
  const diff = now - start;
  const mins = Math.floor(diff / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export const getEmergencyIcon = (type: EmergencyType): string => {
  const icons: Record<EmergencyType, string> = {
    medical: '🏥',
    fire: '🔥',
    accident: '🚗',
    crime: '🚨',
    flood: '🌊',
    other: '❓',
  };
  return icons[type];
};

export const getStatusColor = (status: AlertStatus): string => {
  const colors: Record<AlertStatus, string> = {
    pending: '#FF2D55',
    accepted: '#F59E0B',
    en_route: '#3B82F6',
    resolved: '#10B981',
    cancelled: '#475569',
  };
  return colors[status];
};

export const getModeLabel = (mode: RoutingMode): string => {
  return mode === 'cloud' ? '☁️ Cloud' : '📡 P2P';
};

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const formatDistance = (km: number): string => {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
};

export const getCompassDirection = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const y = Math.sin(dLon) * Math.cos(lat2 * Math.PI / 180);
  const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
            Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLon);
  let brng = Math.atan2(y, x) * 180 / Math.PI;
  brng = (brng + 360) % 360;
  
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(brng / 45) % 8];
};

export const calculateETA = (distanceKm: number): number => {
  // Average emergency response speed 45km/h (higher than 30 due to priority)
  const speedKmH = 45;
  const timeHours = distanceKm / speedKmH;
  const mins = timeHours * 60;
  // Add 1 min "activation" overhead
  return Math.ceil(mins + 1); 
};

export const formatETA = (mins: number): string => {
  if (mins < 1) return 'less than 1 min';
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  }
  return `${mins} mins`;
};

export const identifyZone = (lat: number, lng: number): string => {
  // Simple mock zone detection for Mangaluru
  if (lat > 12.87 && lat < 12.92 && lng > 74.83 && lng < 74.88) return 'Mangaluru Central';
  if (lat >= 12.92) return 'Surathkal / North';
  if (lat <= 12.87) return 'Ullal / South';
  return 'Coastal Zone';
};
