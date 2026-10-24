param([ValidateSet('Reports','Hide','Show')][string]$Action='Reports',[string]$CutId,[string]$ServiceOrigin='https://muhammetozeski-stagefold.pages.dev')
$ErrorActionPreference='Stop'
# Owner-operated report review. Run only to inspect actual reports or make an explicit moderation decision.
# The local key is encrypted to the Windows user; it is never printed or sent in a URL.
$uri=[Uri]$ServiceOrigin
if($uri.Scheme -ne 'https' -or $uri.AbsolutePath -ne '/' -or $uri.UserInfo -or $uri.Query -or $uri.Fragment){throw 'Use the actual HTTPS service origin only.'}
$key=$env:STAGEFOLD_MODERATION_KEY
if(!$key){$file=Join-Path (Split-Path -Parent $PSScriptRoot) '.private/operator-key.dpapi';$key=[Text.Encoding]::UTF8.GetString([Security.Cryptography.ProtectedData]::Unprotect([IO.File]::ReadAllBytes($file),$null,[Security.Cryptography.DataProtectionScope]::CurrentUser))}
$headers=@{Authorization='Bearer '+$key;Origin=$uri.GetLeftPart([UriPartial]::Authority)}
if($Action -eq 'Reports'){Invoke-RestMethod -Uri ($ServiceOrigin.TrimEnd('/')+'/api/moderation') -Headers $headers | ConvertTo-Json -Depth 8}
else{if($CutId -notmatch '^[0-9a-f-]{36}$'){throw 'Supply the actual cut identifier.'};$result=Invoke-RestMethod -Method Post -Uri ($ServiceOrigin.TrimEnd('/')+'/api/moderation/cuts/'+$CutId) -Headers $headers -ContentType 'application/json' -Body (@{hidden=($Action -eq 'Hide');resolveReports=$true}|ConvertTo-Json);if(!$result.ok){throw 'The moderation action was not acknowledged'};Write-Output ('Moderation action acknowledged: '+$Action)}
$key=$null
