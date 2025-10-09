/**
 * Creates the area menu with all available areas
 * @param {Object} groupedProfiles - Object with profiles grouped by area
 */
function createAreaMenu(groupedProfiles) {
    const menuList = document.getElementById('area-menu-list');
    if (!menuList) return;
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
        
        menuItem.addEventListener('click', () => {
            const areaSection = document.getElementById(`area-${area.replace(/\s+/g, '-')}`);
            if (areaSection) {
                areaSection.scrollIntoView({ behavior: 'smooth' });
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
    
    if (!toggle || !menu) return;
    
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('show');
    });
    
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
                const cardText = card.textContent.toLowerCase();
                
                if (cardText.includes(searchTerm)) {
                    card.style.display = 'flex';
                    sectionHasVisibleCards = true;
                } else {
                    card.style.display = 'none';
                }
            });
            
            section.style.display = sectionHasVisibleCards ? 'flex' : 'none';
        });
    });
}


const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Groups profiles by their Area property
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
 * Helper function to get proper image URL from Supabase
 */
function getImageUrl(imagePath) {
    if (!imagePath) return 'https://via.placeholder.com/150?text=No+Image';
    
    // Always construct the URL from the path stored in the DB
    const { data } = supabaseClient.storage
        .from('profile-images')
        .getPublicUrl(imagePath);
    
    return data.publicUrl;
}

/**
 * Renders grouped profiles with improved image handling
 */
function displayProfiles(groupedProfiles) {
    const container = document.getElementById('directory-container');
    container.innerHTML = '';

    for (const area in groupedProfiles) {
        const areaSection = document.createElement('div');
        areaSection.className = 'area-section';
        areaSection.id = `area-${area.replace(/\s+/g, '-')}`;

        const areaHeading = document.createElement('h2');
        areaHeading.className = 'area-heading';
        areaHeading.textContent = area;
        areaSection.appendChild(areaHeading);

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
            const imageUrl = getImageUrl(profile.Image);
            image.src = imageUrl;
            image.alt = profile['नाव'] || 'Profile';
            
            // Improved error handling for images
            image.onerror = function() { 
                this.src = 'https://via.placeholder.com/150?text=No+Image'; 
            };
            
            const infoContainer = document.createElement('div');
            infoContainer.className = 'info-container';
            
            const name = document.createElement('h3');
            name.textContent = profile['नाव'] || 'Unknown';

            const nativePlace = document.createElement('p');
            nativePlace.innerHTML = `<strong>मुळगाव:</strong> ${profile['मुळगाव'] || 'N/A'}`;

            const phone = document.createElement('p');
            const phoneBadge = document.createElement('div');
            phoneBadge.className = 'phone-badge';
            const phoneNumber = profile['मोबाईल नंबर'] || 'N/A';
            phoneBadge.innerHTML = `<a href="tel:${phoneNumber}">${phoneNumber}</a>`;
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
 * Updates the current area indicator
 */
function updateCurrentAreaIndicator() {
    const areaSections = document.querySelectorAll('.area-section');
    const indicator = document.getElementById('current-area-indicator');
    
    if (!indicator || areaSections.length === 0) return;
    
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
 * Fetches and displays profiles
 */
async function getProfiles() {
    const container = document.getElementById('directory-container');
    if (!container) return;

    container.innerHTML = '<p style="text-align: center; color: #667eea; font-size: 1.2rem;">Loading profiles...</p>';
    
    try {
        const { data, error } = await supabaseClient
            .from('profile')
            .select('*')
            .order('Area', { ascending: true });

        if (error) throw error;
        
        if (!data || data.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #999; font-size: 1.2rem;">No profiles found.</p>';
            return;
        }
        
        const groupedProfiles = groupProfilesByArea(data);
        displayProfiles(groupedProfiles);
        createAreaMenu(groupedProfiles);
        updateCurrentAreaIndicator();
        
    } catch (error) {
        console.error('Error fetching profiles:', error);
        container.innerHTML = '<p style="text-align: center; color: #e53e3e; font-size: 1.2rem;">Error loading profiles. Please refresh the page.</p>';
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    setupAreaMenuToggle();
    getProfiles().then(() => {
        setupSearch();
    });
});