import { jsxs as a, jsx as t } from "react/jsx-runtime";
import { useState as s, useRef as R, useEffect as Fe } from "react";
import { useQueryClient as lt, useQuery as ze, useMutation as $ } from "@tanstack/react-query";
import { toast as c } from "@pterodactyl/sdk";
function Q(N) {
  if (!N)
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
  const g = new Date(N), q = g.getTime(), M = Date.now(), L = q - M, C = g.toLocaleDateString(void 0, {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }) + " " + g.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (L <= 0)
    return {
      hasDate: !0,
      formattedDate: C,
      formattedTimeLeft: "Past due (Pending)",
      daysLeft: 0,
      hoursLeft: 0,
      minutesLeft: 0,
      isPastDue: !0,
      percent: 0,
      urgency: "critical"
    };
  const F = Math.floor(L / (1e3 * 60)), z = Math.floor(F / 60), d = Math.floor(z / 24), o = z % 24, S = F % 60;
  let _ = "";
  d > 0 ? _ = `${d}d ${o}h left` : o > 0 ? _ = `${o}h ${S}m left` : _ = `${Math.max(1, S)}m left`;
  let u = "good";
  d < 1 ? u = "critical" : d < 7 ? u = "warning" : u = "good";
  const w = 30 * 24 * 60 * 60 * 1e3, k = Math.min(100, Math.max(6, Math.round(L / w * 100)));
  return {
    hasDate: !0,
    formattedDate: C,
    formattedTimeLeft: _,
    daysLeft: d,
    hoursLeft: o,
    minutesLeft: S,
    isPastDue: !1,
    percent: k,
    urgency: u
  };
}
function pt() {
  const N = lt(), [g, q] = s(""), [M, L] = s("all"), [C, F] = s("all"), [z, d] = s(!1), [o, S] = s(null), [_, u] = s(!1), [w, k] = s(""), [O, x] = s(""), [me, E] = s(!0), [ue, j] = s(""), [G, H] = s(""), [Y, Oe] = s(""), [he, Ae] = s(7), [fe, Ie] = s(!0), [y, A] = s([]), h = R(null), K = R(!1), be = R(0), ge = R(0), [Re, ye] = s(!1), ve = (e) => {
    if (!h.current) return;
    const n = e === "left" ? -350 : 350;
    h.current.scrollBy({ left: n, behavior: "smooth" });
  }, Qe = (e) => {
    const n = h.current;
    if (n && !(Math.abs(e.deltaX) > 0) && Math.abs(e.deltaY) > 0) {
      const i = n.scrollWidth - n.clientWidth;
      if (i <= 0) return;
      const l = n.scrollLeft > 0, r = n.scrollLeft < i - 1;
      (e.deltaY > 0 && r || e.deltaY < 0 && l) && (n.scrollLeft += e.deltaY, e.preventDefault());
    }
  }, qe = (e) => {
    e.button !== 0 || e.target.closest("button, input, select, a, .pe-btn, .pe-quick-edit-btn, .pe-time-clickable") || h.current && (K.current = !0, be.current = e.pageX - h.current.offsetLeft, ge.current = h.current.scrollLeft, ye(!0));
  }, Ge = (e) => {
    if (!K.current || !h.current) return;
    e.preventDefault();
    const i = (e.pageX - h.current.offsetLeft - be.current) * 1.4;
    h.current.scrollLeft = ge.current - i;
  }, Ne = () => {
    K.current = !1, ye(!1);
  }, [Se, I] = s(!1), [f, J] = s("suspension"), [we, ke] = s(!0), [X, Ce] = s("[Notice] Server Suspended: {server_name}"), [U, V] = s(""), [xe, _e] = s(!0), [Z, Te] = s("[Warning] Your server {server_name} expires soon"), [ee, te] = s(""), [De, Me] = s(!0), [ne, Le] = s("[Final Notice] Server Terminated: {server_name}"), [ae, ie] = s(""), [P, Ee] = s(""), [je, Pe] = s(!1), b = ze({
    queryKey: ["admin-suspension-overview"],
    queryFn: async () => {
      const e = await fetch("/api/admin/extensions/server-suspension/overview");
      if (!e.ok) {
        const n = await e.json().catch(() => ({}));
        throw new Error(n.error || "Failed to load server suspension overview");
      }
      return e.json();
    },
    staleTime: 5e3,
    refetchOnWindowFocus: !0
  }), p = b.data?.servers || [];
  Fe(() => {
    !o && p.length > 0 && S(p[0].id);
  }, [p, o]);
  const se = $({
    mutationFn: async (e) => {
      const n = await fetch("/api/admin/extensions/server-suspension/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(e)
      }), i = await n.json();
      if (!n.ok) throw new Error(i.error || "Failed to update schedule");
      return i;
    },
    onSuccess: (e) => {
      c.success(e.message || "Schedule updated"), d(!1), N.invalidateQueries({ queryKey: ["admin-suspension-overview"] });
    },
    onError: (e) => c.error(e.message)
  }), le = $({
    mutationFn: async (e) => {
      const n = await fetch("/api/admin/extensions/server-suspension/bulk-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(e)
      }), i = await n.json();
      if (!n.ok) throw new Error(i.error || "Failed to apply bulk schedule");
      return i;
    },
    onSuccess: (e) => {
      c.success(e.message || "Bulk schedule saved"), u(!1), A([]), N.invalidateQueries({ queryKey: ["admin-suspension-overview"] });
    },
    onError: (e) => c.error(e.message)
  }), T = $({
    mutationFn: async ({ server_id: e, action: n }) => {
      const i = await fetch("/api/admin/extensions/server-suspension/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ server_id: e, action: n })
      }), l = await i.json();
      if (!i.ok) throw new Error(l.error || "Failed to perform action");
      return l;
    },
    onSuccess: (e) => {
      c.success(e.message || "Action executed successfully"), N.invalidateQueries({ queryKey: ["admin-suspension-overview"] });
    },
    onError: (e) => c.error(e.message)
  }), re = $({
    mutationFn: async () => {
      const e = await fetch("/api/admin/extensions/server-suspension/process-due", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      }), n = await e.json();
      if (!e.ok) throw new Error(n.error || "Failed to process due items");
      return n;
    },
    onSuccess: (e) => {
      c.success(e.message || "Due schedules processed"), N.invalidateQueries({ queryKey: ["admin-suspension-overview"] });
    },
    onError: (e) => c.error(e.message)
  }), oe = ze({
    queryKey: ["admin-suspension-mail-templates"],
    queryFn: async () => {
      const e = await fetch("/api/admin/extensions/server-suspension/mail-templates");
      if (!e.ok) throw new Error("Failed to load email notification templates");
      return e.json();
    },
    enabled: Se
  });
  Fe(() => {
    if (oe.data) {
      const e = oe.data;
      ke(!!e.mail_notifications_enabled), e.mail_subject && Ce(e.mail_subject), e.mail_body && V(e.mail_body), _e(!!e.warning_mail_enabled), e.warning_mail_subject && Te(e.warning_mail_subject), e.warning_mail_body && te(e.warning_mail_body), Me(!!e.termination_mail_enabled), e.termination_mail_subject && Le(e.termination_mail_subject), e.termination_mail_body && ie(e.termination_mail_body), !P && e.admin_email && Ee(e.admin_email);
    }
  }, [oe.data]);
  const ce = $({
    mutationFn: async () => {
      const n = await fetch("/api/admin/extensions/server-suspension/mail-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mail_notifications_enabled: we,
          mail_subject: X,
          mail_body: U,
          warning_mail_enabled: xe,
          warning_mail_subject: Z,
          warning_mail_body: ee,
          termination_mail_enabled: De,
          termination_mail_subject: ne,
          termination_mail_body: ae
        })
      }), i = await n.json();
      if (!n.ok) throw new Error(i.error || "Failed to save email templates");
      return i;
    },
    onSuccess: (e) => {
      c.success(e.message || "Email templates saved successfully"), N.invalidateQueries({ queryKey: ["admin-suspension-mail-templates"] });
    },
    onError: (e) => c.error(e.message)
  }), He = async () => {
    if (!P.trim()) {
      c.error("Please enter a destination email address for the test.");
      return;
    }
    Pe(!0);
    try {
      let e = X, n = U;
      f === "warning" ? (e = Z, n = ee) : f === "termination" && (e = ne, n = ae);
      const i = await fetch("/api/admin/extensions/server-suspension/test-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template_type: f,
          subject: e,
          body: n,
          email: P.trim()
        })
      }), l = await i.json();
      if (!i.ok) throw new Error(l.error || "Failed to deliver test email");
      c.success(l.message || "Test email dispatched successfully!");
    } catch (e) {
      c.error(e.message);
    } finally {
      Pe(!1);
    }
  }, Ye = (e) => {
    f === "suspension" ? V((n) => n + (n.endsWith(" ") || n === "" ? "" : " ") + e) : f === "warning" ? te((n) => n + (n.endsWith(" ") || n === "" ? "" : " ") + e) : ie((n) => n + (n.endsWith(" ") || n === "" ? "" : " ") + e), c.info(`Inserted placeholder ${e}`);
  }, B = (e) => {
    S(e.id), k(e.suspension_date ? e.suspension_date.slice(0, 16) : ""), x(e.termination_date ? e.termination_date.slice(0, 16) : ""), E(e.notify_user), j(e.notes || ""), H(""), d(!0);
  }, Ke = () => {
    H("");
    const e = o && p.find((n) => n.id === o) || p[0];
    e ? (S(e.id), k(e.suspension_date ? e.suspension_date.slice(0, 16) : ""), x(e.termination_date ? e.termination_date.slice(0, 16) : ""), E(e.notify_user), j(e.notes || "")) : (k(""), x(""), E(!0), j("")), d(!0);
  }, Je = (e) => {
    S(e);
    const n = p.find((i) => i.id === e);
    n && (k(n.suspension_date ? n.suspension_date.slice(0, 16) : ""), x(n.termination_date ? n.termination_date.slice(0, 16) : ""), E(n.notify_user), j(n.notes || ""));
  }, W = (e) => {
    const n = /* @__PURE__ */ new Date();
    n.setDate(n.getDate() + e);
    const i = (r) => String(r).padStart(2, "0"), l = `${n.getFullYear()}-${i(n.getMonth() + 1)}-${i(n.getDate())}T${i(n.getHours())}:${i(n.getMinutes())}`;
    k(l);
  }, de = (e) => {
    const n = w ? new Date(w) : /* @__PURE__ */ new Date();
    n.setDate(n.getDate() + e);
    const i = (r) => String(r).padStart(2, "0"), l = `${n.getFullYear()}-${i(n.getMonth() + 1)}-${i(n.getDate())}T${i(n.getHours())}:${i(n.getMinutes())}`;
    x(l);
  }, v = p.filter((e) => {
    const n = e.name.toLowerCase().includes(g.toLowerCase()) || e.identifier.toLowerCase().includes(g.toLowerCase()) || e.owner.toLowerCase().includes(g.toLowerCase()) || e.owner_email.toLowerCase().includes(g.toLowerCase()), i = M === "all" || e.node_id === Number(M);
    let l = !0;
    return C === "active" && (l = e.server_status !== "suspended" && !e.suspension_date), C === "scheduled" && (l = !!e.suspension_date && e.server_status !== "suspended"), C === "suspended" && (l = e.server_status === "suspended"), n && i && l;
  }), Xe = (e) => {
    A(
      (n) => n.includes(e) ? n.filter((i) => i !== e) : [...n, e]
    );
  }, Ue = () => {
    y.length === v.length ? A([]) : A(v.map((e) => e.id));
  }, Be = p.filter((e) => {
    if (!G.trim()) return !0;
    const n = G.toLowerCase();
    return e.name.toLowerCase().includes(n) || e.identifier.toLowerCase().includes(n) || e.owner.toLowerCase().includes(n) || e.owner_email.toLowerCase().includes(n);
  }), pe = p.find((e) => e.id === o), D = Q(w || null), We = Q(O || null);
  return /* @__PURE__ */ a("div", { className: "pe-container", children: [
    /* @__PURE__ */ a("div", { className: "pe-header", children: [
      /* @__PURE__ */ a("div", { className: "pe-title-wrap", children: [
        /* @__PURE__ */ t("h2", { className: "pe-title", children: "Auto Server Suspension & Termination" }),
        /* @__PURE__ */ t("p", { className: "pe-subtitle", children: "Manage automated expiration schedules, owner suspension notifications, and grace-period server termination." })
      ] }),
      /* @__PURE__ */ a("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" }, children: [
        /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            className: "pe-btn pe-btn-primary",
            onClick: Ke,
            children: "+ Set Suspension Date"
          }
        ),
        /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "pe-btn pe-btn-secondary",
            onClick: () => u(!0),
            children: [
              "Bulk Schedule ",
              y.length > 0 ? `(${y.length})` : ""
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
        /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "pe-btn pe-btn-secondary",
            onClick: () => I(!0),
            style: { display: "inline-flex", alignItems: "center", gap: 6 },
            children: [
              /* @__PURE__ */ a("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                /* @__PURE__ */ t("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }),
                /* @__PURE__ */ t("polyline", { points: "22,6 12,13 2,6" })
              ] }),
              "Email Templates"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ a("div", { className: "pe-stats-row", children: [
      /* @__PURE__ */ a("div", { className: "pe-stat-card", children: [
        /* @__PURE__ */ t("span", { className: "pe-stat-val", children: b.data?.stats.total ?? 0 }),
        /* @__PURE__ */ t("span", { className: "pe-stat-label", children: "Total Servers" })
      ] }),
      /* @__PURE__ */ a("div", { className: "pe-stat-card", children: [
        /* @__PURE__ */ t("span", { className: "pe-stat-val", style: { color: "#facc15" }, children: b.data?.stats.scheduled ?? 0 }),
        /* @__PURE__ */ t("span", { className: "pe-stat-label", children: "Scheduled for Suspension" })
      ] }),
      /* @__PURE__ */ a("div", { className: "pe-stat-card", children: [
        /* @__PURE__ */ t("span", { className: "pe-stat-val", style: { color: "#f87171" }, children: b.data?.stats.suspended ?? 0 }),
        /* @__PURE__ */ t("span", { className: "pe-stat-label", children: "Currently Suspended" })
      ] }),
      /* @__PURE__ */ a("div", { className: "pe-stat-card", children: [
        /* @__PURE__ */ t("span", { className: "pe-stat-val", style: { color: "#94a3b8" }, children: b.data?.stats.terminated ?? 0 }),
        /* @__PURE__ */ t("span", { className: "pe-stat-label", children: "Terminated" })
      ] })
    ] }),
    /* @__PURE__ */ a("div", { className: "pe-toolbar", children: [
      /* @__PURE__ */ a("div", { className: "pe-input-box", children: [
        /* @__PURE__ */ a("svg", { className: "pe-input-icon", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
          /* @__PURE__ */ t("circle", { cx: "11", cy: "11", r: "8" }),
          /* @__PURE__ */ t("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
        ] }),
        /* @__PURE__ */ t(
          "input",
          {
            className: "pe-input",
            type: "text",
            placeholder: "Search servers by name, identifier, or owner email...",
            value: g,
            onChange: (e) => q(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ a(
        "select",
        {
          className: "pe-select",
          value: M,
          onChange: (e) => L(e.target.value),
          children: [
            /* @__PURE__ */ t("option", { value: "all", children: "All Nodes" }),
            b.data?.nodes?.map((e) => /* @__PURE__ */ t("option", { value: e.id, children: e.name }, e.id))
          ]
        }
      ),
      /* @__PURE__ */ a(
        "select",
        {
          className: "pe-select",
          value: C,
          onChange: (e) => F(e.target.value),
          children: [
            /* @__PURE__ */ t("option", { value: "all", children: "All Statuses" }),
            /* @__PURE__ */ t("option", { value: "active", children: "Active" }),
            /* @__PURE__ */ t("option", { value: "scheduled", children: "Scheduled" }),
            /* @__PURE__ */ t("option", { value: "suspended", children: "Suspended" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ a("div", { className: "pe-table-meta-bar", children: [
      /* @__PURE__ */ a("div", { className: "pe-table-meta-count", children: [
        "Showing ",
        /* @__PURE__ */ t("strong", { children: v.length }),
        " of ",
        /* @__PURE__ */ t("strong", { children: p.length }),
        " panel servers"
      ] }),
      /* @__PURE__ */ a("div", { className: "pe-table-scroll-controls", children: [
        /* @__PURE__ */ a("span", { className: "pe-scroll-hint", children: [
          /* @__PURE__ */ a("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
            /* @__PURE__ */ t("line", { x1: "5", y1: "12", x2: "19", y2: "12" }),
            /* @__PURE__ */ t("polyline", { points: "12 5 19 12 12 19" }),
            /* @__PURE__ */ t("polyline", { points: "12 19 5 12 12 5" })
          ] }),
          "Scroll table:"
        ] }),
        /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "pe-scroll-btn",
            title: "Scroll table left",
            onClick: () => ve("left"),
            children: [
              /* @__PURE__ */ t("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ t("polyline", { points: "15 18 9 12 15 6" }) }),
              "Left"
            ]
          }
        ),
        /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "pe-scroll-btn",
            title: "Scroll table right",
            onClick: () => ve("right"),
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
        ref: h,
        className: `pe-table-card ${Re ? "pe-table-dragging" : ""}`,
        onWheel: Qe,
        onMouseDown: qe,
        onMouseMove: Ge,
        onMouseUp: Ne,
        onMouseLeave: Ne,
        children: /* @__PURE__ */ a("table", { className: "pe-table", children: [
          /* @__PURE__ */ t("thead", { children: /* @__PURE__ */ a("tr", { children: [
            /* @__PURE__ */ t("th", { style: { width: 44, textAlign: "center" }, children: /* @__PURE__ */ t(
              "input",
              {
                type: "checkbox",
                checked: v.length > 0 && y.length === v.length,
                onChange: Ue
              }
            ) }),
            /* @__PURE__ */ t("th", { style: { minWidth: 170 }, children: "Server" }),
            /* @__PURE__ */ t("th", { style: { minWidth: 170 }, children: "Node / Owner" }),
            /* @__PURE__ */ t("th", { style: { minWidth: 110 }, children: "Status" }),
            /* @__PURE__ */ t("th", { style: { minWidth: 220 }, children: "Suspension Date & Time Left" }),
            /* @__PURE__ */ t("th", { style: { minWidth: 200 }, children: "Termination Grace" }),
            /* @__PURE__ */ t("th", { className: "pe-col-sticky-right", style: { minWidth: 250, textAlign: "right" }, children: "Actions" })
          ] }) }),
          /* @__PURE__ */ t("tbody", { children: b.isLoading ? /* @__PURE__ */ t("tr", { children: /* @__PURE__ */ a("td", { colSpan: 7, style: { textAlign: "center", padding: "36px 0" }, children: [
            /* @__PURE__ */ t("span", { className: "pe-spinner" }),
            /* @__PURE__ */ t("p", { className: "pe-subtitle", style: { marginTop: 8 }, children: "Loading panel servers..." })
          ] }) }) : v.length === 0 ? /* @__PURE__ */ t("tr", { children: /* @__PURE__ */ t("td", { colSpan: 7, style: { textAlign: "center", padding: "36px 0" }, children: /* @__PURE__ */ t("p", { className: "pe-subtitle", children: "No matching servers found on panel." }) }) }) : v.map((e) => {
            const n = e.server_status === "suspended", i = !!e.suspension_date, l = Q(e.suspension_date), r = Q(e.termination_date);
            return /* @__PURE__ */ a("tr", { children: [
              /* @__PURE__ */ t("td", { style: { textAlign: "center" }, children: /* @__PURE__ */ t(
                "input",
                {
                  type: "checkbox",
                  checked: y.includes(e.id),
                  onChange: () => Xe(e.id)
                }
              ) }),
              /* @__PURE__ */ t("td", { children: /* @__PURE__ */ a("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }, children: [
                /* @__PURE__ */ a("div", { children: [
                  /* @__PURE__ */ t("div", { style: { fontWeight: 600 }, children: e.name }),
                  /* @__PURE__ */ t("div", { style: { fontSize: "0.72rem", color: "var(--muted-foreground, #94a3b8)", fontFamily: "monospace" }, children: e.identifier })
                ] }),
                /* @__PURE__ */ a(
                  "button",
                  {
                    type: "button",
                    className: "pe-quick-edit-btn",
                    title: i ? "Edit Expiration Schedule" : "Set Suspension Date",
                    onClick: () => B(e),
                    children: [
                      /* @__PURE__ */ a("svg", { width: "11", height: "11", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
                        /* @__PURE__ */ t("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }),
                        /* @__PURE__ */ t("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })
                      ] }),
                      /* @__PURE__ */ t("span", { children: i ? "Edit" : "Set Date" })
                    ]
                  }
                )
              ] }) }),
              /* @__PURE__ */ a("td", { children: [
                /* @__PURE__ */ t("div", { style: { fontSize: "0.8125rem" }, children: e.node }),
                /* @__PURE__ */ a("div", { style: { fontSize: "0.72rem", color: "var(--muted-foreground, #94a3b8)" }, children: [
                  e.owner,
                  " (",
                  e.owner_email,
                  ")"
                ] })
              ] }),
              /* @__PURE__ */ t("td", { children: n ? /* @__PURE__ */ a("span", { className: "pe-badge pe-badge-suspended", children: [
                /* @__PURE__ */ t("span", { className: "pe-badge-dot" }),
                "Suspended"
              ] }) : i ? /* @__PURE__ */ a("span", { className: "pe-badge pe-badge-scheduled", children: [
                /* @__PURE__ */ t("span", { className: "pe-badge-dot" }),
                "Scheduled"
              ] }) : /* @__PURE__ */ a("span", { className: "pe-badge pe-badge-active", children: [
                /* @__PURE__ */ t("span", { className: "pe-badge-dot" }),
                "Active"
              ] }) }),
              /* @__PURE__ */ t("td", { children: l.hasDate ? /* @__PURE__ */ a(
                "div",
                {
                  className: "pe-time-cell pe-time-clickable",
                  title: "Click to edit suspension schedule",
                  onClick: () => B(e),
                  children: [
                    /* @__PURE__ */ a("div", { className: "pe-time-header", children: [
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
                  onClick: () => B(e),
                  style: { display: "inline-flex" },
                  children: /* @__PURE__ */ t("span", { className: "pe-time-chip pe-time-chip-muted pe-time-chip-hoverable", children: "+ Set Expiration Date" })
                }
              ) }),
              /* @__PURE__ */ t("td", { children: r.hasDate ? /* @__PURE__ */ a(
                "div",
                {
                  className: "pe-time-cell pe-time-clickable",
                  title: "Click to edit termination grace period",
                  onClick: () => B(e),
                  children: [
                    /* @__PURE__ */ a("div", { className: "pe-time-header", children: [
                      /* @__PURE__ */ t("span", { className: "pe-time-date", style: { color: "#f87171" }, children: r.formattedDate }),
                      /* @__PURE__ */ t("span", { className: `pe-time-chip pe-time-chip-${r.urgency}`, children: r.formattedTimeLeft })
                    ] }),
                    /* @__PURE__ */ t(
                      "div",
                      {
                        className: "pe-progress-track",
                        title: `Termination: ${r.formattedDate} (${r.formattedTimeLeft})`,
                        children: /* @__PURE__ */ t(
                          "div",
                          {
                            className: `pe-progress-fill pe-progress-fill-${r.urgency}`,
                            style: { width: `${r.percent}%` }
                          }
                        )
                      }
                    )
                  ]
                }
              ) : /* @__PURE__ */ t("span", { style: { fontSize: "0.75rem", color: "var(--muted-foreground, #64748b)" }, children: "None" }) }),
              /* @__PURE__ */ t("td", { className: "pe-col-sticky-right", children: /* @__PURE__ */ a("div", { className: "pe-actions-wrap", children: [
                /* @__PURE__ */ t(
                  "button",
                  {
                    type: "button",
                    className: "pe-btn pe-btn-primary pe-btn-sm",
                    onClick: () => B(e),
                    children: i ? "Edit Expiration" : "Set Suspension Date"
                  }
                ),
                i && /* @__PURE__ */ t(
                  "button",
                  {
                    type: "button",
                    className: "pe-btn pe-btn-secondary pe-btn-sm",
                    title: "Remove scheduled suspension & termination",
                    onClick: () => T.mutate({ server_id: e.id, action: "cancel" }),
                    children: "Remove Schedule"
                  }
                ),
                n ? /* @__PURE__ */ t(
                  "button",
                  {
                    type: "button",
                    className: "pe-btn pe-btn-secondary pe-btn-sm",
                    disabled: T.isPending,
                    onClick: () => T.mutate({ server_id: e.id, action: "unsuspend" }),
                    children: "Unsuspend"
                  }
                ) : /* @__PURE__ */ t(
                  "button",
                  {
                    type: "button",
                    className: "pe-btn pe-btn-danger pe-btn-sm",
                    disabled: T.isPending,
                    onClick: () => T.mutate({ server_id: e.id, action: "suspend" }),
                    children: "Suspend Now"
                  }
                )
              ] }) })
            ] }, e.id);
          }) })
        ] })
      }
    ),
    z && /* @__PURE__ */ t("div", { className: "pe-modal-overlay", onClick: () => d(!1), children: /* @__PURE__ */ a("div", { className: "pe-modal", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ a("div", { className: "pe-modal-header", children: [
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
      /* @__PURE__ */ a("div", { className: "pe-form-group", children: [
        /* @__PURE__ */ a("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
          /* @__PURE__ */ t("label", { className: "pe-form-label", children: "Select Target Server" }),
          /* @__PURE__ */ a("span", { style: { fontSize: "0.72rem", color: "#94a3b8" }, children: [
            p.length,
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
        /* @__PURE__ */ a(
          "select",
          {
            className: "pe-select",
            style: { width: "100%" },
            value: o ?? "",
            onChange: (e) => Je(Number(e.target.value)),
            children: [
              b.isLoading && /* @__PURE__ */ t("option", { value: "", children: "Loading servers..." }),
              !b.isLoading && p.length === 0 && /* @__PURE__ */ t("option", { value: "", children: "No servers available on panel" }),
              !b.isLoading && p.length > 0 && Be.length === 0 && /* @__PURE__ */ t("option", { value: "", children: "No servers matching filter" }),
              Be.map((e) => /* @__PURE__ */ a("option", { value: e.id, children: [
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
      /* @__PURE__ */ a("div", { className: "pe-form-group", children: [
        /* @__PURE__ */ a("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }, children: [
          /* @__PURE__ */ t("label", { className: "pe-form-label", style: { marginBottom: 0 }, children: "Suspension Date & Time" }),
          /* @__PURE__ */ a("div", { style: { display: "flex", gap: 4 }, children: [
            /* @__PURE__ */ t("button", { type: "button", className: "pe-btn-preset", onClick: () => W(3), children: "+3d" }),
            /* @__PURE__ */ t("button", { type: "button", className: "pe-btn-preset", onClick: () => W(7), children: "+7d" }),
            /* @__PURE__ */ t("button", { type: "button", className: "pe-btn-preset", onClick: () => W(14), children: "+14d" }),
            /* @__PURE__ */ t("button", { type: "button", className: "pe-btn-preset", onClick: () => W(30), children: "+30d" }),
            /* @__PURE__ */ t("button", { type: "button", className: "pe-btn-preset", onClick: () => W(60), children: "+60d" })
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
      /* @__PURE__ */ a("div", { className: "pe-form-group", children: [
        /* @__PURE__ */ a("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }, children: [
          /* @__PURE__ */ t("label", { className: "pe-form-label", style: { marginBottom: 0 }, children: "Permanent Termination Date (Optional)" }),
          /* @__PURE__ */ a("div", { style: { display: "flex", gap: 4 }, children: [
            /* @__PURE__ */ t("button", { type: "button", className: "pe-btn-preset", onClick: () => de(3), children: "+3d Grace" }),
            /* @__PURE__ */ t("button", { type: "button", className: "pe-btn-preset", onClick: () => de(7), children: "+7d Grace" }),
            /* @__PURE__ */ t("button", { type: "button", className: "pe-btn-preset", onClick: () => de(14), children: "+14d Grace" }),
            /* @__PURE__ */ t("button", { type: "button", className: "pe-btn-preset", onClick: () => x(""), children: "Clear" })
          ] })
        ] }),
        /* @__PURE__ */ t(
          "input",
          {
            type: "datetime-local",
            className: "pe-input",
            value: O,
            onChange: (e) => x(e.target.value)
          }
        )
      ] }),
      w && /* @__PURE__ */ a("div", { className: "pe-preview-card", children: [
        /* @__PURE__ */ t("div", { className: "pe-preview-title", children: "Schedule Timeline & Countdown" }),
        /* @__PURE__ */ a("div", { className: "pe-preview-row", children: [
          /* @__PURE__ */ a("div", { children: [
            /* @__PURE__ */ t("span", { style: { fontSize: "0.84rem", fontWeight: 600, color: "#ffffff" }, children: pe ? pe.name : "Selected Server" }),
            /* @__PURE__ */ a("span", { style: { fontSize: "0.72rem", color: "#94a3b8", marginLeft: 6 }, children: [
              "will suspend on ",
              D.formattedDate
            ] })
          ] }),
          /* @__PURE__ */ t("span", { className: `pe-time-chip pe-time-chip-${D.urgency}`, children: D.formattedTimeLeft })
        ] }),
        /* @__PURE__ */ t("div", { className: "pe-progress-track", title: D.formattedTimeLeft, children: /* @__PURE__ */ t(
          "div",
          {
            className: `pe-progress-fill pe-progress-fill-${D.urgency}`,
            style: { width: `${D.percent}%` }
          }
        ) }),
        O && /* @__PURE__ */ a("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginTop: 4, color: "#f87171" }, children: [
          /* @__PURE__ */ a("span", { children: [
            "Grace Period Termination: ",
            We.formattedDate
          ] }),
          /* @__PURE__ */ t("span", { children: We.formattedTimeLeft })
        ] })
      ] }),
      /* @__PURE__ */ t("div", { className: "pe-form-group", children: /* @__PURE__ */ a("label", { className: "pe-checkbox-label", children: [
        /* @__PURE__ */ t(
          "input",
          {
            type: "checkbox",
            checked: me,
            onChange: (e) => E(e.target.checked)
          }
        ),
        /* @__PURE__ */ t("span", { children: "Send automated email notification to server owner upon suspension" })
      ] }) }),
      /* @__PURE__ */ a("div", { className: "pe-form-group", children: [
        /* @__PURE__ */ t("label", { className: "pe-form-label", children: "Internal Notes / Reason" }),
        /* @__PURE__ */ t(
          "textarea",
          {
            className: "pe-input",
            rows: 2,
            placeholder: "e.g. Monthly trial expiration, invoice #10842 unpaid...",
            value: ue,
            onChange: (e) => j(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ a("div", { style: { display: "flex", justifyContent: "space-between", marginTop: 20 }, children: [
        o && pe?.suspension_date ? /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            className: "pe-btn pe-btn-danger",
            onClick: () => {
              T.mutate({ server_id: o, action: "cancel" }), d(!1);
            },
            children: "Cancel Schedule"
          }
        ) : /* @__PURE__ */ t("div", {}),
        /* @__PURE__ */ a("div", { style: { display: "flex", gap: 8 }, children: [
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
              disabled: se.isPending || !o,
              onClick: () => {
                if (!o) {
                  c.error("Please select a target server first");
                  return;
                }
                se.mutate({
                  server_id: o,
                  suspension_date: w || null,
                  termination_date: O || null,
                  notify_user: me,
                  notes: ue
                });
              },
              children: se.isPending ? /* @__PURE__ */ t("span", { className: "pe-spinner" }) : "Save Schedule"
            }
          )
        ] })
      ] })
    ] }) }),
    _ && /* @__PURE__ */ t("div", { className: "pe-modal-overlay", onClick: () => u(!1), children: /* @__PURE__ */ a("div", { className: "pe-modal", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ a("div", { className: "pe-modal-header", children: [
        /* @__PURE__ */ a("h3", { className: "pe-title", style: { fontSize: "1.1rem" }, children: [
          "Bulk Schedule Servers (",
          y.length > 0 ? y.length : v.length,
          " servers)"
        ] }),
        /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            style: { background: "transparent", border: "none", color: "#94a3b8", fontSize: "1.4rem", cursor: "pointer" },
            onClick: () => u(!1),
            children: "×"
          }
        )
      ] }),
      /* @__PURE__ */ a("div", { className: "pe-form-group", children: [
        /* @__PURE__ */ t("label", { className: "pe-form-label", children: "Suspension Date & Time" }),
        /* @__PURE__ */ t(
          "input",
          {
            type: "datetime-local",
            className: "pe-input",
            value: Y,
            onChange: (e) => Oe(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ a("div", { className: "pe-form-group", children: [
        /* @__PURE__ */ t("label", { className: "pe-form-label", children: "Grace Period Before Termination (Days after suspension)" }),
        /* @__PURE__ */ t(
          "input",
          {
            type: "number",
            min: 0,
            max: 365,
            className: "pe-input",
            value: he,
            onChange: (e) => Ae(Number(e.target.value))
          }
        )
      ] }),
      /* @__PURE__ */ t("div", { className: "pe-form-group", children: /* @__PURE__ */ a("label", { className: "pe-checkbox-label", children: [
        /* @__PURE__ */ t(
          "input",
          {
            type: "checkbox",
            checked: fe,
            onChange: (e) => Ie(e.target.checked)
          }
        ),
        /* @__PURE__ */ t("span", { children: "Notify server owners via email upon suspension" })
      ] }) }),
      /* @__PURE__ */ a("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }, children: [
        /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            className: "pe-btn pe-btn-secondary",
            onClick: () => u(!1),
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            className: "pe-btn pe-btn-primary",
            disabled: !Y || le.isPending,
            onClick: () => {
              const e = y.length > 0 ? y : v.map((n) => n.id);
              le.mutate({
                server_ids: e,
                suspension_date: Y,
                termination_days_after: he,
                notify_user: fe
              });
            },
            children: le.isPending ? /* @__PURE__ */ t("span", { className: "pe-spinner" }) : "Apply Bulk Schedule"
          }
        )
      ] })
    ] }) }),
    Se && /* @__PURE__ */ t("div", { className: "pe-modal-overlay", onClick: () => I(!1), children: /* @__PURE__ */ a(
      "div",
      {
        className: "pe-modal",
        style: { maxWidth: 760, maxHeight: "90vh", overflowY: "auto" },
        onClick: (e) => e.stopPropagation(),
        children: [
          /* @__PURE__ */ a("div", { className: "pe-modal-header", style: { marginBottom: 16 }, children: [
            /* @__PURE__ */ a("div", { children: [
              /* @__PURE__ */ t("h3", { className: "pe-title", style: { fontSize: "1.15rem" }, children: "Email Notification Templates" }),
              /* @__PURE__ */ t("p", { style: { fontSize: "0.8rem", color: "#94a3b8", margin: "4px 0 0 0" }, children: "Configure customized emails delivered to clients when servers expire, suspend, or terminate." })
            ] }),
            /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                style: { background: "transparent", border: "none", color: "#94a3b8", fontSize: "1.4rem", cursor: "pointer" },
                onClick: () => I(!1),
                children: "×"
              }
            )
          ] }),
          /* @__PURE__ */ a("div", { className: "pe-tab-row", children: [
            /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                className: `pe-tab-btn ${f === "suspension" ? "pe-tab-active" : ""}`,
                onClick: () => J("suspension"),
                children: "Suspension Notice"
              }
            ),
            /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                className: `pe-tab-btn ${f === "warning" ? "pe-tab-active" : ""}`,
                onClick: () => J("warning"),
                children: "Expiration Warning (24h)"
              }
            ),
            /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                className: `pe-tab-btn ${f === "termination" ? "pe-tab-active" : ""}`,
                onClick: () => J("termination"),
                children: "Termination Notice"
              }
            )
          ] }),
          (() => {
            const e = f === "suspension", n = f === "warning", i = e ? we : n ? xe : De, l = e ? ke : n ? _e : Me, r = e ? X : n ? Z : ne, Ve = e ? Ce : n ? Te : Le, $e = e ? U : n ? ee : ae, Ze = e ? V : n ? te : ie, et = e ? "Server Suspension Notice" : n ? "Expiration Warning Notice" : "Server Termination Notice", tt = e ? "Delivered immediately when a server reaches its scheduled expiration date and is suspended." : n ? "Delivered 24 hours prior to expiration to notify owners to renew their server in advance." : "Delivered when a server exceeds its grace period and is flagged for permanent termination.", nt = e ? "SUSPENDED" : n ? "EXPIRING SOON" : "TERMINATED", at = e ? "#ef4444" : n ? "#f59e0b" : "#991b1b", it = r.replace(/{server_name}/gi, "Survival SMP Production").replace(/{username}/gi, "Steve").replace(/{server_id}/gi, "142"), st = $e.replace(/{server_name}/gi, "Survival SMP Production").replace(/{username}/gi, "Steve").replace(/{server_id}/gi, "142").replace(/{server_uuid}/gi, "a8f39b1c").replace(/{suspension_date}/gi, "Tomorrow, 18:00").replace(/{termination_date}/gi, "In 7 days, 18:00").replace(/{panel_url}/gi, window.location.origin);
            return /* @__PURE__ */ a("div", { style: { display: "flex", flexDirection: "column", gap: 16 }, children: [
              /* @__PURE__ */ a("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(15, 23, 42, 0.6)", padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }, children: [
                /* @__PURE__ */ a("div", { children: [
                  /* @__PURE__ */ t("span", { style: { fontSize: "0.875rem", fontWeight: 600, color: "#f8fafc" }, children: et }),
                  /* @__PURE__ */ t("p", { style: { fontSize: "0.75rem", color: "#94a3b8", margin: "2px 0 0 0" }, children: tt })
                ] }),
                /* @__PURE__ */ a("label", { className: "pe-checkbox-label", style: { margin: 0 }, children: [
                  /* @__PURE__ */ t(
                    "input",
                    {
                      type: "checkbox",
                      checked: i,
                      onChange: (m) => l(m.target.checked)
                    }
                  ),
                  /* @__PURE__ */ t("span", { style: { fontSize: "0.8125rem" }, children: "Active" })
                ] })
              ] }),
              /* @__PURE__ */ a("div", { className: "pe-form-group", children: [
                /* @__PURE__ */ t("label", { className: "pe-form-label", children: "Email Subject" }),
                /* @__PURE__ */ t(
                  "input",
                  {
                    type: "text",
                    className: "pe-input",
                    value: r,
                    onChange: (m) => Ve(m.target.value),
                    placeholder: "e.g. [Notice] Server Suspended: {server_name}"
                  }
                )
              ] }),
              /* @__PURE__ */ a("div", { className: "pe-form-group", children: [
                /* @__PURE__ */ a("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }, children: [
                  /* @__PURE__ */ t("label", { className: "pe-form-label", style: { marginBottom: 0 }, children: "Email Body Template" }),
                  /* @__PURE__ */ t("span", { style: { fontSize: "0.72rem", color: "#94a3b8" }, children: "Click placeholder chip to insert" })
                ] }),
                /* @__PURE__ */ t("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }, children: ["{username}", "{server_name}", "{server_id}", "{server_uuid}", "{suspension_date}", "{termination_date}", "{panel_url}"].map((m) => /* @__PURE__ */ t(
                  "button",
                  {
                    type: "button",
                    className: "pe-tag-chip",
                    onClick: () => Ye(m),
                    title: `Click to append ${m}`,
                    children: m
                  },
                  m
                )) }),
                /* @__PURE__ */ t(
                  "textarea",
                  {
                    className: "pe-input",
                    style: { minHeight: 130, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", fontSize: "0.8125rem", lineHeight: "1.5" },
                    value: $e,
                    onChange: (m) => Ze(m.target.value),
                    placeholder: "Compose email template message..."
                  }
                )
              ] }),
              /* @__PURE__ */ a("div", { children: [
                /* @__PURE__ */ t("label", { className: "pe-form-label", style: { marginBottom: 4 }, children: "Live Email Preview (Sample Client View)" }),
                /* @__PURE__ */ a("div", { className: "pe-email-preview", children: [
                  /* @__PURE__ */ a("div", { className: "pe-email-preview-header", children: [
                    /* @__PURE__ */ t("span", { style: { fontSize: "0.9rem", fontWeight: 700, color: "#f8fafc" }, children: "Pterodactyl Panel" }),
                    /* @__PURE__ */ t(
                      "span",
                      {
                        style: {
                          padding: "3px 8px",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          background: at,
                          color: "#ffffff",
                          borderRadius: 4,
                          letterSpacing: "0.04em"
                        },
                        children: nt
                      }
                    )
                  ] }),
                  /* @__PURE__ */ t("h4", { className: "pe-email-preview-title", children: it || "(No subject)" }),
                  /* @__PURE__ */ t("div", { className: "pe-email-preview-body", children: st || "(No message body provided)" }),
                  /* @__PURE__ */ t("table", { className: "pe-email-preview-meta", children: /* @__PURE__ */ a("tbody", { children: [
                    /* @__PURE__ */ a("tr", { children: [
                      /* @__PURE__ */ t("td", { style: { color: "#94a3b8" }, children: "Target Server:" }),
                      /* @__PURE__ */ t("td", { style: { textAlign: "right", color: "#f1f5f9", fontWeight: 600 }, children: "Survival SMP Production (#142)" })
                    ] }),
                    /* @__PURE__ */ a("tr", { children: [
                      /* @__PURE__ */ t("td", { style: { color: "#94a3b8" }, children: "Effective Date:" }),
                      /* @__PURE__ */ t("td", { style: { textAlign: "right", color: "#f1f5f9", fontWeight: 600 }, children: "Tomorrow, 18:00" })
                    ] })
                  ] }) }),
                  /* @__PURE__ */ t("div", { style: { textAlign: "center", marginTop: 14 }, children: /* @__PURE__ */ t("span", { className: "pe-email-preview-btn", children: "Open Control Panel →" }) })
                ] })
              ] }),
              /* @__PURE__ */ a("div", { style: { background: "rgba(15, 23, 42, 0.5)", padding: "12px 14px", borderRadius: 8, border: "1px solid #334155" }, children: [
                /* @__PURE__ */ a("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }, children: [
                  /* @__PURE__ */ t("span", { style: { fontSize: "0.8rem", fontWeight: 600, color: "#e2e8f0" }, children: "Send Test Email" }),
                  /* @__PURE__ */ t("span", { style: { fontSize: "0.72rem", color: "#94a3b8" }, children: "Verifies mail transport configuration & design" })
                ] }),
                /* @__PURE__ */ a("div", { style: { display: "flex", gap: 8 }, children: [
                  /* @__PURE__ */ t(
                    "input",
                    {
                      type: "email",
                      className: "pe-input",
                      placeholder: "admin@example.com",
                      value: P,
                      onChange: (m) => Ee(m.target.value),
                      style: { flex: 1, fontSize: "0.8125rem" }
                    }
                  ),
                  /* @__PURE__ */ t(
                    "button",
                    {
                      type: "button",
                      className: "pe-btn pe-btn-secondary",
                      disabled: je || !P.trim(),
                      onClick: He,
                      style: { whiteSpace: "nowrap" },
                      children: je ? /* @__PURE__ */ t("span", { className: "pe-spinner" }) : "Send Test"
                    }
                  )
                ] })
              ] })
            ] });
          })(),
          /* @__PURE__ */ a("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14 }, children: [
            /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                className: "pe-btn pe-btn-secondary",
                onClick: () => I(!1),
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
export {
  pt as default
};
