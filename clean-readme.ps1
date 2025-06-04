$filePath = "c:\Users\Pramod Tiwari\Downloads\Lazy-import\README.md"
$content = Get-Content -Path $filePath -Raw
$cleanedContent = $content -replace "<!-- filepath: c:\\Users\\Pramod Tiwari\\Downloads\\Lazy-import\\README.md -->[\r\n]", ""
Set-Content -Path $filePath -Value $cleanedContent
Write-Host "Cleaned filepath comments from README.md"
