namespace StageFold.Core;

/// <summary>Original first-party short films, explicitly labelled as editorial work rather than community activity.</summary>
public static class Starters
{
    /// <summary>Returns independent editable examples with complete motion, dialogue and endings.</summary>
    public static Film[] All() => [
        Make("The Last Elevator", "rooftop", "Moss", "box", "orange", "Pip", "dot", "blue", [
            ("A button above the clouds", "The lift stopped at floor infinity.", "Then we should take the stairs.", "point", "think"),
            ("One careful step", "I brought one stair.", "That is an unusually confident plan.", "reach", "surprised"),
            ("A better destination", "What if the roof is where we wanted to go?", "I did pack a sunset.", "think", "wave"),
            ("No further floors", "Next stop: right here.", "Best floor in the building.", "celebrate", "celebrate")]),
        Make("Coffee on the Moon", "moon", "Nori", "cat", "pink", "Bolt", "box", "yellow", [
            ("The first customer", "One coffee. No floating, please.", "Our gravity warranty expired Tuesday.", "wave", "point"),
            ("A cup with ambition", "The cup is heading for orbit.", "It always wanted a bigger career.", "reach", "surprised"),
            ("A practical orbit", "Could we drink it through a very long straw?", "Finally, a useful space program.", "think", "happy"),
            ("Small launch, large tip", "Your table is now a satellite.", "Put the bill in my orbit.", "celebrate", "wave")]),
        Make("The Quiet Repair", "workshop", "Reed", "reed", "green", "Ada", "kite", "orange", [
            ("A mysterious machine", "It makes a noise only when nobody listens.", "That is a very private machine.", "think", "point"),
            ("The wrong tool", "I tried a louder wrench.", "Perhaps it needs a quieter friend.", "reach", "wave"),
            ("A minute together", "We could sit here without fixing anything.", "A bold technical proposal.", "sit", "sit"),
            ("The machine rests", "I think it is working now.", "So are we.", "wave", "happy")]),
        Make("Lost and Found Tomorrow", "station", "Lux", "orb", "yellow", "Dot", "dot", "white", [
            ("Platform for later", "Has tomorrow's train already arrived?", "Only its lost luggage.", "point", "think"),
            ("A familiar suitcase", "This bag has my name and next year's dust.", "Please describe one future sock.", "reach", "point"),
            ("The receipt", "It says I forgot to enjoy today.", "We get that one quite often.", "surprised", "wave"),
            ("Taking the slow train", "I will wait on this bench, then.", "Excellent. Today stops here.", "sit", "sit")]),
        Make("The Library of Almost", "archive", "Page", "kite", "blue", "Ink", "cat", "orange", [
            ("An unfinished shelf", "Every book here ends one word early.", "That must be very.", "point", "surprised"),
            ("A tempting correction", "I could finish them all by sunset.", "Then where would the readers put themselves?", "reach", "think"),
            ("Room in a sentence", "You mean the gap is an invitation?", "Some endings are doors.", "think", "wave"),
            ("Checking one out", "I will borrow a beginning.", "Bring it back different.", "wave", "celebrate")]),
        Make("A Garden for Rain", "garden", "Sprig", "reed", "green", "Cloud", "orb", "white", [
            ("Watering the weather", "Why are you watering an empty chair?", "The rain looked tired.", "point", "reach"),
            ("A visitor hesitates", "What does rain do on a day off?", "It listens to people cancel picnics.", "think", "sad"),
            ("An indoor picnic", "We could invite it instead.", "I have waterproof sandwiches.", "wave", "celebrate"),
            ("A different forecast", "Chance of company: certain.", "A very good forecast.", "celebrate", "happy")]),
        Make("The Lighthouse Postcard", "harbor", "Beam", "box", "yellow", "Tide", "dot", "blue", [
            ("A message from shore", "The lighthouse sent me a postcard.", "It lives twelve steps away.", "wave", "point"),
            ("A distant feeling", "It says: wish you were here.", "Perhaps here is a feeling.", "think", "wave"),
            ("A small expedition", "Shall we travel twelve steps?", "I will pack for thirteen.", "walk", "walk"),
            ("Arrival", "The view is exactly the same.", "The company improved.", "celebrate", "happy")]),
        Make("One Table, Two Maps", "cafe", "North", "kite", "pink", "West", "box", "green", [
            ("A disagreement", "My map says this is the sea.", "Mine says it is lunch.", "point", "point"),
            ("The evidence arrives", "There is soup in front of us.", "A small sea with a spoon.", "reach", "think"),
            ("Changing scale", "Maybe both maps are right.", "Then we should name the crouton islands.", "wave", "celebrate"),
            ("A shared expedition", "I claim the island of Second Helpings.", "A peaceful discovery.", "celebrate", "wave")]),
        Make("The Spare Applause", "rooftop", "Clap", "dot", "orange", "Echo", "orb", "pink", [
            ("After the concert", "I saved a little applause for later.", "What does applause eat?", "wave", "think"),
            ("A quiet achievement", "Someone carried a heavy day upstairs.", "That sounds like a performance.", "point", "reach"),
            ("A small audience", "Should we clap very loudly?", "Only as loudly as they need.", "think", "wave"),
            ("Enough", "There. That was the right amount.", "Keep a little for yourself.", "celebrate", "happy")]),
        Make("A Clock Takes a Walk", "station", "Tick", "box", "blue", "Tock", "cat", "yellow", [
            ("An absent minute", "The station clock has gone for a walk.", "I hope it remembers the time.", "point", "think"),
            ("Following its footsteps", "It left sixty tiny footprints.", "A very punctual escape.", "walk", "walk"),
            ("A better schedule", "It says it has never seen the afternoon.", "Always looking at its own face.", "surprised", "wave"),
            ("Back at the platform", "The clock came back three smiles late.", "We can adjust the timetable.", "celebrate", "happy")]),
        Make("Borrowing a Shadow", "garden", "Fern", "reed", "orange", "Kite", "kite", "white", [
            ("Too much sun", "May I borrow your shadow?", "Only if you promise to return the shape.", "reach", "point"),
            ("A surprising fit", "It makes me look very brave.", "Shadows believe in their owners.", "celebrate", "wave"),
            ("Return time", "I think I can make my own now.", "Then keep the brave part.", "think", "happy"),
            ("A longer afternoon", "Your shadow is a little taller.", "It learned something too.", "wave", "celebrate")]),
        Make("The Last Missing Screw", "workshop", "Hex", "box", "green", "Nova", "orb", "orange", [
            ("Nearly complete", "One screw is missing from my invention.", "What does the invention do?", "reach", "think"),
            ("A specific purpose", "It finds the last missing screw.", "A beautifully circular problem.", "point", "surprised"),
            ("A different tool", "Could you hold this corner?", "I have been waiting for a useful job.", "reach", "reach"),
            ("A working prototype", "It works when we build it together.", "Then do not replace that part.", "celebrate", "wave")])
    ];

