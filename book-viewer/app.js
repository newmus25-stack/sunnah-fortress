document.addEventListener('DOMContentLoaded', () => {
    const tocList = document.getElementById('toc-list');
    const contentTitle = document.getElementById('content-title');
    const readingArea = document.getElementById('reading-area');
    const searchInput = document.getElementById('search-input');

    // Build TOC from bookData
    function buildTOC(data) {
        tocList.innerHTML = '';
        data.forEach(item => {
            const li = document.createElement('li');
            li.className = 'toc-item';
            if (item.type === 'chapter') li.classList.add('chapter-item');
            if (item.type === 'section') li.classList.add('sub-item');
            li.textContent = item.title;
            li.dataset.id = item.id;

            li.addEventListener('click', () => {
                // Remove active from all
                document.querySelectorAll('.toc-item').forEach(el => el.classList.remove('active'));
                li.classList.add('active');
                showContent(item);
            });

            tocList.appendChild(li);
        });
    }

    // Show content in main area
    function showContent(item) {
        contentTitle.textContent = item.title;
        // Convert newlines to paragraphs
        const paragraphs = item.content.split('\n').filter(p => p.trim() !== '');
        readingArea.innerHTML = paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
        readingArea.style.animation = 'none';
        readingArea.offsetHeight; // trigger reflow
        readingArea.style.animation = 'fadeIn 0.4s ease';
        // Scroll main content to top
        readingArea.scrollTop = 0;
    }

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const items = document.querySelectorAll('.toc-item');
        items.forEach(li => {
            const id = parseInt(li.dataset.id);
            const dataItem = bookData.find(d => d.id === id);
            if (!dataItem) return;
            const match = dataItem.title.toLowerCase().includes(query) ||
                          dataItem.content.toLowerCase().includes(query);
            li.classList.toggle('hidden', !match);
        });
    });

    // Initial build
    buildTOC(bookData);
});
