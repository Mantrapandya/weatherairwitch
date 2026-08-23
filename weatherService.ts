import { LiveWeatherData } from '../types';

// Convert degrees (0-360) to 16-point cardinal compass direction
export function getWindCompassDirection(degrees: number): string {
  const directions = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW',
    'W', 'WNW', 'NW', 'NNW'
  ];
  const normalized = ((degrees % 360) + 360) % 360;
  const index = Math.round(normalized / 22.5) % 16;
  return directions[index];
}

// Pre-defined fallback coordinates for the 4 primary cities
export const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  Ahmedabad: { lat: 23.0225, lng: 72.5714 },
  Delhi: { lat: 28.6139, lng: 77.2090 },
  Mumbai: { lat: 19.0760, lng: 72.8777 },
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
};

// In-memory cache for live weather data (TTL: 2 minutes)
interface CacheEntry {
  data: LiveWeatherData;
  timestamp: number;
}
const weatherCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

/**
 * Fetch live weather from Open-Meteo API
 * @param lat Latitude of the location
 * @param lng Longitude of the location
 * @param forceRefresh Ignore cache if true
 */
export async function fetchLiveWeather(
  lat: number,
  lng: number,
  forceRefresh = false
): Promise<LiveWeatherData> {
  const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  const now = Date.now();

  if (!forceRefresh && weatherCache.has(cacheKey)) {
    const cached = weatherCache.get(cacheKey)!;
    if (now - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
  }

  // 1. Try local server endpoint first for proxying
  try {
    const proxyRes = await fetch(`/api/weather?lat=${lat}&lng=${lng}`, {
      headers: { Accept: 'application/json' },
    });
    if (proxyRes.ok) {
      const result: LiveWeatherData = await proxyRes.json();
      weatherCache.set(cacheKey, { data: result, timestamp: now });
      return result;
    }
  } catch (proxyErr) {
    // If proxy failed, continue to direct Open-Meteo call
  }

  // 2. Direct Open-Meteo API query
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m&wind_speed_unit=kmh`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Open-Meteo API responded with status ${response.status}`);
    }

    const json = await response.json();

    if (!json.current) {
      throw new Error('Malformed response from Open-Meteo: missing current data');
    }

    const current = json.current;
    const temp = Math.round(Number(current.temperature_2m) * 10) / 10;
    const humidity = Math.round(Number(current.relative_humidity_2m));
    const windSpeed = Math.round(Number(current.wind_speed_10m) * 10) / 10;
    const windDir = Math.round(Number(current.wind_direction_10m));

    const result: LiveWeatherData = {
      temperature: temp,
      humidity: humidity,
      windSpeed: windSpeed,
      windDirection: windDir,
      windDirectionCompass: getWindCompassDirection(windDir),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      rawTime: current.time || new Date().toISOString(),
      source: 'Open-Meteo Live API',
      isLive: true,
    };

    weatherCache.set(cacheKey, { data: result, timestamp: now });
    return result;
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error(`Failed to fetch live weather for (${lat}, ${lng}):`, error?.message || error);
    throw new Error(error?.message || 'Weather data temporarily unavailable');
  }
}
