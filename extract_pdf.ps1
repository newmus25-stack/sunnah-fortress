# Extract text from PDF
$pdfPath = Get-ChildItem -Path "c:\antigravivty\*.pdf" | Select-Object -First 1
$outputPath = "c:\antigravivty\pdf_content.txt"

Write-Host ("Reading PDF file: " + $pdfPath.FullName)
$bytes = [System.IO.File]::ReadAllBytes($pdfPath.FullName)
$content = [System.Text.Encoding]::GetEncoding(28591).GetString($bytes)

# Extract text between BT/ET markers
$streams = [regex]::Matches($content, 'BT\s*(.*?)\s*ET', [System.Text.RegularExpressions.RegexOptions]::Singleline)
$textParts = @()
foreach ($stream in $streams) {
    $text = $stream.Groups[1].Value
    $tjMatches = [regex]::Matches($text, '\((.*?)\)\s*Tj', [System.Text.RegularExpressions.RegexOptions]::Singleline)
    foreach ($tj in $tjMatches) {
        $textParts += $tj.Groups[1].Value
    }
}

$result = $textParts -join "`n"
$result | Out-File $outputPath -Encoding UTF8
Write-Host ("Extracted " + $textParts.Count + " text segments")
Write-Host ("File size: " + (Get-Item $outputPath).Length + " bytes")
if ($result.Length -gt 0) {
    $preview = $result.Substring(0, [Math]::Min(500, $result.Length))
    Write-Host "Preview:"
    Write-Host $preview
} else {
    Write-Host "No text found with Tj operator. Trying TJ operator..."
    # Try TJ operator (array-based text)
    $textParts2 = @()
    foreach ($stream in $streams) {
        $text = $stream.Groups[1].Value
        $tjMatches = [regex]::Matches($text, '\[(.*?)\]\s*TJ', [System.Text.RegularExpressions.RegexOptions]::Singleline)
        foreach ($tj in $tjMatches) {
            $inner = $tj.Groups[1].Value
            $subMatches = [regex]::Matches($inner, '\((.*?)\)')
            foreach ($sub in $subMatches) {
                $textParts2 += $sub.Groups[1].Value
            }
        }
    }
    $result2 = $textParts2 -join ""
    $result2 | Out-File $outputPath -Encoding UTF8
    Write-Host ("Extracted " + $textParts2.Count + " text segments with TJ")
    if ($result2.Length -gt 0) {
        $preview2 = $result2.Substring(0, [Math]::Min(500, $result2.Length))
        Write-Host "Preview:"
        Write-Host $preview2
    }
}
