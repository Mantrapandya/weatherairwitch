import type { Config } from '@netlify/functions';

export default async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const lat = url.searchParams.get('lat') || '23.0225';
  const lng = url.searchParams.get('lng') || '72.5714';

  try {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m&wind_speed_unit=kmh`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const fetchRes = await fetch(apiUrl, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!fetchRes.ok) {
      return Response.json(
        { error: 'Weather data temporarily unavailable', source: 'Open-Meteo' },
        { status: fetchRes.status },
      );
    }

    const data: any = await fetchRes.json();
    if (!data.current) {
      return Response.json(
        { error: 'Weather data temporarily unavailable', source: 'Open-Meteo' },
        { status: 502 },
      );
    }

    const current = data.current;
    const temp = Math.round(Number(current.temperature_2m) * 10) / 10;
    const humidity = Math.round(Number(current.relative_humidity_2m));
    const windSpeed = Math.round(Number(current.wind_speed_10m) * 10) / 10;
    const windDir = Math.round(Number(current.wind_direction_10m));

    const directions = [
      'N', 'NNE', 'NE', 'ENE',
      'E', 'ESE', 'SE', 'SSE',
      'S', 'SSW', 'SW', 'WSW',
      'W', 'WNW', 'NW', 'NNW',
    ];
    const windCompass = directions[Math.round((((windDir % 360) + 360) % 360) / 22.5) % 16];

    return Response.json({
      temperature: temp,
      humidity: humidity,
      windSpeed: windSpeed,
      windDirection: windDir,
      windDirectionCompass: windCompass,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      rawTime: current.time || new Date().toISOString(),
      source: 'Open-Meteo Live API',
      isLive: true,
    });
  } catch (error: any) {
    console.error('Open-Meteo API proxy error:', error?.message || error);
    return Response.json({ error: 'Weather data temporarily unavailable' }, { status: 503 });
  }
};

export const config: Config = {
  path: '/api/weather',
  method: 'GET',
};