    static Film Make(string title, string stage, string a, string lookA, string colorA, string b, string lookB, string colorB,
        (string label, string lineA, string lineB, string poseA, string poseB)[] beats)
    {
        Film f = new() { Title = title, Summary = "Original StageFold starter. A complete short scene to direct, rewrite or remix.", Cast = [new() { Id = "a", Name = a, Look = lookA, Color = colorA }, new() { Id = "b", Name = b, Look = lookB, Color = colorB }] };
        for (var i = 0; i < beats.Length; i++)
        {
            var x = beats[i];
            // Motion continues across cuts rather than resetting performers to a panel layout.
            var leftStart = i == 0 ? .12 : .3 + (i - 1) * .015; var rightStart = i == 0 ? .88 : .7 - (i - 1) * .015;
            f.Shots.Add(new() { Id = $"shot{i + 1}", Label = x.label, Stage = stage, DurationMs = 7000,
                Performers = [new() { ActorId = "a", FromX = leftStart, ToX = .3 + i * .015, FromY = .82, ToY = .82, Pose = FilmRules.Poses.Contains(x.poseA) ? x.poseA : "wave", Mood = "happy" },
                              new() { ActorId = "b", FromX = rightStart, ToX = .7 - i * .015, FromY = .82, ToY = .82, Pose = FilmRules.Poses.Contains(x.poseB) ? x.poseB : "idle", Mood = FilmRules.Moods.Contains(x.poseB) ? x.poseB : "calm", Flip = true }],
                Speech = [new() { Id = $"line{i}a", ActorId = "a", StartMs = 350, EndMs = 3300, Text = x.lineA }, new() { Id = $"line{i}b", ActorId = "b", StartMs = 3550, EndMs = 6800, Text = x.lineB }] });
        }
        FilmRules.Validate(f); return f;
    }
}
