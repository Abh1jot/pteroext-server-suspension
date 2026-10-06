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
    }) + ' • ' + target.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (diffMs <= 0) {
        return {
            formattedDate,
            formattedTimeLeft: 'Past due (Pending)',
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
        formattedTimeLeft = `${days}d ${hours}h left`;
    } else if (hours > 0) {
        formattedTimeLeft = `${hours}h ${minutes}m left`;
    } else {
        formattedTimeLeft = `${Math.max(1, minutes)}m left`;
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
    const percent = Math.min(100, Math.max(4, Math.round((diffMs / maxMs) * 100)));

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

    const [, setTick] = useState(0);

    // Refresh time calculations periodically without re-fetching
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

    return (
        <div className={`pe-slim-banner pe-slim-banner-${suspInfo.urgency}`}>
            <div className="pe-slim-banner-body">
                {/* Left side: Icon, Title, Date, Chip */}
                <div className="pe-slim-banner-left">
                    <svg
                        className="pe-slim-icon"
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>

                    <span className="pe-slim-title">Server Suspension:</span>
                    <span className="pe-slim-date">{suspInfo.formattedDate}</span>
                    <span className={`pe-slim-chip pe-slim-chip-${suspInfo.urgency}`}>
                        {suspInfo.formattedTimeLeft}
                    </span>
                </div>

                {/* Right side: Optional Grace Termination & Note */}
                <div className="pe-slim-banner-right">
                    {termInfo && (
                        <span className="pe-slim-term-notice" title={`Permanent termination date: ${termInfo.formattedDate}`}>
                            Termination: {termInfo.formattedDate.split('•')[0]} ({termInfo.formattedTimeLeft})
                        </span>
                    )}
                    {data.notes && (
                        <span className="pe-slim-note" title={data.notes}>
                            {data.notes}
                        </span>
                    )}
                </div>
            </div>

            {/* Ultra-thin 3px bottom progress indicator */}
            <div className="pe-slim-track" title={`Suspension in ${suspInfo.formattedTimeLeft} (${suspInfo.formattedDate})`}>
                <div
                    className={`pe-slim-fill pe-slim-fill-${suspInfo.urgency}`}
                    style={{ width: `${suspInfo.percent}%` }}
                />
            </div>
        </div>
    );
}
