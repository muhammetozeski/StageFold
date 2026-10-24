param([string]$Output, [string]$BasePath='/', [string]$Destination, [switch]$NoRestore)
$ErrorActionPreference='Stop'
$projectRoot=Split-Path -Parent $PSScriptRoot
if(!$Output){$Output=Join-Path $projectRoot 'publish/App'}
if (!$BasePath.StartsWith('/') -or !$BasePath.EndsWith('/') -or $BasePath.Contains('//') -or $BasePath.Split('/').Where({ $_ -and ($_.ToCharArray().Where({ ![char]::IsAsciiLetterOrDigit($_) -and $_ -ne '-' -and $_ -ne '_' }).Count -gt 0) }).Count -gt 0) { throw 'BasePath must be / or an absolute slash-terminated application path.' }
if ($BasePath -ne '/' -and !$Destination) { throw 'A mounted build requires an explicit Destination; the standalone public directory is preserved.' }
$arguments=@('publish',(Join-Path $projectRoot 'src/StageFold.App/StageFold.App.csproj'),'-c','Release','-o',$Output,'--nologo','--ignore-failed-sources')
if($NoRestore){$arguments+='--no-restore'}
dotnet @arguments
if($LASTEXITCODE){throw 'Blazor publication failed'}
$web=Join-Path $Output 'wwwroot'
$siteRoot=if($Destination){[IO.Path]::GetFullPath($Destination)}else{Join-Path $projectRoot 'public'}
New-Item -ItemType Directory -Path $siteRoot -Force | Out-Null
Copy-Item -Path (Join-Path $web '*') -Destination $siteRoot -Recurse -Force
$entry=Join-Path $siteRoot 'index.html'
[IO.File]::WriteAllText($entry,[IO.File]::ReadAllText($entry).Replace('<base href="/">','<base href="'+$BasePath+'">'))
$redirects=@()
if($BasePath -ne '/'){$redirects+=$BasePath.TrimEnd('/')+' '+$BasePath+' 301'}
foreach($route in @('studio','account','projects','project/:id','cuts','cut/:id','membership','privacy','guide')){$redirects+=$BasePath+$route+' '+$BasePath+'index.html 200'}
[IO.File]::WriteAllLines((Join-Path $siteRoot '_redirects'),$redirects)
$scopedHeaders=foreach($line in (Get-Content -LiteralPath (Join-Path $projectRoot 'public/_headers'))){if($line.StartsWith('/')){$BasePath+$line.TrimStart('/')}else{$line}}
[IO.File]::WriteAllLines((Join-Path $siteRoot '_headers'),$scopedHeaders)
$commit=git -C $projectRoot rev-parse HEAD
@{product='StageFold';sourceCommit=$commit;basePath=$BasePath;builtAtUtc=[DateTimeOffset]::UtcNow.ToString('O');appearance=@{theme='data-sf-theme';style='data-sf-appearance=style';script='data-sf-appearance=script'}} | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $siteRoot 'build-info.json') -Encoding utf8
Write-Output "StageFold published for $BasePath into $siteRoot."
