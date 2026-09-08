import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import clearDay from "@meteocons/svg/line/clear-day.svg?url";
import clearNight from "@meteocons/svg/line/clear-night.svg?url";
import cloudy from "@meteocons/svg/line/cloudy.svg?url";
import drizzle from "@meteocons/svg/line/drizzle.svg?url";
import fog from "@meteocons/svg/line/fog.svg?url";
import hail from "@meteocons/svg/line/hail.svg?url";
import unavailable from "@meteocons/svg/line/not-available.svg?url";
import overcast from "@meteocons/svg/line/overcast.svg?url";
import partlyCloudyDay from "@meteocons/svg/line/partly-cloudy-day.svg?url";
import partlyCloudyNight from "@meteocons/svg/line/partly-cloudy-night.svg?url";
import rain from "@meteocons/svg/line/rain.svg?url";
import snow from "@meteocons/svg/line/snow.svg?url";
import thunderstorms from "@meteocons/svg/line/thunderstorms.svg?url";
import wind from "@meteocons/svg/line/wind.svg?url";
import { formatTemperature, formatWind, forecastDate, iconName, isKnownCondition, windArrow, type Forecast } from "./weather-utils";
import en from "../translations/en.json";
import fi from "../translations/fi.json";

type HassEntity = { state: string; attributes: Record<string, unknown> };
type Hass = {
  states: Record<string, HassEntity>;
  locale: { language: string; time_format?: "12" | "24" };
  config: { time_zone: string };
  connection: { subscribeMessage: (callback: (message: any) => void, message: Record<string, unknown>) => Promise<() => void> };
};
type SensorConfig = { entity: string; label: string; unit?: string };
type CardConfig = {
  type?: string;
  current_weather: string;
  hourly_weather?: string;
  daily_weather?: string;
  temperature_entity?: string;
  sensors?: SensorConfig[];
  calendars?: string[];
  hourly_forecast_count?: number;
  daily_forecast_count?: number;
  show_calendar?: boolean;
  calendar_title?: string;
  calendar_icon?: string;
  labels?: Record<string, string>;
};
type CalendarEvent = { summary?: string; start: string; end: string };
declare global { interface Window { customCards?: Array<Record<string, string>>; } }

const ICONS: Record<string, string> = {
  "clear-day": clearDay, "clear-night": clearNight, cloudy, drizzle, fog, hail,
  "not-available": unavailable, overcast, "partly-cloudy-day": partlyCloudyDay,
  "partly-cloudy-night": partlyCloudyNight, rain, snow, thunderstorms, wind,
};

@customElement("weather-clock-card")
export class WeatherClockCard extends LitElement {
  @property({ attribute: false }) public hass?: Hass;
  @state() private hourly: Forecast[] = [];
  @state() private daily: Forecast[] = [];
  @state() private events: CalendarEvent[] = [];
  @state() private now = new Date();
  private config?: CardConfig;
  private unsubscribers: Array<() => void> = [];
  private eventsByCalendar = new Map<string, CalendarEvent[]>();
  private clock?: number;

  static getConfigElement() { return document.createElement("weather-clock-card-editor"); }
  static getStubConfig() { return { current_weather: "weather.home" }; }
  static getConfigForm() { return undefined; }

