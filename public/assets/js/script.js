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
        const allSections = document.querySelectorAll('.area-section');
        
        if (searchTerm === '') {
            // If search is empty, show everything
            allSections.forEach(section => {
                section.style.display = 'flex';
                section.querySelectorAll('.profile-card').forEach(card => card.style.display = 'flex');
            });
            return;
        }
        
        allSections.forEach(section => {
            let sectionHasVisibleCards = false;
            const cards = section.querySelectorAll('.profile-card');
            
            cards.forEach(card => {
                // Extract all text content from the card for a comprehensive search
                const cardText = card.textContent.toLowerCase();
                
                // Check if the card's text includes the search term
                if (cardText.includes(searchTerm)) {
                    card.style.display = 'flex';
                    sectionHasVisibleCards = true;
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Show the section only if it has cards that match the search
            section.style.display = sectionHasVisibleCards ? 'flex' : 'none';
        });
    });
}


const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
        
        if (profilesInArea.length === 1) {
            profilesGrid.classList.add('single-item');
        }

        profilesInArea.forEach(profile => {
            const card = document.createElement('div');
            card.className = 'profile-card';

            const image = document.createElement('img');
            image.src = profile.Image || 'https://via.placeholder.com/150';
            image.alt = profile['नाव'];
            // ADDED: Fallback for broken images
            image.onerror = function() { this.src='https://via.placeholder.com/150'; };
            
            const infoContainer = document.createElement('div');
            infoContainer.className = 'info-container';
            
            const name = document.createElement('h3');
            name.textContent = profile['नाव'];

            const nativePlace = document.createElement('p');
            // Using the corrected spelling for consistency
            nativePlace.innerHTML = `<strong>मूळगाव:</strong> ${profile['मूळगाव']}`;

            const phone = document.createElement('p');
            const phoneBadge = document.createElement('div');
            phoneBadge.className = 'phone-badge';
            phoneBadge.innerHTML = `<a href="tel:${profile['मोबाईल नंबर']}">${profile['मोबाईल नंबर']}</a>`;
            phone.innerHTML = '<strong>मोबाईल नंबर:</strong> ';
            phone.appendChild(phoneBadge);

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
 */
function updateCurrentAreaIndicator() {
    const areaSections = document.querySelectorAll('.area-section');
    const indicator = document.getElementById('current-area-indicator');
    
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
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
    
    updateCurrentAreaIndicator();
}

// Event Listeners
setupAreaMenuToggle();

// Initialize app
getProfiles().then(() => {
    setupSearch();
});