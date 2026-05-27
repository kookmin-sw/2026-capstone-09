export const BASE_URL = __ENV.MCP_URL || 'http://localhost:8082';
export const TOKEN = __ENV.JWT_TOKEN || '';
export const PROJECT_ID = Number(__ENV.PROJECT_ID) || 0;
export const NODE_ID = Number(__ENV.NODE_ID) || 0;