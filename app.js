// app.js - Universal Navigation Logic
// 1. Global Navigation Function
function showPage(pageId) {
    console.log("Navigating to:", pageId);
    
    // Support for home aliases
    const isHome = pageId === 'home' || pageId === 'hero' || !pageId;
    
    // Standalone pages map
    const pages = {
        'concepts': 'concepts-page',
        'axes': 'axes-page',
        'istishraq': 'istishraq-page',
        'hadatha': 'hadatha-page'
    };

    // Hide all standalone pages
    Object.values(pages).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    const hero = document.getElementById('hero');
    const main = document.getElementById('main-layout');

    if (isHome) {
        if (hero) hero.style.display = 'block';
        if (main) main.style.display = 'block';
        window.scrollTo(0, 0);
        // Clean hash without trigger
        if(window.location.hash) history.pushState("", document.title, window.location.pathname + window.location.search);
    } else if (pages[pageId]) {
        if (hero) hero.style.display = 'none';
        if (main) main.style.display = 'none';
        const el = document.getElementById(pages[pageId]);
        if (el) el.style.display = 'block';
        window.scrollTo(0, 0);
        window.location.hash = pageId;
    } else {
        // It's an anchor within the home page (library, bahith, offer, etc)
        if (hero) hero.style.display = 'block';
        if (main) main.style.display = 'block';
        const target = document.getElementById(pageId);
        if (target) {
            // Scroll to target
            setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth' });
            }, 100);
            window.location.hash = pageId;
        } else {
            window.scrollTo(0, 0);
        }
    }

    // Update Nav Active State
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.remove('active');
        const href = a.getAttribute('href');
        if (href === '#' + pageId || (isHome && href === '#hero')) {
            a.classList.add('active');
        }
    });
}

// 2. Hash Handling for Initial Load / Direct Access
function handleHash() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showPage(hash);
    }
}

window.addEventListener('load', handleHash);

// 3. Helper: Show Notification (Safeguard for newsletter)
window.showNotification = function(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
};

