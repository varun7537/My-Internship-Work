// Define image data with enhanced information
const images = [
  { 
      id: 1,
      src: './images/image1.jpg', 
      name: 'Swiss Alps', 
      country: 'Switzerland',
      description: 'Majestic mountain peaks covered in snow, with lush green valleys and crystal-clear lakes below.',
      featured: true
  },
  { 
      id: 2,
      src: './images/image2.jpg', 
      name: 'Amalfi Coast', 
      country: 'Italy',
      description: 'Colorful cliffside villages overlooking the turquoise Mediterranean waters.',
      featured: false
  },
  { 
      id: 3,
      src: './images/image3.jpg', 
      name: 'Lavender Fields of Provence', 
      country: 'France',
      description: 'Endless purple fields of fragrant lavender stretching to the horizon.',
      featured: true
  },
  { 
      id: 4,
      src: './images/image4.jpg', 
      name: 'Black Forest', 
      country: 'Germany',
      description: 'Dense, evergreen forests with charming villages and traditional architecture.',
      featured: false
  },
  { 
      id: 5,
      src: './images/image5.jpg', 
      name: 'Barcelona Coastline', 
      country: 'Spain',
      description: 'Beautiful beaches with the city\'s unique architecture visible in the background.',
      featured: true
  },
  { 
      id: 6,
      src: './images/image6.jpg', 
      name: 'Grand Canyon', 
      country: 'USA',
      description: 'Vast, colorful landscape carved by the Colorado River over millions of years.',
      featured: false
  },
  { 
      id: 7,
      src: './images/image7.jpg', 
      name: 'Banff National Park', 
      country: 'Canada',
      description: 'Stunning turquoise lakes surrounded by snow-capped peaks and evergreen forests.',
      featured: true
  },
  { 
      id: 8,
      src: './images/image8.jpg', 
      name: 'Great Barrier Reef', 
      country: 'Australia',
      description: 'Vibrant coral reefs teeming with colorful marine life in crystal clear waters.',
      featured: false
  },
  { 
      id: 9,
      src: './images/image1.jpg', 
      name: 'Matterhorn', 
      country: 'Switzerland',
      description: 'One of the most iconic mountains in Europe with its distinctive pyramid shape.',
      featured: false
  },
  { 
      id: 10,
      src: './images/image2.jpg', 
      name: 'Venice Canals', 
      country: 'Italy',
      description: 'Historic water channels lined with Renaissance and Gothic palaces.',
      featured: true
  },
  { 
      id: 11,
      src: './images/image3.jpg', 
      name: 'Mont Saint-Michel', 
      country: 'France',
      description: 'Medieval monastery perched on a rocky island, surrounded by sweeping tides.',
      featured: false
  },
  { 
      id: 12,
      src: './images/image4.jpg', 
      name: 'Neuschwanstein Castle', 
      country: 'Germany',
      description: 'Fairytale castle nestled in the Bavarian Alps that inspired Disney.',
      featured: true
  }
];

// DOM elements
const loading = document.getElementById('loading');
const galleryContainer = document.getElementById('gallery-container');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxDescription = document.getElementById('lightbox-description');
const lightboxIndex = document.getElementById('lightbox-index');
const lightboxFavorite = document.getElementById('lightbox-favorite');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const filterSelect = document.getElementById('filter');
const gridViewBtn = document.getElementById('grid-view');
const listViewBtn = document.getElementById('list-view');
const backToTopBtn = document.getElementById('back-to-top');
const pageNumbers = document.getElementById('page-numbers');

// State variables
let currentPage = 0;
const imagesPerPage = 6;
let currentImageIndex = 0;
let filteredImages = [...images];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Preload images for better performance
window.addEventListener('load', () => {
  setTimeout(() => {
      loading.classList.add('fade-out');
      setTimeout(() => {
          loading.style.display = 'none';
      }, 500);
  }, 1000); // Simulate loading time for demo
  
  initializeGallery();
});

// Initialize gallery
function initializeGallery() {
  loadImages(currentPage);
  updatePagination();
  setupEventListeners();
  checkScrollPosition();
}

