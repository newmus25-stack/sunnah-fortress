import zipfile
import xml.etree.ElementTree as ET
import sys
import io

def extract_text_from_docx(docx_path):
    try:
        with zipfile.ZipFile(docx_path) as docx:
            xml_content = docx.read('word/document.xml')
            tree = ET.XML(xml_content)
            
            WORD_NAMESPACE = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
            PARA = WORD_NAMESPACE + 'p'
            TEXT = WORD_NAMESPACE + 't'
            
            texts = []
            for paragraph in tree.iter(PARA):
                para_text = ''.join(node.text for node in paragraph.iter(TEXT) if node.text)
                if para_text:
                    texts.append(para_text)
            
            return '\n'.join(texts)
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    # Ensure stdout uses utf-8
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    if len(sys.argv) > 1:
        text = extract_text_from_docx(sys.argv[1])
        print(text)
