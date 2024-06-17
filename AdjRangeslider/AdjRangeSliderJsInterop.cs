using Microsoft.JSInterop;

using System.Reflection;

namespace Adj.Blazor.RangeSlider;

public class AdjRangeSliderJsInterop : IAsyncDisposable
{
    static string _timestamp;
    static string timestamp
    {
        get
        {
            _timestamp ??= System.Diagnostics.Debugger.IsAttached ? 
                             $"v1={DateTime.Now.Ticks.ToString()}-{Assembly.GetAssembly(typeof(AdjRangeSlider)).GetName().Version}" :
                             $"v1={Assembly.GetEntryAssembly().GetCustomAttribute<AssemblyFileVersionAttribute>().Version}"; return _timestamp;
        }
    }



    private readonly Lazy<Task<IJSObjectReference>> moduleTask;

    private readonly DotNetObjectReference<AdjRangeSlider> dotNetObj;
    public AdjRangeSliderJsInterop(IJSRuntime jsRuntime, DotNetObjectReference<AdjRangeSlider> dotNetObj)
    {

        this.dotNetObj = dotNetObj;
        moduleTask = new(
            () => jsRuntime.InvokeAsync<IJSObjectReference>(
            "import", $"./_content/Adj.Blazor.RangeSlider/adj-range-slider.js?{timestamp}").AsTask());
    }

    public async ValueTask<string> UpdateRange(string parentSelector,int startValue, int endValue)
    {
        var module = await moduleTask.Value;
        return await module.InvokeAsync<string>("updateRange", dotNetObj, parentSelector,startValue, endValue);
    }


    public async ValueTask<string> InitDraggableWithinBounds(
        string parentSelector,
        bool isHandleLeft,
        bool isHandleRight,
        int stepValue,
        int startValue,
        int endValue,
        int minValue,
        int maxValue,
        List<object> cssVarList)
    {
        var module = await moduleTask.Value;
        await module.InvokeVoidAsync("loadCss", $"./_content/Adj.Blazor.RangeSlider/adj-range-slider.css?{timestamp}");
        return await module.InvokeAsync<string>("initDraggableWithinBounds", dotNetObj,
                                                parentSelector,
                                                isHandleLeft,
                                                isHandleRight,
                                                stepValue,
                                                startValue,
                                                endValue,
                                                minValue,
                                                maxValue,
                                                cssVarList);

    }

    public async ValueTask DisposeAsync()
    {
        if (moduleTask.IsValueCreated)
        {
            var module = await moduleTask.Value;
            await module.DisposeAsync();
        }
    }
}
