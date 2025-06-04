$workflowsDir = Join-Path $PSScriptRoot ".github\workflows"
$workflowFiles = Get-ChildItem -Path $workflowsDir -Filter "*.yml"

foreach ($file in $workflowFiles) {
    Write-Host "Processing $($file.Name)..."
    $content = Get-Content -Path $file.FullName -Raw
    
    # Remove the filepath comment line
    $newContent = $content -replace "// filepath: .*?\r?\n", ""
    
    # Write the updated content back to the file
    Set-Content -Path $file.FullName -Value $newContent -NoNewline
    
    Write-Host "Updated $($file.Name)"
}

Write-Host "All workflow files updated successfully."
