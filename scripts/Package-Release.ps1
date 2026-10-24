param([string]$Output)
$ErrorActionPreference='Stop'
$projectRoot=Split-Path -Parent $PSScriptRoot
if(!$Output){$Output=Join-Path $projectRoot 'publish/Release'}
$staging=Join-Path $Output ([Guid]::NewGuid().ToString('N'))
$films=Join-Path $staging 'StageFold-OriginalFilms'
$service=Join-Path $staging 'StageFold-Service'
New-Item -ItemType Directory -Path (Join-Path $films 'Scenes'),$service -Force | Out-Null
dotnet run --project (Join-Path $PSScriptRoot 'EditorialExporter/EditorialExporter.csproj') -c Release -- (Join-Path $films 'Scenes')
if($LASTEXITCODE){throw 'Original film document export failed'}
node (Join-Path $PSScriptRoot 'Create-Films.mjs') $films
if($LASTEXITCODE){throw 'Offline film generation failed'}
Copy-Item -LiteralPath (Join-Path $projectRoot 'LICENSE') -Destination $films
foreach($name in @('public','server','functions','schema')){Copy-Item -LiteralPath (Join-Path $projectRoot $name) -Destination $service -Recurse}
foreach($name in @('wrangler.toml','LICENSE')){Copy-Item -LiteralPath (Join-Path $projectRoot $name) -Destination $service}
Copy-Item -LiteralPath (Join-Path $projectRoot 'docs/Service-Contract.md') -Destination $service
@'
# StageFold deployment bundle

This is the compiled browser app and its Cloudflare Pages Functions service, not an offline replacement for accounts or D1. Public/index.html needs an HTTP host at its configured base URL. Source is https://github.com/muhammetozeski/StageFold.

For your own deployment: create a Pages project and D1 database in your account; change wrangler.toml database/project identifiers; apply schema/001-stagefold.sql to that new database; configure binding DB and private RATE_SALT/MODERATION_KEY; deploy the public directory with Pages Functions. No provider secret or customer data is included. Stripe remains disabled until its three merchant readiness values are deliberately configured.

The companion OriginalFilms archive is genuinely standalone: open its index.html or any film HTML without the service, an account or a desktop .NET runtime. JSON files can be opened in the live studio. Bundled examples are first-party editorial work, not user activity.
'@ | Set-Content -LiteralPath (Join-Path $service 'README-Deploy.md') -Encoding utf8
New-Item -ItemType Directory -Path $Output -Force | Out-Null
$filmsZip=Join-Path $Output 'StageFold-OriginalFilms-v1.0.0.zip'
$serviceZip=Join-Path $Output 'StageFold-Service-v1.0.0.zip'
Compress-Archive -LiteralPath $films -DestinationPath $filmsZip -Force
Compress-Archive -LiteralPath $service -DestinationPath $serviceZip -Force
Get-Item -LiteralPath $filmsZip,$serviceZip | Select-Object Name,Length
Get-FileHash -LiteralPath $filmsZip,$serviceZip -Algorithm SHA256 | Select-Object Path,Hash