  public setConfig(config: CardConfig): void {
    if (!config.current_weather) throw new Error("current_weather is required");
    this.config = config;
    void this.subscribeData();
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.clock = window.setInterval(() => (this.now = new Date()), 10_000);
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.clock) window.clearInterval(this.clock);
    this.clearSubscriptions();
  }
  protected updated(changed: Map<string, unknown>): void {
    const previousHass = changed.get("hass") as Hass | undefined;
    if (changed.has("hass") && previousHass?.connection !== this.hass?.connection) void this.subscribeData();
  }

  private clearSubscriptions(): void {
    this.unsubscribers.splice(0).forEach((unsubscribe) => unsubscribe());
    this.eventsByCalendar.clear();
  }
  private async subscribeData(): Promise<void> {
    if (!this.hass || !this.config) return;
    this.clearSubscriptions();
    const subscribe = async (entity: string, forecastType: "hourly" | "daily", setter: (data: Forecast[]) => void) => {
      try {
        const unsubscribe = await this.hass!.connection.subscribeMessage(
          (message) => setter(message.forecast ?? message.event?.forecast ?? []),
          { type: "weather/subscribe_forecast", entity_id: entity, forecast_type: forecastType },
        );
        this.unsubscribers.push(unsubscribe);
      } catch { setter([]); }
    };
    await Promise.all([
      subscribe(this.config.hourly_weather ?? this.config.current_weather, "hourly", (data) => (this.hourly = data)),
      subscribe(this.config.daily_weather ?? this.config.current_weather, "daily", (data) => (this.daily = data)),
      ...((this.config.calendars ?? []).map((entity) => this.subscribeCalendar(entity))),
    ]);
  }
  private async subscribeCalendar(entity: string): Promise<void> {
    if (!this.hass) return;
    const start = new Date(this.now); start.setHours(0, 0, 0, 0);
    const end = new Date(start); end.setDate(end.getDate() + 1);
    try {
      const unsubscribe = await this.hass.connection.subscribeMessage((message) => {
        const incoming = (message.events ?? message.event?.events ?? []) as CalendarEvent[];
        this.eventsByCalendar.set(entity, incoming);
        this.events = [...this.eventsByCalendar.values()].flat().sort((a, b) => String(a.start).localeCompare(String(b.start)));
      }, { type: "calendar/event/subscribe", entity_id: entity, start: start.toISOString(), end: end.toISOString() });
      this.unsubscribers.push(unsubscribe);
    } catch { /* Calendar support is optional. */ }
  }

  private t(key: keyof typeof en.card, fallback: string): string {
    const dictionary = this.locale().toLowerCase().startsWith("fi") ? fi.card : en.card;
    return this.config?.labels?.[key] ?? dictionary[key] ?? fallback;
  }
  private locale(): string { return this.hass?.locale.language ?? navigator.language; }
  private weatherEntity(): HassEntity | undefined { return this.hass?.states[this.config!.current_weather]; }
  private formatTime(date: Date): string {
    return new Intl.DateTimeFormat(this.locale(), { hour: "2-digit", minute: "2-digit", hour12: this.hass?.locale.time_format === "12" }).format(date);
  }
  private icon(condition?: string, date?: string): string {
    const isNight = date ? [21, 22, 23, 0, 1, 2, 3, 4, 5].includes(forecastDate(date).getHours()) : this.now.getHours() < 6 || this.now.getHours() > 20;
    return ICONS[iconName(condition, isNight)] ?? unavailable;
  }
  private conditionLabel(condition?: string): string {
    if (!condition) return "—";
    if (!isKnownCondition(condition)) return `${this.t("unknown_condition", "Unknown condition")}: ${condition}`;
    const dictionary = this.locale().toLowerCase().startsWith("fi") ? fi.conditions : en.conditions;
    return dictionary[condition as keyof typeof en.conditions] ?? condition.replaceAll("-", " ");
  }
  private renderForecast(item: Forecast, daily = false): TemplateResult {
    const unit = (this.weatherEntity()?.attributes.temperature_unit as string | undefined) ?? "°";
    const date = forecastDate(item.datetime);
    const heading = daily
      ? new Intl.DateTimeFormat(this.locale(), { weekday: "short", day: "numeric", month: "numeric" }).format(date)
      : this.formatTime(date);
    return html`<div class="forecast-item">
      <div class="forecast-time">${heading}</div>
      <img class="forecast-icon" src=${this.icon(item.condition, item.datetime)} alt=${item.condition ?? ""} />
      <div class="forecast-temperature">${formatTemperature(item.temperature, unit)}</div>
      ${daily ? nothing : html`<div class="wind">${windArrow(item.wind_bearing)} ${formatWind(item.wind_speed, this.weatherEntity()?.attributes.wind_speed_unit as string ?? "")}</div>${item.wind_gust_speed !== undefined ? html`<div class="gust">💨 ${formatWind(item.wind_gust_speed, this.weatherEntity()?.attributes.wind_speed_unit as string ?? "")}</div>` : nothing}`}
    </div>`;
  }
  render(): TemplateResult {
    if (!this.config || !this.hass) return html``;
    const weather = this.weatherEntity();
    const attributes = weather?.attributes ?? {};
    const condition = weather?.state;
    const unit = (attributes.temperature_unit as string | undefined) ?? "°";
    const temperature = this.config.temperature_entity ? this.hass.states[this.config.temperature_entity]?.state : attributes.temperature;
    const hourly = this.hourly.slice(0, this.config.hourly_forecast_count ?? 5);
    const daily = this.daily.slice(0, this.config.daily_forecast_count ?? 5);
    return html`<ha-card>
      <section class="current" part="current">
        <div class="current-copy">
          <div class="date">${new Intl.DateTimeFormat(this.locale(), { weekday: "long", day: "numeric", month: "long" }).format(this.now)}</div>
          <time class="clock">${this.formatTime(this.now)}</time>
          <div class="condition">${this.conditionLabel(condition)}</div>
          <div class="temperature-row"><div class="temperature">${formatTemperature(temperature, unit)}</div>
            <div class="sensor-list">${(this.config.sensors ?? []).map((sensor) => html`<div>${sensor.label}: ${formatTemperature(this.hass?.states[sensor.entity]?.state, sensor.unit ?? unit)}</div>`)}</div>
          </div>
          <div class="wind-details">${windArrow(attributes.wind_bearing as number | string)} ${formatWind(attributes.wind_speed, attributes.wind_speed_unit as string ?? "")}${attributes.wind_gust_speed !== undefined ? html`<span>💨 ${formatWind(attributes.wind_gust_speed, attributes.wind_speed_unit as string ?? "")}</span>` : nothing}</div>
        </div>
        <img class="current-icon" src=${this.icon(condition)} alt=${condition ?? ""} />
      </section>
      ${this.config.show_calendar !== false ? html`<section class="calendar" part="calendar"><ha-icon icon=${this.config.calendar_icon ?? "mdi:calendar-today"}></ha-icon><div><strong>${this.config.calendar_title ?? this.t("today", "Today")}</strong>${this.events.length ? this.events.map((event) => html`<div>${this.eventTime(event)} ${event.summary ?? ""}</div>`) : html`<div class="muted">${this.t("no_events", "No events today")}</div>`}</div></section>` : nothing}
      ${hourly.length ? html`<section class="forecast hourly" part="hourly-forecast">${hourly.map((item) => this.renderForecast(item))}</section>` : nothing}
      ${daily.length ? html`<section class="forecast daily" part="daily-forecast">${daily.map((item) => this.renderForecast(item, true))}</section>` : nothing}
    </ha-card>`;
  }
  private eventTime(event: CalendarEvent): string {
    if (!event.start.includes("T")) return this.t("all_day", "All day");
    return this.formatTime(new Date(event.start));
  }

  static styles = css`
    :host { display:block; --weather-clock-accent: var(--primary-color); --weather-clock-icon-size: 112px; --weather-clock-clock-size: 4.8rem; }
    ha-card { overflow:hidden; color:var(--primary-text-color); background:var(--ha-card-background, var(--card-background-color)); border-radius:var(--ha-card-border-radius, 24px); }
    section { box-sizing:border-box; } .current { display:flex; justify-content:space-between; gap:16px; padding:22px 28px; } .date,.condition { font-weight:700; text-transform:uppercase; letter-spacing:.02em; } .date { font-size:1.15rem; } .clock { display:block; font-size:var(--weather-clock-clock-size); font-weight:800; line-height:1; margin:8px 0 22px; letter-spacing:-.06em; } .condition { font-size:1.15rem; } .temperature-row { display:flex; align-items:center; gap:18px; margin:5px 0 10px; } .temperature { font-size:3.25rem; font-weight:800; letter-spacing:-.06em; } .sensor-list { font-weight:700; line-height:1.45; } .wind-details { font-weight:700; } .wind-details span { margin-left:12px; } .current-icon { width:var(--weather-clock-icon-size); min-width:var(--weather-clock-icon-size); object-fit:contain; }
    .calendar { display:flex; gap:16px; align-items:flex-start; padding:14px 28px; border-top:1px solid var(--divider-color); border-bottom:1px solid var(--divider-color); } .calendar ha-icon { color:var(--weather-clock-accent); } .calendar strong { display:block; margin-bottom:3px; } .muted { color:var(--secondary-text-color); }
    .forecast { display:flex; justify-content:space-around; gap:8px; padding:20px 18px; } .daily { border-top:1px solid var(--divider-color); } .forecast-item { flex:1 1 0; min-width:0; text-align:center; font-weight:700; } .forecast-time { min-height:2.3em; font-size:1.05rem; text-transform:capitalize; } .forecast-icon { display:block; width:56px; height:56px; object-fit:contain; margin:6px auto; } .forecast-temperature { font-size:1.45rem; } .wind,.gust { white-space:nowrap; margin-top:6px; font-size:.9rem; }
    @media (max-width: 500px) { .current { padding:22px; } .calendar { padding:14px 22px; } .clock { font-size:3.7rem; } .forecast { padding:18px 8px; gap:2px; } .forecast-icon { width:46px; height:46px; } .forecast-time { font-size:.85rem; } .forecast-temperature { font-size:1.25rem; } .wind,.gust { font-size:.75rem; } }
  `;
}

