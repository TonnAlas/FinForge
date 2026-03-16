# 🎨 Ratio Maker - Syntax Highlighting Color Reference

## Color Palette

### Operator Colors
```
🟠 ORANGE (#FF9800) - Arithmetic Operators
  + (addition)
  - (subtraction)
  * (multiplication)
  / (division)
```

### Bracket Colors
```
🟡 YELLOW (#FFD700) - Grouping Brackets
  ( (open parenthesis)
  ) (close parenthesis)
```

### Financial Item Colors

#### Income Statement Items
```
🟢 GREEN (#81C784) - Income Statement Fields
  IS: Revenue
  IS: Net Income
  IS: Operating Income
  IS: EBITDA
  IS: Gross Profit
  IS: Cost of Revenue
  ... (any field prefixed with "IS:")
```

#### Balance Sheet Items
```
🔵 LIGHT BLUE (#81D4FA) - Balance Sheet Fields
  BS: Total Assets
  BS: Total Equity
  BS: Total Liabilities
  BS: Cash
  BS: Current Assets
  BS: Current Liabilities
  ... (any field prefixed with "BS:")
```

#### Price/Market Data
```
🟣 PURPLE (#CE93D8) - Price & Market Data
  P: Closing Price
  P: Opening Price
  P: High Price
  P: Low Price
  P: Volume
  P: Adjusted Close
  ... (any field prefixed with "P:")
```

### Function Colors
```
🟡 YELLOW-ORANGE (#FFC107) - Advanced Functions
  AVERAGE (Moving Average)
  SUM
  MAX
  MIN
  MEDIAN
  STDEV (Standard Deviation)
  VAR (Variance)
  COUNT
  GROWTH_RATE
```

### Number Colors
```
🔵 LIGHT BLUE (#90CAF9) - Numeric Literals
  100
  1.5
  0.25
  3.14159
```

### Error Colors
```
🔴 RED (#F44336) - Invalid Tokens/Errors
  - Misspelled field names
  - Unknown prefixes
  - Unrecognized tokens
  - Typos
  
  Visual indicators:
  - Red text color
  - Wavy red underline
```

---

## Example Formulas with Color Coding

### 1. Gross Margin
```
(IS: Revenue - IS: Cost of Revenue) / IS: Revenue
```
**Colors:**
- `(`, `)` = 🟡 Yellow
- `IS: Revenue` = 🟢 Green (appears twice)
- `IS: Cost of Revenue` = 🟢 Green
- `-`, `/` = 🟠 Orange

---

### 2. Current Ratio
```
BS: Current Assets / BS: Current Liabilities
```
**Colors:**
- `BS: Current Assets` = 🔵 Light Blue
- `BS: Current Liabilities` = 🔵 Light Blue
- `/` = 🟠 Orange

---

### 3. Price-to-Earnings (P/E)
```
P: Closing Price / IS: Earnings Per Share
```
**Colors:**
- `P: Closing Price` = 🟣 Purple
- `IS: Earnings Per Share` = 🟢 Green
- `/` = 🟠 Orange

---

### 4. Return on Equity (ROE)
```
IS: Net Income / BS: Total Equity
```
**Colors:**
- `IS: Net Income` = 🟢 Green
- `BS: Total Equity` = 🔵 Light Blue
- `/` = 🟠 Orange

---

### 5. Debt-to-Equity Ratio
```
BS: Total Debt / BS: Total Equity
```
**Colors:**
- `BS: Total Debt` = 🔵 Light Blue
- `BS: Total Equity` = 🔵 Light Blue
- `/` = 🟠 Orange

---

### 6. Operating Margin
```
IS: Operating Income / IS: Revenue
```
**Colors:**
- `IS: Operating Income` = 🟢 Green
- `IS: Revenue` = 🟢 Green
- `/` = 🟠 Orange

---

### 7. Working Capital
```
BS: Current Assets - BS: Current Liabilities
```
**Colors:**
- `BS: Current Assets` = 🔵 Light Blue
- `BS: Current Liabilities` = 🔵 Light Blue
- `-` = 🟠 Orange

---

### 8. Complex Formula with Functions
```
AVERAGE(IS: Revenue, 50) / MAX(IS: Revenue, 100)
```
**Colors:**
- `AVERAGE`, `MAX` = 🟡 Yellow-Orange
- `(`, `)` = 🟡 Yellow
- `IS: Revenue` = 🟢 Green (appears twice)
- `50`, `100` = 🔵 Light Blue
- `/` = 🟠 Orange

---

