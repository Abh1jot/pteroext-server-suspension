await Promise.all(["client.css"].map(file => new Promise((resolve, reject) => {
    const existing = document.querySelector(`link[href*="${file}"]`);
    if (existing) return resolve();
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = new URL(file, import.meta.url).href;
    link.onload = () => resolve();
    link.onerror = () => { link.remove(); reject(new Error('Unable to load extension stylesheet: ' + file)); };
    document.head.append(link);
})));
import { useCurrentServerRequired as g, definePterodactylExtension as L } from "@pterodactyl/sdk";
import { jsxs as o, jsx as r } from "react/jsx-runtime";
import { useState as $, useEffect as w } from "react";
import { useQuery as x } from "@tanstack/react-query";
function h(s) {
  const i = new Date(s), p = i.getTime(), n = Date.now(), t = p - n, a = i.toLocaleDateString(void 0, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  }) + " • " + i.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (t <= 0)
    return {
      formattedDate: a,
      formattedTimeLeft: "Past due (Pending)",
      daysLeft: 0,
      hoursLeft: 0,
      minutesLeft: 0,
      isPastDue: !0,
      percent: 0,
      urgency: "critical"
    };
  const e = Math.floor(t / (1e3 * 60)), l = Math.floor(e / 60), c = Math.floor(l / 24), m = l % 24, f = e % 60;
  let d = "";
  c > 0 ? d = `${c}d ${m}h left` : m > 0 ? d = `${m}h ${f}m left` : d = `${Math.max(1, f)}m left`;
  let u = "good";
  c < 1 ? u = "critical" : c < 7 ? u = "warning" : u = "good";
  const y = 30 * 24 * 60 * 60 * 1e3, v = Math.min(100, Math.max(4, Math.round(t / y * 100)));
  return {
    formattedDate: a,
    formattedTimeLeft: d,
    daysLeft: c,
    hoursLeft: m,
    minutesLeft: f,
    isPastDue: !1,
    percent: v,
    urgency: u
  };
}
function N() {
  let s = "";
  try {
    const e = g();
    s = e?.attributes?.identifier || e?.identifier || "";
  } catch {
    const e = window.location.pathname.match(/\/server\/([a-zA-Z0-9_\-]+)/);
    e && (s = e[1]);
  }
  const [, i] = $(0);
  w(() => {
    const e = setInterval(() => i((l) => l + 1), 3e4);
    return () => clearInterval(e);
  }, []);
  const n = x({
    queryKey: ["server-suspension-status", s],
    queryFn: async () => {
      if (!s) return { scheduled: !1 };
      try {
        const e = await fetch(`/api/client/servers/${s}/extensions/server-suspension/status`);
        if (e.ok) return e.json();
      } catch {
      }
      try {
        const e = await fetch(`/api/client/extensions/server-suspension/server/${s}/status`);
        if (e.ok) return e.json();
      } catch {
      }
      return { scheduled: !1 };
    },
    enabled: !!s,
    refetchInterval: 6e4
  }).data;
  if (!n || !n.scheduled || !n.suspension_date)
    return null;
  const t = h(n.suspension_date), a = n.termination_date ? h(n.termination_date) : null;
  return /* @__PURE__ */ o("div", { className: `pe-slim-banner pe-slim-banner-${t.urgency}`, children: [
    /* @__PURE__ */ o("div", { className: "pe-slim-banner-body", children: [
      /* @__PURE__ */ o("div", { className: "pe-slim-banner-left", children: [
        /* @__PURE__ */ o(
          "svg",
          {
            className: "pe-slim-icon",
            width: "15",
            height: "15",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
              /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "10" }),
              /* @__PURE__ */ r("polyline", { points: "12 6 12 12 16 14" })
            ]
          }
        ),
        /* @__PURE__ */ r("span", { className: "pe-slim-title", children: "Server Suspension:" }),
        /* @__PURE__ */ r("span", { className: "pe-slim-date", children: t.formattedDate }),
        /* @__PURE__ */ r("span", { className: `pe-slim-chip pe-slim-chip-${t.urgency}`, children: t.formattedTimeLeft })
      ] }),
      /* @__PURE__ */ o("div", { className: "pe-slim-banner-right", children: [
        a && /* @__PURE__ */ o("span", { className: "pe-slim-term-notice", title: `Permanent termination date: ${a.formattedDate}`, children: [
          "Termination: ",
          a.formattedDate.split("•")[0],
          " (",
          a.formattedTimeLeft,
          ")"
        ] }),
        n.notes && /* @__PURE__ */ r("span", { className: "pe-slim-note", title: n.notes, children: n.notes })
      ] })
    ] }),
    /* @__PURE__ */ r("div", { className: "pe-slim-track", title: `Suspension in ${t.formattedTimeLeft} (${t.formattedDate})`, children: /* @__PURE__ */ r(
      "div",
      {
        className: `pe-slim-fill pe-slim-fill-${t.urgency}`,
        style: { width: `${t.percent}%` }
      }
    ) })
  ] });
}
const k = L({
  setup({ screens: s, slots: i }) {
    s.register("admin-suspension", () => import("./chunk.SuspensionScreen.BRZ8Q8e_.js")), i.register("server.console.before", N);
  }
});
export {
  k as default
};