// Setup all event listeners
function setupEventListeners() {
  // View toggle buttons
  gridViewBtn.addEventListener('click', () => {
      galleryContainer.className = 'slide grid-view';
      gridViewBtn.classList.add('active');
      listViewBtn.classList.remove('active');
      localStorage.setItem('viewMode', 'grid');
  });
  
  listViewBtn.addEventListener('click', () => {
      galleryContainer.className = 'slide list-view';
      listViewBtn.classList.add('active');
      gridViewBtn.classList.remove('active');
      localStorage.setItem('viewMode', 'list');
  });
  
  // Load view mode from localStorage
  const savedViewMode = localStorage.getItem('viewMode');
  if (savedViewMode === 'list') {
      listViewBtn.click();
  }
  
  // Filter change
  filterSelect.addEventListener('change', () => {
      const country = filterSelect.value;
      filteredImages = country === 'all' ? 
          [...images] : 
          images.filter(img => img.country === country);
      
      currentPage = 0;
      loadImages(currentPage);
      updatePagination();
  });
  
  // Navigation buttons
  prevBtn.addEventListener('click', () => navigatePage(-1));
  nextBtn.addEventListener('click', () => navigatePage(1));
  
  // Lightbox navigation
  document.querySelector('.prev-img').addEventListener('click', () => navigateLightbox(-1));
  document.querySelector('.next-img').addEventListener('click', () => navigateLightbox(1));
  
  // Close lightbox
  document.querySelector('.close-btn').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
          closeLightbox();
      }
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
      if (lightbox.style.display === 'flex') {
          if (e.key === 'Escape') closeLightbox();
          if (e.key === 'ArrowLeft') navigateLightbox(-1);
          if (e.key === 'ArrowRight') navigateLightbox(1);
      }
  });
  
  // Favorite button
  lightboxFavorite.addEventListener('click', toggleFavorite);
  
  // Back to top button
  backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
          top: 0,
          behavior: 'smooth'
      });
  });
  
  // Check scroll position for back to top button
  window.addEventListener('scroll', checkScrollPosition);
}

// Function to load images
function loadImages(page) {
  galleryContainer.innerHTML = '';  // Clear current gallery items
  const start = page * imagesPerPage;
  const end = Math.min(start + imagesPerPage, filteredImages.length);
  const pageImages = filteredImages.slice(start, end);
  
  pageImages.forEach((image, index) => {
      const delay = index * 100;
      
      const item = document.createElement('div');
      item.classList.add('item');
      item.style.backgroundImage = `url(${image.src})`;
      item.style.animationDelay = `${delay}ms`;
      item.setAttribute('aria-label', `View image of ${image.name}`);
      item.setAttribute('data-id', image.id);
      
      // Add featured badge for featured images
      if (image.featured) {
          const featuredBadge = document.createElement('span');
          featuredBadge.classList.add('featured-badge');
          featuredBadge.innerHTML = '<i class="fas fa-star"></i> Featured';
          item.appendChild(featuredBadge);
      }
      
      // Check if image is in favorites
      const isFavorite = favorites.includes(image.id);
      
      const content = `
          <div class="content">
              <div class="name">${image.name}</div>
              <div class="country"><i class="fas fa-map-marker-alt"></i> ${image.country}</div>
              <div class="description">${image.description}</div>
              <div class="buttons">
                  <button type="button" class="view-btn"><i class="fas fa-search-plus"></i> View</button>
                  <button type="button" class="favorite-btn ${isFavorite ? 'active' : ''}">
                      <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i> ${isFavorite ? 'Favorited' : 'Add to Favorites'}
                  </button>
              </div>
          </div>
      `;
      
      item.innerHTML += content;
      galleryContainer.appendChild(item);
      
      // Add click event to open lightbox
      item.querySelector('.view-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          openLightbox(filteredImages.findIndex(img => img.id === image.id));
      });
      
      // Alternative click on the whole item
      item.addEventListener('click', () => {
          openLightbox(filteredImages.findIndex(img => img.id === image.id));
      });
      
      // Add favorite button functionality
      item.querySelector('.favorite-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          toggleFavoriteById(image.id, e.currentTarget);
      });
  });
  
  // Update button states
  updateNavigationButtons();
}

