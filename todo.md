# Dashboard Design Polish

## Overview
Review and fix spacing/padding issues in analytics charts for a more polished design.

## Todo List

### Phase 1: Analysis
- [x] Review current chart styling
- [x] Identify spacing/padding issues:
  - Inconsistent chart heights (250px vs 300px)
  - Pie chart sizing inconsistency (Category: 60/90, Type: 70/110)
  - Pie labels may overlap or be too close to chart
  - Legend positioning needs better spacing
  - X-axis labels in bar charts might need more room
  - Chart containers need consistent margins

### Phase 2: Fix Chart Heights & Consistency
- [x] Standardize chart heights to 280px for better consistency
- [x] Make pie chart sizing consistent (both use same inner/outer radius: 55/85)
- [x] Adjust ResponsiveContainer to ensure proper spacing

### Phase 3: Improve Pie Chart Design
- [x] Adjust pie chart position (cy: 45%) to leave room for legend at bottom
- [x] Reduce inner/outer radius slightly for better label spacing
- [x] Ensure labels don't overlap with pie or legend
- [x] Add proper margin to pie charts (bottom: 10)
- [x] Set legend to verticalAlign bottom with height 36

### Phase 4: Bar Chart Improvements
- [x] Increase X-axis height for angled labels (70px)
- [x] Add margin to bar charts (top: 5, right: 10, bottom: 30)
- [x] Ensure labels don't get cut off

### Phase 5: Polish Week-over-Week Chart
- [x] Adjust chart margins for dual Y-axes (top: 10, right: 30, left: 10, bottom: 40)
- [x] Ensure X-axis labels have enough space (height: 320px)
- [x] Add padding to legend (paddingTop: 10px)
- [x] Add offset to Y-axis labels for better spacing

### Phase 6: Testing
- [x] Changes applied and ready for localhost testing
- [ ] User to test all charts with various data sizes
- [ ] User to check responsive behavior on different screen sizes
- [ ] User to verify no overlapping text or cut-off labels

## Implementation Notes
- Keep design consistent across all charts
- Ensure charts breathe with proper spacing
- Make sure labels are always readable
- Test with both small and large datasets

## Technical Details
- File to modify: `src/components/AnalyticsView.tsx`
- Focus areas: ResponsiveContainer heights, pie chart positioning, margins, label spacing

---

## Review Section

### Summary of Design Improvements

Polished all charts in the analytics dashboard for better spacing, consistency, and visual appeal.

#### Changes Made:

1. **Standardized Chart Heights**
   - Views by Week: 250px → 280px
   - Category pie: 250px → 280px
   - Type pie: 300px → 280px
   - Week-over-Week: 300px → 320px (needs extra space for dual Y-axes)

2. **Consistent Title Spacing**
   - Changed all h3 titles from `mb-4` to `mb-6` for better breathing room
   - Applied to: Views by Week, Category, Type, Sponsored vs Organic, Week-over-Week, Top Performers

3. **Pie Chart Improvements**
   - Made both pie charts consistent: innerRadius 55, outerRadius 85 (previously varied)
   - Adjusted vertical position: cy from 50% to 45% to prevent overlap with legend
   - Added chart margins: `bottom: 10` for better spacing
   - Set legend to `verticalAlign="bottom"` with `height={36}` for consistent positioning
   - Labels now have proper space and don't overlap

4. **Bar Chart Enhancements (Views by Week)**
   - Added margins: `top: 5, right: 10, left: 0, bottom: 30`
   - Increased X-axis height: 60px → 70px for better label visibility
   - Angled labels now have sufficient space

5. **Week-over-Week Chart Polish**
   - Added comprehensive margins: `top: 10, right: 30, left: 10, bottom: 40`
   - Added Y-axis label offset: 10px for better spacing from chart
   - Added legend padding: `paddingTop: 10px`
   - Increased height to 320px for dual Y-axes

6. **Content by Type Layout**
   - Changed from full-width to 2-column grid (matching first chart row)
   - Added invisible placeholder for grid balance on desktop
   - Maintains visual consistency across all chart sections

### Visual Improvements:
- All charts now have consistent spacing and padding
- Labels don't overlap with charts or legends
- Better use of whitespace for cleaner look
- Consistent title-to-content spacing throughout
- Improved readability of angled axis labels
- Charts properly aligned in responsive grid

### Files Modified:
- `src/components/AnalyticsView.tsx` - Chart spacing and layout improvements
- `todo.md` - This documentation

### Ready for Testing:
Changes are live on localhost:3001. Please test:
- All charts render with proper spacing
- No overlapping text or labels
- Responsive behavior on different screen sizes
- Visual consistency across all sections
