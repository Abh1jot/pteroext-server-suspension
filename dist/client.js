// Pterodactyl 2.0 Extension Stylesheet Loader & Synchronous Injector
(function() {
    if (typeof document !== 'undefined') {
        const id = 'ext-styles-server-suspension';
        if (!document.getElementById(id)) {
            try {
                const link = document.createElement('link');
                link.id = id;
                link.rel = 'stylesheet';
                link.href = new URL('./client.css', import.meta.url).href;
                document.head.appendChild(link);
            } catch (e) {}
            try {
                const style = document.createElement('style');
                style.id = id + '-inline';
                style.textContent = "/* src/client/styles.css */\n.pe-container {\n  width: 100%;\n  margin: 0 auto;\n  font-family: inherit;\n  color: var(--foreground, #f8fafc);\n  box-sizing: border-box;\n}\n.pe-container *,\n.pe-container *::before,\n.pe-container *::after {\n  box-sizing: border-box;\n}\n.pe-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 16px;\n  margin-bottom: 24px;\n  flex-wrap: wrap;\n}\n.pe-title-wrap {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.pe-title {\n  font-size: 1.25rem;\n  font-weight: 600;\n  color: var(--foreground, #ffffff);\n  margin: 0;\n  letter-spacing: -0.015em;\n}\n.pe-subtitle {\n  font-size: 0.8125rem;\n  color: var(--muted-foreground, #94a3b8);\n  margin: 0;\n}\n.pe-stats-row {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 14px;\n  margin-bottom: 24px;\n}\n.pe-stat-card {\n  background: var(--card, rgba(30, 41, 59, 0.45));\n  border: 1px solid var(--border, rgba(255, 255, 255, 0.08));\n  border-radius: 10px;\n  padding: 16px 20px;\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.pe-stat-val {\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: var(--foreground, #ffffff);\n  line-height: 1.2;\n}\n.pe-stat-label {\n  font-size: 0.75rem;\n  font-weight: 500;\n  color: var(--muted-foreground, #94a3b8);\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n}\n.pe-toolbar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  margin-bottom: 18px;\n  flex-wrap: wrap;\n}\n.pe-input-box {\n  position: relative;\n  flex: 1;\n  min-width: 240px;\n}\n.pe-input {\n  width: 100%;\n  padding: 8px 14px 8px 36px;\n  background: var(--input, rgba(15, 23, 42, 0.6));\n  border: 1px solid var(--border, rgba(255, 255, 255, 0.1));\n  border-radius: 8px;\n  color: var(--foreground, #f8fafc);\n  font-size: 0.84375rem;\n  outline: none;\n}\n.pe-input:focus {\n  border-color: var(--ring, #6366f1);\n  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15);\n}\n.pe-input-icon {\n  position: absolute;\n  left: 11px;\n  top: 50%;\n  transform: translateY(-50%);\n  width: 15px;\n  height: 15px;\n  color: var(--muted-foreground, #64748b);\n  pointer-events: none;\n}\n.pe-select {\n  padding: 8px 12px;\n  background: var(--input, rgba(15, 23, 42, 0.6));\n  border: 1px solid var(--border, rgba(255, 255, 255, 0.1));\n  border-radius: 8px;\n  color: var(--foreground, #f8fafc);\n  font-size: 0.84375rem;\n  outline: none;\n  cursor: pointer;\n}\n.pe-table-card {\n  background: var(--card, rgba(30, 41, 59, 0.4));\n  border: 1px solid var(--border, rgba(255, 255, 255, 0.08));\n  border-radius: 10px;\n  overflow-x: auto;\n}\n.pe-table {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 0.84375rem;\n  text-align: left;\n}\n.pe-table th {\n  padding: 12px 16px;\n  background: rgba(0, 0, 0, 0.15);\n  color: var(--muted-foreground, #94a3b8);\n  font-weight: 600;\n  font-size: 0.75rem;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n  border-bottom: 1px solid var(--border, rgba(255, 255, 255, 0.06));\n}\n.pe-table td {\n  padding: 12px 16px;\n  border-bottom: 1px solid var(--border, rgba(255, 255, 255, 0.04));\n  color: var(--foreground, #e2e8f0);\n}\n.pe-table tr:hover td {\n  background: rgba(255, 255, 255, 0.02);\n}\n.pe-badge {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  padding: 3px 8px;\n  border-radius: 9999px;\n  font-size: 0.72rem;\n  font-weight: 500;\n  line-height: 1;\n}\n.pe-badge-dot {\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n}\n.pe-badge-active {\n  background: rgba(34, 197, 94, 0.12);\n  color: #4ade80;\n  border: 1px solid rgba(34, 197, 94, 0.25);\n}\n.pe-badge-active .pe-badge-dot {\n  background: #22c55e;\n}\n.pe-badge-suspended {\n  background: rgba(239, 68, 68, 0.12);\n  color: #f87171;\n  border: 1px solid rgba(239, 68, 68, 0.25);\n}\n.pe-badge-suspended .pe-badge-dot {\n  background: #ef4444;\n}\n.pe-badge-scheduled {\n  background: rgba(234, 179, 8, 0.12);\n  color: #facc15;\n  border: 1px solid rgba(234, 179, 8, 0.25);\n}\n.pe-badge-scheduled .pe-badge-dot {\n  background: #eab308;\n}\n.pe-badge-terminated {\n  background: rgba(148, 163, 184, 0.12);\n  color: #94a3b8;\n  border: 1px solid rgba(148, 163, 184, 0.25);\n}\n.pe-badge-terminated .pe-badge-dot {\n  background: #64748b;\n}\n.pe-btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 6px;\n  padding: 7px 14px;\n  border-radius: 6px;\n  font-size: 0.8125rem;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.15s ease;\n  border: none;\n  outline: none;\n  white-space: nowrap;\n}\n.pe-btn-primary {\n  background: var(--primary, #6366f1);\n  color: #ffffff;\n}\n.pe-btn-primary:hover:not(:disabled) {\n  opacity: 0.92;\n  transform: translateY(-0.5px);\n}\n.pe-btn-secondary {\n  background: var(--muted, rgba(255, 255, 255, 0.08));\n  color: var(--foreground, #ffffff);\n  border: 1px solid var(--border, rgba(255, 255, 255, 0.1));\n}\n.pe-btn-secondary:hover:not(:disabled) {\n  background: rgba(255, 255, 255, 0.12);\n}\n.pe-btn-danger {\n  background: rgba(239, 68, 68, 0.15);\n  color: #f87171;\n  border: 1px solid rgba(239, 68, 68, 0.25);\n}\n.pe-btn-danger:hover:not(:disabled) {\n  background: rgba(239, 68, 68, 0.25);\n}\n.pe-modal-overlay {\n  position: fixed;\n  inset: 0;\n  z-index: 99999;\n  background: rgba(0, 0, 0, 0.65);\n  backdrop-filter: blur(6px);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 20px;\n}\n.pe-modal {\n  position: relative;\n  width: 100%;\n  max-width: 520px;\n  background: var(--card, #1e293b);\n  border: 1px solid var(--border, rgba(255, 255, 255, 0.1));\n  border-radius: 12px;\n  padding: 24px;\n  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5);\n}\n.pe-modal-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 18px;\n}\n.pe-form-group {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  margin-bottom: 16px;\n}\n.pe-form-label {\n  font-size: 0.8125rem;\n  font-weight: 500;\n  color: var(--muted-foreground, #94a3b8);\n}\n.pe-checkbox-label {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 0.8125rem;\n  color: var(--foreground, #e2e8f0);\n  cursor: pointer;\n  user-select: none;\n}\n.pe-spinner {\n  width: 16px;\n  height: 16px;\n  border: 2px solid rgba(255, 255, 255, 0.2);\n  border-top-color: #ffffff;\n  border-radius: 50%;\n  animation: pe-spin 0.6s linear infinite;\n  display: inline-block;\n}\n@keyframes pe-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n";
                document.head.appendChild(style);
            } catch (e) {}
        }
    }
})();
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/client/screens/SuspensionScreen.tsx
var SuspensionScreen_exports = {};
__export(SuspensionScreen_exports, {
  default: () => SuspensionScreen
});
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@pterodactyl/sdk";
import { jsx, jsxs } from "react/jsx-runtime";
function SuspensionScreen() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [nodeFilter, setNodeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [singleModalOpen, setSingleModalOpen] = useState(false);
  const [selectedServerId, setSelectedServerId] = useState(null);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [editSuspDate, setEditSuspDate] = useState("");
  const [editTermDate, setEditTermDate] = useState("");
  const [editNotify, setEditNotify] = useState(true);
  const [editNotes, setEditNotes] = useState("");
  const [serverFilterQuery, setServerFilterQuery] = useState("");
  const [bulkSuspDate, setBulkSuspDate] = useState("");
  const [bulkGraceDays, setBulkGraceDays] = useState(7);
  const [bulkNotify, setBulkNotify] = useState(true);
  const [selectedServerIds, setSelectedServerIds] = useState([]);
  const overviewQuery = useQuery({
    queryKey: ["admin-suspension-overview"],
    queryFn: async () => {
      const res = await fetch("/api/admin/extensions/server-suspension/overview");
      if (!res.ok) throw new Error("Failed to load server suspension overview");
      return res.json();
    }
  });
  const updateScheduleMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch("/api/admin/extensions/server-suspension/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update schedule");
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Schedule updated");
      setSingleModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-suspension-overview"] });
    },
    onError: (err) => toast.error(err.message)
  });
  const bulkScheduleMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch("/api/admin/extensions/server-suspension/bulk-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to apply bulk schedule");
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Bulk schedule saved");
      setBulkModalOpen(false);
      setSelectedServerIds([]);
      queryClient.invalidateQueries({ queryKey: ["admin-suspension-overview"] });
    },
    onError: (err) => toast.error(err.message)
  });
  const actionMutation = useMutation({
    mutationFn: async ({ server_id, action }) => {
      const res = await fetch("/api/admin/extensions/server-suspension/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ server_id, action })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to perform action");
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Action executed successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-suspension-overview"] });
    },
    onError: (err) => toast.error(err.message)
  });
  const processDueMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/extensions/server-suspension/process-due", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to process due items");
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Due schedules processed");
      queryClient.invalidateQueries({ queryKey: ["admin-suspension-overview"] });
    },
    onError: (err) => toast.error(err.message)
  });
  const servers = overviewQuery.data?.servers || [];
  const openEdit = (server) => {
    setSelectedServerId(server.id);
    setEditSuspDate(server.suspension_date ? server.suspension_date.slice(0, 16) : "");
    setEditTermDate(server.termination_date ? server.termination_date.slice(0, 16) : "");
    setEditNotify(server.notify_user);
    setEditNotes(server.notes || "");
    setSingleModalOpen(true);
  };
  const openScheduleNew = () => {
    if (!selectedServerId && servers.length > 0) {
      const first = servers[0];
      setSelectedServerId(first.id);
      setEditSuspDate(first.suspension_date ? first.suspension_date.slice(0, 16) : "");
      setEditTermDate(first.termination_date ? first.termination_date.slice(0, 16) : "");
      setEditNotify(first.notify_user);
      setEditNotes(first.notes || "");
    }
    setSingleModalOpen(true);
  };
  const setSuspensionDays = (days) => {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() + days);
    const pad = (n) => String(n).padStart(2, "0");
    const str = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    setEditSuspDate(str);
  };
  const setTerminationGrace = (daysAfter) => {
    const base = editSuspDate ? new Date(editSuspDate) : /* @__PURE__ */ new Date();
    base.setDate(base.getDate() + daysAfter);
    const pad = (n) => String(n).padStart(2, "0");
    const str = `${base.getFullYear()}-${pad(base.getMonth() + 1)}-${pad(base.getDate())}T${pad(base.getHours())}:${pad(base.getMinutes())}`;
    setEditTermDate(str);
  };
  const filteredServers = servers.filter((s) => {
    const matchesQuery = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.identifier.toLowerCase().includes(searchQuery.toLowerCase()) || s.owner.toLowerCase().includes(searchQuery.toLowerCase()) || s.owner_email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesNode = nodeFilter === "all" || s.node_id === Number(nodeFilter);
    let matchesStatus = true;
    if (statusFilter === "active") matchesStatus = s.server_status !== "suspended" && !s.suspension_date;
    if (statusFilter === "scheduled") matchesStatus = Boolean(s.suspension_date) && s.server_status !== "suspended";
    if (statusFilter === "suspended") matchesStatus = s.server_status === "suspended";
    return matchesQuery && matchesNode && matchesStatus;
  });
  const toggleSelectServer = (id) => {
    setSelectedServerIds(
      (prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  const selectAllFiltered = () => {
    if (selectedServerIds.length === filteredServers.length) {
      setSelectedServerIds([]);
    } else {
      setSelectedServerIds(filteredServers.map((s) => s.id));
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "pe-container", children: [
    /* @__PURE__ */ jsxs("div", { className: "pe-header", children: [
      /* @__PURE__ */ jsxs("div", { className: "pe-title-wrap", children: [
        /* @__PURE__ */ jsx("h2", { className: "pe-title", children: "Auto Server Suspension & Termination" }),
        /* @__PURE__ */ jsx("p", { className: "pe-subtitle", children: "Manage automated expiration schedules, owner suspension notifications, and grace-period server termination." })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 10 }, children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "pe-btn pe-btn-primary",
            onClick: openScheduleNew,
            children: "+ Set Suspension Date"
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            className: "pe-btn pe-btn-secondary",
            onClick: () => setBulkModalOpen(true),
            children: [
              "Bulk Schedule ",
              selectedServerIds.length > 0 ? `(${selectedServerIds.length})` : ""
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "pe-btn pe-btn-secondary",
            disabled: processDueMutation.isPending,
            onClick: () => processDueMutation.mutate(),
            children: processDueMutation.isPending ? /* @__PURE__ */ jsx("span", { className: "pe-spinner" }) : "Process Due Schedules"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pe-stats-row", children: [
      /* @__PURE__ */ jsxs("div", { className: "pe-stat-card", children: [
        /* @__PURE__ */ jsx("span", { className: "pe-stat-val", children: overviewQuery.data?.stats.total ?? 0 }),
        /* @__PURE__ */ jsx("span", { className: "pe-stat-label", children: "Total Servers" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pe-stat-card", children: [
        /* @__PURE__ */ jsx("span", { className: "pe-stat-val", style: { color: "#facc15" }, children: overviewQuery.data?.stats.scheduled ?? 0 }),
        /* @__PURE__ */ jsx("span", { className: "pe-stat-label", children: "Scheduled for Suspension" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pe-stat-card", children: [
        /* @__PURE__ */ jsx("span", { className: "pe-stat-val", style: { color: "#f87171" }, children: overviewQuery.data?.stats.suspended ?? 0 }),
        /* @__PURE__ */ jsx("span", { className: "pe-stat-label", children: "Currently Suspended" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pe-stat-card", children: [
        /* @__PURE__ */ jsx("span", { className: "pe-stat-val", style: { color: "#94a3b8" }, children: overviewQuery.data?.stats.terminated ?? 0 }),
        /* @__PURE__ */ jsx("span", { className: "pe-stat-label", children: "Terminated" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pe-toolbar", children: [
      /* @__PURE__ */ jsxs("div", { className: "pe-input-box", children: [
        /* @__PURE__ */ jsxs("svg", { className: "pe-input-icon", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
          /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "8" }),
          /* @__PURE__ */ jsx("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            className: "pe-input",
            type: "text",
            placeholder: "Search servers by name, identifier, or owner email...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          className: "pe-select",
          value: nodeFilter,
          onChange: (e) => setNodeFilter(e.target.value),
          children: [
            /* @__PURE__ */ jsx("option", { value: "all", children: "All Nodes" }),
            overviewQuery.data?.nodes.map((n) => /* @__PURE__ */ jsx("option", { value: n.id, children: n.name }, n.id))
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "select",
        {
          className: "pe-select",
          value: statusFilter,
          onChange: (e) => setStatusFilter(e.target.value),
          children: [
            /* @__PURE__ */ jsx("option", { value: "all", children: "All Statuses" }),
            /* @__PURE__ */ jsx("option", { value: "active", children: "Active" }),
            /* @__PURE__ */ jsx("option", { value: "scheduled", children: "Scheduled" }),
            /* @__PURE__ */ jsx("option", { value: "suspended", children: "Suspended" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "pe-table-card", children: /* @__PURE__ */ jsxs("table", { className: "pe-table", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { style: { width: 40, textAlign: "center" }, children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            checked: filteredServers.length > 0 && selectedServerIds.length === filteredServers.length,
            onChange: selectAllFiltered
          }
        ) }),
        /* @__PURE__ */ jsx("th", { children: "Server" }),
        /* @__PURE__ */ jsx("th", { children: "Node / Owner" }),
        /* @__PURE__ */ jsx("th", { children: "Status" }),
        /* @__PURE__ */ jsx("th", { children: "Suspension Due" }),
        /* @__PURE__ */ jsx("th", { children: "Termination Due" }),
        /* @__PURE__ */ jsx("th", { style: { textAlign: "right" }, children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: overviewQuery.isLoading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs("td", { colSpan: 7, style: { textAlign: "center", padding: "32px 0" }, children: [
        /* @__PURE__ */ jsx("span", { className: "pe-spinner" }),
        /* @__PURE__ */ jsx("p", { className: "pe-subtitle", style: { marginTop: 8 }, children: "Loading servers..." })
      ] }) }) : filteredServers.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 7, style: { textAlign: "center", padding: "32px 0" }, children: /* @__PURE__ */ jsx("p", { className: "pe-subtitle", children: "No matching servers found." }) }) }) : filteredServers.map((server) => {
        const isSuspended = server.server_status === "suspended";
        const hasSchedule = Boolean(server.suspension_date);
        return /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { style: { textAlign: "center" }, children: /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: selectedServerIds.includes(server.id),
              onChange: () => toggleSelectServer(server.id)
            }
          ) }),
          /* @__PURE__ */ jsxs("td", { children: [
            /* @__PURE__ */ jsx("div", { style: { fontWeight: 600 }, children: server.name }),
            /* @__PURE__ */ jsx("div", { style: { fontSize: "0.72rem", color: "var(--muted-foreground, #94a3b8)", fontFamily: "monospace" }, children: server.identifier })
          ] }),
          /* @__PURE__ */ jsxs("td", { children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: "0.8125rem" }, children: server.node }),
            /* @__PURE__ */ jsxs("div", { style: { fontSize: "0.72rem", color: "var(--muted-foreground, #94a3b8)" }, children: [
              server.owner,
              " (",
              server.owner_email,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsx("td", { children: isSuspended ? /* @__PURE__ */ jsxs("span", { className: "pe-badge pe-badge-suspended", children: [
            /* @__PURE__ */ jsx("span", { className: "pe-badge-dot" }),
            "Suspended"
          ] }) : hasSchedule ? /* @__PURE__ */ jsxs("span", { className: "pe-badge pe-badge-scheduled", children: [
            /* @__PURE__ */ jsx("span", { className: "pe-badge-dot" }),
            "Scheduled"
          ] }) : /* @__PURE__ */ jsxs("span", { className: "pe-badge pe-badge-active", children: [
            /* @__PURE__ */ jsx("span", { className: "pe-badge-dot" }),
            "Active"
          ] }) }),
          /* @__PURE__ */ jsx("td", { children: server.suspension_date ? /* @__PURE__ */ jsxs("span", { style: { fontSize: "0.8125rem", color: "#facc15" }, children: [
            new Date(server.suspension_date).toLocaleDateString(),
            " ",
            new Date(server.suspension_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          ] }) : /* @__PURE__ */ jsx("span", { style: { color: "var(--muted-foreground, #64748b)" }, children: "None" }) }),
          /* @__PURE__ */ jsx("td", { children: server.termination_date ? /* @__PURE__ */ jsxs("span", { style: { fontSize: "0.8125rem", color: "#f87171" }, children: [
            new Date(server.termination_date).toLocaleDateString(),
            " ",
            new Date(server.termination_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          ] }) : /* @__PURE__ */ jsx("span", { style: { color: "var(--muted-foreground, #64748b)" }, children: "None" }) }),
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 6, justifyContent: "flex-end", alignItems: "center" }, children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "pe-btn pe-btn-primary",
                style: { padding: "6px 12px", fontSize: "0.8125rem", fontWeight: 600 },
                onClick: () => openEdit(server),
                children: hasSchedule ? "Edit Expiration" : "Set Suspension Date"
              }
            ),
            hasSchedule && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "pe-btn pe-btn-secondary",
                style: { padding: "6px 10px", fontSize: "0.75rem" },
                title: "Remove scheduled suspension & termination",
                onClick: () => actionMutation.mutate({ server_id: server.id, action: "cancel" }),
                children: "Remove Schedule"
              }
            ),
            isSuspended ? /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "pe-btn pe-btn-secondary",
                style: { padding: "6px 10px", fontSize: "0.75rem" },
                disabled: actionMutation.isPending,
                onClick: () => actionMutation.mutate({ server_id: server.id, action: "unsuspend" }),
                children: "Unsuspend"
              }
            ) : /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "pe-btn pe-btn-danger",
                style: { padding: "6px 10px", fontSize: "0.75rem" },
                disabled: actionMutation.isPending,
                onClick: () => actionMutation.mutate({ server_id: server.id, action: "suspend" }),
                children: "Suspend Now"
              }
            )
          ] }) })
        ] }, server.id);
      }) })
    ] }) }),
    singleModalOpen && /* @__PURE__ */ jsx("div", { className: "pe-modal-overlay", onClick: () => setSingleModalOpen(false), children: /* @__PURE__ */ jsxs("div", { className: "pe-modal", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("div", { className: "pe-modal-header", children: [
        /* @__PURE__ */ jsx("h3", { className: "pe-title", style: { fontSize: "1.1rem" }, children: "Schedule Server Suspension & Expiration" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            style: { background: "transparent", border: "none", color: "#94a3b8", fontSize: "1.4rem", cursor: "pointer" },
            onClick: () => setSingleModalOpen(false),
            children: "\xD7"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pe-form-group", children: [
        /* @__PURE__ */ jsx("label", { className: "pe-form-label", children: "Select Target Server" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            className: "pe-input",
            placeholder: "Search servers by name or identifier...",
            style: { marginBottom: 6, fontSize: "0.8125rem" },
            value: serverFilterQuery,
            onChange: (e) => setServerFilterQuery(e.target.value)
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            className: "pe-select",
            style: { width: "100%" },
            value: selectedServerId ?? "",
            onChange: (e) => {
              const id = Number(e.target.value);
              setSelectedServerId(id);
              const found = servers.find((s) => s.id === id);
              if (found) {
                setEditSuspDate(found.suspension_date ? found.suspension_date.slice(0, 16) : "");
                setEditTermDate(found.termination_date ? found.termination_date.slice(0, 16) : "");
                setEditNotify(found.notify_user);
                setEditNotes(found.notes || "");
              }
            },
            children: [
              servers.length === 0 && /* @__PURE__ */ jsx("option", { value: "", children: "No servers loaded" }),
              servers.filter(
                (s) => !serverFilterQuery || s.name.toLowerCase().includes(serverFilterQuery.toLowerCase()) || s.identifier.toLowerCase().includes(serverFilterQuery.toLowerCase()) || s.owner.toLowerCase().includes(serverFilterQuery.toLowerCase())
              ).map((s) => /* @__PURE__ */ jsxs("option", { value: s.id, children: [
                s.name,
                " (",
                s.identifier,
                ") - ",
                s.owner
              ] }, s.id))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pe-form-group", children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }, children: [
          /* @__PURE__ */ jsx("label", { className: "pe-form-label", style: { marginBottom: 0 }, children: "Suspension Date & Time" }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 4 }, children: [
            /* @__PURE__ */ jsx("button", { type: "button", className: "pe-btn pe-btn-secondary", style: { padding: "2px 8px", fontSize: "0.72rem" }, onClick: () => setSuspensionDays(7), children: "+7d" }),
            /* @__PURE__ */ jsx("button", { type: "button", className: "pe-btn pe-btn-secondary", style: { padding: "2px 8px", fontSize: "0.72rem" }, onClick: () => setSuspensionDays(14), children: "+14d" }),
            /* @__PURE__ */ jsx("button", { type: "button", className: "pe-btn pe-btn-secondary", style: { padding: "2px 8px", fontSize: "0.72rem" }, onClick: () => setSuspensionDays(30), children: "+30d" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "datetime-local",
            className: "pe-input",
            value: editSuspDate,
            onChange: (e) => setEditSuspDate(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pe-form-group", children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }, children: [
          /* @__PURE__ */ jsx("label", { className: "pe-form-label", style: { marginBottom: 0 }, children: "Permanent Termination Date (Optional)" }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 4 }, children: [
            /* @__PURE__ */ jsx("button", { type: "button", className: "pe-btn pe-btn-secondary", style: { padding: "2px 8px", fontSize: "0.72rem" }, onClick: () => setTerminationGrace(3), children: "+3d Grace" }),
            /* @__PURE__ */ jsx("button", { type: "button", className: "pe-btn pe-btn-secondary", style: { padding: "2px 8px", fontSize: "0.72rem" }, onClick: () => setTerminationGrace(7), children: "+7d Grace" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "datetime-local",
            className: "pe-input",
            value: editTermDate,
            onChange: (e) => setEditTermDate(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "pe-form-group", children: /* @__PURE__ */ jsxs("label", { className: "pe-checkbox-label", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            checked: editNotify,
            onChange: (e) => setEditNotify(e.target.checked)
          }
        ),
        /* @__PURE__ */ jsx("span", { children: "Send automated email notification to server owner upon suspension" })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "pe-form-group", children: [
        /* @__PURE__ */ jsx("label", { className: "pe-form-label", children: "Internal Notes / Reason" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            className: "pe-input",
            rows: 2,
            placeholder: "e.g. Monthly trial expiration, invoice #10842 unpaid...",
            value: editNotes,
            onChange: (e) => setEditNotes(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginTop: 20 }, children: [
        selectedServerId && servers.find((s) => s.id === selectedServerId)?.suspension_date ? /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "pe-btn pe-btn-danger",
            onClick: () => {
              actionMutation.mutate({ server_id: selectedServerId, action: "cancel" });
              setSingleModalOpen(false);
            },
            children: "Cancel Schedule"
          }
        ) : /* @__PURE__ */ jsx("div", {}),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8 }, children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "pe-btn pe-btn-secondary",
              onClick: () => setSingleModalOpen(false),
              children: "Close"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "pe-btn pe-btn-primary",
              disabled: updateScheduleMutation.isPending || !selectedServerId,
              onClick: () => {
                if (!selectedServerId) {
                  toast.error("Please select a server first");
                  return;
                }
                updateScheduleMutation.mutate({
                  server_id: selectedServerId,
                  suspension_date: editSuspDate || null,
                  termination_date: editTermDate || null,
                  notify_user: editNotify,
                  notes: editNotes
                });
              },
              children: updateScheduleMutation.isPending ? /* @__PURE__ */ jsx("span", { className: "pe-spinner" }) : "Save Schedule"
            }
          )
        ] })
      ] })
    ] }) }),
    bulkModalOpen && /* @__PURE__ */ jsx("div", { className: "pe-modal-overlay", onClick: () => setBulkModalOpen(false), children: /* @__PURE__ */ jsxs("div", { className: "pe-modal", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("div", { className: "pe-modal-header", children: [
        /* @__PURE__ */ jsxs("h3", { className: "pe-title", style: { fontSize: "1.1rem" }, children: [
          "Bulk Schedule Servers (",
          selectedServerIds.length > 0 ? selectedServerIds.length : filteredServers.length,
          " servers)"
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            style: { background: "transparent", border: "none", color: "#94a3b8", fontSize: "1.4rem", cursor: "pointer" },
            onClick: () => setBulkModalOpen(false),
            children: "\xD7"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pe-form-group", children: [
        /* @__PURE__ */ jsx("label", { className: "pe-form-label", children: "Suspension Date & Time" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "datetime-local",
            className: "pe-input",
            value: bulkSuspDate,
            onChange: (e) => setBulkSuspDate(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pe-form-group", children: [
        /* @__PURE__ */ jsx("label", { className: "pe-form-label", children: "Grace Period Before Termination (Days after suspension)" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            min: 0,
            max: 365,
            className: "pe-input",
            value: bulkGraceDays,
            onChange: (e) => setBulkGraceDays(Number(e.target.value))
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "pe-form-group", children: /* @__PURE__ */ jsxs("label", { className: "pe-checkbox-label", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            checked: bulkNotify,
            onChange: (e) => setBulkNotify(e.target.checked)
          }
        ),
        /* @__PURE__ */ jsx("span", { children: "Notify server owners via email upon suspension" })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }, children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "pe-btn pe-btn-secondary",
            onClick: () => setBulkModalOpen(false),
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "pe-btn pe-btn-primary",
            disabled: !bulkSuspDate || bulkScheduleMutation.isPending,
            onClick: () => {
              const targetIds = selectedServerIds.length > 0 ? selectedServerIds : filteredServers.map((s) => s.id);
              bulkScheduleMutation.mutate({
                server_ids: targetIds,
                suspension_date: bulkSuspDate,
                termination_days_after: bulkGraceDays,
                notify_user: bulkNotify
              });
            },
            children: bulkScheduleMutation.isPending ? /* @__PURE__ */ jsx("span", { className: "pe-spinner" }) : "Apply Bulk Schedule"
          }
        )
      ] })
    ] }) })
  ] });
}
var init_SuspensionScreen = __esm({
  "src/client/screens/SuspensionScreen.tsx"() {
    "use strict";
  }
});

// src/client/index.tsx
import { definePterodactylExtension } from "@pterodactyl/sdk";
var index_default = definePterodactylExtension({
  setup({ screens }) {
    screens.register("admin-suspension", () => Promise.resolve().then(() => (init_SuspensionScreen(), SuspensionScreen_exports)));
  }
});
export {
  index_default as default
};
