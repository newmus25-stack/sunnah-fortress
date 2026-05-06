import os
import re

# 1. Read files
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()
with open('styles.css', 'r', encoding='utf-8') as f:
    css = f.read()
with open('app.js', 'r', encoding='utf-8') as f:
    js = f.read()
with open('istishraq.html', 'r', encoding='utf-8') as f:
    istishraq = f.read()

# 2. Extract istishraq content
# Get the CSS inside <style>
ist_css_match = re.search(r'<style>(.*?)</style>', istishraq, re.DOTALL)
if ist_css_match:
    ist_css = ist_css_match.group(1)
    # Clean up ist_css (rename conflicting classes)
    ist_css = ist_css.replace('.container', '.ist-container') 
    ist_css = ist_css.replace('body {', 'body_ist {')
    ist_css = ist_css.replace('.book-card', '.ist-book-card')
    ist_css = ist_css.replace('h1 {', '.ist-h1 {')
    ist_css = ist_css.replace('h2 {', '.ist-h2 {')
else:
    ist_css = ""

# Get the HTML inside <div class="container">
ist_html_match = re.search(r'<div class="container">(.*?)<script>', istishraq, re.DOTALL)
if ist_html_match:
    ist_html = ist_html_match.group(1)
    ist_html = ist_html.rsplit('</div>', 1)[0]
    # Fix classes in ist_html
    ist_html = ist_html.replace('class="book-card"', 'class="ist-book-card"')
    ist_html = ist_html.replace('<h1>', '<h1 class="ist-h1">').replace('<h2>', '<h2 class="ist-h2">')
else:
    ist_html = ""

# Get the JS
ist_js_match = re.search(r'<script>(.*?)</script>', istishraq, re.DOTALL)
ist_js = ist_js_match.group(1) if ist_js_match else ""

# 3. Modify index.html
axes_match = re.search(r'(<!-- Axes Section -->.*?</div>\s*)(<!-- Latest Doubts Section -->)', html, re.DOTALL)
axes_html = axes_match.group(1) if axes_match else ""

doubts_match = re.search(r'(<!-- Latest Doubts Section -->.*?</div>\s*)(<!-- Full Library Section -->)', html, re.DOTALL)
doubts_html = doubts_match.group(1) if doubts_match else ""

if axes_html and doubts_html:
    # Remove them from main-col
    html = html.replace(axes_html, '')
    html = html.replace(doubts_html, '')

    # Create the new axes page
    new_page = f'''
    <!-- Axes Page (Hidden) -->
    <div id="axes-page" style="display: none;">
        <div class="back-btn" onclick="showPage('home')" style="margin: 20px;">
            <i class="fas fa-arrow-right"></i> العودة للرئيسية
        </div>
        <div class="container" style="padding-bottom: 60px;">
            {axes_html}
            {doubts_html}
            
            <div id="istishraq-content" style="margin-top: 60px; padding-top: 40px; border-top: 2px solid var(--border);">
                {ist_html}
            </div>
        </div>
    </div>
'''
    # Insert new page after concepts page
    html = html.replace('<!-- End Concepts Page -->', '<!-- End Concepts Page -->\n' + new_page)

# Update nav links
old_nav = '''                <li><a href="#axes">محاور الشبهات</a></li>
                <li><a href="#doubts">أبرز الردود</a></li>'''
new_nav = '''                <li><a href="#axes" onclick="showPage('axes'); return false;">محاور الشبهات والردود</a></li>'''
html = html.replace(old_nav, new_nav)

# Update hero buttons
html = html.replace('<a href="#doubts" class="btn btn-primary">تصفح الردود الآن</a>', '<a href="#axes" onclick="showPage(\'axes\'); return false;" class="btn btn-primary">تصفح الردود الآن</a>')
html = html.replace('<a href="#axes" class="btn btn-secondary">تحميل الحقيبة العلمية</a>', '<a href="https://drive.google.com/drive/folders/1H5tw5T8epPHhsK_NSjlWtoO83NRZ9V7R?usp=sharing" target="_blank" class="btn btn-secondary">تحميل الحقيبة العلمية</a>')


# 4. Modify styles.css
css += '\n/* --- ISTISHRAQ STYLES --- */\n' + ist_css

# 5. Modify app.js
old_showPage = '''    // Hide all pages
    document.getElementById('concepts-page').style.display = 'none';
    document.getElementById('hero').style.display = 'none';
    document.querySelector('.main-layout').style.display = 'none';
    
    // Show requested page
    if (pageId === 'concepts') {
        document.getElementById('concepts-page').style.display = 'block';
        window.scrollTo(0, 0);
    } else if (pageId === 'home') {
        document.getElementById('hero').style.display = 'block';
        document.querySelector('.main-layout').style.display = 'block';
        window.scrollTo(0, 0);
    } else {
        document.getElementById('hero').style.display = 'block';
        document.querySelector('.main-layout').style.display = 'block';
        document.getElementById(pageId).scrollIntoView({ behavior: 'smooth' });
    }'''

new_showPage = '''    // Hide all pages
    document.getElementById('concepts-page').style.display = 'none';
    const axesPage = document.getElementById('axes-page');
    if (axesPage) axesPage.style.display = 'none';
    document.getElementById('hero').style.display = 'none';
    document.querySelector('.main-layout').style.display = 'none';
    
    // Show requested page
    if (pageId === 'concepts') {
        document.getElementById('concepts-page').style.display = 'block';
        window.scrollTo(0, 0);
    } else if (pageId === 'axes') {
        if (axesPage) axesPage.style.display = 'block';
        window.scrollTo(0, 0);
    } else if (pageId === 'home') {
        document.getElementById('hero').style.display = 'block';
        document.querySelector('.main-layout').style.display = 'block';
        window.scrollTo(0, 0);
    } else {
        document.getElementById('hero').style.display = 'block';
        document.querySelector('.main-layout').style.display = 'block';
        const el = document.getElementById(pageId);
        if(el) el.scrollIntoView({ behavior: 'smooth' });
    }'''

js = js.replace(old_showPage, new_showPage)

# Fix filterByCat scrolling
js = js.replace('document.getElementById("doubts").scrollIntoView({ behavior: \'smooth\' });', 'showPage("axes"); setTimeout(() => { document.getElementById("doubts").scrollIntoView({ behavior: \'smooth\' }); }, 50);')
js = js.replace('if (window.location.hash === \'#concepts\') {', 'if (window.location.hash === \'#concepts\') {')
# ensure hash checking triggers axes page
js = js.replace('if (window.location.hash === \'#concepts\') {\n        setTimeout(() => showPage(\'concepts\'), 100);\n    }', 'if (window.location.hash === \'#concepts\') {\n        setTimeout(() => showPage(\'concepts\'), 100);\n    } else if (window.location.hash === \'#axes\') {\n        setTimeout(() => showPage(\'axes\'), 100);\n    }')

# Add accordion js at the end
js += '\n' + ist_js

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
with open('styles.css', 'w', encoding='utf-8') as f:
    f.write(css)
with open('app.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Refactoring complete.")
