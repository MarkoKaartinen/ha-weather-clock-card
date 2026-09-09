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
  connection: { subscribeMessage: (callback: (message: any) => void, message: Record<string, unknown>, options?: Record<string, unknown>) => Promise<() => void> };
  callService: <T = unknown>(domain: string, service: string, data?: Record<string, unknown>, target?: Record<string, unknown>, returnResponse?: boolean) => Promise<T>;
  callWS: <T = unknown>(message: Record<string, unknown>) => Promise<T>;
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
  show_hourly_forecast?: boolean;
  show_daily_forecast?: boolean;
  show_calendar?: boolean;
  show_calendar_icon?: boolean;
  calendar_title?: string;
  calendar_icon?: string;
  labels?: Record<string, string>;
};
type CalendarEvent = { summary?: string; start: string; end: string };
type ActionResult<T> = { response?: T };
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
  private refreshTimer?: number;
  private needsInitialData = true;
  private refreshQueued = false;
  private dataVersion = 0;

  static getConfigElement() { return document.createElement("weather-clock-card-editor"); }
  static getStubConfig() { return { current_weather: "weather.home" }; }
  static getConfigForm() { return undefined; }
  getCardSize() { return 6; }
  getGridOptions() { return { columns: 6, min_columns: 3 }; }

  public setConfig(config: CardConfig): void {
    if (!config.current_weather) throw new Error("current_weather is required");
    this.config = config;
    this.dataVersion += 1;
    this.needsInitialData = true;
    this.queueInitialDataLoad();
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.scheduleClock();
    // Forecasts are kept fresh by the WebSocket subscription. Only calendar
    // events need a timed refresh (for example when the date rolls over).
    this.needsInitialData = true;
    this.refreshTimer = window.setInterval(() => void this.fetchCalendars(), 15 * 60 * 1000);
    this.queueInitialDataLoad();
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.clock) window.clearTimeout(this.clock);
    if (this.refreshTimer) window.clearInterval(this.refreshTimer);
    this.clearSubscriptions();
  }
  protected updated(changed: Map<string, unknown>): void {
    if (changed.has("hass")) this.queueInitialDataLoad();
  }

  private queueInitialDataLoad(): void {
    if (!this.needsInitialData || this.refreshQueued || !this.hass || !this.config) return;
    this.refreshQueued = true;
    queueMicrotask(async () => {
      this.refreshQueued = false;
      const version = this.dataVersion;
      await this.subscribeData();
      if (version === this.dataVersion) this.needsInitialData = false;
      else this.queueInitialDataLoad();
    });
  }

  private scheduleClock(): void {
    this.now = new Date();
    this.requestUpdate();
    const delay = 60_000 - (Date.now() % 60_000) + 25;
    this.clock = window.setTimeout(() => this.scheduleClock(), delay);
  }

  private clearSubscriptions(): void {
    this.unsubscribers.splice(0).forEach((unsubscribe) => unsubscribe());
    this.eventsByCalendar.clear();
  }
  private async subscribeData(): Promise<void> {
    if (!this.hass || !this.config) return;
    this.clearSubscriptions();
    // Some integrations still expose their latest forecast in the entity
    // attributes. Render that cached value synchronously so editor previews
    // and a freshly opened dashboard do not start out empty.
    this.loadCachedForecast(this.config.hourly_weather ?? this.config.current_weather, (data) => (this.hourly = data));
    this.loadCachedForecast(this.config.daily_weather ?? this.config.current_weather, (data) => (this.daily = data));
    // The service response supplies the first frame, while the subscription
    // keeps it live afterwards. Either route can win without leaving the card
    // blank on integrations with a delayed subscription response.
    await Promise.all([
      this.fetchForecast(this.config.hourly_weather ?? this.config.current_weather, "hourly", (data) => (this.hourly = data)),
      this.fetchForecast(this.config.daily_weather ?? this.config.current_weather, "daily", (data) => (this.daily = data)),
      this.subscribeLiveUpdates(),
      this.fetchCalendars(),
    ]);
  }
  private loadCachedForecast(entity: string, setter: (data: Forecast[]) => void): void {
    const forecast = this.hass?.states[entity]?.attributes.forecast;
    if (Array.isArray(forecast)) setter(forecast as Forecast[]);
  }
  private async fetchForecast(entity: string, forecastType: "hourly" | "daily", setter: (data: Forecast[]) => void): Promise<void> {
    if (!this.hass) return;
    try {
      const actionResult = await this.hass.callWS<ActionResult<Record<string, { forecast?: Forecast[] }>>>({
        type: "call_service", domain: "weather", service: "get_forecasts",
        service_data: { type: forecastType }, target: { entity_id: entity }, return_response: true,
      });
      const forecast = actionResult.response?.[entity]?.forecast;
      if (forecast) setter(forecast);
    } catch (error) {
      console.warn("Weather Clock Card could not load initial forecast", forecastType, entity, error);
    }
  }
  private async fetchCalendars(): Promise<void> {
    if (!this.hass || !this.config) return;
    const start = new Date(this.now); start.setHours(0, 0, 0, 0);
    const end = new Date(start); end.setDate(end.getDate() + 1);
    const calendars = this.config.calendars ?? [];
    const responses = await Promise.all(calendars.map(async (entity) => {
      try {
        const actionResult = await this.hass!.callWS<ActionResult<Record<string, { events?: CalendarEvent[] }>>>({
          type: "call_service", domain: "calendar", service: "get_events",
          service_data: { start_date_time: start.toISOString(), end_date_time: end.toISOString() }, target: { entity_id: entity }, return_response: true,
        });
        const events = actionResult.response?.[entity]?.events ?? [];
        if (events.length) return events;
      } catch { /* A calendar can expose only its next-event message. */ }
      const message = this.hass?.states[entity]?.attributes.message;
      return typeof message === "string" && message ? [{ summary: message, start: start.toISOString(), end: end.toISOString() }] : [];
    }));
    this.events = responses.flat().sort((a, b) => String(a.start).localeCompare(String(b.start)));
  }
  /* Kept for newer HA instances that push calendar changes immediately. */
  private async subscribeLiveUpdates(): Promise<void> {
    if (!this.hass || !this.config) return;
    const subscribe = async (entity: string, forecastType: "hourly" | "daily", setter: (data: Forecast[]) => void) => {
      try {
        const unsubscribe = await this.hass!.connection.subscribeMessage(
          (message) => setter(message.forecast ?? message.event?.forecast ?? []),
          { type: "weather/subscribe_forecast", entity_id: entity, forecast_type: forecastType },
          { resubscribe: false },
        );
        this.unsubscribers.push(unsubscribe);
      } catch (error) {
        console.warn("Weather Clock Card could not subscribe to forecast", forecastType, entity, error);
      }
    };
    await Promise.all([subscribe(this.config.hourly_weather ?? this.config.current_weather, "hourly", (data) => (this.hourly = data)), subscribe(this.config.daily_weather ?? this.config.current_weather, "daily", (data) => (this.daily = data))]);
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
    const hourly = this.hourly
      .filter((item) => forecastDate(item.datetime).getTime() > this.now.getTime())
      .slice(0, this.config.hourly_forecast_count ?? 5);
    const today = new Date(this.now); today.setHours(0, 0, 0, 0);
    const daily = this.daily
      .filter((item) => { const date = forecastDate(item.datetime); date.setHours(0, 0, 0, 0); return date.getTime() > today.getTime(); })
      .slice(0, this.config.daily_forecast_count ?? 5);
    const calendarEvents = this.events.length ? this.events : (this.config.calendars ?? []).flatMap((entity) => {
      const message = this.hass?.states[entity]?.attributes.message;
      return typeof message === "string" && message ? [{ summary: message, start: "", end: "" }] : [];
    });
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
      ${this.config.show_calendar !== false ? html`<section class="calendar" part="calendar">${this.config.show_calendar_icon ? html`<ha-icon icon=${this.config.calendar_icon ?? "mdi:calendar-today"}></ha-icon>` : nothing}<div><strong>${this.config.calendar_title ?? this.t("today", "Today")}</strong>${calendarEvents.length ? calendarEvents.map((event) => html`<div>${event.start?.includes("T") ? `${this.eventTime(event)} ` : ""}${event.summary ?? ""}</div>`) : html`<div class="muted">${this.t("no_events", "No events today")}</div>`}</div></section>` : nothing}
      ${this.config.show_hourly_forecast !== false && hourly.length ? html`<section class="forecast hourly" part="hourly-forecast">${hourly.map((item) => this.renderForecast(item))}</section>` : nothing}
      ${this.config.show_daily_forecast !== false && daily.length ? html`<section class="forecast daily" part="daily-forecast">${daily.map((item) => this.renderForecast(item, true))}</section>` : nothing}
    </ha-card>`;
  }
  private eventTime(event: CalendarEvent): string {
    if (!event.start.includes("T")) return this.t("all_day", "All day");
    return this.formatTime(new Date(event.start));
  }

  static styles = css`
    :host { display:block; align-self:start; --weather-clock-accent: var(--primary-color); --weather-clock-icon-size: 170px; --weather-clock-clock-size: 60px; }
    ha-card { height:auto; overflow:hidden; color:var(--primary-text-color); background:var(--ha-card-background, var(--card-background-color)); border-radius:var(--ha-card-border-radius, 24px); }
    section { box-sizing:border-box; } .current { display:flex; align-items:center; justify-content:space-between; gap:16px; padding:12px 24px; } .date,.condition { font-weight:700; text-transform:uppercase; letter-spacing:.02em; } .date { font-size:1rem; } .clock { display:block; font-size:var(--weather-clock-clock-size); font-weight:800; line-height:1; margin:4px 0 12px; letter-spacing:-.06em; } .condition { font-size:1rem; } .temperature-row { display:flex; align-items:center; gap:16px; margin:4px 0 8px; } .temperature { font-size:40px; font-weight:800; line-height:1; letter-spacing:-.06em; } .sensor-list { font-size:14px; font-weight:700; line-height:1.35; text-transform:uppercase; } .wind-details { font-size:14px; font-weight:700; } .wind-details span { margin-left:8px; } .current-icon { width:var(--weather-clock-icon-size); min-width:var(--weather-clock-icon-size); height:var(--weather-clock-icon-size); object-fit:contain; }
    .calendar { display:flex; gap:12px; align-items:center; padding:12px 24px; border-top:1px solid var(--divider-color); border-bottom:1px solid var(--divider-color); line-height:1.25; } .calendar ha-icon { color:var(--weather-clock-accent); } .calendar strong { display:block; margin-bottom:0; } .muted { color:var(--secondary-text-color); }
    .forecast { display:flex; align-items:start; justify-content:space-between; gap:8px; padding:12px 16px; } .daily { border-top:1px solid var(--divider-color); } .forecast-item { display:flex; flex:1 1 0; flex-direction:column; align-items:center; gap:2px; min-width:0; align-self:start; text-align:center; font-weight:700; line-height:1.15; } .forecast-time { min-height:0; margin:0; font-size:16px; line-height:1.2; text-transform:capitalize; } .forecast-icon { display:block; width:88px; height:88px; object-fit:contain; margin:-10px auto -8px; } .forecast-temperature { font-size:18px; } .wind,.gust { white-space:nowrap; margin:0; font-size:14px; }
    @media (max-width: 500px) { .current { padding:16px 22px; } .calendar { padding:6px 22px; } .clock { font-size:3.7rem; } .forecast { padding:8px; gap:2px; } .forecast-icon { width:66px; height:66px; margin:-7px auto -6px; } .forecast-time { font-size:.85rem; } .forecast-temperature { font-size:1.25rem; } .wind,.gust { font-size:.75rem; } }
  `;
}

@customElement("weather-clock-card-editor")
class WeatherClockCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: Hass;
  @state() private config: CardConfig = { current_weather: "" };
  public setConfig(config: CardConfig): void {
    this.config = { type: "custom:weather-clock-card", show_hourly_forecast: true, show_daily_forecast: true, ...config };
    this.requestUpdate();
  }
  private change(): void {
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this.config }, bubbles: true, composed: true }));
  }
  private label(key: keyof typeof en.editor): string {
    const dictionary = this.hass?.locale.language.toLowerCase().startsWith("fi") ? fi.editor : en.editor;
    return dictionary[key] ?? en.editor[key];
  }
  private get formData(): Omit<CardConfig, "type"> {
    const { type: _type, ...data } = this.config;
    return data;
  }
  private updateSensors(sensors: SensorConfig[]): void {
    this.config = { ...this.config, sensors };
    this.change();
  }
  private renderSensors() {
    const sensors = this.config.sensors ?? [];
    const language = this.hass?.locale.language.toLowerCase().startsWith("fi");
    return html`<div class="sensors"><h3>${language ? "Lisäsensorit" : "Additional sensors"}</h3>
      ${sensors.map((sensor, index) => html`<div class="sensor-row">
        <ha-form .hass=${this.hass} .data=${sensor} .schema=${[
          { name: "entity", selector: { entity: { domain: "sensor" } } },
          { name: "label", selector: { text: {} } },
        ]} .computeLabel=${(schema: { name: string }) => schema.name === "entity" ? (language ? "Sensori" : "Sensor") : (language ? "Otsikko" : "Label")}
          @value-changed=${(event: CustomEvent) => this.updateSensors(sensors.map((item, itemIndex) => itemIndex === index ? event.detail.value : item))}></ha-form>
        <button class="remove" @click=${() => this.updateSensors(sensors.filter((_, itemIndex) => itemIndex !== index))} aria-label="Remove sensor">×</button>
      </div>`)}
      ${sensors.length < 3 ? html`<button class="add" @click=${() => this.updateSensors([...sensors, { entity: "", label: "" }])}>${language ? "Lisää sensori" : "Add sensor"}</button>` : nothing}
    </div>`;
  }
  render() { return html`<ha-card><div class="editor"><ha-form .hass=${this.hass} .data=${this.formData} .computeLabel=${(schema: { name: string }) => this.label(schema.name as keyof typeof en.editor)} .schema=${[
    { name: "current_weather", required: true, selector: { entity: { domain: "weather" } } },
    { name: "hourly_weather", selector: { entity: { domain: "weather" } } },
    { name: "daily_weather", selector: { entity: { domain: "weather" } } },
    { name: "temperature_entity", selector: { entity: { domain: "sensor" } } },
    { name: "calendars", selector: { entity: { domain: "calendar", multiple: true } } },
    { name: "hourly_forecast_count", selector: { number: { min: 1, max: 12, mode: "box" } } },
    { name: "daily_forecast_count", selector: { number: { min: 1, max: 12, mode: "box" } } },
    { name: "show_hourly_forecast", selector: { boolean: {} } },
    { name: "show_daily_forecast", selector: { boolean: {} } },
    { name: "show_calendar", selector: { boolean: {} } },
    { name: "show_calendar_icon", selector: { boolean: {} } },
    { name: "calendar_title", selector: { text: {} } },
    { name: "calendar_icon", selector: { icon: {} } },
  ]} @value-changed=${(event: CustomEvent) => { this.config = { ...this.config, ...event.detail.value }; this.change(); }}></ha-form>${this.renderSensors()}</div></ha-card>`; }
  static styles = css`.editor { padding: 16px; } .sensors { border-top: 1px solid var(--divider-color); margin-top: 18px; padding-top: 14px; } h3 { margin:0 0 10px; font-size:1rem; } .sensor-row { display:grid; grid-template-columns:1fr auto; align-items:start; gap:8px; margin:8px 0; } .remove,.add { border:0; border-radius:8px; background:var(--secondary-background-color); color:var(--primary-text-color); cursor:pointer; font:inherit; padding:8px 12px; } .remove { font-size:1.35rem; line-height:1; }`;
}

window.customCards = window.customCards || [];
window.customCards.push({ type: "weather-clock-card", name: "Weather Clock Card", description: "Clock, weather forecasts and today's calendar events." });
