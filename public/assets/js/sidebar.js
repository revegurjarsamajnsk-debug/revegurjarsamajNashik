// sidebar.js
(function () {
    const sidebarHTML = `
        <button class="menu-toggle" id="sidebarMenuToggle" aria-label="Open menu">
            <span></span>
            <span></span>
            <span></span>
        </button>
        <div class="search-container" id="searchContainer" style="display:none;">
            <input
                type="text"
                class="search-input"
                id="searchInput"
                placeholder="खोजें: नाव, क्षेत्र, मुळगाव, मोबाईल..."
            >
        </div>
        <nav class="sidebar-nav" id="sidebarNav" aria-label="Site navigation">
            <div class="sidebar-nav-header">
                <h2>परिचय</h2>
            </div>
            <ul class="sidebar-nav-menu">
                <li><a href="/index.html">Home</a></li>
                <li><a href="/ParichayList.html">Parichay List</a></li>
                <li><a href="/contacts.html">संपर्क माहिती</a></li>
                <li class="admin-link-li">
                    <a href="/admin/login.html" class="admin-link">Admin Login</a>
                </li>
            </ul>
        </nav>
        <div class="sidebar-overlay" id="sidebarOverlay"></div>
    `;

    document.body.insertAdjacentHTML('afterbegin', sidebarHTML);

    // Show search bar only on the Parichay List page
    if (window.location.pathname.toLowerCase().includes('parichaylist')) {
        const sc = document.getElementById('searchContainer');
        if (sc) sc.style.display = 'block';
    }

    // Wait for DOM to settle before attaching events
    setTimeout(function () {
        const menuToggle = document.getElementById('sidebarMenuToggle');
        const sidebar    = document.getElementById('sidebarNav');
        const overlay    = document.getElementById('sidebarOverlay');

        if (!menuToggle || !sidebar || !overlay) return;

        function openSidebar() {
            sidebar.classList.add('active');
            overlay.classList.add('active');
            menuToggle.classList.add('active');
            menuToggle.setAttribute('aria-expanded', 'true');
        }

        function closeSidebar() {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }

        // Toggle on click (works on both desktop and mobile)
        menuToggle.addEventListener('click', function () {
            if (sidebar.classList.contains('active')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });

        // Close when clicking the overlay
        overlay.addEventListener('click', closeSidebar);

        // Close when a nav link is clicked
        sidebar.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeSidebar);
        });

        // Close on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeSidebar();
        });
    }, 50);
})();