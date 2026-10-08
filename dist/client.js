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
                style.textContent = "/* src/client/styles.css */\n.pe-container {\n  width: 100%;\n  margin: 0 auto;\n  padding-top: 24px;\n  padding-bottom: 32px;\n  font-family: inherit;\n  color: var(--foreground, #f8fafc);\n  box-sizing: border-box;\n}\n.pe-container *,\n.pe-container *::before,\n.pe-container *::after {\n  box-sizing: border-box;\n}\n.pe-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 16px;\n  margin-bottom: 24px;\n  flex-wrap: wrap;\n}\n.pe-title-wrap {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.pe-title {\n  font-size: 1.25rem;\n  font-weight: 600;\n  color: var(--foreground, #ffffff);\n  margin: 0;\n  letter-spacing: -0.015em;\n}\n.pe-subtitle {\n  font-size: 0.8125rem;\n  color: var(--muted-foreground, #94a3b8);\n  margin: 0;\n}\n.pe-stats-row {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 14px;\n  margin-bottom: 24px;\n}\n.pe-stat-card {\n  background: var(--card, rgba(30, 41, 59, 0.45));\n  border: 1px solid var(--border, rgba(255, 255, 255, 0.08));\n  border-radius: 10px;\n  padding: 16px 20px;\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.pe-stat-val {\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: var(--foreground, #ffffff);\n  line-height: 1.2;\n}\n.pe-stat-label {\n  font-size: 0.75rem;\n  font-weight: 500;\n  color: var(--muted-foreground, #94a3b8);\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n}\n.pe-toolbar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  margin-bottom: 18px;\n  flex-wrap: wrap;\n}\n.pe-input-box {\n  position: relative;\n  flex: 1;\n  min-width: 240px;\n}\n.pe-input {\n  width: 100%;\n  padding: 8px 14px 8px 36px;\n  background: var(--input, rgba(15, 23, 42, 0.6));\n  border: 1px solid var(--border, rgba(255, 255, 255, 0.1));\n  border-radius: 8px;\n  color: var(--foreground, #f8fafc);\n  font-size: 0.84375rem;\n  outline: none;\n  transition: border-color 0.15s ease, box-shadow 0.15s ease;\n}\n.pe-input:focus {\n  border-color: var(--ring, #6366f1);\n  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15);\n}\n.pe-input-icon {\n  position: absolute;\n  left: 11px;\n  top: 50%;\n  transform: translateY(-50%);\n  width: 15px;\n  height: 15px;\n  color: var(--muted-foreground, #64748b);\n  pointer-events: none;\n}\n.pe-select {\n  padding: 8px 12px;\n  background: var(--input, rgba(15, 23, 42, 0.6));\n  border: 1px solid var(--border, rgba(255, 255, 255, 0.1));\n  border-radius: 8px;\n  color: var(--foreground, #f8fafc);\n  font-size: 0.84375rem;\n  outline: none;\n  cursor: pointer;\n}\n.pe-select:focus {\n  border-color: var(--ring, #6366f1);\n}\n.pe-table-card {\n  background: var(--card, rgba(30, 41, 59, 0.45));\n  border: 1px solid var(--border, rgba(255, 255, 255, 0.08));\n  border-radius: 10px;\n  overflow-x: auto;\n  overflow-y: hidden;\n  position: relative;\n  max-width: 100%;\n  cursor: default;\n  scrollbar-width: thin;\n  scrollbar-color: #6366f1 rgba(15, 23, 42, 0.8);\n  -webkit-overflow-scrolling: touch;\n}\n.pe-table-card.pe-table-dragging {\n  cursor: grabbing !important;\n  user-select: none;\n}\n.pe-table-card::-webkit-scrollbar {\n  height: 10px;\n  display: block;\n}\n.pe-table-card::-webkit-scrollbar-track {\n  background: rgba(15, 23, 42, 0.85);\n  border-radius: 6px;\n  margin: 0 4px;\n}\n.pe-table-card::-webkit-scrollbar-thumb {\n  background: #6366f1;\n  border-radius: 6px;\n  border: 2px solid rgba(15, 23, 42, 0.85);\n}\n.pe-table-card::-webkit-scrollbar-thumb:hover {\n  background: #818cf8;\n}\n.pe-table {\n  width: 100%;\n  min-width: 1100px;\n  border-collapse: separate;\n  border-spacing: 0;\n  font-size: 0.84375rem;\n  text-align: left;\n}\n.pe-table th {\n  padding: 12px 16px;\n  background: #111726;\n  color: var(--muted-foreground, #94a3b8);\n  font-weight: 600;\n  font-size: 0.75rem;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n  border-bottom: 1px solid var(--border, rgba(255, 255, 255, 0.08));\n  white-space: nowrap;\n}\n.pe-table td {\n  padding: 12px 16px;\n  border-bottom: 1px solid var(--border, rgba(255, 255, 255, 0.04));\n  background: rgba(21, 29, 45, 0.6);\n  color: var(--foreground, #e2e8f0);\n  vertical-align: middle;\n}\n.pe-table tr:hover td {\n  background: rgba(30, 41, 59, 0.75);\n}\n.pe-table th.pe-col-sticky-right {\n  position: sticky;\n  right: 0;\n  z-index: 25;\n  background: #0f172a;\n  box-shadow: -8px 0 16px -4px rgba(0, 0, 0, 0.6);\n}\n.pe-table td.pe-col-sticky-right {\n  position: sticky;\n  right: 0;\n  z-index: 15;\n  background: #131b2e;\n  box-shadow: -8px 0 16px -4px rgba(0, 0, 0, 0.6);\n}\n.pe-table tr:hover td.pe-col-sticky-right {\n  background: #1c273e;\n}\n.pe-actions-wrap {\n  display: flex;\n  gap: 6px;\n  justify-content: flex-end;\n  align-items: center;\n  white-space: nowrap;\n}\n.pe-btn-sm {\n  padding: 6px 12px;\n  font-size: 0.8125rem;\n  font-weight: 600;\n}\n.pe-table-meta-bar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  padding: 9px 14px;\n  margin-bottom: 8px;\n  background: rgba(15, 23, 42, 0.5);\n  border: 1px solid rgba(255, 255, 255, 0.07);\n  border-radius: 8px;\n  font-size: 0.8125rem;\n  color: var(--muted-foreground, #94a3b8);\n}\n.pe-table-meta-count strong {\n  color: #f8fafc;\n}\n.pe-table-scroll-controls {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.pe-scroll-hint {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  font-size: 0.75rem;\n  color: #94a3b8;\n}\n.pe-scroll-btn {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  padding: 4px 10px;\n  background: rgba(30, 41, 59, 0.85);\n  border: 1px solid rgba(255, 255, 255, 0.12);\n  border-radius: 6px;\n  color: #e2e8f0;\n  font-size: 0.75rem;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.15s ease;\n}\n.pe-scroll-btn:hover {\n  background: rgba(99, 102, 241, 0.25);\n  border-color: #6366f1;\n  color: #ffffff;\n}\n.pe-quick-edit-btn {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  padding: 3px 8px;\n  background: rgba(99, 102, 241, 0.15);\n  border: 1px solid rgba(99, 102, 241, 0.35);\n  border-radius: 5px;\n  color: #a5b4fc;\n  font-size: 0.72rem;\n  font-weight: 600;\n  cursor: pointer;\n  white-space: nowrap;\n  transition: all 0.15s ease;\n}\n.pe-quick-edit-btn:hover {\n  background: #4f46e5;\n  border-color: #6366f1;\n  color: #ffffff;\n  box-shadow: 0 0 8px rgba(99, 102, 241, 0.4);\n}\n.pe-time-clickable {\n  cursor: pointer;\n  transition: transform 0.15s ease, opacity 0.15s ease;\n}\n.pe-time-clickable:hover {\n  opacity: 0.9;\n  transform: translateY(-1px);\n}\n.pe-time-chip-hoverable {\n  border: 1px dashed rgba(99, 102, 241, 0.4);\n  background: rgba(99, 102, 241, 0.1);\n  color: #a5b4fc;\n  cursor: pointer;\n}\n.pe-time-chip-hoverable:hover {\n  background: rgba(99, 102, 241, 0.25);\n  border-color: #6366f1;\n  color: #ffffff;\n}\n.pe-time-cell {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  min-width: 190px;\n}\n.pe-time-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n}\n.pe-time-date {\n  font-size: 0.8125rem;\n  font-weight: 600;\n  color: #f8fafc;\n  white-space: nowrap;\n}\n.pe-time-chip {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  padding: 2px 7px;\n  border-radius: 9999px;\n  font-size: 0.7rem;\n  font-weight: 600;\n  line-height: 1.2;\n  white-space: nowrap;\n}\n.pe-time-chip-good {\n  background: rgba(16, 185, 129, 0.12);\n  color: #34d399;\n  border: 1px solid rgba(16, 185, 129, 0.25);\n}\n.pe-time-chip-warning {\n  background: rgba(245, 158, 11, 0.12);\n  color: #fbbf24;\n  border: 1px solid rgba(245, 158, 11, 0.25);\n}\n.pe-time-chip-critical {\n  background: rgba(239, 68, 68, 0.14);\n  color: #f87171;\n  border: 1px solid rgba(239, 68, 68, 0.28);\n}\n.pe-time-chip-muted {\n  background: rgba(148, 163, 184, 0.1);\n  color: #94a3b8;\n  border: 1px solid rgba(148, 163, 184, 0.2);\n}\n.pe-progress-track {\n  width: 100%;\n  height: 6px;\n  background: rgba(255, 255, 255, 0.08);\n  border-radius: 9999px;\n  overflow: hidden;\n  position: relative;\n}\n.pe-progress-fill {\n  height: 100%;\n  border-radius: 9999px;\n  transition: width 0.35s ease, background 0.35s ease;\n}\n.pe-progress-fill-good {\n  background:\n    linear-gradient(\n      90deg,\n      #10b981,\n      #059669);\n  box-shadow: 0 0 6px rgba(16, 185, 129, 0.4);\n}\n.pe-progress-fill-warning {\n  background:\n    linear-gradient(\n      90deg,\n      #f59e0b,\n      #d97706);\n  box-shadow: 0 0 6px rgba(245, 158, 11, 0.4);\n}\n.pe-progress-fill-critical {\n  background:\n    linear-gradient(\n      90deg,\n      #ef4444,\n      #dc2626);\n  box-shadow: 0 0 6px rgba(239, 68, 68, 0.4);\n}\n.pe-preview-card {\n  background: rgba(15, 23, 42, 0.7);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 10px;\n  padding: 14px 16px;\n  margin: 14px 0;\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.pe-preview-title {\n  font-size: 0.72rem;\n  font-weight: 600;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n  color: var(--muted-foreground, #94a3b8);\n}\n.pe-preview-row {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n}\n.pe-badge {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  padding: 3px 8px;\n  border-radius: 9999px;\n  font-size: 0.72rem;\n  font-weight: 500;\n  line-height: 1;\n}\n.pe-badge-dot {\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n}\n.pe-badge-active {\n  background: rgba(34, 197, 94, 0.12);\n  color: #4ade80;\n  border: 1px solid rgba(34, 197, 94, 0.25);\n}\n.pe-badge-active .pe-badge-dot {\n  background: #22c55e;\n}\n.pe-badge-suspended {\n  background: rgba(239, 68, 68, 0.12);\n  color: #f87171;\n  border: 1px solid rgba(239, 68, 68, 0.25);\n}\n.pe-badge-suspended .pe-badge-dot {\n  background: #ef4444;\n}\n.pe-badge-scheduled {\n  background: rgba(234, 179, 8, 0.12);\n  color: #facc15;\n  border: 1px solid rgba(234, 179, 8, 0.25);\n}\n.pe-badge-scheduled .pe-badge-dot {\n  background: #eab308;\n}\n.pe-badge-terminated {\n  background: rgba(148, 163, 184, 0.12);\n  color: #94a3b8;\n  border: 1px solid rgba(148, 163, 184, 0.25);\n}\n.pe-badge-terminated .pe-badge-dot {\n  background: #64748b;\n}\n.pe-btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 6px;\n  padding: 7px 14px;\n  border-radius: 6px;\n  font-size: 0.8125rem;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.15s ease;\n  border: none;\n  outline: none;\n  white-space: nowrap;\n}\n.pe-btn-primary {\n  background: var(--primary, #6366f1);\n  color: #ffffff;\n}\n.pe-btn-primary:hover:not(:disabled) {\n  opacity: 0.92;\n  transform: translateY(-0.5px);\n}\n.pe-btn-secondary {\n  background: var(--muted, rgba(255, 255, 255, 0.08));\n  color: var(--foreground, #ffffff);\n  border: 1px solid var(--border, rgba(255, 255, 255, 0.1));\n}\n.pe-btn-secondary:hover:not(:disabled) {\n  background: rgba(255, 255, 255, 0.12);\n}\n.pe-btn-danger {\n  background: rgba(239, 68, 68, 0.15);\n  color: #f87171;\n  border: 1px solid rgba(239, 68, 68, 0.25);\n}\n.pe-btn-danger:hover:not(:disabled) {\n  background: rgba(239, 68, 68, 0.25);\n}\n.pe-btn-preset {\n  padding: 3px 8px;\n  font-size: 0.72rem;\n  font-weight: 500;\n  border-radius: 5px;\n  background: rgba(255, 255, 255, 0.06);\n  border: 1px solid rgba(255, 255, 255, 0.12);\n  color: #cbd5e1;\n  cursor: pointer;\n  transition: all 0.12s ease;\n}\n.pe-btn-preset:hover {\n  background: rgba(255, 255, 255, 0.12);\n  color: #ffffff;\n  border-color: rgba(255, 255, 255, 0.25);\n}\n.pe-modal-overlay {\n  position: fixed;\n  inset: 0;\n  z-index: 99999;\n  background: rgba(0, 0, 0, 0.65);\n  backdrop-filter: blur(6px);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 20px;\n}\n.pe-modal {\n  position: relative;\n  width: 100%;\n  max-width: 560px;\n  background: var(--card, #1e293b);\n  border: 1px solid var(--border, rgba(255, 255, 255, 0.1));\n  border-radius: 12px;\n  padding: 24px;\n  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5);\n  max-height: 92vh;\n  overflow-y: auto;\n}\n.pe-modal-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 18px;\n}\n.pe-form-group {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  margin-bottom: 16px;\n}\n.pe-form-label {\n  font-size: 0.8125rem;\n  font-weight: 500;\n  color: var(--muted-foreground, #94a3b8);\n}\n.pe-checkbox-label {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 0.8125rem;\n  color: var(--foreground, #e2e8f0);\n  cursor: pointer;\n  user-select: none;\n}\n.pe-spinner {\n  width: 16px;\n  height: 16px;\n  border: 2px solid rgba(255, 255, 255, 0.2);\n  border-top-color: #ffffff;\n  border-radius: 50%;\n  animation: pe-spin 0.6s linear infinite;\n  display: inline-block;\n}\n@keyframes pe-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.pe-slim-banner {\n  width: 100%;\n  margin-bottom: 16px;\n  background: var(--card, rgba(30, 41, 59, 0.45));\n  border: 1px solid var(--border, rgba(255, 255, 255, 0.08));\n  border-radius: 8px;\n  overflow: hidden;\n  box-sizing: border-box;\n  transition: border-color 0.2s ease, background 0.2s ease;\n}\n.pe-slim-banner:hover {\n  border-color: rgba(255, 255, 255, 0.12);\n}\n.pe-slim-banner-good {\n  border-left: 3px solid #3b82f6;\n}\n.pe-slim-banner-warning {\n  border-left: 3px solid #f59e0b;\n}\n.pe-slim-banner-critical {\n  border-left: 3px solid #ef4444;\n}\n.pe-slim-banner-body {\n  padding: 9px 14px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  flex-wrap: wrap;\n}\n.pe-slim-banner-left {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n.pe-slim-icon {\n  color: var(--muted-foreground, #94a3b8);\n  flex-shrink: 0;\n}\n.pe-slim-banner-good .pe-slim-icon {\n  color: #38bdf8;\n}\n.pe-slim-banner-warning .pe-slim-icon {\n  color: #fbbf24;\n}\n.pe-slim-banner-critical .pe-slim-icon {\n  color: #f87171;\n}\n.pe-slim-title {\n  font-size: 0.8125rem;\n  font-weight: 500;\n  color: var(--muted-foreground, #94a3b8);\n}\n.pe-slim-date {\n  font-size: 0.8125rem;\n  font-weight: 600;\n  color: var(--foreground, #f8fafc);\n}\n.pe-slim-chip {\n  display: inline-flex;\n  align-items: center;\n  font-size: 0.7rem;\n  font-weight: 500;\n  line-height: 1;\n  padding: 2.5px 7px;\n  border-radius: 9999px;\n  background: rgba(255, 255, 255, 0.06);\n  border: 1px solid rgba(255, 255, 255, 0.08);\n  color: var(--muted-foreground, #94a3b8);\n  white-space: nowrap;\n}\n.pe-slim-chip-good {\n  background: rgba(59, 130, 246, 0.1);\n  border-color: rgba(59, 130, 246, 0.2);\n  color: #60a5fa;\n}\n.pe-slim-chip-warning {\n  background: rgba(245, 158, 11, 0.1);\n  border-color: rgba(245, 158, 11, 0.2);\n  color: #fbbf24;\n}\n.pe-slim-chip-critical {\n  background: rgba(239, 68, 68, 0.1);\n  border-color: rgba(239, 68, 68, 0.25);\n  color: #f87171;\n}\n.pe-slim-banner-right {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  font-size: 0.75rem;\n  color: var(--muted-foreground, #94a3b8);\n}\n.pe-slim-term-notice {\n  font-size: 0.75rem;\n  color: #94a3b8;\n}\n.pe-slim-note {\n  font-size: 0.75rem;\n  color: #cbd5e1;\n  max-width: 220px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.pe-slim-track {\n  width: 100%;\n  height: 3px;\n  background: rgba(255, 255, 255, 0.04);\n  overflow: hidden;\n  position: relative;\n}\n.pe-slim-fill {\n  height: 100%;\n  transition: width 0.3s ease;\n}\n.pe-slim-fill-good {\n  background: #3b82f6;\n}\n.pe-slim-fill-warning {\n  background: #f59e0b;\n}\n.pe-slim-fill-critical {\n  background: #ef4444;\n}\n.pe-input-box {\n  position: relative !important;\n  display: flex !important;\n  align-items: center !important;\n}\n.pe-input-box svg.pe-input-icon,\nsvg.pe-input-icon,\n.pe-input-icon {\n  position: absolute !important;\n  left: 14px !important;\n  top: 50% !important;\n  transform: translateY(-50%) !important;\n  width: 16px !important;\n  height: 16px !important;\n  min-width: 16px !important;\n  min-height: 16px !important;\n  max-width: 16px !important;\n  max-height: 16px !important;\n  color: var(--muted-foreground, #94a3b8) !important;\n  pointer-events: none !important;\n  z-index: 10 !important;\n  display: block !important;\n  flex-shrink: 0 !important;\n}\n.pe-input-box input.pe-input,\n.pe-input-box input.pe-search-input,\ninput.pe-input,\ninput.pe-search-input {\n  width: 100% !important;\n  padding-left: 42px !important;\n  padding-right: 14px !important;\n  padding-top: 9px !important;\n  padding-bottom: 9px !important;\n  box-sizing: border-box !important;\n}\n.pe-tab-row {\n  display: flex;\n  gap: 8px;\n  margin-bottom: 18px;\n  border-bottom: 1px solid var(--border, rgba(255, 255, 255, 0.08));\n  padding-bottom: 12px;\n}\n.pe-tab-btn {\n  padding: 7px 14px;\n  font-size: 0.8125rem;\n  font-weight: 500;\n  border-radius: 6px;\n  border: 1px solid transparent;\n  background: transparent;\n  color: var(--muted-foreground, #94a3b8);\n  cursor: pointer;\n  transition: all 0.15s ease;\n}\n.pe-tab-btn:hover {\n  color: var(--foreground, #ffffff);\n  background: rgba(255, 255, 255, 0.04);\n}\n.pe-tab-btn.pe-tab-active {\n  background: rgba(59, 130, 246, 0.12);\n  color: #60a5fa;\n  border-color: rgba(59, 130, 246, 0.3);\n  font-weight: 600;\n}\n.pe-tag-chip {\n  display: inline-flex;\n  align-items: center;\n  padding: 3px 8px;\n  font-size: 0.72rem;\n  font-family:\n    ui-monospace,\n    SFMono-Regular,\n    Menlo,\n    Monaco,\n    Consolas,\n    monospace;\n  background: rgba(15, 23, 42, 0.8);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  color: #38bdf8;\n  border-radius: 5px;\n  cursor: pointer;\n  transition: all 0.15s ease;\n}\n.pe-tag-chip:hover {\n  background: rgba(56, 189, 248, 0.15);\n  border-color: #38bdf8;\n  color: #ffffff;\n  transform: translateY(-1px);\n}\n.pe-email-preview {\n  background: #0f172a;\n  border: 1px solid #334155;\n  border-radius: 10px;\n  padding: 18px 20px;\n  margin-top: 14px;\n  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);\n}\n.pe-email-preview-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  border-bottom: 1px solid #334155;\n  padding-bottom: 12px;\n  margin-bottom: 14px;\n}\n.pe-email-preview-title {\n  font-size: 0.95rem;\n  font-weight: 700;\n  color: #f8fafc;\n  margin: 0 0 10px 0;\n}\n.pe-email-preview-body {\n  font-size: 0.82rem;\n  color: #cbd5e1;\n  line-height: 1.6;\n  white-space: pre-wrap;\n  background: #1e293b;\n  padding: 12px 14px;\n  border-radius: 8px;\n  border: 1px solid rgba(255, 255, 255, 0.05);\n}\n.pe-email-preview-meta {\n  width: 100%;\n  margin-top: 12px;\n  border-collapse: collapse;\n  font-size: 0.75rem;\n}\n.pe-email-preview-meta td {\n  padding: 5px 8px;\n  border-bottom: 1px solid #334155;\n}\n.pe-email-preview-btn {\n  display: inline-block;\n  padding: 8px 18px;\n  font-size: 0.8125rem;\n  font-weight: 600;\n  background: #3b82f6;\n  color: #ffffff;\n  border-radius: 6px;\n  text-decoration: none;\n  margin-top: 14px;\n  text-align: center;\n}\n";
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
import { useState as useState2, useEffect as useEffect2, useRef } from "react";
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
  const tableCardRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const [isDragging, setIsDragging] = useState2(false);
  const scrollTable = (direction) => {
    if (!tableCardRef.current) return;
    const amount = direction === "left" ? -350 : 350;
    tableCardRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };
  const handleTableWheel = (e) => {
    const el = tableCardRef.current;
    if (!el) return;
    if (Math.abs(e.deltaX) > 0) return;
    if (Math.abs(e.deltaY) > 0) {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;
      const canScrollLeft = el.scrollLeft > 0;
      const canScrollRight = el.scrollLeft < maxScroll - 1;
      if (e.deltaY > 0 && canScrollRight || e.deltaY < 0 && canScrollLeft) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }
  };
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    const target = e.target;
    if (target.closest("button, input, select, a, .pe-btn, .pe-quick-edit-btn, .pe-time-clickable")) {
      return;
    }
    if (!tableCardRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - tableCardRef.current.offsetLeft;
    scrollLeftRef.current = tableCardRef.current.scrollLeft;
    setIsDragging(true);
  };
  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !tableCardRef.current) return;
    e.preventDefault();
    const x = e.pageX - tableCardRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.4;
    tableCardRef.current.scrollLeft = scrollLeftRef.current - walk;
  };
  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };
  const [emailModalOpen, setEmailModalOpen] = useState2(false);
  const [activeMailTab, setActiveMailTab] = useState2("suspension");
  const [mailSuspEnabled, setMailSuspEnabled] = useState2(true);
  const [mailSuspSubject, setMailSuspSubject] = useState2("[Notice] Server Suspended: {server_name}");
  const [mailSuspBody, setMailSuspBody] = useState2("");
  const [mailWarnEnabled, setMailWarnEnabled] = useState2(true);
  const [mailWarnSubject, setMailWarnSubject] = useState2("[Warning] Your server {server_name} expires soon");
  const [mailWarnBody, setMailWarnBody] = useState2("");
  const [mailTermEnabled, setMailTermEnabled] = useState2(true);
  const [mailTermSubject, setMailTermSubject] = useState2("[Final Notice] Server Terminated: {server_name}");
  const [mailTermBody, setMailTermBody] = useState2("");
  const [testEmailAddress, setTestEmailAddress] = useState2("");
  const [testEmailSending, setTestEmailSending] = useState2(false);
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
  const mailTemplatesQuery = useQuery2({
    queryKey: ["admin-suspension-mail-templates"],
    queryFn: async () => {
      const res = await fetch("/api/admin/extensions/server-suspension/mail-templates");
      if (!res.ok) throw new Error("Failed to load email notification templates");
      return res.json();
    },
    enabled: emailModalOpen
  });
  useEffect2(() => {
    if (mailTemplatesQuery.data) {
      const d = mailTemplatesQuery.data;
      setMailSuspEnabled(Boolean(d.mail_notifications_enabled));
      if (d.mail_subject) setMailSuspSubject(d.mail_subject);
      if (d.mail_body) setMailSuspBody(d.mail_body);
      setMailWarnEnabled(Boolean(d.warning_mail_enabled));
      if (d.warning_mail_subject) setMailWarnSubject(d.warning_mail_subject);
      if (d.warning_mail_body) setMailWarnBody(d.warning_mail_body);
      setMailTermEnabled(Boolean(d.termination_mail_enabled));
      if (d.termination_mail_subject) setMailTermSubject(d.termination_mail_subject);
      if (d.termination_mail_body) setMailTermBody(d.termination_mail_body);
      if (!testEmailAddress && d.admin_email) {
        setTestEmailAddress(d.admin_email);
      }
    }
  }, [mailTemplatesQuery.data]);
  const saveMailTemplatesMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        mail_notifications_enabled: mailSuspEnabled,
        mail_subject: mailSuspSubject,
        mail_body: mailSuspBody,
        warning_mail_enabled: mailWarnEnabled,
        warning_mail_subject: mailWarnSubject,
        warning_mail_body: mailWarnBody,
        termination_mail_enabled: mailTermEnabled,
        termination_mail_subject: mailTermSubject,
        termination_mail_body: mailTermBody
      };
      const res = await fetch("/api/admin/extensions/server-suspension/mail-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save email templates");
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Email templates saved successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-suspension-mail-templates"] });
    },
    onError: (err) => toast.error(err.message)
  });
  const handleSendTestEmail = async () => {
    if (!testEmailAddress.trim()) {
      toast.error("Please enter a destination email address for the test.");
      return;
    }
    setTestEmailSending(true);
    try {
      let subject = mailSuspSubject;
      let body = mailSuspBody;
      if (activeMailTab === "warning") {
        subject = mailWarnSubject;
        body = mailWarnBody;
      } else if (activeMailTab === "termination") {
        subject = mailTermSubject;
        body = mailTermBody;
      }
      const res = await fetch("/api/admin/extensions/server-suspension/test-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template_type: activeMailTab,
          subject,
          body,
          email: testEmailAddress.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to deliver test email");
      toast.success(data.message || "Test email dispatched successfully!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setTestEmailSending(false);
    }
  };
  const insertPlaceholder = (tag) => {
    if (activeMailTab === "suspension") {
      setMailSuspBody((prev) => prev + (prev.endsWith(" ") || prev === "" ? "" : " ") + tag);
    } else if (activeMailTab === "warning") {
      setMailWarnBody((prev) => prev + (prev.endsWith(" ") || prev === "" ? "" : " ") + tag);
    } else {
      setMailTermBody((prev) => prev + (prev.endsWith(" ") || prev === "" ? "" : " ") + tag);
    }
    toast.info(`Inserted placeholder ${tag}`);
  };
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
        ),
        /* @__PURE__ */ jsxs2(
          "button",
          {
            type: "button",
            className: "pe-btn pe-btn-secondary",
            onClick: () => setEmailModalOpen(true),
            style: { display: "inline-flex", alignItems: "center", gap: 6 },
            children: [
              /* @__PURE__ */ jsxs2("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                /* @__PURE__ */ jsx2("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }),
                /* @__PURE__ */ jsx2("polyline", { points: "22,6 12,13 2,6" })
              ] }),
              "Email Templates"
            ]
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
    /* @__PURE__ */ jsxs2("div", { className: "pe-table-meta-bar", children: [
      /* @__PURE__ */ jsxs2("div", { className: "pe-table-meta-count", children: [
        "Showing ",
        /* @__PURE__ */ jsx2("strong", { children: filteredServers.length }),
        " of ",
        /* @__PURE__ */ jsx2("strong", { children: servers.length }),
        " panel servers"
      ] }),
      /* @__PURE__ */ jsxs2("div", { className: "pe-table-scroll-controls", children: [
        /* @__PURE__ */ jsxs2("span", { className: "pe-scroll-hint", children: [
          /* @__PURE__ */ jsxs2("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
            /* @__PURE__ */ jsx2("line", { x1: "5", y1: "12", x2: "19", y2: "12" }),
            /* @__PURE__ */ jsx2("polyline", { points: "12 5 19 12 12 19" }),
            /* @__PURE__ */ jsx2("polyline", { points: "12 19 5 12 12 5" })
          ] }),
          "Scroll table:"
        ] }),
        /* @__PURE__ */ jsxs2(
          "button",
          {
            type: "button",
            className: "pe-scroll-btn",
            title: "Scroll table left",
            onClick: () => scrollTable("left"),
            children: [
              /* @__PURE__ */ jsx2("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx2("polyline", { points: "15 18 9 12 15 6" }) }),
              "Left"
            ]
          }
        ),
        /* @__PURE__ */ jsxs2(
          "button",
          {
            type: "button",
            className: "pe-scroll-btn",
            title: "Scroll table right",
            onClick: () => scrollTable("right"),
            children: [
              "Right",
              /* @__PURE__ */ jsx2("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx2("polyline", { points: "9 18 15 12 9 6" }) })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx2(
      "div",
      {
        ref: tableCardRef,
        className: `pe-table-card ${isDragging ? "pe-table-dragging" : ""}`,
        onWheel: handleTableWheel,
        onMouseDown: handleMouseDown,
        onMouseMove: handleMouseMove,
        onMouseUp: handleMouseUp,
        onMouseLeave: handleMouseUp,
        children: /* @__PURE__ */ jsxs2("table", { className: "pe-table", children: [
          /* @__PURE__ */ jsx2("thead", { children: /* @__PURE__ */ jsxs2("tr", { children: [
            /* @__PURE__ */ jsx2("th", { style: { width: 44, textAlign: "center" }, children: /* @__PURE__ */ jsx2(
              "input",
              {
                type: "checkbox",
                checked: filteredServers.length > 0 && selectedServerIds.length === filteredServers.length,
                onChange: selectAllFiltered
              }
            ) }),
            /* @__PURE__ */ jsx2("th", { style: { minWidth: 170 }, children: "Server" }),
            /* @__PURE__ */ jsx2("th", { style: { minWidth: 170 }, children: "Node / Owner" }),
            /* @__PURE__ */ jsx2("th", { style: { minWidth: 110 }, children: "Status" }),
            /* @__PURE__ */ jsx2("th", { style: { minWidth: 220 }, children: "Suspension Date & Time Left" }),
            /* @__PURE__ */ jsx2("th", { style: { minWidth: 200 }, children: "Termination Grace" }),
            /* @__PURE__ */ jsx2("th", { className: "pe-col-sticky-right", style: { minWidth: 250, textAlign: "right" }, children: "Actions" })
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
              /* @__PURE__ */ jsx2("td", { children: /* @__PURE__ */ jsxs2("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }, children: [
                /* @__PURE__ */ jsxs2("div", { children: [
                  /* @__PURE__ */ jsx2("div", { style: { fontWeight: 600 }, children: server.name }),
                  /* @__PURE__ */ jsx2("div", { style: { fontSize: "0.72rem", color: "var(--muted-foreground, #94a3b8)", fontFamily: "monospace" }, children: server.identifier })
                ] }),
                /* @__PURE__ */ jsxs2(
                  "button",
                  {
                    type: "button",
                    className: "pe-quick-edit-btn",
                    title: hasSchedule ? "Edit Expiration Schedule" : "Set Suspension Date",
                    onClick: () => openEdit(server),
                    children: [
                      /* @__PURE__ */ jsxs2("svg", { width: "11", height: "11", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
                        /* @__PURE__ */ jsx2("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }),
                        /* @__PURE__ */ jsx2("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })
                      ] }),
                      /* @__PURE__ */ jsx2("span", { children: hasSchedule ? "Edit" : "Set Date" })
                    ]
                  }
                )
              ] }) }),
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
              /* @__PURE__ */ jsx2("td", { children: suspTimeInfo.hasDate ? /* @__PURE__ */ jsxs2(
                "div",
                {
                  className: "pe-time-cell pe-time-clickable",
                  title: "Click to edit suspension schedule",
                  onClick: () => openEdit(server),
                  children: [
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
                  ]
                }
              ) : /* @__PURE__ */ jsx2(
                "div",
                {
                  className: "pe-time-cell pe-time-clickable",
                  title: "Click to set suspension date",
                  onClick: () => openEdit(server),
                  style: { display: "inline-flex" },
                  children: /* @__PURE__ */ jsx2("span", { className: "pe-time-chip pe-time-chip-muted pe-time-chip-hoverable", children: "+ Set Expiration Date" })
                }
              ) }),
              /* @__PURE__ */ jsx2("td", { children: termTimeInfo.hasDate ? /* @__PURE__ */ jsxs2(
                "div",
                {
                  className: "pe-time-cell pe-time-clickable",
                  title: "Click to edit termination grace period",
                  onClick: () => openEdit(server),
                  children: [
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
                  ]
                }
              ) : /* @__PURE__ */ jsx2("span", { style: { fontSize: "0.75rem", color: "var(--muted-foreground, #64748b)" }, children: "None" }) }),
              /* @__PURE__ */ jsx2("td", { className: "pe-col-sticky-right", children: /* @__PURE__ */ jsxs2("div", { className: "pe-actions-wrap", children: [
                /* @__PURE__ */ jsx2(
                  "button",
                  {
                    type: "button",
                    className: "pe-btn pe-btn-primary pe-btn-sm",
                    onClick: () => openEdit(server),
                    children: hasSchedule ? "Edit Expiration" : "Set Suspension Date"
                  }
                ),
                hasSchedule && /* @__PURE__ */ jsx2(
                  "button",
                  {
                    type: "button",
                    className: "pe-btn pe-btn-secondary pe-btn-sm",
                    title: "Remove scheduled suspension & termination",
                    onClick: () => actionMutation.mutate({ server_id: server.id, action: "cancel" }),
                    children: "Remove Schedule"
                  }
                ),
                isSuspended ? /* @__PURE__ */ jsx2(
                  "button",
                  {
                    type: "button",
                    className: "pe-btn pe-btn-secondary pe-btn-sm",
                    disabled: actionMutation.isPending,
                    onClick: () => actionMutation.mutate({ server_id: server.id, action: "unsuspend" }),
                    children: "Unsuspend"
                  }
                ) : /* @__PURE__ */ jsx2(
                  "button",
                  {
                    type: "button",
                    className: "pe-btn pe-btn-danger pe-btn-sm",
                    disabled: actionMutation.isPending,
                    onClick: () => actionMutation.mutate({ server_id: server.id, action: "suspend" }),
                    children: "Suspend Now"
                  }
                )
              ] }) })
            ] }, server.id);
          }) })
        ] })
      }
    ),
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
    ] }) }),
    emailModalOpen && /* @__PURE__ */ jsx2("div", { className: "pe-modal-overlay", onClick: () => setEmailModalOpen(false), children: /* @__PURE__ */ jsxs2(
      "div",
      {
        className: "pe-modal",
        style: { maxWidth: 760, maxHeight: "90vh", overflowY: "auto" },
        onClick: (e) => e.stopPropagation(),
        children: [
          /* @__PURE__ */ jsxs2("div", { className: "pe-modal-header", style: { marginBottom: 16 }, children: [
            /* @__PURE__ */ jsxs2("div", { children: [
              /* @__PURE__ */ jsx2("h3", { className: "pe-title", style: { fontSize: "1.15rem" }, children: "Email Notification Templates" }),
              /* @__PURE__ */ jsx2("p", { style: { fontSize: "0.8rem", color: "#94a3b8", margin: "4px 0 0 0" }, children: "Configure customized emails delivered to clients when servers expire, suspend, or terminate." })
            ] }),
            /* @__PURE__ */ jsx2(
              "button",
              {
                type: "button",
                style: { background: "transparent", border: "none", color: "#94a3b8", fontSize: "1.4rem", cursor: "pointer" },
                onClick: () => setEmailModalOpen(false),
                children: "\xD7"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs2("div", { className: "pe-tab-row", children: [
            /* @__PURE__ */ jsx2(
              "button",
              {
                type: "button",
                className: `pe-tab-btn ${activeMailTab === "suspension" ? "pe-tab-active" : ""}`,
                onClick: () => setActiveMailTab("suspension"),
                children: "Suspension Notice"
              }
            ),
            /* @__PURE__ */ jsx2(
              "button",
              {
                type: "button",
                className: `pe-tab-btn ${activeMailTab === "warning" ? "pe-tab-active" : ""}`,
                onClick: () => setActiveMailTab("warning"),
                children: "Expiration Warning (24h)"
              }
            ),
            /* @__PURE__ */ jsx2(
              "button",
              {
                type: "button",
                className: `pe-tab-btn ${activeMailTab === "termination" ? "pe-tab-active" : ""}`,
                onClick: () => setActiveMailTab("termination"),
                children: "Termination Notice"
              }
            )
          ] }),
          (() => {
            const isSusp = activeMailTab === "suspension";
            const isWarn = activeMailTab === "warning";
            const enabled = isSusp ? mailSuspEnabled : isWarn ? mailWarnEnabled : mailTermEnabled;
            const setEnabled = isSusp ? setMailSuspEnabled : isWarn ? setMailWarnEnabled : setMailTermEnabled;
            const subject = isSusp ? mailSuspSubject : isWarn ? mailWarnSubject : mailTermSubject;
            const setSubject = isSusp ? setMailSuspSubject : isWarn ? setMailWarnSubject : setMailTermSubject;
            const body = isSusp ? mailSuspBody : isWarn ? mailWarnBody : mailTermBody;
            const setBody = isSusp ? setMailSuspBody : isWarn ? setMailWarnBody : setMailTermBody;
            const title = isSusp ? "Server Suspension Notice" : isWarn ? "Expiration Warning Notice" : "Server Termination Notice";
            const desc = isSusp ? "Delivered immediately when a server reaches its scheduled expiration date and is suspended." : isWarn ? "Delivered 24 hours prior to expiration to notify owners to renew their server in advance." : "Delivered when a server exceeds its grace period and is flagged for permanent termination.";
            const badge = isSusp ? "SUSPENDED" : isWarn ? "EXPIRING SOON" : "TERMINATED";
            const badgeBg = isSusp ? "#ef4444" : isWarn ? "#f59e0b" : "#991b1b";
            const previewSubj = subject.replace(/{server_name}/gi, "Survival SMP Production").replace(/{username}/gi, "Steve").replace(/{server_id}/gi, "142");
            const previewBody = body.replace(/{server_name}/gi, "Survival SMP Production").replace(/{username}/gi, "Steve").replace(/{server_id}/gi, "142").replace(/{server_uuid}/gi, "a8f39b1c").replace(/{suspension_date}/gi, "Tomorrow, 18:00").replace(/{termination_date}/gi, "In 7 days, 18:00").replace(/{panel_url}/gi, window.location.origin);
            return /* @__PURE__ */ jsxs2("div", { style: { display: "flex", flexDirection: "column", gap: 16 }, children: [
              /* @__PURE__ */ jsxs2("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(15, 23, 42, 0.6)", padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }, children: [
                /* @__PURE__ */ jsxs2("div", { children: [
                  /* @__PURE__ */ jsx2("span", { style: { fontSize: "0.875rem", fontWeight: 600, color: "#f8fafc" }, children: title }),
                  /* @__PURE__ */ jsx2("p", { style: { fontSize: "0.75rem", color: "#94a3b8", margin: "2px 0 0 0" }, children: desc })
                ] }),
                /* @__PURE__ */ jsxs2("label", { className: "pe-checkbox-label", style: { margin: 0 }, children: [
                  /* @__PURE__ */ jsx2(
                    "input",
                    {
                      type: "checkbox",
                      checked: enabled,
                      onChange: (e) => setEnabled(e.target.checked)
                    }
                  ),
                  /* @__PURE__ */ jsx2("span", { style: { fontSize: "0.8125rem" }, children: "Active" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs2("div", { className: "pe-form-group", children: [
                /* @__PURE__ */ jsx2("label", { className: "pe-form-label", children: "Email Subject" }),
                /* @__PURE__ */ jsx2(
                  "input",
                  {
                    type: "text",
                    className: "pe-input",
                    value: subject,
                    onChange: (e) => setSubject(e.target.value),
                    placeholder: "e.g. [Notice] Server Suspended: {server_name}"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs2("div", { className: "pe-form-group", children: [
                /* @__PURE__ */ jsxs2("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }, children: [
                  /* @__PURE__ */ jsx2("label", { className: "pe-form-label", style: { marginBottom: 0 }, children: "Email Body Template" }),
                  /* @__PURE__ */ jsx2("span", { style: { fontSize: "0.72rem", color: "#94a3b8" }, children: "Click placeholder chip to insert" })
                ] }),
                /* @__PURE__ */ jsx2("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }, children: ["{username}", "{server_name}", "{server_id}", "{server_uuid}", "{suspension_date}", "{termination_date}", "{panel_url}"].map((tag) => /* @__PURE__ */ jsx2(
                  "button",
                  {
                    type: "button",
                    className: "pe-tag-chip",
                    onClick: () => insertPlaceholder(tag),
                    title: `Click to append ${tag}`,
                    children: tag
                  },
                  tag
                )) }),
                /* @__PURE__ */ jsx2(
                  "textarea",
                  {
                    className: "pe-input",
                    style: { minHeight: 130, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", fontSize: "0.8125rem", lineHeight: "1.5" },
                    value: body,
                    onChange: (e) => setBody(e.target.value),
                    placeholder: "Compose email template message..."
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs2("div", { children: [
                /* @__PURE__ */ jsx2("label", { className: "pe-form-label", style: { marginBottom: 4 }, children: "Live Email Preview (Sample Client View)" }),
                /* @__PURE__ */ jsxs2("div", { className: "pe-email-preview", children: [
                  /* @__PURE__ */ jsxs2("div", { className: "pe-email-preview-header", children: [
                    /* @__PURE__ */ jsx2("span", { style: { fontSize: "0.9rem", fontWeight: 700, color: "#f8fafc" }, children: "Pterodactyl Panel" }),
                    /* @__PURE__ */ jsx2(
                      "span",
                      {
                        style: {
                          padding: "3px 8px",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          background: badgeBg,
                          color: "#ffffff",
                          borderRadius: 4,
                          letterSpacing: "0.04em"
                        },
                        children: badge
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx2("h4", { className: "pe-email-preview-title", children: previewSubj || "(No subject)" }),
                  /* @__PURE__ */ jsx2("div", { className: "pe-email-preview-body", children: previewBody || "(No message body provided)" }),
                  /* @__PURE__ */ jsx2("table", { className: "pe-email-preview-meta", children: /* @__PURE__ */ jsxs2("tbody", { children: [
                    /* @__PURE__ */ jsxs2("tr", { children: [
                      /* @__PURE__ */ jsx2("td", { style: { color: "#94a3b8" }, children: "Target Server:" }),
                      /* @__PURE__ */ jsx2("td", { style: { textAlign: "right", color: "#f1f5f9", fontWeight: 600 }, children: "Survival SMP Production (#142)" })
                    ] }),
                    /* @__PURE__ */ jsxs2("tr", { children: [
                      /* @__PURE__ */ jsx2("td", { style: { color: "#94a3b8" }, children: "Effective Date:" }),
                      /* @__PURE__ */ jsx2("td", { style: { textAlign: "right", color: "#f1f5f9", fontWeight: 600 }, children: "Tomorrow, 18:00" })
                    ] })
                  ] }) }),
                  /* @__PURE__ */ jsx2("div", { style: { textAlign: "center", marginTop: 14 }, children: /* @__PURE__ */ jsx2("span", { className: "pe-email-preview-btn", children: "Open Control Panel \u2192" }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxs2("div", { style: { background: "rgba(15, 23, 42, 0.5)", padding: "12px 14px", borderRadius: 8, border: "1px solid #334155" }, children: [
                /* @__PURE__ */ jsxs2("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }, children: [
                  /* @__PURE__ */ jsx2("span", { style: { fontSize: "0.8rem", fontWeight: 600, color: "#e2e8f0" }, children: "Send Test Email" }),
                  /* @__PURE__ */ jsx2("span", { style: { fontSize: "0.72rem", color: "#94a3b8" }, children: "Verifies mail transport configuration & design" })
                ] }),
                /* @__PURE__ */ jsxs2("div", { style: { display: "flex", gap: 8 }, children: [
                  /* @__PURE__ */ jsx2(
                    "input",
                    {
                      type: "email",
                      className: "pe-input",
                      placeholder: "admin@example.com",
                      value: testEmailAddress,
                      onChange: (e) => setTestEmailAddress(e.target.value),
                      style: { flex: 1, fontSize: "0.8125rem" }
                    }
                  ),
                  /* @__PURE__ */ jsx2(
                    "button",
                    {
                      type: "button",
                      className: "pe-btn pe-btn-secondary",
                      disabled: testEmailSending || !testEmailAddress.trim(),
                      onClick: handleSendTestEmail,
                      style: { whiteSpace: "nowrap" },
                      children: testEmailSending ? /* @__PURE__ */ jsx2("span", { className: "pe-spinner" }) : "Send Test"
                    }
                  )
                ] })
              ] })
            ] });
          })(),
          /* @__PURE__ */ jsxs2("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14 }, children: [
            /* @__PURE__ */ jsx2(
              "button",
              {
                type: "button",
                className: "pe-btn pe-btn-secondary",
                onClick: () => setEmailModalOpen(false),
                children: "Close"
              }
            ),
            /* @__PURE__ */ jsx2(
              "button",
              {
                type: "button",
                className: "pe-btn pe-btn-primary",
                disabled: saveMailTemplatesMutation.isPending,
                onClick: () => saveMailTemplatesMutation.mutate(),
                children: saveMailTemplatesMutation.isPending ? /* @__PURE__ */ jsx2("span", { className: "pe-spinner" }) : "Save All Templates"
              }
            )
          ] })
        ]
      }
    ) })
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
  }) + " \u2022 " + target.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diffMs <= 0) {
    return {
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
  const percent = Math.min(100, Math.max(4, Math.round(diffMs / maxMs * 100)));
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
  return /* @__PURE__ */ jsxs("div", { className: `pe-slim-banner pe-slim-banner-${suspInfo.urgency}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "pe-slim-banner-body", children: [
      /* @__PURE__ */ jsxs("div", { className: "pe-slim-banner-left", children: [
        /* @__PURE__ */ jsxs(
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
              /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
              /* @__PURE__ */ jsx("polyline", { points: "12 6 12 12 16 14" })
            ]
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "pe-slim-title", children: "Server Suspension:" }),
        /* @__PURE__ */ jsx("span", { className: "pe-slim-date", children: suspInfo.formattedDate }),
        /* @__PURE__ */ jsx("span", { className: `pe-slim-chip pe-slim-chip-${suspInfo.urgency}`, children: suspInfo.formattedTimeLeft })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pe-slim-banner-right", children: [
        termInfo && /* @__PURE__ */ jsxs("span", { className: "pe-slim-term-notice", title: `Permanent termination date: ${termInfo.formattedDate}`, children: [
          "Termination: ",
          termInfo.formattedDate.split("\u2022")[0],
          " (",
          termInfo.formattedTimeLeft,
          ")"
        ] }),
        data.notes && /* @__PURE__ */ jsx("span", { className: "pe-slim-note", title: data.notes, children: data.notes })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "pe-slim-track", title: `Suspension in ${suspInfo.formattedTimeLeft} (${suspInfo.formattedDate})`, children: /* @__PURE__ */ jsx(
      "div",
      {
        className: `pe-slim-fill pe-slim-fill-${suspInfo.urgency}`,
        style: { width: `${suspInfo.percent}%` }
      }
    ) })
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
