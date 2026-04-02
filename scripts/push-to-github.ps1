# Creates the GitHub repo and pushes main. Requires either:
#   1) Already ran: gh auth login -h github.com -p https -w
#   2) Or set GITHUB_TOKEN (classic PAT with repo scope) for this session:
#      $env:GITHUB_TOKEN = "ghp_xxxxxxxx"
#      .\scripts\push-to-github.ps1

$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

# Default Windows install; fixes "gh is not recognized" until the terminal is restarted
$ghInstall = Join-Path $env:ProgramFiles "GitHub CLI"
if (Test-Path (Join-Path $ghInstall "gh.exe")) {
    $env:Path = "$ghInstall;$env:Path"
}

Set-Location $PSScriptRoot\..

function Test-GhAuth {
    $null = & gh auth status 2>&1
    return $LASTEXITCODE -eq 0
}

if (-not (Test-GhAuth)) {
    if ($env:GITHUB_TOKEN) {
        $env:GITHUB_TOKEN | & gh auth login --with-token -h github.com
        if ($LASTEXITCODE -ne 0) { Write-Error "gh auth login --with-token failed"; exit 1 }
    }
    else {
        Write-Host @"
Not logged in to GitHub CLI.

Option A - browser (recommended):
  gh auth login -h github.com -p https -w

Option B - token (this PowerShell window only):
  `$env:GITHUB_TOKEN = "ghp_your_pat_here"
  .\scripts\push-to-github.ps1

Create a PAT: https://github.com/settings/tokens (scope: repo)
"@
        exit 1
    }
}

if (git remote get-url origin 2>$null) {
    Write-Host "Remote 'origin' already set. Pushing..."
    git push -u origin main
    exit $LASTEXITCODE
}

& gh repo create idea-product-builder --public --source=. --remote=origin --push
if ($LASTEXITCODE -ne 0) {
    Write-Host "If the name is taken, run: gh repo create YOUR-NAME --public --source=. --remote=origin --push"
    exit $LASTEXITCODE
}
Write-Host "Done."
& gh repo view --json url -q .url
