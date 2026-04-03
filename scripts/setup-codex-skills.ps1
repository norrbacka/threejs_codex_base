$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$agentsDir = Join-Path $repoRoot ".agents"
$skillsDir = Join-Path $agentsDir "skills"
$localSkillsTarget = Join-Path $repoRoot ".codex\\skills"
$superpowersTarget = Join-Path $repoRoot ".codex\\superpowers\\skills"
$localSkillsLink = Join-Path $skillsDir "local-skills"
$superpowersLink = Join-Path $skillsDir "superpowers"

New-Item -ItemType Directory -Force -Path $skillsDir | Out-Null

foreach ($link in @($localSkillsLink, $superpowersLink)) {
    if (Test-Path $link) {
        Remove-Item -LiteralPath $link -Recurse -Force
    }
}

cmd /c mklink /J "$localSkillsLink" "$localSkillsTarget" | Out-Null
cmd /c mklink /J "$superpowersLink" "$superpowersTarget" | Out-Null

Write-Host "Created Codex skill junctions:"
Write-Host "  $localSkillsLink -> $localSkillsTarget"
Write-Host "  $superpowersLink -> $superpowersTarget"
Write-Host ""
Write-Host "Restart Codex to pick up the local skills."
