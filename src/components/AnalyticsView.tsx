'use client';

import { Tweet } from '@/lib/types';
import { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, ComposedChart, Area, Line
} from 'recharts';

interface AnalyticsViewProps {
    tweets: Tweet[];
}

// Chart styling constants
const COLORS = ['#8b6f47', '#c4a67a', '#d4b896', '#6b5237', '#a89070'];

// Bar chart configuration
const BAR_CHART_HEIGHT = 400;
const BAR_CHART_MARGINS = { top: 20, right: 40, left: 40, bottom: 100 };
const X_AXIS_HEIGHT = 110;

// Pie chart configuration
const PIE_CHART_HEIGHT = 280;
const PIE_INNER_RADIUS = 45;
const PIE_OUTER_RADIUS = 75;
const PIE_CENTER_Y = '40%';
const PIE_LEGEND_HEIGHT = 40;
const PIE_LEGEND_PADDING = '20px';

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
            totalEngagement,
            avgViews: count > 0 ? Math.round(totalViews / count) : 0,
            avgLikes: count > 0 ? Math.round(totalLikes / count) : 0,
            avgEngagement: count > 0 ? Math.round(totalEngagement / count) : 0,
        };
    }, [tweets]);

    // Helper function for ISO week calculation
    const getISOWeek = (dateStr: string) => {
        const date = new Date(dateStr);
        const target = new Date(date.valueOf());
        const dayNr = (date.getDay() + 6) % 7;
        target.setDate(target.getDate() - dayNr + 3);
        const firstThursday = target.valueOf();
        target.setMonth(0, 1);
        if (target.getDay() !== 4) {
            target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
        }
        const weekNumber = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
        return `${date.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
    };

    // Weekly averages (for comparison charts)
    const weeklyAverages = useMemo(() => {
        const weeklyMap: Record<string, {
            totalViews: number;
            totalLikes: number;
            totalEngagement: number;
            totalRetweets: number;
            totalReplies: number;
            count: number;
        }> = {};

        tweets.forEach(t => {
            const week = getISOWeek(t.date);
            if (!weeklyMap[week]) {
                weeklyMap[week] = {
                    totalViews: 0,
                    totalLikes: 0,
                    totalEngagement: 0,
                    totalRetweets: 0,
                    totalReplies: 0,
                    count: 0
                };
            }
            weeklyMap[week].totalViews += t.metrics.views;
            weeklyMap[week].totalLikes += t.metrics.likes;
            weeklyMap[week].totalRetweets += t.metrics.retweets;
            weeklyMap[week].totalReplies += t.metrics.replies;
            weeklyMap[week].totalEngagement += t.metrics.likes + t.metrics.retweets + t.metrics.replies;
            weeklyMap[week].count += 1;
        });

        return Object.entries(weeklyMap)
            .map(([week, data]) => ({
                week,
                avgViews: Math.round(data.totalViews / data.count),
                avgLikes: Math.round(data.totalLikes / data.count),
                avgEngagement: Math.round(data.totalEngagement / data.count),
                avgRetweets: Math.round(data.totalRetweets / data.count),
                avgReplies: Math.round(data.totalReplies / data.count),
                tweetCount: data.count
            }))
            .sort((a, b) => a.week.localeCompare(b.week))
            .slice(-12); // Last 12 weeks
    }, [tweets]);

    // Category breakdown (for pie chart)
    const categoryData = useMemo(() => {
        const counted: Record<string, number> = {};
        tweets.forEach(t => {
            counted[t.category] = (counted[t.category] || 0) + 1;
        });
        return Object.entries(counted).map(([name, value]) => ({ name, value }));
    }, [tweets]);

    // Type breakdown (for pie chart)
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

    // Sponsored vs Organic comparison
    const sponsoredVsOrganic = useMemo(() => {
        const sponsored = tweets.filter(t => t.category === 'Sponsored');
        const organic = tweets.filter(t => t.category !== 'Sponsored');

        const calcMetrics = (tweetList: Tweet[]) => {
            const count = tweetList.length;
            const views = tweetList.reduce((acc, t) => acc + t.metrics.views, 0);
            const likes = tweetList.reduce((acc, t) => acc + t.metrics.likes, 0);
            const engagement = tweetList.reduce((acc, t) =>
                acc + t.metrics.likes + t.metrics.retweets + t.metrics.replies, 0);
            return { count, views, likes, engagement };
        };

        const organicMetrics = calcMetrics(organic);
        const sponsoredMetrics = calcMetrics(sponsored);
        const total = tweets.length;

        return {
            organic: { ...organicMetrics, percentage: total > 0 ? (organicMetrics.count / total) * 100 : 0 },
            sponsored: { ...sponsoredMetrics, percentage: total > 0 ? (sponsoredMetrics.count / total) * 100 : 0 },
        };
    }, [tweets]);

    // Week-over-Week data
    const weeklyData = useMemo(() => {
        const weeklyMap: Record<string, { views: number; engagement: number }> = {};
        tweets.forEach(t => {
            const week = getISOWeek(t.date);
            if (!weeklyMap[week]) {
                weeklyMap[week] = { views: 0, engagement: 0 };
            }
            weeklyMap[week].views += t.metrics.views;
            weeklyMap[week].engagement += t.metrics.likes + t.metrics.retweets + t.metrics.replies;
        });

        return Object.entries(weeklyMap)
            .map(([week, data]) => ({ week, ...data }))
            .sort((a, b) => a.week.localeCompare(b.week));
    }, [tweets]);

    return (
        <div className="space-y-8">
            {/* Stats Cards Row 1: Totals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard label="Total Views" value={stats.totalViews.toLocaleString()} />
                <StatCard label="Total Likes" value={stats.totalLikes.toLocaleString()} />
                <StatCard label="Total Engagement" value={stats.totalEngagement.toLocaleString()} />
            </div>

            {/* Stats Cards Row 2: Averages */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard label="Avg Views / Tweet" value={stats.avgViews.toLocaleString()} accent />
                <StatCard label="Avg Likes / Tweet" value={stats.avgLikes.toLocaleString()} accent />
                <StatCard label="Avg Engagement / Tweet" value={stats.avgEngagement.toLocaleString()} accent />
            </div>

            {/* Weekly Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Average Views per Tweet by Week */}
                <div className="bg-[#fffbf7] rounded-3xl p-8 shadow-xl">
                    <h3 className="text-lg font-semibold text-[#5a4a3a] mb-6" style={{ fontFamily: 'var(--font-lora), Lora, serif' }}>
                        Avg Views per Tweet (Weekly)
                    </h3>
                    {weeklyAverages.length > 0 ? (
                        <ResponsiveContainer width="100%" height={BAR_CHART_HEIGHT}>
                            <BarChart data={weeklyAverages} margin={BAR_CHART_MARGINS}>
                                <XAxis
                                    dataKey="week"
                                    tick={{ fill: '#7a6a5a', fontSize: 11 }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={X_AXIS_HEIGHT}
                                />
                                <YAxis tick={{ fill: '#7a6a5a', fontSize: 11 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fffbf7', border: '1px solid #e0d0c0', borderRadius: '8px', padding: '8px 12px' }}
                                    labelStyle={{ color: '#5a4a3a' }}
                                    formatter={(value: number) => [value.toLocaleString(), 'Avg Views']}
                                />
                                <Bar dataKey="avgViews" fill="#8b6f47" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-[#7a6a5a] text-center py-12">No data yet</p>
                    )}
                </div>

                {/* Average Engagement per Tweet by Week */}
                <div className="bg-[#fffbf7] rounded-3xl p-8 shadow-xl">
                    <h3 className="text-lg font-semibold text-[#5a4a3a] mb-6" style={{ fontFamily: 'var(--font-lora), Lora, serif' }}>
                        Avg Engagement per Tweet (Weekly)
                    </h3>
                    {weeklyAverages.length > 0 ? (
                        <ResponsiveContainer width="100%" height={BAR_CHART_HEIGHT}>
                            <BarChart data={weeklyAverages} margin={BAR_CHART_MARGINS}>
                                <XAxis
                                    dataKey="week"
                                    tick={{ fill: '#7a6a5a', fontSize: 11 }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={X_AXIS_HEIGHT}
                                />
                                <YAxis tick={{ fill: '#7a6a5a', fontSize: 11 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fffbf7', border: '1px solid #e0d0c0', borderRadius: '8px', padding: '8px 12px' }}
                                    labelStyle={{ color: '#5a4a3a' }}
                                    formatter={(value: number) => [value.toLocaleString(), 'Avg Engagement']}
                                />
                                <Bar dataKey="avgEngagement" fill="#c4a67a" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-[#7a6a5a] text-center py-12">No data yet</p>
                    )}
                </div>
            </div>

            {/* Breakdown Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Breakdown */}
                <div className="bg-[#fffbf7] rounded-3xl p-8 shadow-xl">
                    <h3 className="text-lg font-semibold text-[#5a4a3a] mb-6" style={{ fontFamily: 'var(--font-lora), Lora, serif' }}>
                        Content by Category
                    </h3>
                    {categoryData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={PIE_CHART_HEIGHT}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy={PIE_CENTER_Y}
                                    innerRadius={PIE_INNER_RADIUS}
                                    outerRadius={PIE_OUTER_RADIUS}
                                    paddingAngle={categoryData.length === 1 ? 0 : 3}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                                    labelLine={false}
                                >
                                    {categoryData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend
                                    verticalAlign="bottom"
                                    height={PIE_LEGEND_HEIGHT}
                                    wrapperStyle={{ paddingTop: PIE_LEGEND_PADDING }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-[#7a6a5a] text-center py-12">No data yet</p>
                    )}
                </div>

                {/* Type Breakdown */}
                <div className="bg-[#fffbf7] rounded-3xl p-8 shadow-xl">
                    <h3 className="text-lg font-semibold text-[#5a4a3a] mb-6" style={{ fontFamily: 'var(--font-lora), Lora, serif' }}>
                        Content by Type
                    </h3>
                    {typeData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={PIE_CHART_HEIGHT}>
                            <PieChart>
                                <Pie
                                    data={typeData}
                                    cx="50%"
                                    cy={PIE_CENTER_Y}
                                    innerRadius={PIE_INNER_RADIUS}
                                    outerRadius={PIE_OUTER_RADIUS}
                                    paddingAngle={typeData.length === 1 ? 0 : 3}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                                    labelLine={false}
                                >
                                    {typeData.map((_, index) => (
                                        <Cell key={`cell-type-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend
                                    verticalAlign="bottom"
                                    height={PIE_LEGEND_HEIGHT}
                                    wrapperStyle={{ paddingTop: PIE_LEGEND_PADDING }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-[#7a6a5a] text-center py-12">No data yet</p>
                    )}
                </div>
            </div>

            {/* Sponsored vs Organic Comparison */}
            <div className="bg-[#fffbf7] rounded-3xl p-8 shadow-xl">
                <h3 className="text-lg font-semibold text-[#5a4a3a] mb-6" style={{ fontFamily: 'var(--font-lora), Lora, serif' }}>
                    Sponsored vs Organic Content
                </h3>
                {tweets.length > 0 ? (
                    <div className="space-y-4">
                        {/* Metrics Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b-2 border-[#e0d0c0]">
                                        <th className="text-left py-3 px-4 text-[#5a4a3a]">Type</th>
                                        <th className="text-right py-3 px-4 text-[#5a4a3a]">Count</th>
                                        <th className="text-right py-3 px-4 text-[#5a4a3a]">Views</th>
                                        <th className="text-right py-3 px-4 text-[#5a4a3a]">Likes</th>
                                        <th className="text-right py-3 px-4 text-[#5a4a3a]">Engagement</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-[#f0e8dc] hover:bg-[#faf5f0]">
                                        <td className="py-3 px-4 font-semibold text-[#8b6f47]">Organic</td>
                                        <td className="text-right py-3 px-4 text-[#5a4a3a]">{sponsoredVsOrganic.organic.count}</td>
                                        <td className="text-right py-3 px-4 text-[#5a4a3a]">{sponsoredVsOrganic.organic.views.toLocaleString()}</td>
                                        <td className="text-right py-3 px-4 text-[#5a4a3a]">{sponsoredVsOrganic.organic.likes.toLocaleString()}</td>
                                        <td className="text-right py-3 px-4 text-[#5a4a3a]">{sponsoredVsOrganic.organic.engagement.toLocaleString()}</td>
                                    </tr>
                                    <tr className="hover:bg-[#faf5f0]">
                                        <td className="py-3 px-4 font-semibold text-[#8b6f47]">Sponsored</td>
                                        <td className="text-right py-3 px-4 text-[#5a4a3a]">{sponsoredVsOrganic.sponsored.count}</td>
                                        <td className="text-right py-3 px-4 text-[#5a4a3a]">{sponsoredVsOrganic.sponsored.views.toLocaleString()}</td>
                                        <td className="text-right py-3 px-4 text-[#5a4a3a]">{sponsoredVsOrganic.sponsored.likes.toLocaleString()}</td>
                                        <td className="text-right py-3 px-4 text-[#5a4a3a]">{sponsoredVsOrganic.sponsored.engagement.toLocaleString()}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Distribution Progress Bar */}
                        <div className="mt-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-[#7a6a5a]">Content Distribution</span>
                                <span className="text-xs text-[#7a6a5a]">Target: 80% Organic / 20% Sponsored</span>
                            </div>
                            <div className="flex h-8 rounded-lg overflow-hidden border-2 border-[#e0d0c0]">
                                <div
                                    className="bg-[#8b6f47] flex items-center justify-center text-white text-xs font-semibold transition-all duration-300"
                                    style={{ width: `${sponsoredVsOrganic.organic.percentage}%` }}
                                >
                                    {sponsoredVsOrganic.organic.percentage > 10 && `${sponsoredVsOrganic.organic.percentage.toFixed(0)}%`}
                                </div>
                                <div
                                    className="bg-[#d4b896] flex items-center justify-center text-[#5a4a3a] text-xs font-semibold transition-all duration-300"
                                    style={{ width: `${sponsoredVsOrganic.sponsored.percentage}%` }}
                                >
                                    {sponsoredVsOrganic.sponsored.percentage > 10 && `${sponsoredVsOrganic.sponsored.percentage.toFixed(0)}%`}
                                </div>
                            </div>
                            <div className="flex justify-between mt-1">
                                <span className="text-xs text-[#8b6f47] font-semibold">Organic</span>
                                <span className="text-xs text-[#a89070] font-semibold">Sponsored</span>
                            </div>
                            {/* Benchmark indicator */}
                            <div className="relative h-4 mt-1">
                                <div className="absolute left-[80%] transform -translate-x-1/2 text-xs text-[#6b5237] font-semibold">
                                    ↑ Target
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-[#7a6a5a] text-center py-8">No data yet</p>
                )}
            </div>

            {/* Weekly Detailed Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Average Likes per Tweet by Week */}
                <div className="bg-[#fffbf7] rounded-3xl p-8 shadow-xl">
                    <h3 className="text-lg font-semibold text-[#5a4a3a] mb-6" style={{ fontFamily: 'var(--font-lora), Lora, serif' }}>
                        Avg Likes per Tweet (Weekly)
                    </h3>
                    {weeklyAverages.length > 0 ? (
                        <ResponsiveContainer width="100%" height={BAR_CHART_HEIGHT}>
                            <BarChart data={weeklyAverages} margin={BAR_CHART_MARGINS}>
                                <XAxis
                                    dataKey="week"
                                    tick={{ fill: '#7a6a5a', fontSize: 11 }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={X_AXIS_HEIGHT}
                                />
                                <YAxis tick={{ fill: '#7a6a5a', fontSize: 11 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fffbf7', border: '1px solid #e0d0c0', borderRadius: '8px', padding: '8px 12px' }}
                                    labelStyle={{ color: '#5a4a3a' }}
                                    formatter={(value: number) => [value.toLocaleString(), 'Avg Likes']}
                                />
                                <Bar dataKey="avgLikes" fill="#d4b896" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-[#7a6a5a] text-center py-12">No data yet</p>
                    )}
                </div>

                {/* Average Retweets per Tweet by Week */}
                <div className="bg-[#fffbf7] rounded-3xl p-8 shadow-xl">
                    <h3 className="text-lg font-semibold text-[#5a4a3a] mb-6" style={{ fontFamily: 'var(--font-lora), Lora, serif' }}>
                        Avg Retweets per Tweet (Weekly)
                    </h3>
                    {weeklyAverages.length > 0 ? (
                        <ResponsiveContainer width="100%" height={BAR_CHART_HEIGHT}>
                            <BarChart data={weeklyAverages} margin={BAR_CHART_MARGINS}>
                                <XAxis
                                    dataKey="week"
                                    tick={{ fill: '#7a6a5a', fontSize: 11 }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={X_AXIS_HEIGHT}
                                />
                                <YAxis tick={{ fill: '#7a6a5a', fontSize: 11 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fffbf7', border: '1px solid #e0d0c0', borderRadius: '8px', padding: '8px 12px' }}
                                    labelStyle={{ color: '#5a4a3a' }}
                                    formatter={(value: number) => [value.toLocaleString(), 'Avg Retweets']}
                                />
                                <Bar dataKey="avgRetweets" fill="#a89070" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-[#7a6a5a] text-center py-12">No data yet</p>
                    )}
                </div>
            </div>

            {/* Top Performers */}
            <div className="bg-[#fffbf7] rounded-3xl p-8 shadow-xl">
                <h3 className="text-lg font-semibold text-[#5a4a3a] mb-6" style={{ fontFamily: 'var(--font-lora), Lora, serif' }}>
                    Top Performers
                </h3>
                {topPerformers.length > 0 ? (
                    <div className="space-y-3">
                        {topPerformers.map((tweet, i) => (
                            <div key={tweet.id} className="flex items-center gap-4 p-3 rounded-xl bg-[#faf5f0] hover:bg-[#f5e6d3] transition-colors">
                                <span className="text-2xl font-bold text-[#8b6f47] w-8">#{i + 1}</span>
                                <div className="flex-1 min-w-0">
                                    <a href={tweet.url} target="_blank" rel="noopener noreferrer" className="text-[#5a4a3a] hover:text-[#8b6f47] truncate block">
                                        {tweet.url}
                                    </a>
                                    <span className="text-sm text-[#7a6a5a]">{tweet.date} • {tweet.category}</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-[#8b6f47]">{tweet.metrics.views.toLocaleString()}</p>
                                    <p className="text-xs text-[#7a6a5a]">views</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-[#7a6a5a] text-center py-8">No tweets tracked yet</p>
                )}
            </div>
        </div>
    );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
    return (
        <div className={`rounded-2xl p-6 shadow-lg text-center hover:scale-105 transition-transform duration-200 ${accent ? 'bg-[#f5e6d3]' : 'bg-[#fffbf7]'}`}>
            <p className="text-[#7a6a5a] text-sm mb-1">{label}</p>
            <p className="text-3xl font-bold text-[#8b6f47]" style={{ fontFamily: 'var(--font-lora), Lora, serif' }}>
                {value}
            </p>
        </div>
    );
}