// Update pagination
function updatePagination() {
  const totalPages = Math.ceil(filteredImages.length / imagesPerPage);
  pageNumbers.innerHTML = '';
  
  // Create numbered pagination if not too many pages
  if (totalPages <= 7) {
      for (let i = 0; i < totalPages; i++) {
          createPageNumber(i);
      }
  } else {
      // Create pagination with ellipsis for many pages
      if (currentPage < 3) {
          for (let i = 0; i < 5; i++) {
              createPageNumber(i);
          }
          createEllipsis();
          createPageNumber(totalPages - 1);
      } else if (currentPage > totalPages - 4) {
          createPageNumber(0);
          createEllipsis();
          for (let i = totalPages - 5; i < totalPages; i++) {
              createPageNumber(i);
          }
      } else {
          createPageNumber(0);
          createEllipsis();
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
              createPageNumber(i);
          }
          createEllipsis();
          createPageNumber(totalPages - 1);
      }
  }
}

// Create page number element
function createPageNumber(pageNum) {
  const pageEl = document.createElement('div');
  pageEl.classList.add('page-number');
  if (pageNum === currentPage) {
      pageEl.classList.add('active');
  }
  pageEl.textContent = pageNum + 1;
  pageEl.addEventListener('click', () => {
      currentPage = pageNum;
      loadImages(currentPage);
      updatePagination();
  });
  pageNumbers.appendChild(pageEl);
}

// Create ellipsis element
function createEllipsis() {
  const ellipsis = document.createElement('div');
  ellipsis.classList.add('page-ellipsis');
  ellipsis.textContent = '...';
  pageNumbers.appendChild(ellipsis);
}

// Update navigation buttons state
function updateNavigationButtons() {
  const totalPages = Math.ceil(filteredImages.length / imagesPerPage);
  
  prevBtn.disabled = currentPage === 0;
  nextBtn.disabled = currentPage >= totalPages - 1;
  
  if (prevBtn.disabled) {
      prevBtn.classList.add('disabled');
  } else {
      prevBtn.classList.remove('disabled');
  }
  
  if (nextBtn.disabled) {
      nextBtn.classList.add('disabled');
  } else {
      nextBtn.classList.remove('disabled');
  }
}

