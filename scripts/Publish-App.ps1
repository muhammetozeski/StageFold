param([string]$Output)
$ErrorActionPreference='Stop'
$projectRoot=Split-Path -Parent $PSScriptRoot
if(!$Output){$Output=Join-Path $projectRoot 'publish/App'}
dotnet publish (Join-Path $projectRoot 'src/StageFold.App/StageFold.App.csproj') -c Release -o $Output --nologo --ignore-failed-sources
if($LASTEXITCODE){throw 'Blazor publication failed'}
$web=Join-Path $Output 'wwwroot'
$destination=Join-Path $projectRoot 'public'
Copy-Item -Path (Join-Path $web '*') -Destination $destination -Recurse -Force
$commit=git -C $projectRoot rev-parse HEAD
@{product='StageFold';sourceCommit=$commit;builtAtUtc=[DateTimeOffset]::UtcNow.ToString('O');appearance=@{theme='data-sf-theme';style='data-sf-appearance=style';script='data-sf-appearance=script'}} | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $destination 'build-info.json') -Encoding utf8
Write-Output 'StageFold published to the public deployment directory.'
