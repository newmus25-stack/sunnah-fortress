// app.js - Shopify Landing Page Logic

document.addEventListener("DOMContentLoaded", () => {
    // Basic Info
    const categoriesContainer = document.getElementById("categories-container");
    const doubtsContainer = document.getElementById("doubts-container");
    const libraryPreview = document.getElementById("library-preview");
    const fullLibraryContainer = document.getElementById("full-library-container");
    const modal = document.getElementById("doubt-modal");
    const modalBody = document.getElementById("modal-body");
    const closeModal = document.querySelector(".close-modal");
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");

    let currentFilter = 'all';

    // Helper: Highlight Text
    function highlight(text, term) {
        if (!term) return text;
        const regex = new RegExp(`(${term})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // 1. Render Categories (Axes)
    function renderCategories() {
        const icons = {
            "تدوين_السنة": "fa-pen-nib",
            "مصدر_الفقه": "fa-book-open",
            "عدالة_الصحابة": "fa-scale-balanced",
            "منهج_المحدثين": "fa-microscope",
            "التعارض_الظاهري": "fa-code-compare",
            "الاستشراق": "fa-globe",
            "الحديث_والسياسة": "fa-gavel"
        };

        categoriesContainer.innerHTML = appData.categories.map(cat => `
            <div class="axis-card" onclick="filterByCat('${cat.id}')">
                <i class="fas ${icons[cat.id] || 'fa-folder'}" style="color: ${cat.color}"></i>
                <h3>${cat.name}</h3>
            </div>
        `).join('') + `
            <div class="axis-card" onclick="openIstishraqModal()" style="border-right-color: #f39c12; cursor: pointer; background-color: #fffaf0;">
                <i class="fas fa-map-location-dot" style="color: #f39c12"></i>
                <h3>اذهب بعيدا</h3>
                <p style="font-size: 0.85rem; color: var(--text-light); margin-top: 10px; line-height: 1.4;">خريطة مفاهيمية لشبهات الاستشراق مع القواعد العشر لهدم نظريته</p>
            </div>
        `;
    }

    // 2. Render Doubts List
    window.filterByCat = (catId) => {
        currentFilter = catId;
        searchInput.value = ""; 
        renderDoubts();
        renderFullLibrary();
        showPage("axes"); setTimeout(() => { document.getElementById("doubts").scrollIntoView({ behavior: 'smooth' }); }, 50);
    };

    function renderDoubts(filterTerm = "") {
        let filtered = currentFilter === 'all' 
            ? appData.doubts 
            : appData.doubts.filter(d => d.categoryId === currentFilter);

        const doubtsHeader = document.querySelector("#doubts .section-header");
        
        if (filterTerm) {
            const term = filterTerm.toLowerCase();
            filtered = appData.doubts.filter(d => 
                d.title.toLowerCase().includes(term) || 
                d.analysis.toLowerCase().includes(term) ||
                d.refutation.some(r => r.toLowerCase().includes(term))
            );
            document.getElementById("axes").style.display = "none";
            
            // Add Search Meta
            const existingMeta = document.querySelector(".search-meta");
            if (existingMeta) existingMeta.remove();
            
            const meta = document.createElement("div");
            meta.className = "search-meta";
            meta.innerHTML = `
                <h3>نتائج البحث عن: "<span style="color: var(--secondary)">${filterTerm}</span>"</h3>
                <span class="clear-search" onclick="clearSearch()">إلغاء البحث والعودة للرئيسية</span>
            `;
            doubtsContainer.parentNode.insertBefore(meta, doubtsContainer);
        } else {
            document.getElementById("axes").style.display = "block";
            const existingMeta = document.querySelector(".search-meta");
            if (existingMeta) existingMeta.remove();
        }

        if (filtered.length === 0) {
            doubtsContainer.innerHTML = `<p style="padding: 20px; text-align: center; color: var(--text-light);">عذراً، لم نجد نتائج في الردود تطابق بحثك.</p>`;
            return;
        }

        doubtsContainer.innerHTML = filtered.map(doubt => {
            const cat = appData.categories.find(c => c.id === doubt.categoryId);
            return `
                <div class="doubt-card" style="border-right-color: ${cat.color}">
                    <span class="cat" style="color: ${cat.color}">${cat.name}</span>
                    <h3>${highlight(doubt.title, filterTerm)}</h3>
                    <p>${highlight(doubt.analysis.substring(0, 150), filterTerm)}...</p>
                    <a href="javascript:void(0)" class="read-btn" onclick="openDoubt(${doubt.id}, '${filterTerm}')">اقرأ الرد العلمي الكامل ←</a>
                </div>
            `;
        }).join('');
    }

    window.clearSearch = () => {
        searchInput.value = "";
        currentFilter = 'all';
        renderDoubts();
        renderFullLibrary();
    };

    // 3. Render Library Preview (Sidebar)
    function renderLibrarySidebar() {
        libraryPreview.innerHTML = appData.library.slice(0, 5).map(item => `
            <div class="side-item">
                <i class="fas fa-file-pdf"></i>
                <div class="side-text">
                    <a href="${item.link}" target="_blank" style="text-decoration: none; color: inherit;">
                        <span>${item.title.substring(0, 45)}${item.title.length > 45 ? '...' : ''}</span>
                    </a>
                </div>
            </div>
        `).join('');
    }

    // 4. Render Full Library (Main Content)
    function renderFullLibrary(filterTerm = "") {
        if (!fullLibraryContainer) return;

        let filtered = appData.library;
        if (filterTerm) {
            const term = filterTerm.toLowerCase();
            filtered = appData.library.filter(item => 
                item.title.toLowerCase().includes(term) || 
                item.author.toLowerCase().includes(term)
            );
        }

        if (filtered.length === 0) {
            fullLibraryContainer.innerHTML = `<p style="color: var(--text-light);">لا توجد كتب تطابق البحث.</p>`;
            return;
        }

        fullLibraryContainer.innerHTML = filtered.map(item => `
            <div class="lib-card" style="border-right: 5px solid ${item.color || '#c5a059'}; padding: 25px; background: #fff; border: 1px solid var(--border); margin-bottom: 10px;">
                <span class="tag" style="background: #eee; padding: 2px 10px; font-size: 0.75rem; border-radius: 2px; display: inline-block; margin-bottom: 10px;">${item.type}</span>
                <h3 style="font-size: 1.4rem; color: #222; margin-bottom: 10px;">${highlight(item.title, filterTerm)}</h3>
                <p style="margin: 10px 0; font-size: 0.95rem; color: var(--text-light);">إعداد: ${highlight(item.author, filterTerm)}</p>
                <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="read-btn" style="color: ${item.color || '#c5a059'}; font-weight: bold; text-decoration: none;">تحميل / قراءة ←</a>
            </div>
        `).join('');
    }

    // 5. Search Logic
    function performSearch() {
        const term = searchInput.value.trim();
        if (term.length > 0) {
            currentFilter = 'all'; 
            renderDoubts(term);
            renderFullLibrary(term);
            showPage("axes"); setTimeout(() => { document.getElementById("doubts").scrollIntoView({ behavior: 'smooth' }); }, 50);
        } else {
            clearSearch();
        }
    }

    searchBtn.addEventListener("click", performSearch);
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") performSearch();
    });

    // 6. Modal Logic
    window.openDoubt = (id, highlightTerm = "") => {
        const doubt = appData.doubts.find(d => d.id === id);
        const cat = appData.categories.find(c => c.id === doubt.categoryId);
        
        modalBody.innerHTML = `
            <div class="article-header">
                <span style="color: ${cat.color}; font-weight: bold;">${cat.name}</span>
                <h2 style="font-size: 2.5rem; margin-top: 10px;">${highlight(doubt.title, highlightTerm)}</h2>
                <hr style="margin: 20px 0; border: none; border-bottom: 1px solid #eee;">
            </div>
            <div class="article-content">
                <h3 style="color: ${cat.color}; margin-bottom: 15px; border-right: 4px solid ${cat.color}; padding-right: 15px;">التحليل العلمي</h3>
                <p style="margin-bottom: 30px; font-size: 1.1rem;">${highlight(doubt.analysis, highlightTerm)}</p>
                
                <h3 style="color: ${cat.color}; margin-bottom: 15px; border-right: 4px solid ${cat.color}; padding-right: 15px;">الرد الموثق</h3>
                <ul style="margin-bottom: 30px; padding-right: 20px;">
                    ${doubt.refutation.map(r => `<li style="margin-bottom: 15px;">${highlight(r, highlightTerm)}</li>`).join('')}
                </ul>

                <h3 style="color: ${cat.color}; margin-bottom: 15px; border-right: 4px solid ${cat.color}; padding-right: 15px;">المصادر والمراجع</h3>
                <ul style="list-style: none;">
                    ${doubt.references.map(ref => `<li style="margin-bottom: 8px;">📚 ${highlight(ref, highlightTerm)}</li>`).join('')}
                </ul>
            </div>
        `;
        modal.style.display = "block";
        document.body.style.overflow = "hidden";
    };

    closeModal.onclick = () => {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    };

    window.openIstishraqModal = () => {
        const content = document.getElementById("istishraq-content");
        if(content) {
            modalBody.innerHTML = content.innerHTML;
            modal.style.display = "block";
            document.body.style.overflow = "hidden";

            // Re-initialize accordion buttons inside the modal
            const accordions = modalBody.querySelectorAll("button.accordion");
            accordions.forEach(btn => {
                btn.addEventListener("click", function() {
                    this.classList.toggle("active");
                    const panel = this.nextElementSibling;
                    if (panel && panel.classList.contains("panel")) {
                        if (panel.style.display === "block") {
                            panel.style.display = "none";
                        } else {
                            panel.style.display = "block";
                        }
                    }
                });
            });
        }
    };

    // Nav Active State Handling
    window.addEventListener('scroll', () => {
        let current = "";
        const sections = document.querySelectorAll("section, .section-block");
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute("id");
            }
        });

        document.querySelectorAll(".nav-links li a").forEach((a) => {
            a.classList.remove("active");
            if (a.getAttribute("href").includes(current)) {
                a.classList.add("active");
            }
        });
    });

    // Initial Render
    renderCategories();
    renderDoubts();
    renderLibrarySidebar();
    renderFullLibrary();

    // Check hash on initial load
    if (window.location.hash === '#concepts') {
        setTimeout(() => showPage('concepts'), 100);
    } else if (window.location.hash === '#axes') {
        setTimeout(() => showPage('axes'), 100);
    }
});

// Mobile Menu Toggle
function toggleMobileMenu() {
    const navLinks = document.getElementById("navLinks");
    navLinks.classList.toggle("active");
}

// Toggle Concept Card
function toggleCard(card) {
    card.classList.toggle("collapsed");
}

// Page Navigation Functions
function showPage(pageId) {
    // Hide all pages
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
    }
}

// Check URL hash on load
window.addEventListener('hashchange', function() {
    if (window.location.hash === '#concepts') {
        showPage('concepts');
    } else if (window.location.hash === '#axes') {
        showPage('axes');
    }
});


    // Accordion functionality
    var acc = document.getElementsByClassName("accordion");
    for (var i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            // Toggle active class
            this.classList.toggle("active");

            // Toggle panel
            var panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        });
    }
