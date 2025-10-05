/**
 * Creates the area menu with all available areas
 * @param {Object} groupedProfiles - Object with profiles grouped by area
 */
function createAreaMenu(groupedProfiles) {
    const menuList = document.getElementById('area-menu-list');
    menuList.innerHTML = '';
    
    for (const area in groupedProfiles) {
        const menuItem = document.createElement('div');
        menuItem.className = 'area-menu-item';
        
        const areaName = document.createElement('span');
        areaName.textContent = area;
        
        const count = document.createElement('span');
        count.className = 'count';
        count.textContent = groupedProfiles[area].length;
        
        menuItem.appendChild(areaName);
        menuItem.appendChild(count);
        
        // Add click handler to navigate to area
        menuItem.addEventListener('click', () => {
            const areaSection = document.getElementById(`area-${area.replace(/\s+/g, '-')}`);
            if (areaSection) {
                areaSection.scrollIntoView({ behavior: 'smooth' });
                // Hide menu after selection
                document.getElementById('area-menu').classList.remove('show');
            }
        });
        
        menuList.appendChild(menuItem);
    }
}

/**
 * Toggles the area menu visibility
 */
function setupAreaMenuToggle() {
    const toggle = document.getElementById('area-menu-toggle');
    const menu = document.getElementById('area-menu');
    
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('show');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !toggle.contains(e.target)) {
            menu.classList.remove('show');
        }
    });
}

/**
 * Setup search functionality
 */
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        const allCards = document.querySelectorAll('.profile-card');
        const allSections = document.querySelectorAll('.area-section');
        
        if (searchTerm === '') {
            // Show all cards and sections
            allCards.forEach(card => card.style.display = 'flex');
            allSections.forEach(section => section.style.display = 'flex');
            return;
        }
        
        // Hide all sections first
        allSections.forEach(section => {
            const visibleCards = [];
            const cards = section.querySelectorAll('.profile-card');
            
            cards.forEach(card => {
                const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
                const area = section.querySelector('.area-heading')?.textContent.toLowerCase() || '';
                const mulgaav = card.querySelector('.info-container p:nth-child(2)')?.textContent.toLowerCase() || '';
                const phone = card.querySelector('.phone-badge')?.textContent.toLowerCase() || '';
                
                if (name.includes(searchTerm) || 
                    area.includes(searchTerm) || 
                    mulgaav.includes(searchTerm) || 
                    phone.includes(searchTerm)) {
                    card.style.display = 'flex';
                    visibleCards.push(card);
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Show section only if it has visible cards
            section.style.display = visibleCards.length > 0 ? 'flex' : 'none';
        });
    });
}
// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);
/**
 * Groups profiles by their Area property
 * @param {Array} profiles - Array of profile objects from Supabase
 * @returns {Object} - Object with areas as keys and profile arrays as values
 */
function groupProfilesByArea(profiles) {
    return profiles.reduce((groupedData, profile) => {
        const area = profile.Area || 'Uncategorized';
        if (!groupedData[area]) {
            groupedData[area] = [];
        }
        groupedData[area].push(profile);
        return groupedData;
    }, {});
}

/**
 * Renders grouped profiles in a 2-column grid layout
 * @param {Object} groupedProfiles - Object with profiles grouped by area
 */
function displayProfiles(groupedProfiles) {
    const container = document.getElementById('directory-container');
    container.innerHTML = '';

    for (const area in groupedProfiles) {
        // Create area section wrapper
        const areaSection = document.createElement('div');
        areaSection.className = 'area-section';
        areaSection.id = `area-${area.replace(/\s+/g, '-')}`;

        // Create area heading
        const areaHeading = document.createElement('h2');
        areaHeading.className = 'area-heading';
        areaHeading.textContent = area;
        areaSection.appendChild(areaHeading);

        // Create grid container for profiles
        const profilesGrid = document.createElement('div');
        profilesGrid.className = 'profiles-grid';
        
        const profilesInArea = groupedProfiles[area];
        
        // Add single-item class if only one profile in area (but keep grid structure)
        if (profilesInArea.length === 1) {
            profilesGrid.classList.add('single-item');
        }

        // Create profile cards
        profilesInArea.forEach(profile => {
            const card = document.createElement('div');
            card.className = 'profile-card';

            // Profile image
            const image = document.createElement('img');
            image.src = profile.Image || 'https://via.placeholder.com/150';
            image.alt = profile['नाव'];
            
            // Info container
            const infoContainer = document.createElement('div');
            infoContainer.className = 'info-container';
            
            // Name (नाव)
            const name = document.createElement('h3');
            name.textContent = profile['नाव'];

            // Native Place (मुळगाव)
            const nativePlace = document.createElement('p');
            nativePlace.innerHTML = `<strong>मुळगाव:</strong> ${profile['मुळगाव']}`;

            // Phone (मोबाईल नंबर - clickable for mobile with special badge)
            const phone = document.createElement('p');
            const phoneBadge = document.createElement('div');
            phoneBadge.className = 'phone-badge';
            phoneBadge.innerHTML = `<a href="tel:${profile['मोबाईल नंबर']}">${profile['मोबाईल नंबर']}</a>`;
            phone.innerHTML = '<strong>मोबाईल नंबर:</strong> ';
            phone.appendChild(phoneBadge);

            // Append all info elements
            infoContainer.appendChild(name);
            infoContainer.appendChild(nativePlace);
            infoContainer.appendChild(phone);

            card.appendChild(image);
            card.appendChild(infoContainer);
            
            profilesGrid.appendChild(card);
        });

        areaSection.appendChild(profilesGrid);
        container.appendChild(areaSection);
    }
}

/**
 * Updates the current area indicator in the header based on scroll position
 * Uses Intersection Observer for accurate detection
 */
function updateCurrentAreaIndicator() {
    const areaSections = document.querySelectorAll('.area-section');
    const indicator = document.getElementById('current-area-indicator');
    
    // Create intersection observer for better area detection
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Trigger when section is in middle 50% of viewport
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const heading = entry.target.querySelector('.area-heading');
                if (heading) {
                    indicator.textContent = heading.textContent;
                }
            }
        });
    }, observerOptions);
    
    // Observe all area sections
    areaSections.forEach(section => observer.observe(section));
}

/**
 * Fetches profiles from Supabase and displays them
 */
async function getProfiles() {
    const { data, error } = await supabaseClient
        .from('profile')
        .select('*');

    if (error) {
        console.error('Error fetching profiles:', error);
        const container = document.getElementById('directory-container');
        container.innerHTML = '<p style="text-align: center; color: #e53e3e; font-size: 1.2rem;">Error loading profiles. Please try again later.</p>';
        return;
    }
    
    const groupedProfiles = groupProfilesByArea(data);
    displayProfiles(groupedProfiles);
    createAreaMenu(groupedProfiles);
    
    // Initialize area indicator after profiles are displayed
    updateCurrentAreaIndicator();
}

// Event Listeners
setupAreaMenuToggle();

// Initialize app
getProfiles().then(() => {
    setupSearch();
});