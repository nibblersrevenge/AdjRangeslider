using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Adj.Blazor.RangeSlider;

public class ColorsAndDimensions
{
    public ColorsAndDimensions(
        string? selectedRangeColor = null,
        string? unselectedRangeColor = null,
        string? sliderBackgroundColor = null,
        string? selectedHoverColor = null,
        int? selectedRangeHeightInPx = null,
        int? unselectedRangeHeightInPx = null)
    {
        SelectedRangeHeightInPx = selectedRangeHeightInPx;
        UnselectedRangeHeightInPx = unselectedRangeHeightInPx;
        SelectedHoverColor = selectedHoverColor;
        SliderBackgroundColor = sliderBackgroundColor;
        SelectedRangeColor = selectedRangeColor;
        UnselectedRangeColor = unselectedRangeColor;
    }

    public int? SelectedRangeHeightInPx { get; set; }
    public int? UnselectedRangeHeightInPx { get; set; }

    public string? SelectedHoverColor { get; set; }
    public string? SliderBackgroundColor { get; set; }
    public string? SelectedRangeColor { get; set; }
    public string? UnselectedRangeColor { get; set; }

    string dblString(double? val, int digits = 1) { if (val == null) return ""; return ((double)val).ToString($"N{digits}", System.Globalization.CultureInfo.InvariantCulture); }

    public void SetCssVarList(List<object> cssVarList)
    {

        if (SelectedRangeHeightInPx != null) cssVarList.Add(new { key = "--adj-range-selected-height", value = $"{dblString(SelectedRangeHeightInPx)}px" });
        if (UnselectedRangeHeightInPx != null) cssVarList.Add(new { key = "--adj-range-bg-height", value = $"{dblString(UnselectedRangeHeightInPx)}px" });

        if (SelectedHoverColor != null) cssVarList.Add(new { key = "--adj-handle-range-hover-color", value = $"{SelectedHoverColor}" });
        if (SliderBackgroundColor != null) cssVarList.Add(new { key = "--adj-slider-bg", value = $"{SliderBackgroundColor}" });
        if (SelectedRangeColor != null) cssVarList.Add(new { key = "--adj-range-selected-color", value = $"{SelectedRangeColor}" });
        if (UnselectedRangeColor != null) cssVarList.Add(new { key = "--adj-range-bg-color", value = $"{UnselectedRangeColor}" });

    }


}
