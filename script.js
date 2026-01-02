// Mobile nav
    document.getElementById('nav-toggle').addEventListener('click', ()=>{
      const mobile = document.getElementById('nav-menu-mobile');
      const shown = mobile.style.display === 'block';
      mobile.style.display = shown ? 'none' : 'block';
    });

    // Scroll reveal
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('section, .card, .experience-card, .sample-item').forEach(el => observer.observe(el));

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click', function(e){
        const target = document.querySelector(this.getAttribute('href'));
        if(target){
          e.preventDefault();
          target.scrollIntoView({ behavior:'smooth' });
          const mobile = document.getElementById('nav-menu-mobile');
          if(mobile.style.display === 'block') mobile.style.display = 'none';
        }
      });
    });

    // Auto-carousel
    document.querySelectorAll('.sample-item').forEach(item => {
      const inner = item.querySelector('.sample-carousel-inner');
      const dots = item.querySelectorAll('.carousel-dot');
      
      if(!inner || dots.length <= 1) return;
      
      let currentIndex = 0;
      const totalSlides = dots.length;
      
      function goToSlide(index){
        currentIndex = index;
        inner.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
      }
      
      let autoPlay = setInterval(() => goToSlide((currentIndex + 1) % totalSlides), 3000);
      
      item.addEventListener('mouseenter', () => clearInterval(autoPlay));
      item.addEventListener('mouseleave', () => {
        autoPlay = setInterval(() => goToSlide((currentIndex + 1) % totalSlides), 3000);
      });
      
      dots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          goToSlide(index);
        });
      });
    });

    // Lightbox
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    const counter = document.getElementById('lightbox-counter');
    const thumbnailStrip = document.getElementById('lightbox-thumbnails');
    
    let currentImages = [];
    let currentIndex = 0;

    function showImage(index){
      if(index < 0) index = currentImages.length - 1;
      if(index >= currentImages.length) index = 0;
      currentIndex = index;
      
      img.src = currentImages[currentIndex];
      
      if(currentImages.length > 1){
        counter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
        counter.style.display = 'block';
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
        
        thumbnailStrip.querySelectorAll('.lightbox-thumbnail').forEach((thumb, i) => {
          thumb.classList.toggle('active', i === currentIndex);
        });
      } else {
        counter.style.display = 'none';
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
      }
    }

    function openLightbox(images, startIndex = 0){
      currentImages = images;
      
      if(images.length > 1){
        thumbnailStrip.innerHTML = '';
        thumbnailStrip.style.display = 'flex';
        images.forEach((src, index) => {
          const thumb = document.createElement('img');
          thumb.src = src;
          thumb.className = 'lightbox-thumbnail';
          thumb.addEventListener('click', () => showImage(index));
          thumbnailStrip.appendChild(thumb);
        });
      } else {
        thumbnailStrip.style.display = 'none';
      }
      
      showImage(startIndex);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox(){
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Experience images (single image)
    document.querySelectorAll('.experience-image-wrapper').forEach(wrapper => {
      wrapper.addEventListener('click', () => {
        const imgSrc = wrapper.getAttribute('data-single-image');
        if(imgSrc) openLightbox([imgSrc]);
      });
    });

    // Project carousels (multiple images)
    document.querySelectorAll('.sample-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if(e.target.classList.contains('carousel-dot')) return;
        
        const imagesData = item.getAttribute('data-images');
        if(imagesData){
          const images = JSON.parse(imagesData);
          const currentSlide = Array.from(item.querySelectorAll('.carousel-dot')).findIndex(dot => dot.classList.contains('active'));
          openLightbox(images, currentSlide || 0);
        }
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
    nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
    
    lightbox.addEventListener('click', e => { 
      if(e.target === lightbox) closeLightbox(); 
    });
    
    document.addEventListener('keydown', e => { 
      if(!lightbox.classList.contains('active')) return;
      if(e.key === 'Escape') closeLightbox();
      if(e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if(e.key === 'ArrowRight') showImage(currentIndex + 1);

    });

const dropdownToggle = document.getElementById('dropdown-toggle');
const dropdownContent = document.getElementById('dropdown-content');
const selectedText = document.getElementById('selected-text');
const doneButton = document.getElementById('done-button');
const selectionSummary = document.getElementById('selection-summary');
const summaryText = document.getElementById('summary-text');

const allPagesCheckbox = document.getElementById('page-all');
const pageCheckboxes = document.querySelectorAll('.page-checkbox:not(#page-all)');

// Toggle dropdown
dropdownToggle.addEventListener('click', () => {
  dropdownToggle.classList.toggle('active');
  dropdownContent.classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.page-selector-card')) {
    dropdownToggle.classList.remove('active');
    dropdownContent.classList.remove('active');
  }
});

// Update button color based on selections
function updateButtonColor() {
  const anyChecked = Array.from(pageCheckboxes).some(cb => cb.checked) || allPagesCheckbox.checked;
  
  if (anyChecked) {
    doneButton.classList.add('has-selection');
  } else {
    doneButton.classList.remove('has-selection');
  }
}

// Update summary text
function updateSummary() {
  const checkedCount = Array.from(pageCheckboxes).filter(cb => cb.checked).length;
  const allChecked = allPagesCheckbox.checked;
  
  if (allChecked) {
    selectedText.textContent = 'All pages';
    selectionSummary.style.display = 'block';
    summaryText.textContent = 'All pages selected';
  } else if (checkedCount > 0) {
    selectedText.textContent = `${checkedCount} page${checkedCount > 1 ? 's' : ''} selected`;
    selectionSummary.style.display = 'block';
    summaryText.textContent = `${checkedCount} page${checkedCount > 1 ? 's' : ''} selected`;
  } else {
    selectedText.textContent = 'Select pages';
    selectionSummary.style.display = 'none';
  }
  
  updateButtonColor();
}

// Handle "All pages" checkbox
allPagesCheckbox.addEventListener('change', (e) => {
  if (e.target.checked) {
    pageCheckboxes.forEach(cb => cb.checked = false);
  }
  updateSummary();
});

// Handle individual page checkboxes
pageCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', (e) => {
    if (e.target.checked) {
      allPagesCheckbox.checked = false;
    }
    updateSummary();
  });
});

// Handle clicking on list items (not just checkboxes)
document.querySelectorAll('.page-item').forEach(item => {
  item.addEventListener('click', (e) => {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'LABEL') {
      const checkbox = item.querySelector('.page-checkbox');
      checkbox.checked = !checkbox.checked;
      checkbox.dispatchEvent(new Event('change'));
    }
  });
});

// Done button action
doneButton.addEventListener('click', () => {
  const selected = [];
  
  if (allPagesCheckbox.checked) {
    selected.push('All pages');
  } else {
    pageCheckboxes.forEach((cb, index) => {
      if (cb.checked) {
        selected.push(`Page ${index + 1}`);
      }
    });
  }
  
  if (selected.length > 0) {
    alert(`Selected: ${selected.join(', ')}`);
    // You can add your custom logic here
    // For example: navigate to another page, save selections, etc.
  } else {
    alert('Please select at least one page');
  }
});

// Initialize
updateSummary();

// Mobile nav (reuse from main script)
document.getElementById('nav-toggle').addEventListener('click', ()=>{
  const mobile = document.getElementById('nav-menu-mobile');
  const shown = mobile.style.display === 'block';
  mobile.style.display = shown ? 'none' : 'block';
});
