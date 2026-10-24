using System.Net;
using System.Net.Http.Json;
using System.Reflection;
using StageFold.App.Pages;
using StageFold.App.Services;

var count=0;
void Check(bool value,string name){if(!value)throw new Exception(name);Console.WriteLine("PASS "+name);count++;}
const BindingFlags fields=BindingFlags.Instance|BindingFlags.NonPublic|BindingFlags.Public;
void Set(object target,string name,object? value){var property=target.GetType().GetProperty(name,fields);if(property is not null)property.SetValue(target,value);else target.GetType().GetField(name,fields)!.SetValue(target,value);}
object? Get(object target,string name)=>target.GetType().GetField(name,fields)!.GetValue(target);
async Task Scenario(string method,object reply,string field,object? expected)
{
    using var handler=new PausedHandler(reply);using var client=new HttpClient(handler){BaseAddress=new("https://stagefold.example/")};var api=new StageApi(client);var session=new AccountSession(api);session.Accept(new(){Id="account-a",Alias="Actual fixture"});var page=new Project();Set(page,"Api",api);Set(page,"Session",session);Set(page,"Id","project-a");Set(page,"ProjectData",new ProjectInfo{Id="project-a",Revision=1,Role="owner"});Set(page,"Reuse",true);Set(page,"Rights",true);Set(page,"DeleteText","DELETE SHARED PROJECT");
    var action=(Task)typeof(Project).GetMethod(method,fields)!.Invoke(page,null)!;await handler.Entered.Task;
    Set(page,"Id","project-b");var next=new ProjectInfo{Id="project-b",Revision=7,Role="owner"};Set(page,"ProjectData",next);Set(page,"LoadGeneration",2L);handler.Release.TrySetResult();await action;
    Check(Equals(Get(page,field),expected),method+" late result does not write old production state into new selection");
    Check(ReferenceEquals(Get(page,"ProjectData"),next),method+" late result preserves the newly selected production");
}
await Scenario("Invite",new{token="PRIVATE_INVITE_SENTINEL",expiresAt=12345},"InviteToken",null);
await Scenario("Publish",new{cut=new{id="old-cut"}},"PublishedId",null);
await Scenario("Delete",new{ok=true},"DeleteText","DELETE SHARED PROJECT");
Check(count==6,"all selected-context cases completed against actual compiled Razor component");
Console.WriteLine($"{count} UI consumer assertions passed");

sealed class PausedHandler(object reply):HttpMessageHandler
{
    public TaskCompletionSource Entered{get;}=new(TaskCreationOptions.RunContinuationsAsynchronously);
    public TaskCompletionSource Release{get;}=new(TaskCreationOptions.RunContinuationsAsynchronously);
    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request,CancellationToken cancellationToken){Entered.TrySetResult();await Release.Task.WaitAsync(cancellationToken);return new(HttpStatusCode.OK){Content=JsonContent.Create(reply)};}
}
