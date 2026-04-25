$docxPath = "c:\antigravivty\الثلاثينية في كشف شبهات المشككين في السنة النبوية.docx"
$zipPath = "c:\antigravivty\temp.zip"
$extractPath = "c:\antigravivty\temp_docx"

Copy-Item -Path $docxPath -Destination $zipPath -Force
Expand-Archive -Path $zipPath -DestinationPath $extractPath -Force

$xmlPath = "$extractPath\word\document.xml"
$xml = Get-Content -Path $xmlPath -Raw -Encoding UTF8

# Replace paragraph tags with newlines to keep some structure, then strip all XML tags
$text = $xml -replace '<w:p\b[^>]*>', "`r`n" -replace '<[^>]+>', ''

# output
$text | Out-File "c:\antigravivty\content.txt" -Encoding UTF8

Remove-Item $zipPath -Force
Remove-Item $extractPath -Recurse -Force
