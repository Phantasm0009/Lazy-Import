$workflowsDir = Join-Path $PSScriptRoot ".github\workflows"
$bundlerDir = Join-Path $PSScriptRoot "src\bundler"

# Check workflow files
$workflowFiles = @("release.yml", "ci.yml", "docs.yml", "publish.yml")

foreach ($file in $workflowFiles) {
    $filePath = Join-Path $workflowsDir $file
    $content = Get-Content -Path $filePath -Raw
    
    if ($content.Contains("filepath:")) {
        Write-Host "❌ $file still contains filepath comment"
    } else {
        Write-Host "✅ $file is clean"
    }
    
    # Check file size
    $fileInfo = Get-Item $filePath
    if ($fileInfo.Length -eq 0) {
        Write-Host "❌ $file is empty!"
    } else {
        Write-Host "   File size: $($fileInfo.Length) bytes"
    }
}

# Check rollup.ts
$rollupPath = Join-Path $bundlerDir "rollup.ts"
$rollupContent = Get-Content -Path $rollupPath -Raw

if ($rollupContent.Contains("filepath:")) {
    Write-Host "❌ rollup.ts still contains filepath comment"
} else {
    Write-Host "✅ rollup.ts is clean"
}

# Check if the fix-workflow scripts should be removed
Write-Host "`nAfter verification, you can delete these scripts:"
Write-Host "- fix-workflows.ps1"
Write-Host "- replace-workflows.ps1"
Write-Host "- verify-fixes.ps1"
