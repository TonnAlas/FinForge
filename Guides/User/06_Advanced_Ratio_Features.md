# Enhanced Ratio Maker - Feature Guide

## 🎨 New UI Features (November 2025)

### 1. **Horizontal Operator Layout**
All operators and buttons are now arranged **left-to-right** instead of top-to-bottom for a more intuitive workflow.

**Operator Buttons:**
- `+` Addition
- `-` Subtraction  
- `*` Multiplication
- `/` or `÷` Division (toggleable)
- `(` Opening parenthesis
- `)` Closing parenthesis

### 2. **Real-Time Syntax Highlighting**

As you type or insert items, the formula is **immediately color-coded**:

| Element | Color | Example |
|---------|-------|---------|
| **Operators** | 🟠 Orange (#FF9800) | `+`, `-`, `*`, `/` |
| **Brackets** | 🟡 Yellow (#FFD700) | `(`, `)` |
| **Income Statement** | 🟢 Green (#81C784) | `IS: Revenue`, `IS: Net Income` |
| **Balance Sheet** | 🔵 Light Blue (#81D4FA) | `BS: Total Assets`, `BS: Cash` |
| **Price Data** | 🟣 Purple (#CE93D8) | `P: Closing Price` |
| **Functions** | 🟡 Yellow-Orange (#FFC107) | `AVERAGE`, `SUM`, `MAX` |
| **Numbers** | 🔵 Light Blue (#90CAF9) | `100`, `1.5`, `0.25` |
| **Errors** | 🔴 Red (#F44336) | Invalid fields, typos |

### 3. **Error Detection & Highlighting**

Invalid tokens are automatically detected and marked with:
- 🔴 **Red text color**
- **Wavy red underline**

**Examples of errors:**
- Typos: `IS: Reveneu` (misspelled)
- Invalid fields: `XYZ: Unknown`
- Incomplete operators: `IS: Revenue +` (missing right operand)

### 4. **Color-Coded Advanced Functions Button**

The **Advanced Functions** button is styled with:
- 🟡 **Yellow-Orange color** (#FFC107)
- 📊 **Chart emoji** for visual recognition
- Matches the function highlighting color in formulas

### 5. **Color Legend**

A built-in **color legend** appears above the formula preview showing:
```
● Operators  ● Brackets  ● IS: Items  ● BS: Items  ● P: Items  ● Functions  ● Errors
```

Each bullet is colored to match its syntax highlighting.

---

## 📋 Complete Feature List

### Layout & Design
- ✅ Horizontal operator layout (left-to-right)
- ✅ Wider dialog (700px minimum width)
- ✅ Dark theme with VS Code-inspired colors
- ✅ Monospace font for formula preview (`Consolas`, `Courier New`)

### Formula Building
- ✅ Field selector with autocomplete dropdown
- ✅ Insert Field button
- ✅ Horizontal operator buttons (+, -, *, /, (, ))
- ✅ Advanced Functions dialog (MA, SUM, MAX, MIN, etc.)
- ✅ Real-time syntax highlighting as you type

### Visual Feedback
- ✅ Immediate color coding (operators, fields, functions)
- ✅ Error highlighting with red wavy underline
- ✅ Color legend for quick reference
- ✅ Notes indicator (📝 emoji when notes exist)

### Functionality
- ✅ Notes dialog for ratio documentation
- ✅ Save/Cancel buttons
- ✅ Formula validation
- ✅ Support for complex nested formulas

---

## 🎯 Usage Examples

### Example 1: Simple Ratio with Highlighting
**Gross Margin Formula:**
```
(IS: Revenue - IS: Cost of Revenue) / IS: Revenue
```

**How it appears:**
- `(` and `)` in **🟡 yellow**
- `IS: Revenue` in **🟢 green**
- `-` and `/` in **🟠 orange**
- `IS: Cost of Revenue` in **🟢 green**

### Example 2: Fraction Mode
**Creating a P/E Ratio:**

1. ✅ Check "Use Fraction Display"
2. Select `P: Closing Price` → Insert Field
3. Click `─\n÷` button (fraction division)
4. Select `IS: Earnings Per Share` → Insert Field

**Result:**
```
P: Closing Price / IS: Earnings Per Share
```
- `P: Closing Price` in **🟣 purple**
- `/` in **🟠 orange**
- `IS: Earnings Per Share` in **🟢 green**

### Example 3: Advanced Function with Highlighting
**50-Day Moving Average of Revenue:**
```
AVERAGE(IS: Revenue, 50 periods)
```

**How it appears:**
- `AVERAGE` in **🟡 yellow-orange**
- `(` and `)` in **🟡 yellow**
- `IS: Revenue` in **🟢 green**
- `50` in **🔵 light blue**

### Example 4: Error Detection
**Typo in field name:**
```
IS: Reveneu / IS: Cost
```

**How it appears:**
- `IS:` in **🟢 green** (valid prefix)
- `Reveneu` in **🔴 red with wavy underline** (invalid field)
- `/` in **🟠 orange**
- `IS: Cost` in **🔴 red with wavy underline** (incomplete field name)

---

## 🔧 Technical Details

### Syntax Highlighter Implementation
- Built with `QSyntaxHighlighter` from PySide6
- Real-time parsing and highlighting
- Regex-based pattern matching
- No performance impact on typing

### Color Scheme (VS Code-inspired)
```python
Operators:         #FF9800  (Material Orange 500)
Brackets:          #FFD700  (Gold)
Income Statement:  #81C784  (Material Green 300)
Balance Sheet:     #81D4FA  (Material Light Blue 300)
Price Data:        #CE93D8  (Material Purple 300)
Functions:         #FFC107  (Material Amber 500)
Numbers:           #90CAF9  (Material Light Blue 200)
Errors:            #F44336  (Material Red 500)
```

### Fraction Mode
- Checkbox state stored in `self.use_fraction`
- Updates division button text: `/` → `─\n÷`
- Formula storage remains unchanged (always uses `/`)
- Visual hint for mathematical clarity

---

## 📝 Best Practices

### 1. Use Color Feedback
- **Green/Blue/Purple** = Valid fields ✓
- **Orange/Yellow** = Valid operators/brackets ✓
- **Red** = Fix immediately! ✗

### 2. Fraction Display for Clarity
Enable "Use Fraction Display" when creating:
- Financial ratios (P/E, P/B, ROE)
- Margin calculations
- Percentage formulas

Keep it off for:
- Simple divisions
- Multi-operator complex formulas

### 3. Leverage Advanced Functions
Use the **📊 Advanced Functions** button for:
- Moving averages (MA50, MA200)
- Aggregate calculations (SUM, AVERAGE)
- Statistical measures (STDEV, VAR)

### 4. Add Notes
Click **📝 Notes** to document:
- What the ratio measures
- Industry benchmarks
- Interpretation guidelines
- Data sources

---

## 🚀 Quick Start

1. **Open Ratio Maker**: Run `python test_ratio_maker.py`
2. **Click "Add Ratio"**
3. **Enter a name**: e.g., "Gross Margin"
4. **Build the formula** using:
   - Field selector + Insert Field button
   - Horizontal operator buttons
   - Advanced Functions (optional)
5. **Watch real-time highlighting** as you build
6. **Fix any red errors** before saving
7. **Click Save**

---

## 💡 Tips & Tricks

### Keyboard Shortcuts
- Type directly in the formula preview area
- Use field selector autocomplete (start typing)
- Copy/paste formulas from Excel or other sources

### Complex Formulas
For nested calculations, use parentheses liberally:
```
((IS: Revenue - IS: COGS) / IS: Revenue) * 100
```
The **🟡 yellow brackets** make nesting visually clear.

### Validation
Before clicking Save:
1. Check for **🔴 red errors**
2. Verify all fields are **🟢 green**, **🔵 blue**, or **🟣 purple**
3. Ensure operators are **🟠 orange** or **🟡 yellow**

---

## 🎨 Color Accessibility

The color scheme is designed for:
- ✅ Dark theme compatibility
- ✅ High contrast (WCAG AA compliant)
- ✅ Color-blind friendly (uses multiple visual cues)
- ✅ Readable on 1080p+ displays

If you need adjustments, modify the colors in `FormulaHighlighter.setup_formats()`.

---

## 📞 Support

**Issues or Questions?**
- Check the color legend in the dialog
- Hover over buttons for tooltips
- Red wavy underlines indicate errors to fix

**Feature Requests?**
Let us know what additional syntax highlighting or UI improvements you'd like!

---

*Last Updated: November 11, 2025*
*Version: 2.0 - Enhanced UI with Syntax Highlighting*
