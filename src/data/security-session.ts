export type InstructorSessionDeviceType = "desktop" | "mobile" | "tablet" | (string & {});

export interface APIInstructorSession {
  id: number;
  isCurrent: boolean;
  deviceName: string;
  browser: string;
  os: string;
  deviceType: InstructorSessionDeviceType;
  ipAddress: string;
  authMethod: string; // "password" | "email" | ...
  createdAt: string;
  lastUsedAt: string;
  expiresAt: string;
}

export interface APIInstructorSessionsResponse {
  data: APIInstructorSession[];
  total: number;
}

export interface APIInstructorSessionMessage {
  message: string;
}

export interface APIInstructorSessionRevokeResponse {
  message: string;
  revoked: number;
}