export type Forecast = {
  datetime: string;
  condition?: string;
  temperature?: number;
  wind_speed?: number;
  wind_bearing?: number | string;
  wind_gust_speed?: number;
};

const CONDITION_ICONS: Record<string, string> = {
  sunny: "clear-day",
  "clear-night": "clear-night",
  partlycloudy: "partly-cloudy",
  cloudy: "cloudy",
  fog: "fog",
  hail: "hail",
  lightning: "thunderstorms",
  "lightning-rainy": "thunderstorms",
  pouring: "rain",
  rainy: "rain",
  snowy: "snow",
  "snowy-rainy": "snow",
  windy: "wind",
  "windy-variant": "wind",
  exceptional: "not-available",
};

export function iconName(condition: string | undefined, isNight = false): string {
  const icon = CONDITION_ICONS[condition ?? ""];
  if (!icon) return "not-available";
  if (icon === "clear-day") return isNight ? "clear-night" : icon;
  if (icon === "partly-cloudy") return isNight ? "partly-cloudy-night" : "partly-cloudy-day";
  return icon;
}

export function isKnownCondition(condition: string | undefined): boolean {
  return Boolean(condition && CONDITION_ICONS[condition]);
}

export function windArrow(bearing: number | string | undefined): string {
  if (typeof bearing === "number") {
    return ["↑", "↗", "→", "↘", "↓", "↙", "←", "↖"][Math.round((bearing + 180) / 45) % 8];
  }
  const cardinal: Record<string, string> = {
    N: "↓", NE: "↙", E: "←", SE: "↖", S: "↑", SW: "↗", W: "→", NW: "↘",
    NORTH: "↓", NORTHEAST: "↙", EAST: "←", SOUTHEAST: "↖", SOUTH: "↑", SOUTHWEST: "↗", WEST: "→", NORTHWEST: "↘",
    POHJOINEN: "↓", KOILLINEN: "↙", ITÄ: "←", ITA: "←", KAAKKO: "↖", ETELÄ: "↑", ETELA: "↑", LOUNAS: "↗", LÄNSI: "→", LANSI: "→", LUODE: "↘",
    POHJOISKOILLINEN: "↙", ITÄKOILLINEN: "↙", ITAKOILLINEN: "↙", ITÄKAAKKO: "↖", ITAKAAKKO: "↖", ETELÄKAAKKO: "↖", ETELAKAAKKO: "↖", ETELÄLOUNAS: "↗", ETELALOUNAS: "↗", LÄNSILOUNAS: "↗", LANSILOUNAS: "↗", LÄNSILUODE: "↘", LANSILUODE: "↘", POHJOISLUODE: "↘",
  };
  return cardinal[bearing?.toUpperCase() ?? ""] ?? "";
}

export function formatTemperature(value: unknown, unit = "°"): string {
  const number = Number(value);
  const displayUnit = unit === "°C" ? "°" : unit;
  return Number.isFinite(number) ? `${Math.round(number)}${displayUnit}` : "—";
}

export function formatWind(value: unknown, unit = ""): string {
  const number = Number(value);
  return Number.isFinite(number) ? `${Math.round(number)}${unit ? ` ${unit}` : ""}` : "—";
}

export function forecastDate(value: string): Date {
  return new Date(value);
}
