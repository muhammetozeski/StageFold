using System.Net.Http.Json;
using System.Text.Json;

namespace StageFold.App.Services;

/// <summary>Same-origin typed service transport; errors retain status without logging film bodies or secrets.</summary>
public sealed class StageApi(HttpClient http)
{
    const bool IsLogEnabled=true;
    public Task<T> Get<T>(string path)=>Send<T>(new(HttpMethod.Get,"api/"+path));
    public Task<T> Post<T>(string path,object body)=>Send<T>(new(HttpMethod.Post,"api/"+path){Content=JsonContent.Create(body,options:StageFold.Core.FilmRules.Json)});
    async Task<T> Send<T>(HttpRequestMessage request)
    {
        using(request){using var response=await http.SendAsync(request);if(IsLogEnabled)Console.WriteLine($"StageFold API {request.Method}; status={(int)response.StatusCode}; body and credentials omitted");
            if(!response.IsSuccessStatusCode){var error=await response.Content.ReadFromJsonAsync<ApiError>();var message=error?.Code switch{"billing_configuration"=>"Subscriptions are unavailable.","billing_provider"=>"The payment service did not respond. Check your subscription before trying again.","service_failure"=>"The action could not finish. Check the saved film, then try again.",_=>error?.Error??"The action could not finish. Try again."};throw new StageApiException((int)response.StatusCode,message,error?.Code??"service_error");}
            return await response.Content.ReadFromJsonAsync<T>(StageFold.Core.FilmRules.Json)??throw new FormatException("The service returned an empty result.");}
    }
    sealed class ApiError {public string Error{get;set;}="";public string Code{get;set;}="";}
}
/// <summary>A real service refusal presented at a complete user-action boundary.</summary>
public sealed class StageApiException(int status,string message,string code):Exception(message){public int Status{get;}=status;public string Code{get;}=code;}

/// <summary>Account state with generation protection against a stale startup read replacing a fresh login.</summary>
public sealed class AccountSession(StageApi api)
{
    public AccountInfo? Current{get;private set;}
    public long Generation{get;private set;}
    public bool Loaded{get;private set;}
    public event Action? Changed;
    public async Task Load(){if(Loaded)return;var generation=Generation;var response=await api.Get<AccountReply>("account");if(generation!=Generation)return;Current=response.Account;Loaded=true;Changed?.Invoke();}
    public void Accept(AccountInfo? account){Generation++;Current=account;Loaded=true;Changed?.Invoke();}
}
