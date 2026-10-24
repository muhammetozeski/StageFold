using StageFold.Core;

if(args.Length!=1)throw new ArgumentException("Provide the release scene directory.");
Directory.CreateDirectory(args[0]);
var starters=Starters.All();
for(var i=0;i<starters.Length;i++)File.WriteAllText(Path.Combine(args[0],$"{i+1:00}.film.json"),FilmRules.Serialize(starters[i]));
Console.WriteLine($"Exported {starters.Length} original validated film documents.");
