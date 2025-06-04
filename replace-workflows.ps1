$workflowsDir = Join-Path $PSScriptRoot ".github\workflows"

# Replace each workflow file with the clean version
Move-Item -Path "$workflowsDir\release.yml.new" -Destination "$workflowsDir\release.yml" -Force
Write-Host "Replaced release.yml"

Move-Item -Path "$workflowsDir\ci.yml.new" -Destination "$workflowsDir\ci.yml" -Force
Write-Host "Replaced ci.yml"

# Create docs.yml.new and publish.yml.new if needed
if (-not (Test-Path "$workflowsDir\docs.yml.new")) {
    # Read the content of docs.yml
    $docsContent = Get-Content -Path "$workflowsDir\docs.yml" -Raw
    
    # Remove filepath comment
    $docsContent = $docsContent -replace "// filepath: .*?\r?\n", ""
    
    # Create the new file
    Set-Content -Path "$workflowsDir\docs.yml.new" -Value $docsContent
    Write-Host "Created docs.yml.new"
}
Move-Item -Path "$workflowsDir\docs.yml.new" -Destination "$workflowsDir\docs.yml" -Force
Write-Host "Replaced docs.yml"

if (-not (Test-Path "$workflowsDir\publish.yml.new")) {
    # Read the content of publish.yml
    $publishContent = Get-Content -Path "$workflowsDir\publish.yml" -Raw
    
    # Remove filepath comment
    $publishContent = $publishContent -replace "// filepath: .*?\r?\n", ""
    
    # Create the new file
    Set-Content -Path "$workflowsDir\publish.yml.new" -Value $publishContent
    Write-Host "Created publish.yml.new"
}
Move-Item -Path "$workflowsDir\publish.yml.new" -Destination "$workflowsDir\publish.yml" -Force
Write-Host "Replaced publish.yml"

Write-Host "All workflow files replaced with clean versions."
