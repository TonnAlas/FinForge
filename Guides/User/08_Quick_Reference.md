# 🎨 Ratio Maker - Quick Reference Card

## Color Guide (At-a-Glance)

```
🟠 Orange        →  Operators      →  + - * /
🟡 Yellow        →  Brackets       →  ( )
🟢 Green         →  IS: Items      →  Revenue, Net Income, EBITDA
🔵 Light Blue    →  BS: Items      →  Total Assets, Cash, Debt
🟣 Purple        →  P: Items       →  Closing Price, Volume
🟡 Yellow-Orange →  Functions      →  AVERAGE, SUM, MAX, MIN
🔵 Light Blue    →  Numbers        →  100, 1.5, 3.14
🔴 Red + Wave    →  Errors         →  Typos, invalid fields
```

---

## Button Layout (Horizontal)

```
Operators:  [ + ]  [ - ]  [ * ]  [ / ]  [ ( ]  [ ) ]
```

---

## Common Formulas

### Gross Margin
```
(IS: Revenue - IS: Cost of Revenue) / IS: Revenue
```

### Current Ratio
```
BS: Current Assets / BS: Current Liabilities
```

### P/E Ratio
```
P: Closing Price / IS: Earnings Per Share
```

### ROE (Return on Equity)
```
IS: Net Income / BS: Total Equity
```

### Debt-to-Equity
```
BS: Total Debt / BS: Total Equity
```

### Operating Margin
```
IS: Operating Income / IS: Revenue
```

### Working Capital
```
BS: Current Assets - BS: Current Liabilities
```

---

## Error Detection

### ✅ Valid
```
IS: Revenue / IS: Cost of Revenue
```
All green/blue, no red!

### ❌ Invalid (Typos)
```
IS: Reveneu / BS: Totl Assets
```
Red wavy underlines on typos!

---

## Keyboard Tips

- Type directly in formula area
- Use field selector dropdown for autocomplete
- Copy/paste formulas if needed
- Operators auto-space

---

## Pre-Save Checklist

1. ✓ No red errors
2. ✓ All fields are green/blue/purple
3. ✓ Operators are orange/yellow
4. ✓ Brackets match
5. ✓ Formula makes sense

---

## Quick Actions

| Action | How |
|--------|-----|
| Add field | Select → Insert Field |
| Add operator | Click operator button |
| Add function | Click 📊 Advanced Functions |
| Add notes | Click 📝 Notes |
| Save ratio | Click green Save |
| Cancel | Click Cancel |

---

## Function Reference

### Available Functions
- **AVERAGE** - Moving average
- **SUM** - Summation
- **MAX** - Maximum value
- **MIN** - Minimum value
- **MEDIAN** - Median value
- **STDEV** - Standard deviation
- **VAR** - Variance
- **COUNT** - Count values
- **GROWTH_RATE** - Growth rate

### Function Syntax
```
FUNCTION_NAME(Data Source, Period)
```

Example:
```
AVERAGE(IS: Revenue, 50 periods)
```

---

## Color Legend (In App)

Look for this row above the formula preview:

```
● Operators  ● Brackets  ● IS: Items  ● BS: Items  ● P: Items  ● Functions  ● Errors
```

Each bullet matches its color!

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No colors | Check PySide6 installed |
| Everything red | Verify Excel file open & fields loaded |
| Button doesn't change | Toggle fraction checkbox |
| Can't save | Fix red errors first |

---

## File Locations

- **Ratio Config**: `Importing/ratio_config.json`
- **Main App**: `Importing/ratio_maker.py`
- **Test Script**: `test_ratio_maker.py`
- **Demo Script**: `demo_ratio_maker.py`

---

## Documentation

1. **Enhanced_Ratio_Maker_Guide.md** - Full feature guide
2. **Color_Reference.md** - Complete color palette
3. **Enhancement_Summary.md** - Technical details

All in `Guides/` folder!

---

**Version**: 2.0 Enhanced (Nov 2025)
**Theme**: Dark with VS Code colors
**Layout**: Horizontal operators
**Highlighting**: Real-time syntax colors

*Keep this card handy for quick reference!* 📌
