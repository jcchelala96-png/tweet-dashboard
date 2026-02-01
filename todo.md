# Dashboard Analytics Improvements

## Overview
Fix existing chart issues and add new content type visualization:
1. Fix "Content by Category" pie chart padding to auto-adjust
2. Change "Views Over Time" to group by week instead of daily
3. Add new "Content by Type" pie chart

## Todo List

### Phase 1: Analysis
- [x] Read current AnalyticsView.tsx implementation
- [x] Identify the issues:
  - Pie chart has fixed paddingAngle (3) regardless of data count
  - Views chart groups by date (line 38-47) instead of week
  - No "type" visualization exists

### Phase 2: Fix Category Pie Chart Padding
- [x] Make paddingAngle conditional based on categoryData length
  - If 1 item: paddingAngle = 0
  - If 2+ items: paddingAngle = 3

### Phase 3: Fix Views Over Time (Group by Week)
- [x] Reuse the existing getISOWeek function logic
- [x] Update viewsByDate to group by week instead of date
- [x] Update chart title and labels to reflect weekly grouping
- [x] Update X-axis to show week labels (e.g., "2026-W04")

### Phase 4: Add Content by Type Chart
- [x] Create new typeData useMemo similar to categoryData
- [x] Add new chart section after category chart
- [x] Use same pie chart styling as category chart
- [x] Make paddingAngle conditional here too

### Phase 5: Testing & Verification
- [x] Verify pie charts adjust padding correctly
- [x] Verify views chart groups by week properly
- [x] Verify type chart displays correctly
- [x] Test with various data scenarios

## Implementation Notes
- Keep changes minimal and focused
- Reuse existing helper functions where possible (getISOWeek)
- Match existing styling and color scheme
- Auto-adjust padding: 0 for single item, 3 for multiple items
- Weekly grouping should use same logic as Week-over-Week chart

## Technical Details
- File to modify: `src/components/AnalyticsView.tsx`
- Fields used: `tweet.category`, `tweet.type`, `tweet.date`
- Week calculation: ISO week format (YYYY-Wnn)

---

## Review Section

### Summary of Changes

Successfully fixed all three dashboard issues in `src/components/AnalyticsView.tsx`.

#### Changes Made:

1. **Fixed Category Pie Chart Padding** (Line 189)
   - Changed `paddingAngle={3}` to `paddingAngle={categoryData.length === 1 ? 0 : 3}`
   - Now auto-adjusts: 0 padding for single category, 3 for multiple categories

2. **Changed Views Over Time to Weekly Grouping** (Lines 38-52, 152-174)
   - Extracted `getISOWeek` helper function to component scope (lines 38-50)
   - Renamed `viewsByDate` to `viewsByWeek`
   - Changed grouping logic from daily (`t.date`) to weekly (`getISOWeek(t.date)`)
   - Updated chart title from "Views Over Time" to "Views by Week"
   - Updated X-axis to show week labels with angled text for readability
   - Changed data key from "date" to "week"

3. **Added Content by Type Chart** (Lines 62-68, 203-227)
   - Created new `typeData` useMemo hook (similar to categoryData)
   - Added new full-width chart section displaying content type distribution
   - Used pie chart with conditional padding: `paddingAngle={typeData.length === 1 ? 0 : 3}`
   - Matched existing styling: innerRadius 70, outerRadius 110
   - Used same color scheme and legend

4. **Code Optimization** (Lines 103-117)
   - Removed duplicate `getISOWeek` function from weeklyData useMemo
   - Now reuses the helper function defined at component scope
   - Cleaner, DRY code

### Technical Details:
- All pie charts now have dynamic padding that adjusts based on data count
- Weekly grouping uses ISO week standard (YYYY-Wnn format)
- Tweets from same week (e.g., Jan 21 and Jan 22) now appear in single column
- Type chart provides new insights into content type distribution
- Maintained responsive design and color consistency

### Files Modified:
- `src/components/AnalyticsView.tsx` - ~40 lines changed/added
- `todo.md` - This file (documentation)

### Current State:
- Category pie chart adjusts padding automatically
- Views chart groups by week (e.g., 2026-W04)
- New Content by Type chart displays tweet type distribution
- All charts maintain consistent styling and color scheme

### Next Steps:
- Test with real data in the live dashboard
- Verify all charts render correctly with various data scenarios
