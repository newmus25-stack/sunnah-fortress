import sys
import subprocess
import json

def install(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

try:
    import PyPDF2
except ImportError:
    print("Installing PyPDF2...")
    install("PyPDF2")
    import PyPDF2

def extract_pdf_to_js(pdf_path, output_js_path):
    print(f"Extracting text from {pdf_path}...")
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            full_text = []
            for i, page in enumerate(reader.pages):
                text = page.extract_text()
                if text:
                    full_text.append(text)
            
            raw_text = "\n".join(full_text)
            
            # Very basic parsing, trying to split by some logic, 
            # but since PDF extraction is messy, we'll just put it all in one chunk for now 
            # and let the user see it.
            
            book_data = [
                {
                    "id": 1,
                    "title": "النص الكامل المستخرج من الـ PDF",
                    "content": raw_text[:5000] + "\n\n... (تم اقتطاع النص للاختبار)" # limiting to 5000 chars for safety in JS
                }
            ]
            
            js_content = "const bookData = " + json.dumps(book_data, ensure_ascii=False, indent=2) + ";"
            
            with open(output_js_path, 'w', encoding='utf-8') as js_file:
                js_file.write(js_content)
                
            print(f"Extraction complete! Saved to {output_js_path}")
            
    except Exception as e:
        print(f"Error during extraction: {e}")

if __name__ == "__main__":
    pdf_file = r"c:\antigravivty\العيوب المنهجية لشاخت.pdf"
    output_file = r"c:\antigravivty\book-viewer\data.js"
    extract_pdf_to_js(pdf_file, output_file)
