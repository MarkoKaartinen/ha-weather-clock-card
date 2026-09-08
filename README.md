# Weather Clock Card

A single Home Assistant Lovelace card for a live clock, current weather, separate outdoor temperature sensors, hourly and daily forecasts, and today's events from one or more calendars.

## Installation

Add this repository to HACS as a custom **Dashboard** repository and install it. Then add the generated `ha-weather-clock-card.js` resource to Lovelace if HACS has not done so automatically.

The card supports Home Assistant Core 2024.3 and newer.

## Configuration

```yaml
type: custom:weather-clock-card
current_weather: weather.home
# These default to current_weather when omitted.
hourly_weather: weather.home
daily_weather: weather.home

# This is the large temperature in the card. Omit it to use weather.home's temperature.
temperature_entity: sensor.outdoor_temperature

sensors:
  - entity: sensor.front_yard_temperature
    label: E
  - entity: sensor.back_yard_temperature
    label: T
    # Optional: use a specific unit for a non-temperature sensor.
    # unit: "%"

calendars:
  - calendar.finnish_name_days
  - calendar.family
hourly_forecast_count: 5
daily_forecast_count: 5
labels:
  today: Today's agenda
```

`current_weather` supplies the condition, animated Meteocons icon, wind and gust data. `hourly_weather` and `daily_weather` can point to dedicated weather entities when your integration exposes forecasts through separate entities.

If an integration reports a condition that the card does not recognize, the card deliberately shows the raw condition next to the `not-available` icon. Please report that value so it can be mapped to Meteocons.

## Themes and card-mod

The card inherits Home Assistant theme values. It also exposes `--weather-clock-accent`, `--weather-clock-icon-size`, and `--weather-clock-clock-size`.

```yaml
card_mod:
  style: |
    weather-clock-card$:
      :host {
        --weather-clock-clock-size: 6rem;
        --weather-clock-icon-size: 150px;
        --weather-clock-accent: #f5a623;
      }
      ha-card { border: 1px solid rgba(255, 255, 255, 0.18); }
```

## Localization and licensing

English and Finnish translations live in [`translations`](translations). Contributions of additional Home Assistant UI language files are welcome.

This project bundles selected animated [Meteocons](https://github.com/basmilius/meteocons) Line SVG assets. Their MIT license attribution is in [`LICENSES/Meteocons-MIT.txt`](LICENSES/Meteocons-MIT.txt).
