import type { Config } from '@netlify/functions';

export default async (): Promise<Response> => {
  return Response.json({
    status: 'ok',
    service: 'AirWatch AI Environmental Intelligence API',
    geminiConfigured: Boolean(Netlify.env.get('GEMINI_API_KEY')),
    timestamp: new Date().toISOString(),
  });
};

export const config: Config = {
  path: '/api/health',
  method: 'GET',
};