@customElement("weather-clock-card-editor")
class WeatherClockCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: Hass;
  @state() private config: CardConfig = { current_weather: "" };
  public setConfig(config: CardConfig): void {
    this.config = { type: "custom:weather-clock-card", ...config };
  }
  private change(): void {
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this.config }, bubbles: true, composed: true }));
  }
  private label(key: keyof typeof en.editor): string {
    const dictionary = this.hass?.locale.language.toLowerCase().startsWith("fi") ? fi.editor : en.editor;
    return dictionary[key] ?? en.editor[key];
  }
  render() { return html`<ha-card><div class="editor"><ha-form .hass=${this.hass} .data=${this.config} .computeLabel=${(schema: { name: string }) => this.label(schema.name as keyof typeof en.editor)} .schema=${[
    { name: "current_weather", required: true, selector: { entity: { domain: "weather" } } },
    { name: "hourly_weather", selector: { entity: { domain: "weather" } } },
    { name: "daily_weather", selector: { entity: { domain: "weather" } } },
    { name: "temperature_entity", selector: { entity: { domain: "sensor" } } },
    { name: "calendars", selector: { entity: { domain: "calendar", multiple: true } } },
    { name: "hourly_forecast_count", selector: { number: { min: 1, max: 12, mode: "box" } } },
    { name: "daily_forecast_count", selector: { number: { min: 1, max: 12, mode: "box" } } },
    { name: "show_calendar", selector: { boolean: {} } },
    { name: "calendar_title", selector: { text: {} } },
    { name: "calendar_icon", selector: { icon: {} } },
  ]} @value-changed=${(event: CustomEvent) => { this.config = { ...this.config, ...event.detail.value }; this.change(); }}></ha-form><p>${this.hass?.locale.language.toLowerCase().startsWith("fi") ? "Määritä nimetyt lisäsensorit YAMLissa sensors:-avaimella." : "Configure additional named sensors in YAML with the sensors: key."}</p></div></ha-card>`; }
  static styles = css`.editor { padding: 16px; } p { color: var(--secondary-text-color); font-size:.9rem; }`;
}

window.customCards = window.customCards || [];
window.customCards.push({ type: "weather-clock-card", name: "Weather Clock Card", description: "Clock, weather forecasts and today's calendar events." });