// 4. Main Application Logic
document.addEventListener("DOMContentLoaded", () => {
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

    // Render Categories (Axes)
    function renderCategories() {
        if (!categoriesContainer) return;
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
            <div class="axis-card" onclick="showPage('istishraq')" style="border-right-color: #f39c12; cursor: pointer; background-color: #fffaf0;">
                <i class="fas fa-map-location-dot" style="color: #f39c12"></i>
                <h3>اذهب بعيدا</h3>
                <p style="font-size: 0.85rem; color: var(--text-light); margin-top: 10px; line-height: 1.4;">خريطة مفاهيمية لشبهات الاستشراق مع القواعد العشر لهدم نظريته</p>
            </div>
            <div class="axis-card" onclick="showPage('hadatha')" style="border-right-color: #065f46; cursor: pointer; background-color: #f0fdf4;">
                <i class="fas fa-book-open-reader" style="color: #065f46"></i>
                <h3>نافذة على الحداثة</h3>
                <p style="font-size: 0.85rem; color: var(--text-light); margin-top: 10px; line-height: 1.4;">دراسة نقدية في موقف الفكر الحداثي من السنة النبوية</p>
            </div>
        `;
    }

    // filterByCat
    window.filterByCat = (catId) => {
        currentFilter = catId;
        if (searchInput) searchInput.value = ""; 
        renderDoubts();
        renderFullLibrary();
        showPage('axes');
        setTimeout(() => { 
            const d = document.getElementById("doubts");
            if(d) d.scrollIntoView({ behavior: 'smooth' }); 
        }, 100);
    };

    // Render Doubts
    function renderDoubts(filterTerm = "") {
        if (!doubtsContainer) return;
        let filtered = currentFilter === 'all' 
            ? appData.doubts 
            : appData.doubts.filter(d => d.categoryId === currentFilter);
        
        if (filterTerm) {
            const term = filterTerm.toLowerCase();
            filtered = appData.doubts.filter(d => 
                d.title.toLowerCase().includes(term) || 
                d.analysis.toLowerCase().includes(term) ||
                d.refutation.some(r => r.toLowerCase().includes(term))
            );
            const axes = document.getElementById("axes");
            if(axes) axes.style.display = "none";
        } else {
            const axes = document.getElementById("axes");
            if(axes) axes.style.display = "block";
        }

        doubtsContainer.innerHTML = filtered.map(doubt => {
            const cat = appData.categories.find(c => c.id === doubt.categoryId) || { color: '#666', name: 'عام' };
            return `
                <div class="doubt-card" style="border-right-color: ${cat.color}" onclick="openDoubt(${doubt.id}, '${filterTerm}')">
                    <span class="cat" style="color: ${cat.color}">${cat.name}</span>
                    <h3>${highlight(doubt.title, filterTerm)}</h3>
                    <p>${highlight(doubt.analysis.substring(0, 150), filterTerm)}...</p>
                    <a href="javascript:void(0)" class="read-btn">اقرأ الرد العلمي الكامل ←</a>
                </div>
            `;
        }).join('');
    }

    // Library Functions
    function renderLibrarySidebar() {
        if (!libraryPreview) return;
        libraryPreview.innerHTML = appData.library.slice(0, 5).map(item => `
            <div class="side-item">
                <i class="fas fa-file-pdf"></i>
                <div class="side-text">
                    <a href="${item.link}" target="_blank" style="text-decoration: none; color: inherit;">
                        <span>${item.title.substring(0, 45)}...</span>
                    </a>
                </div>
            </div>
        `).join('');
    }

    function renderFullLibrary(filterTerm = "") {
        if (!fullLibraryContainer) return;
        let filtered = appData.library;
        if (filterTerm) {
            const term = filterTerm.toLowerCase();
            filtered = appData.library.filter(item => 
                item.title.toLowerCase().includes(term) || 
                (item.author && item.author.toLowerCase().includes(term))
            );
        }

        fullLibraryContainer.innerHTML = filtered.map(item => `
            <div class="lib-card" style="border-right: 5px solid ${item.color || '#c5a059'}; padding: 25px; background: #fff; border: 1px solid var(--border); margin-bottom: 10px;">
                <span class="tag">${item.type}</span>
                <h3 style="font-size: 1.4rem; color: #222; margin-bottom: 10px;">${highlight(item.title, filterTerm)}</h3>
                <p>إعداد: ${highlight(item.author || 'نخبة من الباحثين', filterTerm)}</p>
                <a href="${item.link}" target="_blank" class="read-btn" style="color: ${item.color || '#c5a059'}">تحميل / قراءة ←</a>
            </div>
        `).join('');
    }

    // Modal Logic
    window.openDoubt = (id, highlightTerm = "") => {
        const doubt = appData.doubts.find(d => d.id === id);
        if(!doubt) return;
        const cat = appData.categories.find(c => c.id === doubt.categoryId) || { color: '#666' };
        
        if(modalBody) {
            modalBody.innerHTML = `
                <div class="article-header">
                    <span style="color: ${cat.color}">${cat.name}</span>
                    <h2 style="font-size: 2.2rem; margin-top: 10px;">${highlight(doubt.title, highlightTerm)}</h2>
                </div>
                <div class="article-content">
                    <h3>التحليل العلمي</h3>
                    <p style="font-size: 1.1rem;">${doubt.analysis}</p>
                    <h3>الرد الموثق</h3>
                    <ul>${doubt.refutation.map(r => `<li>${r}</li>`).join('')}</ul>
                </div>
            `;
        }
        if(modal) {
            modal.style.display = "block";
            document.body.style.overflow = "hidden";
        }
    };

    if (closeModal) {
        closeModal.onclick = () => {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        };
    }

    // Initialize everything
    renderCategories();
    renderDoubts();
    renderLibrarySidebar();
    renderFullLibrary();

    // Search trigger
    if (searchBtn && searchInput) {
        searchBtn.onclick = () => {
            const term = searchInput.value.trim();
            if(term) {
                renderDoubts(term);
                renderFullLibrary(term);
                showPage('axes');
            }
        };
    }

    // Accordion
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('accordion')) {
            e.target.classList.toggle('active');
            const panel = e.target.nextElementSibling;
            if (panel) {
                panel.style.display = panel.style.display === "block" ? "none" : "block";
            }
        }
    });
});
