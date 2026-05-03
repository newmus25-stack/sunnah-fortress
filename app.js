/**
 * app.js - Scholarly Content Single Page Application (SPA)
 * Redesigned for maximum reliability and clean navigation.
 */

// 1. Configuration & Constants
const PAGES = {
    HOME: 'home',
    CONCEPTS: 'concepts',
    AXES: 'axes',
    ISTISHRAQ: 'istishraq',
    HADATHA: 'hadatha',
    LIBRARY: 'library',
    BAHITH: 'bahith',
    OFFER: 'offer'
};

const PAGE_ELEMENTS = {
    'concepts': 'concepts-page',
    'axes': 'axes-page',
    'istishraq': 'istishraq-page',
    'hadatha': 'hadatha-page'
};

// 2. Navigation Core
window.showPage = function(pageId) {
    console.log("[Navigation] Target:", pageId);
    
    // Safety check for critical elements
    const hero = document.getElementById('hero');
    const main = document.getElementById('main-layout');
    if (!hero || !main) {
        console.error("[Navigation] Critical elements (hero/main) not found!");
        return;
    }

    // Hide all standalone scholarly pages
    Object.values(PAGE_ELEMENTS).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    // Navigation Logic
    const isHome = pageId === 'home' || pageId === 'hero' || !pageId;
    const footer = document.querySelector('footer');

    if (isHome) {
        if (hero) hero.style.display = 'block';
        if (main) main.style.display = 'block';
        if (footer) footer.style.display = 'block';
        window.scrollTo(0, 0);
        // Clean hash without trigger
        if(window.location.hash) history.pushState("", document.title, window.location.pathname + window.location.search);
    } 
    else if (PAGE_ELEMENTS[pageId]) {
        // Show Standalone Scholarly Page
        if (hero) hero.style.display = 'none';
        if (main) main.style.display = 'none';
        if (footer) footer.style.display = 'none';
        const targetPage = document.getElementById(PAGE_ELEMENTS[pageId]);
        if (targetPage) {
            targetPage.style.display = 'block';
            window.scrollTo(0, 0);
        }
        window.location.hash = pageId;
    } 
    else {
        // Section within Home (Library, Bahith, Offer, etc.)
        if (hero) hero.style.display = 'block';
        if (main) main.style.display = 'block';
        if (footer) footer.style.display = 'block';
        const section = document.getElementById(pageId);
        if (section) {
            setTimeout(() => {
                const offset = 80; // Header height
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = section.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }, 100);
        } else {
            console.warn("[Navigation] Section not found:", pageId);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // Update Nav Active State
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === '#' + pageId || (pageId === 'home' && href === '#hero')) {
            link.classList.add('active');
        }
    });
};

// 3. Content Rendering
const Renderer = {
    init() {
        this.renderCategories();
        this.renderDoubts();
        this.renderLibraryPreview();
        this.renderFullLibrary();
    },

    renderCategories() {
        const container = document.getElementById("categories-container");
        if (!container) return;

        const icons = {
            "تدوين_السنة": "fa-pen-nib",
            "مصدر_الفقه": "fa-book-open",
            "عدالة_الصحابة": "fa-scale-balanced",
            "منهج_المحدثين": "fa-microscope",
            "التعارض_الظاهري": "fa-code-compare",
            "الاستشراق": "fa-globe",
            "الحديث_والسياسة": "fa-gavel"
        };

        let html = appData.categories.map(cat => `
            <div class="axis-card" onclick="window.filterByCat('${cat.id}')">
                <i class="fas ${icons[cat.id] || 'fa-folder'}" style="color: ${cat.color}"></i>
                <h3>${cat.name}</h3>
            </div>
        `).join('');

        // Add special scholarly cards
        html += `
            <div class="axis-card scholarly-card" onclick="showPage('istishraq')" style="border-right-color: #f39c12; background-color: #fffaf0;">
                <i class="fas fa-map-location-dot" style="color: #f39c12"></i>
                <h3>اذهب بعيدا</h3>
                <p>خريطة مفاهيمية لشبهات الاستشراق وقواعد هدمها</p>
            </div>
            <div class="axis-card scholarly-card" onclick="showPage('hadatha')" style="border-right-color: #065f46; background-color: #f0fdf4;">
                <i class="fas fa-book-open-reader" style="color: #065f46"></i>
                <h3>نافذة على الحداثة</h3>
                <p>دراسة نقدية لموقف الفكر الحداثي من السنة</p>
            </div>
        `;
        container.innerHTML = html;
    },

    renderDoubts(filterTerm = "", categoryId = 'all') {
        const container = document.getElementById("doubts-container");
        if (!container) return;

        let filtered = categoryId === 'all' 
            ? appData.doubts 
            : appData.doubts.filter(d => d.categoryId === categoryId);

        if (filterTerm) {
            const term = filterTerm.toLowerCase();
            filtered = filtered.filter(d => 
                d.title.toLowerCase().includes(term) || 
                d.analysis.toLowerCase().includes(term)
            );
        }

        container.innerHTML = filtered.map(doubt => {
            const cat = appData.categories.find(c => c.id === doubt.categoryId) || { color: '#666', name: 'عام' };
            return `
                <div class="doubt-card" style="border-right-color: ${cat.color}" onclick="window.openDoubt(${doubt.id})">
                    <span class="cat" style="color: ${cat.color}">${cat.name}</span>
                    <h3>${doubt.title}</h3>
                    <p>${doubt.analysis.substring(0, 150)}...</p>
                    <span class="read-more">اقرأ الرد العلمي الكامل ←</span>
                </div>
            `;
        }).join('');
    },

    renderLibraryPreview() {
        const container = document.getElementById("library-preview");
        if (!container) return;
        container.innerHTML = appData.library.slice(0, 5).map(item => `
            <div class="side-item">
                <i class="fas fa-file-pdf"></i>
                <div class="side-text">
                    <a href="${item.link}" target="_blank"><span>${item.title}</span></a>
                </div>
            </div>
        `).join('');
    },

    renderFullLibrary() {
        const container = document.getElementById("full-library-container");
        if (!container) return;
        container.innerHTML = appData.library.map(item => `
            <div class="lib-card" style="border-right: 5px solid ${item.color || '#c5a059'}">
                <span class="tag">${item.type}</span>
                <h3>${item.title}</h3>
                <p>إعداد: ${item.author || 'نخبة من الباحثين'}</p>
                <a href="${item.link}" target="_blank" class="read-btn" style="color: ${item.color || '#c5a059'}">تحميل / قراءة ←</a>
            </div>
        `).join('');
    }
};

