---
title: Assigning Ratios to Excel
order: 5
description: Assign ratios to Excel columns.
---

# Ratio Assignment System - User Guide

## Overview
A clean, efficient ratio management system with minimal VBA dependency. All logic is in Python for reliability and ease of maintenance.

---

## Key Features

### What You Can Do:
1. **Assign Ratios**: Assign any created ratio to Excel columns (B, C, D, etc.)
2. **View Status**: See which ratios are assigned and to which columns
3. **View Notes**: Read ratio notes/descriptions
4. **Calculate Ratios**: Compute all ratios for all tickers using Parquet data
5. **Manual Tickers**: Enter tickers manually in Column A

### Benefits:
- **Fast**: Uses Parquet data for quick calculations
- **Reliable**: Minimal VBA, all logic in Python
- **Simple**: Clean UI with clear feedback
- **Flexible**: Assign any ratio to any column

---

## Excel Layout (Ratios Sheet)

```
Row 1: Financial Ratios [Title]
Row 2: [Empty]
Row 3: [Empty]
Row 4: Ticker | Ratio1 Name | Ratio2 Name | Ratio3 Name | ...
Row 5: [Empty - Reserved]
Row 6: AAPL | 1.2500 | 0.8500 | 2.4500 | ...
Row 7: MSFT | 1.3000 | 0.9200 | 2.5000 | ...
Row 8: GOOGL | 1.1800 | 0.7800 | 2.3200 | ...
...
```

### Column Structure:
- **Column A**: Ticker symbols (enter manually from Row 6 onwards)
- **Column B+**: Assigned ratios with calculated values

### Row Functions:
- **Row 4**: Ratio names (set by assignment)
- **Row 5**: Reserved and left empty
- **Row 6+**: Your data (tickers + calculated ratios)

---

## How to Use

### 1. Open Ratio Manager

**From Excel:**
- Run VBA macro: `OpenRatioManager()`

**From Python:**
```python
python -c "from Internal.Ratios.ratio_manager_ui import launch_ratio_manager; launch_ratio_manager()"
```

### 2. Assign a Ratio

In Ratio Manager UI:
1. Select a ratio from the list
2. Click **"Assign to Column"**
3. Enter column letter (B, C, D, etc.)
4. Click OK

Result: Ratio name appears in Row 4, Row 5 stays empty

**Rules:**
- Can only assign to columns B and onwards
- Cannot assign same ratio to multiple columns
- Cannot assign to a column that is already in use

### 3. View Ratio Notes

In Ratio Manager UI:
1. Select a ratio
2. Click **"View Notes"**
3. Read notes in popup dialog

### 4. Enter Tickers

In Excel (Ratios sheet):
1. Go to Column A, Row 6
2. Type ticker symbol (e.g., "AAPL")
3. Continue adding tickers in rows below

### 5. Calculate Ratios

**From the FinForge Workspace:**
1. Open the FinForge workspace window
2. Go to the Ratios tab
3. Click **"Refresh ratios sheet"**

**Option A - From Excel:**
- Run VBA macro: `RefreshRatios()`

**Option B - From Python:**
```python
python -c "from Internal.Ratios.ratio_calculator import calculate_ratios; calculate_ratios()"
```

**What Happens:**
- System reads all tickers from Column A
- Loads financial data from Parquet files
- Calculates each assigned ratio for each ticker
- Writes results to Excel
- Shows progress dialog

### 6. Update an Assignment

1. Open Ratio Manager
2. Change the ratio assignment in Row 4 if needed
3. Refresh the sheet so calculations use the updated layout

---

## VBA Macros (Minimal)

### Essential Functions:

```vba
' Open the Ratio Manager UI
OpenRatioManager()

' Calculate all ratios
RefreshRatios()
```

### Setting Up Buttons:

1. **Insert Developer Tab** -> Insert -> Button
2. **Assign macro** to button:
   - "Manage Ratios" -> `OpenRatioManager`
   - "Calculate Ratios" -> `RefreshRatios`

---

## File Structure

```
FinForge/
+-- Internal/Ratios/
|   +-- ratio_handeling.py       (Config management)
|   +-- ratio_manager_ui.py      (Main UI)
|   +-- ratio_calculator.py      (Calculation engine)
+-- Importing/
|   +-- ratio_config.json        (Ratio storage)
|   +-- ratio_maker.py           (Create ratios)
+-- data/
|   +-- fundamentals/            (Financial data in Parquet)
```

---

## Example Workflow

### Complete Example:

1. **Create Ratios** (using Ratio Maker)
   - Current Ratio: `BS: Current Assets / BS: Current Liabilities`
   - Quick Ratio: `BS: Cash / BS: Current Liabilities`

2. **Open Ratio Manager**
   - See both ratios as "Not assigned"

3. **Assign Ratios**
   - Current Ratio -> Column B
   - Quick Ratio -> Column C

4. **Enter Tickers**
   ```
   A7: AAPL
   A8: MSFT
   A9: GOOGL
   ```

5. **Calculate**
   - Click "Refresh ratios sheet" in FinForge or run `RefreshRatios()`
   - See results:
   ```
   B7: 1.2500    C7: 0.8500
   B8: 1.3000    C8: 0.9200
   B9: 1.1800    C9: 0.7800
   ```

6. **Update if Needed**
   - Adjust the Row 4 assignments, then refresh again

---

## Troubleshooting

### "No ratios found"
- **Solution**: Create ratios first using Ratio Maker

### "No tickers found"
- **Solution**: Enter tickers in Column A starting from Row 6

### "Failed to load Parquet data"
- **Solution**: Make sure `data/balance_sheet.parquet` and `data/income_statement.parquet` exist
- Run data import first if needed

### "Column already in use"
- **Solution**: Reassign the ratio in Row 4 and refresh the sheet

### Calculation shows "N/A"
- **Reason**: Financial data not found for that ticker/item
- **Check**: Ticker spelling and data availability

### Calculation shows "DIV/0"
- **Reason**: Denominator is zero
- **Normal**: Some ratios can legitimately be undefined

---

## UI Features

### Ratio Manager Window:
- **Title**: Shows current mode
- **List**: All ratios with assignment status
   - Green = Assigned (shows column)
   - Gray = Not assigned
- **Buttons**:
   - Assign to Column
   - View Notes
   - Refresh list
   - Close

### Progress Dialog:
- Shows during calculation
- Real-time progress updates
- Can cancel if needed

### Confirmation Dialogs:
- After successful operations
- Error messages if something fails

---

## Performance

- **Fast Data Access**: Parquet files are optimized for speed
- **Efficient Calculation**: Only calculates what's needed
- **Minimal Excel Interaction**: Batch writes for better performance
- **Progress Tracking**: Know exactly what's happening

---

## Safety Features

- **Validation**: Prevents invalid column assignments
- **Confirmation**: Asks before unassigning
- **Error Handling**: Clear error messages
- **Data Preservation**: Careful with existing data

---

## Notes

- **Column A is Reserved**: Only for tickers
- **Row 6 is Reserved**: For future features
- **Columns B+**: Available for ratio assignment
- **No Limit**: Assign as many ratios as you want
- **One Ratio Per Column**: Keeps things clean

---

## Best Practices

1. **Create ratios first** before trying to assign
2. **Enter tickers** before calculating
3. **Use meaningful ratio names** for easy identification
4. **Add notes** to ratios to remember what they do
5. **Refresh data** regularly to keep ratios up to date
6. **Save Excel** after assigning ratios

---

This is a clean, simple, and efficient system. Enjoy!
