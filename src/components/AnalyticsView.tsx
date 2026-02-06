'use client';

import { Tweet } from '@/lib/types';
import { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';


interface AnalyticsViewProps {
    tweets: Tweet[];
}

// Modern chart color palette
const CHART_COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe'];

// Chart configuration
const CHART_CONFIG = {
    height: 280,
    margins: { top: 20, right: 20, left: 0, bottom: 60 },
    xAxisHeight: 70,
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="label">{label || payload[0].name}</p>
                <p className="value">{payload[0].value.toLocaleString()}</p>
            </div>
        );
    }
    return null;
};


export function AnalyticsView({ tweets }: AnalyticsViewProps) {
    // Calculate stats
    const stats = useMemo(() => {
        const count = tweets.length;
        const totalViews = tweets.reduce((acc, t) => acc + t.metrics.views, 0);
        const totalLikes = tweets.reduce((acc, t) => acc + t.metrics.likes, 0);
        const totalRTs = tweets.reduce((acc, t) => acc + t.metrics.retweets, 0);
        const totalReplies = tweets.reduce((acc, t) => acc + t.metrics.replies, 0);
        const totalEngagement = totalLikes + totalRTs + totalReplies;

        return {
            count,
            totalViews,
            totalLikes,
            totalRTs,
            totalReplies,
            totalEngagement,
            avgViews: count > 0 ? Math.round(totalViews / count) : 0,
            avgLikes: count > 0 ? Math.round(totalLikes / count) : 0,
            avgEngagement: count > 0 ? Math.round(totalEngagement / count) : 0,
        };
    }, [tweets]);

    // Helper function to get week label with date range
    const getWeekLabel = (dateStr: string) => {
        const date = new Date(dateStr);
        const dayOfWeek = date.getDay();
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const monday = new Date(date);
        monday.setDate(date.getDate() + diff);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const startMonth = monthNames[monday.getMonth()];
        const endMonth = monthNames[sunday.getMonth()];
        const startDay = monday.getDate();
        const endDay = sunday.getDate();

        if (startMonth === endMonth) {
            return `${startMonth} ${startDay}-${endDay}`;
        } else {
            return `${startMonth} ${startDay}-${endMonth} ${endDay}`;
        }
    };

    // Weekly averages
    const weeklyAverages = useMemo(() => {
        const weeklyMap: Record<string, {
            totalViews: number;
            totalLikes: number;
            totalBookmarks: number;
            totalEngagement: number;
            count: number;
            date: string;
        }> = {};

        tweets.forEach(t => {
            const weekLabel = getWeekLabel(t.date);
            if (!weeklyMap[weekLabel]) {
                weeklyMap[weekLabel] = { totalViews: 0, totalLikes: 0, totalBookmarks: 0, totalEngagement: 0, count: 0, date: t.date };
            }
            weeklyMap[weekLabel].totalViews += t.metrics.views;
            weeklyMap[weekLabel].totalLikes += t.metrics.likes;
            weeklyMap[weekLabel].totalBookmarks += t.metrics.bookmarks || 0;
            weeklyMap[weekLabel].totalEngagement += t.metrics.likes + t.metrics.retweets + t.metrics.replies;
            weeklyMap[weekLabel].count += 1;
        });

        return Object.entries(weeklyMap)
            .map(([weekLabel, data]) => ({
                weekLabel,
                avgViews: Math.round(data.totalViews / data.count),
                avgLikes: Math.round(data.totalLikes / data.count),
                avgBookmarks: Math.round(data.totalBookmarks / data.count),
                avgEngagement: Math.round(data.totalEngagement / data.count),
                sortKey: data.date,
            }))
            .sort((a, b) => new Date(a.sortKey).getTime() - new Date(b.sortKey).getTime())
            .slice(-8);
    }, [tweets]);

    // Category breakdown
    const categoryData = useMemo(() => {
        const counted: Record<string, number> = {};
        tweets.forEach(t => {
            counted[t.category] = (counted[t.category] || 0) + 1;
        });
        return Object.entries(counted).map(([name, value]) => ({ name, value }));
    }, [tweets]);

    // Type breakdown
    const typeData = useMemo(() => {
        const counted: Record<string, number> = {};
        tweets.forEach(t => {
            counted[t.type] = (counted[t.type] || 0) + 1;
        });
        return Object.entries(counted).map(([name, value]) => ({ name, value }));
    }, [tweets]);

    // Top performers
    const topPerformers = useMemo(() => {
        return [...tweets]
            .sort((a, b) => b.metrics.views - a.metrics.views)
            .slice(0, 5);
    }, [tweets]);

    return (
        <div className="space-y-6">
            {/* Totals Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SimpleStatCard label="Total Views" value={stats.totalViews} />
                <SimpleStatCard label="Total Likes" value={stats.totalLikes} />
                <SimpleStatCard label="Total Engagement" value={stats.totalEngagement} />
            </div>

            {/* Averages Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SimpleStatCard label="Avg Views / Tweet" value={stats.avgViews} accent />
                <SimpleStatCard label="Avg Likes / Tweet" value={stats.avgLikes} accent />
                <SimpleStatCard label="Avg Engagement / Tweet" value={stats.avgEngagement} accent />
            </div>


            {/* Main Charts - Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Views Chart */}
                <div className="chart-container">
                    <h3>Average Views per Tweet</h3>
                    {weeklyAverages.length > 0 ? (
                        <ResponsiveContainer width="100%" height={CHART_CONFIG.height}>
                            <BarChart data={weeklyAverages} margin={CHART_CONFIG.margins}>
                                <XAxis
                                    dataKey="weekLabel"
                                    tick={{ fill: 'var(--foreground-muted)', fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: 'var(--foreground-muted)', fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={50}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                <Bar dataKey="avgViews" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyState />
                    )}
                </div>

                {/* Likes Chart */}
                <div className="chart-container">
                    <h3>Average Likes per Tweet</h3>
                    {weeklyAverages.length > 0 ? (
                        <ResponsiveContainer width="100%" height={CHART_CONFIG.height}>
                            <BarChart data={weeklyAverages} margin={CHART_CONFIG.margins}>
                                <XAxis
                                    dataKey="weekLabel"
                                    tick={{ fill: 'var(--foreground-muted)', fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: 'var(--foreground-muted)', fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={50}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                <Bar dataKey="avgLikes" fill="var(--chart-3)" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyState />
                    )}
                </div>

                {/* Engagement Chart */}
                <div className="chart-container">
                    <h3>Average Engagement per Tweet</h3>
                    {weeklyAverages.length > 0 ? (
                        <ResponsiveContainer width="100%" height={CHART_CONFIG.height}>
                            <BarChart data={weeklyAverages} margin={CHART_CONFIG.margins}>
                                <XAxis
                                    dataKey="weekLabel"
                                    tick={{ fill: 'var(--foreground-muted)', fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: 'var(--foreground-muted)', fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={50}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                <Bar dataKey="avgEngagement" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyState />
                    )}
                </div>

                {/* Bookmarks Chart */}
                <div className="chart-container">
                    <h3>Average Bookmarks per Tweet</h3>
                    {weeklyAverages.length > 0 ? (
                        <ResponsiveContainer width="100%" height={CHART_CONFIG.height}>
                            <BarChart data={weeklyAverages} margin={CHART_CONFIG.margins}>
                                <XAxis
                                    dataKey="weekLabel"
                                    tick={{ fill: 'var(--foreground-muted)', fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: 'var(--foreground-muted)', fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={50}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                <Bar dataKey="avgBookmarks" fill="var(--chart-4)" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyState />
                    )}
                </div>
            </div>

            {/* Breakdown Charts */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Breakdown */}
                <div className="chart-container">
                    <h3>Content by Category</h3>
                    {categoryData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={categoryData.length === 1 ? 0 : 4}
                                    dataKey="value"
                                >
                                    {categoryData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    formatter={(value) => <span style={{ color: 'var(--foreground-muted)', fontSize: '13px' }}>{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyState />
                    )}
                </div>

                {/* Type Breakdown */}
                <div className="chart-container">
                    <h3>Content by Type</h3>
                    {typeData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie
                                    data={typeData}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={typeData.length === 1 ? 0 : 4}
                                    dataKey="value"
                                >
                                    {typeData.map((_, index) => (
                                        <Cell key={`cell-type-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    formatter={(value) => <span style={{ color: 'var(--foreground-muted)', fontSize: '13px' }}>{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyState />
                    )}
                </div>
            </div>

            {/* Top Performers */}
            <div className="chart-container">
                <h3>Top Performers</h3>
                {topPerformers.length > 0 ? (
                    <div className="space-y-3 mt-4">
                        {topPerformers.map((tweet, i) => (
                            <div
                                key={tweet.id}
                                className="flex items-center gap-4 p-4 rounded-xl transition-colors"
                                style={{
                                    background: 'var(--background-elevated)',
                                    border: '1px solid var(--border-subtle)'
                                }}
                            >
                                <span
                                    className="text-2xl font-bold w-8 text-center"
                                    style={{ color: 'var(--accent-primary)' }}
                                >
                                    {i + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <a
                                        href={tweet.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="truncate block hover:underline"
                                        style={{ color: 'var(--foreground)' }}
                                    >
                                        {tweet.url}
                                    </a>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span style={{ color: 'var(--foreground-subtle)', fontSize: '13px' }}>{tweet.date}</span>
                                        <span className="pill">{tweet.category}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
                                        {tweet.metrics.views.toLocaleString()}
                                    </p>
                                    <p style={{ color: 'var(--foreground-subtle)', fontSize: '12px' }}>views</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState />
                )}
            </div>
        </div>
    );
}



// Simple Stat Card Component (for Totals/Averages rows)
function SimpleStatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
    return (
        <div
            className="rounded-2xl p-6 text-center transition-all duration-200 hover:scale-[1.02]"
            style={{
                background: accent ? 'var(--background-elevated)' : 'var(--background-card)',
                border: '1px solid var(--border-subtle)',
            }}
        >
            <p style={{ color: 'var(--foreground-muted)', fontSize: '14px', marginBottom: '4px' }}>{label}</p>
            <p style={{ color: 'var(--foreground)', fontSize: '32px', fontWeight: 700, letterSpacing: '-0.02em' }}>
                {value.toLocaleString()}
            </p>
        </div>
    );
}

// Empty State Component
function EmptyState() {
    return (
        <div className="flex items-center justify-center h-48">
            <p style={{ color: 'var(--foreground-subtle)' }}>No data available</p>
        </div>
    );
}
