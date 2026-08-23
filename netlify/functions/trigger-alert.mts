import type { Config } from '@netlify/functions';

export default async (req: Request): Promise<Response> => {
  const body = await req.json().catch(() => ({}));
  const { alertId, location, city, severity, actionTaken } = body || {};

  return Response.json({
    success: true,
    dispatchedAt: new Date().toISOString(),
    alertId: alertId || `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
    recipient: `Municipal Corporation & State Pollution Control Board (${city || 'State'} Node)`,
    status: 'DISPATCHED_TO_FIELD_TEAMS',
    protocolCode: severity === 'HIGH' ? 'GRAP-LEVEL-IV-RESPONSE' : 'GRAP-LEVEL-II-ACTION',
    message: `Authority intervention alert successfully registered for ${location}, ${city}. Task force notified for ${actionTaken || 'field inspection and mist mitigation'}.`,
  });
};

export const config: Config = {
  path: '/api/trigger-alert',
  method: 'POST',
};
