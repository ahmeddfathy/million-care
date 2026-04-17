/* ============================================
   MILLION CARE â€” Landing Page JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ===== Initialize AOS =====
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 80,
        disable: 'mobile' // Disable on mobile for performance
    });

    // ===== Preloader =====
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('hidden');
        });
    }


    // ===== Navbar Scroll Effect =====
    const navbar = document.getElementById('mainNavbar');
    const stickyCTA = document.getElementById('stickyCTA');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        // Navbar background
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Sticky CTA visibility (show after hero section)
        if (stickyCTA) {
            if (scrollY > window.innerHeight * 0.7) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        }


        lastScroll = scrollY;
    }, { passive: true });

    // ===== Smooth Scroll for Anchor Links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                // Close mobile nav
                const navCollapse = document.getElementById('navbarNav');
                if (navCollapse && navCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
                    if (bsCollapse) bsCollapse.hide();
                }

                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===== Counter Animation =====
    const counters = document.querySelectorAll('.counter-number');
    let countersAnimated = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    function animateCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            requestAnimationFrame(updateCounter);
        });
    }

    // ===== Ingredient Bar Animation =====
    const ingredientBars = document.querySelectorAll('.ingredient-bar-fill, .ing-eff-fill');
    
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = `${width}%`;
                barObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    ingredientBars.forEach(bar => barObserver.observe(bar));

    // ===== Booking Form Handling =====
    const bookingForm = document.getElementById('bookingForm');
    const successMessage = document.getElementById('successMessage');

    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Reset validation
            this.querySelectorAll('.form-control, .form-select').forEach(field => {
                field.classList.remove('is-invalid');
            });

            // Validate
            const name = document.getElementById('customerName');
            const phone = document.getElementById('customerPhone');
            const gov = document.getElementById('customerGov');
            let isValid = true;

            if (!name.value.trim()) {
                name.classList.add('is-invalid');
                isValid = false;
            }

            const phoneRegex = /^01[0-9]{9}$/;
            if (!phoneRegex.test(phone.value.trim())) {
                phone.classList.add('is-invalid');
                isValid = false;
            }

            if (!gov.value) {
                gov.classList.add('is-invalid');
                isValid = false;
            }

            if (isValid) {
                // Simulate form submission
                const submitBtn = document.getElementById('submitBooking');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Ø¬Ø§Ø±ÙŠ Ø§Ù„Ø¥Ø±Ø³Ø§Ù„...';

                setTimeout(() => {
                    bookingForm.classList.add('d-none');
                    successMessage.classList.remove('d-none');
                    
                    // Log form data (for actual integration)
                    console.log('Form submitted:', {
                        name: name.value,
                        phone: phone.value,
                        governorate: gov.value
                    });
                }, 1500);
            }
        });

        // Real-time validation feedback
        bookingForm.querySelectorAll('.form-control, .form-select').forEach(field => {
            field.addEventListener('input', function () {
                this.classList.remove('is-invalid');
            });
        });
    }

    // ===== Video Placeholder Click =====
    document.querySelectorAll('.video-play-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Placeholder: could open a video modal
            alert('Ø³ÙŠØªÙ… ÙØªØ­ Ø§Ù„ÙÙŠØ¯ÙŠÙˆ Ù‚Ø±ÙŠØ¨Ø§Ù‹! ðŸŽ¬');
        });
    });

    // ===== Navbar Active Link Tracking =====
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    }, { passive: true });

});


// ===== Reviews Multi-Image Slider =====

const TOTAL_REVIEW_IMAGES = 37;
let reviewScrollPos = 0;
let currentLightboxIndex = 0;
let allReviewSrcs = [];
let autoPlayTimer = null; // unused, kept for safety

// Build all review image sources
function getAllReviewSrcs() {
    const srcs = [
        'videos/product-videos/1.mp4',
        'videos/product-videos/2.mp4',
        'videos/product-videos/3.mp4',
        'videos/product-videos/4.mp4',
        'videos/product-videos/5.mp4',
        'videos/before-after/1.mp4',
        'videos/before-after/2.mp4',
        'videos/before-after/3.mp4',
        'videos/before-after/4.mp4',
        'videos/before-after/5.mp4',
        'images/before-after/1.jpeg',
        'images/before-after/2.jpeg',
        'images/before-after/3.jpeg',
        'images/before-after/4.jpeg',
        'images/reviews/660532483_1562167235908686_7774687373216051267_n.jpg',
        'images/reviews/662728270_1562167339242009_8031193344286365146_n.jpg',
        'images/reviews/667910614_1562167229242020_8713456088603599828_n.jpg'
    ];
    for (let i = 1; i <= 34; i++) {
        srcs.push(`images/reviews/review-${i}.jpeg`);
    }
    return srcs;
}
allReviewSrcs = getAllReviewSrcs();

// Get visible items count from CSS flex-basis
function getVisibleCount() {
    const item = document.querySelector('.review-slide-item');
    if (!item) return 3;
    const viewport = document.getElementById('reviewsViewport');
    if (!viewport) return 3;
    const itemWidth = item.offsetWidth;
    const gap = parseInt(getComputedStyle(document.getElementById('reviewsTrack')).gap) || 18;
    return Math.floor(viewport.offsetWidth / (itemWidth + gap));
}

// Get the scroll step (how many pixels to shift per click)
function getScrollStep() {
    const item = document.querySelector('.review-slide-item');
    const track = document.getElementById('reviewsTrack');
    if (!item || !track) return 300;
    const gap = parseInt(getComputedStyle(track).gap) || 18;
    return item.offsetWidth + gap;
}

// Get max scroll
function getMaxScroll() {
    const track = document.getElementById('reviewsTrack');
    const viewport = document.getElementById('reviewsViewport');
    if (!track || !viewport) return 0;
    return Math.max(0, track.scrollWidth - viewport.offsetWidth);
}

// Update track position
function updateSlider() {
    const track = document.getElementById('reviewsTrack');
    if (!track) return;
    
    const maxScroll = getMaxScroll();
    reviewScrollPos = Math.max(0, Math.min(reviewScrollPos, maxScroll));
    
    // RTL track: positive translateX to scroll forward (reveal left items)
    track.style.transform = `translateX(${reviewScrollPos}px)`;
    
    const prevBtn = document.getElementById('reviewsPrev');
    const nextBtn = document.getElementById('reviewsNext');
    if (prevBtn) {
        if (reviewScrollPos <= 0) prevBtn.classList.add('disabled');
        else prevBtn.classList.remove('disabled');
    }
    if (nextBtn) {
        if (reviewScrollPos >= maxScroll) nextBtn.classList.add('disabled');
        else nextBtn.classList.remove('disabled');
    }
}

// Slide by direction: 1 = show next items, -1 = show previous
function slideReview(direction) {
    const step = getScrollStep();
    reviewScrollPos += direction * step;
    
    const maxScroll = getMaxScroll();
    
    // Clamp - no wrapping, stop at edges
    if (reviewScrollPos > maxScroll) {
        reviewScrollPos = maxScroll;
    } else if (reviewScrollPos < 0) {
        reviewScrollPos = 0;
    }
    
    updateSlider();
}



// Touch/Swipe + Mouse Drag
function initSliderTouch() {
    const viewport = document.getElementById('reviewsViewport');
    if (!viewport) return;
    
    const track = document.getElementById('reviewsTrack');
    let startX = 0, isDragging = false, diffX = 0;
    
    // Touch events
    viewport.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        if (track) track.style.transition = 'none';
    }, { passive: true });
    
    viewport.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        diffX = e.touches[0].clientX - startX;
        if (track) {
            track.style.transform = `translateX(${reviewScrollPos - diffX}px)`;
        }
    }, { passive: true });
    
    viewport.addEventListener('touchend', () => {
        isDragging = false;
        if (track) track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        if (diffX < -50) {
            slideReview(-1);  // swiped left = go backward in RTL
        } else if (diffX > 50) {
            slideReview(1);   // swiped right = go forward in RTL
        } else {
            updateSlider();
        }
        diffX = 0;
    });
    
    // Mouse drag events
    let mouseStartX = 0, mouseActive = false, mouseDiff = 0;
    
    viewport.addEventListener('mousedown', (e) => {
        mouseStartX = e.clientX;
        mouseActive = true;
        if (track) track.style.transition = 'none';
        e.preventDefault();
    });
    
    viewport.addEventListener('mousemove', (e) => {
        if (!mouseActive) return;
        mouseDiff = e.clientX - mouseStartX;
        if (track) {
            track.style.transform = `translateX(${reviewScrollPos - mouseDiff}px)`;
        }
    });
    
    viewport.addEventListener('mouseup', () => {
        if (!mouseActive) return;
        mouseActive = false;
        if (track) track.style.transition = 'transform 0.45s ease-out';
        
        if (mouseDiff < -50) {
            slideReview(-1);  // dragged left = go backward in RTL
        } else if (mouseDiff > 50) {
            slideReview(1);   // dragged right = go forward in RTL
        } else {
            updateSlider();
        }
        mouseDiff = 0;
    });
    
    viewport.addEventListener('mouseleave', () => {
        if (mouseActive) {
            mouseActive = false;
            if (track) track.style.transition = 'transform 0.45s ease-out';
            updateSlider();
        }
    });
}

// Pause on hover
function initHoverPause() {
    const section = document.querySelector('.reviews-slider-container');
    if (!section) return;
    
    section.addEventListener('mouseenter', () => {
        if (autoPlayTimer) { clearInterval(autoPlayTimer); autoPlayTimer = null; }
    });
    
    section.addEventListener('mouseleave', () => {
        startAutoPlay();
    });
}

// Init on load
document.addEventListener('DOMContentLoaded', () => {
    updateSlider();
    initSliderTouch();
    
    // Recalculate on resize
    window.addEventListener('resize', () => {
        const maxScroll = getMaxScroll();
        if (reviewScrollPos > maxScroll) reviewScrollPos = maxScroll;
        updateSlider();
        
        const maxBa = getMaxBaScroll();
        if (baScrollPos > maxBa) baScrollPos = maxBa;
        updateBaSlider();
        
        const maxPv = getMaxPvScroll();
        if (typeof getMaxPvScroll === 'function') {
            if (pvScrollPos > maxPv) pvScrollPos = maxPv;
            updatePvSlider();
        }
    });
});

// ===== Before & After Slider =====
let baScrollPos = 0;

function getBaScrollStep() {
    const item = document.querySelector('.ba-slide-item');
    const track = document.getElementById('baTrack');
    if (!item || !track) return 300;
    const gap = parseInt(getComputedStyle(track).gap) || 18;
    return item.offsetWidth + gap;
}

function getMaxBaScroll() {
    const track = document.getElementById('baTrack');
    const viewport = document.getElementById('baViewport');
    if (!track || !viewport) return 0;
    return Math.max(0, track.scrollWidth - viewport.offsetWidth);
}

function updateBaSlider() {
    const track = document.getElementById('baTrack');
    if (!track) return;
    const maxScroll = getMaxBaScroll();
    baScrollPos = Math.max(0, Math.min(baScrollPos, maxScroll));
    track.style.transform = `translateX(${baScrollPos}px)`;
    
    const prevBtn = document.getElementById('baPrev');
    const nextBtn = document.getElementById('baNext');
    if (prevBtn) {
        if (baScrollPos <= 0) prevBtn.classList.add('disabled');
        else prevBtn.classList.remove('disabled');
    }
    if (nextBtn) {
        if (baScrollPos >= maxScroll) nextBtn.classList.add('disabled');
        else nextBtn.classList.remove('disabled');
    }
}

function slideBa(direction) {
    const step = getBaScrollStep();
    baScrollPos += direction * step;
    const maxScroll = getMaxBaScroll();
    
    if (baScrollPos > maxScroll) baScrollPos = maxScroll;
    else if (baScrollPos < 0) baScrollPos = 0;
    
    updateBaSlider();
}

function initBaSliderTouch() {
    const viewport = document.getElementById('baViewport');
    if (!viewport) return;
    const track = document.getElementById('baTrack');
    
    let startX = 0, isDragging = false, diffX = 0;
    
    viewport.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        if (track) track.style.transition = 'none';
    }, { passive: true });
    
    viewport.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        diffX = e.touches[0].clientX - startX;
        if (track) track.style.transform = `translateX(${baScrollPos - diffX}px)`;
    }, { passive: true });
    
    viewport.addEventListener('touchend', () => {
        isDragging = false;
        if (track) track.style.transition = 'transform 0.45s ease-out';
        
        if (diffX < -50) slideBa(-1);
        else if (diffX > 50) slideBa(1);
        else updateBaSlider();
        diffX = 0;
    });
    
    let mouseStartX = 0, mouseActive = false, mouseDiff = 0;
    
    viewport.addEventListener('mousedown', (e) => {
        mouseStartX = e.clientX;
        mouseActive = true;
        if (track) track.style.transition = 'none';
        e.preventDefault();
    });
    
    viewport.addEventListener('mousemove', (e) => {
        if (!mouseActive) return;
        mouseDiff = e.clientX - mouseStartX;
        if (track) track.style.transform = `translateX(${baScrollPos - mouseDiff}px)`;
    });
    
    viewport.addEventListener('mouseup', () => {
        if (!mouseActive) return;
        mouseActive = false;
        if (track) track.style.transition = 'transform 0.45s ease-out';
        
        if (mouseDiff < -50) slideBa(-1);
        else if (mouseDiff > 50) slideBa(1);
        else updateBaSlider();
        mouseDiff = 0;
    });
    
    viewport.addEventListener('mouseleave', () => {
        if (mouseActive) {
            mouseActive = false;
            if (track) track.style.transition = 'transform 0.45s ease-out';
            updateBaSlider();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateBaSlider();
    initBaSliderTouch();
    
    if (typeof updatePvSlider === 'function') {
        updatePvSlider();
        initPvSliderTouch();
    }
});

// ===== Product Videos Slider =====
let pvScrollPos = 0;

function getPvScrollStep() {
    const track = document.getElementById('pvTrack');
    if (!track) return 300;
    const item = track.querySelector('.ba-slide-item');
    if (!item) return 300;
    return item.offsetWidth + parseFloat(window.getComputedStyle(item).marginRight || 0);
}

function getMaxPvScroll() {
    const track = document.getElementById('pvTrack');
    const viewport = document.getElementById('pvViewport');
    if (!track || !viewport) return 0;
    const maxScroll = track.scrollWidth - viewport.clientWidth;
    return maxScroll > 0 ? maxScroll : 0;
}

function updatePvSlider() {
    const track = document.getElementById('pvTrack');
    if (!track) return;
    
    const maxScroll = getMaxPvScroll();
    if (pvScrollPos < 0) pvScrollPos = 0;
    if (pvScrollPos > maxScroll) pvScrollPos = maxScroll;
    
    track.style.transform = `translateX(${pvScrollPos}px)`;
    
    const prevBtn = document.getElementById('pvPrev');
    const nextBtn = document.getElementById('pvNext');
    if (prevBtn) {
        if (pvScrollPos <= 0) prevBtn.classList.add('disabled');
        else prevBtn.classList.remove('disabled');
    }
    if (nextBtn) {
        if (pvScrollPos >= maxScroll) nextBtn.classList.add('disabled');
        else nextBtn.classList.remove('disabled');
    }
}

function slidePv(direction) {
    const step = getPvScrollStep();
    pvScrollPos += (direction * step);
    updatePvSlider();
}

function initPvSliderTouch() {
    const viewport = document.getElementById('pvViewport');
    const track = document.getElementById('pvTrack');
    if (!viewport || !track) return;
    
    let startX = 0, currentX = 0, isDragging = false, diffX = 0;
    
    viewport.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        if (track) track.style.transition = 'none';
    }, { passive: true });
    
    viewport.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        diffX = e.touches[0].clientX - startX;
        if (track) track.style.transform = `translateX(${pvScrollPos - diffX}px)`;
    }, { passive: true });
    
    viewport.addEventListener('touchend', () => {
        isDragging = false;
        if (track) track.style.transition = 'transform 0.45s ease-out';
        
        if (diffX < -50) slidePv(-1);
        else if (diffX > 50) slidePv(1);
        else updatePvSlider();
        diffX = 0;
    });
    
    let mouseStartX = 0, mouseActive = false, mouseDiff = 0;
    
    viewport.addEventListener('mousedown', (e) => {
        mouseStartX = e.clientX;
        mouseActive = true;
        if (track) track.style.transition = 'none';
        e.preventDefault();
    });
    
    viewport.addEventListener('mousemove', (e) => {
        if (!mouseActive) return;
        mouseDiff = e.clientX - mouseStartX;
        if (track) track.style.transform = `translateX(${pvScrollPos - mouseDiff}px)`;
    });
    
    viewport.addEventListener('mouseup', () => {
        if (!mouseActive) return;
        mouseActive = false;
        if (track) track.style.transition = 'transform 0.45s ease-out';
        
        if (mouseDiff < -50) slidePv(-1);
        else if (mouseDiff > 50) slidePv(1);
        else updatePvSlider();
        mouseDiff = 0;
    });
    
    viewport.addEventListener('mouseleave', () => {
        if (mouseActive) {
            mouseActive = false;
            if (track) track.style.transition = 'transform 0.45s ease-out';
            updatePvSlider();
        }
    });
}

// ===== Lightbox =====

function openReviewLightbox(src) {
    const lightbox = document.getElementById('reviewLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxVideo = document.getElementById('lightboxVideo');
    
    // Use includes instead of endsWith because browsers sometimes append #t=0.1 to video URLs
    const isVideo = src.includes('.mp4');
    
    // Reset opacities just in case
    lightboxImg.style.opacity = '1';
    lightboxImg.style.transform = 'scale(1)';
    if(lightboxVideo) {
        lightboxVideo.style.opacity = '1';
        lightboxVideo.style.transform = 'scale(1)';
    }

    if (isVideo) {
        lightboxImg.style.display = 'none';
        lightboxVideo.style.display = 'block';
        lightboxVideo.src = src;
        lightboxVideo.play();
    } else {
        if(lightboxVideo) {
            lightboxVideo.style.display = 'none';
            lightboxVideo.pause();
        }
        lightboxImg.style.display = 'block';
        lightboxImg.src = src;
    }
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Attempt to find full url or relative match
    currentLightboxIndex = allReviewSrcs.findIndex(item => src.includes(item));
    if (currentLightboxIndex === -1) currentLightboxIndex = 0;
}

function closeReviewLightbox(event) {
    if (event) {
        const target = event.target;
        if (target === document.getElementById('lightboxImg') || target === document.getElementById('lightboxVideo')) return;
        if (target.closest('.lightbox-nav')) return;
    }
    
    document.getElementById('reviewLightbox').classList.remove('active');
    document.body.style.overflow = '';
    
    const lightboxVideo = document.getElementById('lightboxVideo');
    if(lightboxVideo) lightboxVideo.pause();
}

function navigateLightbox(direction, event) {
    if (event) event.stopPropagation();
    
    currentLightboxIndex += direction;
    if (currentLightboxIndex >= allReviewSrcs.length) currentLightboxIndex = 0;
    if (currentLightboxIndex < 0) currentLightboxIndex = allReviewSrcs.length - 1;
    
    const img = document.getElementById('lightboxImg');
    const video = document.getElementById('lightboxVideo');
    const src = allReviewSrcs[currentLightboxIndex];
    const isVideo = src.includes('.mp4');
    
    if (img) { img.style.opacity = '0'; img.style.transform = 'scale(0.95)'; }
    if (video) { video.style.opacity = '0'; video.style.transform = 'scale(0.95)'; }
    
    setTimeout(() => {
        if (isVideo) {
            img.style.display = 'none';
            video.style.display = 'block';
            video.src = src;
            video.play();
            video.style.opacity = '1';
            video.style.transform = 'scale(1)';
        } else {
            video.style.display = 'none';
            video.pause();
            img.style.display = 'block';
            img.src = src;
            img.style.opacity = '1';
            img.style.transform = 'scale(1)';
        }
    }, 150);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('reviewLightbox');
    
    if (lightbox && lightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeReviewLightbox();
        else if (e.key === 'ArrowLeft') navigateLightbox(1);
        else if (e.key === 'ArrowRight') navigateLightbox(-1);
        return;
    }
    
    const slider = document.querySelector('.reviews-slider-container');
    if (slider) {
        const rect = slider.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            if (e.key === 'ArrowLeft') slideReview(1);
            else if (e.key === 'ArrowRight') slideReview(-1);
        }
    }
});

