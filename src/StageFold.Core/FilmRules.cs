using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace StageFold.Core;

/// <summary>Canonical finite-film validation shared by the editor, imports and exports.</summary>
public static partial class FilmRules
{
    public const int MaxBytes = 98304;
    public static readonly string[] Looks = ["dot", "box", "kite", "reed", "cat", "orb"];
    public static readonly string[] Colors = ["orange", "blue", "pink", "green", "yellow", "white"];
    public static readonly string[] Stages = ["rooftop", "station", "cafe", "moon", "archive", "workshop", "garden", "harbor"];
    public static readonly string[] Poses = ["idle", "walk", "wave", "point", "think", "celebrate", "sit", "reach"];
    public static readonly string[] Moods = ["calm", "happy", "surprised", "sad", "determined"];
    public static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web) { WriteIndented = false, MaxDepth = 20, UnmappedMemberHandling = System.Text.Json.Serialization.JsonUnmappedMemberHandling.Disallow };

    /// <summary>Creates a portable identifier without relying on array position.</summary>
    public static string NewId() => Guid.NewGuid().ToString("N");

    /// <summary>Parses a bounded UTF-8 document and rejects unknown fields or invalid scene references.</summary>
    public static Film Parse(string json)
    {
        if (Encoding.UTF8.GetByteCount(json) > MaxBytes) throw new FormatException("Film JSON exceeds 96 KiB.");
        var film = JsonSerializer.Deserialize<Film>(json, Json) ?? throw new FormatException("A film object is required.");
        Validate(film);
        return film;
    }

    /// <summary>Serializes a validated film; no service credentials or private project fields exist in this type.</summary>
    public static string Serialize(Film film) { Validate(film); return JsonSerializer.Serialize(film, Json); }

    /// <summary>Produces an independent editable snapshot, preserving identifiers for comparisons.</summary>
    public static Film Clone(Film film) => Parse(Serialize(film));

    /// <summary>Returns total duration in milliseconds in shot order.</summary>
    public static int Duration(Film film) => film.Shots.Sum(x => x.DurationMs);

    /// <summary>Validates the complete finite scene graph and all local timing boundaries.</summary>
    public static void Validate(Film f)
    {
        if (f.FormatVersion != 1) Fail("Unsupported film format.");
        Text(f.Title, 1, 120, "Film title"); Text(f.Summary, 0, 600, "Summary");
        if (f.Cast is null || f.Cast.Count is < 1 or > 6) Fail("Use one to six cast members.");
        if (f.Shots is null || f.Shots.Count is < 1 or > 12) Fail("Use one to twelve shots.");
        Unique(f.Cast!.Select(x => x.Id), "Cast"); Unique(f.Shots!.Select(x => x.Id), "Shot");
        foreach (var c in f.Cast) { Text(c.Name, 1, 32, "Cast name"); Choice(c.Look, Looks, "Look"); Choice(c.Color, Colors, "Color"); }
        var cast = f.Cast.Select(x => x.Id).ToHashSet();
        foreach (var s in f.Shots)
        {
            Text(s.Label, 1, 80, "Shot label"); Choice(s.Stage, Stages, "Stage");
            if (s.DurationMs is < 3000 or > 15000) Fail("Each shot must last 3–15 seconds.");
            if (s.Performers is null || s.Performers.Count is < 1 or > 4) Fail("Each shot needs one to four performers.");
            if (s.Speech is null || s.Speech.Count > 8) Fail("A shot supports up to eight caption beats.");
            Unique(s.Performers!.Select(x => x.ActorId), "Performer"); Unique(s.Speech!.Select(x => x.Id), "Caption");
            foreach (var p in s.Performers)
            {
                if (!cast.Contains(p.ActorId)) Fail("A performer references missing cast.");
                Range(p.FromX, .06, .94, "Start X"); Range(p.ToX, .06, .94, "End X");
                Range(p.FromY, .45, .92, "Start Y"); Range(p.ToY, .45, .92, "End Y"); Range(p.Scale, .6, 1.5, "Scale");
                Choice(p.Pose, Poses, "Gesture"); Choice(p.Mood, Moods, "Expression");
            }
            var present = s.Performers.Select(x => x.ActorId).ToHashSet();
            foreach (var line in s.Speech)
            {
                Text(line.Text, 1, 180, "Caption");
                if (!present.Contains(line.ActorId)) Fail("A caption actor must be in its shot.");
                if (line.StartMs < 0 || line.EndMs > s.DurationMs || line.EndMs - line.StartMs < 700) Fail("Caption beats need at least 0.7 seconds inside their shot.");
            }
            foreach (var group in s.Speech.GroupBy(x => x.ActorId))
            {
                var lines = group.OrderBy(x => x.StartMs).ToArray();
                for (var i = 1; i < lines.Length; i++) if (lines[i].StartMs < lines[i - 1].EndMs) Fail("The same performer cannot speak two captions at once.");
            }
        }
        if (Duration(f) > 90000) Fail("A film can last at most 90 seconds.");
        if (Encoding.UTF8.GetByteCount(JsonSerializer.Serialize(f, Json)) > MaxBytes) Fail("Film JSON exceeds 96 KiB.");
    }

    /// <summary>Describes real content changes between two film snapshots, excluding identifiers.</summary>
    public static string[] Compare(Film before, Film after)
    {
        List<string> changes = [];
        if (before.Title != after.Title) changes.Add("Title changed");
        if (before.Summary != after.Summary) changes.Add("Synopsis changed");
        if (JsonSerializer.Serialize(before.Cast, Json) != JsonSerializer.Serialize(after.Cast, Json)) changes.Add("Cast changed");
        var old = before.Shots.ToDictionary(x => x.Id);
        foreach (var s in after.Shots)
            changes.Add(!old.TryGetValue(s.Id, out var b) ? $"Added shot: {s.Label}" : JsonSerializer.Serialize(b, Json) != JsonSerializer.Serialize(s, Json) ? $"Changed shot: {s.Label}" : "");
        foreach (var s in before.Shots.Where(x => after.Shots.All(n => n.Id != x.Id))) changes.Add($"Removed shot: {s.Label}");
        if (!before.Shots.Select(x => x.Id).SequenceEqual(after.Shots.Select(x => x.Id)) && before.Shots.Count == after.Shots.Count) changes.Add("Shot order changed");
        return changes.Where(x => x.Length > 0).ToArray();
    }

    static void Unique(IEnumerable<string> ids, string label) { var a = ids.ToArray(); if (a.Any(x => x is null || !Identifier().IsMatch(x)) || a.Distinct().Count() != a.Length) Fail($"{label} identifiers must be unique letters, numbers, underscores or dashes."); }
    static void Text(string? value, int min, int max, string name) { if (value is null || value.Trim().Length < min || value.Length > max || value.Any(c => char.IsControl(c) && c is not '\n' and not '\t')) Fail($"{name} must contain {min}–{max} characters."); }
    static void Choice(string value, string[] choices, string name) { if (!choices.Contains(value)) Fail($"Unknown {name.ToLowerInvariant()}."); }
    static void Range(double x, double min, double max, string name) { if (!double.IsFinite(x) || x < min || x > max) Fail($"{name} is outside its stage boundary."); }
    [System.Diagnostics.CodeAnalysis.DoesNotReturn] static void Fail(string text) => throw new FormatException(text);
    [GeneratedRegex("^[A-Za-z0-9_-]{1,64}$", RegexOptions.CultureInvariant)] private static partial Regex Identifier();
}
