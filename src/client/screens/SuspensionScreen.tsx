import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@pterodactyl/sdk';

interface ServerItem {
    id: number;
    identifier: string;
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

export default function SuspensionScreen() {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [nodeFilter, setNodeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    // Modals
    const [editServer, setEditServer] = useState<ServerItem | null>(null);
    const [bulkModalOpen, setBulkModalOpen] = useState(false);

    // Edit form states
    const [editSuspDate, setEditSuspDate] = useState('');
    const [editTermDate, setEditTermDate] = useState('');
    const [editNotify, setEditNotify] = useState(true);
    const [editNotes, setEditNotes] = useState('');

    // Bulk form states
    const [bulkSuspDate, setBulkSuspDate] = useState('');
    const [bulkGraceDays, setBulkGraceDays] = useState(7);
    const [bulkNotify, setBulkNotify] = useState(true);
    const [selectedServerIds, setSelectedServerIds] = useState<number[]>([]);

    const overviewQuery = useQuery<OverviewData>({
        queryKey: ['admin-suspension-overview'],
        queryFn: async () => {
            const res = await fetch('/api/admin/extensions/server-suspension/overview');
            if (!res.ok) throw new Error('Failed to load server suspension overview');
            return res.json();
        },
    });

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
            setEditServer(null);
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

    const openEdit = (server: ServerItem) => {
        setEditServer(server);
        setEditSuspDate(server.suspension_date ? server.suspension_date.slice(0, 16) : '');
        setEditTermDate(server.termination_date ? server.termination_date.slice(0, 16) : '');
        setEditNotify(server.notify_user);
        setEditNotes(server.notes || '');
    };

    const servers = overviewQuery.data?.servers || [];

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

                <div style={{ display: 'flex', gap: 10 }}>
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
                        className="pe-btn pe-btn-primary"
                        onClick={() => setBulkModalOpen(true)}
                    >
                        Bulk Schedule {selectedServerIds.length > 0 ? `(${selectedServerIds.length})` : ''}
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
                    {overviewQuery.data?.nodes.map((n) => (
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

            {/* Data Table */}
            <div className="pe-table-card">
                <table className="pe-table">
                    <thead>
                        <tr>
                            <th style={{ width: 40, textAlign: 'center' }}>
                                <input
                                    type="checkbox"
                                    checked={filteredServers.length > 0 && selectedServerIds.length === filteredServers.length}
                                    onChange={selectAllFiltered}
                                />
                            </th>
                            <th>Server</th>
                            <th>Node / Owner</th>
                            <th>Status</th>
                            <th>Suspension Due</th>
                            <th>Termination Due</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {overviewQuery.isLoading ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: '32px 0' }}>
                                    <span className="pe-spinner" />
                                    <p className="pe-subtitle" style={{ marginTop: 8 }}>Loading servers...</p>
                                </td>
                            </tr>
                        ) : filteredServers.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: '32px 0' }}>
                                    <p className="pe-subtitle">No matching servers found.</p>
                                </td>
                            </tr>
                        ) : (
                            filteredServers.map((server) => {
                                const isSuspended = server.server_status === 'suspended';
                                const hasSchedule = Boolean(server.suspension_date);

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
                                            <div style={{ fontWeight: 600 }}>{server.name}</div>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--muted-foreground, #94a3b8)', fontFamily: 'monospace' }}>
                                                {server.identifier}
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
                                        <td>
                                            {server.suspension_date ? (
                                                <span style={{ fontSize: '0.8125rem', color: '#facc15' }}>
                                                    {new Date(server.suspension_date).toLocaleDateString()} {new Date(server.suspension_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            ) : (
                                                <span style={{ color: 'var(--muted-foreground, #64748b)' }}>None</span>
                                            )}
                                        </td>
                                        <td>
                                            {server.termination_date ? (
                                                <span style={{ fontSize: '0.8125rem', color: '#f87171' }}>
                                                    {new Date(server.termination_date).toLocaleDateString()} {new Date(server.termination_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            ) : (
                                                <span style={{ color: 'var(--muted-foreground, #64748b)' }}>None</span>
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                                                <button
                                                    type="button"
                                                    className="pe-btn pe-btn-secondary"
                                                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                                                    onClick={() => openEdit(server)}
                                                >
                                                    Schedule
                                                </button>
                                                {isSuspended ? (
                                                    <button
                                                        type="button"
                                                        className="pe-btn pe-btn-secondary"
                                                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                                                        disabled={actionMutation.isPending}
                                                        onClick={() => actionMutation.mutate({ server_id: server.id, action: 'unsuspend' })}
                                                    >
                                                        Unsuspend
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className="pe-btn pe-btn-danger"
                                                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                                                        disabled={actionMutation.isPending}
                                                        onClick={() => actionMutation.mutate({ server_id: server.id, action: 'suspend' })}
                                                    >
                                                        Suspend
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

            {/* Edit Server Schedule Modal */}
            {editServer && (
                <div className="pe-modal-overlay" onClick={() => setEditServer(null)}>
                    <div className="pe-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="pe-modal-header">
                            <h3 className="pe-title" style={{ fontSize: '1.1rem' }}>
                                Schedule Expiration: {editServer.name}
                            </h3>
                            <button
                                type="button"
                                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.4rem', cursor: 'pointer' }}
                                onClick={() => setEditServer(null)}
                            >
                                &times;
                            </button>
                        </div>

                        <div className="pe-form-group">
                            <label className="pe-form-label">Suspension Date & Time</label>
                            <input
                                type="datetime-local"
                                className="pe-input"
                                value={editSuspDate}
                                onChange={(e) => setEditSuspDate(e.target.value)}
                            />
                        </div>

                        <div className="pe-form-group">
                            <label className="pe-form-label">Permanent Termination Date & Time (Optional)</label>
                            <input
                                type="datetime-local"
                                className="pe-input"
                                value={editTermDate}
                                onChange={(e) => setEditTermDate(e.target.value)}
                            />
                        </div>

                        <div className="pe-form-group">
                            <label className="pe-checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={editNotify}
                                    onChange={(e) => setEditNotify(e.target.checked)}
                                />
                                <span>Send automated email notification to owner ({editServer.owner_email}) upon suspension</span>
                            </label>
                        </div>

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
                            {editServer.suspension_date && (
                                <button
                                    type="button"
                                    className="pe-btn pe-btn-danger"
                                    onClick={() => actionMutation.mutate({ server_id: editServer.id, action: 'cancel' })}
                                >
                                    Cancel Schedule
                                </button>
                            )}

                            <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
                                <button
                                    type="button"
                                    className="pe-btn pe-btn-secondary"
                                    onClick={() => setEditServer(null)}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="pe-btn pe-btn-primary"
                                    disabled={updateScheduleMutation.isPending}
                                    onClick={() =>
                                        updateScheduleMutation.mutate({
                                            server_id: editServer.id,
                                            suspension_date: editSuspDate || null,
                                            termination_date: editTermDate || null,
                                            notify_user: editNotify,
                                            notes: editNotes,
                                        })
                                    }
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
        </div>
    );
}
