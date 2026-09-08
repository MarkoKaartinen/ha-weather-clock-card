var x2 = Object.defineProperty;
var E2 = (n, e, t) => e in n ? x2(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var C = (n, e, t) => E2(n, typeof e != "symbol" ? e + "" : e, t);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const I = globalThis, Q = I.ShadowRoot && (I.ShadyCSS === void 0 || I.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, X = Symbol(), i2 = /* @__PURE__ */ new WeakMap();
let m2 = class {
  constructor(e, t, i) {
    if (this._$cssResult$ = !0, i !== X) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (Q && e === void 0) {
      const i = t !== void 0 && t.length === 1;
      i && (e = i2.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && i2.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const M2 = (n) => new m2(typeof n == "string" ? n : n + "", void 0, X), y2 = (n, ...e) => {
  const t = n.length === 1 ? n[0] : e.reduce((i, s, r) => i + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + n[r + 1], n[0]);
  return new m2(t, n, X);
}, T2 = (n, e) => {
  if (Q) n.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const i = document.createElement("style"), s = I.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = t.cssText, n.appendChild(i);
  }
}, s2 = Q ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const i of e.cssRules) t += i.cssText;
  return M2(t);
})(n) : n;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: N2, defineProperty: P2, getOwnPropertyDescriptor: H2, getOwnPropertyNames: O2, getOwnPropertySymbols: U2, getPrototypeOf: D2 } = Object, v = globalThis, n2 = v.trustedTypes, F2 = n2 ? n2.emptyScript : "", W = v.reactiveElementPolyfillSupport, M = (n, e) => n, R = { toAttribute(n, e) {
  switch (e) {
    case Boolean:
      n = n ? F2 : null;
      break;
    case Object:
    case Array:
      n = n == null ? n : JSON.stringify(n);
  }
  return n;
}, fromAttribute(n, e) {
  let t = n;
  switch (e) {
    case Boolean:
      t = n !== null;
      break;
    case Number:
      t = n === null ? null : Number(n);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(n);
      } catch {
        t = null;
      }
  }
  return t;
} }, Y = (n, e) => !N2(n, e), a2 = { attribute: !0, type: String, converter: R, reflect: !1, useDefault: !1, hasChanged: Y };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), v.litPropertyMetadata ?? (v.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let S = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = a2) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(e, i, t);
      s !== void 0 && P2(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, t, i) {
    const { get: s, set: r } = H2(this.prototype, e) ?? { get() {
      return this[t];
    }, set(a) {
      this[t] = a;
    } };
    return { get: s, set(a) {
      const o = s == null ? void 0 : s.call(this);
      r == null || r.call(this, a), this.requestUpdate(e, o, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? a2;
  }
  static _$Ei() {
    if (this.hasOwnProperty(M("elementProperties"))) return;
    const e = D2(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(M("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(M("properties"))) {
      const t = this.properties, i = [...O2(t), ...U2(t)];
      for (const s of i) this.createProperty(s, t[s]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [i, s] of t) this.elementProperties.set(i, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, i] of this.elementProperties) {
      const s = this._$Eu(t, i);
      s !== void 0 && this._$Eh.set(s, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const s of i) t.unshift(s2(s));
    } else e !== void 0 && t.push(s2(e));
    return t;
  }
  static _$Eu(e, t) {
    const i = t.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((t) => t(this));
  }
  addController(e) {
    var t;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((t = e.hostConnected) == null || t.call(e));
  }
  removeController(e) {
    var t;
    (t = this._$EO) == null || t.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const i of t.keys()) this.hasOwnProperty(i) && (e.set(i, this[i]), delete this[i]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return T2(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((t) => {
      var i;
      return (i = t.hostConnected) == null ? void 0 : i.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((t) => {
      var i;
      return (i = t.hostDisconnected) == null ? void 0 : i.call(t);
    });
  }
  attributeChangedCallback(e, t, i) {
    this._$AK(e, i);
  }
  _$ET(e, t) {
    var r;
    const i = this.constructor.elementProperties.get(e), s = this.constructor._$Eu(e, i);
    if (s !== void 0 && i.reflect === !0) {
      const a = (((r = i.converter) == null ? void 0 : r.toAttribute) !== void 0 ? i.converter : R).toAttribute(t, i.type);
      this._$Em = e, a == null ? this.removeAttribute(s) : this.setAttribute(s, a), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var r, a;
    const i = this.constructor, s = i._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const o = i.getPropertyOptions(s), c = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((r = o.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? o.converter : R;
      this._$Em = s;
      const l = c.fromAttribute(t, o.type);
      this[s] = l ?? ((a = this._$Ej) == null ? void 0 : a.get(s)) ?? l, this._$Em = null;
    }
  }
  requestUpdate(e, t, i, s = !1, r) {
    var a;
    if (e !== void 0) {
      const o = this.constructor;
      if (s === !1 && (r = this[e]), i ?? (i = o.getPropertyOptions(e)), !((i.hasChanged ?? Y)(r, t) || i.useDefault && i.reflect && r === ((a = this._$Ej) == null ? void 0 : a.get(e)) && !this.hasAttribute(o._$Eu(e, i)))) return;
      this.C(e, t, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: i, reflect: s, wrapped: r }, a) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), r !== !0 || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (t = void 0), this._$AL.set(e, t)), s === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [r, a] of this._$Ep) this[r] = a;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [r, a] of s) {
        const { wrapped: o } = a, c = this[r];
        o !== !0 || this._$AL.has(r) || c === void 0 || this.C(r, void 0, a, c);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (i = this._$EO) == null || i.forEach((s) => {
        var r;
        return (r = s.hostUpdate) == null ? void 0 : r.call(s);
      }), this.update(t)) : this._$EM();
    } catch (s) {
      throw e = !1, this._$EM(), s;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$EO) == null || t.forEach((i) => {
      var s;
      return (s = i.hostUpdated) == null ? void 0 : s.call(i);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t) => this._$ET(t, this[t]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
S.elementStyles = [], S.shadowRootOptions = { mode: "open" }, S[M("elementProperties")] = /* @__PURE__ */ new Map(), S[M("finalized")] = /* @__PURE__ */ new Map(), W == null || W({ ReactiveElement: S }), (v.reactiveElementVersions ?? (v.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const T = globalThis, r2 = (n) => n, V = T.trustedTypes, o2 = V ? V.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, v2 = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, _2 = "?" + y, Z2 = `<${_2}>`, k = document, N = () => k.createComment(""), P = (n) => n === null || typeof n != "object" && typeof n != "function", e2 = Array.isArray, I2 = (n) => e2(n) || typeof (n == null ? void 0 : n[Symbol.iterator]) == "function", K = `[ 	
\f\r]`, E = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, c2 = /-->/g, l2 = />/g, w = RegExp(`>|${K}(?:([^\\s"'>=/]+)(${K}*=${K}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), d2 = /'/g, h2 = /"/g, w2 = /^(?:script|style|textarea|title)$/i, R2 = (n) => (e, ...t) => ({ _$litType$: n, strings: e, values: t }), p = R2(1), L = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), u2 = /* @__PURE__ */ new WeakMap(), b = k.createTreeWalker(k, 129);
function b2(n, e) {
  if (!e2(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return o2 !== void 0 ? o2.createHTML(e) : e;
}
const V2 = (n, e) => {
  const t = n.length - 1, i = [];
  let s, r = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = E;
  for (let o = 0; o < t; o++) {
    const c = n[o];
    let l, u, d = -1, g = 0;
    for (; g < c.length && (a.lastIndex = g, u = a.exec(c), u !== null); ) g = a.lastIndex, a === E ? u[1] === "!--" ? a = c2 : u[1] !== void 0 ? a = l2 : u[2] !== void 0 ? (w2.test(u[2]) && (s = RegExp("</" + u[2], "g")), a = w) : u[3] !== void 0 && (a = w) : a === w ? u[0] === ">" ? (a = s ?? E, d = -1) : u[1] === void 0 ? d = -2 : (d = a.lastIndex - u[2].length, l = u[1], a = u[3] === void 0 ? w : u[3] === '"' ? h2 : d2) : a === h2 || a === d2 ? a = w : a === c2 || a === l2 ? a = E : (a = w, s = void 0);
    const m = a === w && n[o + 1].startsWith("/>") ? " " : "";
    r += a === E ? c + Z2 : d >= 0 ? (i.push(l), c.slice(0, d) + v2 + c.slice(d) + y + m) : c + y + (d === -2 ? o : m);
  }
  return [b2(n, r + (n[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class H {
  constructor({ strings: e, _$litType$: t }, i) {
    let s;
    this.parts = [];
    let r = 0, a = 0;
    const o = e.length - 1, c = this.parts, [l, u] = V2(e, t);
    if (this.el = H.createElement(l, i), b.currentNode = this.el.content, t === 2 || t === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (s = b.nextNode()) !== null && c.length < o; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const d of s.getAttributeNames()) if (d.endsWith(v2)) {
          const g = u[a++], m = s.getAttribute(d).split(y), F = /([.?@])?(.*)/.exec(g);
          c.push({ type: 1, index: r, name: F[2], strings: m, ctor: F[1] === "." ? B2 : F[1] === "?" ? W2 : F[1] === "@" ? K2 : B }), s.removeAttribute(d);
        } else d.startsWith(y) && (c.push({ type: 6, index: r }), s.removeAttribute(d));
        if (w2.test(s.tagName)) {
          const d = s.textContent.split(y), g = d.length - 1;
          if (g > 0) {
            s.textContent = V ? V.emptyScript : "";
            for (let m = 0; m < g; m++) s.append(d[m], N()), b.nextNode(), c.push({ type: 2, index: ++r });
            s.append(d[g], N());
          }
        }
      } else if (s.nodeType === 8) if (s.data === _2) c.push({ type: 2, index: r });
      else {
        let d = -1;
        for (; (d = s.data.indexOf(y, d + 1)) !== -1; ) c.push({ type: 7, index: r }), d += y.length - 1;
      }
      r++;
    }
  }
  static createElement(e, t) {
    const i = k.createElement("template");
    return i.innerHTML = e, i;
  }
}
function x(n, e, t = n, i) {
  var a, o;
  if (e === L) return e;
  let s = i !== void 0 ? (a = t._$Co) == null ? void 0 : a[i] : t._$Cl;
  const r = P(e) ? void 0 : e._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== r && ((o = s == null ? void 0 : s._$AO) == null || o.call(s, !1), r === void 0 ? s = void 0 : (s = new r(n), s._$AT(n, t, i)), i !== void 0 ? (t._$Co ?? (t._$Co = []))[i] = s : t._$Cl = s), s !== void 0 && (e = x(n, s._$AS(n, e.values), s, i)), e;
}
class z2 {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: i } = this._$AD, s = ((e == null ? void 0 : e.creationScope) ?? k).importNode(t, !0);
    b.currentNode = s;
    let r = b.nextNode(), a = 0, o = 0, c = i[0];
    for (; c !== void 0; ) {
      if (a === c.index) {
        let l;
        c.type === 2 ? l = new U(r, r.nextSibling, this, e) : c.type === 1 ? l = new c.ctor(r, c.name, c.strings, this, e) : c.type === 6 && (l = new j2(r, this, e)), this._$AV.push(l), c = i[++o];
      }
      a !== (c == null ? void 0 : c.index) && (r = b.nextNode(), a++);
    }
    return b.currentNode = k, s;
  }
  p(e) {
    let t = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, t), t += i.strings.length - 2) : i._$AI(e[t])), t++;
  }
}
class U {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, i, s) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = i, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = x(this, e, t), P(e) ? e === h || e == null || e === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : e !== this._$AH && e !== L && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : I2(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== h && P(this._$AH) ? this._$AA.nextSibling.data = e : this.T(k.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var r;
    const { values: t, _$litType$: i } = e, s = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = H.createElement(b2(i.h, i.h[0]), this.options)), i);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === s) this._$AH.p(t);
    else {
      const a = new z2(s, this), o = a.u(this.options);
      a.p(t), this.T(o), this._$AH = a;
    }
  }
  _$AC(e) {
    let t = u2.get(e.strings);
    return t === void 0 && u2.set(e.strings, t = new H(e)), t;
  }
  k(e) {
    e2(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let i, s = 0;
    for (const r of e) s === t.length ? t.push(i = new U(this.O(N()), this.O(N()), this, this.options)) : i = t[s], i._$AI(r), s++;
    s < t.length && (this._$AR(i && i._$AB.nextSibling, s), t.length = s);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, t); e !== this._$AB; ) {
      const s = r2(e).nextSibling;
      r2(e).remove(), e = s;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
  }
}
class B {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, i, s, r) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = e, this.name = t, this._$AM = s, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = h;
  }
  _$AI(e, t = this, i, s) {
    const r = this.strings;
    let a = !1;
    if (r === void 0) e = x(this, e, t, 0), a = !P(e) || e !== this._$AH && e !== L, a && (this._$AH = e);
    else {
      const o = e;
      let c, l;
      for (e = r[0], c = 0; c < r.length - 1; c++) l = x(this, o[i + c], t, c), l === L && (l = this._$AH[c]), a || (a = !P(l) || l !== this._$AH[c]), l === h ? e = h : e !== h && (e += (l ?? "") + r[c + 1]), this._$AH[c] = l;
    }
    a && !s && this.j(e);
  }
  j(e) {
    e === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class B2 extends B {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === h ? void 0 : e;
  }
}
class W2 extends B {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== h);
  }
}
class K2 extends B {
  constructor(e, t, i, s, r) {
    super(e, t, i, s, r), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = x(this, e, t, 0) ?? h) === L) return;
    const i = this._$AH, s = e === h && i !== h || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, r = e !== h && (i === h || s);
    s && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class j2 {
  constructor(e, t, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    x(this, e);
  }
}
const j = T.litHtmlPolyfillSupport;
j == null || j(H, U), (T.litHtmlVersions ?? (T.litHtmlVersions = [])).push("3.3.3");
const q2 = (n, e, t) => {
  const i = (t == null ? void 0 : t.renderBefore) ?? e;
  let s = i._$litPart$;
  if (s === void 0) {
    const r = (t == null ? void 0 : t.renderBefore) ?? null;
    i._$litPart$ = s = new U(e.insertBefore(N(), r), r, void 0, t ?? {});
  }
  return s._$AI(n), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $ = globalThis;
class A extends S {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t;
    const e = super.createRenderRoot();
    return (t = this.renderOptions).renderBefore ?? (t.renderBefore = e.firstChild), e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = q2(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
  }
  render() {
    return L;
  }
}
var f2;
A._$litElement$ = !0, A.finalized = !0, (f2 = $.litElementHydrateSupport) == null || f2.call($, { LitElement: A });
const q = $.litElementPolyfillSupport;
q == null || q({ LitElement: A });
($.litElementVersions ?? ($.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $2 = (n) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(n, e);
  }) : customElements.define(n, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const J2 = { attribute: !0, type: String, converter: R, reflect: !1, hasChanged: Y }, G2 = (n = J2, e, t) => {
  const { kind: i, metadata: s } = t;
  let r = globalThis.litPropertyMetadata.get(s);
  if (r === void 0 && globalThis.litPropertyMetadata.set(s, r = /* @__PURE__ */ new Map()), i === "setter" && ((n = Object.create(n)).wrapped = !0), r.set(t.name, n), i === "accessor") {
    const { name: a } = t;
    return { set(o) {
      const c = e.get.call(this);
      e.set.call(this, o), this.requestUpdate(a, c, n, !0, o);
    }, init(o) {
      return o !== void 0 && this.C(a, void 0, n, o), o;
    } };
  }
  if (i === "setter") {
    const { name: a } = t;
    return function(o) {
      const c = this[a];
      e.call(this, o), this.requestUpdate(a, c, n, !0, o);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function t2(n) {
  return (e, t) => typeof t == "object" ? G2(n, e, t) : ((i, s, r) => {
    const a = s.hasOwnProperty(r);
    return s.constructor.createProperty(r, i), a ? Object.getOwnPropertyDescriptor(s, r) : void 0;
  })(n, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function D(n) {
  return t2({ ...n, state: !0, attribute: !1 });
}
const Q2 = "data:image/svg+xml,%3csvg%20viewBox='0%200%20128%20128'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='clear-day'%3e%3cg%20id='Sun'%3e%3ccircle%20id='Core'%20cx='64'%20cy='63.9999'%20r='18'%20stroke='%23F8AF18'%20stroke-width='4'/%3e%3cpath%20id='Rays'%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M64%2016C65.1046%2016%2066%2016.8954%2066%2018V30C66%2031.1046%2065.1046%2032%2064%2032C62.8954%2032%2062%2031.1046%2062%2030V18C62%2016.8954%2062.8954%2016%2064%2016ZM30.0589%2030.0589C30.8399%2029.2778%2032.1062%2029.2778%2032.8873%2030.0589L41.3726%2038.5442C42.1536%2039.3252%2042.1536%2040.5915%2041.3726%2041.3726C40.5915%2042.1536%2039.3252%2042.1536%2038.5441%2041.3726L30.0589%2032.8873C29.2778%2032.1062%2029.2778%2030.8399%2030.0589%2030.0589ZM97.9411%2030.0589C98.7222%2030.8399%2098.7222%2032.1062%2097.9411%2032.8873L89.4558%2041.3726C88.6748%2042.1536%2087.4085%2042.1536%2086.6274%2041.3726C85.8464%2040.5915%2085.8464%2039.3252%2086.6274%2038.5442L95.1127%2030.0589C95.8937%2029.2778%2097.1601%2029.2778%2097.9411%2030.0589ZM16%2064C16%2062.8954%2016.8954%2062%2018%2062H30C31.1046%2062%2032%2062.8954%2032%2064C32%2065.1046%2031.1046%2066%2030%2066H18C16.8954%2066%2016%2065.1046%2016%2064ZM96%2064C96%2062.8954%2096.8954%2062%2098%2062H110C111.105%2062%20112%2062.8954%20112%2064C112%2065.1046%20111.105%2066%20110%2066H98C96.8954%2066%2096%2065.1046%2096%2064ZM41.3726%2086.6274C42.1536%2087.4085%2042.1536%2088.6748%2041.3726%2089.4558L32.8873%2097.9411C32.1062%2098.7222%2030.8399%2098.7222%2030.0589%2097.9411C29.2778%2097.1601%2029.2778%2095.8937%2030.0589%2095.1127L38.5441%2086.6274C39.3252%2085.8464%2040.5915%2085.8464%2041.3726%2086.6274ZM86.6274%2086.6274C87.4085%2085.8464%2088.6748%2085.8464%2089.4558%2086.6274L97.9411%2095.1127C98.7222%2095.8937%2098.7222%2097.1601%2097.9411%2097.9411C97.1601%2098.7222%2095.8937%2098.7222%2095.1127%2097.9411L86.6274%2089.4558C85.8464%2088.6748%2085.8464%2087.4085%2086.6274%2086.6274ZM64%2096C65.1046%2096%2066%2096.8954%2066%2098V110C66%20111.105%2065.1046%20112%2064%20112C62.8954%20112%2062%20111.105%2062%20110V98C62%2096.8954%2062.8954%2096%2064%2096Z'%20fill='%23F8AF18'%3e%3canimateTransform%20attributeName='transform'%20type='rotate'%20values='0%2064.0%2064.0;360%2064.0%2064.0'%20dur='6s'%20begin='0s'%20repeatCount='indefinite'/%3e%3c/path%3e%3c/g%3e%3c/g%3e%3c/svg%3e", X2 = "data:image/svg+xml,%3csvg%20viewBox='0%200%20128%20128'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='clear-night'%3e%3cg%20id='Moon'%3e%3cpath%20id='Moon_2'%20d='M58.4004%2034.416C54.9191%2055.2254%2072.5264%2074.4529%2093.2227%2074.1201C88.98%2085.6985%2077.7637%2093.9998%2064.5361%2094C47.6469%2094%2034.0001%2080.497%2034%2063.8984C34%2049.3677%2044.4604%2037.2181%2058.4004%2034.416Z'%20stroke='%2372B9D5'%20stroke-width='4'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3canimateTransform%20attributeName='transform'%20type='rotate'%20values='-6%2063.6%2064.2;6%2063.6%2064.2;-6%2063.6%2064.2'%20dur='3s'%20begin='0s'%20repeatCount='indefinite'%20calcMode='spline'%20keySplines='.42%200%20.58%201;%20.42%200%20.58%201'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e", Y2 = "data:image/svg+xml,%3csvg%20viewBox='0%200%20128%20128'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='cloudy'%20clip-path='url(%23clip0_2045_28818)'%3e%3cg%20id='Sky'%3e%3cg%20id='Clouds'%3e%3cg%20id='Cloud'%3e%3cpath%20id='Cloud_2'%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M54.8371%2048.2115C51.0739%2045.9483%2046.3457%2045.7826%2042.4415%2047.6664C41.8837%2047.9355%2041.3428%2048.2465%2040.8239%2048.5991C36.6826%2051.4133%2034.4998%2056.5151%2035.3499%2061.454C28.3907%2062.7689%2023.3936%2069.3412%2024.0614%2076.4076C24.7293%2083.474%2030.8678%2089.0011%2037.9519%2089C37.9516%2089%2037.9522%2089%2037.9519%2089H90.9767C91.8608%2089%2092.7273%2088.908%2093.5669%2088.7333C95.0531%2088.4239%2096.4547%2087.855%2097.7196%2087.0774C99.3131%2086.0979%20100.689%2084.787%20101.744%2083.2465C102.32%2082.4049%20102.801%2081.4947%20103.168%2080.5324C103.705%2079.125%20104%2077.6063%20104%2076.0281C104%2075.9138%20103.998%2075.7997%20103.995%2075.6861C103.84%2069.9006%2099.7434%2065.0366%2094.3906%2063.5447C93.1158%2063.1894%2091.7697%2063.0253%2090.3886%2063.0856C90.7211%2061.752%2090.9017%2060.4069%2090.9409%2059.0706C91.1716%2051.1861%2086.4764%2043.6067%2079.0085%2040.4823C70.2648%2036.824%2059.8274%2040.138%2054.8371%2048.2115ZM90.9767%2084.9973C95.8649%2084.9973%20100%2080.8788%20100%2076.0281C100%2071.6531%2096.6498%2067.9178%2092.4216%2067.2003C92.1196%2067.1491%2091.8131%2067.1132%2091.503%2067.0937C91.1929%2067.0741%2090.8793%2067.0708%2090.5629%2067.0846L87.8866%2067.2014C87.2562%2067.229%2086.6497%2066.9571%2086.2505%2066.4681C85.8513%2065.979%2085.7062%2065.3301%2085.859%2064.7174L86.5076%2062.1165C86.6209%2061.6622%2086.7117%2061.206%2086.7808%2060.7491C87.8172%2053.8959%2083.9585%2046.8917%2077.4656%2044.1752C70.5246%2041.2712%2062.1884%2043.9274%2058.239%2050.3171L57.2003%2051.9975C57.2001%2051.998%2057.1998%2051.9984%2057.1995%2051.9989C56.6234%2052.9294%2055.4069%2053.2241%2054.4692%2052.6602L52.7767%2051.6424C49.8116%2049.8592%2045.9319%2049.9664%2043.071%2051.9105C42.7147%2052.1526%2042.3793%2052.4199%2042.0664%2052.7088C39.8756%2054.7312%2038.7824%2057.8152%2039.2918%2060.7745L39.6259%2062.7154C39.626%2062.7158%2039.626%2062.7162%2039.6261%2062.7166C39.8107%2063.7928%2039.0991%2064.8185%2038.0269%2065.0216C38.0266%2065.0217%2038.0271%2065.0216%2038.0269%2065.0216L36.092%2065.3872C31.1413%2066.3226%2027.5724%2071.0449%2028.0437%2076.0307C28.5152%2081.0199%2032.9092%2084.9983%2037.9519%2084.9973H90.9767Z'%20fill='%23E6EFFC'/%3e%3c/g%3e%3canimateTransform%20attributeName='transform'%20type='translate'%20values='0%200;0%20-3;0%200'%20dur='3s'%20begin='0s'%20repeatCount='indefinite'%20calcMode='spline'%20keySplines='.42%200%20.58%201;%20.42%200%20.58%201'/%3e%3c/g%3e%3c/g%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_2045_28818'%3e%3crect%20width='128'%20height='128'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e", e0 = "data:image/svg+xml,%3csvg%20viewBox='0%200%20128%20128'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='drizzle'%20clip-path='url(%23clip0_2045_28873)'%3e%3cg%20id='Sky'%3e%3cg%20id='Clouds'%3e%3cg%20id='Cloud'%3e%3cpath%20id='Cloud_2'%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M54.8371%2048.2115C59.8274%2040.138%2070.2648%2036.824%2079.0085%2040.4823C87.7416%2044.136%2092.6836%2053.8827%2090.3886%2063.0856C97.6828%2062.7671%20104%2068.7067%20104%2076.0281C104%2083.1158%2098.0476%2089%2090.9767%2089C89.8721%2089%2088.9767%2088.104%2088.9767%2086.9986C88.9767%2085.8933%2089.8721%2084.9973%2090.9767%2084.9973C95.8637%2084.9973%20100%2080.8799%20100%2076.0281C100%2071.0262%2095.6222%2066.8637%2090.5629%2067.0846L87.8866%2067.2014C87.2562%2067.229%2086.6497%2066.9571%2086.2505%2066.4681C85.8513%2065.979%2085.7062%2065.3301%2085.859%2064.7174L86.5076%2062.1165C88.3201%2054.8484%2084.391%2047.0727%2077.4656%2044.1752C70.5248%2041.2713%2062.1886%2043.9272%2058.239%2050.3171L57.2003%2051.9975C56.6245%2052.9291%2055.4074%2053.2244%2054.4692%2052.6602L52.7767%2051.6424C49.8116%2049.8592%2045.9319%2049.9664%2043.071%2051.9105C40.2208%2053.8474%2038.7096%2057.3922%2039.2918%2060.7745L39.6259%2062.7154C39.8113%2063.7924%2039.0991%2064.819%2038.026%2065.0218L36.092%2065.3872C31.1421%2066.3225%2027.5723%2071.0441%2028.0437%2076.0307C28.5153%2081.0207%2032.91%2084.9983%2037.9519%2084.9973C39.0565%2084.997%2039.9521%2085.8929%2039.9524%2086.9982C39.9526%2088.1035%2039.0573%2088.9998%2037.9528%2089C30.8695%2089.0015%2024.7294%2083.4755%2024.0614%2076.4076C23.3936%2069.3412%2028.3907%2062.7689%2035.3499%2061.454C34.4997%2056.5148%2036.6828%2051.4131%2040.8239%2048.5991C44.9752%2045.7781%2050.5363%2045.625%2054.8371%2048.2115Z'%20fill='%23E6EFFC'/%3e%3c/g%3e%3canimateTransform%20attributeName='transform'%20type='translate'%20values='0%200;0%20-3;0%200'%20dur='3s'%20begin='0s'%20repeatCount='indefinite'%20calcMode='spline'%20keySplines='.42%200%20.58%201;%20.42%200%20.58%201'/%3e%3c/g%3e%3c/g%3e%3cg%20id='Precipitation'%3e%3cg%20id='Raindrops'%3e%3cpath%20id='Raindrop%201'%20d='M52%2087V90'%20stroke='%230A5AD4'%20stroke-width='4'%20stroke-linecap='round'%3e%3canimateTransform%20attributeName='transform'%20type='translate'%20values='0%200;0%2020'%20dur='1s'%20begin='0s'%20repeatCount='indefinite'%20calcMode='spline'%20keySplines='.42%200%201%201'/%3e%3canimate%20attributeName='opacity'%20values='0;1;1;0'%20dur='1s'%20begin='0s'%20repeatCount='indefinite'%20keyTimes='0;0.15;0.85;1'/%3e%3c/path%3e%3cpath%20id='Raindrop%202'%20d='M64%2087V90'%20stroke='%230A5AD4'%20stroke-width='4'%20stroke-linecap='round'%20opacity='0'%3e%3canimateTransform%20attributeName='transform'%20type='translate'%20values='0%200;0%2020'%20dur='1s'%20begin='0.4s'%20repeatCount='indefinite'%20calcMode='spline'%20keySplines='.42%200%201%201'/%3e%3canimate%20attributeName='opacity'%20values='0;1;1;0'%20dur='1s'%20begin='0.4s'%20repeatCount='indefinite'%20keyTimes='0;0.15;0.85;1'/%3e%3c/path%3e%3cpath%20id='Raindrop%203'%20d='M76%2087V90'%20stroke='%230A5AD4'%20stroke-width='4'%20stroke-linecap='round'%20opacity='0'%3e%3canimateTransform%20attributeName='transform'%20type='translate'%20values='0%200;0%2020'%20dur='1s'%20begin='0.8s'%20repeatCount='indefinite'%20calcMode='spline'%20keySplines='.42%200%201%201'/%3e%3canimate%20attributeName='opacity'%20values='0;1;1;0'%20dur='1s'%20begin='0.8s'%20repeatCount='indefinite'%20keyTimes='0;0.15;0.85;1'/%3e%3c/path%3e%3c/g%3e%3c/g%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_2045_28873'%3e%3crect%20width='128'%20height='128'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e", t0 = "data:image/svg+xml,%3csvg%20viewBox='0%200%20128%20128'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='fog'%20clip-path='url(%23clip0_2045_29038)'%3e%3cg%20id='Sky'%3e%3cg%20id='Clouds'%3e%3cg%20id='Cloud'%3e%3cpath%20id='Cloud_2'%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M54.8371%2048.2115C59.8274%2040.138%2070.2648%2036.824%2079.0085%2040.4823C87.7416%2044.136%2092.6836%2053.8827%2090.3886%2063.0856C97.6828%2062.7671%20104%2068.7067%20104%2076.0281C104%2083.1158%2098.0476%2089%2090.9767%2089C89.8721%2089%2088.9767%2088.104%2088.9767%2086.9986C88.9767%2085.8933%2089.8721%2084.9973%2090.9767%2084.9973C95.8637%2084.9973%20100%2080.8799%20100%2076.0281C100%2071.0262%2095.6222%2066.8637%2090.5629%2067.0846L87.8866%2067.2014C87.2562%2067.229%2086.6497%2066.9571%2086.2505%2066.4681C85.8513%2065.979%2085.7062%2065.3301%2085.859%2064.7174L86.5076%2062.1165C88.3201%2054.8484%2084.391%2047.0727%2077.4656%2044.1752C70.5248%2041.2713%2062.1886%2043.9272%2058.239%2050.3171L57.2003%2051.9975C56.6245%2052.9291%2055.4074%2053.2244%2054.4692%2052.6602L52.7767%2051.6424C49.8116%2049.8592%2045.9319%2049.9664%2043.071%2051.9105C40.2208%2053.8474%2038.7096%2057.3922%2039.2918%2060.7745L39.6259%2062.7154C39.8113%2063.7924%2039.0991%2064.819%2038.026%2065.0218L36.092%2065.3872C31.1421%2066.3225%2027.5723%2071.0441%2028.0437%2076.0307C28.5153%2081.0207%2032.91%2084.9983%2037.9519%2084.9973C39.0565%2084.997%2039.9521%2085.8929%2039.9524%2086.9982C39.9526%2088.1035%2039.0573%2088.9998%2037.9528%2089C30.8695%2089.0015%2024.7294%2083.4755%2024.0614%2076.4076C23.3936%2069.3412%2028.3907%2062.7689%2035.3499%2061.454C34.4997%2056.5148%2036.6828%2051.4131%2040.8239%2048.5991C44.9752%2045.7781%2050.5363%2045.625%2054.8371%2048.2115Z'%20fill='%23E6EFFC'/%3e%3c/g%3e%3canimateTransform%20attributeName='transform'%20type='translate'%20values='0%200;0%20-3;0%200'%20dur='3s'%20begin='0s'%20repeatCount='indefinite'%20calcMode='spline'%20keySplines='.42%200%20.58%201;%20.42%200%20.58%201'/%3e%3c/g%3e%3c/g%3e%3cg%20id='Precipitation'%3e%3cpath%20id='Line%202'%20d='M40%2095H88'%20stroke='%23E2E8F0'%20stroke-width='3'%20stroke-miterlimit='10'%20stroke-linecap='round'%3e%3canimateTransform%20attributeName='transform'%20type='translate'%20values='0%200;3%200;0%200'%20dur='3s'%20begin='0s'%20repeatCount='indefinite'%20calcMode='spline'%20keySplines='.42%200%20.58%201;%20.42%200%20.58%201'/%3e%3c/path%3e%3cpath%20id='Line%201'%20d='M40%20103H88'%20stroke='%23E2E8F0'%20stroke-width='3'%20stroke-miterlimit='10'%20stroke-linecap='round'%3e%3canimateTransform%20attributeName='transform'%20type='translate'%20values='0%200;3%200;0%200'%20dur='3s'%20begin='0.2s'%20repeatCount='indefinite'%20calcMode='spline'%20keySplines='.42%200%20.58%201;%20.42%200%20.58%201'/%3e%3c/path%3e%3c/g%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_2045_29038'%3e%3crect%20width='128'%20height='128'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e", i0 = "data:image/svg+xml,%3csvg%20viewBox='0%200%20128%20128'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='hail'%20clip-path='url(%23clip0_2045_28906)'%3e%3cg%20id='Sky'%3e%3cg%20id='Clouds'%3e%3cg%20id='Cloud'%3e%3cpath%20id='Cloud_2'%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M54.8371%2048.2115C59.8274%2040.138%2070.2648%2036.824%2079.0085%2040.4823C87.7416%2044.136%2092.6836%2053.8827%2090.3886%2063.0856C97.6828%2062.7671%20104%2068.7067%20104%2076.0281C104%2083.1158%2098.0476%2089%2090.9767%2089C89.8721%2089%2088.9767%2088.104%2088.9767%2086.9986C88.9767%2085.8933%2089.8721%2084.9973%2090.9767%2084.9973C95.8637%2084.9973%20100%2080.8799%20100%2076.0281C100%2071.0262%2095.6222%2066.8637%2090.5629%2067.0846L87.8866%2067.2014C87.2562%2067.229%2086.6497%2066.9571%2086.2505%2066.4681C85.8513%2065.979%2085.7062%2065.3301%2085.859%2064.7174L86.5076%2062.1165C88.3201%2054.8484%2084.391%2047.0727%2077.4656%2044.1752C70.5248%2041.2713%2062.1886%2043.9272%2058.239%2050.3171L57.2003%2051.9975C56.6245%2052.9291%2055.4074%2053.2244%2054.4692%2052.6602L52.7767%2051.6424C49.8116%2049.8592%2045.9319%2049.9664%2043.071%2051.9105C40.2208%2053.8474%2038.7096%2057.3922%2039.2918%2060.7745L39.6259%2062.7154C39.8113%2063.7924%2039.0991%2064.819%2038.026%2065.0218L36.092%2065.3872C31.1421%2066.3225%2027.5723%2071.0441%2028.0437%2076.0307C28.5153%2081.0207%2032.91%2084.9983%2037.9519%2084.9973C39.0565%2084.997%2039.9521%2085.8929%2039.9524%2086.9982C39.9526%2088.1035%2039.0573%2088.9998%2037.9528%2089C30.8695%2089.0015%2024.7294%2083.4755%2024.0614%2076.4076C23.3936%2069.3412%2028.3907%2062.7689%2035.3499%2061.454C34.4997%2056.5148%2036.6828%2051.4131%2040.8239%2048.5991C44.9752%2045.7781%2050.5363%2045.625%2054.8371%2048.2115Z'%20fill='%23E6EFFC'/%3e%3c/g%3e%3canimateTransform%20attributeName='transform'%20type='translate'%20values='0%200;0%20-3;0%200'%20dur='3s'%20begin='0s'%20repeatCount='indefinite'%20calcMode='spline'%20keySplines='.42%200%20.58%201;%20.42%200%20.58%201'/%3e%3c/g%3e%3c/g%3e%3cg%20id='Precipitation'%3e%3cg%20id='Ice%20balls'%3e%3cpath%20id='Ice%20Ball%201'%20d='M52%2086C51.4067%2086%2050.8266%2086.1759%2050.3333%2086.5056C49.8399%2086.8352%2049.4554%2087.3038%2049.2283%2087.852C49.0013%2088.4001%2048.9419%2089.0033%2049.0577%2089.5853C49.1734%2090.1672%2049.4591%2090.7018%2049.8787%2091.1213C50.2983%2091.5409%2050.8329%2091.8266%2051.4148%2091.9424C51.9968%2092.0581%2052.5998%2091.9987%2053.148%2091.7716C53.6961%2091.5446%2054.1647%2091.1601%2054.4944%2090.6667C54.824%2090.1734%2055%2089.5933%2055%2089C55%2088.2044%2054.6839%2087.4413%2054.1213%2086.8787C53.5587%2086.3161%2052.7957%2086%2052%2086Z'%20fill='%2386C3DB'%3e%3canimateTransform%20attributeName='transform'%20type='translate'%20values='0%200;0%2020'%20dur='1s'%20begin='0s'%20repeatCount='indefinite'%20calcMode='spline'%20keySplines='.42%200%201%201'/%3e%3canimate%20attributeName='opacity'%20values='0;1;1;0'%20dur='1s'%20begin='0s'%20repeatCount='indefinite'%20keyTimes='0;0.15;0.85;1'/%3e%3c/path%3e%3cpath%20id='Ice%20Ball%202'%20d='M64%2086C63.4067%2086%2062.8266%2086.1759%2062.3333%2086.5056C61.8399%2086.8352%2061.4554%2087.3038%2061.2283%2087.852C61.0013%2088.4001%2060.9419%2089.0033%2061.0577%2089.5853C61.1734%2090.1672%2061.4591%2090.7018%2061.8787%2091.1213C62.2983%2091.5409%2062.8329%2091.8266%2063.4148%2091.9424C63.9968%2092.0581%2064.5998%2091.9987%2065.148%2091.7716C65.6961%2091.5446%2066.1647%2091.1601%2066.4944%2090.6667C66.824%2090.1734%2067%2089.5933%2067%2089C67%2088.2044%2066.6839%2087.4413%2066.1213%2086.8787C65.5587%2086.3161%2064.7957%2086%2064%2086Z'%20fill='%2386C3DB'%20opacity='0'%3e%3canimateTransform%20attributeName='transform'%20type='translate'%20values='0%200;0%2020'%20dur='1s'%20begin='0.3s'%20repeatCount='indefinite'%20calcMode='spline'%20keySplines='.42%200%201%201'/%3e%3canimate%20attributeName='opacity'%20values='0;1;1;0'%20dur='1s'%20begin='0.3s'%20repeatCount='indefinite'%20keyTimes='0;0.15;0.85;1'/%3e%3c/path%3e%3cpath%20id='Ice%20Ball%203'%20d='M76%2086C75.4067%2086%2074.8266%2086.1759%2074.3333%2086.5056C73.8399%2086.8352%2073.4554%2087.3038%2073.2283%2087.852C73.0013%2088.4001%2072.9419%2089.0033%2073.0577%2089.5853C73.1734%2090.1672%2073.4591%2090.7018%2073.8787%2091.1213C74.2983%2091.5409%2074.8329%2091.8266%2075.4148%2091.9424C75.9968%2092.0581%2076.5998%2091.9987%2077.148%2091.7716C77.6961%2091.5446%2078.1647%2091.1601%2078.4944%2090.6667C78.824%2090.1734%2079%2089.5933%2079%2089C79%2088.2044%2078.6839%2087.4413%2078.1213%2086.8787C77.5587%2086.3161%2076.7957%2086%2076%2086Z'%20fill='%2386C3DB'%20opacity='0'%3e%3canimateTransform%20attributeName='transform'%20type='translate'%20values='0%200;0%2020'%20dur='1s'%20begin='0.6s'%20repeatCount='indefinite'%20calcMode='spline'%20keySplines='.42%200%201%201'/%3e%3canimate%20attributeName='opacity'%20values='0;1;1;0'%20dur='1s'%20begin='0.6s'%20repeatCount='indefinite'%20keyTimes='0;0.15;0.85;1'/%3e%3c/path%3e%3c/g%3e%3c/g%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_2045_28906'%3e%3crect%20width='128'%20height='128'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e", k2 = "data:image/svg+xml,%3csvg%20viewBox='0%200%20128%20128'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='not-available'%20clip-path='url(%23clip0_2045_37842)'%3e%3cg%20id='Text'%20clip-path='url(%23clip1_2045_37842)'%3e%3cpath%20id='Text_2'%20d='M46.8531%2066.166V52.504H52.9252V76H46.7541L38.6031%2062.404V76H32.4981V52.504H38.6031L46.8531%2066.166ZM61.9388%2076H55.9988L65.7668%2052.504H71.7068L61.9388%2076ZM96.8902%2076H90.3892L89.0692%2071.974H81.1492L79.8292%2076H73.3612L81.9412%2052.504H88.4422L96.8902%2076ZM83.6902%2064.252L82.6342%2067.453H87.6172L86.5612%2064.252L85.1092%2059.335L83.6902%2064.252Z'%20fill='%23202939'/%3e%3c/g%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_2045_37842'%3e%3crect%20width='128'%20height='128'%20fill='white'/%3e%3c/clipPath%3e%3cclipPath%20id='clip1_2045_37842'%3e%3crect%20width='128'%20height='128'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e", s0 = "data:image/svg+xml,%3csvg%20viewBox='0%200%20128%20128'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='overcast'%20clip-path='url(%23clip0_2045_28824)'%3e%3cg%20id='Sky'%3e%3cg%20id='Clouds'%20clip-path='url(%23clip1_2045_28824)'%3e%3cg%20id='Mask%20group'%3e%3cmask%20id='mask0_2045_28824'%20style='mask-type:alpha'%20maskUnits='userSpaceOnUse'%20x='0'%20y='0'%20width='128'%20height='128'%3e%3cg%20id='Cloud%20Mask'%3e%3cpath%20id='Subtract'%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M128%200H0V128H128V0ZM37.9519%2093H90.9752C100.227%2093%20107.998%2085.353%20107.998%2076.0281C107.998%2068.0217%20102.305%2061.3501%2094.9248%2059.5512C95.3619%2049.9005%2089.6744%2040.6093%2080.5509%2036.7922C71.1071%2032.8411%2060.0664%2035.6119%2053.5305%2043.2384C48.5702%2041.5956%2042.9815%2042.2957%2038.5741%2045.2907C34.1459%2048.2998%2031.4305%2053.2809%2031.1846%2058.5379C24.0633%2061.463%2019.3278%2068.8506%2020.0776%2076.7839C20.942%2085.9295%2028.8285%2093.0018%2037.9519%2093Z'%20fill='black'%3e%3canimateTransform%20attributeName='transform'%20type='translate'%20values='0%20-3;0%200;0%20-3'%20dur='3s'%20begin='0s'%20repeatCount='indefinite'%20calcMode='spline'%20keySplines='.42%200%20.58%201;%20.42%200%20.58%201'/%3e%3c/path%3e%3canimateTransform%20attributeName='transform'%20type='translate'%20values='0%200;0%20-3;0%200'%20dur='3s'%20begin='0s'%20repeatCount='indefinite'%20calcMode='spline'%20keySplines='.42%200%20.58%201;%20.42%200%20.58%201'/%3e%3c/g%3e%3c/mask%3e%3cg%20mask='url(%23mask0_2045_28824)'%3e%3cg%20id='Secondary%20Cloud'%3e%3cpath%20id='Cloud'%20d='M101.194%2055.5621C102.367%2051.05%2099.7602%2046.4225%2095.5043%2044.7133C91.1919%2042.9813%2085.9612%2044.4743%2083.4186%2048.423C81.2648%2047.1797%2078.496%2047.2496%2076.4119%2048.609C74.3808%2049.934%2073.2434%2052.372%2073.675%2054.7789C70.2998%2055.3911%2067.6874%2058.4688%2068.0307%2061.9561C68.3748%2065.4511%2071.5394%2068.0008%2074.9767%2068C83.8126%2068%2092.6514%2067.9925%20101.488%2068C104.911%2068%20108%2065.2849%20108%2061.774C108%2058.1428%20104.721%2055.4142%20101.194%2055.5621Z'%20fill='%2394A3B8'/%3e%3canimateTransform%20attributeName='transform'%20type='translate'%20values='0%20-3;0%200;0%20-3'%20dur='3s'%20begin='0s'%20repeatCount='indefinite'%20calcMode='spline'%20keySplines='.42%200%20.58%201;%20.42%200%20.58%201'/%3e%3c/g%3e%3c/g%3e%3canimateTransform%20attributeName='transform'%20type='translate'%20values='0%200;0%20-3;0%200'%20dur='3s'%20begin='0s'%20repeatCount='indefinite'%20calcMode='spline'%20keySplines='.42%200%20.58%201;%20.42%200%20.58%201'/%3e%3c/g%3e%3cg%20id='Cloud_2'%3e%3cpath%20id='Cloud_3'%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M54.8371%2048.2115C51.0739%2045.9483%2046.3457%2045.7826%2042.4415%2047.6664C41.8837%2047.9355%2041.3428%2048.2465%2040.8239%2048.5991C36.6826%2051.4133%2034.4998%2056.5151%2035.3499%2061.454C28.3907%2062.7689%2023.3936%2069.3412%2024.0614%2076.4076C24.7293%2083.474%2030.8678%2089.0011%2037.9519%2089C37.9516%2089%2037.9522%2089%2037.9519%2089H90.9767C91.8608%2089%2092.7273%2088.908%2093.5669%2088.7333C95.0531%2088.4239%2096.4547%2087.855%2097.7196%2087.0774C99.3131%2086.0979%20100.689%2084.787%20101.744%2083.2465C102.32%2082.4049%20102.801%2081.4947%20103.168%2080.5324C103.705%2079.125%20104%2077.6063%20104%2076.0281C104%2075.9138%20103.998%2075.7997%20103.995%2075.6861C103.84%2069.9006%2099.7434%2065.0366%2094.3906%2063.5447C93.1158%2063.1894%2091.7697%2063.0253%2090.3886%2063.0856C90.7211%2061.752%2090.9017%2060.4069%2090.9409%2059.0706C91.1716%2051.1861%2086.4764%2043.6067%2079.0085%2040.4823C70.2648%2036.824%2059.8274%2040.138%2054.8371%2048.2115ZM90.9767%2084.9973C95.8649%2084.9973%20100%2080.8788%20100%2076.0281C100%2071.6531%2096.6498%2067.9178%2092.4216%2067.2003C92.1196%2067.1491%2091.8131%2067.1132%2091.503%2067.0937C91.1929%2067.0741%2090.8793%2067.0708%2090.5629%2067.0846L87.8866%2067.2014C87.2562%2067.229%2086.6497%2066.9571%2086.2505%2066.4681C85.8513%2065.979%2085.7062%2065.3301%2085.859%2064.7174L86.5076%2062.1165C86.6209%2061.6622%2086.7117%2061.206%2086.7808%2060.7491C87.8172%2053.8959%2083.9585%2046.8917%2077.4656%2044.1752C70.5246%2041.2712%2062.1884%2043.9274%2058.239%2050.3171L57.2003%2051.9975C57.2001%2051.998%2057.1998%2051.9984%2057.1995%2051.9989C56.6234%2052.9294%2055.4069%2053.2241%2054.4692%2052.6602L52.7767%2051.6424C49.8116%2049.8592%2045.9319%2049.9664%2043.071%2051.9105C42.7147%2052.1526%2042.3793%2052.4199%2042.0664%2052.7088C39.8756%2054.7312%2038.7824%2057.8152%2039.2918%2060.7745L39.6259%2062.7154C39.626%2062.7158%2039.626%2062.7162%2039.6261%2062.7166C39.8107%2063.7928%2039.0991%2064.8185%2038.0269%2065.0216C38.0266%2065.0217%2038.0271%2065.0216%2038.0269%2065.0216L36.092%2065.3872C31.1413%2066.3226%2027.5724%2071.0449%2028.0437%2076.0307C28.5152%2081.0199%2032.9092%2084.9983%2037.9519%2084.9973H90.9767Z'%20fill='%23E6EFFC'/%3e%3canimateTransform%20attributeName='transform'%20type='translate'%20values='0%200;0%20-3;0%200'%20dur='3s'%20begin='0s'%20repeatCount='indefinite'%20calcMode='spline'%20keySplines='.42%200%20.58%201;%20.42%200%20.58%201'/%3e%3c/g%3e%3c/g%3e%3c/g%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_2045_28824'%3e%3crect%20width='128'%20height='128'%20fill='white'/%3e%3c/clipPath%3e%3cclipPath%20id='clip1_2045_28824'%3e%3crect%20width='128'%20height='128'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e", n0 = "data:image/svg+xml,%3csvg%20viewBox='0%200%20128%20128'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='partly-cloudy-day'%20clip-path='url(%23clip0_2045_28820)'%3e%3cg%20id='Sky'%3e%3cg%20id='Mask%20group'%3e%3cmask%20id='mask0_2045_28820'%20style='mask-type:alpha'%20maskUnits='userSpaceOnUse'%20x='0'%20y='0'%20width='128'%20height='128'%3e%3cg%20id='Cloud%20Mask'%3e%3cpath%20id='Subtract'%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M128%200H0V128H128V0ZM37.9519%2093H90.9752C100.227%2093%20107.998%2085.353%20107.998%2076.0281C107.998%2068.0217%20102.305%2061.3501%2094.9248%2059.5512C95.3619%2049.9005%2089.6744%2040.6093%2080.5509%2036.7922C71.1071%2032.8411%2060.0664%2035.6119%2053.5305%2043.2384C48.5702%2041.5956%2042.9815%2042.2957%2038.5741%2045.2907C34.1459%2048.2998%2031.4305%2053.2809%2031.1846%2058.5379C24.0633%2061.463%2019.3278%2068.8506%2020.0776%2076.7839C20.942%2085.9295%2028.8285%2093.0018%2037.9519%2093Z'%20fill='black'/%3e%3canimateTransform%20attributeName='transform'%20type='translate'%20values='0%200;0%20-3;0%200'%20dur='3s'%20begin='0s'%20repeatCount='indefinite'%20calcMode='spline'%20keySplines='.42%200%20.58%201;%20.42%200%20.58%201'/%3e%3c/g%3e%3c/mask%3e%3cg%20mask='url(%23mask0_2045_28820)'%3e%3cg%20id='Sun'%3e%3ccircle%20id='Core'%20cx='39'%20cy='51'%20r='9'%20fill='%23F8AF18'/%3e%3cg%20id='Rays'%3e%3cpath%20d='M37.6875%2031.3125C37.6875%2030.5876%2038.2751%2030%2039%2030C39.7249%2030%2040.3125%2030.5876%2040.3125%2031.3125V37.4375C40.3125%2038.1624%2039.7249%2038.75%2039%2038.75C38.2751%2038.75%2037.6875%2038.1624%2037.6875%2037.4375V31.3125Z'%20fill='%23F8AF18'/%3e%3cpath%20d='M51.9931%2036.1508C52.5056%2035.6382%2053.3367%2035.6382%2053.8492%2036.1508C54.3618%2036.6633%2054.3618%2037.4943%2053.8492%2038.0069L49.5182%2042.3379C49.0056%2042.8505%2048.1746%2042.8505%2047.6621%2042.3379C47.1495%2041.8254%2047.1495%2040.9944%2047.6621%2040.4818L51.9931%2036.1508Z'%20fill='%23F8AF18'/%3e%3cpath%20d='M58.6875%2049.6875C59.4124%2049.6875%2060%2050.2751%2060%2051C60%2051.7249%2059.4124%2052.3125%2058.6875%2052.3125H52.5625C51.8376%2052.3125%2051.25%2051.7249%2051.25%2051C51.25%2050.2751%2051.8376%2049.6875%2052.5625%2049.6875H58.6875Z'%20fill='%23F8AF18'/%3e%3cpath%20d='M53.8492%2063.9931C54.3618%2064.5057%2054.3618%2065.3367%2053.8492%2065.8492C53.3367%2066.3618%2052.5056%2066.3618%2051.9931%2065.8492L47.6621%2061.5182C47.1495%2061.0057%2047.1495%2060.1746%2047.6621%2059.6621C48.1746%2059.1495%2049.0057%2059.1495%2049.5182%2059.6621L53.8492%2063.9931Z'%20fill='%23F8AF18'/%3e%3cpath%20d='M37.6875%2064.5625C37.6875%2063.8376%2038.2751%2063.25%2039%2063.25C39.7249%2063.25%2040.3125%2063.8376%2040.3125%2064.5625V70.6875C40.3125%2071.4124%2039.7249%2072%2039%2072C38.2751%2072%2037.6875%2071.4124%2037.6875%2070.6875V64.5625Z'%20fill='%23F8AF18'/%3e%3cpath%20d='M28.4818%2059.6621C28.9943%2059.1495%2029.8254%2059.1495%2030.3379%2059.6621C30.8505%2060.1746%2030.8505%2061.0056%2030.3379%2061.5182L26.0069%2065.8492C25.4943%2066.3618%2024.6633%2066.3618%2024.1508%2065.8492C23.6382%2065.3367%2023.6382%2064.5056%2024.1508%2063.9931L28.4818%2059.6621Z'%20fill='%23F8AF18'/%3e%3cpath%20d='M25.4375%2049.6875C26.1624%2049.6875%2026.75%2050.2751%2026.75%2051C26.75%2051.7249%2026.1624%2052.3125%2025.4375%2052.3125H19.3125C18.5876%2052.3125%2018%2051.7249%2018%2051C18%2050.2751%2018.5876%2049.6875%2019.3125%2049.6875H25.4375Z'%20fill='%23F8AF18'/%3e%3cpath%20d='M30.3379%2040.4818C30.8505%2040.9944%2030.8505%2041.8254%2030.3379%2042.3379C29.8254%2042.8505%2028.9944%2042.8505%2028.4818%2042.3379L24.1508%2038.0069C23.6382%2037.4944%2023.6382%2036.6633%2024.1508%2036.1508C24.6633%2035.6382%2025.4944%2035.6382%2026.0069%2036.1508L30.3379%2040.4818Z'%20fill='%23F8AF18'/%3e%3canimateTransform%20attributeName='transform'%20type='rotate'%20values='0%2039.0%2051.0;360%2039.0%2051.0'%20dur='6s'%20begin='0s'%20repeatCount='indefinite'/%3e%3c/g%3e%3c/g%3e%3c/g%3e%3c/g%3e%3cg%20id='Clouds'%3e%3cg%20id='Cloud'%3e%3cpath%20id='Cloud_2'%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M54.8371%2048.2115C51.0739%2045.9483%2046.3457%2045.7826%2042.4415%2047.6664C41.8837%2047.9355%2041.3428%2048.2465%2040.8239%2048.5991C36.6826%2051.4133%2034.4998%2056.5151%2035.3499%2061.454C28.3907%2062.7689%2023.3936%2069.3412%2024.0614%2076.4076C24.7293%2083.474%2030.8678%2089.0011%2037.9519%2089C37.9516%2089%2037.9522%2089%2037.9519%2089H90.9767C91.8608%2089%2092.7273%2088.908%2093.5669%2088.7333C95.0531%2088.4239%2096.4547%2087.855%2097.7196%2087.0774C99.3131%2086.0979%20100.689%2084.787%20101.744%2083.2465C102.32%2082.4049%20102.801%2081.4947%20103.168%2080.5324C103.705%2079.125%20104%2077.6063%20104%2076.0281C104%2075.9138%20103.998%2075.7997%20103.995%2075.6861C103.84%2069.9006%2099.7434%2065.0366%2094.3906%2063.5447C93.1158%2063.1894%2091.7697%2063.0253%2090.3886%2063.0856C90.7211%2061.752%2090.9017%2060.4069%2090.9409%2059.0706C91.1716%2051.1861%2086.4764%2043.6067%2079.0085%2040.4823C70.2648%2036.824%2059.8274%2040.138%2054.8371%2048.2115ZM90.9767%2084.9973C95.8649%2084.9973%20100%2080.8788%20100%2076.0281C100%2071.6531%2096.6498%2067.9178%2092.4216%2067.2003C92.1196%2067.1491%2091.8131%2067.1132%2091.503%2067.0937C91.1929%2067.0741%2090.8793%2067.0708%2090.5629%2067.0846L87.8866%2067.2014C87.2562%2067.229%2086.6497%2066.9571%2086.2505%2066.4681C85.8513%2065.979%2085.7062%2065.3301%2085.859%2064.7174L86.5076%2062.1165C86.6209%2061.6622%2086.7117%2061.206%2086.7808%2060.7491C87.8172%2053.8959%2083.9585%2046.8917%2077.4656%2044.1752C70.5246%2041.2712%2062.1884%2043.9274%2058.239%2050.3171L57.2003%2051.9975C57.2001%2051.998%2057.1998%2051.9984%2057.1995%2051.9989C56.6234%2052.9294%2055.4069%2053.2241%2054.4692%2052.6602L52.7767%2051.6424C49.8116%2049.8592%2045.9319%2049.9664%2043.071%2051.9105C42.7147%2052.1526%2042.3793%2052.4199%2042.0664%2052.7088C39.8756%2054.7312%2038.7824%2057.8152%2039.2918%2060.7745L39.6259%2062.7154C39.626%2062.7158%2039.626%2062.7162%2039.6261%2062.7166C39.8107%2063.7928%2039.0991%2064.8185%2038.0269%2065.0216C38.0266%2065.0217%2038.0271%2065.0216%2038.0269%2065.0216L36.092%2065.3872C31.1413%2066.3226%2027.5724%2071.0449%2028.0437%2076.0307C28.5152%2081.0199%2032.9092%2084.9983%2037.9519%2084.9973H90.9767Z'%20fill='%23E6EFFC'/%3e%3c/g%3e%3canimateTransform%20attributeName='transform'%20type='translate'%20values='0%200;0%20-3;0%200'%20dur='3s'%20begin='0s'%20repeatCount='indefinite'%20calcMode='spline'%20keySplines='.42%200%20.58%201;%20.42%200%20.58%201'/%3e%3c/g%3e%3c/g%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_2045_28820'%3e%3crect%20width='128'%20height='128'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e", a0 = "data:image/svg+xml,%3csvg%20viewBox='0%200%20128%20128'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='partly-cloudy-night'%20clip-path='url(%23clip0_2045_28822)'%3e%3cg%20id='Sky'%3e%3cg%20id='Mask%20group'%3e%3cmask%20id='mask0_2045_28822'%20style='mask-type:alpha'%20maskUnits='userSpaceOnUse'%20x='0'%20y='0'%20width='128'%20height='128'%3e%3cg%20id='Cloud%20Mask'%3e%3cpath%20id='Subtract'%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M128%200H0V128H128V0ZM37.9519%2093H90.9752C100.227%2093%20107.998%2085.353%20107.998%2076.0281C107.998%2068.0217%20102.305%2061.3501%2094.9248%2059.5512C95.3619%2049.9005%2089.6744%2040.6093%2080.5509%2036.7922C71.1071%2032.8411%2060.0664%2035.6119%2053.5305%2043.2384C48.5702%2041.5956%2042.9815%2042.2957%2038.5741%2045.2907C34.1459%2048.2998%2031.4305%2053.2809%2031.1846%2058.5379C24.0633%2061.463%2019.3278%2068.8506%2020.0776%2076.7839C20.942%2085.9295%2028.8285%2093.0018%2037.9519%2093Z'%20fill='black'/%3e%3canimateTransform%20attributeName='transform'%20type='translate'%20values='0%200;0%20-3;0%200'%20dur='3s'%20begin='0s'%20repeatCount='indefinite'%20calcMode='spline'%20keySplines='.42%200%20.58%201;%20.42%200%20.58%201'/%3e%3c/g%3e%3c/mask%3e%3cg%20mask='url(%23mask0_2045_28822)'%3e%3cg%20id='Moon'%3e%3cpath%20id='Moon_2'%20d='M35.766%2034C29.1498%2034.714%2024%2040.241%2024%2046.9586C24%2054.1608%2029.918%2060%2037.2177%2060C43.371%2060%2048.5267%2055.8459%2050%2050.2293C41.2173%2051.171%2033.4773%2042.7199%2035.766%2034Z'%20fill='%2372B9D5'/%3e%3canimateTransform%20attributeName='transform'%20type='rotate'%20values='-6%2037.0%2047.0;6%2037.0%2047.0;-6%2037.0%2047.0'%20dur='3s'%20begin='0s'%20repeatCount='indefinite'%20calcMode='spline'%20keySplines='.42%200%20.58%201;%20.42%200%20.58%201'/%3e%3c/g%3e%3c/g%3e%3c/g%3e%3cg%20id='Clouds'%3e%3cg%20id='Cloud'%3e%3cpath%20id='Cloud_2'%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M54.8371%2048.2115C51.0739%2045.9483%2046.3457%2045.7826%2042.4415%2047.6664C41.8837%2047.9355%2041.3428%2048.2465%2040.8239%2048.5991C36.6826%2051.4133%2034.4998%2056.5151%2035.3499%2061.454C28.3907%2062.7689%2023.3936%2069.3412%2024.0614%2076.4076C24.7293%2083.474%2030.8678%2089.0011%2037.9519%2089C37.9516%2089%2037.9522%2089%2037.9519%2089H90.9767C91.8608%2089%2092.7273%2088.908%2093.5669%2088.7333C95.0531%2088.4239%2096.4547%2087.855%2097.7196%2087.0774C99.3131%2086.0979%20100.689%2084.787%20101.744%2083.2465C102.32%2082.4049%20102.801%2081.4947%20103.168%2080.5324C103.705%2079.125%20104%2077.6063%20104%2076.0281C104%2075.9138%20103.998%2075.7997%20103.995%2075.6861C103.84%2069.9006%2099.7434%2065.0366%2094.3906%2063.5447C93.1158%2063.1894%2091.7697%2063.0253%2090.3886%2063.0856C90.7211%2061.752%2090.9017%2060.4069%2090.9409%2059.0706C91.1716%2051.1861%2086.4764%2043.6067%2079.0085%2040.4823C70.2648%2036.824%2059.8274%2040.138%2054.8371%2048.2115ZM90.9767%2084.9973C95.8649%2084.9973%20100%2080.8788%20100%2076.0281C100%2071.6531%2096.6498%2067.9178%2092.4216%2067.2003C92.1196%2067.1491%2091.8131%2067.1132%2091.503%2067.0937C91.1929%2067.0741%2090.8793%2067.0708%2090.5629%2067.0846L87.8866%2067.2014C87.2562%2067.229%2086.6497%2066.9571%2086.2505%2066.4681C85.8513%2065.979%2085.7062%2065.3301%2085.859%2064.7174L86.5076%2062.1165C86.6209%2061.6622%2086.7117%2061.206%2086.7808%2060.7491C87.8172%2053.8959%2083.9585%2046.8917%2077.4656%2044.1752C70.5246%2041.2712%2062.1884%2043.9274%2058.239%2050.3171L57.2003%2051.9975C57.2001%2051.998%2057.1998%2051.9984%2057.1995%2051.9989C56.6234%2052.9294%2055.4069%2053.2241%2054.4692%2052.6602L52.7767%2051.6424C49.8116%2049.8592%2045.9319%2049.9664%2043.071%2051.9105C42.7147%2052.1526%2042.3793%2052.4199%2042.0664%2052.7088C39.8756%2054.7312%2038.7824%2057.8152%2039.2918%2060.7745L39.6259%2062.7154C39.626%2062.7158%2039.626%2062.7162%2039.6261%2062.7166C39.8107%2063.7928%2039.0991%2064.8185%2038.0269%2065.0216C38.0266%2065.0217%2038.0271%2065.0216%2038.0269%2065.0216L36.092%2065.3872C31.1413%2066.3226%2027.5724%2071.0449%2028.0437%2076.0307C28.5152%2081.0199%2032.9092%2084.9983%2037.9519%2084.9973H90.9767Z'%20fill='%23E6EFFC'/%3e%3c/g%3e%3canimateTransform%20attributeName='transform'%20type='translate'%20values='0%200;0%20-3;0%200'%20dur='3s'%20begin='0s'%20repeatCount='indefinite'%20calcMode='spline'%20keySplines='.42%200%20.58%201;%20.42%200%20.58%201'/%3e%3c/g%3e%3c/g%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_2045_28822'%3e%3crect%20width='128'%20height='128'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e", r0 = "data:image/svg+xml,%3csvg%20viewBox='0%200%20128%20128'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='rain'%20clip-path='url(%23clip0_2045_28840)'%3e%3cg%20id='Sky'%3e%3cg%20id='Clouds'%3e%3cg%20id='Cloud'%3e%3cpath%20id='Cloud_2'%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M54.8371%2048.2115C59.8274%2040.138%2070.2648%2036.824%2079.0085%2040.4823C87.7416%2044.136%2092.6836%2053.8827%2090.3886%2063.0856C97.6828%2062.7671%20104%2068.7067%20104%2076.0281C104%2083.1158%2098.0476%2089%2090.9767%2089C89.8721%2089%2088.9767%2088.104%2088.9767%2086.9986C88.9767%2085.8933%2089.8721%2084.9973%2090.9767%2084.9973C95.8637%2084.9973%20100%2080.8799%20100%2076.0281C100%2071.0262%2095.6222%2066.8637%2090.5629%2067.0846L87.8866%2067.2014C87.2562%2067.229%2086.6497%2066.9571%2086.2505%2066.4681C85.8513%2065.979%2085.7062%2065.3301%2085.859%2064.7174L86.5076%2062.1165C88.3201%2054.8484%2084.391%2047.0727%2077.4656%2044.1752C70.5248%2041.2713%2062.1886%2043.9272%2058.239%2050.3171L57.2003%2051.9975C56.6245%2052.9291%2055.4074%2053.2244%2054.4692%2052.6602L52.7767%2051.6424C49.8116%2049.8592%2045.9319%2049.9664%2043.071%2051.9105C40.2208%2053.8474%2038.7096%2057.3922%2039.2918%2060.7745L39.6259%2062.7154C39.8113%2063.7924%2039.0991%2064.819%2038.026%2065.0218L36.092%2065.3872C31.1421%2066.3225%2027.5723%2071.0441%2028.0437%2076.0307C28.5153%2081.0207%2032.91%2084.9983%2037.9519%2084.9973C39.0565%2084.997%2039.9521%2085.8929%2039.9524%2086.9982C39.9526%2088.1035%2039.0573%2088.9998%2037.9528%2089C30.8695%2089.0015%2024.7294%2083.4755%2024.0614%2076.4076C23.3936%2069.3412%2028.3907%2062.7689%2035.3499%2061.454C34.4997%2056.5148%2036.6828%2051.4131%2040.8239%2048.5991C44.9752%2045.7781%2050.5363%2045.625%2054.8371%2048.2115Z'%20fill='%23E6EFFC'/%3e%3c/g%3e%3canimateTransform%20attributeName='transform'%20type='translate'%20values='0%200;0%20-3;0%200'%20dur='3s'%20begin='0s'%20repeatCount='indefinite'%20calcMode='spline'%20keySplines='.42%200%20.58%201;%20.42%200%20.58%201'/%3e%3c/g%3e%3c/g%3e%3cg%20id='Precipitation'%3e%3cg%20id='Raindrops'%3e%3cpath%20id='Raindrop%201'%20d='M52%2083V95'%20stroke='%230A5AD4'%20stroke-width='4'%20stroke-linecap='round'%3e%3canimateTransform%20attributeName='transform'%20type='translate'%20values='0%200;0%2020'%20dur='1s'%20begin='0s'%20repeatCount='indefinite'%20calcMode='spline'%20keySplines='.42%200%201%201'/%3e%3canimate%20attributeName='opacity'%20values='0;1;1;0'%20dur='1s'%20begin='0s'%20repeatCount='indefinite'%20keyTimes='0;0.15;0.85;1'/%3e%3c/path%3e%3cpath%20id='Raindrop%202'%20d='M64%2083V95'%20stroke='%230A5AD4'%20stroke-width='4'%20stroke-linecap='round'%20opacity='0'%3e%3canimateTransform%20attributeName='transform'%20type='translate'%20values='0%200;0%2020'%20dur='1s'%20begin='0.4s'%20repeatCount='indefinite'%20calcMode='spline'%20keySplines='.42%200%201%201'/%3e%3canimate%20attributeName='opacity'%20values='0;1;1;0'%20dur='1s'%20begin='0.4s'%20repeatCount='indefinite'%20keyTimes='0;0.15;0.85;1'/%3e%3c/path%3e%3cpath%20id='Raindrop%203'%20d='M76%2083V95'%20stroke='%230A5AD4'%20stroke-width='4'%20stroke-linecap='round'%20opacity='0'%3e%3canimateTransform%20attributeName='transform'%20type='translate'%20values='0%200;0%2020'%20dur='1s'%20begin='0.8s'%20repeatCount='indefinite'%20calcMode='spline'%20keySplines='.42%200%201%201'/%3e%3canimate%20attributeName='opacity'%20values='0;1;1;0'%20dur='1s'%20begin='0.8s'%20repeatCount='indefinite'%20keyTimes='0;0.15;0.85;1'/%3e%3c/path%3e%3c/g%3e%3c/g%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_2045_28840'%3e%3crect%20width='128'%20height='128'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e", o0 = "data:image/svg+xml,%3csvg%20viewBox='0%200%20128%20128'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='snow'%20clip-path='url(%23clip0_2045_28939)'%3e%3cg%20id='Sky'%3e%3cg%20id='Clouds'%3e%3cg%20id='Cloud'%3e%3cpath%20id='Cloud_2'%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M54.8371%2048.2115C59.8274%2040.138%2070.2648%2036.824%2079.0085%2040.4823C87.7416%2044.136%2092.6836%2053.8827%2090.3886%2063.0856C97.6828%2062.7671%20104%2068.7067%20104%2076.0281C104%2083.1158%2098.0476%2089%2090.9767%2089C89.8721%2089%2088.9767%2088.104%2088.9767%2086.9986C88.9767%2085.8933%2089.8721%2084.9973%2090.9767%2084.9973C95.8637%2084.9973%20100%2080.8799%20100%2076.0281C100%2071.0262%2095.6222%2066.8637%2090.5629%2067.0846L87.8866%2067.2014C87.2562%2067.229%2086.6497%2066.9571%2086.2505%2066.4681C85.8513%2065.979%2085.7062%2065.3301%2085.859%2064.7174L86.5076%2062.1165C88.3201%2054.8484%2084.391%2047.0727%2077.4656%2044.1752C70.5248%2041.2713%2062.1886%2043.9272%2058.239%2050.3171L57.2003%2051.9975C56.6245%2052.9291%2055.4074%2053.2244%2054.4692%2052.6602L52.7767%2051.6424C49.8116%2049.8592%2045.9319%2049.9664%2043.071%2051.9105C40.2208%2053.8474%2038.7096%2057.3922%2039.2918%2060.7745L39.6259%2062.7154C39.8113%2063.7924%2039.0991%2064.819%2038.026%2065.0218L36.092%2065.3872C31.1421%2066.3225%2027.5723%2071.0441%2028.0437%2076.0307C28.5153%2081.0207%2032.91%2084.9983%2037.9519%2084.9973C39.0565%2084.997%2039.9521%2085.8929%2039.9524%2086.9982C39.9526%2088.1035%2039.0573%2088.9998%2037.9528%2089C30.8695%2089.0015%2024.7294%2083.4755%2024.0614%2076.4076C23.3936%2069.3412%2028.3907%2062.7689%2035.3499%2061.454C34.4997%2056.5148%2036.6828%2051.4131%2040.8239%2048.5991C44.9752%2045.7781%2050.5363%2045.625%2054.8371%2048.2115Z'%20fill='%23E6EFFC'/%3e%3c/g%3e%3canimateTransform%20attributeName='transform'%20type='translate'%20values='0%200;0%20-3;0%200'%20dur='3s'%20begin='0s'%20repeatCount='indefinite'%20calcMode='spline'%20keySplines='.42%200%20.58%201;%20.42%200%20.58%201'/%3e%3c/g%3e%3c/g%3e%3cg%20id='Precipitation'%3e%3cg%20id='Snowflakes'%3e%3cpath%20id='Snowflake%201'%20d='M52.5781%2090.366L51.3735%2089.6775C51.4794%2089.2326%2051.4786%2088.7687%2051.3708%2088.3241L52.5781%2087.6345C52.6738%2087.5805%2052.7577%2087.5079%2052.8252%2087.421C52.8926%2087.3342%2052.9423%2087.2347%2052.9711%2087.1284C52.9998%2087.0221%2053.0071%2086.9112%2052.9926%2086.802C52.9782%2086.6928%2052.9422%2086.5876%2052.8868%2086.4926C52.7732%2086.2998%2052.5886%2086.1597%2052.3728%2086.1025C52.157%2086.0452%2051.9276%2086.0754%2051.7339%2086.1866L50.5278%2086.8763C50.1931%2086.5586%2049.7868%2086.3264%2049.3437%2086.1995V84.8202C49.3368%2084.6003%2049.245%2084.3918%2049.0875%2084.2387C48.93%2084.0856%2048.7192%2084%2048.4998%2084C48.2805%2084%2048.0699%2084.0856%2047.9124%2084.2387C47.7548%2084.3918%2047.6628%2084.6003%2047.656%2084.8202V86.1995C47.214%2086.3289%2046.8081%2086.5598%2046.4706%2086.874L45.2662%2086.1853C45.0724%2086.0742%2044.8428%2086.044%2044.627%2086.1013C44.4113%2086.1585%2044.2267%2086.2986%2044.113%2086.4913C44.0576%2086.5864%2044.0217%2086.6916%2044.0072%2086.8007C43.9928%2086.9099%2044%2087.0209%2044.0288%2087.1271C44.0575%2087.2334%2044.1072%2087.3329%2044.1747%2087.4198C44.2421%2087.5067%2044.326%2087.5792%2044.4217%2087.6332L45.6264%2088.3216C45.5204%2088.7666%2045.5213%2089.2305%2045.629%2089.675L44.4217%2090.3647C44.326%2090.4187%2044.2421%2090.4912%2044.1747%2090.5781C44.1072%2090.665%2044.0575%2090.7645%2044.0288%2090.8708C44%2090.9771%2043.9928%2091.088%2044.0072%2091.1972C44.0217%2091.3063%2044.0576%2091.4115%2044.113%2091.5066C44.2267%2091.6992%2044.4113%2091.8392%2044.627%2091.8965C44.8428%2091.9537%2045.0724%2091.9236%2045.2662%2091.8126L46.4721%2091.1229C46.8063%2091.4409%2047.2128%2091.6726%2047.6562%2091.7979V93.1798C47.6631%2093.3997%2047.755%2093.6082%2047.9126%2093.7613C48.0701%2093.9144%2048.2807%2094%2048.5%2094C48.7194%2094%2048.9302%2093.9144%2049.0877%2093.7613C49.2452%2093.6082%2049.337%2093.3997%2049.3439%2093.1798V91.7975C49.7853%2091.6683%2050.1907%2091.4378%2050.5278%2091.1242L51.7341%2091.8138C51.9278%2091.9248%2052.1573%2091.955%2052.373%2091.8977C52.5888%2091.8405%2052.7733%2091.7005%2052.887%2091.5079C52.9424%2091.4128%2052.9784%2091.3076%2052.9928%2091.1984C53.0073%2091.0892%2052.9998%2090.9783%2052.9711%2090.872C52.9423%2090.7657%2052.8929%2090.6662%2052.8254%2090.5793C52.7579%2090.4925%2052.6738%2090.4199%2052.5781%2090.366ZM47.8664%2090.0861C47.7229%2090.005%2047.5968%2089.8961%2047.4956%2089.7657C47.3944%2089.6353%2047.3202%2089.486%2047.2771%2089.3266C47.2339%2089.1671%2047.2228%2089.0007%2047.2443%2088.8369C47.2658%2088.6731%2047.3197%2088.5152%2047.4026%2088.3724C47.5735%2088.084%2047.8503%2087.8743%2048.1736%2087.7883C48.497%2087.7023%2048.8411%2087.747%2049.1321%2087.9126C49.2756%2087.9938%2049.4016%2088.1027%2049.5028%2088.2331C49.604%2088.3635%2049.6782%2088.5127%2049.7214%2088.6722C49.7645%2088.8316%2049.7757%2088.9981%2049.7541%2089.1619C49.7326%2089.3257%2049.6787%2089.4836%2049.5958%2089.6263C49.425%2089.9149%2049.1482%2090.1247%2048.8248%2090.2108C48.5014%2090.2969%2048.1574%2090.2523%2047.8664%2090.0867V90.0861Z'%20fill='%2386C3DB'%20opacity='0'%3e%3canimateTransform%20attributeName='transform'%20type='translate'%20values='0%200;0%2020'%20dur='1s'%20begin='0.2s'%20repeatCount='indefinite'%20calcMode='spline'%20keySplines='.42%200%201%201'/%3e%3canimate%20attributeName='opacity'%20values='0;1;1;0'%20dur='1s'%20begin='0.2s'%20repeatCount='indefinite'%20keyTimes='0;0.15;0.85;1'/%3e%3c/path%3e%3cpath%20id='Snowflake%202'%20d='M67.5781%2090.366L66.3735%2089.6775C66.4794%2089.2326%2066.4786%2088.7687%2066.3708%2088.3241L67.5781%2087.6345C67.6738%2087.5805%2067.7577%2087.5079%2067.8252%2087.421C67.8926%2087.3342%2067.9423%2087.2347%2067.9711%2087.1284C67.9998%2087.0221%2068.0071%2086.9112%2067.9926%2086.802C67.9782%2086.6928%2067.9422%2086.5876%2067.8868%2086.4926C67.7732%2086.2998%2067.5886%2086.1597%2067.3728%2086.1025C67.157%2086.0452%2066.9276%2086.0754%2066.7339%2086.1866L65.5278%2086.8763C65.1931%2086.5586%2064.7868%2086.3264%2064.3437%2086.1995V84.8202C64.3368%2084.6003%2064.245%2084.3918%2064.0875%2084.2387C63.93%2084.0856%2063.7192%2084%2063.4998%2084C63.2805%2084%2063.0699%2084.0856%2062.9124%2084.2387C62.7548%2084.3918%2062.6628%2084.6003%2062.656%2084.8202V86.1995C62.214%2086.3289%2061.8081%2086.5598%2061.4706%2086.874L60.2662%2086.1853C60.0724%2086.0742%2059.8428%2086.044%2059.627%2086.1013C59.4113%2086.1585%2059.2267%2086.2986%2059.113%2086.4913C59.0576%2086.5864%2059.0217%2086.6916%2059.0072%2086.8007C58.9928%2086.9099%2059%2087.0209%2059.0288%2087.1271C59.0575%2087.2334%2059.1072%2087.3329%2059.1747%2087.4198C59.2421%2087.5067%2059.326%2087.5792%2059.4217%2087.6332L60.6264%2088.3216C60.5204%2088.7666%2060.5213%2089.2305%2060.629%2089.675L59.4217%2090.3647C59.326%2090.4187%2059.2421%2090.4912%2059.1747%2090.5781C59.1072%2090.665%2059.0575%2090.7645%2059.0288%2090.8708C59%2090.9771%2058.9928%2091.088%2059.0072%2091.1972C59.0217%2091.3063%2059.0576%2091.4115%2059.113%2091.5066C59.2267%2091.6992%2059.4113%2091.8392%2059.627%2091.8965C59.8428%2091.9537%2060.0724%2091.9236%2060.2662%2091.8126L61.4721%2091.1229C61.8063%2091.4409%2062.2128%2091.6726%2062.6562%2091.7979V93.1798C62.6631%2093.3997%2062.755%2093.6082%2062.9126%2093.7613C63.0701%2093.9144%2063.2807%2094%2063.5%2094C63.7194%2094%2063.9302%2093.9144%2064.0877%2093.7613C64.2452%2093.6082%2064.337%2093.3997%2064.3439%2093.1798V91.7975C64.7853%2091.6683%2065.1907%2091.4378%2065.5278%2091.1242L66.7341%2091.8138C66.9278%2091.9248%2067.1573%2091.955%2067.373%2091.8977C67.5888%2091.8405%2067.7733%2091.7005%2067.887%2091.5079C67.9424%2091.4128%2067.9784%2091.3076%2067.9928%2091.1984C68.0073%2091.0892%2067.9998%2090.9783%2067.9711%2090.872C67.9423%2090.7657%2067.8929%2090.6662%2067.8254%2090.5793C67.7579%2090.4925%2067.6738%2090.4199%2067.5781%2090.366ZM62.8664%2090.0861C62.7229%2090.005%2062.5968%2089.8961%2062.4956%2089.7657C62.3944%2089.6353%2062.3202%2089.486%2062.2771%2089.3266C62.2339%2089.1671%2062.2228%2089.0007%2062.2443%2088.8369C62.2658%2088.6731%2062.3197%2088.5152%2062.4026%2088.3724C62.5735%2088.084%2062.8503%2087.8743%2063.1736%2087.7883C63.497%2087.7023%2063.8411%2087.747%2064.1321%2087.9126C64.2756%2087.9938%2064.4016%2088.1027%2064.5028%2088.2331C64.604%2088.3635%2064.6782%2088.5127%2064.7214%2088.6722C64.7645%2088.8316%2064.7757%2088.9981%2064.7541%2089.1619C64.7326%2089.3257%2064.6787%2089.4836%2064.5958%2089.6263C64.425%2089.9149%2064.1482%2090.1247%2063.8248%2090.2108C63.5014%2090.2969%2063.1574%2090.2523%2062.8664%2090.0867V90.0861Z'%20fill='%2386C3DB'%20opacity='0'%3e%3canimateTransform%20attributeName='transform'%20type='translate'%20values='0%200;0%2020'%20dur='1s'%20begin='0.7s'%20repeatCount='indefinite'%20calcMode='spline'%20keySplines='.42%200%201%201'/%3e%3canimate%20attributeName='opacity'%20values='0;1;1;0'%20dur='1s'%20begin='0.7s'%20repeatCount='indefinite'%20keyTimes='0;0.15;0.85;1'/%3e%3c/path%3e%3cpath%20id='Snowflake%203'%20d='M82.5781%2090.366L81.3735%2089.6775C81.4794%2089.2326%2081.4786%2088.7687%2081.3708%2088.3241L82.5781%2087.6345C82.6738%2087.5805%2082.7577%2087.5079%2082.8252%2087.421C82.8926%2087.3342%2082.9423%2087.2347%2082.9711%2087.1284C82.9998%2087.0221%2083.0071%2086.9112%2082.9926%2086.802C82.9782%2086.6928%2082.9422%2086.5876%2082.8868%2086.4926C82.7732%2086.2998%2082.5886%2086.1597%2082.3728%2086.1025C82.157%2086.0452%2081.9276%2086.0754%2081.7339%2086.1866L80.5278%2086.8763C80.1931%2086.5586%2079.7868%2086.3264%2079.3437%2086.1995V84.8202C79.3368%2084.6003%2079.245%2084.3918%2079.0875%2084.2387C78.93%2084.0856%2078.7192%2084%2078.4998%2084C78.2805%2084%2078.0699%2084.0856%2077.9124%2084.2387C77.7548%2084.3918%2077.6628%2084.6003%2077.656%2084.8202V86.1995C77.214%2086.3289%2076.8081%2086.5598%2076.4706%2086.874L75.2662%2086.1853C75.0724%2086.0742%2074.8428%2086.044%2074.627%2086.1013C74.4113%2086.1585%2074.2267%2086.2986%2074.113%2086.4913C74.0576%2086.5864%2074.0217%2086.6916%2074.0072%2086.8007C73.9928%2086.9099%2074%2087.0209%2074.0288%2087.1271C74.0575%2087.2334%2074.1072%2087.3329%2074.1747%2087.4198C74.2421%2087.5067%2074.326%2087.5792%2074.4217%2087.6332L75.6264%2088.3216C75.5204%2088.7666%2075.5213%2089.2305%2075.629%2089.675L74.4217%2090.3647C74.326%2090.4187%2074.2421%2090.4912%2074.1747%2090.5781C74.1072%2090.665%2074.0575%2090.7645%2074.0288%2090.8708C74%2090.9771%2073.9928%2091.088%2074.0072%2091.1972C74.0217%2091.3063%2074.0576%2091.4115%2074.113%2091.5066C74.2267%2091.6992%2074.4113%2091.8392%2074.627%2091.8965C74.8428%2091.9537%2075.0724%2091.9236%2075.2662%2091.8126L76.4721%2091.1229C76.8063%2091.4409%2077.2128%2091.6726%2077.6562%2091.7979V93.1798C77.6631%2093.3997%2077.755%2093.6082%2077.9126%2093.7613C78.0701%2093.9144%2078.2807%2094%2078.5%2094C78.7194%2094%2078.9302%2093.9144%2079.0877%2093.7613C79.2452%2093.6082%2079.337%2093.3997%2079.3439%2093.1798V91.7975C79.7853%2091.6683%2080.1907%2091.4378%2080.5278%2091.1242L81.7341%2091.8138C81.9278%2091.9248%2082.1573%2091.955%2082.373%2091.8977C82.5888%2091.8405%2082.7733%2091.7005%2082.887%2091.5079C82.9424%2091.4128%2082.9784%2091.3076%2082.9928%2091.1984C83.0073%2091.0892%2082.9998%2090.9783%2082.9711%2090.872C82.9423%2090.7657%2082.8929%2090.6662%2082.8254%2090.5793C82.7579%2090.4925%2082.6738%2090.4199%2082.5781%2090.366ZM77.8664%2090.0861C77.7229%2090.005%2077.5968%2089.8961%2077.4956%2089.7657C77.3944%2089.6353%2077.3202%2089.486%2077.2771%2089.3266C77.2339%2089.1671%2077.2228%2089.0007%2077.2443%2088.8369C77.2658%2088.6731%2077.3197%2088.5152%2077.4026%2088.3724C77.5735%2088.084%2077.8503%2087.8743%2078.1736%2087.7883C78.497%2087.7023%2078.8411%2087.747%2079.1321%2087.9126C79.2756%2087.9938%2079.4016%2088.1027%2079.5028%2088.2331C79.604%2088.3635%2079.6782%2088.5127%2079.7214%2088.6722C79.7645%2088.8316%2079.7757%2088.9981%2079.7541%2089.1619C79.7326%2089.3257%2079.6787%2089.4836%2079.5958%2089.6263C79.425%2089.9149%2079.1482%2090.1247%2078.8248%2090.2108C78.5014%2090.2969%2078.1574%2090.2523%2077.8664%2090.0867V90.0861Z'%20fill='%2386C3DB'%20opacity='0'%3e%3canimateTransform%20attributeName='transform'%20type='translate'%20values='0%200;0%2020'%20dur='1s'%20begin='1.2s'%20repeatCount='indefinite'%20calcMode='spline'%20keySplines='.42%200%201%201'/%3e%3canimate%20attributeName='opacity'%20values='0;1;1;0'%20dur='1s'%20begin='1.2s'%20repeatCount='indefinite'%20keyTimes='0;0.15;0.85;1'/%3e%3c/path%3e%3c/g%3e%3c/g%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_2045_28939'%3e%3crect%20width='128'%20height='128'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e", c0 = "data:image/svg+xml,%3csvg%20viewBox='0%200%20128%20128'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='thunderstorms'%20clip-path='url(%23clip0_2045_29104)'%3e%3cg%20id='Sky'%3e%3cg%20id='Clouds'%3e%3cg%20id='Cloud'%3e%3cpath%20id='Cloud_2'%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M54.8373%2048.2115C59.8275%2040.138%2070.2649%2036.824%2079.0086%2040.4823C87.7417%2044.136%2092.6838%2053.8827%2090.3887%2063.0856C97.6829%2062.7671%20104%2068.7067%20104%2076.0281C104%2083.1158%2098.0477%2089%2090.9768%2089C89.8723%2089%2088.9768%2088.104%2088.9768%2086.9986C88.9768%2085.8933%2089.8723%2084.9973%2090.9768%2084.9973C95.8639%2084.9973%20100%2080.8799%20100%2076.0281C100%2071.0262%2095.6223%2066.8637%2090.5631%2067.0846L87.8867%2067.2014C87.2563%2067.229%2086.6498%2066.9571%2086.2506%2066.4681C85.8514%2065.979%2085.7063%2065.3301%2085.8591%2064.7174L86.5077%2062.1165C88.3203%2054.8484%2084.3911%2047.0727%2077.4657%2044.1752C70.525%2041.2713%2062.1887%2043.9272%2058.2391%2050.3171L57.2005%2051.9975C56.6247%2052.9291%2055.4075%2053.2244%2054.4693%2052.6602L52.7768%2051.6424C49.8118%2049.8592%2045.932%2049.9664%2043.0711%2051.9105C40.2209%2053.8474%2038.7098%2057.3922%2039.2919%2060.7745L39.626%2062.7154C39.8114%2063.7924%2039.0992%2064.819%2038.0261%2065.0218L36.0922%2065.3872C31.1423%2066.3225%2027.5725%2071.0441%2028.0438%2076.0307C28.5154%2081.0207%2032.9101%2084.9983%2037.9521%2084.9973C39.0566%2084.997%2039.9522%2085.8929%2039.9525%2086.9982C39.9527%2088.1035%2039.0575%2088.9998%2037.9529%2089C30.8696%2089.0015%2024.7296%2083.4755%2024.0615%2076.4076C23.3937%2069.3412%2028.3908%2062.7689%2035.35%2061.454C34.4998%2056.5148%2036.6829%2051.4131%2040.824%2048.5991C44.9753%2045.7781%2050.5364%2045.625%2054.8373%2048.2115Z'%20fill='%23E6EFFC'/%3e%3c/g%3e%3canimateTransform%20attributeName='transform'%20type='translate'%20values='0%200;0%20-3;0%200'%20dur='3s'%20begin='0s'%20repeatCount='indefinite'%20calcMode='spline'%20keySplines='.42%200%20.58%201;%20.42%200%20.58%201'/%3e%3c/g%3e%3c/g%3e%3cg%20id='Lightning'%3e%3cpath%20id='Lightning%20Bolt'%20d='M60.0003%2068L52%2090.9092H60.0003L55.9995%20110L76%2083.2728H63.9996L71.9999%2068H60.0003Z'%20fill='%23F6A823'%3e%3canimate%20attributeName='opacity'%20values='1;1;0;1;0;1;0;1;1'%20dur='2s'%20begin='0s'%20repeatCount='indefinite'%20keyTimes='0;0.25;0.33;0.42;0.5;0.57;0.63;0.67;1'/%3e%3c/path%3e%3c/g%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_2045_29104'%3e%3crect%20width='128'%20height='128'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e", l0 = "data:image/svg+xml,%3csvg%20viewBox='0%200%20128%20128'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='wind'%3e%3cg%20id='Wind'%3e%3cpath%20id='Wind%20Line%201'%20d='M87.79%2040.1352C93.9756%2033.347%20105%2038.4049%20105%2047.4463C105%2053.2746%20100.522%2058%2095%2058H24'%20stroke='%23E2E8F0'%20stroke-width='4'%20stroke-miterlimit='10'%20stroke-linecap='round'%20stroke-dasharray='50'%3e%3canimate%20attributeName='stroke-dashoffset'%20values='0;1000'%20dur='6s'%20begin='0s'%20repeatCount='indefinite'/%3e%3c/path%3e%3cpath%20id='Wind%20Line%201_2'%20d='M60.1281%2087.868C66.4202%2094.5186%2078%2089.8717%2078%2080.5556C78%2074.7263%2073.3503%2070%2067.6154%2070C61.8805%2070%2024%2070%2024%2070'%20stroke='%23E2E8F0'%20stroke-width='4'%20stroke-miterlimit='10'%20stroke-linecap='round'%20stroke-dasharray='50'%3e%3canimate%20attributeName='stroke-dashoffset'%20values='0;1000'%20dur='6s'%20begin='0.2s'%20repeatCount='indefinite'/%3e%3c/path%3e%3c/g%3e%3c/g%3e%3c/svg%3e", S2 = {
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
  exceptional: "not-available"
};
function d0(n, e = !1) {
  const t = S2[n ?? ""];
  return t ? t === "clear-day" ? e ? "clear-night" : t : t === "partly-cloudy" ? e ? "partly-cloudy-night" : "partly-cloudy-day" : t : "not-available";
}
function h0(n) {
  return !!(n && S2[n]);
}
function p2(n) {
  return typeof n == "number" ? ["↑", "↗", "→", "↘", "↓", "↙", "←", "↖"][Math.round((n + 180) / 45) % 8] : {
    N: "↓",
    NE: "↙",
    E: "←",
    SE: "↖",
    S: "↑",
    SW: "↗",
    W: "→",
    NW: "↘",
    NORTH: "↓",
    NORTHEAST: "↙",
    EAST: "←",
    SOUTHEAST: "↖",
    SOUTH: "↑",
    SOUTHWEST: "↗",
    WEST: "→",
    NORTHWEST: "↘",
    POHJOINEN: "↓",
    KOILLINEN: "↙",
    ITÄ: "←",
    ITA: "←",
    KAAKKO: "↖",
    ETELÄ: "↑",
    ETELA: "↑",
    LOUNAS: "↗",
    LÄNSI: "→",
    LANSI: "→",
    LUODE: "↘",
    POHJOISKOILLINEN: "↙",
    ITÄKOILLINEN: "↙",
    ITAKOILLINEN: "↙",
    ITÄKAAKKO: "↖",
    ITAKAAKKO: "↖",
    ETELÄKAAKKO: "↖",
    ETELAKAAKKO: "↖",
    ETELÄLOUNAS: "↗",
    ETELALOUNAS: "↗",
    LÄNSILOUNAS: "↗",
    LANSILOUNAS: "↗",
    LÄNSILUODE: "↘",
    LANSILUODE: "↘",
    POHJOISLUODE: "↘"
  }[(n == null ? void 0 : n.toUpperCase()) ?? ""] ?? "";
}
function J(n, e = "°") {
  const t = Number(n), i = e === "°C" ? "°" : e;
  return Number.isFinite(t) ? `${Math.round(t)}${i}` : "—";
}
function Z(n, e = "") {
  const t = Number(n);
  return Number.isFinite(t) ? `${Math.round(t)}${e ? ` ${e}` : ""}` : "—";
}
function C2(n) {
  return new Date(n);
}
const u0 = { current_weather: "Current weather", hourly_weather: "Hourly forecast weather entity", daily_weather: "Daily forecast weather entity", temperature_entity: "Primary temperature sensor", calendars: "Calendars", hourly_forecast_count: "Hourly forecast count", daily_forecast_count: "Daily forecast count", show_calendar: "Show calendar", calendar_title: "Calendar title", calendar_icon: "Calendar icon" }, p0 = { today: "Today", no_events: "No events today", all_day: "All day", unknown_condition: "Unknown condition" }, C0 = { sunny: "Sunny", "clear-night": "Clear", partlycloudy: "Partly cloudy", cloudy: "Cloudy", fog: "Fog", hail: "Hail", lightning: "Thunderstorm", "lightning-rainy": "Thunderstorms", pouring: "Pouring rain", rainy: "Rainy", snowy: "Snowy", "snowy-rainy": "Sleet", windy: "Windy", "windy-variant": "Windy", exceptional: "Exceptional" }, z = {
  editor: u0,
  card: p0,
  conditions: C0
}, g0 = { current_weather: "Nykyinen sää", hourly_weather: "Tuntiennusteen sääentiteetti", daily_weather: "Päiväennusteen sääentiteetti", temperature_entity: "Ensisijainen lämpötila-anturi", calendars: "Kalenterit", hourly_forecast_count: "Tuntiennusteiden määrä", daily_forecast_count: "Päiväennusteiden määrä", show_calendar: "Näytä kalenteri", calendar_title: "Kalenterin otsikko", calendar_icon: "Kalenterin kuvake" }, f0 = { today: "Tänään", no_events: "Ei tapahtumia tänään", all_day: "Koko päivä", unknown_condition: "Tuntematon säätila" }, m0 = { sunny: "Aurinkoista", "clear-night": "Selkeää", partlycloudy: "Puolipilvistä", cloudy: "Pilvistä", fog: "Sumua", hail: "Rakeita", lightning: "Ukkosta", "lightning-rainy": "Ukkossadetta", pouring: "Rankkasadetta", rainy: "Sateista", snowy: "Lumista", "snowy-rainy": "Räntäsadetta", windy: "Tuulista", "windy-variant": "Tuulista", exceptional: "Poikkeuksellinen sää" }, G = {
  editor: g0,
  card: f0,
  conditions: m0
};
var A2 = Object.defineProperty, y0 = Object.getOwnPropertyDescriptor, v0 = (n, e, t) => e in n ? A2(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t, f = (n, e, t, i) => {
  for (var s = i > 1 ? void 0 : i ? y0(e, t) : e, r = n.length - 1, a; r >= 0; r--)
    (a = n[r]) && (s = (i ? a(e, t, s) : a(s)) || s);
  return i && s && A2(e, t, s), s;
}, L2 = (n, e, t) => v0(n, e + "", t);
const g2 = (n) => n.response ?? n, _0 = {
  "clear-day": Q2,
  "clear-night": X2,
  cloudy: Y2,
  drizzle: e0,
  fog: t0,
  hail: i0,
  "not-available": k2,
  overcast: s0,
  "partly-cloudy-day": n0,
  "partly-cloudy-night": a0,
  rain: r0,
  snow: o0,
  thunderstorms: c0,
  wind: l0
};
let _ = class extends A {
  constructor() {
    super(...arguments);
    C(this, "hass");
    C(this, "hourly", []);
    C(this, "daily", []);
    C(this, "events", []);
    C(this, "now", /* @__PURE__ */ new Date());
    C(this, "config");
    C(this, "unsubscribers", []);
    C(this, "eventsByCalendar", /* @__PURE__ */ new Map());
    C(this, "clock");
    C(this, "refreshTimer");
  }
  static getConfigElement() {
    return document.createElement("weather-clock-card-editor");
  }
  static getStubConfig() {
    return { current_weather: "weather.home" };
  }
  static getConfigForm() {
  }
  getCardSize() {
    return 6;
  }
  getGridOptions() {
    return { columns: 6, min_columns: 3 };
  }
  setConfig(e) {
    if (!e.current_weather) throw new Error("current_weather is required");
    this.config = e, this.subscribeData();
  }
  connectedCallback() {
    super.connectedCallback(), this.scheduleClock(), this.refreshTimer = window.setInterval(() => void this.refreshData(), 900 * 1e3);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.clock && window.clearTimeout(this.clock), this.refreshTimer && window.clearInterval(this.refreshTimer), this.clearSubscriptions();
  }
  updated(e) {
    var i;
    const t = e.get("hass");
    e.has("hass") && (t == null ? void 0 : t.connection) !== ((i = this.hass) == null ? void 0 : i.connection) && this.subscribeData();
  }
  scheduleClock() {
    this.now = /* @__PURE__ */ new Date(), this.requestUpdate();
    const e = 6e4 - Date.now() % 6e4 + 25;
    this.clock = window.setTimeout(() => this.scheduleClock(), e);
  }
  clearSubscriptions() {
    this.unsubscribers.splice(0).forEach((e) => e()), this.eventsByCalendar.clear();
  }
  async subscribeData() {
    !this.hass || !this.config || (this.clearSubscriptions(), await this.refreshData());
  }
  async refreshData() {
    !this.hass || !this.config || await Promise.all([
      this.fetchForecast(this.config.hourly_weather ?? this.config.current_weather, "hourly", (e) => this.hourly = e),
      this.fetchForecast(this.config.daily_weather ?? this.config.current_weather, "daily", (e) => this.daily = e),
      this.fetchCalendars()
    ]);
  }
  async fetchForecast(e, t, i) {
    var s;
    if (this.hass)
      try {
        const r = await this.hass.callService(
          "weather",
          "get_forecasts",
          { type: t },
          { entity_id: e },
          !0
        ), a = g2(r);
        i(((s = a[e]) == null ? void 0 : s.forecast) ?? []);
      } catch {
        i([]);
      }
  }
  async fetchCalendars() {
    if (!this.hass || !this.config) return;
    const e = new Date(this.now);
    e.setHours(0, 0, 0, 0);
    const t = new Date(e);
    t.setDate(t.getDate() + 1);
    const i = this.config.calendars ?? [], s = await Promise.all(i.map(async (r) => {
      var a;
      try {
        const o = await this.hass.callService(
          "calendar",
          "get_events",
          { start_date_time: e.toISOString(), end_date_time: t.toISOString() },
          { entity_id: r },
          !0
        );
        return ((a = g2(o)[r]) == null ? void 0 : a.events) ?? [];
      } catch {
        return [];
      }
    }));
    this.events = s.flat().sort((r, a) => String(r.start).localeCompare(String(a.start)));
  }
  /* Kept for newer HA instances that push calendar changes immediately. */
  async subscribeLiveUpdates() {
    if (!this.hass || !this.config) return;
    const e = async (t, i, s) => {
      try {
        const r = await this.hass.connection.subscribeMessage(
          (a) => {
            var o;
            return s(a.forecast ?? ((o = a.event) == null ? void 0 : o.forecast) ?? []);
          },
          { type: "weather/subscribe_forecast", entity_id: t, forecast_type: i }
        );
        this.unsubscribers.push(r);
      } catch {
        s([]);
      }
    };
    await Promise.all([e(this.config.hourly_weather ?? this.config.current_weather, "hourly", (t) => this.hourly = t), e(this.config.daily_weather ?? this.config.current_weather, "daily", (t) => this.daily = t)]);
  }
  async subscribeCalendar(e) {
    if (!this.hass) return;
    const t = new Date(this.now);
    t.setHours(0, 0, 0, 0);
    const i = new Date(t);
    i.setDate(i.getDate() + 1);
    try {
      const s = await this.hass.connection.subscribeMessage((r) => {
        var o;
        const a = r.events ?? ((o = r.event) == null ? void 0 : o.events) ?? [];
        this.eventsByCalendar.set(e, a), this.events = [...this.eventsByCalendar.values()].flat().sort((c, l) => String(c.start).localeCompare(String(l.start)));
      }, { type: "calendar/event/subscribe", entity_id: e, start: t.toISOString(), end: i.toISOString() });
      this.unsubscribers.push(s);
    } catch {
    }
  }
  t(e, t) {
    var s, r;
    const i = this.locale().toLowerCase().startsWith("fi") ? G.card : z.card;
    return ((r = (s = this.config) == null ? void 0 : s.labels) == null ? void 0 : r[e]) ?? i[e] ?? t;
  }
  locale() {
    var e;
    return ((e = this.hass) == null ? void 0 : e.locale.language) ?? navigator.language;
  }
  weatherEntity() {
    var e;
    return (e = this.hass) == null ? void 0 : e.states[this.config.current_weather];
  }
  formatTime(e) {
    var t;
    return new Intl.DateTimeFormat(this.locale(), { hour: "2-digit", minute: "2-digit", hour12: ((t = this.hass) == null ? void 0 : t.locale.time_format) === "12" }).format(e);
  }
  icon(e, t) {
    const i = t ? [21, 22, 23, 0, 1, 2, 3, 4, 5].includes(C2(t).getHours()) : this.now.getHours() < 6 || this.now.getHours() > 20;
    return _0[d0(e, i)] ?? k2;
  }
  conditionLabel(e) {
    return e ? h0(e) ? (this.locale().toLowerCase().startsWith("fi") ? G.conditions : z.conditions)[e] ?? e.replaceAll("-", " ") : `${this.t("unknown_condition", "Unknown condition")}: ${e}` : "—";
  }
  renderForecast(e, t = !1) {
    var a, o, c;
    const i = ((a = this.weatherEntity()) == null ? void 0 : a.attributes.temperature_unit) ?? "°", s = C2(e.datetime), r = t ? new Intl.DateTimeFormat(this.locale(), { weekday: "short", day: "numeric", month: "numeric" }).format(s) : this.formatTime(s);
    return p`<div class="forecast-item">
      <div class="forecast-time">${r}</div>
      <img class="forecast-icon" src=${this.icon(e.condition, e.datetime)} alt=${e.condition ?? ""} />
      <div class="forecast-temperature">${J(e.temperature, i)}</div>
      ${t ? h : p`<div class="wind">${p2(e.wind_bearing)} ${Z(e.wind_speed, ((o = this.weatherEntity()) == null ? void 0 : o.attributes.wind_speed_unit) ?? "")}</div>${e.wind_gust_speed !== void 0 ? p`<div class="gust">💨 ${Z(e.wind_gust_speed, ((c = this.weatherEntity()) == null ? void 0 : c.attributes.wind_speed_unit) ?? "")}</div>` : h}`}
    </div>`;
  }
  render() {
    var c;
    if (!this.config || !this.hass) return p``;
    const e = this.weatherEntity(), t = (e == null ? void 0 : e.attributes) ?? {}, i = e == null ? void 0 : e.state, s = t.temperature_unit ?? "°", r = this.config.temperature_entity ? (c = this.hass.states[this.config.temperature_entity]) == null ? void 0 : c.state : t.temperature, a = this.hourly.slice(0, this.config.hourly_forecast_count ?? 5), o = this.daily.slice(0, this.config.daily_forecast_count ?? 5);
    return p`<ha-card>
      <section class="current" part="current">
        <div class="current-copy">
          <div class="date">${new Intl.DateTimeFormat(this.locale(), { weekday: "long", day: "numeric", month: "long" }).format(this.now)}</div>
          <time class="clock">${this.formatTime(this.now)}</time>
          <div class="condition">${this.conditionLabel(i)}</div>
          <div class="temperature-row"><div class="temperature">${J(r, s)}</div>
            <div class="sensor-list">${(this.config.sensors ?? []).map((l) => {
      var u, d;
      return p`<div>${l.label}: ${J((d = (u = this.hass) == null ? void 0 : u.states[l.entity]) == null ? void 0 : d.state, l.unit ?? s)}</div>`;
    })}</div>
          </div>
          <div class="wind-details">${p2(t.wind_bearing)} ${Z(t.wind_speed, t.wind_speed_unit ?? "")}${t.wind_gust_speed !== void 0 ? p`<span>💨 ${Z(t.wind_gust_speed, t.wind_speed_unit ?? "")}</span>` : h}</div>
        </div>
        <img class="current-icon" src=${this.icon(i)} alt=${i ?? ""} />
      </section>
      ${this.config.show_calendar !== !1 ? p`<section class="calendar" part="calendar"><ha-icon icon=${this.config.calendar_icon ?? "mdi:calendar-today"}></ha-icon><div><strong>${this.config.calendar_title ?? this.t("today", "Today")}</strong>${this.events.length ? this.events.map((l) => p`<div>${this.eventTime(l)} ${l.summary ?? ""}</div>`) : p`<div class="muted">${this.t("no_events", "No events today")}</div>`}</div></section>` : h}
      ${a.length ? p`<section class="forecast hourly" part="hourly-forecast">${a.map((l) => this.renderForecast(l))}</section>` : h}
      ${o.length ? p`<section class="forecast daily" part="daily-forecast">${o.map((l) => this.renderForecast(l, !0))}</section>` : h}
    </ha-card>`;
  }
  eventTime(e) {
    return e.start.includes("T") ? this.formatTime(new Date(e.start)) : this.t("all_day", "All day");
  }
};
L2(_, "styles", y2`
    :host { display:block; align-self:start; --weather-clock-accent: var(--primary-color); --weather-clock-icon-size: 150px; --weather-clock-clock-size: 60px; }
    ha-card { height:auto; overflow:hidden; color:var(--primary-text-color); background:var(--ha-card-background, var(--card-background-color)); border-radius:var(--ha-card-border-radius, 24px); }
    section { box-sizing:border-box; } .current { display:flex; align-items:center; justify-content:space-between; gap:16px; padding:16px 24px; } .date,.condition { font-weight:700; text-transform:uppercase; letter-spacing:.02em; } .date { font-size:1rem; } .clock { display:block; font-size:var(--weather-clock-clock-size); font-weight:800; line-height:1; margin:6px 0 16px; letter-spacing:-.06em; } .condition { font-size:1rem; } .temperature-row { display:flex; align-items:center; gap:16px; margin:6px 0 10px; } .temperature { font-size:40px; font-weight:800; line-height:1; letter-spacing:-.06em; } .sensor-list { font-size:14px; font-weight:700; line-height:1.45; text-transform:uppercase; } .wind-details { font-size:14px; font-weight:700; } .wind-details span { margin-left:8px; } .current-icon { width:var(--weather-clock-icon-size); min-width:var(--weather-clock-icon-size); height:var(--weather-clock-icon-size); object-fit:contain; }
    .calendar { display:flex; gap:18px; align-items:center; padding:10px 24px; border-top:1px solid var(--divider-color); border-bottom:1px solid var(--divider-color); } .calendar ha-icon { color:var(--weather-clock-accent); } .calendar strong { display:block; margin-bottom:3px; } .muted { color:var(--secondary-text-color); }
    .forecast { display:flex; justify-content:space-between; gap:12px; padding:16px; } .daily { border-top:1px solid var(--divider-color); } .forecast-item { flex:1 1 0; min-width:0; text-align:center; font-weight:700; } .forecast-time { min-height:2.3em; font-size:16px; text-transform:capitalize; } .forecast-icon { display:block; width:60px; height:60px; object-fit:contain; margin:6px auto; } .forecast-temperature { font-size:18px; } .wind,.gust { white-space:nowrap; margin-top:6px; font-size:14px; }
    @media (max-width: 500px) { .current { padding:22px; } .calendar { padding:14px 22px; } .clock { font-size:3.7rem; } .forecast { padding:18px 8px; gap:2px; } .forecast-icon { width:46px; height:46px; } .forecast-time { font-size:.85rem; } .forecast-temperature { font-size:1.25rem; } .wind,.gust { font-size:.75rem; } }
  `);
f([
  t2({ attribute: !1 })
], _.prototype, "hass", 2);
f([
  D()
], _.prototype, "hourly", 2);
f([
  D()
], _.prototype, "daily", 2);
f([
  D()
], _.prototype, "events", 2);
f([
  D()
], _.prototype, "now", 2);
_ = f([
  $2("weather-clock-card")
], _);
let O = class extends A {
  constructor() {
    super(...arguments);
    C(this, "hass");
    C(this, "config", { current_weather: "" });
  }
  setConfig(e) {
    this.config = { type: "custom:weather-clock-card", ...e }, this.requestUpdate();
  }
  change() {
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this.config }, bubbles: !0, composed: !0 }));
  }
  label(e) {
    var i;
    return ((i = this.hass) != null && i.locale.language.toLowerCase().startsWith("fi") ? G.editor : z.editor)[e] ?? z.editor[e];
  }
  get formData() {
    const { type: e, ...t } = this.config;
    return t;
  }
  updateSensors(e) {
    this.config = { ...this.config, sensors: e }, this.change();
  }
  renderSensors() {
    var i;
    const e = this.config.sensors ?? [], t = (i = this.hass) == null ? void 0 : i.locale.language.toLowerCase().startsWith("fi");
    return p`<div class="sensors"><h3>${t ? "Lisäsensorit" : "Additional sensors"}</h3>
      ${e.map((s, r) => p`<div class="sensor-row">
        <ha-form .hass=${this.hass} .data=${s} .schema=${[
      { name: "entity", selector: { entity: { domain: "sensor" } } },
      { name: "label", selector: { text: {} } }
    ]} .computeLabel=${(a) => a.name === "entity" ? t ? "Sensori" : "Sensor" : t ? "Otsikko" : "Label"}
          @value-changed=${(a) => this.updateSensors(e.map((o, c) => c === r ? a.detail.value : o))}></ha-form>
        <button class="remove" @click=${() => this.updateSensors(e.filter((a, o) => o !== r))} aria-label="Remove sensor">×</button>
      </div>`)}
      ${e.length < 3 ? p`<button class="add" @click=${() => this.updateSensors([...e, { entity: "", label: "" }])}>${t ? "Lisää sensori" : "Add sensor"}</button>` : h}
    </div>`;
  }
  render() {
    return p`<ha-card><div class="editor"><ha-form .hass=${this.hass} .data=${this.formData} .computeLabel=${(e) => this.label(e.name)} .schema=${[
      { name: "current_weather", required: !0, selector: { entity: { domain: "weather" } } },
      { name: "hourly_weather", selector: { entity: { domain: "weather" } } },
      { name: "daily_weather", selector: { entity: { domain: "weather" } } },
      { name: "temperature_entity", selector: { entity: { domain: "sensor" } } },
      { name: "calendars", selector: { entity: { domain: "calendar", multiple: !0 } } },
      { name: "hourly_forecast_count", selector: { number: { min: 1, max: 12, mode: "box" } } },
      { name: "daily_forecast_count", selector: { number: { min: 1, max: 12, mode: "box" } } },
      { name: "show_calendar", selector: { boolean: {} } },
      { name: "calendar_title", selector: { text: {} } },
      { name: "calendar_icon", selector: { icon: {} } }
    ]} @value-changed=${(e) => {
      this.config = { ...this.config, ...e.detail.value }, this.change();
    }}></ha-form>${this.renderSensors()}</div></ha-card>`;
  }
};
L2(O, "styles", y2`.editor { padding: 16px; } .sensors { border-top: 1px solid var(--divider-color); margin-top: 18px; padding-top: 14px; } h3 { margin:0 0 10px; font-size:1rem; } .sensor-row { display:grid; grid-template-columns:1fr auto; align-items:start; gap:8px; margin:8px 0; } .remove,.add { border:0; border-radius:8px; background:var(--secondary-background-color); color:var(--primary-text-color); cursor:pointer; font:inherit; padding:8px 12px; } .remove { font-size:1.35rem; line-height:1; }`);
f([
  t2({ attribute: !1 })
], O.prototype, "hass", 2);
f([
  D()
], O.prototype, "config", 2);
O = f([
  $2("weather-clock-card-editor")
], O);
window.customCards = window.customCards || [];
window.customCards.push({ type: "weather-clock-card", name: "Weather Clock Card", description: "Clock, weather forecasts and today's calendar events." });
export {
  _ as WeatherClockCard
};
