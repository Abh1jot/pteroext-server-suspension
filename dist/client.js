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
                style.textContent = "/* src/client/styles.css */\n.pe-container {\n  width: 100%;\n  margin: 0 auto;\n  font-family: inherit;\n  color: var(--foreground, #f8fafc);\n  box-sizing: border-box;\n}\n.pe-container *,\n.pe-container *::before,\n.pe-container *::after {\n  box-sizing: border-box;\n}\n.pe-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 16px;\n  margin-bottom: 24px;\n  flex-wrap: wrap;\n}\n.pe-title-wrap {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.pe-title {\n  font-size: 1.25rem;\n  font-weight: 600;\n  color: var(--foreground, #ffffff);\n  margin: 0;\n  letter-spacing: -0.015em;\n}\n.pe-subtitle {\n  font-size: 0.8125rem;\n  color: var(--muted-foreground, #94a3b8);\n  margin: 0;\n}\n.pe-stats-row {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 14px;\n  margin-bottom: 24px;\n}\n.pe-stat-card {\n  background: var(--card, rgba(30, 41, 59, 0.45));\n  border: 1px solid var(--border, rgba(255, 255, 255, 0.08));\n  border-radius: 10px;\n  padding: 16px 20px;\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.pe-stat-val {\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: var(--foreground, #ffffff);\n  line-height: 1.2;\n}\n.pe-stat-label {\n  font-size: 0.75rem;\n  font-weight: 500;\n  color: var(--muted-foreground, #94a3b8);\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n}\n.pe-toolbar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  margin-bottom: 18px;\n  flex-wrap: wrap;\n}\n.pe-input-box {\n  position: relative;\n  flex: 1;\n  min-width: 240px;\n}\n.pe-input {\n  width: 100%;\n  padding: 8px 14px 8px 36px;\n  background: var(--input, rgba(15, 23, 42, 0.6));\n  border: 1px solid var(--border, rgba(255, 255, 255, 0.1));\n  border-radius: 8px;\n  color: var(--foreground, #f8fafc);\n  font-size: 0.84375rem;\n  outline: none;\n  transition: border-color 0.15s ease, box-shadow 0.15s ease;\n}\n.pe-input:focus {\n  border-color: var(--ring, #6366f1);\n  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15);\n}\n.pe-input-icon {\n  position: absolute;\n  left: 11px;\n  top: 50%;\n  transform: translateY(-50%);\n  width: 15px;\n  height: 15px;\n  color: var(--muted-foreground, #64748b);\n  pointer-events: none;\n}\n.pe-select {\n  padding: 8px 12px;\n  background: var(--input, rgba(15, 23, 42, 0.6));\n  border: 1px solid var(--border, rgba(255, 255, 255, 0.1));\n  border-radius: 8px;\n  color: var(--foreground, #f8fafc);\n  font-size: 0.84375rem;\n  outline: none;\n  cursor: pointer;\n}\n.pe-select:focus {\n  border-color: var(--ring, #6366f1);\n}\n.pe-table-card {\n  background: var(--card, rgba(30, 41, 59, 0.4));\n  border: 1px solid var(--border, rgba(255, 255, 255, 0.08));\n  border-radius: 10px;\n  overflow-x: auto;\n}\n.pe-table {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 0.84375rem;\n  text-align: left;\n}\n.pe-table th {\n  padding: 12px 16px;\n  background: rgba(0, 0, 0, 0.15);\n  color: var(--muted-foreground, #94a3b8);\n  font-weight: 600;\n  font-size: 0.75rem;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n  border-bottom: 1px solid var(--border, rgba(255, 255, 255, 0.06));\n  white-space: nowrap;\n}\n.pe-table td {\n  padding: 12px 16px;\n  border-bottom: 1px solid var(--border, rgba(255, 255, 255, 0.04));\n  color: var(--foreground, #e2e8f0);\n  vertical-align: middle;\n}\n.pe-table tr:hover td {\n  background: rgba(255, 255, 255, 0.02);\n}\n.pe-time-cell {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  min-width: 190px;\n}\n.pe-time-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n}\n.pe-time-date {\n  font-size: 0.8125rem;\n  font-weight: 600;\n  color: #f8fafc;\n  white-space: nowrap;\n}\n.pe-time-chip {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  padding: 2px 7px;\n  border-radius: 9999px;\n  font-size: 0.7rem;\n  font-weight: 600;\n  line-height: 1.2;\n  white-space: nowrap;\n}\n.pe-time-chip-good {\n  background: rgba(16, 185, 129, 0.12);\n  color: #34d399;\n  border: 1px solid rgba(16, 185, 129, 0.25);\n}\n.pe-time-chip-warning {\n  background: rgba(245, 158, 11, 0.12);\n  color: #fbbf24;\n  border: 1px solid rgba(245, 158, 11, 0.25);\n}\n.pe-time-chip-critical {\n  background: rgba(239, 68, 68, 0.14);\n  color: #f87171;\n  border: 1px solid rgba(239, 68, 68, 0.28);\n}\n.pe-time-chip-muted {\n  background: rgba(148, 163, 184, 0.1);\n  color: #94a3b8;\n  border: 1px solid rgba(148, 163, 184, 0.2);\n}\n.pe-progress-track {\n  width: 100%;\n  height: 6px;\n  background: rgba(255, 255, 255, 0.08);\n  border-radius: 9999px;\n  overflow: hidden;\n  position: relative;\n}\n.pe-progress-fill {\n  height: 100%;\n  border-radius: 9999px;\n  transition: width 0.35s ease, background 0.35s ease;\n}\n.pe-progress-fill-good {\n  background:\n    linear-gradient(\n      90deg,\n      #10b981,\n      #059669);\n  box-shadow: 0 0 6px rgba(16, 185, 129, 0.4);\n}\n.pe-progress-fill-warning {\n  background:\n    linear-gradient(\n      90deg,\n      #f59e0b,\n      #d97706);\n  box-shadow: 0 0 6px rgba(245, 158, 11, 0.4);\n}\n.pe-progress-fill-critical {\n  background:\n    linear-gradient(\n      90deg,\n      #ef4444,\n      #dc2626);\n  box-shadow: 0 0 6px rgba(239, 68, 68, 0.4);\n}\n.pe-preview-card {\n  background: rgba(15, 23, 42, 0.7);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 10px;\n  padding: 14px 16px;\n  margin: 14px 0;\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.pe-preview-title {\n  font-size: 0.72rem;\n  font-weight: 600;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n  color: var(--muted-foreground, #94a3b8);\n}\n.pe-preview-row {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n}\n.pe-badge {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  padding: 3px 8px;\n  border-radius: 9999px;\n  font-size: 0.72rem;\n  font-weight: 500;\n  line-height: 1;\n}\n.pe-badge-dot {\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n}\n.pe-badge-active {\n  background: rgba(34, 197, 94, 0.12);\n  color: #4ade80;\n  border: 1px solid rgba(34, 197, 94, 0.25);\n}\n.pe-badge-active .pe-badge-dot {\n  background: #22c55e;\n}\n.pe-badge-suspended {\n  background: rgba(239, 68, 68, 0.12);\n  color: #f87171;\n  border: 1px solid rgba(239, 68, 68, 0.25);\n}\n.pe-badge-suspended .pe-badge-dot {\n  background: #ef4444;\n}\n.pe-badge-scheduled {\n  background: rgba(234, 179, 8, 0.12);\n  color: #facc15;\n  border: 1px solid rgba(234, 179, 8, 0.25);\n}\n.pe-badge-scheduled .pe-badge-dot {\n  background: #eab308;\n}\n.pe-badge-terminated {\n  background: rgba(148, 163, 184, 0.12);\n  color: #94a3b8;\n  border: 1px solid rgba(148, 163, 184, 0.25);\n}\n.pe-badge-terminated .pe-badge-dot {\n  background: #64748b;\n}\n.pe-btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 6px;\n  padding: 7px 14px;\n  border-radius: 6px;\n  font-size: 0.8125rem;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.15s ease;\n  border: none;\n  outline: none;\n  white-space: nowrap;\n}\n.pe-btn-primary {\n  background: var(--primary, #6366f1);\n  color: #ffffff;\n}\n.pe-btn-primary:hover:not(:disabled) {\n  opacity: 0.92;\n  transform: translateY(-0.5px);\n}\n.pe-btn-secondary {\n  background: var(--muted, rgba(255, 255, 255, 0.08));\n  color: var(--foreground, #ffffff);\n  border: 1px solid var(--border, rgba(255, 255, 255, 0.1));\n}\n.pe-btn-secondary:hover:not(:disabled) {\n  background: rgba(255, 255, 255, 0.12);\n}\n.pe-btn-danger {\n  background: rgba(239, 68, 68, 0.15);\n  color: #f87171;\n  border: 1px solid rgba(239, 68, 68, 0.25);\n}\n.pe-btn-danger:hover:not(:disabled) {\n  background: rgba(239, 68, 68, 0.25);\n}\n.pe-btn-preset {\n  padding: 3px 8px;\n  font-size: 0.72rem;\n  font-weight: 500;\n  border-radius: 5px;\n  background: rgba(255, 255, 255, 0.06);\n  border: 1px solid rgba(255, 255, 255, 0.12);\n  color: #cbd5e1;\n  cursor: pointer;\n  transition: all 0.12s ease;\n}\n.pe-btn-preset:hover {\n  background: rgba(255, 255, 255, 0.12);\n  color: #ffffff;\n  border-color: rgba(255, 255, 255, 0.25);\n}\n.pe-modal-overlay {\n  position: fixed;\n  inset: 0;\n  z-index: 99999;\n  background: rgba(0, 0, 0, 0.65);\n  backdrop-filter: blur(6px);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 20px;\n}\n.pe-modal {\n  position: relative;\n  width: 100%;\n  max-width: 560px;\n  background: var(--card, #1e293b);\n  border: 1px solid var(--border, rgba(255, 255, 255, 0.1));\n  border-radius: 12px;\n  padding: 24px;\n  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5);\n  max-height: 92vh;\n  overflow-y: auto;\n}\n.pe-modal-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 18px;\n}\n.pe-form-group {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  margin-bottom: 16px;\n}\n.pe-form-label {\n  font-size: 0.8125rem;\n  font-weight: 500;\n  color: var(--muted-foreground, #94a3b8);\n}\n.pe-checkbox-label {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 0.8125rem;\n  color: var(--foreground, #e2e8f0);\n  cursor: pointer;\n  user-select: none;\n}\n.pe-spinner {\n  width: 16px;\n  height: 16px;\n  border: 2px solid rgba(255, 255, 255, 0.2);\n  border-top-color: #ffffff;\n  border-radius: 50%;\n  animation: pe-spin 0.6s linear infinite;\n  display: inline-block;\n}\n@keyframes pe-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.pe-console-banner {\n  width: 100%;\n  margin-bottom: 20px;\n  padding: 16px 20px;\n  border-radius: 12px;\n  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.4);\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  transition: all 0.2s ease;\n  box-sizing: border-box;\n}\n.pe-console-banner-good {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(16, 185, 129, 0.12),\n      rgba(15, 23, 42, 0.85));\n  border: 1px solid rgba(16, 185, 129, 0.35);\n}\n.pe-console-banner-warning {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(245, 158, 11, 0.14),\n      rgba(15, 23, 42, 0.85));\n  border: 1px solid rgba(245, 158, 11, 0.4);\n}\n.pe-console-banner-critical {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(239, 68, 68, 0.16),\n      rgba(15, 23, 42, 0.9));\n  border: 1px solid rgba(239, 68, 68, 0.45);\n  animation: pe-pulse-border 2.5s infinite;\n}\n@keyframes pe-pulse-border {\n  0%, 100% {\n    border-color: rgba(239, 68, 68, 0.45);\n  }\n  50% {\n    border-color: rgba(239, 68, 68, 0.8);\n    box-shadow: 0 0 15px rgba(239, 68, 68, 0.25);\n  }\n}\n.pe-console-banner-top {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  flex-wrap: wrap;\n}\n.pe-console-banner-title-wrap {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.pe-banner-icon-box {\n  width: 36px;\n  height: 36px;\n  border-radius: 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: rgba(255, 255, 255, 0.08);\n  color: #ffffff;\n  flex-shrink: 0;\n}\n.pe-console-banner-good .pe-banner-icon-box {\n  background: rgba(16, 185, 129, 0.2);\n  color: #34d399;\n}\n.pe-console-banner-warning .pe-banner-icon-box {\n  background: rgba(245, 158, 11, 0.2);\n  color: #fbbf24;\n}\n.pe-console-banner-critical .pe-banner-icon-box {\n  background: rgba(239, 68, 68, 0.2);\n  color: #f87171;\n}\n.pe-banner-headline {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  font-size: 0.9375rem;\n  font-weight: 600;\n  color: #ffffff;\n}\n.pe-banner-subline {\n  font-size: 0.8125rem;\n  color: var(--muted-foreground, #94a3b8);\n  margin-top: 2px;\n}\n.pe-banner-btn {\n  padding: 4px 10px;\n  font-size: 0.75rem;\n  border-radius: 6px;\n  background: rgba(255, 255, 255, 0.08);\n  border: 1px solid rgba(255, 255, 255, 0.12);\n  color: #cbd5e1;\n  cursor: pointer;\n  transition: all 0.15s ease;\n}\n.pe-banner-btn:hover {\n  background: rgba(255, 255, 255, 0.15);\n  color: #ffffff;\n}\n.pe-console-progress-wrap {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  margin-top: 2px;\n}\n.pe-console-progress-track {\n  width: 100%;\n  height: 8px;\n  background: rgba(0, 0, 0, 0.35);\n  border-radius: 9999px;\n  overflow: hidden;\n  position: relative;\n  border: 1px solid rgba(255, 255, 255, 0.06);\n}\n.pe-console-progress-fill {\n  height: 100%;\n  border-radius: 9999px;\n  transition: width 0.4s ease;\n}\n.pe-console-progress-fill-good {\n  background:\n    linear-gradient(\n      90deg,\n      #10b981,\n      #059669);\n  box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);\n}\n.pe-console-progress-fill-warning {\n  background:\n    linear-gradient(\n      90deg,\n      #f59e0b,\n      #d97706);\n  box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);\n}\n.pe-console-progress-fill-critical {\n  background:\n    linear-gradient(\n      90deg,\n      #ef4444,\n      #dc2626);\n  box-shadow: 0 0 10px rgba(239, 68, 68, 0.6);\n}\n.pe-console-progress-legend {\n  display: flex;\n  justify-content: space-between;\n  font-size: 0.75rem;\n  color: var(--muted-foreground, #94a3b8);\n}\n.pe-console-banner-extra {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  padding-top: 8px;\n  border-top: 1px solid rgba(255, 255, 255, 0.06);\n  font-size: 0.78125rem;\n}\n.pe-console-extra-item {\n  display: flex;\n  gap: 6px;\n  align-items: baseline;\n}\n.pe-extra-label {\n  font-weight: 600;\n  color: #e2e8f0;\n}\n.pe-extra-val {\n  color: #cbd5e1;\n}\n.pe-console-banner-mini {\n  width: 100%;\n  margin-bottom: 16px;\n  padding: 8px 14px;\n  border-radius: 8px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  background: rgba(15, 23, 42, 0.75);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n}\n.pe-console-banner-mini-good {\n  border-color: rgba(16, 185, 129, 0.3);\n}\n.pe-console-banner-mini-warning {\n  border-color: rgba(245, 158, 11, 0.35);\n}\n.pe-console-banner-mini-critical {\n  border-color: rgba(239, 68, 68, 0.4);\n}\n.pe-pulse-dot {\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  background: #eab308;\n  animation: pe-ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;\n}\n@keyframes pe-ping {\n  0% {\n    transform: scale(0.95);\n    opacity: 0.8;\n  }\n  50% {\n    transform: scale(1.3);\n    opacity: 1;\n  }\n  100% {\n    transform: scale(0.95);\n    opacity: 0.8;\n  }\n}\n";
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
import { useState as useState2, useEffect as useEffect2 } from "react";
import { useQuery as useQuery2, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@pterodactyl/sdk";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function computeTimeLeft(dateStr) {
  if (!dateStr) {
    return {
      hasDate: false,
      formattedDate: "None",
      formattedTimeLeft: "No date set",
      daysLeft: 0,
      hoursLeft: 0,
      minutesLeft: 0,
      isPastDue: false,
      percent: 100,
      urgency: "good"
    };
  }
  const target = new Date(dateStr);
  const targetMs = target.getTime();
  const now = Date.now();
  const diffMs = targetMs - now;
  const formattedDate = target.toLocaleDateString(void 0, {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }) + " " + target.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diffMs <= 0) {
    return {
      hasDate: true,
      formattedDate,
      formattedTimeLeft: "Past due (Pending)",
      daysLeft: 0,
      hoursLeft: 0,
      minutesLeft: 0,
      isPastDue: true,
      percent: 0,
      urgency: "critical"
    };
  }
  const totalMinutes = Math.floor(diffMs / (1e3 * 60));
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;
  let formattedTimeLeft = "";
  if (days > 0) {
    formattedTimeLeft = `${days}d ${hours}h left`;
  } else if (hours > 0) {
    formattedTimeLeft = `${hours}h ${minutes}m left`;
  } else {
    formattedTimeLeft = `${Math.max(1, minutes)}m left`;
  }
  let urgency = "good";
  if (days < 1) {
    urgency = "critical";
  } else if (days < 7) {
    urgency = "warning";
  } else {
    urgency = "good";
  }
  const maxMs = 30 * 24 * 60 * 60 * 1e3;
  const percent = Math.min(100, Math.max(6, Math.round(diffMs / maxMs * 100)));
  return {
    hasDate: true,
    formattedDate,
    formattedTimeLeft,
    daysLeft: days,
    hoursLeft: hours,
    minutesLeft: minutes,
    isPastDue: false,
    percent,
    urgency
  };
}
function SuspensionScreen() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState2("");
  const [nodeFilter, setNodeFilter] = useState2("all");
  const [statusFilter, setStatusFilter] = useState2("all");
  const [singleModalOpen, setSingleModalOpen] = useState2(false);
  const [selectedServerId, setSelectedServerId] = useState2(null);
  const [bulkModalOpen, setBulkModalOpen] = useState2(false);
  const [editSuspDate, setEditSuspDate] = useState2("");
  const [editTermDate, setEditTermDate] = useState2("");
  const [editNotify, setEditNotify] = useState2(true);
  const [editNotes, setEditNotes] = useState2("");
  const [serverFilterQuery, setServerFilterQuery] = useState2("");
  const [bulkSuspDate, setBulkSuspDate] = useState2("");
  const [bulkGraceDays, setBulkGraceDays] = useState2(7);
  const [bulkNotify, setBulkNotify] = useState2(true);
  const [selectedServerIds, setSelectedServerIds] = useState2([]);
  const overviewQuery = useQuery2({
    queryKey: ["admin-suspension-overview"],
    queryFn: async () => {
      const res = await fetch("/api/admin/extensions/server-suspension/overview");
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to load server suspension overview");
      }
      return res.json();
    },
    staleTime: 5e3,
    refetchOnWindowFocus: true
  });
  const servers = overviewQuery.data?.servers || [];
  useEffect2(() => {
    if (!selectedServerId && servers.length > 0) {
      setSelectedServerId(servers[0].id);
    }
  }, [servers, selectedServerId]);
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
  const openEdit = (server) => {
    setSelectedServerId(server.id);
    setEditSuspDate(server.suspension_date ? server.suspension_date.slice(0, 16) : "");
    setEditTermDate(server.termination_date ? server.termination_date.slice(0, 16) : "");
    setEditNotify(server.notify_user);
    setEditNotes(server.notes || "");
    setServerFilterQuery("");
    setSingleModalOpen(true);
  };
  const openScheduleNew = () => {
    setServerFilterQuery("");
    const targetServer = selectedServerId && servers.find((s) => s.id === selectedServerId) || servers[0];
    if (targetServer) {
      setSelectedServerId(targetServer.id);
      setEditSuspDate(targetServer.suspension_date ? targetServer.suspension_date.slice(0, 16) : "");
      setEditTermDate(targetServer.termination_date ? targetServer.termination_date.slice(0, 16) : "");
      setEditNotify(targetServer.notify_user);
      setEditNotes(targetServer.notes || "");
    } else {
      setEditSuspDate("");
      setEditTermDate("");
      setEditNotify(true);
      setEditNotes("");
    }
    setSingleModalOpen(true);
  };
  const selectTargetServerInModal = (id) => {
    setSelectedServerId(id);
    const target = servers.find((s) => s.id === id);
    if (target) {
      setEditSuspDate(target.suspension_date ? target.suspension_date.slice(0, 16) : "");
      setEditTermDate(target.termination_date ? target.termination_date.slice(0, 16) : "");
      setEditNotify(target.notify_user);
      setEditNotes(target.notes || "");
    }
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
  const modalFilteredServers = servers.filter((s) => {
    if (!serverFilterQuery.trim()) return true;
    const q = serverFilterQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.identifier.toLowerCase().includes(q) || s.owner.toLowerCase().includes(q) || s.owner_email.toLowerCase().includes(q);
  });
  const activeModalServer = servers.find((s) => s.id === selectedServerId);
  const modalPreviewTime = computeTimeLeft(editSuspDate || null);
  const modalPreviewTerm = computeTimeLeft(editTermDate || null);
  return /* @__PURE__ */ jsxs2("div", { className: "pe-container", children: [
    /* @__PURE__ */ jsxs2("div", { className: "pe-header", children: [
      /* @__PURE__ */ jsxs2("div", { className: "pe-title-wrap", children: [
        /* @__PURE__ */ jsx2("h2", { className: "pe-title", children: "Auto Server Suspension & Termination" }),
        /* @__PURE__ */ jsx2("p", { className: "pe-subtitle", children: "Manage automated expiration schedules, owner suspension notifications, and grace-period server termination." })
      ] }),
      /* @__PURE__ */ jsxs2("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsx2(
          "button",
          {
            type: "button",
            className: "pe-btn pe-btn-primary",
            onClick: openScheduleNew,
            children: "+ Set Suspension Date"
          }
        ),
        /* @__PURE__ */ jsxs2(
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
        /* @__PURE__ */ jsx2(
          "button",
          {
            type: "button",
            className: "pe-btn pe-btn-secondary",
            disabled: processDueMutation.isPending,
            onClick: () => processDueMutation.mutate(),
            children: processDueMutation.isPending ? /* @__PURE__ */ jsx2("span", { className: "pe-spinner" }) : "Process Due Schedules"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs2("div", { className: "pe-stats-row", children: [
      /* @__PURE__ */ jsxs2("div", { className: "pe-stat-card", children: [
        /* @__PURE__ */ jsx2("span", { className: "pe-stat-val", children: overviewQuery.data?.stats.total ?? 0 }),
        /* @__PURE__ */ jsx2("span", { className: "pe-stat-label", children: "Total Servers" })
      ] }),
      /* @__PURE__ */ jsxs2("div", { className: "pe-stat-card", children: [
        /* @__PURE__ */ jsx2("span", { className: "pe-stat-val", style: { color: "#facc15" }, children: overviewQuery.data?.stats.scheduled ?? 0 }),
        /* @__PURE__ */ jsx2("span", { className: "pe-stat-label", children: "Scheduled for Suspension" })
      ] }),
      /* @__PURE__ */ jsxs2("div", { className: "pe-stat-card", children: [
        /* @__PURE__ */ jsx2("span", { className: "pe-stat-val", style: { color: "#f87171" }, children: overviewQuery.data?.stats.suspended ?? 0 }),
        /* @__PURE__ */ jsx2("span", { className: "pe-stat-label", children: "Currently Suspended" })
      ] }),
      /* @__PURE__ */ jsxs2("div", { className: "pe-stat-card", children: [
        /* @__PURE__ */ jsx2("span", { className: "pe-stat-val", style: { color: "#94a3b8" }, children: overviewQuery.data?.stats.terminated ?? 0 }),
        /* @__PURE__ */ jsx2("span", { className: "pe-stat-label", children: "Terminated" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs2("div", { className: "pe-toolbar", children: [
      /* @__PURE__ */ jsxs2("div", { className: "pe-input-box", children: [
        /* @__PURE__ */ jsxs2("svg", { className: "pe-input-icon", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
          /* @__PURE__ */ jsx2("circle", { cx: "11", cy: "11", r: "8" }),
          /* @__PURE__ */ jsx2("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
        ] }),
        /* @__PURE__ */ jsx2(
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
      /* @__PURE__ */ jsxs2(
        "select",
        {
          className: "pe-select",
          value: nodeFilter,
          onChange: (e) => setNodeFilter(e.target.value),
          children: [
            /* @__PURE__ */ jsx2("option", { value: "all", children: "All Nodes" }),
            overviewQuery.data?.nodes?.map((n) => /* @__PURE__ */ jsx2("option", { value: n.id, children: n.name }, n.id))
          ]
        }
      ),
      /* @__PURE__ */ jsxs2(
        "select",
        {
          className: "pe-select",
          value: statusFilter,
          onChange: (e) => setStatusFilter(e.target.value),
          children: [
            /* @__PURE__ */ jsx2("option", { value: "all", children: "All Statuses" }),
            /* @__PURE__ */ jsx2("option", { value: "active", children: "Active" }),
            /* @__PURE__ */ jsx2("option", { value: "scheduled", children: "Scheduled" }),
            /* @__PURE__ */ jsx2("option", { value: "suspended", children: "Suspended" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx2("div", { className: "pe-table-card", children: /* @__PURE__ */ jsxs2("table", { className: "pe-table", children: [
      /* @__PURE__ */ jsx2("thead", { children: /* @__PURE__ */ jsxs2("tr", { children: [
        /* @__PURE__ */ jsx2("th", { style: { width: 40, textAlign: "center" }, children: /* @__PURE__ */ jsx2(
          "input",
          {
            type: "checkbox",
            checked: filteredServers.length > 0 && selectedServerIds.length === filteredServers.length,
            onChange: selectAllFiltered
          }
        ) }),
        /* @__PURE__ */ jsx2("th", { children: "Server" }),
        /* @__PURE__ */ jsx2("th", { children: "Node / Owner" }),
        /* @__PURE__ */ jsx2("th", { children: "Status" }),
        /* @__PURE__ */ jsx2("th", { style: { minWidth: 220 }, children: "Suspension Date & Time Left" }),
        /* @__PURE__ */ jsx2("th", { style: { minWidth: 200 }, children: "Termination Grace" }),
        /* @__PURE__ */ jsx2("th", { style: { textAlign: "right" }, children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx2("tbody", { children: overviewQuery.isLoading ? /* @__PURE__ */ jsx2("tr", { children: /* @__PURE__ */ jsxs2("td", { colSpan: 7, style: { textAlign: "center", padding: "36px 0" }, children: [
        /* @__PURE__ */ jsx2("span", { className: "pe-spinner" }),
        /* @__PURE__ */ jsx2("p", { className: "pe-subtitle", style: { marginTop: 8 }, children: "Loading panel servers..." })
      ] }) }) : filteredServers.length === 0 ? /* @__PURE__ */ jsx2("tr", { children: /* @__PURE__ */ jsx2("td", { colSpan: 7, style: { textAlign: "center", padding: "36px 0" }, children: /* @__PURE__ */ jsx2("p", { className: "pe-subtitle", children: "No matching servers found on panel." }) }) }) : filteredServers.map((server) => {
        const isSuspended = server.server_status === "suspended";
        const hasSchedule = Boolean(server.suspension_date);
        const suspTimeInfo = computeTimeLeft(server.suspension_date);
        const termTimeInfo = computeTimeLeft(server.termination_date);
        return /* @__PURE__ */ jsxs2("tr", { children: [
          /* @__PURE__ */ jsx2("td", { style: { textAlign: "center" }, children: /* @__PURE__ */ jsx2(
            "input",
            {
              type: "checkbox",
              checked: selectedServerIds.includes(server.id),
              onChange: () => toggleSelectServer(server.id)
            }
          ) }),
          /* @__PURE__ */ jsxs2("td", { children: [
            /* @__PURE__ */ jsx2("div", { style: { fontWeight: 600 }, children: server.name }),
            /* @__PURE__ */ jsx2("div", { style: { fontSize: "0.72rem", color: "var(--muted-foreground, #94a3b8)", fontFamily: "monospace" }, children: server.identifier })
          ] }),
          /* @__PURE__ */ jsxs2("td", { children: [
            /* @__PURE__ */ jsx2("div", { style: { fontSize: "0.8125rem" }, children: server.node }),
            /* @__PURE__ */ jsxs2("div", { style: { fontSize: "0.72rem", color: "var(--muted-foreground, #94a3b8)" }, children: [
              server.owner,
              " (",
              server.owner_email,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsx2("td", { children: isSuspended ? /* @__PURE__ */ jsxs2("span", { className: "pe-badge pe-badge-suspended", children: [
            /* @__PURE__ */ jsx2("span", { className: "pe-badge-dot" }),
            "Suspended"
          ] }) : hasSchedule ? /* @__PURE__ */ jsxs2("span", { className: "pe-badge pe-badge-scheduled", children: [
            /* @__PURE__ */ jsx2("span", { className: "pe-badge-dot" }),
            "Scheduled"
          ] }) : /* @__PURE__ */ jsxs2("span", { className: "pe-badge pe-badge-active", children: [
            /* @__PURE__ */ jsx2("span", { className: "pe-badge-dot" }),
            "Active"
          ] }) }),
          /* @__PURE__ */ jsx2("td", { children: suspTimeInfo.hasDate ? /* @__PURE__ */ jsxs2("div", { className: "pe-time-cell", children: [
            /* @__PURE__ */ jsxs2("div", { className: "pe-time-header", children: [
              /* @__PURE__ */ jsx2("span", { className: "pe-time-date", children: suspTimeInfo.formattedDate }),
              /* @__PURE__ */ jsx2("span", { className: `pe-time-chip pe-time-chip-${suspTimeInfo.urgency}`, children: suspTimeInfo.formattedTimeLeft })
            ] }),
            /* @__PURE__ */ jsx2(
              "div",
              {
                className: "pe-progress-track",
                title: `Suspension due: ${suspTimeInfo.formattedDate} (${suspTimeInfo.formattedTimeLeft})`,
                children: /* @__PURE__ */ jsx2(
                  "div",
                  {
                    className: `pe-progress-fill pe-progress-fill-${suspTimeInfo.urgency}`,
                    style: { width: `${suspTimeInfo.percent}%` }
                  }
                )
              }
            )
          ] }) : /* @__PURE__ */ jsx2("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: /* @__PURE__ */ jsx2("span", { className: "pe-time-chip pe-time-chip-muted", children: "No Expiration Set" }) }) }),
          /* @__PURE__ */ jsx2("td", { children: termTimeInfo.hasDate ? /* @__PURE__ */ jsxs2("div", { className: "pe-time-cell", children: [
            /* @__PURE__ */ jsxs2("div", { className: "pe-time-header", children: [
              /* @__PURE__ */ jsx2("span", { className: "pe-time-date", style: { color: "#f87171" }, children: termTimeInfo.formattedDate }),
              /* @__PURE__ */ jsx2("span", { className: `pe-time-chip pe-time-chip-${termTimeInfo.urgency}`, children: termTimeInfo.formattedTimeLeft })
            ] }),
            /* @__PURE__ */ jsx2(
              "div",
              {
                className: "pe-progress-track",
                title: `Termination: ${termTimeInfo.formattedDate} (${termTimeInfo.formattedTimeLeft})`,
                children: /* @__PURE__ */ jsx2(
                  "div",
                  {
                    className: `pe-progress-fill pe-progress-fill-${termTimeInfo.urgency}`,
                    style: { width: `${termTimeInfo.percent}%` }
                  }
                )
              }
            )
          ] }) : /* @__PURE__ */ jsx2("span", { style: { fontSize: "0.75rem", color: "var(--muted-foreground, #64748b)" }, children: "None" }) }),
          /* @__PURE__ */ jsx2("td", { children: /* @__PURE__ */ jsxs2("div", { style: { display: "flex", gap: 6, justifyContent: "flex-end", alignItems: "center" }, children: [
            /* @__PURE__ */ jsx2(
              "button",
              {
                type: "button",
                className: "pe-btn pe-btn-primary",
                style: { padding: "6px 12px", fontSize: "0.8125rem", fontWeight: 600 },
                onClick: () => openEdit(server),
                children: hasSchedule ? "Edit Expiration" : "Set Suspension Date"
              }
            ),
            hasSchedule && /* @__PURE__ */ jsx2(
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
            isSuspended ? /* @__PURE__ */ jsx2(
              "button",
              {
                type: "button",
                className: "pe-btn pe-btn-secondary",
                style: { padding: "6px 10px", fontSize: "0.75rem" },
                disabled: actionMutation.isPending,
                onClick: () => actionMutation.mutate({ server_id: server.id, action: "unsuspend" }),
                children: "Unsuspend"
              }
            ) : /* @__PURE__ */ jsx2(
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
    singleModalOpen && /* @__PURE__ */ jsx2("div", { className: "pe-modal-overlay", onClick: () => setSingleModalOpen(false), children: /* @__PURE__ */ jsxs2("div", { className: "pe-modal", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs2("div", { className: "pe-modal-header", children: [
        /* @__PURE__ */ jsx2("h3", { className: "pe-title", style: { fontSize: "1.1rem" }, children: "Schedule Server Suspension & Expiration" }),
        /* @__PURE__ */ jsx2(
          "button",
          {
            type: "button",
            style: { background: "transparent", border: "none", color: "#94a3b8", fontSize: "1.4rem", cursor: "pointer" },
            onClick: () => setSingleModalOpen(false),
            children: "\xD7"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs2("div", { className: "pe-form-group", children: [
        /* @__PURE__ */ jsxs2("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
          /* @__PURE__ */ jsx2("label", { className: "pe-form-label", children: "Select Target Server" }),
          /* @__PURE__ */ jsxs2("span", { style: { fontSize: "0.72rem", color: "#94a3b8" }, children: [
            servers.length,
            " servers available"
          ] })
        ] }),
        /* @__PURE__ */ jsx2(
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
        /* @__PURE__ */ jsxs2(
          "select",
          {
            className: "pe-select",
            style: { width: "100%" },
            value: selectedServerId ?? "",
            onChange: (e) => selectTargetServerInModal(Number(e.target.value)),
            children: [
              overviewQuery.isLoading && /* @__PURE__ */ jsx2("option", { value: "", children: "Loading servers..." }),
              !overviewQuery.isLoading && servers.length === 0 && /* @__PURE__ */ jsx2("option", { value: "", children: "No servers available on panel" }),
              !overviewQuery.isLoading && servers.length > 0 && modalFilteredServers.length === 0 && /* @__PURE__ */ jsx2("option", { value: "", children: "No servers matching filter" }),
              modalFilteredServers.map((s) => /* @__PURE__ */ jsxs2("option", { value: s.id, children: [
                s.name,
                " (",
                s.identifier,
                ") - Owner: ",
                s.owner
              ] }, s.id))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs2("div", { className: "pe-form-group", children: [
        /* @__PURE__ */ jsxs2("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }, children: [
          /* @__PURE__ */ jsx2("label", { className: "pe-form-label", style: { marginBottom: 0 }, children: "Suspension Date & Time" }),
          /* @__PURE__ */ jsxs2("div", { style: { display: "flex", gap: 4 }, children: [
            /* @__PURE__ */ jsx2("button", { type: "button", className: "pe-btn-preset", onClick: () => setSuspensionDays(3), children: "+3d" }),
            /* @__PURE__ */ jsx2("button", { type: "button", className: "pe-btn-preset", onClick: () => setSuspensionDays(7), children: "+7d" }),
            /* @__PURE__ */ jsx2("button", { type: "button", className: "pe-btn-preset", onClick: () => setSuspensionDays(14), children: "+14d" }),
            /* @__PURE__ */ jsx2("button", { type: "button", className: "pe-btn-preset", onClick: () => setSuspensionDays(30), children: "+30d" }),
            /* @__PURE__ */ jsx2("button", { type: "button", className: "pe-btn-preset", onClick: () => setSuspensionDays(60), children: "+60d" })
          ] })
        ] }),
        /* @__PURE__ */ jsx2(
          "input",
          {
            type: "datetime-local",
            className: "pe-input",
            value: editSuspDate,
            onChange: (e) => setEditSuspDate(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxs2("div", { className: "pe-form-group", children: [
        /* @__PURE__ */ jsxs2("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }, children: [
          /* @__PURE__ */ jsx2("label", { className: "pe-form-label", style: { marginBottom: 0 }, children: "Permanent Termination Date (Optional)" }),
          /* @__PURE__ */ jsxs2("div", { style: { display: "flex", gap: 4 }, children: [
            /* @__PURE__ */ jsx2("button", { type: "button", className: "pe-btn-preset", onClick: () => setTerminationGrace(3), children: "+3d Grace" }),
            /* @__PURE__ */ jsx2("button", { type: "button", className: "pe-btn-preset", onClick: () => setTerminationGrace(7), children: "+7d Grace" }),
            /* @__PURE__ */ jsx2("button", { type: "button", className: "pe-btn-preset", onClick: () => setTerminationGrace(14), children: "+14d Grace" }),
            /* @__PURE__ */ jsx2("button", { type: "button", className: "pe-btn-preset", onClick: () => setEditTermDate(""), children: "Clear" })
          ] })
        ] }),
        /* @__PURE__ */ jsx2(
          "input",
          {
            type: "datetime-local",
            className: "pe-input",
            value: editTermDate,
            onChange: (e) => setEditTermDate(e.target.value)
          }
        )
      ] }),
      editSuspDate && /* @__PURE__ */ jsxs2("div", { className: "pe-preview-card", children: [
        /* @__PURE__ */ jsx2("div", { className: "pe-preview-title", children: "Schedule Timeline & Countdown" }),
        /* @__PURE__ */ jsxs2("div", { className: "pe-preview-row", children: [
          /* @__PURE__ */ jsxs2("div", { children: [
            /* @__PURE__ */ jsx2("span", { style: { fontSize: "0.84rem", fontWeight: 600, color: "#ffffff" }, children: activeModalServer ? activeModalServer.name : "Selected Server" }),
            /* @__PURE__ */ jsxs2("span", { style: { fontSize: "0.72rem", color: "#94a3b8", marginLeft: 6 }, children: [
              "will suspend on ",
              modalPreviewTime.formattedDate
            ] })
          ] }),
          /* @__PURE__ */ jsx2("span", { className: `pe-time-chip pe-time-chip-${modalPreviewTime.urgency}`, children: modalPreviewTime.formattedTimeLeft })
        ] }),
        /* @__PURE__ */ jsx2("div", { className: "pe-progress-track", title: modalPreviewTime.formattedTimeLeft, children: /* @__PURE__ */ jsx2(
          "div",
          {
            className: `pe-progress-fill pe-progress-fill-${modalPreviewTime.urgency}`,
            style: { width: `${modalPreviewTime.percent}%` }
          }
        ) }),
        editTermDate && /* @__PURE__ */ jsxs2("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginTop: 4, color: "#f87171" }, children: [
          /* @__PURE__ */ jsxs2("span", { children: [
            "Grace Period Termination: ",
            modalPreviewTerm.formattedDate
          ] }),
          /* @__PURE__ */ jsx2("span", { children: modalPreviewTerm.formattedTimeLeft })
        ] })
      ] }),
      /* @__PURE__ */ jsx2("div", { className: "pe-form-group", children: /* @__PURE__ */ jsxs2("label", { className: "pe-checkbox-label", children: [
        /* @__PURE__ */ jsx2(
          "input",
          {
            type: "checkbox",
            checked: editNotify,
            onChange: (e) => setEditNotify(e.target.checked)
          }
        ),
        /* @__PURE__ */ jsx2("span", { children: "Send automated email notification to server owner upon suspension" })
      ] }) }),
      /* @__PURE__ */ jsxs2("div", { className: "pe-form-group", children: [
        /* @__PURE__ */ jsx2("label", { className: "pe-form-label", children: "Internal Notes / Reason" }),
        /* @__PURE__ */ jsx2(
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
      /* @__PURE__ */ jsxs2("div", { style: { display: "flex", justifyContent: "space-between", marginTop: 20 }, children: [
        selectedServerId && activeModalServer?.suspension_date ? /* @__PURE__ */ jsx2(
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
        ) : /* @__PURE__ */ jsx2("div", {}),
        /* @__PURE__ */ jsxs2("div", { style: { display: "flex", gap: 8 }, children: [
          /* @__PURE__ */ jsx2(
            "button",
            {
              type: "button",
              className: "pe-btn pe-btn-secondary",
              onClick: () => setSingleModalOpen(false),
              children: "Close"
            }
          ),
          /* @__PURE__ */ jsx2(
            "button",
            {
              type: "button",
              className: "pe-btn pe-btn-primary",
              disabled: updateScheduleMutation.isPending || !selectedServerId,
              onClick: () => {
                if (!selectedServerId) {
                  toast.error("Please select a target server first");
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
              children: updateScheduleMutation.isPending ? /* @__PURE__ */ jsx2("span", { className: "pe-spinner" }) : "Save Schedule"
            }
          )
        ] })
      ] })
    ] }) }),
    bulkModalOpen && /* @__PURE__ */ jsx2("div", { className: "pe-modal-overlay", onClick: () => setBulkModalOpen(false), children: /* @__PURE__ */ jsxs2("div", { className: "pe-modal", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs2("div", { className: "pe-modal-header", children: [
        /* @__PURE__ */ jsxs2("h3", { className: "pe-title", style: { fontSize: "1.1rem" }, children: [
          "Bulk Schedule Servers (",
          selectedServerIds.length > 0 ? selectedServerIds.length : filteredServers.length,
          " servers)"
        ] }),
        /* @__PURE__ */ jsx2(
          "button",
          {
            type: "button",
            style: { background: "transparent", border: "none", color: "#94a3b8", fontSize: "1.4rem", cursor: "pointer" },
            onClick: () => setBulkModalOpen(false),
            children: "\xD7"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs2("div", { className: "pe-form-group", children: [
        /* @__PURE__ */ jsx2("label", { className: "pe-form-label", children: "Suspension Date & Time" }),
        /* @__PURE__ */ jsx2(
          "input",
          {
            type: "datetime-local",
            className: "pe-input",
            value: bulkSuspDate,
            onChange: (e) => setBulkSuspDate(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxs2("div", { className: "pe-form-group", children: [
        /* @__PURE__ */ jsx2("label", { className: "pe-form-label", children: "Grace Period Before Termination (Days after suspension)" }),
        /* @__PURE__ */ jsx2(
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
      /* @__PURE__ */ jsx2("div", { className: "pe-form-group", children: /* @__PURE__ */ jsxs2("label", { className: "pe-checkbox-label", children: [
        /* @__PURE__ */ jsx2(
          "input",
          {
            type: "checkbox",
            checked: bulkNotify,
            onChange: (e) => setBulkNotify(e.target.checked)
          }
        ),
        /* @__PURE__ */ jsx2("span", { children: "Notify server owners via email upon suspension" })
      ] }) }),
      /* @__PURE__ */ jsxs2("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }, children: [
        /* @__PURE__ */ jsx2(
          "button",
          {
            type: "button",
            className: "pe-btn pe-btn-secondary",
            onClick: () => setBulkModalOpen(false),
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx2(
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
            children: bulkScheduleMutation.isPending ? /* @__PURE__ */ jsx2("span", { className: "pe-spinner" }) : "Apply Bulk Schedule"
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

// src/client/components/ServerSuspensionBanner.tsx
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCurrentServerRequired } from "@pterodactyl/sdk";
import { jsx, jsxs } from "react/jsx-runtime";
function computeTime(dateStr) {
  const target = new Date(dateStr);
  const targetMs = target.getTime();
  const now = Date.now();
  const diffMs = targetMs - now;
  const formattedDate = target.toLocaleDateString(void 0, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  }) + " at " + target.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diffMs <= 0) {
    return {
      formattedDate,
      formattedTimeLeft: "Past due / Pending suspension",
      daysLeft: 0,
      hoursLeft: 0,
      minutesLeft: 0,
      isPastDue: true,
      percent: 0,
      urgency: "critical"
    };
  }
  const totalMinutes = Math.floor(diffMs / (1e3 * 60));
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;
  let formattedTimeLeft = "";
  if (days > 0) {
    formattedTimeLeft = `${days} day${days > 1 ? "s" : ""}, ${hours} hr${hours !== 1 ? "s" : ""} left`;
  } else if (hours > 0) {
    formattedTimeLeft = `${hours} hr${hours !== 1 ? "s" : ""}, ${minutes} min remaining`;
  } else {
    formattedTimeLeft = `${Math.max(1, minutes)} min remaining`;
  }
  let urgency = "good";
  if (days < 1) {
    urgency = "critical";
  } else if (days < 7) {
    urgency = "warning";
  } else {
    urgency = "good";
  }
  const maxMs = 30 * 24 * 60 * 60 * 1e3;
  const percent = Math.min(100, Math.max(5, Math.round(diffMs / maxMs * 100)));
  return {
    formattedDate,
    formattedTimeLeft,
    daysLeft: days,
    hoursLeft: hours,
    minutesLeft: minutes,
    isPastDue: false,
    percent,
    urgency
  };
}
function ServerSuspensionBanner() {
  let serverIdentifier = "";
  try {
    const s = useCurrentServerRequired();
    serverIdentifier = s?.attributes?.identifier || s?.identifier || "";
  } catch {
    const match = window.location.pathname.match(/\/server\/([a-zA-Z0-9_\-]+)/);
    if (match) serverIdentifier = match[1];
  }
  const [collapsed, setCollapsed] = useState(false);
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 3e4);
    return () => clearInterval(timer);
  }, []);
  const statusQuery = useQuery({
    queryKey: ["server-suspension-status", serverIdentifier],
    queryFn: async () => {
      if (!serverIdentifier) return { scheduled: false };
      try {
        const res = await fetch(`/api/client/servers/${serverIdentifier}/extensions/server-suspension/status`);
        if (res.ok) return res.json();
      } catch {
      }
      try {
        const res2 = await fetch(`/api/client/extensions/server-suspension/server/${serverIdentifier}/status`);
        if (res2.ok) return res2.json();
      } catch {
      }
      return { scheduled: false };
    },
    enabled: Boolean(serverIdentifier),
    refetchInterval: 6e4
  });
  const data = statusQuery.data;
  if (!data || !data.scheduled || !data.suspension_date) {
    return null;
  }
  const suspInfo = computeTime(data.suspension_date);
  const termInfo = data.termination_date ? computeTime(data.termination_date) : null;
  if (collapsed) {
    return /* @__PURE__ */ jsxs("div", { className: `pe-console-banner-mini pe-console-banner-mini-${suspInfo.urgency}`, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
        /* @__PURE__ */ jsx("span", { className: "pe-pulse-dot" }),
        /* @__PURE__ */ jsxs("span", { style: { fontWeight: 600, fontSize: "0.8125rem" }, children: [
          "Suspension scheduled: ",
          suspInfo.formattedDate
        ] }),
        /* @__PURE__ */ jsx("span", { className: `pe-time-chip pe-time-chip-${suspInfo.urgency}`, children: suspInfo.formattedTimeLeft })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "pe-banner-btn",
          onClick: () => setCollapsed(false),
          children: "Show Details"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: `pe-console-banner pe-console-banner-${suspInfo.urgency}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "pe-console-banner-top", children: [
      /* @__PURE__ */ jsxs("div", { className: "pe-console-banner-title-wrap", children: [
        /* @__PURE__ */ jsx("div", { className: "pe-banner-icon-box", children: /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
          /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
          /* @__PURE__ */ jsx("polyline", { points: "12 6 12 12 16 14" })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "pe-banner-headline", children: [
            /* @__PURE__ */ jsx("span", { children: "Scheduled Server Suspension" }),
            /* @__PURE__ */ jsx("span", { className: `pe-time-chip pe-time-chip-${suspInfo.urgency}`, children: suspInfo.formattedTimeLeft })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pe-banner-subline", children: [
            "This server is scheduled to suspend on ",
            /* @__PURE__ */ jsx("strong", { children: suspInfo.formattedDate })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "pe-banner-btn",
          onClick: () => setCollapsed(true),
          title: "Minimize notice",
          children: "Minimize"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pe-console-progress-wrap", children: [
      /* @__PURE__ */ jsx("div", { className: "pe-console-progress-track", children: /* @__PURE__ */ jsx(
        "div",
        {
          className: `pe-console-progress-fill pe-console-progress-fill-${suspInfo.urgency}`,
          style: { width: `${suspInfo.percent}%` }
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "pe-console-progress-legend", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          "Time remaining: ",
          suspInfo.formattedTimeLeft
        ] }),
        /* @__PURE__ */ jsxs("span", { children: [
          "Suspension: ",
          suspInfo.formattedDate
        ] })
      ] })
    ] }),
    (termInfo || data.notes) && /* @__PURE__ */ jsxs("div", { className: "pe-console-banner-extra", children: [
      termInfo && /* @__PURE__ */ jsxs("div", { className: "pe-console-extra-item", children: [
        /* @__PURE__ */ jsx("span", { className: "pe-extra-label", children: "Grace Period Termination:" }),
        /* @__PURE__ */ jsxs("span", { className: "pe-extra-val", style: { color: "#f87171" }, children: [
          "Permanent data deletion scheduled for ",
          termInfo.formattedDate,
          " (",
          termInfo.formattedTimeLeft,
          ")"
        ] })
      ] }),
      data.notes && /* @__PURE__ */ jsxs("div", { className: "pe-console-extra-item", children: [
        /* @__PURE__ */ jsx("span", { className: "pe-extra-label", children: "Note:" }),
        /* @__PURE__ */ jsx("span", { className: "pe-extra-val", children: data.notes })
      ] })
    ] })
  ] });
}

// src/client/index.tsx
var index_default = definePterodactylExtension({
  setup({ screens, slots }) {
    screens.register("admin-suspension", () => Promise.resolve().then(() => (init_SuspensionScreen(), SuspensionScreen_exports)));
    slots.register("server.console.before", ServerSuspensionBanner);
  }
});
export {
  index_default as default
};
