using Microsoft.AspNetCore.Components;

namespace StageFold.App.Shared;

/// <summary>One action boundary for user-visible failure without discarding the current film.</summary>
public abstract class ActionPage : ComponentBase
{
    protected bool Busy { get; set; }
    protected string Message { get; set; } = "";
    protected bool IsError { get; set; }
    const bool IsLogEnabled = true;
    long ActionGeneration;

    /// <summary>Executes a complete UI action, exposing failure and avoiding dependent success steps.</summary>
    protected async Task Act(string operation, Func<Task> action, bool replace = false)
    {
        if (Busy && !replace) return;
        var generation=++ActionGeneration;
        Busy = true; Message = ""; IsError = false;
        var timer = System.Diagnostics.Stopwatch.StartNew();
        try { await action(); }
        catch (Exception error)
        {
            if(generation!=ActionGeneration)return;
            IsError = true;
            Message = error is FormatException or System.Text.Json.JsonException ? error.Message : error is Microsoft.JSInterop.JSException ? "Browser action failed. Your scene remains open. " + error.Message : error.Message;
            if (IsLogEnabled) Console.Error.WriteLine($"StageFold {operation} failed ({error.GetType().Name}); no document or credential was logged.");
        }
        finally { if(generation==ActionGeneration)Busy = false; timer.Stop(); if (IsLogEnabled) Console.WriteLine($"StageFold {operation}; elapsedMs={timer.ElapsedMilliseconds}; success={!IsError}"); }
    }
}