// Navigate gallery pages
function navigatePage(direction) {
  const totalPages = Math.ceil(filteredImages.length / imagesPerPage);
  const newPage = currentPage + direction;
  
  if (newPage >= 0 && newPage < totalPages) {
      currentPage = newPage;
      loadImages(currentPage);
      updatePagination();
      
      // Smooth scroll to top of gallery
      galleryContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Open lightbox
function openLightbox(index) {
  currentImageIndex = index;
  const image = filteredImages[index];
  
  lightboxImage.src = '';  // Clear image before loading new one
  lightboxImage.classList.remove('loaded');
  
  // Display lightbox
  lightbox.style.display = 'flex';
  setTimeout(() => {
      lightbox.classList.add('active');
  }, 10);
  
  // Load image with animation
  lightboxImage.src = image.src;
  lightboxImage.onload = () => {
      setTimeout(() => {
          lightboxImage.classList.add('loaded');
      }, 100);
  };
  
  // Update lightbox content
  lightboxTitle.textContent = image.name;
  lightboxDescription.textContent = image.description;
  lightboxIndex.textContent = `${index + 1} / ${filteredImages.length}`;
  
  // Update favorite button
  updateLightboxFavorite(image.id);
  
  // Prevent scrolling of background
  document.body.style.overflow = 'hidden';
}

// Close lightbox
function closeLightbox() {
  lightbox.classList.remove('active');
  setTimeout(() => {
      lightbox.style.display = 'none';
  }, 300);
  
  // Re-enable scrolling
  document.body.style.overflow = '';
}

// Navigate lightbox
function navigateLightbox(direction) {
  const newIndex = currentImageIndex + direction;
  
  if (newIndex >= 0 && newIndex < filteredImages.length) {
      openLightbox(newIndex);
  } else {
      // Optional: add bounce animation to indicate end of gallery
      const button = direction < 0 ? 
          document.querySelector('.prev-img') : 
          document.querySelector('.next-img');
      
      button.classList.add('bounce');
      setTimeout(() => {
          button.classList.remove('bounce');
      }, 300);
  }
}

// Toggle favorite in lightbox
function toggleFavorite() {
  const imageId = filteredImages[currentImageIndex].id;
  const isFavorite = favorites.includes(imageId);
  
  if (isFavorite) {
      favorites = favorites.filter(id => id !== imageId);
      lightboxFavorite.innerHTML = '<i class="far fa-heart"></i>';
      lightboxFavorite.classList.remove('active');
  } else {
      favorites.push(imageId);
      lightboxFavorite.innerHTML = '<i class="fas fa-heart"></i>';
      lightboxFavorite.classList.add('active');
      
      // Add heart animation
      const heart = document.createElement('div');
      heart.classList.add('floating-heart');
      heart.innerHTML = '<i class="fas fa-heart"></i>';
      lightbox.appendChild(heart);
      
      setTimeout(() => {
          heart.remove();
      }, 1000);
  }
  
  // Save to localStorage
  localStorage.setItem('favorites', JSON.stringify(favorites));
  
  // Update gallery item if it's visible
  const galleryItem = document.querySelector(`.item[data-id="${imageId}"]`);
  if (galleryItem) {
      const favBtn = galleryItem.querySelector('.favorite-btn');
      if (isFavorite) {
          favBtn.classList.remove('active');
          favBtn.innerHTML = '<i class="far fa-heart"></i> Add to Favorites';
      } else {
          favBtn.classList.add('active');
          favBtn.innerHTML = '<i class="fas fa-heart"></i> Favorited';
      }
  }
}

// Toggle favorite by ID (used in gallery)
function toggleFavoriteById(imageId, button) {
  const isFavorite = favorites.includes(imageId);
  
  if (isFavorite) {
      favorites = favorites.filter(id => id !== imageId);
      button.innerHTML = '<i class="far fa-heart"></i> Add to Favorites';
      button.classList.remove('active');
  } else {
      favorites.push(imageId);
      button.innerHTML = '<i class="fas fa-heart"></i> Favorited';
      button.classList.add('active');
      
      // Add heart animation
      button.classList.add('pulse');
      setTimeout(() => {
          button.classList.remove('pulse');
      }, 500);
  }
  
  // Save to localStorage
  localStorage.setItem('favorites', JSON.stringify(favorites));
  
  // Update lightbox if the same image is open
  if (lightbox.style.display === 'flex' && filteredImages[currentImageIndex].id === imageId) {
      updateLightboxFavorite(imageId);
  }
}

// Update lightbox favorite button
function updateLightboxFavorite(imageId) {
  const isFavorite = favorites.includes(imageId);
  
  if (isFavorite) {
      lightboxFavorite.innerHTML = '<i class="fas fa-heart"></i>';
      lightboxFavorite.classList.add('active');
  } else {
      lightboxFavorite.innerHTML = '<i class="far fa-heart"></i>';
      lightboxFavorite.classList.remove('active');
  }
}

// Check scroll position for back to top button
function checkScrollPosition() {
  if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('visible');
  } else {
      backToTopBtn.classList.remove('visible');
  }
}

// Add CSS for missing elements
document.head.insertAdjacentHTML('beforeend', `
<style>
.featured-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: var(--accent-color);
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 5px;
  z-index: 2;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.view-btn, .favorite-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.view-btn {
  background-color: var(--primary-color);
  color: white;
}

.favorite-btn {
  background-color: white;
  color: var(--dark-color);
}

.favorite-btn.active {
  background-color: #e74c3c;
  color: white;
}

.favorite-btn:hover {
  transform: scale(1.05);
}

.view-btn:hover {
  background-color: var(--secondary-color);
  transform: scale(1.05);
}

.country {
  font-size: 0.85rem;
  margin-bottom: 8px;
  opacity: 0.8;
}

.floating-heart {
  position: absolute;
  top: 50%;
  left: 50%;
  color: #e74c3c;
  font-size: 4rem;
  animation: floatHeart 1s forwards;
  pointer-events: none;
}

@keyframes floatHeart {
  0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 1;
  }
  50% {
      transform: translate(-50%, -70%) scale(1.2);
      opacity: 0.8;
  }
  100% {
      transform: translate(-50%, -100%) scale(1);
      opacity: 0;
  }
}

.bounce {
  animation: buttonBounce 0.3s;
}

@keyframes buttonBounce {
  0%, 100% {
      transform: translateX(0);
  }
  50% {
      transform: translateX(5px);
  }
}

.pulse {
  animation: buttonPulse 0.5s;
}

@keyframes buttonPulse {
  0% {
      transform: scale(1);
  }
  50% {
      transform: scale(1.2);
  }
  100% {
      transform: scale(1);
  }
}

.page-ellipsis {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
}
</style>
`);