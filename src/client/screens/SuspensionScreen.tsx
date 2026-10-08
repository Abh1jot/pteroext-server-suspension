import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@pterodactyl/sdk';

interface ServerItem {
    id: number;
    identifier: string;
    uuid: string;
    name: string;
    node: string;
    node_id: number;
    owner: string;
    owner_email: string;
    server_status: string;
    suspension_date: string | null;
    termination_date: string | null;
    notify_user: boolean;
    sched_status: string;
    notes: string;
}

interface NodeItem {
    id: number;
    name: string;
}

interface OverviewData {
    stats: {
        total: number;
        scheduled: number;
        suspended: number;
        terminated: number;
    };
    servers: ServerItem[];
    nodes: NodeItem[];
}

interface TimeLeftInfo {
    hasDate: boolean;
    formattedDate: string;
    formattedTimeLeft: string;
    daysLeft: number;
    hoursLeft: number;
    minutesLeft: number;
    isPastDue: boolean;
    percent: number;
    urgency: 'good' | 'warning' | 'critical';
}

function computeTimeLeft(dateStr: string | null): TimeLeftInfo {
    if (!dateStr) {
        return {
            hasDate: false,
            formattedDate: 'None',
            formattedTimeLeft: 'No date set',
            daysLeft: 0,
            hoursLeft: 0,
            minutesLeft: 0,
            isPastDue: false,
            percent: 100,
            urgency: 'good',
        };
    }

    const target = new Date(dateStr);
    const targetMs = target.getTime();
    const now = Date.now();
    const diffMs = targetMs - now;

    const formattedDate = target.toLocaleDateString(undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }) + ' ' + target.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (diffMs <= 0) {
        return {
            hasDate: true,
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

    // Relative progress bar based on 30-day baseline (scale 6% to 100%)
    const maxMs = 30 * 24 * 60 * 60 * 1000;
    const percent = Math.min(100, Math.max(6, Math.round((diffMs / maxMs) * 100)));

    return {
        hasDate: true,
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

export default function SuspensionScreen() {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [nodeFilter, setNodeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    // Modals
    const [singleModalOpen, setSingleModalOpen] = useState(false);
    const [selectedServerId, setSelectedServerId] = useState<number | null>(null);
    const [bulkModalOpen, setBulkModalOpen] = useState(false);

    // Edit form states
    const [editSuspDate, setEditSuspDate] = useState('');
    const [editTermDate, setEditTermDate] = useState('');
    const [editNotify, setEditNotify] = useState(true);
    const [editNotes, setEditNotes] = useState('');
    const [serverFilterQuery, setServerFilterQuery] = useState('');

    // Bulk form states
    const [bulkSuspDate, setBulkSuspDate] = useState('');
    const [bulkGraceDays, setBulkGraceDays] = useState(7);
    const [bulkNotify, setBulkNotify] = useState(true);
    const [selectedServerIds, setSelectedServerIds] = useState<number[]>([]);

    // Table scrolling & drag states
    const tableCardRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const scrollLeftRef = useRef(0);
    const [isDragging, setIsDragging] = useState(false);

    const scrollTable = (direction: 'left' | 'right') => {
        if (!tableCardRef.current) return;
        const amount = direction === 'left' ? -350 : 350;
        tableCardRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    };

    const handleTableWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        const el = tableCardRef.current;
        if (!el) return;

        // If deltaX is present (native touchpad/trackpad), let browser handle it natively
        if (Math.abs(e.deltaX) > 0) return;

        // Translate vertical wheel on mouse to horizontal scroll if table has overflow
        if (Math.abs(e.deltaY) > 0) {
            const maxScroll = el.scrollWidth - el.clientWidth;
            if (maxScroll <= 0) return;

            const canScrollLeft = el.scrollLeft > 0;
            const canScrollRight = el.scrollLeft < maxScroll - 1;

            if ((e.deltaY > 0 && canScrollRight) || (e.deltaY < 0 && canScrollLeft)) {
                el.scrollLeft += e.deltaY;
                e.preventDefault();
            }
        }
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.button !== 0) return;
        const target = e.target as HTMLElement;
        if (target.closest('button, input, select, a, .pe-btn, .pe-quick-edit-btn, .pe-time-clickable')) {
            return;
        }
        if (!tableCardRef.current) return;

        isDraggingRef.current = true;
        startXRef.current = e.pageX - tableCardRef.current.offsetLeft;
        scrollLeftRef.current = tableCardRef.current.scrollLeft;
        setIsDragging(true);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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

    // Email Template Modal states
    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const [activeMailTab, setActiveMailTab] = useState<'suspension' | 'warning' | 'termination'>('suspension');
    const [mailSuspEnabled, setMailSuspEnabled] = useState(true);
    const [mailSuspSubject, setMailSuspSubject] = useState('[Notice] Server Suspended: {server_name}');
    const [mailSuspBody, setMailSuspBody] = useState('');
    const [mailWarnEnabled, setMailWarnEnabled] = useState(true);
    const [mailWarnSubject, setMailWarnSubject] = useState('[Warning] Your server {server_name} expires soon');
    const [mailWarnBody, setMailWarnBody] = useState('');
    const [mailTermEnabled, setMailTermEnabled] = useState(true);
    const [mailTermSubject, setMailTermSubject] = useState('[Final Notice] Server Terminated: {server_name}');
    const [mailTermBody, setMailTermBody] = useState('');
    const [testEmailAddress, setTestEmailAddress] = useState('');
    const [testEmailSending, setTestEmailSending] = useState(false);

    const overviewQuery = useQuery<OverviewData>({
        queryKey: ['admin-suspension-overview'],
        queryFn: async () => {
            const res = await fetch('/api/admin/extensions/server-suspension/overview');
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || 'Failed to load server suspension overview');
            }
            return res.json();
        },
        staleTime: 5000,
        refetchOnWindowFocus: true,
    });

    const servers = overviewQuery.data?.servers || [];

    // Automatically set default server when servers load
    useEffect(() => {
        if (!selectedServerId && servers.length > 0) {
            setSelectedServerId(servers[0].id);
        }
    }, [servers, selectedServerId]);

    const updateScheduleMutation = useMutation({
        mutationFn: async (payload: { server_id: number; suspension_date: string | null; termination_date: string | null; notify_user: boolean; notes: string }) => {
            const res = await fetch('/api/admin/extensions/server-suspension/schedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to update schedule');
            return data;
        },
        onSuccess: (data) => {
            toast.success(data.message || 'Schedule updated');
            setSingleModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['admin-suspension-overview'] });
        },
        onError: (err: any) => toast.error(err.message),
    });

    const bulkScheduleMutation = useMutation({
        mutationFn: async (payload: { server_ids: number[]; suspension_date: string; termination_days_after: number; notify_user: boolean }) => {
            const res = await fetch('/api/admin/extensions/server-suspension/bulk-schedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to apply bulk schedule');
            return data;
        },
        onSuccess: (data) => {
            toast.success(data.message || 'Bulk schedule saved');
            setBulkModalOpen(false);
            setSelectedServerIds([]);
            queryClient.invalidateQueries({ queryKey: ['admin-suspension-overview'] });
        },
        onError: (err: any) => toast.error(err.message),
    });

    const actionMutation = useMutation({
        mutationFn: async ({ server_id, action }: { server_id: number; action: string }) => {
            const res = await fetch('/api/admin/extensions/server-suspension/action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ server_id, action }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to perform action');
            return data;
        },
        onSuccess: (data) => {
            toast.success(data.message || 'Action executed successfully');
            queryClient.invalidateQueries({ queryKey: ['admin-suspension-overview'] });
        },
        onError: (err: any) => toast.error(err.message),
    });

    const processDueMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch('/api/admin/extensions/server-suspension/process-due', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to process due items');
            return data;
        },
        onSuccess: (data) => {
            toast.success(data.message || 'Due schedules processed');
            queryClient.invalidateQueries({ queryKey: ['admin-suspension-overview'] });
        },
        onError: (err: any) => toast.error(err.message),
    });

    const mailTemplatesQuery = useQuery({
        queryKey: ['admin-suspension-mail-templates'],
        queryFn: async () => {
            const res = await fetch('/api/admin/extensions/server-suspension/mail-templates');
            if (!res.ok) throw new Error('Failed to load email notification templates');
            return res.json();
        },
        enabled: emailModalOpen,
    });

    useEffect(() => {
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
                termination_mail_body: mailTermBody,
            };
            const res = await fetch('/api/admin/extensions/server-suspension/mail-templates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to save email templates');
            return data;
        },
        onSuccess: (data) => {
            toast.success(data.message || 'Email templates saved successfully');
            queryClient.invalidateQueries({ queryKey: ['admin-suspension-mail-templates'] });
        },
        onError: (err: any) => toast.error(err.message),
    });

    const handleSendTestEmail = async () => {
        if (!testEmailAddress.trim()) {
            toast.error('Please enter a destination email address for the test.');
            return;
        }
        setTestEmailSending(true);
        try {
            let subject = mailSuspSubject;
            let body = mailSuspBody;
            if (activeMailTab === 'warning') {
                subject = mailWarnSubject;
                body = mailWarnBody;
            } else if (activeMailTab === 'termination') {
                subject = mailTermSubject;
                body = mailTermBody;
            }

            const res = await fetch('/api/admin/extensions/server-suspension/test-mail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    template_type: activeMailTab,
                    subject,
                    body,
                    email: testEmailAddress.trim(),
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to deliver test email');
            toast.success(data.message || 'Test email dispatched successfully!');
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setTestEmailSending(false);
        }
    };

    const insertPlaceholder = (tag: string) => {
        if (activeMailTab === 'suspension') {
            setMailSuspBody((prev) => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + tag);
        } else if (activeMailTab === 'warning') {
            setMailWarnBody((prev) => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + tag);
        } else {
            setMailTermBody((prev) => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + tag);
        }
        toast.info(`Inserted placeholder ${tag}`);
    };


    const openEdit = (server: ServerItem) => {
        setSelectedServerId(server.id);
        setEditSuspDate(server.suspension_date ? server.suspension_date.slice(0, 16) : '');
        setEditTermDate(server.termination_date ? server.termination_date.slice(0, 16) : '');
        setEditNotify(server.notify_user);
        setEditNotes(server.notes || '');
        setServerFilterQuery('');
        setSingleModalOpen(true);
    };

    const openScheduleNew = () => {
        setServerFilterQuery('');
        const targetServer = (selectedServerId && servers.find((s) => s.id === selectedServerId)) || servers[0];
        if (targetServer) {
            setSelectedServerId(targetServer.id);
            setEditSuspDate(targetServer.suspension_date ? targetServer.suspension_date.slice(0, 16) : '');
            setEditTermDate(targetServer.termination_date ? targetServer.termination_date.slice(0, 16) : '');
            setEditNotify(targetServer.notify_user);
            setEditNotes(targetServer.notes || '');
        } else {
            setEditSuspDate('');
            setEditTermDate('');
            setEditNotify(true);
            setEditNotes('');
        }
        setSingleModalOpen(true);
    };

    const selectTargetServerInModal = (id: number) => {
        setSelectedServerId(id);
        const target = servers.find((s) => s.id === id);
        if (target) {
            setEditSuspDate(target.suspension_date ? target.suspension_date.slice(0, 16) : '');
            setEditTermDate(target.termination_date ? target.termination_date.slice(0, 16) : '');
            setEditNotify(target.notify_user);
            setEditNotes(target.notes || '');
        }
    };

    const setSuspensionDays = (days: number) => {
        const d = new Date();
        d.setDate(d.getDate() + days);
        const pad = (n: number) => String(n).padStart(2, '0');
        const str = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        setEditSuspDate(str);
    };

    const setTerminationGrace = (daysAfter: number) => {
        const base = editSuspDate ? new Date(editSuspDate) : new Date();
        base.setDate(base.getDate() + daysAfter);
        const pad = (n: number) => String(n).padStart(2, '0');
        const str = `${base.getFullYear()}-${pad(base.getMonth() + 1)}-${pad(base.getDate())}T${pad(base.getHours())}:${pad(base.getMinutes())}`;
        setEditTermDate(str);
    };

    const filteredServers = servers.filter((s) => {
        const matchesQuery =
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.owner_email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesNode = nodeFilter === 'all' || s.node_id === Number(nodeFilter);

        let matchesStatus = true;
        if (statusFilter === 'active') matchesStatus = s.server_status !== 'suspended' && !s.suspension_date;
        if (statusFilter === 'scheduled') matchesStatus = Boolean(s.suspension_date) && s.server_status !== 'suspended';
        if (statusFilter === 'suspended') matchesStatus = s.server_status === 'suspended';

        return matchesQuery && matchesNode && matchesStatus;
    });

    const toggleSelectServer = (id: number) => {
        setSelectedServerIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
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
        return (
            s.name.toLowerCase().includes(q) ||
            s.identifier.toLowerCase().includes(q) ||
            s.owner.toLowerCase().includes(q) ||
            s.owner_email.toLowerCase().includes(q)
        );
    });

    const activeModalServer = servers.find((s) => s.id === selectedServerId);
    const modalPreviewTime = computeTimeLeft(editSuspDate || null);
    const modalPreviewTerm = computeTimeLeft(editTermDate || null);

    return (
        <div className="pe-container">
            {/* Header */}
            <div className="pe-header">
                <div className="pe-title-wrap">
                    <h2 className="pe-title">Auto Server Suspension & Termination</h2>
                    <p className="pe-subtitle">
                        Manage automated expiration schedules, owner suspension notifications, and grace-period server termination.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button
                        type="button"
                        className="pe-btn pe-btn-primary"
                        onClick={openScheduleNew}
                    >
                        + Set Suspension Date
                    </button>
                    <button
                        type="button"
                        className="pe-btn pe-btn-secondary"
                        onClick={() => setBulkModalOpen(true)}
                    >
                        Bulk Schedule {selectedServerIds.length > 0 ? `(${selectedServerIds.length})` : ''}
                    </button>
                    <button
                        type="button"
                        className="pe-btn pe-btn-secondary"
                        disabled={processDueMutation.isPending}
                        onClick={() => processDueMutation.mutate()}
                    >
                        {processDueMutation.isPending ? <span className="pe-spinner" /> : 'Process Due Schedules'}
                    </button>
                    <button
                        type="button"
                        className="pe-btn pe-btn-secondary"
                        onClick={() => setEmailModalOpen(true)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                        </svg>
                        Email Templates
                    </button>
                </div>
            </div>

            {/* Statistics Row */}
            <div className="pe-stats-row">
                <div className="pe-stat-card">
                    <span className="pe-stat-val">{overviewQuery.data?.stats.total ?? 0}</span>
                    <span className="pe-stat-label">Total Servers</span>
                </div>
                <div className="pe-stat-card">
                    <span className="pe-stat-val" style={{ color: '#facc15' }}>
                        {overviewQuery.data?.stats.scheduled ?? 0}
                    </span>
                    <span className="pe-stat-label">Scheduled for Suspension</span>
                </div>
                <div className="pe-stat-card">
                    <span className="pe-stat-val" style={{ color: '#f87171' }}>
                        {overviewQuery.data?.stats.suspended ?? 0}
                    </span>
                    <span className="pe-stat-label">Currently Suspended</span>
                </div>
                <div className="pe-stat-card">
                    <span className="pe-stat-val" style={{ color: '#94a3b8' }}>
                        {overviewQuery.data?.stats.terminated ?? 0}
                    </span>
                    <span className="pe-stat-label">Terminated</span>
                </div>
            </div>

            {/* Controls Toolbar */}
            <div className="pe-toolbar">
                <div className="pe-input-box">
                    <svg className="pe-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        className="pe-input"
                        type="text"
                        placeholder="Search servers by name, identifier, or owner email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <select
                    className="pe-select"
                    value={nodeFilter}
                    onChange={(e) => setNodeFilter(e.target.value)}
                >
                    <option value="all">All Nodes</option>
                    {overviewQuery.data?.nodes?.map((n) => (
                        <option key={n.id} value={n.id}>
                            {n.name}
                        </option>
                    ))}
                </select>

                <select
                    className="pe-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="suspended">Suspended</option>
                </select>
            </div>

            {/* Table Meta Bar with Scroll Controls */}
            <div className="pe-table-meta-bar">
                <div className="pe-table-meta-count">
                    Showing <strong>{filteredServers.length}</strong> of <strong>{servers.length}</strong> panel servers
                </div>
                <div className="pe-table-scroll-controls">
                    <span className="pe-scroll-hint">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        Scroll table:
                    </span>
                    <button
                        type="button"
                        className="pe-scroll-btn"
                        title="Scroll table left"
                        onClick={() => scrollTable('left')}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        Left
                    </button>
                    <button
                        type="button"
                        className="pe-scroll-btn"
                        title="Scroll table right"
                        onClick={() => scrollTable('right')}
                    >
                        Right
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <div
                ref={tableCardRef}
                className={`pe-table-card ${isDragging ? 'pe-table-dragging' : ''}`}
                onWheel={handleTableWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <table className="pe-table">
                    <thead>
                        <tr>
                            <th style={{ width: 44, textAlign: 'center' }}>
                                <input
                                    type="checkbox"
                                    checked={filteredServers.length > 0 && selectedServerIds.length === filteredServers.length}
                                    onChange={selectAllFiltered}
                                />
                            </th>
                            <th style={{ minWidth: 170 }}>Server</th>
                            <th style={{ minWidth: 170 }}>Node / Owner</th>
                            <th style={{ minWidth: 110 }}>Status</th>
                            <th style={{ minWidth: 220 }}>Suspension Date & Time Left</th>
                            <th style={{ minWidth: 200 }}>Termination Grace</th>
                            <th className="pe-col-sticky-right" style={{ minWidth: 250, textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {overviewQuery.isLoading ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: '36px 0' }}>
                                    <span className="pe-spinner" />
                                    <p className="pe-subtitle" style={{ marginTop: 8 }}>Loading panel servers...</p>
                                </td>
                            </tr>
                        ) : filteredServers.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: '36px 0' }}>
                                    <p className="pe-subtitle">No matching servers found on panel.</p>
                                </td>
                            </tr>
                        ) : (
                            filteredServers.map((server) => {
                                const isSuspended = server.server_status === 'suspended';
                                const hasSchedule = Boolean(server.suspension_date);
                                const suspTimeInfo = computeTimeLeft(server.suspension_date);
                                const termTimeInfo = computeTimeLeft(server.termination_date);

                                return (
                                    <tr key={server.id}>
                                        <td style={{ textAlign: 'center' }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedServerIds.includes(server.id)}
                                                onChange={() => toggleSelectServer(server.id)}
                                            />
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{server.name}</div>
                                                    <div style={{ fontSize: '0.72rem', color: 'var(--muted-foreground, #94a3b8)', fontFamily: 'monospace' }}>
                                                        {server.identifier}
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="pe-quick-edit-btn"
                                                    title={hasSchedule ? 'Edit Expiration Schedule' : 'Set Suspension Date'}
                                                    onClick={() => openEdit(server)}
                                                >
                                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                    </svg>
                                                    <span>{hasSchedule ? 'Edit' : 'Set Date'}</span>
                                                </button>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '0.8125rem' }}>{server.node}</div>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--muted-foreground, #94a3b8)' }}>
                                                {server.owner} ({server.owner_email})
                                            </div>
                                        </td>
                                        <td>
                                            {isSuspended ? (
                                                <span className="pe-badge pe-badge-suspended">
                                                    <span className="pe-badge-dot" />
                                                    Suspended
                                                </span>
                                            ) : hasSchedule ? (
                                                <span className="pe-badge pe-badge-scheduled">
                                                    <span className="pe-badge-dot" />
                                                    Scheduled
                                                </span>
                                            ) : (
                                                <span className="pe-badge pe-badge-active">
                                                    <span className="pe-badge-dot" />
                                                    Active
                                                </span>
                                            )}
                                        </td>

                                        {/* Suspension Date & Time Left Progress Bar */}
                                        <td>
                                            {suspTimeInfo.hasDate ? (
                                                <div
                                                    className="pe-time-cell pe-time-clickable"
                                                    title="Click to edit suspension schedule"
                                                    onClick={() => openEdit(server)}
                                                >
                                                    <div className="pe-time-header">
                                                        <span className="pe-time-date">{suspTimeInfo.formattedDate}</span>
                                                        <span className={`pe-time-chip pe-time-chip-${suspTimeInfo.urgency}`}>
                                                            {suspTimeInfo.formattedTimeLeft}
                                                        </span>
                                                    </div>
                                                    <div
                                                        className="pe-progress-track"
                                                        title={`Suspension due: ${suspTimeInfo.formattedDate} (${suspTimeInfo.formattedTimeLeft})`}
                                                    >
                                                        <div
                                                            className={`pe-progress-fill pe-progress-fill-${suspTimeInfo.urgency}`}
                                                            style={{ width: `${suspTimeInfo.percent}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    className="pe-time-cell pe-time-clickable"
                                                    title="Click to set suspension date"
                                                    onClick={() => openEdit(server)}
                                                    style={{ display: 'inline-flex' }}
                                                >
                                                    <span className="pe-time-chip pe-time-chip-muted pe-time-chip-hoverable">
                                                        + Set Expiration Date
                                                    </span>
                                                </div>
                                            )}
                                        </td>

                                        {/* Permanent Termination Grace Period */}
                                        <td>
                                            {termTimeInfo.hasDate ? (
                                                <div
                                                    className="pe-time-cell pe-time-clickable"
                                                    title="Click to edit termination grace period"
                                                    onClick={() => openEdit(server)}
                                                >
                                                    <div className="pe-time-header">
                                                        <span className="pe-time-date" style={{ color: '#f87171' }}>{termTimeInfo.formattedDate}</span>
                                                        <span className={`pe-time-chip pe-time-chip-${termTimeInfo.urgency}`}>
                                                            {termTimeInfo.formattedTimeLeft}
                                                        </span>
                                                    </div>
                                                    <div
                                                        className="pe-progress-track"
                                                        title={`Termination: ${termTimeInfo.formattedDate} (${termTimeInfo.formattedTimeLeft})`}
                                                    >
                                                        <div
                                                            className={`pe-progress-fill pe-progress-fill-${termTimeInfo.urgency}`}
                                                            style={{ width: `${termTimeInfo.percent}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground, #64748b)' }}>None</span>
                                            )}
                                        </td>

                                        {/* Actions Column (Sticky on Right) */}
                                        <td className="pe-col-sticky-right">
                                            <div className="pe-actions-wrap">
                                                <button
                                                    type="button"
                                                    className="pe-btn pe-btn-primary pe-btn-sm"
                                                    onClick={() => openEdit(server)}
                                                >
                                                    {hasSchedule ? 'Edit Expiration' : 'Set Suspension Date'}
                                                </button>
                                                {hasSchedule && (
                                                    <button
                                                        type="button"
                                                        className="pe-btn pe-btn-secondary pe-btn-sm"
                                                        title="Remove scheduled suspension & termination"
                                                        onClick={() => actionMutation.mutate({ server_id: server.id, action: 'cancel' })}
                                                    >
                                                        Remove Schedule
                                                    </button>
                                                )}
                                                {isSuspended ? (
                                                    <button
                                                        type="button"
                                                        className="pe-btn pe-btn-secondary pe-btn-sm"
                                                        disabled={actionMutation.isPending}
                                                        onClick={() => actionMutation.mutate({ server_id: server.id, action: 'unsuspend' })}
                                                    >
                                                        Unsuspend
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className="pe-btn pe-btn-danger pe-btn-sm"
                                                        disabled={actionMutation.isPending}
                                                        onClick={() => actionMutation.mutate({ server_id: server.id, action: 'suspend' })}
                                                    >
                                                        Suspend Now
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Single Server Schedule Modal */}
            {singleModalOpen && (
                <div className="pe-modal-overlay" onClick={() => setSingleModalOpen(false)}>
                    <div className="pe-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="pe-modal-header">
                            <h3 className="pe-title" style={{ fontSize: '1.1rem' }}>
                                Schedule Server Suspension & Expiration
                            </h3>
                            <button
                                type="button"
                                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.4rem', cursor: 'pointer' }}
                                onClick={() => setSingleModalOpen(false)}
                            >
                                &times;
                            </button>
                        </div>

                        {/* Step 1: Select Server with Search Filter */}
                        <div className="pe-form-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label className="pe-form-label">Select Target Server</label>
                                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                    {servers.length} servers available
                                </span>
                            </div>
                            <input
                                type="text"
                                className="pe-input"
                                placeholder="Search servers by name or identifier..."
                                style={{ marginBottom: 6, fontSize: '0.8125rem' }}
                                value={serverFilterQuery}
                                onChange={(e) => setServerFilterQuery(e.target.value)}
                            />
                            <select
                                className="pe-select"
                                style={{ width: '100%' }}
                                value={selectedServerId ?? ''}
                                onChange={(e) => selectTargetServerInModal(Number(e.target.value))}
                            >
                                {overviewQuery.isLoading && <option value="">Loading servers...</option>}
                                {!overviewQuery.isLoading && servers.length === 0 && (
                                    <option value="">No servers available on panel</option>
                                )}
                                {!overviewQuery.isLoading && servers.length > 0 && modalFilteredServers.length === 0 && (
                                    <option value="">No servers matching filter</option>
                                )}
                                {modalFilteredServers.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name} ({s.identifier}) - Owner: {s.owner}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Step 2: Suspension Date & Quick Presets */}
                        <div className="pe-form-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                <label className="pe-form-label" style={{ marginBottom: 0 }}>Suspension Date & Time</label>
                                <div style={{ display: 'flex', gap: 4 }}>
                                    <button type="button" className="pe-btn-preset" onClick={() => setSuspensionDays(3)}>+3d</button>
                                    <button type="button" className="pe-btn-preset" onClick={() => setSuspensionDays(7)}>+7d</button>
                                    <button type="button" className="pe-btn-preset" onClick={() => setSuspensionDays(14)}>+14d</button>
                                    <button type="button" className="pe-btn-preset" onClick={() => setSuspensionDays(30)}>+30d</button>
                                    <button type="button" className="pe-btn-preset" onClick={() => setSuspensionDays(60)}>+60d</button>
                                </div>
                            </div>
                            <input
                                type="datetime-local"
                                className="pe-input"
                                value={editSuspDate}
                                onChange={(e) => setEditSuspDate(e.target.value)}
                            />
                        </div>

                        {/* Step 3: Termination Date & Grace Presets */}
                        <div className="pe-form-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                <label className="pe-form-label" style={{ marginBottom: 0 }}>Permanent Termination Date (Optional)</label>
                                <div style={{ display: 'flex', gap: 4 }}>
                                    <button type="button" className="pe-btn-preset" onClick={() => setTerminationGrace(3)}>+3d Grace</button>
                                    <button type="button" className="pe-btn-preset" onClick={() => setTerminationGrace(7)}>+7d Grace</button>
                                    <button type="button" className="pe-btn-preset" onClick={() => setTerminationGrace(14)}>+14d Grace</button>
                                    <button type="button" className="pe-btn-preset" onClick={() => setEditTermDate('')}>Clear</button>
                                </div>
                            </div>
                            <input
                                type="datetime-local"
                                className="pe-input"
                                value={editTermDate}
                                onChange={(e) => setEditTermDate(e.target.value)}
                            />
                        </div>

                        {/* Live Suspension Countdown & Progress Bar Preview */}
                        {editSuspDate && (
                            <div className="pe-preview-card">
                                <div className="pe-preview-title">Schedule Timeline & Countdown</div>
                                <div className="pe-preview-row">
                                    <div>
                                        <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#ffffff' }}>
                                            {activeModalServer ? activeModalServer.name : 'Selected Server'}
                                        </span>
                                        <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginLeft: 6 }}>
                                            will suspend on {modalPreviewTime.formattedDate}
                                        </span>
                                    </div>
                                    <span className={`pe-time-chip pe-time-chip-${modalPreviewTime.urgency}`}>
                                        {modalPreviewTime.formattedTimeLeft}
                                    </span>
                                </div>
                                <div className="pe-progress-track" title={modalPreviewTime.formattedTimeLeft}>
                                    <div
                                        className={`pe-progress-fill pe-progress-fill-${modalPreviewTime.urgency}`}
                                        style={{ width: `${modalPreviewTime.percent}%` }}
                                    />
                                </div>
                                {editTermDate && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: 4, color: '#f87171' }}>
                                        <span>Grace Period Termination: {modalPreviewTerm.formattedDate}</span>
                                        <span>{modalPreviewTerm.formattedTimeLeft}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 4: Notification toggle */}
                        <div className="pe-form-group">
                            <label className="pe-checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={editNotify}
                                    onChange={(e) => setEditNotify(e.target.checked)}
                                />
                                <span>Send automated email notification to server owner upon suspension</span>
                            </label>
                        </div>

                        {/* Step 5: Notes */}
                        <div className="pe-form-group">
                            <label className="pe-form-label">Internal Notes / Reason</label>
                            <textarea
                                className="pe-input"
                                rows={2}
                                placeholder="e.g. Monthly trial expiration, invoice #10842 unpaid..."
                                value={editNotes}
                                onChange={(e) => setEditNotes(e.target.value)}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
                            {selectedServerId && activeModalServer?.suspension_date ? (
                                <button
                                    type="button"
                                    className="pe-btn pe-btn-danger"
                                    onClick={() => {
                                        actionMutation.mutate({ server_id: selectedServerId, action: 'cancel' });
                                        setSingleModalOpen(false);
                                    }}
                                >
                                    Cancel Schedule
                                </button>
                            ) : <div />}

                            <div style={{ display: 'flex', gap: 8 }}>
                                <button
                                    type="button"
                                    className="pe-btn pe-btn-secondary"
                                    onClick={() => setSingleModalOpen(false)}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="pe-btn pe-btn-primary"
                                    disabled={updateScheduleMutation.isPending || !selectedServerId}
                                    onClick={() => {
                                        if (!selectedServerId) {
                                            toast.error('Please select a target server first');
                                            return;
                                        }
                                        updateScheduleMutation.mutate({
                                            server_id: selectedServerId,
                                            suspension_date: editSuspDate || null,
                                            termination_date: editTermDate || null,
                                            notify_user: editNotify,
                                            notes: editNotes,
                                        });
                                    }}
                                >
                                    {updateScheduleMutation.isPending ? <span className="pe-spinner" /> : 'Save Schedule'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Schedule Modal */}
            {bulkModalOpen && (
                <div className="pe-modal-overlay" onClick={() => setBulkModalOpen(false)}>
                    <div className="pe-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="pe-modal-header">
                            <h3 className="pe-title" style={{ fontSize: '1.1rem' }}>
                                Bulk Schedule Servers ({selectedServerIds.length > 0 ? selectedServerIds.length : filteredServers.length} servers)
                            </h3>
                            <button
                                type="button"
                                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.4rem', cursor: 'pointer' }}
                                onClick={() => setBulkModalOpen(false)}
                            >
                                &times;
                            </button>
                        </div>

                        <div className="pe-form-group">
                            <label className="pe-form-label">Suspension Date & Time</label>
                            <input
                                type="datetime-local"
                                className="pe-input"
                                value={bulkSuspDate}
                                onChange={(e) => setBulkSuspDate(e.target.value)}
                            />
                        </div>

                        <div className="pe-form-group">
                            <label className="pe-form-label">Grace Period Before Termination (Days after suspension)</label>
                            <input
                                type="number"
                                min={0}
                                max={365}
                                className="pe-input"
                                value={bulkGraceDays}
                                onChange={(e) => setBulkGraceDays(Number(e.target.value))}
                            />
                        </div>

                        <div className="pe-form-group">
                            <label className="pe-checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={bulkNotify}
                                    onChange={(e) => setBulkNotify(e.target.checked)}
                                />
                                <span>Notify server owners via email upon suspension</span>
                            </label>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
                            <button
                                type="button"
                                className="pe-btn pe-btn-secondary"
                                onClick={() => setBulkModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="pe-btn pe-btn-primary"
                                disabled={!bulkSuspDate || bulkScheduleMutation.isPending}
                                onClick={() => {
                                    const targetIds = selectedServerIds.length > 0 ? selectedServerIds : filteredServers.map((s) => s.id);
                                    bulkScheduleMutation.mutate({
                                        server_ids: targetIds,
                                        suspension_date: bulkSuspDate,
                                        termination_days_after: bulkGraceDays,
                                        notify_user: bulkNotify,
                                    });
                                }}
                            >
                                {bulkScheduleMutation.isPending ? <span className="pe-spinner" /> : 'Apply Bulk Schedule'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Email Notification Templates Modal */}
            {emailModalOpen && (
                <div className="pe-modal-overlay" onClick={() => setEmailModalOpen(false)}>
                    <div
                        className="pe-modal"
                        style={{ maxWidth: 760, maxHeight: '90vh', overflowY: 'auto' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="pe-modal-header" style={{ marginBottom: 16 }}>
                            <div>
                                <h3 className="pe-title" style={{ fontSize: '1.15rem' }}>
                                    Email Notification Templates
                                </h3>
                                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
                                    Configure customized emails delivered to clients when servers expire, suspend, or terminate.
                                </p>
                            </div>
                            <button
                                type="button"
                                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.4rem', cursor: 'pointer' }}
                                onClick={() => setEmailModalOpen(false)}
                            >
                                &times;
                            </button>
                        </div>

                        {/* Template Type Tabs */}
                        <div className="pe-tab-row">
                            <button
                                type="button"
                                className={`pe-tab-btn ${activeMailTab === 'suspension' ? 'pe-tab-active' : ''}`}
                                onClick={() => setActiveMailTab('suspension')}
                            >
                                Suspension Notice
                            </button>
                            <button
                                type="button"
                                className={`pe-tab-btn ${activeMailTab === 'warning' ? 'pe-tab-active' : ''}`}
                                onClick={() => setActiveMailTab('warning')}
                            >
                                Expiration Warning (24h)
                            </button>
                            <button
                                type="button"
                                className={`pe-tab-btn ${activeMailTab === 'termination' ? 'pe-tab-active' : ''}`}
                                onClick={() => setActiveMailTab('termination')}
                            >
                                Termination Notice
                            </button>
                        </div>

                        {/* Active Template Controls */}
                        {(() => {
                            const isSusp = activeMailTab === 'suspension';
                            const isWarn = activeMailTab === 'warning';

                            const enabled = isSusp ? mailSuspEnabled : isWarn ? mailWarnEnabled : mailTermEnabled;
                            const setEnabled = isSusp ? setMailSuspEnabled : isWarn ? setMailWarnEnabled : setMailTermEnabled;
                            const subject = isSusp ? mailSuspSubject : isWarn ? mailWarnSubject : mailTermSubject;
                            const setSubject = isSusp ? setMailSuspSubject : isWarn ? setMailWarnSubject : setMailTermSubject;
                            const body = isSusp ? mailSuspBody : isWarn ? mailWarnBody : mailTermBody;
                            const setBody = isSusp ? setMailSuspBody : isWarn ? setMailWarnBody : setMailTermBody;

                            const title = isSusp ? 'Server Suspension Notice' : isWarn ? 'Expiration Warning Notice' : 'Server Termination Notice';
                            const desc = isSusp
                                ? 'Delivered immediately when a server reaches its scheduled expiration date and is suspended.'
                                : isWarn
                                ? 'Delivered 24 hours prior to expiration to notify owners to renew their server in advance.'
                                : 'Delivered when a server exceeds its grace period and is flagged for permanent termination.';
                            const badge = isSusp ? 'SUSPENDED' : isWarn ? 'EXPIRING SOON' : 'TERMINATED';
                            const badgeBg = isSusp ? '#ef4444' : isWarn ? '#f59e0b' : '#991b1b';

                            const previewSubj = subject
                                .replace(/{server_name}/gi, 'Survival SMP Production')
                                .replace(/{username}/gi, 'Steve')
                                .replace(/{server_id}/gi, '142');

                            const previewBody = body
                                .replace(/{server_name}/gi, 'Survival SMP Production')
                                .replace(/{username}/gi, 'Steve')
                                .replace(/{server_id}/gi, '142')
                                .replace(/{server_uuid}/gi, 'a8f39b1c')
                                .replace(/{suspension_date}/gi, 'Tomorrow, 18:00')
                                .replace(/{termination_date}/gi, 'In 7 days, 18:00')
                                .replace(/{panel_url}/gi, window.location.origin);

                            return (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    {/* Enable toggle */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.6)', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                                        <div>
                                            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f8fafc' }}>{title}</span>
                                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0 0' }}>{desc}</p>
                                        </div>
                                        <label className="pe-checkbox-label" style={{ margin: 0 }}>
                                            <input
                                                type="checkbox"
                                                checked={enabled}
                                                onChange={(e) => setEnabled(e.target.checked)}
                                            />
                                            <span style={{ fontSize: '0.8125rem' }}>Active</span>
                                        </label>
                                    </div>

                                    {/* Subject */}
                                    <div className="pe-form-group">
                                        <label className="pe-form-label">Email Subject</label>
                                        <input
                                            type="text"
                                            className="pe-input"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            placeholder="e.g. [Notice] Server Suspended: {server_name}"
                                        />
                                    </div>

                                    {/* Body & Placeholders */}
                                    <div className="pe-form-group">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                            <label className="pe-form-label" style={{ marginBottom: 0 }}>
                                                Email Body Template
                                            </label>
                                            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                                Click placeholder chip to insert
                                            </span>
                                        </div>

                                        {/* Placeholder Badges */}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                                            {['{username}', '{server_name}', '{server_id}', '{server_uuid}', '{suspension_date}', '{termination_date}', '{panel_url}'].map((tag) => (
                                                <button
                                                    key={tag}
                                                    type="button"
                                                    className="pe-tag-chip"
                                                    onClick={() => insertPlaceholder(tag)}
                                                    title={`Click to append ${tag}`}
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>

                                        <textarea
                                            className="pe-input"
                                            style={{ minHeight: 130, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', fontSize: '0.8125rem', lineHeight: '1.5' }}
                                            value={body}
                                            onChange={(e) => setBody(e.target.value)}
                                            placeholder="Compose email template message..."
                                        />
                                    </div>

                                    {/* Live Email Preview Card */}
                                    <div>
                                        <label className="pe-form-label" style={{ marginBottom: 4 }}>
                                            Live Email Preview (Sample Client View)
                                        </label>
                                        <div className="pe-email-preview">
                                            <div className="pe-email-preview-header">
                                                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
                                                    Pterodactyl Panel
                                                </span>
                                                <span
                                                    style={{
                                                        padding: '3px 8px',
                                                        fontSize: '0.68rem',
                                                        fontWeight: 700,
                                                        background: badgeBg,
                                                        color: '#ffffff',
                                                        borderRadius: 4,
                                                        letterSpacing: '0.04em',
                                                    }}
                                                >
                                                    {badge}
                                                </span>
                                            </div>
                                            <h4 className="pe-email-preview-title">{previewSubj || '(No subject)'}</h4>
                                            <div className="pe-email-preview-body">
                                                {previewBody || '(No message body provided)'}
                                            </div>
                                            <table className="pe-email-preview-meta">
                                                <tbody>
                                                    <tr>
                                                        <td style={{ color: '#94a3b8' }}>Target Server:</td>
                                                        <td style={{ textAlign: 'right', color: '#f1f5f9', fontWeight: 600 }}>Survival SMP Production (#142)</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ color: '#94a3b8' }}>Effective Date:</td>
                                                        <td style={{ textAlign: 'right', color: '#f1f5f9', fontWeight: 600 }}>Tomorrow, 18:00</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <div style={{ textAlign: 'center', marginTop: 14 }}>
                                                <span className="pe-email-preview-btn">Open Control Panel &rarr;</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Test Email Toolbar */}
                                    <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '12px 14px', borderRadius: 8, border: '1px solid #334155' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0' }}>
                                                Send Test Email
                                            </span>
                                            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                                Verifies mail transport configuration & design
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <input
                                                type="email"
                                                className="pe-input"
                                                placeholder="admin@example.com"
                                                value={testEmailAddress}
                                                onChange={(e) => setTestEmailAddress(e.target.value)}
                                                style={{ flex: 1, fontSize: '0.8125rem' }}
                                            />
                                            <button
                                                type="button"
                                                className="pe-btn pe-btn-secondary"
                                                disabled={testEmailSending || !testEmailAddress.trim()}
                                                onClick={handleSendTestEmail}
                                                style={{ whiteSpace: 'nowrap' }}
                                            >
                                                {testEmailSending ? <span className="pe-spinner" /> : 'Send Test'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Modal Footer */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 24, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14 }}>
                            <button
                                type="button"
                                className="pe-btn pe-btn-secondary"
                                onClick={() => setEmailModalOpen(false)}
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                className="pe-btn pe-btn-primary"
                                disabled={saveMailTemplatesMutation.isPending}
                                onClick={() => saveMailTemplatesMutation.mutate()}
                            >
                                {saveMailTemplatesMutation.isPending ? <span className="pe-spinner" /> : 'Save All Templates'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
