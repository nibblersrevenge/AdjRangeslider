using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading.Tasks;

namespace Adj.Blazor.RangeSlider;

public class HandleDefinition
{
    private string _borderRadius;


    public HandleDefinition(bool useDefaultIcons, int heightInPx, string color)
    {
        UseDefaultIcons = useDefaultIcons;
        HeightInPx = heightInPx;
        Color = color;
    }

    public HandleDefinition(int widthInPx,
                            int heightInPx,
                            string backgroundUrl = "",
                            string backgroundColor = "",
                            string borderRadius = "",
                            double? borderWidthInPx = null,
                            string borderColor = "",
                            string repeat = "no-repeat")
    {
        WidthInPx = widthInPx;
        HeightInPx = heightInPx;
        BackgroundUrl = backgroundUrl;
        BgRepeat = repeat;
        _borderRadius = $"{borderRadius}";
        BorderColor = $"{borderColor}";
        BorderWidthInPx = borderWidthInPx;
        BackgroundColor = backgroundColor;
    }

    public double WidthInPx { get; set; }
    public double HeightInPx { get; set; }
    public double? BorderWidthInPx { get; set; }
    public string BackgroundUrl { get; set; }
    public string BackgroundColor { get; set; }
    public string BorderColor { get; set; }
    public string BgRepeat { get; set; } = "no-repeat";

    public string BorderRadius
    {
        get { return _borderRadius; }
        set
        {
            // Validate the value
            if (IsValidBorderRadius(value))
            {
                _borderRadius = value;
            }
            else
            {
                throw new ArgumentException("Invalid BorderRadius value. Only values in percent (e.g., 33%) or values in pixels (e.g., 5px) or empty or 0 are allowed.");
            }
        }
    }

    public bool UseDefaultIcons { get; }
    public string Color { get; set; }

    string dblString(double val, int digits = 1) => val.ToString($"N{digits}", System.Globalization.CultureInfo.InvariantCulture);
    string dblString(double? val, int digits = 1) { if (val == null) return ""; return ((double)val).ToString($"N{digits}", System.Globalization.CultureInfo.InvariantCulture); }

    public enum EnStartEnd { Start, End }

    public void SetCssVarList(List<object> cssVarList, EnStartEnd startEnd, AdjRangeSlider.EnHandlePosition position)
    {

        if (UseDefaultIcons)
        {
            cssVarList.Add(new { key = $"--adj-handle-{startEnd.ToString().ToLower()}-width", value = $"{dblString(HeightInPx / 3 * 2)}px" });
            cssVarList.Add(new { key = $"--adj-handle-{startEnd.ToString().ToLower()}-height", value = $"{(HeightInPx)}px" });

            Color = Color.Replace("#", "%23");

            switch (position)
            {
                case AdjRangeSlider.EnHandlePosition.Outside:
                    if (startEnd == EnStartEnd.Start)
                        cssVarList.Add(new { key = $"--adj-handle-{startEnd.ToString().ToLower()}-bg", value = $"no-repeat url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -30 20 30'%3E%3Cpath d='M18-15 0-30 0 0 18-15 18 0 20 0 20-30 18-30' fill='{Color}'/%3E%3C/svg%3E\")" });
                    else if (startEnd == EnStartEnd.End)
                        cssVarList.Add(new { key = $"--adj-handle-{startEnd.ToString().ToLower()}-bg", value = $"no-repeat url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -30 20 30'%3E%3Cpath d='M2-15 20 0 20-30 2-15 2-30 0-30 0 0 2 0' fill='{Color}'/%3E%3C/svg%3E\")" });
                    break;
                case AdjRangeSlider.EnHandlePosition.Middle:
                    if (startEnd == EnStartEnd.Start)
                        cssVarList.Add(new { key = $"--adj-handle-{startEnd.ToString().ToLower()}-bg", value = $"no-repeat url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -30 20 30'%3E%3Cpath d='M10 0 20-15 20-15 10-30 0-15 0-15' fill='{Color}'/%3E%3C/svg%3E\")" });
                    else if (startEnd == EnStartEnd.End)
                        cssVarList.Add(new { key = $"--adj-handle-{startEnd.ToString().ToLower()}-bg", value = $"no-repeat url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -30 20 30'%3E%3Cpath d='M10 0 20-15 20-15 10-30 0-15 0-15' fill='{Color}'/%3E%3C/svg%3E\")" });
                    break;
                case AdjRangeSlider.EnHandlePosition.Inside:
                    if (startEnd == EnStartEnd.Start)
                        cssVarList.Add(new { key = $"--adj-handle-{startEnd.ToString().ToLower()}-bg", value = $"no-repeat url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -30 20 30'%3E%3Cpath d='M2-15 20 0 20-30 2-15 2-30 0-30 0 0 2 0' fill='{Color}'/%3E%3C/svg%3E\")" });
                    else if (startEnd == EnStartEnd.End)
                        cssVarList.Add(new { key = $"--adj-handle-{startEnd.ToString().ToLower()}-bg", value = $"no-repeat url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -30 20 30'%3E%3Cpath d='M18-15 0-30 0 0 18-15 18 0 20 0 20-30 18-30' fill='{Color}'/%3E%3C/svg%3E\")" });

                    break;
                default:
                    break;
            }

        }
        else
        {
            cssVarList.Add(new { key = $"--adj-handle-{startEnd.ToString().ToLower()}-width", value = $"{dblString(WidthInPx)}px" });
            cssVarList.Add(new { key = $"--adj-handle-{startEnd.ToString().ToLower()}-height", value = $"{(HeightInPx)}px" });


            if (!string.IsNullOrWhiteSpace(BorderColor)) cssVarList.Add(new { key = $"--adj-handle-{startEnd.ToString().ToLower()}-border-color", value = $"{BorderColor}" });

            if (BorderWidthInPx != null) cssVarList.Add(new { key = $"--adj-handle-{startEnd.ToString().ToLower()}-border-width", value = $"{dblString(BorderWidthInPx)}px" });

            if (!string.IsNullOrWhiteSpace(BorderRadius)) cssVarList.Add(new { key = $"--adj-handle-{startEnd.ToString().ToLower()}-border-radius", value = $"{BorderRadius}" });

            string bgValue = "";

            if (BackgroundColor == "" && string.IsNullOrWhiteSpace(BackgroundUrl)) BackgroundColor = "#82ccb8 ";
            if (BackgroundColor.Length > 0) bgValue = $"{BackgroundColor.Trim()} ";
            if (BackgroundUrl.Length > 0) bgValue += $"{BgRepeat.Trim()} url({BackgroundUrl.Trim()}) ";
            cssVarList.Add(new { key = $"--adj-handle-{startEnd.ToString().ToLower()}-bg", value = $"{bgValue}" });
        }
    }
    private bool IsValidBorderRadius(string value)
    {
        // Check if the value is in percent or pixels format
        return value.EndsWith("%") || value.EndsWith("px") || value == "" || value == "0";
    }
}