// 4. Global Interaction Handlers
window.filterByCat = function(catId) {
    Renderer.renderDoubts("", catId);
    showPage('axes');
    setTimeout(() => {
        const d = document.getElementById("doubts");
        if(d) {
            const offset = 100;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = d.getBoundingClientRect().top;
            const offsetPosition = elementRect - bodyRect - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    }, 150);
};

window.toggleCard = function(el) {
    el.classList.toggle('collapsed');
};

window.openDoubt = function(id) {
    const doubt = appData.doubts.find(d => d.id === id);
    if (!doubt) return;
    const cat = appData.categories.find(c => c.id === doubt.categoryId) || { color: '#666' };
    
    const modal = document.getElementById("doubt-modal");
    const modalBody = document.getElementById("modal-body");
    if (modal && modalBody) {
        modalBody.innerHTML = `
            <div class="article-header">
                <span style="color: ${cat.color}">${cat.name}</span>
                <h2>${doubt.title}</h2>
            </div>
            <div class="article-content">
                <h3>التحليل العلمي</h3>
                <p>${doubt.analysis}</p>
                <h3>الرد الموثق</h3>
                <ul>${doubt.refutation.map(r => `<li>${r}</li>`).join('')}</ul>
                ${doubt.references && doubt.references.length > 0 ? `
                <h3>المصادر والمراجع</h3>
                <ul class="ref-list">${doubt.references.map(ref => `<li>${ref}</li>`).join('')}</ul>
                ` : ''}
            </div>
        `;
        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
    }
};

// 5. App Initialization
document.addEventListener("DOMContentLoaded", () => {
    // 1. Initial Render
    Renderer.init();

    // 2. Search Integration
    const searchBtn = document.getElementById("search-btn");
    const searchInput = document.getElementById("search-input");
    if (searchBtn && searchInput) {
        const handleSearch = () => {
            const term = searchInput.value.trim();
            if (term) {
                Renderer.renderDoubts(term);
                showPage('axes');
            }
        };
        searchBtn.onclick = handleSearch;
        searchInput.onkeypress = (e) => { if (e.key === 'Enter') handleSearch(); };
    }

    // 3. Modal Close
    const closeModal = document.querySelector(".close-modal");
    if (closeModal) {
        closeModal.onclick = () => {
            document.getElementById("doubt-modal").style.display = "none";
            document.body.style.overflow = "auto";
        };
    }

    // 4. Check initial hash
    const initialHash = window.location.hash.substring(1);
    if (initialHash) {
        showPage(initialHash);
    }
});

// Accordion Support
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('accordion')) {
        e.target.classList.toggle('active');
        const panel = e.target.nextElementSibling;
        if (panel) {
            panel.style.display = panel.style.display === "block" ? "none" : "block";
        }
    }
});