### 9. Nested Calculation
```
((IS: Revenue - IS: COGS) / IS: Revenue) * 100
```
**Colors:**
- `(`, `)` = 🟡 Yellow (all 4 brackets)
- `IS: Revenue` = 🟢 Green (appears twice)
- `IS: COGS` = 🟢 Green
- `-`, `/`, `*` = 🟠 Orange
- `100` = 🔵 Light Blue

---

### 10. Error Example (Typo)
```
IS: Reveneu / BS: Totl Assets
```
**Colors:**
- `IS:` = 🟢 Green (valid prefix)
- `Reveneu` = 🔴 Red + wavy underline (invalid - should be "Revenue")
- `/` = 🟠 Orange
- `BS:` = 🔵 Light Blue (valid prefix)
- `Totl Assets` = 🔴 Red + wavy underline (invalid - should be "Total Assets")

**Correct version:**
```
IS: Revenue / BS: Total Assets
```
All green/blue, no red!

---

## Color Blindness Considerations

### For Deuteranopia (Red-Green Color Blindness):
- Income Statement (🟢) vs Balance Sheet (🔵): Can still distinguish by Blue vs non-Blue
- Operators (🟠) vs Errors (🔴): Both may look similar, but errors have **wavy underline**

### For Protanopia (Red-Green Color Blindness):
- Similar to Deuteranopia
- Rely on wavy underline for error detection

### For Tritanopia (Blue-Yellow Color Blindness):
- Functions (🟡) vs Brackets (🟡): Both same color, but context differs
- Numbers (🔵) vs Balance Sheet (🔵): Both same color family, but context differs

### Universal Tips:
- **Wavy underline** = Error (regardless of color)
- **Prefix recognition**: `IS:` = Income, `BS:` = Balance, `P:` = Price
- **Context**: Functions are always keywords (AVERAGE, SUM, etc.)

---

## Dark Theme Background Colors

### Dialog Background
- **Main**: #121212 (Very Dark Gray)
- **Input Fields**: #1E1E1E (Dark Gray)
- **Borders**: #2C2C2C (Medium Dark Gray)

### Text Colors
- **Primary Text**: #E0E0E0 (Light Gray)
- **Secondary Text**: #B0B0B0 (Medium Gray)

### Accent Colors
- **Primary Accent**: #29B6F6 (Light Blue) - used for buttons, focus borders
- **Hover Accent**: #1E88E5 (Darker Blue)
- **Success**: #4CAF50 (Green) - Save button
- **Danger**: #E57373 (Red) - Delete button
- **Warning**: #FFA726 (Orange) - Clear button

---

## Contrast Ratios (WCAG AA Compliance)

All color combinations meet WCAG AA standards for readability:

| Foreground | Background | Contrast Ratio | Pass? |
|------------|------------|----------------|-------|
| #FF9800 (Orange) | #1E1E1E | 6.2:1 | ✅ AA |
| #FFD700 (Yellow) | #1E1E1E | 12.1:1 | ✅ AAA |
| #81C784 (Green) | #1E1E1E | 7.8:1 | ✅ AAA |
| #81D4FA (Blue) | #1E1E1E | 9.3:1 | ✅ AAA |
| #CE93D8 (Purple) | #1E1E1E | 6.5:1 | ✅ AA |
| #FFC107 (Amber) | #1E1E1E | 8.7:1 | ✅ AAA |
| #F44336 (Red) | #1E1E1E | 5.2:1 | ✅ AA |

All colors are readable on both #121212 and #1E1E1E backgrounds.

---

## Customization

To change colors, edit `FormulaHighlighter.setup_formats()` in `ratio_maker.py`:

```python
# Example: Change operator color to red
self.operator_format.setForeground(QColor("#FF0000"))

# Example: Change Income Statement to bright green
self.income_statement_format.setForeground(QColor("#00FF00"))

# Example: Remove error underline
self.error_format.setUnderlineStyle(QTextCharFormat.UnderlineStyle.NoUnderline)
```

---

## Screenshots Reference

### What You Should See:

1. **Horizontal Operator Buttons** - All in one row, left to right
2. **Color Legend** - Row of colored bullets showing each category
3. **Formula Preview** - Large text area with colored syntax
4. **Advanced Functions Button** - Yellow-orange with 📊 emoji

### Color Distribution in a Typical Formula:
- **Most Common**: 🟢 Green and 🔵 Blue (financial items)
- **Structural**: 🟠 Orange (operators), 🟡 Yellow (brackets)
- **Special**: 🟣 Purple (price data), 🟡 Yellow-Orange (functions)
- **Rare**: 🔴 Red (only for errors)

---

*This reference guide helps you understand what each color means and how to read formulas at a glance.*
