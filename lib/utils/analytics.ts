/**
 * @fileoverview Utility module for analytics
 * Implements functionality related to the D-EAN platform's core logic layer.
 */
export interface ResponderMetric {
  responderId: string;
  name: string;
  avgResponseTime: number; // in minutes
  resolvedCount: number;
  rating: number;
}

export const calculateResponderMetrics = (
  alerts: any[],
  responders: any[]
): ResponderMetric[] => {
  return responders.map(responder => {
    const responderAlerts = alerts.filter(a => a.responder_id === responder.id && a.status === 'resolved');
    
    const avgResponseTime = responderAlerts.length > 0
      ? responderAlerts.reduce((acc, curr) => {
          const start = new Date(curr.created_at).getTime();
          const end = new Date(curr.resolved_at).getTime();
          return acc + (end - start) / (1000 * 60);
        }, 0) / responderAlerts.length
      : 0;

    return {
      responderId: responder.id,
      name: responder.name,
      avgResponseTime: parseFloat(avgResponseTime.toFixed(1)),
      resolvedCount: responderAlerts.length,
      rating: 4.5 + (Math.random() * 0.5) // Mock rating for now
    };
  });
};


export const trackPerformanceMark = (name: string) => { if (typeof window !== 'undefined' && window.performance) { window.performance.mark(name); } };