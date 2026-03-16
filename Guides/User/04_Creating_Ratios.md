# Creating Ratios

Learn how to create custom financial ratios using the Ratio Maker tool.

---

## What are Financial Ratios?

Financial ratios are calculations that use financial statement data to measure:
- Profitability (e.g., Profit Margin, ROE)
- Liquidity (e.g., Current Ratio, Quick Ratio)
- Leverage (e.g., Debt-to-Equity)
- Efficiency (e.g., Asset Turnover)
- Valuation (e.g., P/E Ratio, P/B Ratio)

---

## Opening the Ratio Maker

### From Excel

1. Open `FinForge.xlsm`
2. Run the macro: `OpenRatioMaker()`
   - Press `Alt + F8`
   - Select `OpenRatioMaker`
   - Click Run

### From Python

```powershell
cd C:\Users\tonna\Desktop\Stocks
.\.venv\Scripts\Activate.ps1
python Importing/ratio_maker.py
```

---

## Creating Your First Ratio

### Step 1: Click "New Ratio"

The Create Ratio dialog opens.

### Step 2: Enter Ratio Name

Give your ratio a descriptive name:
- "Gross Margin"
- "Current Ratio"
- "Debt to Equity"

### Step 3: Build the Formula

Use the field selector and operators to build your formula.

**Available Data Sources:**

| Prefix | Source | Example Fields |
|--------|--------|----------------|
| `IS:` | Income Statement | Total Revenue, Net Income, EBITDA |
| `BS:` | Balance Sheet | Total Assets, Total Debt, Cash |
| `CF:` | Cash Flow | Operating Cash Flow, Free Cash Flow |
| `RATIO:` | Other Ratios | Use your previously created ratios |

**Available Operators:**

| Button | Operation |
|--------|-----------|
| `+` | Addition |
| `-` | Subtraction |
| `*` | Multiplication |
| `/` | Division |
| `(` | Open parenthesis |
| `)` | Close parenthesis |

### Step 4: Add Notes (Optional)

Add a description or notes about the ratio:
- What it measures
- How to interpret it
- Reference ranges

### Step 5: Save

Click Save to store the ratio in `ratio_config.json`.

---

## Formula Examples

### Profitability Ratios

**Gross Margin**
```
(IS: Total Revenue - IS: Cost Of Revenue) / IS: Total Revenue
```

**Operating Margin**
```
IS: Operating Income / IS: Total Revenue
```

**Net Profit Margin**
```
IS: Net Income / IS: Total Revenue
```

**Return on Assets (ROA)**
```
IS: Net Income / BS: Total Assets
```

**Return on Equity (ROE)**
```
IS: Net Income / BS: Stockholders Equity
```

### Liquidity Ratios

**Current Ratio**
```
BS: Current Assets / BS: Current Liabilities
```

**Quick Ratio**
```
(BS: Current Assets - BS: Inventory) / BS: Current Liabilities
```

### Leverage Ratios

**Debt to Equity**
```
BS: Total Debt / BS: Stockholders Equity
```

**Debt to Assets**
```
BS: Total Debt / BS: Total Assets
```

### Efficiency Ratios

**Asset Turnover**
```
IS: Total Revenue / BS: Total Assets
```

### Using Other Ratios

**ROE using DuPont Analysis**
```
RATIO: Net Profit Margin * RATIO: Asset Turnover * RATIO: Equity Multiplier
```

### Using Numbers

**Interest Coverage (example with constant)**
```
IS: EBIT / IS: Interest Expense
```

**Half of Net Debt**
```
BS: Net Debt / 2
```

---

## Understanding Syntax Highlighting

As you type, the formula is color-coded:

| Color | Meaning |
|-------|---------|
| 🟢 Green | Income Statement fields (IS:) |
| 🔵 Light Blue | Balance Sheet fields (BS:) |
| 🟣 Purple | Price/Cash Flow fields |
| 🟠 Orange | Operators (+, -, *, /) |
| 🟡 Yellow | Parentheses |
| 🥇 Gold | Other Ratios (RATIO:) |
| 🔵 Light Blue | Numbers |
| 🔴 Red + Wavy | Errors (typos, invalid fields) |

---

## Using the Fraction Display

For visual clarity, you can toggle fraction display:

1. Check "Use Fraction Display" checkbox
2. The division button changes to show a fraction bar
3. Formulas are easier to read visually

---

## Editing Existing Ratios

1. Select the ratio in the list
2. Click **Edit**
3. Modify the name, formula, or notes
4. Click **Save**

**Note:** If the ratio is assigned to an Excel column, the column header is automatically updated with the new name.

---

## Deleting Ratios

1. Select the ratio in the list
2. Click **Delete**
3. Confirm the deletion

**Warning:** If the ratio is assigned to an Excel column, unassign it first.

---

## Where are Ratios Stored?

Ratios are saved in: `Importing/ratio_config.json`

```json
{
  "ratios": {
    "Gross Margin": {
      "formula": "(IS: Total Revenue - IS: Cost Of Revenue) / IS: Total Revenue",
      "notes": "Measures profitability after direct costs"
    },
    "Current Ratio": {
      "formula": "BS: Current Assets / BS: Current Liabilities",
      "notes": "Measures short-term liquidity"
    }
  }
}
```

---

## Tips for Creating Good Ratios

1. **Use descriptive names** - "Gross Margin" not "GM1"
2. **Add notes** - Document what the ratio measures
3. **Test with known values** - Verify calculations are correct
4. **Use parentheses** - Ensure correct order of operations
5. **Check field names** - Use exact field names from the data

---

## Troubleshooting

### Red Error Highlighting

**Cause:** Invalid field name
**Solution:** Check spelling, use the field selector dropdown

### "Field not found" Error

**Cause:** Field doesn't exist in the data
**Solution:** See [Available Data Reference](Available_Data_Reference.md) for valid field names

### Calculation Shows #N/A

**Cause:** 
- Data missing for the ticker
- Division by zero

**Solution:**
- Verify data exists for the ticker
- Add logic to handle zero denominators

### Ratio Not Appearing in Manager

**Cause:** Save failed or file permission issue
**Solution:** 
- Check if ratio_config.json is writable
- Try saving again

---

## Next Steps

After creating ratios:
- [Assign them to Excel columns](Ratio_Assignment_User_Guide.md)
- [View in the Ratios sheet](Ratio_Assignment_User_Guide.md)
