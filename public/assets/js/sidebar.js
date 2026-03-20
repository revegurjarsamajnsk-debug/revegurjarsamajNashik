// sidebar.js - Cleaned up version
(function() {
    const sidebarHTML = `
        <button class="menu-toggle" id="sidebarMenuToggle">
            <span></span>
            <span></span>
            <span></span>
        </button>
        <div class="search-container" id="searchContainer" style="display: none;">
            <input type="text" class="search-input" id="searchInput" placeholder="खोजें: नाव, क्षेत्र, मुळगाव, मोबाईल...">
        </div>
        <nav class="sidebar-nav" id="sidebarNav">
            <div class="sidebar-nav-header">
                <h2>परिचय</h2>
            </div>
            <ul class="sidebar-nav-menu">
                <li><a href="/home.html">Home</a></li>
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
    
    // Show search bar only on ParichayList page
    if (window.location.pathname.toLowerCase().includes('parichaylist')) {
        const searchContainer = document.getElementById('searchContainer');
        if (searchContainer) {
            searchContainer.style.display = 'block';
        }
    }
    
    setTimeout(() => {
        const menuToggle = document.getElementById('sidebarMenuToggle');
        const sidebar = document.getElementById('sidebarNav');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (!menuToggle || !sidebar || !overlay) return;
        
        menuToggle.addEventListener('mouseenter', () => {
            menuToggle.classList.add('active');
            sidebar.classList.add('active');
            overlay.classList.add('active');
        });
        
        sidebar.addEventListener('mouseenter', () => {
            menuToggle.classList.add('active');
            sidebar.classList.add('active');
            overlay.classList.add('active');
        });
        
        menuToggle.addEventListener('mouseleave', () => {
            if (!sidebar.matches(':hover')) {
                setTimeout(() => {
                    if (!sidebar.matches(':hover')) {
                        menuToggle.classList.remove('active');
                        sidebar.classList.remove('active');
                        overlay.classList.remove('active');
                    }
                }, 100);
            }
        });
        
        sidebar.addEventListener('mouseleave', () => {
            menuToggle.classList.remove('active');
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
        
        overlay.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
        
        document.querySelectorAll('.sidebar-nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            });
        });
    }, 50);
})();