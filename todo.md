# Dashboard Redesign - Better Metrics

## Overview
Redesign analytics dashboard with better spacing and add weekly average engagement metrics for proper comparison.

## Todo List

### Phase 1: Analysis
- [x] User feedback: current design still has issues
- [x] Need to add weekly average metrics (not just totals)
- [x] Views by week should show averages per tweet for comparison

### Phase 2: Redesign Chart Layout
- [x] Simplify and clean up chart spacing
- [x] Remove unnecessary complexity
- [x] Better grid layout for charts
- [x] Increase chart sizes for better visibility (300px)

### Phase 3: Add Weekly Average Metrics
- [x] Create weeklyAverages calculation (avg views, likes, engagement, retweets, replies per tweet)
- [x] Add "Average Views per Tweet by Week" chart
- [x] Add "Average Engagement per Tweet by Week" chart
- [x] Add "Average Likes per Tweet by Week" chart
- [x] Add "Average Retweets per Tweet by Week" chart
- [x] Replace Views by Week with average-based metrics

### Phase 4: Improve Overall Design
- [x] Reduce title sizes (text-xl → text-lg)
- [x] Standardize margins (mb-6 → mb-4)
- [x] Increase chart heights to 300px for better data visibility
- [x] Better use of screen real estate with 2-column grids
- [x] Cleaner, more professional look with consistent styling

### Phase 5: Testing
- [x] Changes ready on localhost
- [ ] User to test and approve before pushing

## Implementation Notes
- Focus on averages, not totals, for weekly metrics
- Weekly averages = total metric / number of tweets in that week
- This gives better comparison across weeks with different tweet volumes
- Keep it simple and clean

## Metrics to Calculate
- Average views per tweet by week
- Average likes per tweet by week
- Average engagement per tweet by week
- Average retweets per tweet by week
- Average replies per tweet by week

---

## Review Section

### Summary of Redesign

Complete redesign of analytics dashboard with focus on weekly average metrics for better comparative analysis.

#### Major Changes:

1. **Added Weekly Average Calculations**
   - New `weeklyAverages` useMemo that calculates average metrics per tweet for each week
   - Tracks: avgViews, avgLikes, avgEngagement, avgRetweets, avgReplies, tweetCount
   - Shows last 12 weeks of data

2. **New Weekly Performance Charts** (Replaced Views by Week)
   - Avg Views per Tweet (Weekly) - Brown (#8b6f47)
   - Avg Engagement per Tweet (Weekly) - Tan (#c4a67a)
   - Avg Likes per Tweet (Weekly) - Light tan (#d4b896)
   - Avg Retweets per Tweet (Weekly) - Medium brown (#a89070)

3. **Improved Chart Layout**
   - Consolidated into clear sections:
     - Weekly Performance (2 charts)
     - Breakdown Charts (Category & Type pie charts side-by-side)
     - Sponsored vs Organic
     - Weekly Detailed Metrics (Likes & Retweets averages)
     - Top Performers
   - All bar charts now 300px height for better visibility
   - Pie charts at 260px height
   - Consistent 2-column grid layout

4. **Design Polish**
   - Reduced title sizes: text-xl → text-lg, font-semibold
   - Standardized margins: mb-6 → mb-4 for consistency
   - Better chart margins: top: 10, right: 15, bottom: 35
   - Rounded bar corners increased: radius [4,4,0,0] → [6,6,0,0]
   - Smaller font sizes in axes: 12px → 11px for cleaner look
   - Pie chart adjustments: cy: 45% → 42%, innerRadius: 55 → 50, outerRadius: 85 → 80

5. **Better Tooltips**
   - Added formatters to show "Avg Views", "Avg Engagement", etc.
   - Number formatting with toLocaleString()

6. **Removed**
   - Old "Views by Week" (total views) - replaced with averages
   - "Week-over-Week Trends" composite chart - replaced with individual metric charts
   - Duplicate "Content by Type" section

### Why Weekly Averages Matter:
- Week with 1 tweet showing 10K views vs week with 10 tweets showing 100K total
- Averages show true performance: 10K avg vs 10K avg = comparable
- Better for identifying trends in content quality vs just volume

### Files Modified:
- `src/components/AnalyticsView.tsx` - Complete redesign
- `todo.md` - This documentation

### Ready for Testing:
Changes are live on localhost:3001. User to review and approve before pushing to production.
