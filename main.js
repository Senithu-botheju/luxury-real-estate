/* Zillopia Interactive Logic */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. Navigation Header Scroll Effect
    // ==========================================================================
    const header = document.getElementById('mainHeader');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once at load
    
    // ==========================================================================
    // 2. Mobile Menu Toggle
    // ==========================================================================
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // ==========================================================================
    // 3. Custom Cursor Follower
    // ==========================================================================
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    const ambientGlow = document.getElementById('ambientGlow');
    
    let mouseX = 0, mouseY = 0; // Target coordinates
    let dotX = 0, dotY = 0;     // Current dot coordinates
    let ringX = 0, ringY = 0;   // Current ring coordinates
    
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (!isTouchDevice && cursorDot && cursorRing) {
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Move ambient background glow immediately
            if (ambientGlow) {
                ambientGlow.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
            }
        });
        
        // Interpolate cursor positions for smooth, organic lag (follow physics)
        const updateCursor = () => {
            // Smooth interpolation (LERP)
            dotX += (mouseX - dotX) * 0.3;
            dotY += (mouseY - dotY) * 0.3;
            
            ringX += (mouseX - ringX) * 0.15; // Lower coefficient = more lag/smoothness
            ringY += (mouseY - ringY) * 0.15;
            
            cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
            cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
            
            requestAnimationFrame(updateCursor);
        };
        
        updateCursor();
        
        // Add active states when hovering over clickable items
        const hoverables = document.querySelectorAll('a, button, select, input, textarea, .filter-btn, .search-tab');
        
        hoverables.forEach(item => {
            item.addEventListener('mouseenter', () => {
                cursorRing.classList.add('cursor-active');
                cursorDot.classList.add('cursor-active');
            });
            item.addEventListener('mouseleave', () => {
                cursorRing.classList.remove('cursor-active');
                cursorDot.classList.remove('cursor-active');
            });
        });
    }

    // ==========================================================================
    // 4. Hero Section - Subtle Mouse Parallax (Dynamic Depth)
    // ==========================================================================
    const heroSection = document.getElementById('heroSection');
    const heroBgImage = document.getElementById('heroBgImage');
    
    if (heroSection && heroBgImage && !isTouchDevice) {
        heroSection.addEventListener('mousemove', (e) => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            // Calculate percentage displacement from center
            const moveX = (e.clientX - width / 2) / (width / 2);
            const moveY = (e.clientY - height / 2) / (height / 2);
            
            // Pan image in opposite direction (subtle 15px max offset)
            const panX = -moveX * 15;
            const panY = -moveY * 15;
            
            // Retain the base 1.03 scale to prevent border clipping
            heroBgImage.style.transform = `scale(1.05) translate3d(${panX}px, ${panY}px, 0)`;
        });
        
        heroSection.addEventListener('mouseleave', () => {
            // Smooth return to center
            heroBgImage.style.transform = 'scale(1.03) translate3d(0, 0, 0)';
            heroBgImage.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        });
        
        heroBgImage.addEventListener('transitionend', () => {
            heroBgImage.style.transition = 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)';
        });
    }

    // ==========================================================================
    // 5. Hero Video-Like Canvas Particle Embers (Slow Cinematic Drift)
    // ==========================================================================
    const canvas = document.getElementById('heroParticles');
    
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        const resizeCanvas = () => {
            canvas.width = heroSection.offsetWidth;
            canvas.height = heroSection.offsetHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Define Particle class
        class Particle {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = Math.random() * canvas.width;
                // Start mostly at the bottom or randomly scattered initially
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.8 + 0.5; // Very small for luxury delicacy
                this.speedY = -(Math.random() * 0.3 + 0.1); // Slow drift upward
                this.speedX = (Math.random() * 0.2 - 0.1); // Slight horizontal sway
                this.alpha = Math.random() * 0.4 + 0.1; // Low opacity
                this.fadeRate = Math.random() * 0.003 + 0.001;
                // Colors: Mix of warm gold and purple
                this.color = Math.random() > 0.5 ? '212, 175, 55' : '168, 85, 247'; 
            }
            
            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                this.alpha -= this.fadeRate;
                
                // Reset particle if it leaves the screen or fades completely
                if (this.y < 0 || this.alpha <= 0 || this.x < 0 || this.x > canvas.width) {
                    this.reset();
                    this.y = canvas.height + 10; // Start below screen
                    this.alpha = 0.5;
                }
            }
            
            draw() {
                ctx.save();
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
                // Add soft glow to gold particles
                if (this.color === '212, 175, 55') {
                    ctx.shadowBlur = 4;
                    ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
                }
                ctx.fill();
                ctx.restore();
            }
        }
        
        // Populate particles
        const particleCount = Math.min(60, Math.floor(window.innerWidth / 20)); // Scaled with width
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        // Loop
        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            
            requestAnimationFrame(animateParticles);
        };
        
        animateParticles();
    }

    // ==========================================================================
    // 6. Intersection Observer - Scroll Reveal Animations
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal-fade-up');
    
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Once animated, we don't need to keep observing it
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px' // Reveal slightly before entering viewport
        });
        
        revealElements.forEach(el => revealObserver.observe(el));
    }

    // ==========================================================================
    // 7. Property Gallery Filtering & Search Tab Actions
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const propertiesGrid = document.getElementById('propertiesGrid');
    const propertyCards = document.querySelectorAll('.property-card');
    
    // Filtering logic
    const applyFilter = (filterValue) => {
        if (!propertiesGrid) return;
        
        // Fade out grid
        propertiesGrid.style.opacity = '0';
        
        setTimeout(() => {
            propertyCards.forEach(card => {
                const type = card.getAttribute('data-type');
                const location = card.getAttribute('data-location');
                
                if (filterValue === 'all' || type === filterValue || location === filterValue) {
                    card.classList.remove('hide');
                } else {
                    card.classList.add('hide');
                }
            });
            
            // Fade grid back in
            propertiesGrid.style.opacity = '1';
        }, 300);
    };
    
    // Filter click listeners
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            applyFilter(filter);
        });
    });

    // Destination card deep links to showcase filters
    const cardLinks = document.querySelectorAll('.card-link');
    cardLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const destinationFilter = link.getAttribute('data-filter');
            
            // Find if there's a filter button matching (or just filter properties directly)
            // Let's first clear filter buttons active state since we are doing custom location filtering
            filterButtons.forEach(b => b.classList.remove('active'));
            
            applyFilter(destinationFilter);
        });
    });

    // Buy / Rent Tab Toggle on Hero Search Bar
    const tabBuy = document.getElementById('tabBuy');
    const tabRent = document.getElementById('tabRent');
    
    if (tabBuy && tabRent) {
        const toggleTab = (activeTab, inactiveTab) => {
            activeTab.classList.add('active');
            inactiveTab.classList.remove('active');
        };
        
        tabBuy.addEventListener('click', () => toggleTab(tabBuy, tabRent));
        tabRent.addEventListener('click', () => toggleTab(tabRent, tabBuy));
    }
    
    // Search form submission routing
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', () => {
            const locSelect = document.getElementById('searchLocation');
            const typeSelect = document.getElementById('searchType');
            
            const selectedLocation = locSelect.value;
            const selectedType = typeSelect.value;
            
            // Prioritize filtering by location if selected, otherwise type
            const targetFilter = selectedLocation || selectedType || 'all';
            
            // Set corresponding showcase filter active if it exists
            filterButtons.forEach(btn => {
                const btnFilter = btn.getAttribute('data-filter');
                if (btnFilter === targetFilter) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            applyFilter(targetFilter);
            
            // Scroll smoothly down to the showcase
            const targetSection = document.getElementById('showcase');
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ==========================================================================
    // 8. Magnetic Buttons (Luxury Interactive Micro-animation)
    // ==========================================================================
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    
    if (!isTouchDevice) {
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                // Cursor position relative to the button boundaries
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Pull button 12px max towards cursor
                btn.style.transform = `translate3d(${x * 0.35}px, ${y * 0.35}px, 0)`;
                
                // Pull inner elements slightly less for 3D parallax feel
                const text = btn.querySelector('span');
                const svg = btn.querySelector('svg');
                if (text) text.style.transform = `translate3d(${x * 0.12}px, ${y * 0.12}px, 0)`;
                if (svg) svg.style.transform = `translate3d(${x * 0.18}px, ${y * 0.18}px, 0)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                // Smooth spring return to baseline
                btn.style.transform = 'translate3d(0px, 0px, 0px)';
                btn.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                
                const text = btn.querySelector('span');
                const svg = btn.querySelector('svg');
                if (text) {
                    text.style.transform = 'translate3d(0,0,0)';
                    text.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                }
                if (svg) {
                    svg.style.transform = 'translate3d(0,0,0)';
                    svg.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                }
            });
            
            btn.addEventListener('mouseenter', () => {
                // Remove transitions to allow real-time magnetic follow
                btn.style.transition = 'none';
                const text = btn.querySelector('span');
                const svg = btn.querySelector('svg');
                if (text) text.style.transition = 'none';
                if (svg) svg.style.transition = 'none';
            });
        });
    }

    // ==========================================================================
    // 9. Back to Top Button
    // ==========================================================================
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================================================
    // 10. Private Concierge Form Submission simulation
    // ==========================================================================
    const conciergeForm = document.getElementById('conciergeForm');
    const formFeedback = document.getElementById('formFeedback');
    const formSubmitBtn = document.getElementById('formSubmitBtn');
    
    if (conciergeForm && formFeedback && formSubmitBtn) {
        conciergeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Visual feedback: loading state
            const originalBtnContent = formSubmitBtn.innerHTML;
            formSubmitBtn.disabled = true;
            formSubmitBtn.innerHTML = `
                <span>Securing Connection...</span>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" class="spin-icon">
                    <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
                </svg>
            `;
            formFeedback.className = 'form-feedback';
            formFeedback.innerText = '';
            
            // Add spinning styling programmatically if not in CSS
            const styleElement = document.createElement('style');
            styleElement.innerHTML = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .spin-icon {
                    animation: spin 1s linear infinite;
                }
            `;
            document.head.appendChild(styleElement);
            
            // Simulate luxury validation & transmission delay (1.5 seconds)
            setTimeout(() => {
                formSubmitBtn.disabled = false;
                formSubmitBtn.innerHTML = originalBtnContent;
                
                // Show luxury success response
                formFeedback.classList.add('success');
                formFeedback.innerText = 'Transmission Secured. A dedicated private wealth associate has been assigned and will contact you within the hour.';
                
                // Reset form inputs
                conciergeForm.reset();
                
                // Clear success message after 7 seconds
                setTimeout(() => {
                    formFeedback.innerText = '';
                    formFeedback.className = 'form-feedback';
                }, 7000);
                
            }, 1800);
        });
    }
});
