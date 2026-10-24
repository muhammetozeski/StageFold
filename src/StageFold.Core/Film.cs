using System.Text.Json.Serialization;

namespace StageFold.Core;

/// <summary>A portable film containing only first-party vector stage vocabulary and captions.</summary>
[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed class Film
{
    public int FormatVersion { get; set; } = 1;
    public string Title { get; set; } = "Untitled scene";
    public string Summary { get; set; } = "";
    public List<CastMember> Cast { get; set; } = [];
    public List<Shot> Shots { get; set; } = [];
}

/// <summary>An original vector performer, identified consistently across shots.</summary>
[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed class CastMember
{
    public string Id { get; set; } = FilmRules.NewId();
    public string Name { get; set; } = "Performer";
    public string Look { get; set; } = "dot";
    public string Color { get; set; } = "orange";
}

/// <summary>A continuous stage shot with independent movement paths and timed captions.</summary>
[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed class Shot
{
    public string Id { get; set; } = FilmRules.NewId();
    public string Label { get; set; } = "A new beat";
    public string Stage { get; set; } = "rooftop";
    public int DurationMs { get; set; } = 6000;
    public List<Performance> Performers { get; set; } = [];
    public List<Speech> Speech { get; set; } = [];
}

/// <summary>A normalized start/end path, gesture and expression for one cast member in a shot.</summary>
[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed class Performance
{
    public string ActorId { get; set; } = "";
    public double FromX { get; set; } = .3;
    public double FromY { get; set; } = .8;
    public double ToX { get; set; } = .3;
    public double ToY { get; set; } = .8;
    public double Scale { get; set; } = 1;
    public string Pose { get; set; } = "idle";
    public string Mood { get; set; } = "calm";
    public bool Flip { get; set; }
}

/// <summary>A caption tied to an on-stage actor and an exact shot time interval.</summary>
[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed class Speech
{
    public string Id { get; set; } = FilmRules.NewId();
    public string ActorId { get; set; } = "";
    public int StartMs { get; set; }
    public int EndMs { get; set; } = 2500;
    public string Text { get; set; } = "Your line here.";
}
