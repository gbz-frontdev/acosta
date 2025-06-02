document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // --- MENU MÓVIL ---
    const mobileMenuToggle = document.getElementById('mobileMenuToggleButton');
    const mainNav = document.getElementById('mainNavMenu');

    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('open'); 
            mobileMenuToggle.setAttribute('aria-expanded', isOpen);
            const icon = mobileMenuToggle.querySelector('i');
            icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
            document.body.classList.toggle('no-scroll', isOpen); // Prevenir scroll si el menú está abierto
        });

        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('open')) {
                    mainNav.classList.remove('open');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
                    document.body.classList.remove('no-scroll');
                }
            });
        });
    }

    // --- PANEL DE COTIZACIÓN LATERAL ---
    const openQuoteBtn = document.getElementById('openQuoteFormBtn');
    const closeQuoteBtn = document.getElementById('closeQuotePanelBtn');
    const quotePanel = document.getElementById('quoteFormPanel');
    const overlayBackdrop = document.getElementById('overlayBackdrop');
    const quoteForm = document.getElementById('quoteRequestForm'); 
    const quoteFormCP = document.getElementById('quoteRequestFormContactPage'); 
    const quoteFormGP = document.getElementById('quoteRequestFormGalleryPage'); 

    function openQuotePanel() {
        if (quotePanel) quotePanel.classList.add('open');
        if (overlayBackdrop) overlayBackdrop.classList.add('active');
        document.body.classList.add('no-scroll'); 
    }
    function closeQuotePanel() {
        if (quotePanel) quotePanel.classList.remove('open');
        if (overlayBackdrop) overlayBackdrop.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }

    if (openQuoteBtn) {
        openQuoteBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            openQuotePanel();
        });
    }
    if (closeQuoteBtn) {
        closeQuoteBtn.addEventListener('click', closeQuotePanel);
    }
    if (overlayBackdrop) {
        overlayBackdrop.addEventListener('click', closeQuotePanel); 
    }

    function handleQuoteFormSubmit(formElement) {
        if (formElement) {
            formElement.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(formElement);
                let message = "Solicitud de cotización:\n";
                for (let [key, value] of formData.entries()) {
                    message += `${key.replace('CP','').replace('GP','')}: ${value}\n`; 
                }
                console.log(message); 
                alert('Formulario enviado (simulación). ¡Gracias por tu solicitud!');
                formElement.reset(); 
                closeQuotePanel(); 
            });
        }
    }
    handleQuoteFormSubmit(quoteForm);
    handleQuoteFormSubmit(quoteFormCP);
    handleQuoteFormSubmit(quoteFormGP);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && quotePanel && quotePanel.classList.contains('open')) {
            closeQuotePanel();
        }
    });

    // --- HERO SLIDER ---
    const slides = document.querySelectorAll('.slider-main-content .slide');
    const sliderNavContainer = document.querySelector('.slider-nav'); 
    const sliderBackgroundContainer = document.querySelector('.slider-background-container');
    const prevButton = document.querySelector('.slider-arrow.prev');
    const nextButton = document.querySelector('.slider-arrow.next');
    let currentSlide = 0;
    let autoPlayInterval;
    const slideImages = [
        'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80', 
        'https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
        'https://images.unsplash.com/photo-1582468114225-3c9070e9e428?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    ];

    if (slides.length > 0 && sliderBackgroundContainer && sliderNavContainer) { 
        slideImages.forEach((src) => {
            const bgImageDiv = document.createElement('div');
            bgImageDiv.classList.add('bg-image');
            bgImageDiv.style.backgroundImage = `url(${src})`;
            sliderBackgroundContainer.appendChild(bgImageDiv);
        });
        const bgImages = document.querySelectorAll('.slider-background-container .bg-image');

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('nav-dot');
            dot.setAttribute('aria-label', `Ir al slide ${index + 1}`);
            dot.addEventListener('click', () => { goToSlide(index); resetAutoPlay(); });
            sliderNavContainer.appendChild(dot);
        });
        const navDots = document.querySelectorAll('.slider-nav .nav-dot');

        function animateSlideContent(slideElement, show) {
            const title = slideElement.querySelector('.slide-main-title');
            const tagline = slideElement.querySelector('.tagline');
            const elementsToAnimate = [];
            if (title) elementsToAnimate.push(title);
            if (tagline) elementsToAnimate.push(tagline);
            if (elementsToAnimate.length === 0) return;

            if (show) {
                slideElement.style.visibility = 'visible';
                slideElement.style.opacity = '1';
                gsap.fromTo(elementsToAnimate, 
                    { opacity: 0, y: 30 }, 
                    { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
                );
            } else {
                gsap.to(elementsToAnimate, { 
                    opacity: 0, y: 30, duration: 0.5, ease: 'power3.in', 
                    onComplete: () => { 
                        if (!slideElement.classList.contains('active')) { 
                            slideElement.style.visibility = 'hidden'; 
                            slideElement.style.opacity = '0'; 
                        } 
                    } 
                });
            }
        }

        function goToSlide(slideIndex) {
            if (slideIndex === currentSlide && slides[currentSlide] && slides[currentSlide].classList.contains('active')) { 
                animateSlideContent(slides[currentSlide], true);
                return; 
            }
            if(slides[currentSlide]) animateSlideContent(slides[currentSlide], false);
            
            setTimeout(() => {
                if(slides[currentSlide]) slides[currentSlide].classList.remove('active');
                if(bgImages.length > currentSlide && bgImages[currentSlide]) bgImages[currentSlide].classList.remove('active');
                if(navDots.length > currentSlide && navDots[currentSlide]) navDots[currentSlide].classList.remove('active');
                
                currentSlide = (slideIndex + slides.length) % slides.length;
                
                if(slides[currentSlide]) slides[currentSlide].classList.add('active');
                if(bgImages.length > currentSlide && bgImages[currentSlide]) bgImages[currentSlide].classList.add('active');
                if(navDots.length > currentSlide && navDots[currentSlide]) navDots[currentSlide].classList.add('active');
                animateSlideContent(slides[currentSlide], true);
            }, 500);
        }

        function nextSlideFn() { goToSlide(currentSlide + 1); } 
        function prevSlideFn() { goToSlide(currentSlide - 1); } 

        if (nextButton) nextButton.addEventListener('click', () => { nextSlideFn(); resetAutoPlay(); });
        if (prevButton) prevButton.addEventListener('click', () => { prevSlideFn(); resetAutoPlay(); });

        function startAutoPlay() { 
            clearInterval(autoPlayInterval); 
            autoPlayInterval = setInterval(nextSlideFn, 7000); 
        }
        function resetAutoPlay() { 
            clearInterval(autoPlayInterval); 
            startAutoPlay(); 
        }

        function initializeSlider() {
            if (!slides.length || !bgImages.length || !navDots.length) return;
            if(slides[0]) slides[0].classList.add('active');
            if(bgImages[0]) bgImages[0].classList.add('active');
            if(navDots[0]) navDots[0].classList.add('active');
            animateSlideContent(slides[0], true);
            startAutoPlay();
        }
        initializeSlider();

        const heroSliderElement = document.querySelector('.hero-slider'); 
        if (heroSliderElement) {
            heroSliderElement.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
            heroSliderElement.addEventListener('mouseleave', startAutoPlay);
        }
    }

    // --- ANIMACIÓN HEADER ---
    gsap.from('.site-header', { y: -100, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.3 });

    // --- ANIMACIONES SECCIÓN "ACERCA DE NOSOTROS" ---
    const aboutSection = document.querySelector('.about-us-section');
    if (aboutSection) {
        gsap.from(aboutSection.querySelector('.about-text-column'), { opacity: 0, x: -80, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: aboutSection, start: "top 70%", toggleActions: "play none none none" } });
        gsap.from(aboutSection.querySelector('.about-image-column'), { opacity: 0, x: 80, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: aboutSection, start: "top 70%", toggleActions: "play none none none" } });
        gsap.from(aboutSection.querySelectorAll('.about-text-column .eyebrow-text, .about-text-column h2, .about-text-column p, .about-text-column .benefits-list li'), { opacity: 0, y: 30, duration: 0.6, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.about-text-column', start: "top 60%", toggleActions: "play none none none" } });
        gsap.from(aboutSection.querySelectorAll('.stats-overlay .stat-item'), { opacity: 0, y: 20, duration: 0.5, stagger: 0.15, ease: 'circ.out', scrollTrigger: { trigger: '.stats-overlay', start: "top 90%", toggleActions: "play none none none" } });
    }

    // --- FUNCIONALIDAD COMPARADOR DE IMÁGENES "ANTES Y DESPUÉS" ---
    function initImageComparison(comparisonElements) {
        comparisonElements.forEach(comp => {
            const sliderHandle = comp.querySelector('.comparison-slider'); 
            const afterImageContainer = comp.querySelector('.img-comp-after');
            let isDragging = false;

            function moveSliderLogic(event) { 
                if (!isDragging) return;
                const rect = comp.getBoundingClientRect();
                let x = (event.clientX || event.touches[0].clientX) - rect.left;
                x = Math.max(0, Math.min(x, rect.width));
                const percentage = (x / rect.width) * 100;
                if (sliderHandle) sliderHandle.style.left = `${percentage}%`;
                if (afterImageContainer) afterImageContainer.style.width = `${percentage}%`;
            }
            function startDrag(event) { 
                isDragging = true; 
                event.preventDefault(); 
                document.addEventListener('mousemove', moveSliderLogic); 
                document.addEventListener('touchmove', moveSliderLogic, { passive: false }); 
                document.addEventListener('mouseup', endDrag); 
                document.addEventListener('touchend', endDrag); 
            }
            function endDrag() { 
                isDragging = false; 
                document.removeEventListener('mousemove', moveSliderLogic); 
                document.removeEventListener('touchmove', moveSliderLogic); 
                document.removeEventListener('mouseup', endDrag); 
                document.removeEventListener('touchend', endDrag); 
            }
            if (sliderHandle) {
                sliderHandle.addEventListener('mousedown', startDrag);
                sliderHandle.addEventListener('touchstart', startDrag, { passive: false });
                const initialPercentage = 50;
                sliderHandle.style.left = `${initialPercentage}%`;
                if(afterImageContainer) afterImageContainer.style.width = `${initialPercentage}%`;
            }
        });
    }
    const comparisonComponents = document.querySelectorAll('.image-comparison');
    if (comparisonComponents.length > 0) { initImageComparison(comparisonComponents); }

    // --- ANIMACIONES SECCIÓN "ANTES Y DESPUÉS" ---
    const beforeAfterSection = document.querySelector('.before-after-section');
    if (beforeAfterSection) {
        gsap.from(beforeAfterSection.querySelectorAll('.eyebrow-text, .section-title, .section-description'), { opacity: 0, y: 40, duration: 0.8, stagger: 0.2, ease: 'power3.out', scrollTrigger: { trigger: beforeAfterSection, start: "top 75%", toggleActions: "play none none none" } });
        gsap.from(beforeAfterSection.querySelectorAll('.image-comparison'), { opacity: 0, y: 50, scale: 0.95, duration: 0.7, stagger: 0.25, ease: 'back.out(1.4)', scrollTrigger: { trigger: '.comparison-gallery-grid', start: "top 70%", toggleActions: "play none none none" } });
        gsap.from(beforeAfterSection.querySelector('.gallery-cta-button'), { opacity: 0, y: 30, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: '.gallery-cta-container', start: "top 85%", toggleActions: "play none none none" } });
    }
    
    // --- FILTRADO DE GALERÍA DE PROYECTOS ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const filterValue = button.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const cardCategories = card.getAttribute('data-category').toLowerCase();
                    if (filterValue === 'all' || cardCategories.includes(filterValue.toLowerCase())) {
                        gsap.to(card, { opacity: 1, scale: 1, duration: 0.4, display: 'flex', ease: 'power2.out' });
                    } else {
                        gsap.to(card, { opacity: 0, scale: 0.9, duration: 0.3, display: 'none', ease: 'power2.in' });
                    }
                });
            });
        });
    }

    // --- ANIMACIONES SCROLLTRIGGER PARA PÁGINA DE GALERÍA (si estamos en ella) ---
    const galleryPageMain = document.querySelector('.gallery-page-main');
    if (galleryPageMain) { 
        gsap.from(galleryPageMain.querySelectorAll('.gallery-hero-banner .eyebrow-text, .gallery-hero-banner h1'), {
            opacity: 0, y: 30, duration: 0.8, stagger: 0.2, ease: 'power3.out', delay: 0.3
        });
        const projectsSectionGallery = galleryPageMain.querySelector('.projects-section'); // Selector específico para la galería
        if (projectsSectionGallery) {
            gsap.from(projectsSectionGallery.querySelector('.filter-buttons'), {
                opacity: 0, y: 30, duration: 0.7, ease: 'power3.out',
                scrollTrigger: { trigger: projectsSectionGallery, start: "top 80%", toggleActions: "play none none none" }
            });
        }
    }

    // --- ANIMACIONES SECCIÓN "TESTIMONIOS" ---
    const testimonialsSection = document.querySelector('.testimonials-section');
    if (testimonialsSection) {
        gsap.from(testimonialsSection.querySelectorAll('.eyebrow-text, .section-title, .section-description'), { opacity: 0, y: 40, duration: 0.8, stagger: 0.2, ease: 'power3.out', scrollTrigger: { trigger: testimonialsSection, start: "top 75%", toggleActions: "play none none none" } });
        gsap.from(testimonialsSection.querySelectorAll('.testimonial-card'), { opacity: 0, y: 50, scale: 0.9, duration: 0.6, stagger: 0.2, ease: 'power2.out', scrollTrigger: { trigger: '.testimonials-grid', start: "top 80%", toggleActions: "play none none none" } });
    }

    // --- ANIMACIÓN SECCIÓN "SERVICIOS" ---
    const servicesSection = document.querySelector('.services-section');
    if (servicesSection) {
        gsap.fromTo(servicesSection, { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: servicesSection, start: "top 80%", toggleActions: "play none none none" } });
        gsap.from(servicesSection.querySelectorAll("h2, p, ul li"), { opacity: 0, y: 50, duration: 0.8, stagger: 0.2, ease: 'power3.out', scrollTrigger: { trigger: servicesSection, start: "top 70%", toggleActions: "play none none none" } });
    }

    // --- FOOTER AÑO ACTUAL (Generalizado para todas las páginas) ---
    function updateCopyrightYear(spanId) {
        const yearSpan = document.getElementById(spanId);
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    }
    updateCopyrightYear('currentYear'); // Para index.html (si usa este ID)
    updateCopyrightYear('currentYearContactPage'); // Para contact.html
    updateCopyrightYear('currentYearGalleryPage'); // Para gallery.html

});