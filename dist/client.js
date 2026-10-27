await Promise.all(["server-suspension.css"].map(file => new Promise((resolve, reject) => {const href = new URL(file, import.meta.url).href;if (document.querySelector('link[href="' + href + '"]')) return resolve();const link = document.createElement('link');link.rel = 'stylesheet';link.href = href;link.onload = () => resolve();link.onerror = () => { link.remove(); reject(new Error('Unable to load extension stylesheet: ' + file)); };document.head.append(link);})));
import { jsxs as n, jsx as t } from "react/jsx-runtime";
import { useState as i, useRef as q, useEffect as me } from "react";
import { useQueryClient as rt, useQuery as ue, useMutation as I } from "@tanstack/react-query";
import { toast as b, useCurrentServerRequired as ot, definePterodactylExtension as ct } from "@pterodactyl/sdk";
function Q(c) {
  if (!c)
    return {
      hasDate: !1,
      formattedDate: "None",
      formattedTimeLeft: "No date set",
      daysLeft: 0,
      hoursLeft: 0,
      minutesLeft: 0,
      isPastDue: !1,
      percent: 100,
      urgency: "good"
    };
  const m = new Date(c), E = m.getTime(), u = Date.now(), p = E - u, f = m.toLocaleDateString(void 0, {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }) + " " + m.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (p <= 0)
    return {
      hasDate: !0,
      formattedDate: f,
      formattedTimeLeft: "Past due (Pending)",
      daysLeft: 0,
      hoursLeft: 0,
      minutesLeft: 0,
      isPastDue: !0,
      percent: 0,
      urgency: "critical"
    };
  const r = Math.floor(p / (1e3 * 60)), T = Math.floor(r / 60), d = Math.floor(T / 24), o = T % 24, v = r % 60;
  let S = "";
  d > 0 ? S = `${d}d ${o}h left` : o > 0 ? S = `${o}h ${v}m left` : S = `${Math.max(1, v)}m left`;
  let g = "good";
  d < 1 ? g = "critical" : d < 7 ? g = "warning" : g = "good";
  const w = 30 * 24 * 60 * 60 * 1e3, k = Math.min(100, Math.max(6, Math.round(p / w * 100)));
  return {
    hasDate: !0,
    formattedDate: f,
    formattedTimeLeft: S,
    daysLeft: d,
    hoursLeft: o,
    minutesLeft: v,
    isPastDue: !1,
    percent: k,
    urgency: g
  };
}
function dt() {
  const c = rt(), [m, E] = i(""), [u, p] = i("all"), [f, r] = i("all"), [T, d] = i(!1), [o, v] = i(null), [S, g] = i(!1), [w, k] = i(""), [A, L] = i(""), [he, $] = i(!0), [fe, B] = i(""), [G, H] = i(""), [K, Ae] = i(""), [ge, Oe] = i(7), [be, Re] = i(!0), [D, O] = i([]), C = q(null), Y = q(!1), ye = q(0), ve = q(0), [qe, Ne] = i(!1), Se = (e) => {
    if (!C.current) return;
    const a = e === "left" ? -350 : 350;
    C.current.scrollBy({ left: a, behavior: "smooth" });
  }, Qe = (e) => {
    const a = C.current;
    if (a && !(Math.abs(e.deltaX) > 0) && Math.abs(e.deltaY) > 0) {
      const s = a.scrollWidth - a.clientWidth;
      if (s <= 0) return;
      const l = a.scrollLeft > 0, h = a.scrollLeft < s - 1;
      (e.deltaY > 0 && h || e.deltaY < 0 && l) && (a.scrollLeft += e.deltaY, e.preventDefault());
    }
  }, Ge = (e) => {
    e.button !== 0 || e.target.closest("button, input, select, a, .pe-btn, .pe-quick-edit-btn, .pe-time-clickable") || C.current && (Y.current = !0, ye.current = e.pageX - C.current.offsetLeft, ve.current = C.current.scrollLeft, Ne(!0));
  }, He = (e) => {
    if (!Y.current || !C.current) return;
    e.preventDefault();
    const s = (e.pageX - C.current.offsetLeft - ye.current) * 1.4;
    C.current.scrollLeft = ve.current - s;
  }, we = () => {
    Y.current = !1, Ne(!1);
  }, [ke, R] = i(!1), [x, J] = i("suspension"), [Ce, xe] = i(!0), [X, _e] = i("[Notice] Server Suspended: {server_name}"), [U, V] = i(""), [Te, De] = i(!0), [Z, Me] = i("[Warning] Your server {server_name} expires soon"), [ee, te] = i(""), [Le, Ee] = i(!0), [ne, je] = i("[Final Notice] Server Terminated: {server_name}"), [ae, se] = i(""), [W, Pe] = i(""), [$e, Be] = i(!1), _ = ue({
    queryKey: ["admin-suspension-overview"],
    queryFn: async () => {
      const e = await fetch("/api/admin/extensions/server-suspension/overview");
      if (!e.ok) {
        const a = await e.json().catch(() => ({}));
        throw new Error(a.error || "Failed to load server suspension overview");
      }
      return e.json();
    },
    staleTime: 5e3,
    refetchOnWindowFocus: !0
  }), y = _.data?.servers || [];
  me(() => {
    !o && y.length > 0 && v(y[0].id);
  }, [y, o]);
  const ie = I({
    mutationFn: async (e) => {
      const a = await fetch("/api/admin/extensions/server-suspension/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(e)
      }), s = await a.json();
      if (!a.ok) throw new Error(s.error || "Failed to update schedule");
      return s;
    },
    onSuccess: (e) => {
      b.success(e.message || "Schedule updated"), d(!1), c.invalidateQueries({ queryKey: ["admin-suspension-overview"] });
    },
    onError: (e) => b.error(e.message)
  }), le = I({
    mutationFn: async (e) => {
      const a = await fetch("/api/admin/extensions/server-suspension/bulk-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(e)
      }), s = await a.json();
      if (!a.ok) throw new Error(s.error || "Failed to apply bulk schedule");
      return s;
    },
    onSuccess: (e) => {
      b.success(e.message || "Bulk schedule saved"), g(!1), O([]), c.invalidateQueries({ queryKey: ["admin-suspension-overview"] });
    },
    onError: (e) => b.error(e.message)
  }), j = I({
    mutationFn: async ({ server_id: e, action: a }) => {
      const s = await fetch("/api/admin/extensions/server-suspension/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ server_id: e, action: a })
      }), l = await s.json();
      if (!s.ok) throw new Error(l.error || "Failed to perform action");
      return l;
    },
    onSuccess: (e) => {
      b.success(e.message || "Action executed successfully"), c.invalidateQueries({ queryKey: ["admin-suspension-overview"] });
    },
    onError: (e) => b.error(e.message)
  }), re = I({
    mutationFn: async () => {
      const e = await fetch("/api/admin/extensions/server-suspension/process-due", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      }), a = await e.json();
      if (!e.ok) throw new Error(a.error || "Failed to process due items");
      return a;
    },
    onSuccess: (e) => {
      b.success(e.message || "Due schedules processed"), c.invalidateQueries({ queryKey: ["admin-suspension-overview"] });
    },
    onError: (e) => b.error(e.message)
  }), oe = ue({
    queryKey: ["admin-suspension-mail-templates"],
    queryFn: async () => {
      const e = await fetch("/api/admin/extensions/server-suspension/mail-templates");
      if (!e.ok) throw new Error("Failed to load email notification templates");
      return e.json();
    },
    enabled: ke
  });
  me(() => {
    if (oe.data) {
      const e = oe.data;
      xe(!!e.mail_notifications_enabled), e.mail_subject && _e(e.mail_subject), e.mail_body && V(e.mail_body), De(!!e.warning_mail_enabled), e.warning_mail_subject && Me(e.warning_mail_subject), e.warning_mail_body && te(e.warning_mail_body), Ee(!!e.termination_mail_enabled), e.termination_mail_subject && je(e.termination_mail_subject), e.termination_mail_body && se(e.termination_mail_body), !W && e.admin_email && Pe(e.admin_email);
    }
  }, [oe.data]);
  const ce = I({
    mutationFn: async () => {
      const a = await fetch("/api/admin/extensions/server-suspension/mail-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mail_notifications_enabled: Ce,
          mail_subject: X,
          mail_body: U,
          warning_mail_enabled: Te,
          warning_mail_subject: Z,
          warning_mail_body: ee,
          termination_mail_enabled: Le,
          termination_mail_subject: ne,
          termination_mail_body: ae
        })
      }), s = await a.json();
      if (!a.ok) throw new Error(s.error || "Failed to save email templates");
      return s;
    },
    onSuccess: (e) => {
      b.success(e.message || "Email templates saved successfully"), c.invalidateQueries({ queryKey: ["admin-suspension-mail-templates"] });
    },
    onError: (e) => b.error(e.message)
  }), Ke = async () => {
    if (!W.trim()) {
      b.error("Please enter a destination email address for the test.");
      return;
    }
    Be(!0);
    try {
      let e = X, a = U;
      x === "warning" ? (e = Z, a = ee) : x === "termination" && (e = ne, a = ae);
      const s = await fetch("/api/admin/extensions/server-suspension/test-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template_type: x,
          subject: e,
          body: a,
          email: W.trim()
        })
      }), l = await s.json();
      if (!s.ok) throw new Error(l.error || "Failed to deliver test email");
      b.success(l.message || "Test email dispatched successfully!");
    } catch (e) {
      b.error(e.message);
    } finally {
      Be(!1);
    }
  }, Ye = (e) => {
    x === "suspension" ? V((a) => a + (a.endsWith(" ") || a === "" ? "" : " ") + e) : x === "warning" ? te((a) => a + (a.endsWith(" ") || a === "" ? "" : " ") + e) : se((a) => a + (a.endsWith(" ") || a === "" ? "" : " ") + e), b.info(`Inserted placeholder ${e}`);
  }, F = (e) => {
    v(e.id), k(e.suspension_date ? e.suspension_date.slice(0, 16) : ""), L(e.termination_date ? e.termination_date.slice(0, 16) : ""), $(e.notify_user), B(e.notes || ""), H(""), d(!0);
  }, Je = () => {
    H("");
    const e = o && y.find((a) => a.id === o) || y[0];
    e ? (v(e.id), k(e.suspension_date ? e.suspension_date.slice(0, 16) : ""), L(e.termination_date ? e.termination_date.slice(0, 16) : ""), $(e.notify_user), B(e.notes || "")) : (k(""), L(""), $(!0), B("")), d(!0);
  }, Xe = (e) => {
    v(e);
    const a = y.find((s) => s.id === e);
    a && (k(a.suspension_date ? a.suspension_date.slice(0, 16) : ""), L(a.termination_date ? a.termination_date.slice(0, 16) : ""), $(a.notify_user), B(a.notes || ""));
  }, z = (e) => {
    const a = /* @__PURE__ */ new Date();
    a.setDate(a.getDate() + e);
    const s = (h) => String(h).padStart(2, "0"), l = `${a.getFullYear()}-${s(a.getMonth() + 1)}-${s(a.getDate())}T${s(a.getHours())}:${s(a.getMinutes())}`;
    k(l);
  }, de = (e) => {
    const a = w ? new Date(w) : /* @__PURE__ */ new Date();
    a.setDate(a.getDate() + e);
    const s = (h) => String(h).padStart(2, "0"), l = `${a.getFullYear()}-${s(a.getMonth() + 1)}-${s(a.getDate())}T${s(a.getHours())}:${s(a.getMinutes())}`;
    L(l);
  }, M = y.filter((e) => {
    const a = e.name.toLowerCase().includes(m.toLowerCase()) || e.identifier.toLowerCase().includes(m.toLowerCase()) || e.owner.toLowerCase().includes(m.toLowerCase()) || e.owner_email.toLowerCase().includes(m.toLowerCase()), s = u === "all" || e.node_id === Number(u);
    let l = !0;
    return f === "active" && (l = e.server_status !== "suspended" && !e.suspension_date), f === "scheduled" && (l = !!e.suspension_date && e.server_status !== "suspended"), f === "suspended" && (l = e.server_status === "suspended"), a && s && l;
  }), Ue = (e) => {
    O(
      (a) => a.includes(e) ? a.filter((s) => s !== e) : [...a, e]
    );
  }, Ve = () => {
    D.length === M.length ? O([]) : O(M.map((e) => e.id));
  }, We = y.filter((e) => {
    if (!G.trim()) return !0;
    const a = G.toLowerCase();
    return e.name.toLowerCase().includes(a) || e.identifier.toLowerCase().includes(a) || e.owner.toLowerCase().includes(a) || e.owner_email.toLowerCase().includes(a);
  }), pe = y.find((e) => e.id === o), P = Q(w || null), Fe = Q(A || null);
  return /* @__PURE__ */ n("div", { className: "pe-container", children: [
    /* @__PURE__ */ n("div", { className: "pe-header", children: [
      /* @__PURE__ */ n("div", { className: "pe-title-wrap", children: [
        /* @__PURE__ */ t("h2", { className: "pe-title", children: "Auto Server Suspension & Termination" }),
        /* @__PURE__ */ t("p", { className: "pe-subtitle", children: "Manage automated expiration schedules, owner suspension notifications, and grace-period server termination." })
      ] }),
      /* @__PURE__ */ n("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" }, children: [
        /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            className: "pe-btn pe-btn-primary",
            onClick: Je,
            children: "+ Set Suspension Date"
          }
        ),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "pe-btn pe-btn-secondary",
            onClick: () => g(!0),
            children: [
              "Bulk Schedule ",
              D.length > 0 ? `(${D.length})` : ""
            ]
          }
        ),
        /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            className: "pe-btn pe-btn-secondary",
            disabled: re.isPending,
            onClick: () => re.mutate(),
            children: re.isPending ? /* @__PURE__ */ t("span", { className: "pe-spinner" }) : "Process Due Schedules"
          }
        ),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "pe-btn pe-btn-secondary",
            onClick: () => R(!0),
            style: { display: "inline-flex", alignItems: "center", gap: 6 },
            children: [
              /* @__PURE__ */ n("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                /* @__PURE__ */ t("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }),
                /* @__PURE__ */ t("polyline", { points: "22,6 12,13 2,6" })
              ] }),
              "Email Templates"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ n("div", { className: "pe-stats-row", children: [
      /* @__PURE__ */ n("div", { className: "pe-stat-card", children: [
        /* @__PURE__ */ t("span", { className: "pe-stat-val", children: _.data?.stats.total ?? 0 }),
        /* @__PURE__ */ t("span", { className: "pe-stat-label", children: "Total Servers" })
      ] }),
      /* @__PURE__ */ n("div", { className: "pe-stat-card", children: [
        /* @__PURE__ */ t("span", { className: "pe-stat-val", style: { color: "#facc15" }, children: _.data?.stats.scheduled ?? 0 }),
        /* @__PURE__ */ t("span", { className: "pe-stat-label", children: "Scheduled for Suspension" })
      ] }),
      /* @__PURE__ */ n("div", { className: "pe-stat-card", children: [
        /* @__PURE__ */ t("span", { className: "pe-stat-val", style: { color: "#f87171" }, children: _.data?.stats.suspended ?? 0 }),
        /* @__PURE__ */ t("span", { className: "pe-stat-label", children: "Currently Suspended" })
      ] }),
      /* @__PURE__ */ n("div", { className: "pe-stat-card", children: [
        /* @__PURE__ */ t("span", { className: "pe-stat-val", style: { color: "#94a3b8" }, children: _.data?.stats.terminated ?? 0 }),
        /* @__PURE__ */ t("span", { className: "pe-stat-label", children: "Terminated" })
      ] })
    ] }),
    /* @__PURE__ */ n("div", { className: "pe-toolbar", children: [
      /* @__PURE__ */ n("div", { className: "pe-input-box", children: [
        /* @__PURE__ */ n("svg", { className: "pe-input-icon", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
          /* @__PURE__ */ t("circle", { cx: "11", cy: "11", r: "8" }),
          /* @__PURE__ */ t("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
        ] }),
        /* @__PURE__ */ t(
          "input",
          {
            className: "pe-input",
            type: "text",
            placeholder: "Search servers by name, identifier, or owner email...",
            value: m,
            onChange: (e) => E(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ n(
        "select",
        {
          className: "pe-select",
          value: u,
          onChange: (e) => p(e.target.value),
          children: [
            /* @__PURE__ */ t("option", { value: "all", children: "All Nodes" }),
            _.data?.nodes?.map((e) => /* @__PURE__ */ t("option", { value: e.id, children: e.name }, e.id))
          ]
        }
      ),
      /* @__PURE__ */ n(
        "select",
        {
          className: "pe-select",
          value: f,
          onChange: (e) => r(e.target.value),
          children: [
            /* @__PURE__ */ t("option", { value: "all", children: "All Statuses" }),
            /* @__PURE__ */ t("option", { value: "active", children: "Active" }),
            /* @__PURE__ */ t("option", { value: "scheduled", children: "Scheduled" }),
            /* @__PURE__ */ t("option", { value: "suspended", children: "Suspended" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ n("div", { className: "pe-table-meta-bar", children: [
      /* @__PURE__ */ n("div", { className: "pe-table-meta-count", children: [
        "Showing ",
        /* @__PURE__ */ t("strong", { children: M.length }),
        " of ",
        /* @__PURE__ */ t("strong", { children: y.length }),
        " panel servers"
      ] }),
      /* @__PURE__ */ n("div", { className: "pe-table-scroll-controls", children: [
        /* @__PURE__ */ n("span", { className: "pe-scroll-hint", children: [
          /* @__PURE__ */ n("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
            /* @__PURE__ */ t("line", { x1: "5", y1: "12", x2: "19", y2: "12" }),
            /* @__PURE__ */ t("polyline", { points: "12 5 19 12 12 19" }),
            /* @__PURE__ */ t("polyline", { points: "12 19 5 12 12 5" })
          ] }),
          "Scroll table:"
        ] }),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "pe-scroll-btn",
            title: "Scroll table left",
            onClick: () => Se("left"),
            children: [
              /* @__PURE__ */ t("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ t("polyline", { points: "15 18 9 12 15 6" }) }),
              "Left"
            ]
          }
        ),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "pe-scroll-btn",
            title: "Scroll table right",
            onClick: () => Se("right"),
            children: [
              "Right",
              /* @__PURE__ */ t("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ t("polyline", { points: "9 18 15 12 9 6" }) })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ t(
      "div",
      {
        ref: C,
        className: `pe-table-card ${qe ? "pe-table-dragging" : ""}`,
        onWheel: Qe,
        onMouseDown: Ge,
        onMouseMove: He,
        onMouseUp: we,
        onMouseLeave: we,
        children: /* @__PURE__ */ n("table", { className: "pe-table", children: [
          /* @__PURE__ */ t("thead", { children: /* @__PURE__ */ n("tr", { children: [
            /* @__PURE__ */ t("th", { style: { width: 44, textAlign: "center" }, children: /* @__PURE__ */ t(
              "input",
              {
                type: "checkbox",
                checked: M.length > 0 && D.length === M.length,
                onChange: Ve
              }
            ) }),
            /* @__PURE__ */ t("th", { style: { minWidth: 170 }, children: "Server" }),
            /* @__PURE__ */ t("th", { style: { minWidth: 170 }, children: "Node / Owner" }),
            /* @__PURE__ */ t("th", { style: { minWidth: 110 }, children: "Status" }),
            /* @__PURE__ */ t("th", { style: { minWidth: 220 }, children: "Suspension Date & Time Left" }),
            /* @__PURE__ */ t("th", { style: { minWidth: 200 }, children: "Termination Grace" }),
            /* @__PURE__ */ t("th", { className: "pe-col-sticky-right", style: { minWidth: 250, textAlign: "right" }, children: "Actions" })
          ] }) }),
          /* @__PURE__ */ t("tbody", { children: _.isLoading ? /* @__PURE__ */ t("tr", { children: /* @__PURE__ */ n("td", { colSpan: 7, style: { textAlign: "center", padding: "36px 0" }, children: [
            /* @__PURE__ */ t("span", { className: "pe-spinner" }),
            /* @__PURE__ */ t("p", { className: "pe-subtitle", style: { marginTop: 8 }, children: "Loading panel servers..." })
          ] }) }) : M.length === 0 ? /* @__PURE__ */ t("tr", { children: /* @__PURE__ */ t("td", { colSpan: 7, style: { textAlign: "center", padding: "36px 0" }, children: /* @__PURE__ */ t("p", { className: "pe-subtitle", children: "No matching servers found on panel." }) }) }) : M.map((e) => {
            const a = e.server_status === "suspended", s = !!e.suspension_date, l = Q(e.suspension_date), h = Q(e.termination_date);
            return /* @__PURE__ */ n("tr", { children: [
              /* @__PURE__ */ t("td", { style: { textAlign: "center" }, children: /* @__PURE__ */ t(
                "input",
                {
                  type: "checkbox",
                  checked: D.includes(e.id),
                  onChange: () => Ue(e.id)
                }
              ) }),
              /* @__PURE__ */ t("td", { children: /* @__PURE__ */ n("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }, children: [
                /* @__PURE__ */ n("div", { children: [
                  /* @__PURE__ */ t("div", { style: { fontWeight: 600 }, children: e.name }),
                  /* @__PURE__ */ t("div", { style: { fontSize: "0.72rem", color: "var(--muted-foreground, #94a3b8)", fontFamily: "monospace" }, children: e.identifier })
                ] }),
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "pe-quick-edit-btn",
                    title: s ? "Edit Expiration Schedule" : "Set Suspension Date",
                    onClick: () => F(e),
                    children: [
                      /* @__PURE__ */ n("svg", { width: "11", height: "11", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
                        /* @__PURE__ */ t("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }),
                        /* @__PURE__ */ t("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })
                      ] }),
                      /* @__PURE__ */ t("span", { children: s ? "Edit" : "Set Date" })
                    ]
                  }
                )
              ] }) }),
              /* @__PURE__ */ n("td", { children: [
                /* @__PURE__ */ t("div", { style: { fontSize: "0.8125rem" }, children: e.node }),
                /* @__PURE__ */ n("div", { style: { fontSize: "0.72rem", color: "var(--muted-foreground, #94a3b8)" }, children: [
                  e.owner,
                  " (",
                  e.owner_email,
                  ")"
                ] })
              ] }),
              /* @__PURE__ */ t("td", { children: a ? /* @__PURE__ */ n("span", { className: "pe-badge pe-badge-suspended", children: [
                /* @__PURE__ */ t("span", { className: "pe-badge-dot" }),
                "Suspended"
              ] }) : s ? /* @__PURE__ */ n("span", { className: "pe-badge pe-badge-scheduled", children: [
                /* @__PURE__ */ t("span", { className: "pe-badge-dot" }),
                "Scheduled"
              ] }) : /* @__PURE__ */ n("span", { className: "pe-badge pe-badge-active", children: [
                /* @__PURE__ */ t("span", { className: "pe-badge-dot" }),
                "Active"
              ] }) }),
              /* @__PURE__ */ t("td", { children: l.hasDate ? /* @__PURE__ */ n(
                "div",
                {
                  className: "pe-time-cell pe-time-clickable",
                  title: "Click to edit suspension schedule",
                  onClick: () => F(e),
                  children: [
                    /* @__PURE__ */ n("div", { className: "pe-time-header", children: [
                      /* @__PURE__ */ t("span", { className: "pe-time-date", children: l.formattedDate }),
                      /* @__PURE__ */ t("span", { className: `pe-time-chip pe-time-chip-${l.urgency}`, children: l.formattedTimeLeft })
                    ] }),
                    /* @__PURE__ */ t(
                      "div",
                      {
                        className: "pe-progress-track",
                        title: `Suspension due: ${l.formattedDate} (${l.formattedTimeLeft})`,
                        children: /* @__PURE__ */ t(
                          "div",
                          {
                            className: `pe-progress-fill pe-progress-fill-${l.urgency}`,
                            style: { width: `${l.percent}%` }
                          }
                        )
                      }
                    )
                  ]
                }
              ) : /* @__PURE__ */ t(
                "div",
                {
                  className: "pe-time-cell pe-time-clickable",
                  title: "Click to set suspension date",
                  onClick: () => F(e),
                  style: { display: "inline-flex" },
                  children: /* @__PURE__ */ t("span", { className: "pe-time-chip pe-time-chip-muted pe-time-chip-hoverable", children: "+ Set Expiration Date" })
                }
              ) }),
              /* @__PURE__ */ t("td", { children: h.hasDate ? /* @__PURE__ */ n(
                "div",
                {
                  className: "pe-time-cell pe-time-clickable",
                  title: "Click to edit termination grace period",
                  onClick: () => F(e),
                  children: [
                    /* @__PURE__ */ n("div", { className: "pe-time-header", children: [
                      /* @__PURE__ */ t("span", { className: "pe-time-date", style: { color: "#f87171" }, children: h.formattedDate }),
                      /* @__PURE__ */ t("span", { className: `pe-time-chip pe-time-chip-${h.urgency}`, children: h.formattedTimeLeft })
                    ] }),
                    /* @__PURE__ */ t(
                      "div",
                      {
                        className: "pe-progress-track",
                        title: `Termination: ${h.formattedDate} (${h.formattedTimeLeft})`,
                        children: /* @__PURE__ */ t(
                          "div",
                          {
                            className: `pe-progress-fill pe-progress-fill-${h.urgency}`,
                            style: { width: `${h.percent}%` }
                          }
                        )
                      }
                    )
                  ]
                }
              ) : /* @__PURE__ */ t("span", { style: { fontSize: "0.75rem", color: "var(--muted-foreground, #64748b)" }, children: "None" }) }),
              /* @__PURE__ */ t("td", { className: "pe-col-sticky-right", children: /* @__PURE__ */ n("div", { className: "pe-actions-wrap", children: [
                /* @__PURE__ */ t(
                  "button",
                  {
                    type: "button",
                    className: "pe-btn pe-btn-primary pe-btn-sm",
                    onClick: () => F(e),
                    children: s ? "Edit Expiration" : "Set Suspension Date"
                  }
                ),
                s && /* @__PURE__ */ t(
                  "button",
                  {
                    type: "button",
                    className: "pe-btn pe-btn-secondary pe-btn-sm",
                    title: "Remove scheduled suspension & termination",
                    onClick: () => j.mutate({ server_id: e.id, action: "cancel" }),
                    children: "Remove Schedule"
                  }
                ),
                a ? /* @__PURE__ */ t(
                  "button",
                  {
                    type: "button",
                    className: "pe-btn pe-btn-secondary pe-btn-sm",
                    disabled: j.isPending,
                    onClick: () => j.mutate({ server_id: e.id, action: "unsuspend" }),
                    children: "Unsuspend"
                  }
                ) : /* @__PURE__ */ t(
                  "button",
                  {
                    type: "button",
                    className: "pe-btn pe-btn-danger pe-btn-sm",
                    disabled: j.isPending,
                    onClick: () => j.mutate({ server_id: e.id, action: "suspend" }),
                    children: "Suspend Now"
                  }
                )
              ] }) })
            ] }, e.id);
          }) })
        ] })
      }
    ),
    T && /* @__PURE__ */ t("div", { className: "pe-modal-overlay", onClick: () => d(!1), children: /* @__PURE__ */ n("div", { className: "pe-modal", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ n("div", { className: "pe-modal-header", children: [
        /* @__PURE__ */ t("h3", { className: "pe-title", style: { fontSize: "1.1rem" }, children: "Schedule Server Suspension & Expiration" }),
        /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            style: { background: "transparent", border: "none", color: "#94a3b8", fontSize: "1.4rem", cursor: "pointer" },
            onClick: () => d(!1),
            children: "×"
          }
        )
      ] }),
      /* @__PURE__ */ n("div", { className: "pe-form-group", children: [
        /* @__PURE__ */ n("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
          /* @__PURE__ */ t("label", { className: "pe-form-label", children: "Select Target Server" }),
          /* @__PURE__ */ n("span", { style: { fontSize: "0.72rem", color: "#94a3b8" }, children: [
            y.length,
            " servers available"
          ] })
        ] }),
        /* @__PURE__ */ t(
          "input",
          {
            type: "text",
            className: "pe-input",
            placeholder: "Search servers by name or identifier...",
            style: { marginBottom: 6, fontSize: "0.8125rem" },
            value: G,
            onChange: (e) => H(e.target.value)
          }
        ),
        /* @__PURE__ */ n(
          "select",
          {
            className: "pe-select",
            style: { width: "100%" },
            value: o ?? "",
            onChange: (e) => Xe(Number(e.target.value)),
            children: [
              _.isLoading && /* @__PURE__ */ t("option", { value: "", children: "Loading servers..." }),
              !_.isLoading && y.length === 0 && /* @__PURE__ */ t("option", { value: "", children: "No servers available on panel" }),
              !_.isLoading && y.length > 0 && We.length === 0 && /* @__PURE__ */ t("option", { value: "", children: "No servers matching filter" }),
              We.map((e) => /* @__PURE__ */ n("option", { value: e.id, children: [
                e.name,
                " (",
                e.identifier,
                ") - Owner: ",
                e.owner
              ] }, e.id))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ n("div", { className: "pe-form-group", children: [
        /* @__PURE__ */ n("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }, children: [
          /* @__PURE__ */ t("label", { className: "pe-form-label", style: { marginBottom: 0 }, children: "Suspension Date & Time" }),
          /* @__PURE__ */ n("div", { style: { display: "flex", gap: 4 }, children: [
            /* @__PURE__ */ t("button", { type: "button", className: "pe-btn-preset", onClick: () => z(3), children: "+3d" }),
            /* @__PURE__ */ t("button", { type: "button", className: "pe-btn-preset", onClick: () => z(7), children: "+7d" }),
            /* @__PURE__ */ t("button", { type: "button", className: "pe-btn-preset", onClick: () => z(14), children: "+14d" }),
            /* @__PURE__ */ t("button", { type: "button", className: "pe-btn-preset", onClick: () => z(30), children: "+30d" }),
            /* @__PURE__ */ t("button", { type: "button", className: "pe-btn-preset", onClick: () => z(60), children: "+60d" })
          ] })
        ] }),
        /* @__PURE__ */ t(
          "input",
          {
            type: "datetime-local",
            className: "pe-input",
            value: w,
            onChange: (e) => k(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ n("div", { className: "pe-form-group", children: [
        /* @__PURE__ */ n("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }, children: [
          /* @__PURE__ */ t("label", { className: "pe-form-label", style: { marginBottom: 0 }, children: "Permanent Termination Date (Optional)" }),
          /* @__PURE__ */ n("div", { style: { display: "flex", gap: 4 }, children: [
            /* @__PURE__ */ t("button", { type: "button", className: "pe-btn-preset", onClick: () => de(3), children: "+3d Grace" }),
            /* @__PURE__ */ t("button", { type: "button", className: "pe-btn-preset", onClick: () => de(7), children: "+7d Grace" }),
            /* @__PURE__ */ t("button", { type: "button", className: "pe-btn-preset", onClick: () => de(14), children: "+14d Grace" }),
            /* @__PURE__ */ t("button", { type: "button", className: "pe-btn-preset", onClick: () => L(""), children: "Clear" })
          ] })
        ] }),
        /* @__PURE__ */ t(
          "input",
          {
            type: "datetime-local",
            className: "pe-input",
            value: A,
            onChange: (e) => L(e.target.value)
          }
        )
      ] }),
      w && /* @__PURE__ */ n("div", { className: "pe-preview-card", children: [
        /* @__PURE__ */ t("div", { className: "pe-preview-title", children: "Schedule Timeline & Countdown" }),
        /* @__PURE__ */ n("div", { className: "pe-preview-row", children: [
          /* @__PURE__ */ n("div", { children: [
            /* @__PURE__ */ t("span", { style: { fontSize: "0.84rem", fontWeight: 600, color: "#ffffff" }, children: pe ? pe.name : "Selected Server" }),
            /* @__PURE__ */ n("span", { style: { fontSize: "0.72rem", color: "#94a3b8", marginLeft: 6 }, children: [
              "will suspend on ",
              P.formattedDate
            ] })
          ] }),
          /* @__PURE__ */ t("span", { className: `pe-time-chip pe-time-chip-${P.urgency}`, children: P.formattedTimeLeft })
        ] }),
        /* @__PURE__ */ t("div", { className: "pe-progress-track", title: P.formattedTimeLeft, children: /* @__PURE__ */ t(
          "div",
          {
            className: `pe-progress-fill pe-progress-fill-${P.urgency}`,
            style: { width: `${P.percent}%` }
          }
        ) }),
        A && /* @__PURE__ */ n("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginTop: 4, color: "#f87171" }, children: [
          /* @__PURE__ */ n("span", { children: [
            "Grace Period Termination: ",
            Fe.formattedDate
          ] }),
          /* @__PURE__ */ t("span", { children: Fe.formattedTimeLeft })
        ] })
      ] }),
      /* @__PURE__ */ t("div", { className: "pe-form-group", children: /* @__PURE__ */ n("label", { className: "pe-checkbox-label", children: [
        /* @__PURE__ */ t(
          "input",
          {
            type: "checkbox",
            checked: he,
            onChange: (e) => $(e.target.checked)
          }
        ),
        /* @__PURE__ */ t("span", { children: "Send automated email notification to server owner upon suspension" })
      ] }) }),
      /* @__PURE__ */ n("div", { className: "pe-form-group", children: [
        /* @__PURE__ */ t("label", { className: "pe-form-label", children: "Internal Notes / Reason" }),
        /* @__PURE__ */ t(
          "textarea",
          {
            className: "pe-input",
            rows: 2,
            placeholder: "e.g. Monthly trial expiration, invoice #10842 unpaid...",
            value: fe,
            onChange: (e) => B(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ n("div", { style: { display: "flex", justifyContent: "space-between", marginTop: 20 }, children: [
        o && pe?.suspension_date ? /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            className: "pe-btn pe-btn-danger",
            onClick: () => {
              j.mutate({ server_id: o, action: "cancel" }), d(!1);
            },
            children: "Cancel Schedule"
          }
        ) : /* @__PURE__ */ t("div", {}),
        /* @__PURE__ */ n("div", { style: { display: "flex", gap: 8 }, children: [
          /* @__PURE__ */ t(
            "button",
            {
              type: "button",
              className: "pe-btn pe-btn-secondary",
              onClick: () => d(!1),
              children: "Close"
            }
          ),
          /* @__PURE__ */ t(
            "button",
            {
              type: "button",
              className: "pe-btn pe-btn-primary",
              disabled: ie.isPending || !o,
              onClick: () => {
                if (!o) {
                  b.error("Please select a target server first");
                  return;
                }
                ie.mutate({
                  server_id: o,
                  suspension_date: w || null,
                  termination_date: A || null,
                  notify_user: he,
                  notes: fe
                });
              },
              children: ie.isPending ? /* @__PURE__ */ t("span", { className: "pe-spinner" }) : "Save Schedule"
            }
          )
        ] })
      ] })
    ] }) }),
    S && /* @__PURE__ */ t("div", { className: "pe-modal-overlay", onClick: () => g(!1), children: /* @__PURE__ */ n("div", { className: "pe-modal", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ n("div", { className: "pe-modal-header", children: [
        /* @__PURE__ */ n("h3", { className: "pe-title", style: { fontSize: "1.1rem" }, children: [
          "Bulk Schedule Servers (",
          D.length > 0 ? D.length : M.length,
          " servers)"
        ] }),
        /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            style: { background: "transparent", border: "none", color: "#94a3b8", fontSize: "1.4rem", cursor: "pointer" },
            onClick: () => g(!1),
            children: "×"
          }
        )
      ] }),
      /* @__PURE__ */ n("div", { className: "pe-form-group", children: [
        /* @__PURE__ */ t("label", { className: "pe-form-label", children: "Suspension Date & Time" }),
        /* @__PURE__ */ t(
          "input",
          {
            type: "datetime-local",
            className: "pe-input",
            value: K,
            onChange: (e) => Ae(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ n("div", { className: "pe-form-group", children: [
        /* @__PURE__ */ t("label", { className: "pe-form-label", children: "Grace Period Before Termination (Days after suspension)" }),
        /* @__PURE__ */ t(
          "input",
          {
            type: "number",
            min: 0,
            max: 365,
            className: "pe-input",
            value: ge,
            onChange: (e) => Oe(Number(e.target.value))
          }
        )
      ] }),
      /* @__PURE__ */ t("div", { className: "pe-form-group", children: /* @__PURE__ */ n("label", { className: "pe-checkbox-label", children: [
        /* @__PURE__ */ t(
          "input",
          {
            type: "checkbox",
            checked: be,
            onChange: (e) => Re(e.target.checked)
          }
        ),
        /* @__PURE__ */ t("span", { children: "Notify server owners via email upon suspension" })
      ] }) }),
      /* @__PURE__ */ n("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }, children: [
        /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            className: "pe-btn pe-btn-secondary",
            onClick: () => g(!1),
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            className: "pe-btn pe-btn-primary",
            disabled: !K || le.isPending,
            onClick: () => {
              const e = D.length > 0 ? D : M.map((a) => a.id);
              le.mutate({
                server_ids: e,
                suspension_date: K,
                termination_days_after: ge,
                notify_user: be
              });
            },
            children: le.isPending ? /* @__PURE__ */ t("span", { className: "pe-spinner" }) : "Apply Bulk Schedule"
          }
        )
      ] })
    ] }) }),
    ke && /* @__PURE__ */ t("div", { className: "pe-modal-overlay", onClick: () => R(!1), children: /* @__PURE__ */ n(
      "div",
      {
        className: "pe-modal",
        style: { maxWidth: 760, maxHeight: "90vh", overflowY: "auto" },
        onClick: (e) => e.stopPropagation(),
        children: [
          /* @__PURE__ */ n("div", { className: "pe-modal-header", style: { marginBottom: 16 }, children: [
            /* @__PURE__ */ n("div", { children: [
              /* @__PURE__ */ t("h3", { className: "pe-title", style: { fontSize: "1.15rem" }, children: "Email Notification Templates" }),
              /* @__PURE__ */ t("p", { style: { fontSize: "0.8rem", color: "#94a3b8", margin: "4px 0 0 0" }, children: "Configure customized emails delivered to clients when servers expire, suspend, or terminate." })
            ] }),
            /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                style: { background: "transparent", border: "none", color: "#94a3b8", fontSize: "1.4rem", cursor: "pointer" },
                onClick: () => R(!1),
                children: "×"
              }
            )
          ] }),
          /* @__PURE__ */ n("div", { className: "pe-tab-row", children: [
            /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                className: `pe-tab-btn ${x === "suspension" ? "pe-tab-active" : ""}`,
                onClick: () => J("suspension"),
                children: "Suspension Notice"
              }
            ),
            /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                className: `pe-tab-btn ${x === "warning" ? "pe-tab-active" : ""}`,
                onClick: () => J("warning"),
                children: "Expiration Warning (24h)"
              }
            ),
            /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                className: `pe-tab-btn ${x === "termination" ? "pe-tab-active" : ""}`,
                onClick: () => J("termination"),
                children: "Termination Notice"
              }
            )
          ] }),
          (() => {
            const e = x === "suspension", a = x === "warning", s = e ? Ce : a ? Te : Le, l = e ? xe : a ? De : Ee, h = e ? X : a ? Z : ne, Ze = e ? _e : a ? Me : je, ze = e ? U : a ? ee : ae, et = e ? V : a ? te : se, tt = e ? "Server Suspension Notice" : a ? "Expiration Warning Notice" : "Server Termination Notice", nt = e ? "Delivered immediately when a server reaches its scheduled expiration date and is suspended." : a ? "Delivered 24 hours prior to expiration to notify owners to renew their server in advance." : "Delivered when a server exceeds its grace period and is flagged for permanent termination.", at = e ? "SUSPENDED" : a ? "EXPIRING SOON" : "TERMINATED", st = e ? "#ef4444" : a ? "#f59e0b" : "#991b1b", it = h.replace(/{server_name}/gi, "Survival SMP Production").replace(/{username}/gi, "Steve").replace(/{server_id}/gi, "142"), lt = ze.replace(/{server_name}/gi, "Survival SMP Production").replace(/{username}/gi, "Steve").replace(/{server_id}/gi, "142").replace(/{server_uuid}/gi, "a8f39b1c").replace(/{suspension_date}/gi, "Tomorrow, 18:00").replace(/{termination_date}/gi, "In 7 days, 18:00").replace(/{panel_url}/gi, window.location.origin);
            return /* @__PURE__ */ n("div", { style: { display: "flex", flexDirection: "column", gap: 16 }, children: [
              /* @__PURE__ */ n("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(15, 23, 42, 0.6)", padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }, children: [
                /* @__PURE__ */ n("div", { children: [
                  /* @__PURE__ */ t("span", { style: { fontSize: "0.875rem", fontWeight: 600, color: "#f8fafc" }, children: tt }),
                  /* @__PURE__ */ t("p", { style: { fontSize: "0.75rem", color: "#94a3b8", margin: "2px 0 0 0" }, children: nt })
                ] }),
                /* @__PURE__ */ n("label", { className: "pe-checkbox-label", style: { margin: 0 }, children: [
                  /* @__PURE__ */ t(
                    "input",
                    {
                      type: "checkbox",
                      checked: s,
                      onChange: (N) => l(N.target.checked)
                    }
                  ),
                  /* @__PURE__ */ t("span", { style: { fontSize: "0.8125rem" }, children: "Active" })
                ] })
              ] }),
              /* @__PURE__ */ n("div", { className: "pe-form-group", children: [
                /* @__PURE__ */ t("label", { className: "pe-form-label", children: "Email Subject" }),
                /* @__PURE__ */ t(
                  "input",
                  {
                    type: "text",
                    className: "pe-input",
                    value: h,
                    onChange: (N) => Ze(N.target.value),
                    placeholder: "e.g. [Notice] Server Suspended: {server_name}"
                  }
                )
              ] }),
              /* @__PURE__ */ n("div", { className: "pe-form-group", children: [
                /* @__PURE__ */ n("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }, children: [
                  /* @__PURE__ */ t("label", { className: "pe-form-label", style: { marginBottom: 0 }, children: "Email Body Template" }),
                  /* @__PURE__ */ t("span", { style: { fontSize: "0.72rem", color: "#94a3b8" }, children: "Click placeholder chip to insert" })
                ] }),
                /* @__PURE__ */ t("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }, children: ["{username}", "{server_name}", "{server_id}", "{server_uuid}", "{suspension_date}", "{termination_date}", "{panel_url}"].map((N) => /* @__PURE__ */ t(
                  "button",
                  {
                    type: "button",
                    className: "pe-tag-chip",
                    onClick: () => Ye(N),
                    title: `Click to append ${N}`,
                    children: N
                  },
                  N
                )) }),
                /* @__PURE__ */ t(
                  "textarea",
                  {
                    className: "pe-input",
                    style: { minHeight: 130, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", fontSize: "0.8125rem", lineHeight: "1.5" },
                    value: ze,
                    onChange: (N) => et(N.target.value),
                    placeholder: "Compose email template message..."
                  }
                )
              ] }),
              /* @__PURE__ */ n("div", { children: [
                /* @__PURE__ */ t("label", { className: "pe-form-label", style: { marginBottom: 4 }, children: "Live Email Preview (Sample Client View)" }),
                /* @__PURE__ */ n("div", { className: "pe-email-preview", children: [
                  /* @__PURE__ */ n("div", { className: "pe-email-preview-header", children: [
                    /* @__PURE__ */ t("span", { style: { fontSize: "0.9rem", fontWeight: 700, color: "#f8fafc" }, children: "Pterodactyl Panel" }),
                    /* @__PURE__ */ t(
                      "span",
                      {
                        style: {
                          padding: "3px 8px",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          background: st,
                          color: "#ffffff",
                          borderRadius: 4,
                          letterSpacing: "0.04em"
                        },
                        children: at
                      }
                    )
                  ] }),
                  /* @__PURE__ */ t("h4", { className: "pe-email-preview-title", children: it || "(No subject)" }),
                  /* @__PURE__ */ t("div", { className: "pe-email-preview-body", children: lt || "(No message body provided)" }),
                  /* @__PURE__ */ t("table", { className: "pe-email-preview-meta", children: /* @__PURE__ */ n("tbody", { children: [
                    /* @__PURE__ */ n("tr", { children: [
                      /* @__PURE__ */ t("td", { style: { color: "#94a3b8" }, children: "Target Server:" }),
                      /* @__PURE__ */ t("td", { style: { textAlign: "right", color: "#f1f5f9", fontWeight: 600 }, children: "Survival SMP Production (#142)" })
                    ] }),
                    /* @__PURE__ */ n("tr", { children: [
                      /* @__PURE__ */ t("td", { style: { color: "#94a3b8" }, children: "Effective Date:" }),
                      /* @__PURE__ */ t("td", { style: { textAlign: "right", color: "#f1f5f9", fontWeight: 600 }, children: "Tomorrow, 18:00" })
                    ] })
                  ] }) }),
                  /* @__PURE__ */ t("div", { style: { textAlign: "center", marginTop: 14 }, children: /* @__PURE__ */ t("span", { className: "pe-email-preview-btn", children: "Open Control Panel →" }) })
                ] })
              ] }),
              /* @__PURE__ */ n("div", { style: { background: "rgba(15, 23, 42, 0.5)", padding: "12px 14px", borderRadius: 8, border: "1px solid #334155" }, children: [
                /* @__PURE__ */ n("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }, children: [
                  /* @__PURE__ */ t("span", { style: { fontSize: "0.8rem", fontWeight: 600, color: "#e2e8f0" }, children: "Send Test Email" }),
                  /* @__PURE__ */ t("span", { style: { fontSize: "0.72rem", color: "#94a3b8" }, children: "Verifies mail transport configuration & design" })
                ] }),
                /* @__PURE__ */ n("div", { style: { display: "flex", gap: 8 }, children: [
                  /* @__PURE__ */ t(
                    "input",
                    {
                      type: "email",
                      className: "pe-input",
                      placeholder: "admin@example.com",
                      value: W,
                      onChange: (N) => Pe(N.target.value),
                      style: { flex: 1, fontSize: "0.8125rem" }
                    }
                  ),
                  /* @__PURE__ */ t(
                    "button",
                    {
                      type: "button",
                      className: "pe-btn pe-btn-secondary",
                      disabled: $e || !W.trim(),
                      onClick: Ke,
                      style: { whiteSpace: "nowrap" },
                      children: $e ? /* @__PURE__ */ t("span", { className: "pe-spinner" }) : "Send Test"
                    }
                  )
                ] })
              ] })
            ] });
          })(),
          /* @__PURE__ */ n("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14 }, children: [
            /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                className: "pe-btn pe-btn-secondary",
                onClick: () => R(!1),
                children: "Close"
              }
            ),
            /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                className: "pe-btn pe-btn-primary",
                disabled: ce.isPending,
                onClick: () => ce.mutate(),
                children: ce.isPending ? /* @__PURE__ */ t("span", { className: "pe-spinner" }) : "Save All Templates"
              }
            )
          ] })
        ]
      }
    ) })
  ] });
}
function Ie(c) {
  const m = new Date(c), E = m.getTime(), u = Date.now(), p = E - u, f = m.toLocaleDateString(void 0, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  }) + " • " + m.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (p <= 0)
    return {
      formattedDate: f,
      formattedTimeLeft: "Past due (Pending)",
      daysLeft: 0,
      hoursLeft: 0,
      minutesLeft: 0,
      isPastDue: !0,
      percent: 0,
      urgency: "critical"
    };
  const r = Math.floor(p / (1e3 * 60)), T = Math.floor(r / 60), d = Math.floor(T / 24), o = T % 24, v = r % 60;
  let S = "";
  d > 0 ? S = `${d}d ${o}h left` : o > 0 ? S = `${o}h ${v}m left` : S = `${Math.max(1, v)}m left`;
  let g = "good";
  d < 1 ? g = "critical" : d < 7 ? g = "warning" : g = "good";
  const w = 30 * 24 * 60 * 60 * 1e3, k = Math.min(100, Math.max(4, Math.round(p / w * 100)));
  return {
    formattedDate: f,
    formattedTimeLeft: S,
    daysLeft: d,
    hoursLeft: o,
    minutesLeft: v,
    isPastDue: !1,
    percent: k,
    urgency: g
  };
}
function pt() {
  let c = "";
  try {
    const r = ot();
    c = r?.attributes?.identifier || r?.identifier || "";
  } catch {
    const r = window.location.pathname.match(/\/server\/([a-zA-Z0-9_\-]+)/);
    r && (c = r[1]);
  }
  const [, m] = i(0);
  me(() => {
    const r = setInterval(() => m((T) => T + 1), 3e4);
    return () => clearInterval(r);
  }, []);
  const u = ue({
    queryKey: ["server-suspension-status", c],
    queryFn: async () => {
      if (!c) return { scheduled: !1 };
      try {
        const r = await fetch(`/api/client/servers/${c}/extensions/server-suspension/status`);
        if (r.ok) return r.json();
      } catch {
      }
      try {
        const r = await fetch(`/api/client/extensions/server-suspension/server/${c}/status`);
        if (r.ok) return r.json();
      } catch {
      }
      return { scheduled: !1 };
    },
    enabled: !!c,
    refetchInterval: 6e4
  }).data;
  if (!u || !u.scheduled || !u.suspension_date)
    return null;
  const p = Ie(u.suspension_date), f = u.termination_date ? Ie(u.termination_date) : null;
  return /* @__PURE__ */ n("div", { className: `pe-slim-banner pe-slim-banner-${p.urgency}`, children: [
    /* @__PURE__ */ n("div", { className: "pe-slim-banner-body", children: [
      /* @__PURE__ */ n("div", { className: "pe-slim-banner-left", children: [
        /* @__PURE__ */ n(
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
              /* @__PURE__ */ t("circle", { cx: "12", cy: "12", r: "10" }),
              /* @__PURE__ */ t("polyline", { points: "12 6 12 12 16 14" })
            ]
          }
        ),
        /* @__PURE__ */ t("span", { className: "pe-slim-title", children: "Server Suspension:" }),
        /* @__PURE__ */ t("span", { className: "pe-slim-date", children: p.formattedDate }),
        /* @__PURE__ */ t("span", { className: `pe-slim-chip pe-slim-chip-${p.urgency}`, children: p.formattedTimeLeft })
      ] }),
      /* @__PURE__ */ n("div", { className: "pe-slim-banner-right", children: [
        f && /* @__PURE__ */ n("span", { className: "pe-slim-term-notice", title: `Permanent termination date: ${f.formattedDate}`, children: [
          "Termination: ",
          f.formattedDate.split("•")[0],
          " (",
          f.formattedTimeLeft,
          ")"
        ] }),
        u.notes && /* @__PURE__ */ t("span", { className: "pe-slim-note", title: u.notes, children: u.notes })
      ] })
    ] }),
    /* @__PURE__ */ t("div", { className: "pe-slim-track", title: `Suspension in ${p.formattedTimeLeft} (${p.formattedDate})`, children: /* @__PURE__ */ t(
      "div",
      {
        className: `pe-slim-fill pe-slim-fill-${p.urgency}`,
        style: { width: `${p.percent}%` }
      }
    ) })
  ] });
}
const gt = ct({
  setup({ screens: c, slots: m }) {
    c.register("admin-suspension", () => Promise.resolve({ default: dt })), m.register("server.console.before", pt);
  }
});
export {
  gt as default
};
