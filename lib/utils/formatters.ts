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
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
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
