
import { LogLevel, ServiceStatus, Service, LogEntry, Alert } from '../types';

const SERVICES = [
  'auth-service',
  'payment-gateway',
  'user-profile-api',
  'inventory-manager',
  'notification-engine',
  'search-index-worker',
  'order-processor'
];

export const generateServices = (): Service[] => {
  return SERVICES.map(name => ({
    id: name.toLowerCase().replace(' ', '-'),
    name,
    status: Math.random() > 0.9 ? ServiceStatus.DOWN : (Math.random() > 0.8 ? ServiceStatus.DEGRADED : ServiceStatus.HEALTHY),
    cpu: Math.floor(Math.random() * 100),
    memory: Math.floor(Math.random() * 8192),
    requests: Math.floor(Math.random() * 5000),
    errorRate: parseFloat((Math.random() * 2).toFixed(2)),
    p99: Math.floor(Math.random() * 200) + 50,
    lastHeartbeat: new Date().toISOString()
  }));
};

const LOG_MESSAGES = {
  [LogLevel.INFO]: [
    'User login successful',
    'Database connection established',
    'Message sent to queue',
    'Cache refreshed for key: user_profile',
    'Background job started: sync_orders'
  ],
  [LogLevel.WARN]: [
    'Response time higher than average',
    'Disk space reaching threshold (85%)',
    'Slow query detected in payments DB',
    'Rate limit warning for IP 192.168.1.1'
  ],
  [LogLevel.ERROR]: [
    'Unhandled rejection: connection timeout',
    'Failed to parse JSON payload',
    'External API returned 503 Service Unavailable',
    'Deadlock detected in transaction pool'
  ],
  [LogLevel.DEBUG]: [
    'Payload chunk received',
    'Handshake initiated with node-04',
    'Metric flushed to collector'
  ]
};

export const generateLogs = (count: number = 20): LogEntry[] => {
  const logs: LogEntry[] = [];
  for (let i = 0; i < count; i++) {
    const level = Object.values(LogLevel)[Math.floor(Math.random() * Object.values(LogLevel).length)];
    const messages = LOG_MESSAGES[level];
    logs.push({
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
      level,
      service: SERVICES[Math.floor(Math.random() * SERVICES.length)],
      message: messages[Math.floor(Math.random() * messages.length)]
    });
  }
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const generateAlerts = (): Alert[] => {
  return [
    {
      id: 'alt-1',
      serviceId: 'payment-gateway',
      serviceName: 'payment-gateway',
      type: 'High Latency',
      severity: 'CRITICAL',
      timestamp: new Date().toISOString(),
      status: 'ACTIVE',
      message: 'P99 latency exceeded 500ms for more than 5 minutes.'
    },
    {
      id: 'alt-2',
      serviceId: 'inventory-manager',
      serviceName: 'inventory-manager',
      type: 'Memory Leak',
      severity: 'WARNING',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      status: 'ACTIVE',
      message: 'Memory usage increasing steadily without garbage collection.'
    }
  ];
};
