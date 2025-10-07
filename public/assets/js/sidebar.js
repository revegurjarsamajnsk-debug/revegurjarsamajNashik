// sidebar.js - Sidebar component with improved z-index and no blocking icon
(function() {
    const sidebarHTML = `
        <style>
        .menu-toggle {
            position: fixed;
            top: 1.5rem;
            left: 2rem;
            background: rgba(255, 153, 51, 0.9);
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 12px;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 6px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 1000;
        }
        
        /* Hide menu toggle when sidebar is open */
        .menu-toggle.active {
            opacity: 0;
            pointer-events: none;
        }
        
        /* Search bar styles */
        .search-container {
            position: fixed;
            top: 1.5rem;
            left: 6rem;
            right: calc(450px + 4rem);
            z-index: 1000;
        }
        
        .search-input {
            width: 100%;
            padding: 0.8rem 1.5rem;
            border: 2px solid rgba(102, 126, 234, 0.3);
            border-radius: 25px;
            font-size: 1rem;
            outline: none;
            transition: all 0.3s ease;
            background: rgba(255, 255, 255, 0.95);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .search-input:focus {
            border-color: #667eea;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
        }
        
        .search-input::placeholder {
            color: #999;
        }
        
        .menu-toggle:hover {
            background: rgba(255, 102, 0, 0.9);
            transform: scale(1.05);
        }
        .menu-toggle span {
            width: 30px;
            height: 3px;
            background: #fff;
            border-radius: 2px;
            transition: all 0.3s ease;
        }
        .sidebar-nav {
            position: fixed;
            top: 0;
            left: -350px;
            width: 350px;
            height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            box-shadow: 5px 0 30px rgba(0, 0, 0, 0.3);
            transition: left 0.4s ease;
            z-index: 9999;
            padding: 2rem;
            overflow-y: auto;
        }
        .sidebar-nav.active {
            left: 0;
        }
        .sidebar-nav-header {
            margin-bottom: 3rem;
            padding-bottom: 1.5rem;
            border-bottom: 2px solid rgba(255, 255, 255, 0.3);
        }
        .sidebar-nav-header h2 {
            color: #fff;
            font-size: 1.8rem;
            font-weight: 700;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        }
        .sidebar-nav-menu {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .sidebar-nav-menu li {
            margin-bottom: 1rem;
        }
        .sidebar-nav-menu a {
            color: #fff;
            text-decoration: none;
            font-size: 1.2rem;
            padding: 1rem 1.5rem;
            display: block;
            border-radius: 12px;
            transition: all 0.3s ease;
            background: rgba(255, 255, 255, 0.1);
            font-weight: 500;
        }
        .sidebar-nav-menu a:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: translateX(10px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        /* --- CSS FOR THE ADMIN BUTTON --- */
        .sidebar-nav-menu .admin-link-li {
            margin-top: 3rem; /* Pushes the button down */
            border-top: 1px solid rgba(255, 255, 255, 0.2); /* Adds a separator line */
            padding-top: 1rem; /* Adds space between the line and the button */
        }

        .sidebar-nav-menu a.admin-link {
            background: #dc3545; /* Red background color */
            text-align: center;
            font-weight: 700;
        }

        .sidebar-nav-menu a.admin-link:hover {
            background: #c82333; /* Darker red on hover */
            transform: translateY(-2px) translateX(0); /* Remove side-shift on hover */
        }
        /* --- END OF ADMIN BUTTON CSS --- */

        .sidebar-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9998;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        .sidebar-overlay.active {
            opacity: 1;
            visibility: visible;
        }
        @media (max-width: 768px) {
            .sidebar-nav {
                width: 280px;
                left: -280px;
            }
            .menu-toggle {
                left: 1rem;
            }
            .search-container {
                left: 5rem;
                right: 1rem;
                top: 5rem;
            }
        }
        </style>
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
    if (window.location.pathname.includes('ParichayList')) {
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