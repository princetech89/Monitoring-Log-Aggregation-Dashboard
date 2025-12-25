
export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG'
}

export enum ServiceStatus {
  HEALTHY = 'HEALTHY',
  DEGRADED = 'DEGRADED',
  DOWN = 'DOWN'
}

export interface Service {
  id: string;
  name: string;
  status: ServiceStatus;
  cpu: number;
  memory: number;
  requests: number;
  errorRate: number;
  p99: number;
  lastHeartbeat: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  metadata?: Record<string, any>;
}

export interface Alert {
  id: string;
  serviceId: string;
  serviceName: string;
  type: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  timestamp: string;
  status: 'ACTIVE' | 'RESOLVED';
  message: string;
}

export interface MetricDataPoint {
  time: string;
  value: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'VIEWER';
  avatar: string;
}
