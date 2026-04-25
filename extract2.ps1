$docxFile = Get-ChildItem -Path "c:\antigravivty\*.docx" | Select-Object -First 1
Copy-Item -Path $docxFile.FullName -Destination "c:\antigravivty\temp.zip" -Force
Expand-Archive -Path "c:\antigravivty\temp.zip" -DestinationPath "c:\antigravivty\temp_docx" -Force
$xml = Get-Content -Path "c:\antigravivty\temp_docx\word\document.xml" -Raw
$text = $xml -replace '<w:p\b[^>]*>', "`r`n" -replace '<[^>]+>', ''
$text | Out-File "c:\antigravivty\content.txt" -Encoding UTF8
Remove-Item "c:\antigravivty\temp.zip" -Force
Remove-Item "c:\antigravivty\temp_docx" -Recurse -Force
