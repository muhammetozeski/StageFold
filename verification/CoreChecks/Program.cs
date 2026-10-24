using System.Text.Json;
using StageFold.Core;

var count=0;
void Check(bool condition,string name){if(!condition)throw new Exception(name);count++;Console.WriteLine($"PASS {name}");}
void Reject(Action action,string name){try{action();}catch(Exception e) when(e is FormatException or JsonException){Check(true,name);return;}throw new Exception($"Accepted invalid input: {name}");}
var all=Starters.All();Check(all.Length==12,"twelve complete original first-party films");
foreach(var f in all){var json=FilmRules.Serialize(f);var restored=FilmRules.Parse(json);Check(FilmRules.Compare(f,restored).Length==0&&FilmRules.Duration(restored)==28000,$"canonical round-trip: {f.Title}");}
var film=FilmRules.Clone(all[0]);
var good=FilmRules.Serialize(film);
Reject(()=>FilmRules.Parse(good.Replace("\"formatVersion\": 1","\"formatVersion\": 1,\"privateCredential\":\"no\"")),"unknown fields rejected");
film.Shots[0].Performers[0].ToX=double.NaN;Reject(()=>FilmRules.Validate(film),"nonfinite actor movement rejected");
film=FilmRules.Parse(good);film.Shots[0].Performers[0].ActorId="missing";Reject(()=>FilmRules.Validate(film),"dangling actor rejected");
film=FilmRules.Parse(good);film.Shots[0].Speech[0].EndMs=9000;Reject(()=>FilmRules.Validate(film),"caption cannot escape shot duration");
film=FilmRules.Parse(good);film.Shots[0].Speech[1].ActorId="a";film.Shots[0].Speech[1].StartMs=1000;Reject(()=>FilmRules.Validate(film),"overlapping caption from same actor rejected");
film=FilmRules.Parse(good);film.Shots[0].Stage="https://example.org";Reject(()=>FilmRules.Validate(film),"external stage URL rejected");
film=FilmRules.Parse(good);film.Shots[0].Speech[0].Text="</script><img src=x onerror=alert(1)>";Check(FilmRules.Parse(FilmRules.Serialize(film)).Shots[0].Speech[0].Text==film.Shots[0].Speech[0].Text,"untrusted captions remain plain text data");
film=FilmRules.Parse(good);film.Shots[0].Performers[0].ToX=.9;Check(FilmRules.Compare(all[0],film).Contains("Changed shot: A button above the clouds"),"movement change appears in real shot comparison");
film=FilmRules.Parse(good);film.Shots.Reverse();Check(FilmRules.Compare(all[0],film).Contains("Shot order changed"),"reordered shots identified");
film=FilmRules.Parse(good);film.Cast[0].Id=film.Cast[1].Id;Reject(()=>FilmRules.Validate(film),"duplicate cast identifier rejected");
Console.WriteLine($"{count} core assertions passed");
if(args.Length==1){Directory.CreateDirectory(args[0]);File.WriteAllText(Path.Combine(args[0],"starter.json"),good);}
