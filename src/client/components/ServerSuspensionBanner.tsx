import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCurrentServerRequired } from '@pterodactyl/sdk';

interface ServerScheduleStatus {
    scheduled: boolean;
    server_id?: number;
    server_name?: string;
    server_identifier?: string;
    suspension_date?: string;
    termination_date?: string;
    sched_status?: string;
    notes?: string;
}

interface TimeLeftInfo {
    formattedDate: string;
    formattedTimeLeft: string;
    daysLeft: number;
    hoursLeft: number;
    minutesLeft: number;
    isPastDue: boolean;
    percent: number;
    urgency: 'good' | 'warning' | 'critical';
}

function computeTime(dateStr: string): TimeLeftInfo {
    const target = new Date(dateStr);
    const targetMs = target.getTime();
    const now = Date.now();
    const diffMs = targetMs - now;

    const formattedDate = target.toLocaleDateString(undefined, {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }) + ' at ' + target.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (diffMs <= 0) {
        return {
            formattedDate,
            formattedTimeLeft: 'Past due / Pending suspension',
            daysLeft: 0,
            hoursLeft: 0,
            minutesLeft: 0,
            isPastDue: true,
            percent: 0,
            urgency: 'critical',
        };
    }

    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;

    let formattedTimeLeft = '';
    if (days > 0) {
        formattedTimeLeft = `${days} day${days > 1 ? 's' : ''}, ${hours} hr${hours !== 1 ? 's' : ''} left`;
    } else if (hours > 0) {
        formattedTimeLeft = `${hours} hr${hours !== 1 ? 's' : ''}, ${minutes} min remaining`;
    } else {
        formattedTimeLeft = `${Math.max(1, minutes)} min remaining`;
    }

    let urgency: 'good' | 'warning' | 'critical' = 'good';
    if (days < 1) {
        urgency = 'critical';
    } else if (days < 7) {
        urgency = 'warning';
    } else {
        urgency = 'good';
    }

    // Baseline 30 days = 100%, 0 = 0%
    const maxMs = 30 * 24 * 60 * 60 * 1000;
    const percent = Math.min(100, Math.max(5, Math.round((diffMs / maxMs) * 100)));

    return {
        formattedDate,
        formattedTimeLeft,
        daysLeft: days,
        hoursLeft: hours,
        minutesLeft: minutes,
        isPastDue: false,
        percent,
        urgency,
    };
}

export default function ServerSuspensionBanner() {
    let serverIdentifier = '';
    try {
        const s = useCurrentServerRequired();
        serverIdentifier = s?.attributes?.identifier || s?.identifier || '';
    } catch {
        const match = window.location.pathname.match(/\/server\/([a-zA-Z0-9_\-]+)/);
        if (match) serverIdentifier = match[1];
    }

    const [collapsed, setCollapsed] = useState(false);
    const [, setTick] = useState(0);

    // Live tick to keep countdown fresh every 30 seconds
    useEffect(() => {
        const timer = setInterval(() => setTick((t) => t + 1), 30000);
        return () => clearInterval(timer);
    }, []);

    const statusQuery = useQuery<ServerScheduleStatus>({
        queryKey: ['server-suspension-status', serverIdentifier],
        queryFn: async () => {
            if (!serverIdentifier) return { scheduled: false };

            // Primary route: /api/client/servers/{server}/extensions/server-suspension/status
            try {
                const res = await fetch(`/api/client/servers/${serverIdentifier}/extensions/server-suspension/status`);
                if (res.ok) return res.json();
            } catch {}

            // Secondary fallback route: /api/client/extensions/server-suspension/server/{server}/status
            try {
                const res2 = await fetch(`/api/client/extensions/server-suspension/server/${serverIdentifier}/status`);
                if (res2.ok) return res2.json();
            } catch {}

            return { scheduled: false };
        },
        enabled: Boolean(serverIdentifier),
        refetchInterval: 60000,
    });

    const data = statusQuery.data;

    if (!data || !data.scheduled || !data.suspension_date) {
        return null;
    }

    const suspInfo = computeTime(data.suspension_date);
    const termInfo = data.termination_date ? computeTime(data.termination_date) : null;

    if (collapsed) {
        return (
            <div className={`pe-console-banner-mini pe-console-banner-mini-${suspInfo.urgency}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="pe-pulse-dot" />
                    <span style={{ fontWeight: 600, fontSize: '0.8125rem' }}>
                        Suspension scheduled: {suspInfo.formattedDate}
                    </span>
                    <span className={`pe-time-chip pe-time-chip-${suspInfo.urgency}`}>
                        {suspInfo.formattedTimeLeft}
                    </span>
                </div>
                <button
                    type="button"
                    className="pe-banner-btn"
                    onClick={() => setCollapsed(false)}
                >
                    Show Details
                </button>
            </div>
        );
    }

    return (
        <div className={`pe-console-banner pe-console-banner-${suspInfo.urgency}`}>
            {/* Header */}
            <div className="pe-console-banner-top">
                <div className="pe-console-banner-title-wrap">
                    <div className="pe-banner-icon-box">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                    </div>
                    <div>
                        <div className="pe-banner-headline">
                            <span>Scheduled Server Suspension</span>
                            <span className={`pe-time-chip pe-time-chip-${suspInfo.urgency}`}>
                                {suspInfo.formattedTimeLeft}
                            </span>
                        </div>
                        <div className="pe-banner-subline">
                            This server is scheduled to suspend on <strong>{suspInfo.formattedDate}</strong>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button
                        type="button"
                        className="pe-banner-btn"
                        onClick={() => setCollapsed(true)}
                        title="Minimize notice"
                    >
                        Minimize
                    </button>
                </div>
            </div>

            {/* Countdown Progress Bar */}
            <div className="pe-console-progress-wrap">
                <div className="pe-console-progress-track">
                    <div
                        className={`pe-console-progress-fill pe-console-progress-fill-${suspInfo.urgency}`}
                        style={{ width: `${suspInfo.percent}%` }}
                    />
                </div>
                <div className="pe-console-progress-legend">
                    <span>Time remaining: {suspInfo.formattedTimeLeft}</span>
                    <span>Suspension: {suspInfo.formattedDate}</span>
                </div>
            </div>

            {/* Secondary info (Termination Grace & Admin Note) */}
            {(termInfo || data.notes) && (
                <div className="pe-console-banner-extra">
                    {termInfo && (
                        <div className="pe-console-extra-item">
                            <span className="pe-extra-label">Grace Period Termination:</span>
                            <span className="pe-extra-val" style={{ color: '#f87171' }}>
                                Permanent data deletion scheduled for {termInfo.formattedDate} ({termInfo.formattedTimeLeft})
                            </span>
                        </div>
                    )}
                    {data.notes && (
                        <div className="pe-console-extra-item">
                            <span className="pe-extra-label">Note:</span>
                            <span className="pe-extra-val">{data.notes}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
