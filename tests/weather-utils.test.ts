import { describe, expect, it } from "vitest";
import { formatTemperature, formatWind, iconName, isKnownCondition, windArrow } from "../src/weather-utils";

describe("weather condition mapping", () => {
  it("selects weather icons and night variants", () => {
    expect(iconName("sunny", true)).toBe("clear-night");
    expect(iconName("partlycloudy", false)).toBe("partly-cloudy-day");
    expect(iconName("lightning-rainy")).toBe("thunderstorms");
  });
  it("uses a visible fallback for unknown conditions", () => {
    expect(iconName("misty_rain")).toBe("not-available");
    expect(isKnownCondition("misty_rain")).toBe(false);
  });
});

describe("weather formatting", () => {
  it("rounds sensor temperatures and uses HA wind directions", () => {
    expect(formatTemperature("13.6")).toBe("14°");
    expect(formatWind(5.19, "m/s")).toBe("5 m/s");
    expect(windArrow(90)).toBe("←");
    expect(windArrow("eteläkaakko")).toBe("↖");
  });
});
